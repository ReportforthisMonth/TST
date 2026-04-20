/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import bgImage from './bg.png';
import characterImg from './character.png';

export default function App() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the parallax movement for background
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Calculate normalized mouse position (-1 to 1)
      const x = (e.clientX / innerWidth) * 2 - 1;
      const y = (e.clientY / innerHeight) * 2 - 1;
      
      // Move slightly opposite to mouse cursor for a parallax effect
      mouseX.set(x * -35); 
      mouseY.set(y * -35);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    // Replaced min-h-screen with h-screen to strictly fill the viewport and remove the black space below.
    <div className="w-full h-screen bg-black overflow-hidden relative flex flex-col font-sans">
      {/* Parallax Background */}
      <motion.div 
        className="absolute inset-0 w-full h-full origin-center"
        style={{ 
          x: smoothX, 
          y: smoothY,
          scale: 1.25 // "zoom it a bit" – also helps hide edges during parallax movement
        }}
      >
        <img 
          src={bgImage} 
          alt="Background" 
          // On mobile, use object-bottom to push the focus downwards naturally, so it fills the screen without extra scale hacks.
          // On larger screens (md:), bring it back to its normal top-aligned cover state.
          className="w-full h-full object-cover object-bottom md:object-top pointer-events-none"
        />
      </motion.div>

      {/* Navigation Bar */}
      <nav className="absolute top-6 left-0 w-full px-4 md:px-[6%] flex items-center justify-between z-30 gap-4">
        {/* Left Side (TST402 Bar) */}
        <div className="flex items-center gap-4 bg-[#383838]/80 backdrop-blur-md rounded-full p-2 pr-6 w-full max-w-[60vw] md:max-w-[700px] border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#d9d9d9] shrink-0" />
          <span className="text-white font-bold text-lg md:text-xl tracking-wide">TST402</span>
        </div>

        {/* Right Side (Connect Wallet inside container) */}
        <div className="flex items-center bg-[#383838]/80 backdrop-blur-md rounded-full p-1 border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)] shrink-0">
          <button className="bg-[#4461F2] hover:bg-[#3b55d9] transition text-white px-6 md:px-8 py-2 md:py-2.5 rounded-full text-sm font-medium cursor-pointer shadow-md">
            Connect Wallet
          </button>
        </div>
      </nav>

      {/* Hero Text Overlay */}
      <div className="absolute top-32 md:top-44 left-4 md:left-[8%] z-20 pointer-events-none">
        <h1 className="text-white text-4xl md:text-5xl lg:text-[4rem] xl:text-[4.5rem] font-sans font-medium leading-[1.1] tracking-tight drop-shadow-2xl">
          Next gen X402<br />
          Protocol <span className="font-pixel inline-block text-[0.9em] translate-y-1 md:translate-y-2">AI</span> Assistant
        </h1>
      </div>

      {/* Character Overlay - Static, no parallax */}
      <div
        className="absolute bottom-0 left-0 w-full md:left-[5%] lg:left-[10%] flex justify-center md:justify-start items-end pointer-events-none z-10"
      >
        <img 
          src={characterImg} 
          alt="AI Assistant Character" 
          // Responsive logic: Uses calc() to enforce a strict maximum height.
          // This guarantees the character's head never reaches the top ~384px (24rem) of the screen,
          // ensuring there is a protective padding zone between it and any text/boxes above.
          className="w-auto h-[75vh] md:h-[95vh] max-h-[calc(100vh-18rem)] md:max-h-[calc(100vh-21rem)] lg:max-h-[calc(100vh-23rem)] max-w-[95vw] md:max-w-[55vw] lg:max-w-[50vw] object-contain object-bottom drop-shadow-[0_0_25px_rgba(0,0,0,0.5)]"
        />
      </div>
    </div>
  );
}
