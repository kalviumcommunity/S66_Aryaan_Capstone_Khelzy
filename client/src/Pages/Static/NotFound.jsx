import { useState, useEffect } from 'react';

const RetroGaming404 = () => {
  const [score, setScore] = useState(404);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 300);
    }, 5000);

    return () => clearInterval(glitchInterval);
  }, []);

  const handleRespawn = () => {
    window.history.back();
  };

  const handleMainMenu = () => {
    window.location.href = '/';
  };

  const handleHighScores = () => {
    alert('High Scores: \n1. Anonymous - 999999\n2. Player1 - 888888\n3. You - 404');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-black flex items-center justify-center relative overflow-hidden">
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
          40%, 43% { transform: translate3d(0,-15px,0); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        .animate-bounce-slow { animation: bounce-slow 2s infinite; }
        .animate-wiggle { animation: wiggle 1s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s infinite; }
        .animate-glitch { animation: glitch 0.3s infinite; }
        .animate-blink { animation: blink 1s infinite; }
      `}</style>
      
      {/* Pixel art decoration - top left */}
      <div className="absolute top-10 left-10 z-10">
        <div className="grid grid-cols-8 gap-px">
          <div className="w-3 h-3 bg-yellow-400"></div>
          <div className="w-3 h-3 bg-yellow-400"></div>
          <div className="w-3 h-3 bg-yellow-400"></div>
          <div className="w-3 h-3 bg-yellow-400"></div>
          <div className="w-3 h-3 bg-red-500"></div>
          <div className="w-3 h-3 bg-red-500"></div>
          <div className="w-3 h-3 bg-red-500"></div>
          <div className="w-3 h-3 bg-red-500"></div>
          <div className="w-3 h-3 bg-yellow-400"></div>
          <div className="w-3 h-3 bg-red-500"></div>
          <div className="w-3 h-3 bg-yellow-400"></div>
          <div className="w-3 h-3 bg-red-500"></div>
          <div className="w-3 h-3 bg-yellow-400"></div>
          <div className="w-3 h-3 bg-red-500"></div>
          <div className="w-3 h-3 bg-yellow-400"></div>
          <div className="w-3 h-3 bg-red-500"></div>
        </div>
      </div>

      {/* Pixel art decoration - top right */}
      <div className="absolute top-10 right-10 z-10">
        <div className="grid grid-cols-6 gap-px">
          <div className="w-3 h-3 bg-blue-500"></div>
          <div className="w-3 h-3 bg-purple-500"></div>
          <div className="w-3 h-3 bg-blue-500"></div>
          <div className="w-3 h-3 bg-purple-500"></div>
          <div className="w-3 h-3 bg-blue-500"></div>
          <div className="w-3 h-3 bg-purple-500"></div>
          <div className="w-3 h-3 bg-purple-500"></div>
          <div className="w-3 h-3 bg-blue-500"></div>
          <div className="w-3 h-3 bg-purple-500"></div>
          <div className="w-3 h-3 bg-blue-500"></div>
          <div className="w-3 h-3 bg-purple-500"></div>
          <div className="w-3 h-3 bg-blue-500"></div>
        </div>
      </div>
      
      {/* Power-up icons floating around */}
      <div className="absolute top-20 right-20 text-4xl animate-bounce-slow z-10">⭐</div>
      <div className="absolute bottom-32 left-20 text-3xl animate-wiggle z-10">💎</div>
      <div className="absolute top-1/2 right-10 text-2xl animate-pulse-slow z-10">🍄</div>
      <div className="absolute bottom-20 right-1/3 text-3xl animate-bounce-slow z-10">🔥</div>
      <div className="absolute top-1/3 left-10 text-2xl animate-wiggle z-10">⚡</div>
      
      {/* Main content */}
      <div className="text-center z-20 px-4 max-w-2xl mx-auto">
        
        {/* 404 Display */}
        <div 
          className={`text-8xl md:text-9xl font-bold text-red-500 mb-6 font-mono ${isGlitching ? 'animate-glitch' : 'animate-pulse'}`}
          style={{ 
            textShadow: '4px 4px 0px #000, 8px 8px 0px #333',
            letterSpacing: '-4px'
          }}
        >
          404
        </div>
        
        {/* Game Over Title */}
        <h1 
          className="text-4xl md:text-6xl font-bold text-yellow-400 mb-6 font-mono"
          style={{ textShadow: '2px 2px 0px #000' }}
        >
          GAME OVER
        </h1>
        
        {/* Game Status Display */}
        <div className="bg-black border-4 border-white p-6 mb-6 font-mono text-left max-w-md mx-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-green-400">LEVEL:</span>
            <span className="text-red-500 animate-blink">ERROR</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-blue-400">SCORE:</span>
            <span className="text-white">{score.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-red-400">LIVES:</span>
            <span className="text-red-500">0</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-yellow-400">STATUS:</span>
            <span className="text-red-500">PAGE NOT FOUND</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-purple-400">TIME:</span>
            <span className="text-white">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
        
        {/* Flavor text */}
        <p className="text-xl text-gray-300 mb-8 max-w-md mx-auto font-mono leading-relaxed">
          You've reached an uncharted level! This area is still under development by our pixel wizards.
        </p>
        
        {/* Action buttons */}
        <div className="space-y-6">
          {/* Primary button */}
          <button 
            onClick={handleRespawn}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-xl font-bold transform hover:scale-105 transition-all duration-300 shadow-lg font-mono border-2 border-green-300 active:scale-95"
            style={{ 
              boxShadow: 'inset 0 0 0 2px #000, 4px 4px 0 #000',
            }}
          >
            🎮 RESPAWN
          </button>
          
          {/* Secondary buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={handleMainMenu}
              className="border-4 border-blue-500 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 transition-all duration-300 font-mono transform hover:scale-105 active:scale-95"
              style={{ boxShadow: '4px 4px 0 #000' }}
            >
              🏠 MAIN MENU
            </button>
            <button 
              onClick={handleHighScores}
              className="border-4 border-purple-500 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 transition-all duration-300 font-mono transform hover:scale-105 active:scale-95"
              style={{ boxShadow: '4px 4px 0 #000' }}
            >
              🏆 HIGH SCORES
            </button>
          </div>
        </div>
        
        {/* Achievement unlock notification */}
        <div className="mt-8 bg-yellow-600 border-2 border-yellow-400 text-black px-4 py-2 font-mono text-sm inline-block">
          🏅 ACHIEVEMENT UNLOCKED: "Lost Explorer" - Found a hidden page!
        </div>
      </div>
      
      {/* Retro border frame */}
      <div className="absolute inset-4 border-2 border-purple-500 rounded animate-pulse opacity-30 pointer-events-none"></div>
      
      {/* Scanlines effect overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: `repeating-linear-gradient(
            0deg, 
            transparent, 
            transparent 2px, 
            rgba(0,255,0,0.03) 2px, 
            rgba(0,255,0,0.03) 4px
          )`
        }}
      ></div>
      
     
    </div>
  );
};

export default RetroGaming404;