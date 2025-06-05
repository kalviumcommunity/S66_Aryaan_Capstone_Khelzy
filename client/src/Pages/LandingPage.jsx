import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gamepad, ChevronRight, Star, TrendingUp, Award, Users, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


function LandingPage() {
  const [theme, setTheme] = useState({
    background: 'bg-[#080f1d]',
    primary: 'text-white',
    secondary: 'text-gray-300',
    muted: 'text-gray-500',
    cardBg: 'bg-[#111827]/80',
    border: 'border-[#1f2937]',
    accent: 'text-[#06c1ff]'
  });
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredGame, setHoveredGame] = useState(null);
  const navigate = useNavigate()
  
  // Featured Games
  const featured = [
    { 
      id: 1, 
      title: "Galaxy Racers", 
      image: "/api/placeholder/800/400", 
      description: "Race through space in this futuristic multiplayer racing game!",
      category: "Racing"
    },
    { 
      id: 2, 
      title: "Dungeon Hunters", 
      image: "/api/placeholder/800/400", 
      description: "Explore dangerous dungeons and fight epic monsters!",
      category: "Adventure"
    },
    { 
      id: 3, 
      title: "Pixel Battles", 
      image: "/api/placeholder/800/400", 
      description: "Retro-style multiplayer battle arena with unique characters!",
      category: "Action"
    }
  ];
  
  // Popular Games
  const popularGames = [
    { 
      id: 1, 
      title: "Space Odyssey", 
      category: "Adventure", 
      rating: 4.8, 
      imageUrl: "/api/placeholder/320/180",
      plays: "120K" 
    },
    { 
      id: 2, 
      title: "Medieval Conquest", 
      category: "Strategy", 
      rating: 4.5, 
      imageUrl: "/api/placeholder/320/180",
      plays: "95K" 
    },
    { 
      id: 3, 
      title: "Neon Racer", 
      category: "Racing", 
      rating: 4.7, 
      imageUrl: "/api/placeholder/320/180",
      plays: "150K" 
    },
    { 
      id: 4, 
      title: "Block Puzzle", 
      category: "Puzzle", 
      rating: 4.2, 
      imageUrl: "/api/placeholder/320/180",
      plays: "200K" 
    },
    { 
      id: 5, 
      title: "Wild West", 
      category: "RPG", 
      rating: 4.6, 
      imageUrl: "/api/placeholder/320/180",
      plays: "78K" 
    },
    { 
      id: 6, 
      title: "Zombie Survival", 
      category: "Action", 
      rating: 4.9, 
      imageUrl: "/api/placeholder/320/180",
      plays: "180K" 
    }
  ];
  
  // Trending games
  const trending = [
    { id: 1, title: "Space Odyssey", plays: "120K", change: "+20%" },
    { id: 2, title: "Neon Racer", plays: "150K", change: "+15%" },
    { id: 3, title: "Block Puzzle", plays: "200K", change: "+12%" },
  ];
  
  // Categories
  const categories = [
    { icon: "🎮", name: "All Games", id: "all" },
    { icon: "🔫", name: "Action", id: "action" },
    { icon: "🧩", name: "Puzzle", id: "puzzle" },
    { icon: "🏎️", name: "Racing", id: "racing" },
    { icon: "⚔️", name: "Adventure", id: "adventure" },
    { icon: "🏀", name: "Sports", id: "sports" },
  ];
  
  // Auto-advance featured carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featured.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [featured.length]);

  const homePage=()=>{
    navigate('/home')
  }
  
  // Hero Game Card Component
  const HeroGameCard = ({ game, index }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`${theme.cardBg} backdrop-blur-sm ${theme.border} border-2 rounded-2xl overflow-hidden hover:border-[#06c1ff]/30 hover:shadow-lg hover:shadow-[#06c1ff]/10 transition-all duration-300 group`}
      onMouseEnter={() => setHoveredGame(game.id)}
      onMouseLeave={() => setHoveredGame(null)}
    >
      <div className="aspect-[16/9] relative">
        <img 
          src={game.imageUrl} 
          alt={game.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
          <div className="w-full">
            <span className={`bg-[#06c1ff]/20 text-[#06c1ff] px-2 py-1 rounded-full text-xs font-medium`}>
              {game.category}
            </span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-white font-bold">{game.plays} plays</span>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#06c1ff] text-[#0b2d72] px-3 py-1 rounded-lg text-sm font-medium"
              >
                Play Now
              </motion.button>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className={`font-semibold ${theme.primary} group-hover:text-[#06c1ff] transition-colors`}>
          {game.title}
        </h3>
        <div className="flex items-center gap-1 mt-1">
          <Star size={14} fill="currentColor" className="text-[#06c1ff]" />
          <span className={theme.secondary}>{game.rating}</span>
        </div>
      </div>
    </motion.div>
  );
  
  return (
    <div className={`min-h-screen ${theme.background} ${theme.primary} transition-colors duration-300`}>
      {/* Header with blurred effect */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#080f1d]/80 border-b border-[#1f2937]">
        <div className="container mx-auto px-6 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              
              <div 
              className="flex items-center gap-3 cursor-pointer shrink-0"
              onClick={() => navigate('/home')}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                <svg width="100%" height="100%" viewBox="-50 -50 100 100">
                  <defs>
                    <linearGradient id="cosmic1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#06c1ff' }} />
                      <stop offset="100%" style={{ stopColor: '#0b8fd8' }} />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <circle cx="0" cy="0" r="50" fill="url(#cosmic1)" filter="url(#glow)"/>
                  <path d="M 0 0 Q 15 -15 25 0 Q 15 25 -10 15 Q -25 -5 -15 -20 Q 5 -25 20 -10" 
                        fill="none" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                  <circle cx="0" cy="0" r="4" fill="white"/>
                  <circle cx="18" cy="-8" r="2" fill="white"/>
                  <circle cx="-12" cy="10" r="2" fill="white"/>
                </svg>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-[#06c1ff] to-[#0b8fd8] bg-clip-text text-transparent">
                Khelzy
              </span>
            </div>

            </div>
            
            <div className="flex items-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden md:block px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-300"
              >
                Sign In
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-[#06c1ff] text-[#0b2d72] rounded-lg font-medium transition-all duration-300"
              >
                Play Now
              </motion.button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        {/* Animated background with elements */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#06c1ff]/10 rounded-full blur-3xl"></div>
          <div className="absolute top-40 -right-20 w-80 h-80 bg-[#06c1ff]/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block px-4 py-2 rounded-full bg-[#06c1ff]/10 border border-[#06c1ff]/30 text-[#06c1ff] text-sm font-medium mb-6">
                The Ultimate Gaming Experience
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Play Amazing Games <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#06c1ff] to-white">
                  Anytime, Anywhere
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-lg">
                Discover thousands of free-to-play browser games. No downloads required - just click and start playing instantly!
              </p>
              <div className="flex flex-wrap gap-4" onClick={()=>homePage()}>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-[#06c1ff] text-[#0b2d72] rounded-xl font-bold text-lg shadow-lg shadow-[#06c1ff]/20 flex items-center gap-2"
                >
                  Browse Games
                  <ChevronRight size={20} />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-lg border border-white/20 hover:bg-white/20 transition-colors duration-300"
                >
                  Top Charts
                </motion.button>
              </div>
              
              <div className="flex items-center gap-8 mt-12">
                <div>
                  <p className="text-3xl font-bold text-[#06c1ff]">500+</p>
                  <p className="text-gray-400">Games</p>
                </div>
                <div className="h-10 w-px bg-gray-700"></div>
                <div>
                  <p className="text-3xl font-bold text-[#06c1ff]">10M+</p>
                  <p className="text-gray-400">Players</p>
                </div>
                <div className="h-10 w-px bg-gray-700"></div>
                <div>
                  <p className="text-3xl font-bold text-[#06c1ff]">4.8</p>
                  <p className="text-gray-400">Rating</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              {/* Featured game carousel */}
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <motion.div
                  animate={{ 
                    x: `-${currentSlide * 100}%` 
                  }}
                  transition={{ type: "tween", ease: "easeInOut", duration: 0.8 }}
                  className="flex w-full"
                >
                  {featured.map((item, index) => (
                    <div key={item.id} className="min-w-full">
                      <div className="relative aspect-[16/9]">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#080f1d] via-[#080f1d]/50 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8">
                          <span className="bg-[#06c1ff]/20 text-[#06c1ff] px-3 py-1 rounded-full text-sm font-medium mb-3 inline-block">
                            {item.category}
                          </span>
                          <h2 className="text-3xl font-bold mb-2 text-white">{item.title}</h2>
                          <p className="text-lg text-gray-200 mb-4">{item.description}</p>
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-2 bg-[#06c1ff] text-[#0b2d72] rounded-lg font-bold shadow-lg shadow-[#06c1ff]/20 flex items-center gap-2"
                          >
                            Play Now
                            <ChevronRight size={18} />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
                
                {/* Carousel indicators */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  {featured.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        currentSlide === index ? 'bg-[#06c1ff] w-6' : 'bg-white/30 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-[#06c1ff]/30 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#06c1ff]/20 rounded-full blur-3xl -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Gamepad className={theme.accent} size={24} />
              <h2 className="text-2xl font-bold">Game Categories</h2>
            </div>
            <button className="text-sm font-medium text-[#06c1ff] hover:underline transition-colors flex items-center gap-1">
              View All <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
            {categories.map((category, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className={`min-w-[150px] py-6 px-4 rounded-xl cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3 border-2 ${theme.cardBg} ${theme.border} hover:bg-[#06c1ff]/5 hover:border-[#06c1ff]/20 hover:text-[#06c1ff]`}
              >
                <div className="text-3xl mb-1">{category.icon}</div>
                <div className="text-sm font-medium">{category.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Popular Games Section */}
      <section className="py-16 relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-32 w-64 h-64 bg-[#06c1ff]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#06c1ff]/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <Flame className="text-[#06c1ff]" size={24} />
              <h2 className="text-2xl font-bold">Popular Games</h2>
            </div>
            <button className="text-sm font-medium text-[#06c1ff] hover:underline transition-colors flex items-center gap-1">
              View All <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {popularGames.map((game, index) => (
              <HeroGameCard key={game.id} game={game} index={index} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Stats & CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#06c1ff]/5 skew-y-3 transform -translate-y-1/2"></div>
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stats & Trending */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Stats Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className={`${theme.cardBg} backdrop-blur-sm ${theme.border} border-2 rounded-2xl p-6 shadow-lg hover:shadow-[#06c1ff]/10 hover:border-[#06c1ff]/30 transition-all duration-300`}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Users className="text-[#06c1ff]" size={20} />
                    <h3 className="font-bold">Player Stats</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-[#06c1ff]/10 rounded-lg p-4 text-center">
                      <p className="text-[#06c1ff] text-2xl font-bold">10M+</p>
                      <p className="text-sm text-gray-400">Active Players</p>
                    </div>
                    <div className="bg-[#06c1ff]/10 rounded-lg p-4 text-center">
                      <p className="text-[#06c1ff] text-2xl font-bold">45M+</p>
                      <p className="text-sm text-gray-400">Games Played</p>
                    </div>
                    <div className="bg-[#06c1ff]/10 rounded-lg p-4 text-center">
                      <p className="text-[#06c1ff] text-2xl font-bold">500+</p>
                      <p className="text-sm text-gray-400">Games</p>
                    </div>
                    <div className="bg-[#06c1ff]/10 rounded-lg p-4 text-center">
                      <p className="text-[#06c1ff] text-2xl font-bold">24/7</p>
                      <p className="text-sm text-gray-400">Support</p>
                    </div>
                  </div>
                </motion.div>
                
                {/* Trending Games Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className={`${theme.cardBg} backdrop-blur-sm ${theme.border} border-2 rounded-2xl p-6 shadow-lg hover:shadow-[#06c1ff]/10 hover:border-[#06c1ff]/30 transition-all duration-300`}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="text-[#06c1ff]" size={20} />
                    <h3 className="font-bold">Trending Now</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {trending.map((game, index) => (
                      <motion.div 
                        key={game.id} 
                        className={`flex items-center justify-between p-3 rounded-xl ${theme.cardBg} hover:bg-[#06c1ff]/5 transition-all duration-300 cursor-pointer`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-[#06c1ff] opacity-80 text-sm font-medium">#{index + 1}</span>
                          <span className="font-medium">{game.title}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-400">{game.plays}</span>
                          <span className="text-xs text-[#06c1ff]">{game.change}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* CTA Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#06c1ff]/20 to-[#06c1ff]/5 backdrop-blur-md rounded-2xl p-8 border border-[#06c1ff]/30 shadow-lg relative overflow-hidden"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#06c1ff]/30 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-[#06c1ff]/20 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-[#06c1ff] flex items-center justify-center mb-6">
                  <Award className="text-[#0b2d72]" size={24} />
                </div>
                
                <h3 className="text-2xl font-bold mb-4">Ready to Join the Fun?</h3>
                <p className="text-gray-300 mb-8">
                  Sign up now and get access to exclusive games, track your achievements, and compete with friends.
                </p>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-3 bg-[#06c1ff] text-[#0b2d72] rounded-xl font-bold text-lg shadow-lg shadow-[#06c1ff]/20 mb-4"
                >
                  Create Account
                </motion.button>
                
                <button className="w-full py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-medium hover:bg-white/20 transition-colors duration-300">
                  Learn More
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t border-[#1f2937]">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div 
              className="flex items-center gap-3 cursor-pointer shrink-0"
              onClick={() => navigate('/home')}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                <svg width="100%" height="100%" viewBox="-50 -50 100 100">
                  <defs>
                    <linearGradient id="cosmic1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#06c1ff' }} />
                      <stop offset="100%" style={{ stopColor: '#0b8fd8' }} />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <circle cx="0" cy="0" r="50" fill="url(#cosmic1)" filter="url(#glow)"/>
                  <path d="M 0 0 Q 15 -15 25 0 Q 15 25 -10 15 Q -25 -5 -15 -20 Q 5 -25 20 -10" 
                        fill="none" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                  <circle cx="0" cy="0" r="4" fill="white"/>
                  <circle cx="18" cy="-8" r="2" fill="white"/>
                  <circle cx="-12" cy="10" r="2" fill="white"/>
                </svg>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-[#06c1ff] to-[#0b8fd8] bg-clip-text text-transparent">
                Khelzy
              </span>
            </div>
              </div>
              <p className="text-gray-400 mb-6">
                The ultimate destination for free browser-based games. Play instantly with no downloads required.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-[#06c1ff] transition-colors">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#06c1ff] transition-colors">Top Charts</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#06c1ff] transition-colors">New Games</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#06c1ff] transition-colors">Categories</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#06c1ff] transition-colors">About Us</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-[#06c1ff] transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#06c1ff] transition-colors">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#06c1ff] transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#06c1ff] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#06c1ff] transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            
          </div>
          
          <div className="border-t border-[#1f2937] pt-8 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} GameVault. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;