import React, { useEffect, useState } from 'react'
import axios from 'axios'
import GameCard from './GameCard'
import { useParams, Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import Header from './Header'
import { Gamepad, ChevronRight } from 'lucide-react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { API_URL } from '../config'

function GameByTag() {
  const { category } = useParams()
  const { theme } = useTheme()
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchGames = async () => {
      try {
        const startTime = Date.now()
        const response = await axios.get(`${API_URL}/games/filter/${category}`, {
          withCredentials: true,
        })
        
        // Add minimum delay of 800ms for loading
        const elapsedTime = Date.now() - startTime
        const remainingDelay = Math.max(0, 3000 - elapsedTime)
        
        setTimeout(() => {
          setGames(response.data.games || [])
          setLoading(false)
        }, remainingDelay)

      } catch (error) {
        console.error("Failed to get the game",error.message)
        setGames([])
        setError(error.response?.data?.message || 'Failed to load game.Please try again later.')
        setLoading(false)
      }
    }
    fetchGames()
  }, [category])

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
  
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${theme.background}`}>
      <Header />
      <div className="max-w-7xl mx-auto px-4 pt-28 pb-16">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[#06c1ff]/70 mb-6 text-sm">
          <Link to="/home" className="hover:text-[#06c1ff] transition-colors">
            Games
          </Link>
          <ChevronRight size={16} />
          <span className="text-[#06c1ff] font-medium">{category}</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#06c1ff]/20 rounded-lg">
              <Gamepad size={24} className="text-[#06c1ff]" />
            </div>
            <h1 className={`text-3xl font-bold ${theme.primary}`}>
              {category} Games
            </h1>
          </div>
          <p className={`${theme.secondary}`}>
            Browse our collection of {category.toLowerCase()} games
          </p>
        </div>

        {/* Games Grid */}
        {error ? (
          <div className={`rounded-2xl ${theme.cardBg} ${theme.border} border-2 p-8 text-center`}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className={`text-xl font-semibold ${theme.primary} mb-2`}>
              Error Loading Games
            </h3>
            <p className={`${theme.secondary}`}>
              {error}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-[#06c1ff] text-white rounded-lg hover:bg-[#06c1ff]/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : games.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {games.map((game) => (
              <GameCard key={game._id} game={game} />
            ))}
          </div>
        ) : (
          <div className={`rounded-2xl ${theme.cardBg} ${theme.border} border-2 p-8 text-center`}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#06c1ff]/20 flex items-center justify-center">
              <Gamepad className="w-8 h-8 text-[#06c1ff]" />
            </div>
            <h3 className={`text-xl font-semibold ${theme.primary} mb-2`}>
              No Games Found
            </h3>
            <p className={`${theme.secondary}`}>
              We couldn't find any games in the {category} category.
              Try checking out other categories.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default GameByTag