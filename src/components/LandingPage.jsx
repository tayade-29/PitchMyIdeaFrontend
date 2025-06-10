import React, { useState, useEffect } from 'react';

const SpotlightLanding = () => {
  const [showFirst, setShowFirst] = useState(false);
  const [showSecond, setShowSecond] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [particles, setParticles] = useState([]);

  // Generate dynamic dust particles
  useEffect(() => {
    const createParticles = () => {
      const particlesArray = Array.from({ length: 120 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.7 + 0.1,
        delay: Math.random() * 10,
        speed: Math.random() * 20 + 10,
        driftX: (Math.random() - 0.5) * 0.2,
        driftY: (Math.random() - 0.5) * 0.2,
      }));
      setParticles(particlesArray);
    };

    createParticles();
    
    // Regenerate particles periodically for dynamic effect
    const interval = setInterval(createParticles, 10000);
    return () => clearInterval(interval);
  }, []);

  // Animate text sequence with precise timing
  useEffect(() => {
    const timer1 = setTimeout(() => setShowFirst(true), 800);
    const timer2 = setTimeout(() => setShowSecond(true), 1600);
    const timer3 = setTimeout(() => setShowButton(true), 2600);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden select-none">
      {/* Dynamic Dust Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-white"
          style={{
            top: `${particle.y}vh`,
            left: `${particle.x}vw`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animation: `float ${particle.speed}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
            transform: `translate(${particle.driftX}px, ${particle.driftY}px)`,
          }}
        />
      ))}

      {/* Realistic Spotlight Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Light Beam */}
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] rounded-full"
          style={{
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.4) 0%, transparent 70%)',
            boxShadow: '0 0 200px 100px rgba(255,255,255,0.15)',
            filter: 'blur(20px)',
          }}
        >
          {/* Beam Core */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 60%)',
              filter: 'blur(10px)',
            }}
          />
        </div>
        
        {/* Light Falloff */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.8) 70%, rgba(0,0,0,0.95) 100%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="space-y-2 mb-16">
          <h1 
            className={`font-bold text-6xl md:text-8xl text-white transition-all duration-1000 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${showFirst ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`} 
            style={{ 
              fontFamily: "'Bebas Neue', sans-serif", 
              letterSpacing: '2px',
              textShadow: '0 0 20px rgba(255,255,255,0.3)'
            }}
          >
            PITCH
          </h1>
          <h1 
            className={`font-bold text-6xl md:text-8xl text-white transition-all duration-1000 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${showSecond ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} 
            style={{ 
              fontFamily: "'Bebas Neue', sans-serif", 
              letterSpacing: '2px',
              textShadow: '0 0 20px rgba(255,255,255,0.3)'
            }}
          >
            YOUR IDEAS
          </h1>
        </div>
        
        <button 
          className={`bg-transparent border-2 border-white text-white px-12 py-4 rounded-full font-medium text-xl transition-all duration-1000 ${showButton ? 'opacity-100 hover:bg-white hover:text-black hover:scale-105' : 'opacity-0 translate-y-8'}`}
          style={{ 
            fontFamily: "'Montserrat', sans-serif",
            letterSpacing: '1px',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            boxShadow: '0 0 25px rgba(255,255,255,0.3)'
          }}
          onClick={() => alert('Navigating to the main site...')}
        >
          EXPLORE CONCEPTS
        </button>
      </div>

      {/* Custom Fonts and Animations */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@500;600;700&display=swap');
        
        @keyframes float {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          50% { 
            transform: translate(5px, 5px) scale(1.05);
            opacity: 0.8; 
          }
        }
        
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          background-color: #000;
        }
      `}</style>
    </div>
  );
};

export default SpotlightLanding;