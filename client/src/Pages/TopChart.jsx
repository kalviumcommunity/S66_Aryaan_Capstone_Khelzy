import { useState, useEffect } from 'react';
import GameCard from '../components/GameCard';
import Header from '../components/Header';
import { useTheme } from '../context/ThemeContext';
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { API_URL } from '../config';

const TopChart = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'weekly', 'monthly', 'today'
  const [error, setError] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchGameCounts = async () => {
      try {
        const startTime = Date.now()
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_URL}/games/counts`);
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        const data = await response.json();
        const gamesWithCounts = data.success ? data.games : [];
        
        // Sort games by count in descending order
        const sortedGames = gamesWithCounts.sort((a, b) => (b.count || 0) - (a.count || 0));
        
        // Filter based on time period
        let filteredGames = sortedGames;
        const currentDate = new Date();
        
        if (timeFilter === 'today') {
          const oneDayAgo = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
          filteredGames = sortedGames.filter(game => new Date(game.updatedAt) >= oneDayAgo);
        } else if (timeFilter === 'weekly') {
          const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
          filteredGames = sortedGames.filter(game => new Date(game.updatedAt) >= oneWeekAgo);
        } else if (timeFilter === 'monthly') {
          const oneMonthAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
          filteredGames = sortedGames.filter(game => new Date(game.updatedAt) >= oneMonthAgo);
        }

        // Fetch full game details for the filtered games
        const gameDetailsPromises = filteredGames.map(async (game) => {
          const detailResponse = await fetch(`${API_URL}/games/${game._id}`);
          if (!detailResponse.ok) return null;
          const detailData = await detailResponse.json();
          return {
            ...detailData.game,
            count: game.count || 0
          };
        });
        const gameDetails = await Promise.all(gameDetailsPromises);
        const elapsedTime = Date.now() - startTime
        const remainingDelay = Math.max(0, 3000 - elapsedTime)
        setTimeout(() => {
          setGames(gameDetails.filter(game => game !== null));
          setLoading(false)
        }, remainingDelay)

      } catch (error) {
        setError(error.message);
        setLoading(false)
      } 
    };

    fetchGameCounts();
  }, [timeFilter]);

  const timeFilterButtons = [
    { id: 'today', label: 'Today' },
    { id: 'weekly', label: 'This Week' },
    { id: 'monthly', label: 'This Month' },
    { id: 'all', label: 'All Time' }
  ];

  if (loading) {
    return (
     <div className={`min-h-screen ${theme.background}`}>
        <Header />
        <div className="flex flex-col justify-center items-center h-screen">
          <div className="w-96 h-96 mb-4"> 
            <DotLottieReact
              src="https://lottie.host/012ee33b-d9b9-443f-975a-62aad5995217/S8sXukPLpf.lottie"
              loop
              autoplay
              className="w-full h-full"
              onError={() => {console.error("Failed to load animation");
                setError("Failed to load animation. Please refresh the page.");
              }}
              fallback={<div className="animate-pulse bg-gray-300 w-full h-full rounded-lg"></div>}
            />
          </div>
  
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${theme.background}`}>
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.background}`}>
      <Header />
        <div className="max-w-7xl mx-auto px-4 pt-28 pb-16">
        <div className="mb-12">
          <h1 className={`text-4xl font-bold ${theme.primary} mb-6 relative pl-6`}>
            <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-12 bg-[#06c1ff] rounded"></span>
            Top Charts
          </h1>
          
          <div className="flex flex-wrap gap-4">
            {timeFilterButtons.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setTimeFilter(id)}
                className={`px-6 py-2.5 rounded-full font-semibold text-sm uppercase tracking-wider transition-all duration-300 ${
                  timeFilter === id 
                    ? 'bg-[#06c1ff] text-[#0b2d72] shadow-lg shadow-[#06c1ff]/20' 
                    : `${theme.cardBg} text-[#06c1ff] border-2 border-[#06c1ff]/30 hover:bg-[#06c1ff]/10`
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {games.map((game, index) => (
            <div key={game._id || index} className="relative">
              {index < 3 && (
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#06c1ff] text-[#0b2d72] rounded-full flex items-center justify-center font-bold z-10 shadow-lg">
                  #{index + 1}
                </div>
              )}
              <div className="absolute top-0 right-0 bg-[#06c1ff] text-[#0b2d72] px-3 py-1 text-sm font-semibold rounded-bl-lg rounded-tr-xl z-10">
                {game.count} plays
              </div>
              <div className={`rounded-2xl overflow-hidden shadow-lg hover:shadow-[#06c1ff]/10 ${theme.cardBg} backdrop-blur-sm ${theme.border} border-2 hover:border-[#06c1ff]/30 transition-all duration-300`}>
                <GameCard game={game} />
              </div>
            </div>
          ))}
        </div>

        {games.length === 0 && (
          <div className="text-center py-16">
            <p className={`${theme.secondary} text-lg`}>No games found for this time period</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopChart;