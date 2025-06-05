
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import GameCard from './components/GameCard'
import Header from './components/Header';
import { ThemeProvider } from './context/ThemeContext';
import { useEffect ,useState} from 'react';
import { API_URL } from './config';

function App() {



  

  return (
    <ThemeProvider>
     <Router>
       <Routes>
        <Route path="/home" element={
          
             <Header></Header>
          
          } />
       </Routes>
     </Router>
    </ThemeProvider>
  )
}

export default App
