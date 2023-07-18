import './FlashScreen.css';
import messageIcon from '../../res/images/svg/message-icon.svg';
import messageIconBig from '../../res/images/svg/message-icon-big.svg';

function FlashScreen() {

    return (
        <div id='FlashScreen' className='anony-page'>
            <div id='flash-circle'>

                {/* <div className='flash-clouds'>
                    <img src={messageIcon} />
                </div>
                <div className='flash-clouds'>
                    <img src={messageIcon} />
                </div>
                <div className='flash-clouds'>
                    <img src={messageIcon} />
                </div>
                <div className='flash-clouds'>
                    <img src={messageIcon} />
                </div> */}

                <img src={messageIconBig} className='flash-icon'/>

            </div>
        </div>
    )
}

export default FlashScreen;