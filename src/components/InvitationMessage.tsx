import { motion } from "motion/react";
import { Heart } from "lucide-react";

interface InvitationMessageProps {
  message: string;
  isHeroEnded?: boolean;
}

export function InvitationMessage({ message, isHeroEnded }: InvitationMessageProps) {
  return (
    <section className="relative px-6 pt-32 pb-24 bg-[#F8E8EB] flex flex-col items-center text-center">
      <div className={`absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#262626] to-transparent pointer-events-none transition-opacity duration-1000 z-0 ${isHeroEnded ? 'opacity-100' : 'opacity-0'}`} />
      
      {/* Soft dark to Pink gradient flows naturally from the Hero video above */}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="max-w-md mx-auto flex flex-col items-center relative z-10"
      >
        <div className="flex items-center justify-center w-full gap-4 mb-8">
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#D9A6B2]"></div>
          <Heart className="w-5 h-5 text-[#D9A6B2] fill-[#D9A6B2] opacity-80" />
          <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#D9A6B2]"></div>
        </div>
        
        <p className="font-serif font-bold text-xl md:text-2xl text-[#8F1736] leading-relaxed whitespace-pre-line italic opacity-100 px-4">
          {message}
        </p>
        
        <div className="flex items-center justify-center w-full gap-4 mt-8">
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#D9A6B2]"></div>
          <Heart className="w-5 h-5 text-[#D9A6B2] fill-[#D9A6B2] opacity-80" />
          <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#D9A6B2]"></div>
        </div>
      </motion.div>

    </section>
  );
}
