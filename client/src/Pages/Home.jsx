import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GameCard from '../components/GameCard';
import { Gamepad, Flame, Star, TrendingUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { API_URL } from '../config';

// Featured Games Carousel
const FeaturedGames = () => {
  const featured = [
    { id: 1, title: "Smash Karts", image: "https://imgs.search.brave.com/0ogJNo2DsdXVOob4oH-YXCgInkZsVzecV132tNRL4xk/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWdz/LnNlYXJjaC5icmF2/ZS5jb20vOUFCUlA5/cXh5eUFheGFpbU90/VWZoRUhNVnlueGtP/U3F4M3dBWUV2bFp6/dy9yczpmaXQ6NTAw/OjA6MDowL2c6Y2Uv/YUhSMGNITTZMeTl6/ZEdGMC9hV011ZDJs/cmFXRXVibTlqL2Iy/OXJhV1V1Ym1WMEwz/TnQvWVhOb0xXdGhj/blJ6TDJsdC9ZV2Rs/Y3k5bEwyVTJMMU5w/L2RHVXRiRzluYnk1/d2JtY3YvY21WMmFY/TnBiMjR2YkdGMC9a/WE4wUDJOaVBUSXdN/akV4L01qQXpNakl5/TnpVMA.jpeg", description: "Race against players worldwide!" },
    { id: 2, title: "Temple Run", image: "https://placehold.co/800x400/0b2d72/06c1ff", description: "Run, jump and slide to escape!" },
    { id: 3, title: "Subway Surfers", image: "https://placehold.co/800x400/0b2d72/06c1ff", description: "Endless running adventure!" }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const { theme } = useTheme();

    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featured.length);
      }, 5000);
      
      return () => clearInterval(timer);
    }, [featured.length]);

  return (
    <div className={`relative overflow-hidden rounded-2xl shadow-lg hover:shadow-[#06c1ff]/10 ${theme.cardBg} backdrop-blur-sm ${theme.border} border-2 hover:border-[#06c1ff]/30 transition-all duration-300`}>
      <div className="aspect-[21/9] relative overflow-hidden">
        <AnimatePresence initial={false} custom={currentSlide}>
          <motion.div
            key={currentSlide}
            custom={currentSlide}
            initial={{ x: 500 }}
            animate={{ x: 0 }}
            exit={{ x: -500 }}
            transition={{ 
              type: "tween", 
              ease: "easeInOut", 
              duration: 0.5
            }}
            className="absolute inset-0 w-full"
          >
            <div className="relative h-full">
              <img 
                src={featured[currentSlide].image} 
                alt={featured[currentSlide].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b2d72]/90 via-[#0b2d72]/50 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <h2 className="text-3xl font-bold mb-2 text-white">{featured[currentSlide].title}</h2>
                <p className="text-lg text-gray-200">{featured[currentSlide].description}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
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
  );
};

// Enhanced Categories component
const Categories = () => {
  const { theme } = useTheme();
  const categories = [
    { icon: "🎮", name: "All Games", id: "all" },
    { icon: "🔫", name: "Action", id: "action" },
    { icon: "🧩", name: "Puzzle", id: "puzzle" },
    { icon: "🏎️", name: "Racing", id: "racing" },
    { icon: "⚔️", name: "Adventure", id: "adventure" },
    { icon: "🏀", name: "Sports", id: "sports" },
    { icon: "🎯", name: "Arcade", id: "arcade" },
    { icon: "🎲", name: "Board", id: "board" },
    { icon: "🎭", name: "RPG", id: "rpg" },
    { icon: "🏰", name: "Strategy", id: "strategy" }
  ];
  
  return (
    <section className="py-6">
      <div className="flex items-center gap-2 mb-4">
        <Gamepad className={theme.accent} size={24} />
        <h2 className={`text-xl font-bold ${theme.primary}`}>Categories</h2>
      </div>      <div className="flex gap-4 overflow-x-auto pb-2.5 hide-scrollbar">
        {categories.map((category, index) => (
          <motion.div 
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`min-w-[120px] py-3 px-4 rounded-xl cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2 border-2 ${theme.cardBg} ${theme.border} ${theme.secondary} hover:bg-[#06c1ff]/5 hover:border-[#06c1ff]/20 hover:text-[#06c1ff]`}
           
          >
            <div className="text-2xl">{category.icon}</div>
            <div className="text-sm font-medium">{category.name}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};



// Enhanced GameGrid component
const GameGrid = () => {
  const { theme } = useTheme();
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(`${API_URL}/games`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch games');
        }
        
        const data = await response.json();
        setGames(data.games || []);
      } catch (error) {
        setError('Failed to fetch games');
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, []);

  

  return (    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
     
      {error && <div className="text-red-500">{error}</div>}
      {!error && games.length === 0 && <div>Loading games...</div>}
      {Array.isArray(games) && games.map(game => (
        <GameCard key={game._id} game={game}></GameCard>
      ))}
    </div>
  );
};

// Trending Section
const TrendingGames = () => {
  const { theme } = useTheme();
  const trending = [
    { id: 1, title: "Tetris", plays: "40K", change: "+15%" },
    { id: 2, title: "Subway Surfers", plays: "50K", change: "+12%" },
    { id: 3, title: "Temple Run", plays: "30K", change: "+10%" },
  ];

  return (
    <div className={`p-6 rounded-2xl shadow-lg hover:shadow-[#06c1ff]/10 ${theme.cardBg} backdrop-blur-sm ${theme.border} border-2 hover:border-[#06c1ff]/30 transition-all duration-300`}>
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="text-[#06c1ff]" size={20} />
        <h3 className={`font-bold ${theme.primary}`}>Trending Now</h3>
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
              <span className={`font-medium ${theme.secondary}`}>{game.title}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm ${theme.muted}`}>{game.plays}</span>
              <span className="text-xs text-[#06c1ff]">{game.change}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

function Home() {
  
  const { theme } = useTheme();
  


  return (
    <div className={`min-h-screen ${theme.background} ${theme.primary} transition-colors duration-300`}>
      <Header />
      
      <main className="container mx-auto px-6 pt-28 pb-16 max-w-7xl">
        {/* Featured Games Section */}
        <section className="mb-12">
          <FeaturedGames />
        </section>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-9">
            {/* Categories Section */}
            <section className="mb-12">
              <Categories/>
            </section>
            
            {/* Popular Games Section */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Flame className={theme.accent} size={24} />
                  <h2 className={`text-xl font-bold ${theme.primary}`}>Popular Games</h2>
                </div>
                <Link to='/games'>
                <button className={`text-sm font-medium ${theme.accent} hover:${theme.accentHover} transition-colors cursor-pointer`}>
                  View All
                </button>
                </Link>
              </div>
              <GameGrid />
            </section>
          </div>
          
          {/* Right Column - Sidebar */}
          <div className="lg:col-span-3 space-y-8">
            <TrendingGames />
            {/* Add more sidebar components here */}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Home;