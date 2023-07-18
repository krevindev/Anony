import loadingGIF from '../../res/gif/loading2.gif';
import './LoadingPage.css';

export default function LoadingPage({ loadingText }) {
    return (
        <div id="LoadingPage">
            <div id='loading-page-content'>
                <h3>{loadingText}</h3>
                <img src={loadingGIF} />
            </div>
        </div>
    )
}