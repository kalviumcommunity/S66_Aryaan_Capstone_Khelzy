import axios from 'axios'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import { API_URL } from '../../config'
import GameCard from '../../components/common/GameCard'
import Header from '../../components/Header'
import Footer from '../../components/common/Footer'
import { useTheme } from '../../context/ThemeContext'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

function FavGames() {
    const { theme } = useTheme()
    const [games, setGames] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    
    useEffect(() => {
        const fetchGames = async () => {
            try {
                const startTime = Date.now()
                const response = await axios.get(`${API_URL}/favo/liked`,
                    { withCredentials: true }
                )
                setGames(response.data.games)
                
                const elapsedTime = Date.now() - startTime
                const remainingDelay = Math.max(0, 2000 - elapsedTime)
                setTimeout(() => {
                    setLoading(false)
                }, remainingDelay)
            } catch (error) {
                setError(error.message)
                setLoading(false)
                console.error("Failed to fetch favorite games:", error)
            }
        }

        fetchGames()
    }, [])

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
                            onError={() => {
                                console.error("Failed to load animation")
                                setError("Failed to load animation. Please refresh the page.")
                            }}
                            fallback={<div className="animate-pulse bg-gray-300 w-full h-full rounded-lg"></div>}
                        />
                    </div>
                    <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-lg ${theme.secondary} font-medium`}
          >
            Loading favorite games...
          </motion.div>
                </div>
            </div>
        )
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
        )
    }

    return (
        <div className={`min-h-screen ${theme.background}`}>
            <Header />
            <div className="max-w-7xl mx-auto px-4 pt-28 pb-16">
                <div className="mb-12">
                    <h1 className={`text-4xl font-bold ${theme.primary} mb-6 relative pl-6`}>
                        <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-12 bg-[#06c1ff] rounded"></span>
                        Favorite Games
                    </h1>
                </div>

                {games.length === 0 ? (
                    <div className="text-center py-16">
                        <p className={`${theme.secondary} text-lg`}>No favorite games yet!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {games.map((game) => (
                            <div key={game._id}>
                                <div className={`rounded-2xl overflow-hidden shadow-lg hover:shadow-[#06c1ff]/10 ${theme.cardBg} backdrop-blur-sm ${theme.border} border-2 hover:border-[#06c1ff]/30 transition-all duration-300`}>
                                    <GameCard game={game} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}

export default FavGames