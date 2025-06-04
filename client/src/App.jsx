import GameCard from './components/GameCard'
import { useEffect ,useState} from 'react';
import { API_URL } from './config';

function App() {
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
        setGames(data.games );
      } catch (error) {
        setError('Failed to fetch games');
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, [])
  

  return (
    <>
      <h1>Khelzy Frontend</h1>
      {games.map((game)=>(
        <GameCard key={game._id} game={game}></GameCard>
      ))}
      
    </>
  )
}

export default App
