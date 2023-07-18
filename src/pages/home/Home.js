import { Link } from "react-router-dom";
import './Home.css';
import { useEffect, useState } from "react";

import createChannelIcon from '../../res/images/svg/create-channel.svg';
import joinChannelIcon from '../../res/images/svg/join-channel.svg';
import viewChannelIcon from '../../res/images/svg/view-channel.svg';
import recentChannelIcon from '../../res/images/svg/recent-channel.svg';


export default function Home() {
    return (
        <div id="Home" className="anony-page">

            <div id="home-content-container">
                <div id="home-content-buttons">
                    <AnonyButton
                        text='Create a Channel'
                        to="/create"
                        imgSrc={createChannelIcon}
                    />
                    <AnonyButton
                        text='Enter a Channel'
                        to="/enter"
                        imgSrc={joinChannelIcon}
                    />
                    <AnonyButton
                        text='View Channels'
                        to="/view_channels"
                        imgSrc={viewChannelIcon}
                    />
                    <AnonyButton
                        text='View Recent Channels'
                        to="/view_recents"
                        imgSrc={recentChannelIcon}
                    />
                </div>
                
            </div>

        </div>
    )
}


// AnonyButton Component
function AnonyButton({ text, to, imgSrc }) {


    const handleClick = () => {
    }

    return (
        <Link className="anony-button"
            to={to}
            onClick={handleClick}>
            <img src={imgSrc} />
            <h1>{text}</h1>
        </Link>
    )
}
