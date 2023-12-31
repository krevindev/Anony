import './Header.css';
import userIcon from '../../res/images/svg/user-icon.svg';
import backBtn from '../../res/images/svg/back-btn.svg';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';


export default function Header() {

    const [headerTitle, setHeaderTitle] = useState('ANONY');
    const [isHeaderText, setIsHeaderText] = useState(true);
    const [isShowUnav, setIsShowUnav] = useState(false);

    const locationPath = useLocation().pathname;
    const channelCode = locationPath.split('/')[locationPath.split('/').length - 1];


    useEffect(() => {

        if (locationPath === '/enter' || locationPath === '/create' || locationPath === '/view_channels') {
            setIsHeaderText(false);
        } else {
            setIsHeaderText(true);
        }

        if (isShowUnav) {
            setTimeout(() => {
                setIsShowUnav(false);
            }, 1000);
        }

    })

    const handleProfileClick = () => {
        if (!isShowUnav) {
            setIsShowUnav(true)
        }
    }


    return (
        <header id="Header">
            <Link
                to="/"
            >
                {
                    isHeaderText ? <h1 id="header-title">{headerTitle}</h1> : <img id='header-back-btn' src={backBtn} />
                }
            </Link>
            <img id='header-user-icon' src={userIcon} onClick={handleProfileClick} />
            {
                isShowUnav && <div id='header-unavailable-feature' >Feature Unavailable</div>
            }
        </header>
    )
}