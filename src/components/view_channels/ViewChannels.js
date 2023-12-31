import './ViewChannels.css';

import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../db/firebase';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

async function getAllChannels() {
    try {
        const channelsRef = collection(db, 'anony-channels');
        const querySnapshot = await getDocs(channelsRef);

        const channelsData = [];
        querySnapshot.forEach((doc) => {
            channelsData.push({ id: doc.id, ...doc.data() });
        });

        return channelsData;
    } catch (error) {
        console.error('Error fetching channels:', error);
        return [];
    }
}

export default function ViewChannels() {

    const [allChannels, setAllChannels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        getAllChannels()
            .then(res => {
                setAllChannels(res);
                setIsLoading(false);
            })
            .catch(err => {
                setIsLoading(false);
            })
    }, [])

    return (
        <div id="ViewChannels" className='anony-page'>

            <h1 className='view-channel-headtext'>Active Channels:</h1>
            <div id='view-channels-container' className={!isLoading && allChannels.length > 0 && 'loaded'}>
                {
                    isLoading ? <h1>Loading...</h1>
                        : !isLoading && allChannels.length <= 0 ? <h1>No Active Channels</h1> : allChannels.map(channel => (
                            <ViewChannelItem
                                key={channel.chCode}
                                chName={channel.chName}
                                chCode={channel.chCode}
                            />
                        ))
                }
            </div>
        </div>
    )
}

function ViewChannelItem({ chName, chCode }) {

    const [isConfirmVisible, setIsConfirmVisible] = useState(false);

    const handleEnterBtn = () => {
        setIsConfirmVisible(true);
    }

    return (
        <div className='view-channel-item'>
            {isConfirmVisible && <ConfirmEnter chName={chName} chCode={chCode} setIsConfirmVisible={setIsConfirmVisible} />}
            <span>{chName}</span>

            <div className='view-channel-item-enter-btn' onClick={handleEnterBtn}>
                JOIN
            </div>
        </div>
    )
}

function ConfirmEnter({ chName, chCode, setIsConfirmVisible }) {

    const confirmInput = useRef(null);

    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const [isInputValid, setIsInputValid] = useState(null);


    useEffect(() => {
        setIsInputValid(confirmInput.current.value);

        confirmInput.current.focus();

    });


    const handleJoin = () => {
        const inputValue = confirmInput.current.value;

        if (isInputValid) {
            if (inputValue != '') {
                if (inputValue == chCode) {
                    navigate('/channel/' + chCode);
                } else {
                    setError('wrong-code');
                }
            } else {
                setError('wrong-input');
            }
        }
    }

    const handleType = () => {
        const inputValue = confirmInput.current.value;

        if (inputValue != '') {
            setIsInputValid(true);
        } else {
            setIsInputValid(false);
            setError(null);
        }
    }

    return (
        <div id='confirm-enter' onClick={e => {
            if (e.target.id == 'confirm-enter') {
                setIsConfirmVisible(false);
            }
        }}>
            <div id='confirm-enter-content'>
                <h2>Join </h2>
                <h3>'{chName}'</h3>
                <input
                    onChange={handleType}
                    onKeyDown={e => {
                        if (e.key == 'Enter') {
                            handleJoin();
                        }
                    }
                    }
                    ref={confirmInput}
                    placeholder='Type Code...'
                >
                </input>
                {
                    error && <p>Wrong Code</p>
                }

                <div id='confirm-buttons-container'>
                    <button className={isInputValid && 'join-btn-valid'} onClick={handleJoin}>JOIN</button>
                    <button onClick={() => setIsConfirmVisible(false)}>CANCEL</button>
                </div>
            </div>
        </div>
    )
}