import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 5; 
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-50 overflow-hidden font-mono text-electric-purple">
      {/* 1. Matrix/Code Rain Background Effect */}
      <BackgroundMatrix />

      {/* 2. Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-20 opacity-20"></div>

      {/* 3. Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.8)_100%)] z-10"></div>

      <div className="relative z-30 flex flex-col items-center gap-8">
        
        {/* Central Tech Orb */}
        <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Rotating Hexagons */}
            <motion.div 
              className="absolute inset-0 border border-electric-purple/30 clip-path-hexagon"
              style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute inset-4 border border-cyan-500/30"
              style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
              animate={{ rotate: -360, scale: [1, 0.9, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            
             {/* Center Pulse */}
            <motion.div 
                className="w-20 h-20 bg-electric-purple/10 backdrop-blur-md rounded-full flex items-center justify-center border border-electric-purple/50 shadow-[0_0_50px_rgba(147,51,234,0.5)]"
                animate={{ 
                    boxShadow: ["0 0 30px rgba(147,51,234,0.3)", "0 0 70px rgba(147,51,234,0.8)", "0 0 30px rgba(147,51,234,0.3)"],
                    scale: [0.9, 1, 0.9]
                }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <GlitchText text="ISTE" />
            </motion.div>

            {/* Orbiting Particles */}
            <motion.div
                className="absolute w-full h-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee] -translate-x-1/2 -translate-y-1/2"></div>
            </motion.div>
        </div>

        {/* Loading Status with Data Decoding */}
        <div className="flex flex-col items-center gap-2 w-80">
            <div className="flex justify-between w-full text-xs text-cyan-400/80 mb-1 uppercase tracking-widest">
                <span>System Integrity</span>
                <span className="tabular-nums">{Math.min(100, Math.round(progress))}%</span>
            </div>
            
            {/* Progress Bar */}
            <div className="h-2 w-full bg-slate-800/50 border border-slate-700/50 overflow-hidden relative skew-x-[-20deg]">
                <motion.div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-electric-purple via-fuchsia-500 to-cyan-500"
                    style={{ width: `${progress}%` }}
                >
                     <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.5)_50%,transparent_100%)] w-20 animate-shimmer"></div>
                </motion.div>
            </div>

            {/* Scrolling Terminal Output */}
            <div className="h-24 w-full mt-4 p-2 overflow-hidden text-[10px] text-slate-500 border-l-2 border-slate-800 bg-black/20 font-mono">
               <TerminalOutput />
            </div>
        </div>
      </div>
    </div>
  );
};

// Component for random binary/hex background
const BackgroundMatrix = () => {
    return (
        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
                <MatrixColumn key={i} index={i} />
            ))}
        </div>
    )
}

const MatrixColumn = ({ index }) => {
    const duration = 2 + Math.random() * 5;
    const delay = Math.random() * 5;
    const left = index * 5; 

    return (
        <motion.div
            className="absolute top-0 text-xs text-green-500/50 whitespace-pre leading-none select-none"
            style={{ left: `${left}%` }}
            initial={{ y: -1000 }}
            animate={{ y: 2000 }}
            transition={{ duration: duration, repeat: Infinity, ease: "linear", delay: delay }}
        >
            {Array.from({ length: 30 }).map((_, j) => (
                <div key={j} className="my-1">
                    {Math.random() > 0.5 ? '1' : '0'} {Math.random().toString(16).substr(2, 2).toUpperCase()}
                </div>
            ))}
        </motion.div>
    )
}

// Component for decoding/glitching text
const GlitchText = ({ text }) => {
    const [display, setDisplay] = useState(text);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()";

    useEffect(() => {
        let interval;
        const glitch = () => {
            let iterations = 0;
            interval = setInterval(() => {
                setDisplay(
                    text.split("")
                        .map((char, index) => {
                            if (index < iterations) return text[index];
                            return chars[Math.floor(Math.random() * chars.length)];
                        })
                        .join("")
                );
                if (iterations >= text.length) clearInterval(interval);
                iterations += 1/3;
            }, 30);
        };
        
        glitch();
        const loop = setInterval(glitch, 3000);
        return () => {
            clearInterval(interval);
            clearInterval(loop);
        };
    }, [text]);

    return <span className="font-bold tracking-widest text-white/90">{display}</span>;
};

// Fake terminal output
const TerminalOutput = () => {
    const [lines, setLines] = useState(["> INITIALIZING..."]);
    const logs = [
        "LOADING MODULES...",
        "VERIFYING INTEGRITY...",
        "CONNECTING TO SERVER...",
        "FETCHING USER DATA...",
        "OPTIMIZING ASSETS...",
        "STARTING INTERFACE...",
        "ACCESS GRANTED",
        "WELCOME USER",
        "SYSTEM READY"
    ];

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            if(i < logs.length) {
                setLines(prev => [...prev.slice(-4), `> ${logs[i]}`]);
                i++;
            }
        }, 300);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col gap-1">
            {lines.map((line, i) => (
                <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className={i === lines.length - 1 ? "text-cyan-400" : ""}
                >
                    {line}
                </motion.div>
            ))}
        </div>
    );
};

export default LoadingScreen;
