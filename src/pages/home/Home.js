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

                <a id="what-is-anony" href="#anony-about">What is Anony?</a>
            </div>

            <div id="anony-about">
                <h2>About Anony </h2>
                <p>
                    Welcome to Anony, a safe and empowering platform where you can share your thoughts,
                    ideas, and stories without revealing your identity. Say goodbye to the fear of judgment
                    and hello to a space where your voice truly matters.
                </p>
                <h3>Discover the Power of Anonymity</h3>
                <p>
                    Anony allows you to post messages anonymously, fostering open and honest conversations
                    around various topics. Embrace the freedom to express yourself authentically, without
                    any reservations.
                </p>
                <h3>Key Features of Anony</h3>
                <ul>
                    <li>Anonymous Posting: Share your perspectives without revealing personal information.</li>
                    <br/>
                    <li>Channel Creation: Curate your own channels and build communities around your interests.</li>
                    {/* <li>Secure and Private: We prioritize your anonymity and data security.</li>
                    <li>Simple and Intuitive: Our user-friendly interface makes anonymous posting a breeze.</li> */}
                </ul>
                <h3>Join Anony Today and Be Heard</h3>
                <p>
                    Don't hold back your thoughts any longer. Join Anony today and be part of a welcoming
                    community that embraces the power of anonymity. Share, engage, and explore without limits.
                    Your voice matters here.
                </p>
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
