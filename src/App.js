import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import FlashScreen from './pages/flash_screen/FlashScreen';
import Home from './pages/home/Home';
import Header from './components/header/Header';
import NotFound from './pages/not_found/NotFound';
import FeaturePage from './pages/feature_page/FeaturePage.js'
import Channel from './pages/channel/Channel';
import ViewChannels from './components/view_channels/ViewChannels';
import ViewRecents from './components/view_recents/ViewRecents';

function App() {

  const [isFlashScreen, setIsFlashScreen] = useState(true);
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    setTimeout(() => {
      setIsFlashScreen(false);
    }, 2000);


    setIsOnline(window.navigator.onLine);

    const handleConnectionChange = () => {
      setIsOnline(navigator.onLine);
    }

    // Adde event listeners for 
    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);

    // Clean up event listeners when the component is unmounted
    return () => {
      window.removeEventListener('online', handleConnectionChange);
      window.removeEventListener('offline', handleConnectionChange);
    };

  }, [])

  return (
    <Router>
      <div id='App'>


        {/* HEADER */}
        <Header />

        {
          isFlashScreen && <FlashScreen />
        }

        {/* PAGES */}
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/create" element={<FeaturePage type='create' />} />
          <Route exact path="/enter" element={<FeaturePage type='enter' />} />
          <Route exact path="/channel/:chCode" element={<Channel />} />
          <Route exact path='/view_channels' element={<ViewChannels />} />
          <Route exact path='/view_recents' element={<ViewRecents />} />
          {/* <Route exact path="/channel" element={<Channel />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <div id='online-status-notif' className={isOnline ? 'is-online' : 'is-offline'}>
        <span>You are currently offline</span>
      </div>
    </Router>
  );
}

export default App;