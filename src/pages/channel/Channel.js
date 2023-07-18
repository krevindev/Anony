import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, doc, getDoc, where, query, getDocs, updateDoc } from 'firebase/firestore';
import { firebaseApp, db } from '../../db/firebase';
import './Channel.css';

import sendBtn from '../../res/images/svg/send-btn.svg';
import copyIcon from '../../res/images/svg/copy-icon.svg';
import loadingSend from '../../res/gif/loading-send.gif';
import LoadingPage from '../../components/loading_page/LoadingPage';
import NotFound from '../not_found/NotFound';

import moment from 'moment/moment';


const copyToClipboard = (chCode) => {
    const tempInput = document.createElement('input');
    tempInput.value = "https://anony-post.netlify.app/channel/"+chCode;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
};

export default function Channel() {

    const { chCode } = useParams();
    const [channelData, setChannelData] = useState(null);
    const newMessageInputRef = useRef(null);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isPageFound, setIsPageFound] = useState(true);
    const [isSending, setIsSending] = useState(false);

    // Function to add a message to the "chMessages" array property in a channel document
    const addMessageToChannel = async (chCode, message) => {

        setIsSending(true);

        newMessageInputRef.current.value = null;

        if (message === '') {
            return;
        }

        try {
            // Find the channel document using the chCode
            const channelQuery = query(collection(db, 'anony-channels'), where('chCode', '==', chCode));
            const channelSnapshot = await getDocs(channelQuery);
            if (!channelSnapshot.empty) {
                // Assume there's only one channel document with the same chCode
                const channelDoc = channelSnapshot.docs[0];

                // Check if the "chMessages" property exists
                const channelData = channelDoc.data();
                if (!channelData.chMessages) {
                    // If "chMessages" doesn't exist, create an empty array
                    channelData.chMessages = [];
                }


                const currentTime = moment().format('MMM D, YYYY h:mm A');

                // Append the new message to the "chMessages" array
                channelData.chMessages.push({ message: message, timeSent: currentTime });

                // Update the document with the new "chMessages" array
                await updateDoc(channelDoc.ref, { chMessages: channelData.chMessages }).then(res => newMessageInputRef.current.value = '');
                setIsSending(false);
            } else {
                console.error('Channel with the given chCode does not exist.');
                setIsSending(false);
            }
        } catch (error) {
            console.error('Error adding message to channel:', error);
            setIsSending(false);
        }
    };


    const getChannelByCode = async (chCode) => {
        try {
            // Find the channel document using the chCode
            const channelQuery = query(collection(db, 'anony-channels'), where('chCode', '==', chCode));
            const channelSnapshot = await getDocs(channelQuery);

            if (!channelSnapshot.empty) {
                // Assume there's only one channel document with the same chCode
                const channelDoc = channelSnapshot.docs[0];

                // Return the channel data
                return channelDoc.data();
            } else {
                console.error('Channel with the given chCode does not exist.');
                return null;
            }
        } catch (error) {
            console.error('Error fetching channel data:', error);
            return null;
        }
    };

    // Save Visited Channels to Cache
    const saveRecentChannels = (chName, chCode) => {
        const recentChannels = JSON.parse(localStorage.getItem('recentChannels')) || [];

        // Check if the channel with the same chCode already exists
        const existingChannel = recentChannels.find((channel) => channel.chCode === chCode);

        if (!existingChannel) {
            // If the channel doesn't exist, add it to the recentChannels array
            recentChannels.push({ chName: chName, chCode: chCode });
            localStorage.setItem('recentChannels', JSON.stringify(recentChannels));
        }
    };


    useEffect(() => {


        // addMessageToChannel(chCode, 'test');
        getChannelByCode(chCode)
            .then(res => {
                setChannelData(res);
                if (channelData) {
                    setIsPageLoading(false);
                    setIsPageFound(true);
                    saveRecentChannels(channelData.chName, channelData.chCode);
                } else {
                    setIsPageFound(false);
                    setIsPageLoading(false);
                }
            })
            .catch(err => setIsPageLoading(false))

    }, [channelData])

    if (isPageLoading) {
        return <LoadingPage loadingText="Please wait..." />;
    }

    if (!channelData) {
        return <NotFound />;
    }

    return (
        <div id='Channel' className='anony-page'>
            <div id='channel-header-bar'>
                <div className='channel-header-part'>
                    <h3>{channelData.chName}</h3>
                    <h5>Code:  {channelData.chCode}</h5>
                </div>
                <div className='channel-header-part' onClick={() => copyToClipboard(chCode)}>
                    <h5>Copy Link <img src={copyIcon} /></h5>
                </div>
            </div>
            <div id='channel-messages-container' >
                {channelData.chMessages.length > 0
                    ? channelData.chMessages.slice().reverse().map((msg, index) => <ChannelMessage key={index} message={msg.message} time={msg.timeSent} />)
                    : <h1>Start Posting</h1>
                }

            </div>
            <div id='channel-user-input-container'>
                <div className='ch-input-part'>
                    <textarea
                        ref={newMessageInputRef}
                        onKeyDown={(e) => {
                            if (e.key == 'Enter') {
                                addMessageToChannel(chCode, newMessageInputRef.current.value)
                            }
                        }
                        }
                        placeholder='Aa'
                    ></textarea>
                </div>
                <div className='ch-input-part'>
                    <img
                        src={isSending ? loadingSend : sendBtn}
                        onClick={() => addMessageToChannel(chCode, newMessageInputRef.current.value)} />
                </div>
            </div>
        </div>
    )
}


function ChannelMessage({ message, time }) {
    return (
        <div className='channel-message'>
            <span className='channel-message-text'>
                {message}
            </span>
            <span className='channel-message-time-sent'>
                {time}
            </span>
        </div>
    )
}