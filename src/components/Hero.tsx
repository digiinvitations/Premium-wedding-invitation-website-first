import { motion } from "motion/react";
import { Heart, ArrowDown } from "lucide-react";
import { WeddingData } from "../types";
import { useState, useRef, useEffect } from "react";

interface HeroProps {
  data: WeddingData;
  shouldPlayVideo?: boolean;
  onVideoEnd?: () => void;
}

export function Hero({ data, shouldPlayVideo = true, onVideoEnd }: HeroProps) {
  const [showText, setShowText] = useState(!data.heroVideoUrl);
  const [isEnded, setIsEnded] = useState(!data.heroVideoUrl);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (shouldPlayVideo && videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, [shouldPlayVideo]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const { currentTime } = videoRef.current;
      if (currentTime >= 2) {
        if (!showText) setShowText(true);
      }
    }
  };

  const handleEnded = () => {
    setIsEnded(true);
    setShowText(true);
    if (onVideoEnd) onVideoEnd();
  };

  return (
    <section className="relative min-h-[100svh] w-full flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Background Video or Image */}
      <div className="absolute inset-0 z-0 bg-black">
        {data.heroVideoUrl ? (
          <video
            ref={videoRef}
            src={data.heroVideoUrl}
            muted
            playsInline
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            className="w-full h-full object-cover"
          />
        ) : (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop')" }}
          />
        )}
        
        {/* Dynamic Dark Overlay */}
        <div className={`absolute inset-0 bg-black/30 transition-opacity duration-1000 ${data.heroVideoUrl && !showText ? 'opacity-0' : 'opacity-100'}`} />
        
        {/* Slightly dark theme when ended */}
        {data.heroVideoUrl && (
          <div className={`absolute inset-0 bg-black/40 transition-opacity duration-1000 ${isEnded ? 'opacity-100' : 'opacity-0'}`} />
        )}

        <div className={`absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t pointer-events-none transition-colors duration-1000 ${isEnded ? 'from-[#262626]' : 'from-[#F8E8EB]'} to-transparent z-10`} />
      </div>

      {/* Content */}
      <div className={`relative z-10 flex flex-col items-center justify-center px-6 text-center w-full max-w-md mx-auto pt-12 pb-6 h-full min-h-[100svh] transition-opacity duration-1000 ${showText ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        
        <div className="flex-1 flex flex-col items-center justify-center w-full mt-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : 10 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-col items-center w-full"
          >
            <Heart className="w-5 h-5 text-cream fill-cream mb-4 opacity-80" />
            <p className="font-serif text-cream text-[14px] italic mb-4 max-w-[280px] leading-relaxed opacity-95 whitespace-pre-line font-light">
              {data.heroMessage}
            </p>
            
            <div className="flex items-center justify-center gap-3 opacity-60 mb-6">
              <div className="h-[1px] w-12 bg-cream"></div>
              <Heart className="w-3 h-3 text-cream fill-cream" />
              <div className="h-[1px] w-12 bg-cream"></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: showText ? 1 : 0, scale: showText ? 1 : 0.95 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="flex flex-col items-center justify-center w-full"
          >
            <h1 className="font-script text-6xl text-cream drop-shadow-sm leading-none">
              {data.groom.name}
            </h1>
            <div className="font-serif text-[12px] text-cream/90 flex flex-col items-center gap-1 mt-2 mb-5 opacity-90 font-light">
              <p>{data.groom.parents}</p>
              <p>{data.groom.education}</p>
              <p>{data.groom.profession}</p>
            </div>
            
            <span className="font-script text-3xl text-pink-accent/90 my-1">&amp;</span>
            
            <h1 className="font-script text-6xl text-cream drop-shadow-sm leading-none mt-3">
              {data.bride.name}
            </h1>
            <div className="font-serif text-[12px] text-cream/90 flex flex-col items-center gap-1 mt-2 opacity-90 font-light">
              <p>{data.bride.parents}</p>
              <p>{data.bride.education}</p>
              <p>{data.bride.profession}</p>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showText ? 0.8 : 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-6 flex flex-col items-center"
        >
          <span className="text-[10px] font-serif text-cream uppercase tracking-[0.3em] mb-2">Scroll</span>
          <motion.div 
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-4 h-4 text-cream" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
