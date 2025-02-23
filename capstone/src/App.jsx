import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./assets/pgs/Home";
import Auth from "./assets/pgs/Auth";
import Game from "./assets/pgs/Game";
import GameDetailsPage from "./assets/pgs/GameDetail";
import UserPage from "./assets/pgs/UserPage";
import Admin from "./assets/pgs/Admin";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/games" element={<Game />} />
        <Route path="/games/:gameId" element={<GameDetailsPage />} />
        <Route path="/userPage/:id" element={<UserPage />} />
        <Route path="/admin" element={<Admin />} />
       
      </Routes>
    </Router>
  );
}

export default App;