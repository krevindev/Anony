import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { collection, doc, getDoc, where, query, getDocs, updateDoc } from 'firebase/firestore';
import { firebaseApp, db } from '../../db/firebase';
import './Channel.css';

import sendBtn from '../../res/images/svg/send-btn.svg';
import copyIcon from '../../res/images/svg/copy-icon.svg';
import loadingSend from '../../res/gif/loading-send.gif';
import LoadingPage from '../../components/loading_page/LoadingPage';
import NotFound from '../not_found/NotFound';
import useWindowSize from '../../hooks/useWindowSize';

import moment from 'moment/moment';


const copyToClipboard = (chCode) => {
    const tempInput = document.createElement('input');
    tempInput.value = "https://anony-post.netlify.app/channel/" + chCode;
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

    const windowWidth = useWindowSize().width;
    const [isMobile, setIsMobile] = useState(windowWidth <= 400);

    // Function to add a message to the "chMessages" array property in a channel document
    const addMessageToChannel = async (chCode, message) => {

        setIsSending(true);

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


    // const getChannelByCode = async (chCode) => {
    //     try {
    //         // Find the channel document using the chCode
    //         const channelQuery = query(collection(db, 'anony-channels'), where('chCode', '==', chCode));
    //         const channelSnapshot = await getDocs(channelQuery);

    //         if (!channelSnapshot.empty) {
    //             // Assume there's only one channel document with the same chCode
    //             const channelDoc = channelSnapshot.docs[0];

    //             // Return the channel data
    //             return channelDoc.data();
    //         } else {
    //             console.error('Channel with the given chCode does not exist.');
    //             return null;
    //         }
    //     } catch (error) {
    //         console.error('Error fetching channel data:', error);
    //         return null;
    //     }
    // };

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

    const getChannelByCode = useCallback(async () => {
        // Your implementation for fetching channel data
        // Example: const res = await fetchChannelData(chCode);
        // return res;

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
    }, [chCode]);

    const isValidChatMessage = (inputValue) => {
        // Remove leading and trailing spaces and new lines
        const trimmedValue = inputValue.trim();

        // Check if the message contains actual text or is not empty
        if (trimmedValue.length === 0 || /^\s+$/.test(trimmedValue)) {
            // The message contains all spaces or all new lines
            return false;
        }

        // The message is valid
        return true;
    };


    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 400);
        };

        // Call handleResize initially to set the initial value
        handleResize();

        // Add event listener to track window resize and update isMobile state
        window.addEventListener('resize', handleResize);

        // Clean up the event listener on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {


        // // addMessageToChannel(chCode, 'test');
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

    }, [chCode, getChannelByCode, channelData])

    if (isPageLoading) {
        return <LoadingPage loadingText="Please wait..." />;
    }

    if (!channelData) {
        return <NotFound />;
    }

    return (
        <div id='Channel' className='anony-page'>
            <header id='channel-header-bar'>
                <div className='channel-header-part'>
                    <h3>{channelData.chName}</h3>
                    <h5>Code:  {channelData.chCode}</h5>
                </div>
                <div className='channel-header-part' >
                    <h5 onClick={() => copyToClipboard(chCode)}>Copy Link <img src={copyIcon} /></h5>
                </div>
            </header>
            <section id='channel-messages-container' >
                {channelData.chMessages.length > 0
                    ? channelData.chMessages.slice().reverse().map((msg, index) => <ChannelMessage key={index} message={msg.message} time={msg.timeSent} />)
                    : <h1>Start Posting</h1>
                }

            </section>
            <form id='channel-user-input-container'>
                <div className='ch-input-part'>
                    <textarea
                        ref={newMessageInputRef}
                        onKeyDown={(e) => {
                            const newMessage = newMessageInputRef.current.value
                            if (!isMobile) {
                                if (isValidChatMessage(newMessage)) {

                                    // Check if the key pressed is 'Enter' and the 'Shift' key is not pressed
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault(); // Prevent the default behavior (submitting the form or newline)
                                        addMessageToChannel(chCode, newMessage);
                                    }
                                }

                            }
                        }}
                        placeholder='Aa'
                    ></textarea>
                </div>
                <div className='ch-input-part'>
                    <img
                        src={isSending ? loadingSend : sendBtn}
                        onClick={() => {
                            const newMessage = newMessageInputRef.current.value
                            if (isValidChatMessage(newMessage)) {
                                addMessageToChannel(chCode, newMessageInputRef.current.value);
                                newMessageInputRef.current.value = ''; // Clear the input after sending the message
                            }

                        }}
                    />
                </div>
            </form>

        </div>
    )
}


// function ChannelMessage({ message, time }) {
//     return (
//         <div className='channel-message'>
//             <span className='channel-message-text'>
//                 {message}
//             </span>
//             <span className='channel-message-time-sent'>
//                 {time}
//             </span>
//         </div>
//     )
// }

function ChannelMessage({ message, time }) {
    return (
        <div className='channel-message'>
            <div className='channel-message-text'>
                <MessageBubble message={message} />
            </div>
            <span className='channel-message-time-sent'>
                {time}
            </span>
        </div>
    );
}

const MessageBubble = ({ message }) => {
    const lines = message.split('\n');
    return (
        <div className='message-bubble'>
            {lines.map((line, index) => (
                <p key={index}>{line || '\u00A0'}</p>
            ))}
        </div>
    );
};