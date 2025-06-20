import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Play, Star, Eye } from 'lucide-react';
import { API_URL } from '../config';
import axios from 'axios'

const GameCard = ({game}) => {
  const [localCount, setLocalCount] = useState(game.count);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = async (e) => {
    e.preventDefault();
    if (!game._id) return;

    try {
      const response = await axios.put(`${API_URL}/games/${game._id}/count`, {
          withCredentials: true
      });
      
      if (response.ok) {
        setLocalCount(prev=>prev+1);
      }
      
      // Navigate to game details page
      navigate(`/games/${game._id}`);
    } catch (error) {
      console.error('Error updating game count:', error);
      // Still navigate even if count update fails
      navigate(`/games/${game._id}`);
    }
  };

  const isVideo = game.imageUrl?.match(/\.(mp4|webm|ogg)$/i);
  
  

  return (
    <div 
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="block cursor-pointer relative group"
    >
      <div className="bg-gray-800/40 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 shadow-xl transition-all duration-300 hover:shadow-indigo-500/20 hover:border-indigo-500/20">
        <div className="relative h-52 overflow-hidden">
          {isVideo ? (
            <video
              src={game.imageUrl}
              alt={game.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <img 
              src={game.imageUrl} 
              alt={game.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          )}
          
          {/* Play Button Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-16 h-16 rounded-full bg-indigo-600/90 flex items-center justify-center backdrop-blur-sm transform transition-transform duration-300 group-hover:scale-110">
              <Play size={32} className="text-white ml-1" />
            </div>
          </div>
          
          {/* Badge if available */}
          {game.badge && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
              {game.badge}
            </div>
          )}          
        </div>
        
        <div className="p-4">
          <h3 className="text-base font-bold text-white truncate group-hover:text-indigo-400 transition-colors">
            {game.title}
          </h3>
          
          <div className="flex items-center justify-between mt-2">
            {game.category && (
              <p className="text-sm text-white truncate">
                {game.category}
              </p>
            )}
            
            {/* View Counter */}
            <div className="flex items-center text-xs text-white gap-1">
              <Eye size={14} />
              <span>{localCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

GameCard.propTypes = {
  game: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string.isRequired,
    category: PropTypes.string,
    rating: PropTypes.string,
    thumb: PropTypes.string,
    url: PropTypes.string,
    badge: PropTypes.string,
    count: PropTypes.number
  }).isRequired,
  isNewRelease: PropTypes.bool
};

export default GameCard;