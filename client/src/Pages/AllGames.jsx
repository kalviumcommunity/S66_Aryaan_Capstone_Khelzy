import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import GameCard from "../components/GameCard";
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Gamepad2, Grid3X3, Search, Filter, SortAsc } from 'lucide-react';
import { API_URL } from "../config";

function AllGames() {
  const { theme } = useTheme();
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [isFiltering, setIsFiltering] = useState(false); // New state for filter loading

  // Categories for filtering
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

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const startTime = Date.now();
        const response = await axios.get(`${API_URL}/games`, {
          withCredentials: true,
        });
        setGames(response.data.games);
        setFilteredGames(response.data.games);

        const elapsedTime = Date.now() - startTime;
        const remainingDelay = Math.max(0, 2000 - elapsedTime);
        setTimeout(() => {
          setLoading(false);
        }, remainingDelay);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Failed to fetch games:", err);
      }
    };
    fetchGames();
  }, []);

  // Filter and sort games
  useEffect(() => {
    const filterGames = async () => {
      setIsFiltering(true);
      
      // Simulate processing time for smoother UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filtered = games;

      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(game =>
          game.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          game.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Filter by category
      if (selectedCategory !== "all") {
        filtered = filtered.filter(game =>
          game.category?.toLowerCase() === selectedCategory.toLowerCase()
        );
      }

      // Sort games
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "name":
            return (a.title || "").localeCompare(b.title || "");
          case "popularity":
            return (b.plays || 0) - (a.plays || 0);
          case "newest":
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
          default:
            return 0;
        }
      });

      setFilteredGames(filtered);
      setIsFiltering(false);
    };

    filterGames();
  }, [games, searchTerm, selectedCategory, sortBy]);

  if (loading) {
    return (
      <div className={`min-h-screen ${theme.background}`}>
        <Header />
        <div className="flex flex-col justify-center items-center h-screen">
          <div className="w-102 h-102 mb-4">
            <DotLottieReact
              src="https://lottie.host/012ee33b-d9b9-443f-975a-62aad5995217/S8sXukPLpf.lottie"
              loop
              autoplay
              className="w-full h-full"
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-lg ${theme.secondary} font-medium`}
          >
            Loading amazing games...
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${theme.background}`}>
        <Header />
        <div className="container mx-auto px-6 pt-28">
          <div className={`text-center py-16 ${theme.cardBg} rounded-2xl border-2 ${theme.border}`}>
            <div className="text-6xl mb-4">😞</div>
            <h2 className={`text-2xl font-bold mb-2 ${theme.primary}`}>Oops! Something went wrong</h2>
            <p className={`${theme.secondary} mb-6`}>Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#06c1ff] text-white rounded-xl hover:bg-[#06c1ff]/80 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.background} ${theme.primary} transition-colors duration-300`}>
      <Header />
      
      <main className="container mx-auto px-6 pt-28 pb-16 max-w-7xl">
        {/* Page Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <Gamepad2 className="text-[#06c1ff]" size={32} />
            <h1 className={`text-4xl font-bold ${theme.primary}`}>All Games</h1>
          </div>
          <p className={`text-lg ${theme.secondary} max-w-2xl`}>
            Discover our complete collection of games. From action-packed adventures to mind-bending puzzles, 
            find your next favorite game here.
          </p>
        </motion.section>

        {/* Search and Filters */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search Bar */}
            <div className="md:col-span-6 relative">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${theme.muted}`} size={20} />
              <input
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl ${theme.cardBg} ${theme.border} border-2 ${theme.primary} placeholder-${theme.muted} focus:border-[#06c1ff]/50 focus:outline-none transition-colors`}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-3 relative">
              <SortAsc className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${theme.muted}`} size={20} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl ${theme.cardBg} ${theme.border} border-2 ${theme.primary} focus:border-[#06c1ff]/50 focus:outline-none transition-colors appearance-none cursor-pointer`}
              >
                <option value="name">Sort by Name</option>
                <option value="popularity">Sort by Popularity</option>
                <option value="newest">Sort by Newest</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="md:col-span-3 flex items-center justify-center md:justify-end">
              <div className={`px-4 py-3 rounded-xl ${theme.cardBg} ${theme.border} border-2`}>
                <span className={`text-sm ${theme.secondary}`}>
                  {filteredGames.length} game{filteredGames.length !== 1 ? 's' : ''} found
                </span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Categories Filter */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <Filter className="text-[#06c1ff]" size={20} />
            <h2 className={`text-xl font-bold ${theme.primary}`}>Categories</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2.5 hide-scrollbar">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`min-w-[120px] py-3 px-4 rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-2 border-2 ${
                  selectedCategory === category.id
                    ? `bg-[#06c1ff]/10 border-[#06c1ff]/50 text-[#06c1ff]`
                    : `${theme.cardBg} ${theme.border} ${theme.secondary} hover:bg-[#06c1ff]/5 hover:border-[#06c1ff]/20 hover:text-[#06c1ff]`
                }`}
              >
                <div className="text-2xl">{category.icon}</div>
                <div className="text-sm font-medium whitespace-nowrap">{category.name}</div>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Games Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <Grid3X3 className="text-[#06c1ff]" size={24} />
            <h2 className={`text-xl font-bold ${theme.primary}`}>
              {selectedCategory === "all" ? "All Games" : 
               categories.find(cat => cat.id === selectedCategory)?.name || "Games"}
            </h2>
          </div>

          {filteredGames.length === 0 ? (
            <div className={`text-center py-16 ${theme.cardBg} rounded-2xl border-2 ${theme.border}`}>
              <div className="text-6xl mb-4">🎮</div>
              <h3 className={`text-xl font-bold mb-2 ${theme.primary}`}>No games found</h3>
              <p className={`${theme.secondary} mb-6`}>
                {searchTerm || selectedCategory !== "all" 
                  ? "Try adjusting your search or filter criteria."
                  : "No games available at the moment."}
              </p>
              {(searchTerm || selectedCategory !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                  className="px-6 py-3 bg-[#06c1ff] text-white rounded-xl hover:bg-[#06c1ff]/80 transition-colors font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {isFiltering ? (
                // Loading skeleton
                Array.from({ length: 12 }).map((_, index) => (
                  <motion.div
                    key={`skeleton-${index}`}
                    className={`rounded-xl ${theme.cardBg} ${theme.border} border-2 aspect-[3/4] animate-pulse`}
                  >
                    <div className="w-full aspect-video bg-gray-200/10 rounded-t-lg" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200/10 rounded w-2/3" />
                      <div className="h-3 bg-gray-200/10 rounded w-1/2" />
                    </div>
                  </motion.div>
                ))
              ) : (
                filteredGames.map((game, index) => (
                  <motion.div
                    key={game._id || game.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (index % 12) }}
                  >
                    <GameCard game={game} />
                  </motion.div>
                ))
              )}
            </div>
          )}
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}

export default AllGames;