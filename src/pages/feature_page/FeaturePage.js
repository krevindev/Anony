import './FeaturePage.css';

// Firebase
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { firebaseApp, db } from "../../db/firebase";

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingPage from '../../components/loading_page/LoadingPage';

// Add Channel Functioin
async function addChannel(channelData) {
    try {
        const channelsRef = collection(db, 'anony-channels');
        const docRef = await addDoc(channelsRef, channelData);
        console.log('Channel added with ID:', docRef.id);
    } catch (error) {
        console.error('Error adding channel:', error);
    }
};

// Generate Channel Code Function
function generateRandomCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }
    return code;
}

/** Feature Page */
export default function FeaturePage({ type }) {

    const featureTitle = type === 'enter' ? 'CHANNEL CODE:' : 'CHANNEL NAME:';
    const featureBtnText = type === 'enter' ? 'ENTER' : 'CREATE';

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const inputRef = useRef(null);
    const errorText = useRef(null);

    const handleChannelAdd = async () => {
        const newChannelName = inputRef.current.value;
        const newChannelCode = generateRandomCode(6)

        if (newChannelName.length > 0) {
            setIsLoading(true);

            await addChannel({ chName: newChannelName, chCode: newChannelCode, chMessages: [] })
                .then(res => {
                    inputRef.current.value = '';
                    setIsLoading(false);
                    navigate('/channel/' + newChannelCode);
                })
                .catch(err => setIsLoading(false))
        }
    }

    const handleChannelEnter = (chCode) => {
        const channelUrl = "/channel/" + chCode;

        navigate(channelUrl);
    }

    const handleSubmit = () => {
        if (type == 'enter') {
            handleChannelEnter(inputRef.current.value)
        } else if (type == 'create') {
            handleChannelAdd()
        }
    }



    return (
        <div id="FeaturePage" className='anony-page'>

            <div id='feature-page-content-container'>
                <h1>{featureTitle}</h1>
                <input ref={inputRef} onKeyDown={e => {
                    if (e.key == 'Enter') handleSubmit();
                }}></input>

                <button onClick={handleSubmit}>{featureBtnText}</button>
            </div>

            <h5 ref={errorText} id='feature-error-text'></h5>

            {
                isLoading && <LoadingPage loadingText={
                    type === 'enter' ? 'Entering Channel...' : 'Creating Channel...'
                } />
            }

        </div>
    )
}