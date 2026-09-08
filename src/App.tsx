import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { Hero } from './components/Hero';
import { InvitationMessage } from './components/InvitationMessage';
import { MusicControl } from './components/MusicControl';
import { ScratchCardSection } from './components/ScratchCard';
import { Countdown } from './components/Countdown';
import { Events } from './components/Events';
import { Timeline } from './components/Timeline';
import { Venue } from './components/Venue';
import { RSVP } from './components/RSVP';
import { ClosingMessage } from './components/ClosingMessage';
import { Footer } from './components/Footer';
import { getWeddingData } from './services/db';
import { WeddingData } from './types';
import { AdminPanel } from './components/AdminPanel';
import { Preloader } from './components/Preloader';

function PublicView() {
  const [data, setData] = useState<WeddingData | null>(null);
  const [isPreloading, setIsPreloading] = useState(true);
  const [viewState, setViewState] = useState<'thumbnail' | 'opening-video' | 'main'>('thumbnail');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isScratched, setIsScratched] = useState(false);
  const [isHeroEnded, setIsHeroEnded] = useState(false);
  const openingVideoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function loadData() {
      const dbData = await getWeddingData();
      
      // Clean up broken pixabay links that might be cached in Firestore
      if (dbData.heroVideoUrl?.includes("pixabay.com")) dbData.heroVideoUrl = "";
      if (dbData.musicUrl?.includes("pixabay.com")) dbData.musicUrl = "";
      
      setData(dbData);
      if (!dbData.openingThumbnailUrl) {
        setViewState('main');
      }
    }
    loadData();
  }, []);

  const handleThumbnailClick = () => {
    if (viewState === 'opening-video') {
      // If user clicks again while video is buffering/stuck, skip to main
      setViewState('main');
      return;
    }

    if (data?.openingVideoUrl) {
      setViewState('opening-video');
      if (openingVideoRef.current) {
        // We set volume to 1 here in case it was muted by default, but keeping muted is safer for autoplay.
        // The play() promise can reject if the video is broken.
        openingVideoRef.current.play().catch((err) => {
          console.error("Video playback failed", err);
          setViewState('main');
        });
      }
    } else {
      setViewState('main');
    }
  };

  useEffect(() => {
    if (data?.ogImageUrl) {
      // Find or create og:image meta tag
      let ogImageMeta = document.querySelector('meta[property="og:image"]');
      if (!ogImageMeta) {
        ogImageMeta = document.createElement('meta');
        ogImageMeta.setAttribute('property', 'og:image');
        document.head.appendChild(ogImageMeta);
      }
      ogImageMeta.setAttribute('content', data.ogImageUrl);
      
      // Some platforms also use twitter:image
      let twImageMeta = document.querySelector('meta[name="twitter:image"]');
      if (!twImageMeta) {
        twImageMeta = document.createElement('meta');
        twImageMeta.setAttribute('name', 'twitter:image');
        document.head.appendChild(twImageMeta);
      }
      twImageMeta.setAttribute('content', data.ogImageUrl);
    }
  }, [data]);

  if (!data) {
    return <div className="min-h-screen bg-blush-main flex items-center justify-center font-serif text-wine-dark">Loading...</div>;
  }

  if (isPreloading) {
    return <Preloader data={data} onComplete={() => setIsPreloading(false)} />;
  }

  return (
    <div className={`w-full bg-blush-main relative mx-auto max-w-md shadow-2xl overflow-hidden sm:my-0 ${viewState !== 'main' ? 'h-[100svh]' : 'min-h-[100svh]'}`}>
      
      {/* Audio player remains mounted across transitions */}
      <MusicControl musicUrl={data.musicUrl} shouldPlay={viewState !== 'thumbnail'} />

      {/* Main Content (Always rendered so Hero video preloads and starts seamlessly) */}
      <main className="w-full min-h-[100svh] bg-blush-main relative overflow-hidden">
        <Hero data={data} shouldPlayVideo={viewState === 'main' || !data.openingVideoUrl} onVideoEnd={() => setIsHeroEnded(true)} />
        <InvitationMessage message={data.invitationMessage} isHeroEnded={isHeroEnded} />
        <ScratchCardSection data={data} onReveal={() => setIsScratched(true)} />
        {isScratched && <Countdown targetDate={data.weddingDate} />}
        <Events events={data.events} />
        <Timeline events={data.events} />
        <Venue venue={data.venue} />
        <RSVP />
        <ClosingMessage data={data} />
        <Footer data={data} />
      </main>

      {/* Opening Video Overlay (z-[9999]) */}
      {data.openingVideoUrl && (
        <div 
          className={`absolute inset-0 z-[9999] bg-blush-main flex items-center justify-center ${viewState === 'opening-video' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <video
            ref={openingVideoRef}
            src={data.openingVideoUrl}
            playsInline
            muted
            preload="auto"
            onLoadedData={() => setIsVideoPlaying(true)}
            onTimeUpdate={(e) => {
              if (e.currentTarget.currentTime > 0.1) {
                setIsVideoPlaying(true);
              }
            }}
            onEnded={() => setViewState('main')}
            onClick={() => setViewState('main')}
            className="w-full h-full object-contain cursor-pointer"
          />
        </div>
      )}

      {/* Thumbnail Overlay (z-[9999]) */}
      {data.openingThumbnailUrl && (
        <div 
          className={`absolute inset-0 z-[9999] bg-blush-main flex items-center justify-center cursor-pointer ${viewState === 'thumbnail' || (viewState === 'opening-video' && !isVideoPlaying) ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={handleThumbnailClick}
        >
          <img 
            src={data.openingThumbnailUrl} 
            alt="Opening" 
            className="w-full h-full object-contain" 
          />
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicView />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}


