import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { HeartDivider } from "./HeartDivider";
import { EventDetails } from "../types";
import { PartyPopper, Calendar, MapPin, X, Sparkles, Heart } from "lucide-react";

interface EventsProps {
  events: EventDetails[];
}

function EventPopup({ event, onClose }: { event: EventDetails; onClose: () => void }) {
  const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=Wedding+Event&location=${encodeURIComponent(event.location)}`;
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Prevent scrolling when popup is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Force mute to bypass any browser autoplay/mute quirk
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      videoRef.current.volume = 0;
    }
  }, [event.videoUrl]);

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-auto px-4">
      {/* Light pink transparent overlay */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-[#F9E8EC]/85 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Skip Video Button on Background */}
      <button 
        onClick={onClose}
        className="absolute top-6 left-6 z-[100000] px-4 py-2 bg-white/70 rounded-full flex items-center justify-center text-burgundy font-serif text-[10px] uppercase tracking-widest font-bold backdrop-blur-md hover:bg-white transition-colors border border-pink-border shadow-sm"
      >
        Skip Video
      </button>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        className="relative z-10 w-full max-w-[260px] flex flex-col items-center justify-center"
      >
        {/* Celebration animations left and right */}
        <motion.div 
          initial={{ opacity: 0, x: -100, y: 80, scale: 0, rotate: -45 }} 
          animate={{ opacity: 1, x: -50, y: 20, scale: 1, rotate: -15 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
          className="absolute -left-12 top-16 text-4xl opacity-100 pointer-events-none z-20 drop-shadow-lg"
        >
          🎉
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 100, y: 80, scale: 0, rotate: 45 }} 
          animate={{ opacity: 1, x: 50, y: 20, scale: 1, rotate: 15 }}
          transition={{ duration: 0.8, delay: 0.15, type: "spring", bounce: 0.5 }}
          className="absolute -right-12 top-16 text-4xl opacity-100 pointer-events-none z-20 drop-shadow-lg"
        >
          🥂
        </motion.div>

        {/* Heading above video */}
        <div className="mb-4 text-center text-wine-dark w-full drop-shadow-sm flex flex-col items-center">
          <h3 className="font-script text-4xl mb-1 text-burgundy font-bold">{event.title}</h3>
          <p className="font-serif text-sm tracking-widest text-wine-dark/80 font-bold mb-2">{event.date} • {event.time}</p>
          <div className="font-serif text-[10px] font-bold uppercase tracking-widest text-burgundy flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full border border-pink-border bg-white/60 backdrop-blur-md shadow-sm">
            <MapPin className="w-3.5 h-3.5" /> {event.location}
          </div>
        </div>

        {/* 9:16 Video Container (Small) */}
        <div className="w-full aspect-[9/16] rounded-2xl overflow-hidden shadow-xl bg-blush-light relative border-[3px] border-pink-border/80 mx-auto flex-none">
          {event.videoUrl ? (
            <video 
              ref={videoRef}
              src={event.videoUrl} 
              autoPlay muted loop playsInline 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-wine-dark/50 text-sm font-serif p-4 text-center">
              <PartyPopper className="w-8 h-8 mb-2 opacity-50" />
              Video not yet uploaded
            </div>
          )}
        </div>

        {/* Buttons below video */}
        <div className="flex w-full gap-3 mt-5">
          <a 
            href={calUrl} target="_blank" rel="noopener noreferrer"
            className="flex-1 bg-burgundy text-white py-3 rounded-full font-serif text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 hover:bg-wine-dark transition-colors shadow-lg"
          >
            <Calendar className="w-3.5 h-3.5" /> Save Date
          </a>
          {event.mapUrl && (
            <a 
              href={event.mapUrl} target="_blank" rel="noopener noreferrer"
              className="flex-1 bg-burgundy text-white py-3 rounded-full font-serif text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 hover:bg-wine-dark transition-colors shadow-lg backdrop-blur-sm"
            >
              <MapPin className="w-3.5 h-3.5" /> Direction
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function EventItem({ event }: { event: EventDetails }) {
  const [isHolding, setIsHolding] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const holdTimer = useRef<NodeJS.Timeout | null>(null);

  const startHold = () => {
    setIsHolding(true);
    holdTimer.current = setTimeout(() => {
      setIsHolding(false);
      setShowPopup(true);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F8E8EB', '#F4C2C2', '#800020'],
        zIndex: 100000
      });
    }, 800);
  };

  const stopHold = () => {
    setIsHolding(false);
    if (holdTimer.current) clearTimeout(holdTimer.current);
  };

  return (
    <div className="flex flex-col items-center py-2 w-full">
      <h3 className="font-script text-5xl md:text-6xl text-burgundy mb-6 text-center drop-shadow-sm">{event.title}</h3>
      
      <motion.button
        onPointerDown={startHold}
        onPointerUp={stopHold}
        onPointerLeave={stopHold}
        onContextMenu={(e) => e.preventDefault()}
        whileTap={{ scale: 0.95 }}
        className="relative px-12 py-3.5 rounded-full border border-pink-accent/40 bg-white text-wine-dark font-serif text-xs uppercase tracking-widest overflow-hidden touch-none select-none shadow-sm flex items-center justify-center min-w-[240px]"
      >
        <div className="absolute left-4 text-pink-accent/50 flex items-center justify-center">
          <Heart className="w-3.5 h-3.5" fill="currentColor" />
        </div>
        <div className="absolute right-4 text-pink-accent/50 flex items-center justify-center">
          <Heart className="w-3.5 h-3.5" fill="currentColor" />
        </div>
        <div className="relative z-10 flex items-center gap-2 font-bold tracking-[0.15em]">
          Hold to Reveal
        </div>
        {/* Progress background */}
        <motion.div
          className="absolute inset-y-0 left-0 bg-pink-accent/15"
          initial={{ width: 0 }}
          animate={{ width: isHolding ? "100%" : 0 }}
          transition={{ duration: isHolding ? 0.8 : 0.3, ease: "linear" }}
        />
      </motion.button>
      
      <AnimatePresence>
        {showPopup && <EventPopup event={event} onClose={() => setShowPopup(false)} />}
      </AnimatePresence>
    </div>
  );
}

export function Events({ events }: EventsProps) {
  if (!events || events.length === 0) return null;

  return (
    <section className="py-16 px-6 bg-blush-light flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md flex flex-col items-center"
      >
        <PartyPopper className="w-6 h-6 text-pink-accent mb-4 opacity-80" strokeWidth={1.5} />
        <h2 className="font-serif text-3xl md:text-4xl uppercase tracking-widest text-wine-dark text-center drop-shadow-sm font-bold">
          Pre-Wedding Events
        </h2>
        
        <HeartDivider />

        <div className="flex flex-col w-full gap-8 mt-8">
          {events.map((event, index) => (
            <React.Fragment key={event.id || index}>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="w-full flex justify-center"
              >
                <EventItem event={event} />
              </motion.div>
              
              {index < events.length - 1 && (
                <div className="w-16 h-px bg-pink-border/50 mx-auto my-2" />
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
