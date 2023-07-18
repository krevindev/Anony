import './ViewRecents.css';

import clearBtn from '../../res/images/svg/clear-btn.svg';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';



export default function ViewRecents() {

    const getRecentChannels = () => {
        const recentChannels = JSON.parse(localStorage.getItem('recentChannels')) || [];
        return recentChannels;
    };

    // const [fakeRecents, setFakeRecents] = useState([]);
    const [recentsData, setRecentsData] = useState(getRecentChannels());


    // let fakeRecentsData = [
    //     { chName: 'BARDAGULAN BSCS 4B', chCode: 'FF070' },
    //     { chName: 'HELLO TEST CHANNEL', chCode: 'FF020' },
    //     { chName: 'HELLO TEST CHANNEL', chCode: 'FF020' },
    //     { chName: 'HELLO TEST CHANNEL', chCode: 'FF020' },
    //     { chName: 'HELLO TEST CHANNEL', chCode: 'FF020' },
    //     { chName: 'HELLO TEST CHANNEL', chCode: 'FF020' },
    //     { chName: 'HELLO TEST CHANNEL', chCode: 'FF020' },
    //     { chName: 'HELLO TEST CHANNEL', chCode: 'FF020' },
    //     { chName: 'HELLO TEST CHANNEL', chCode: 'FF020' },
    //     { chName: 'HELLO TEST CHANNEL', chCode: 'FF020' },
    //     { chName: 'HELLO TEST CHANNEL', chCode: 'FF020' },
    //     { chName: 'HELLO TEST CHANNEL', chCode: 'FF020' },
    //     { chName: 'BARDAGULAN BSCS 4B', chCode: 'FF070' },
    //     { chName: 'HELLO TEST CHANNEL', chCode: 'FF020' },
    //     { chName: 'HELLO TEST CHANNEL', chCode: 'FF020' },
    //     { chName: 'HELLO TEST CHANNEL', chCode: 'FF020' },
    //     { chName: 'HELLO TEST CHANNEL', chCode: 'FF020' },
    //     { chName: 'HELLO TEST CHANNEL', chCode: 'FF020' },
    //     { chName: 'HELLO TEST CHANNEL', chCode: 'FF020' },
    //     { chName: 'HELLO TEST CHANNEL', chCode: 'FF020' },
    //     { chName: 'HELLO TEST CHANNEL', chCode: 'FF020' },
    //     { chName: 'HELLO TEST CHANNEL', chCode: 'FF020' },
    //     { chName: 'HELLO TEST CHANNEL', chCode: 'FF020' },
    //     { chName: 'HELLO TEST CHANNEL', chCode: 'FF020' },
    //     { chName: 'BARDAGULAN BSCS 4B', chCode: 'FF070' },
    //     { chName: 'HELLO TEST CHANNEL', chCode: 'FF020' },
    //     { chName: 'HELLO TEST CHANNEL', chCode: 'FF020' },
    //     { chName: 'HELLO TEST CHANNEL', chCode: 'FF020' },
    //     { chName: 'HELLO TEST CHANNEL', chCode: 'FF020' },
    //     { chName: 'HELLO TEST CHANNEL', chCode: 'FF020' },
    //     { chName: 'HELLO TEST CHANNEL', chCode: 'FF020' },
    //     { chName: 'HELLO TEST CHANNEL', chCode: 'FF020' },
    //     { chName: 'HELLO TEST CHANNEL', chCode: 'FF020' },
    //     { chName: 'HELLO TEST CHANNEL', chCode: 'FF020' },
    //     { chName: 'HELLO TEST CHANNEL', chCode: 'FF020' },
    //     { chName: 'HELLO TESTsdfsdfdsfsdfsddfddsfCHANNsdfsdfsdfsdfsdfsdfsfsdfdsELTESTsdfsdfdsfsdfsddfddsfCHANNsdfsdfsdfsdfsdfsdfsfsdfdsEL', chCode: 'FF020' },
    // ]
    // fakeRecentsData = [];

    useEffect(() => {
        // setFakeRecents([...fakeRecents, ...fakeRecentsData]);

        setRecentsData([...recentsData, ...getRecentChannels()]);
        updateRecentData();

        console.log(recentsData);
    }, [])



    // Update recentData state whenever the 'recentChannels' change
    const updateRecentData = () => {
        setRecentsData(getRecentChannels());
    };

    const clearRecentChannels = () => {
        setRecentsData([]);
        localStorage.removeItem('recentChannels');
        console.log(getRecentChannels())
    };


    return (
        <div id="ViewRecents" className="anony-page">

            <div id="home-recents-container">
                <h5>Recent Channels:</h5>
                <div id="home-recents-items-container" className={recentsData.length <= 0 && 'empty-recents'}>
                    {
                        recentsData.length > 0 ? recentsData.map((recent, ind) => (
                            <Recent key={ind} chName={recent.chName} chCode={recent.chCode} />
                        ))
                            :
                            <h3>No Recents</h3>
                    }

                </div>
                <div id="home-recents-clear-btn-container" onClick={clearRecentChannels}>
                    <img src={clearBtn} />
                    <h6>Clear Recents</h6>
                </div>
            </div>
        </div>
    )
}

// Recent Component
function Recent({ chName, chCode, ind }) {

    const navigate = useNavigate();

    const handleClick = () => {
        console.log(`Joining Channel: ${chName}\nCode:${chCode}`)
    }

    return (
        <div className="anony-recent-item" key={ind} onClick={handleClick}>
            <h5>{chName}</h5>
            <button onClick={() => navigate('/channel/' + chCode)}>Re-Enter</button>
        </div>
    )
}