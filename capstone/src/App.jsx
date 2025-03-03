import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./assets/pgs/Admin";
import Home from "./assets/pgs/Home";
import Auth from "./assets/pgs/Auth";
import Game from "./assets/pgs/Game";
import GameDetailsPage from "./assets/pgs/GameDetail";
import UserPage from "./assets/pgs/UserPage";
import MyUserPage from "./assets/pgs/MyUserPage";
import Header from "./assets/pgs/Header";
import FollowersPage from './assets/pgs/Followers';
import FollowingPage from './assets/pgs/Following';


function App() {
  const isAdmin = true;
  return (
    <Router>
      <Header />
      <Routes>
      {isAdmin && <Route path="/admin-dashboard" element={<AdminDashboard />} />}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/games" element={<Game />} />
        <Route path="/games/:gameId" element={<GameDetailsPage />} />
        <Route path="/MyUserPage" element={<MyUserPage/>} />
        <Route path="/users/:userId" element={<UserPage />} />
        <Route path="/users/:userId/profile" element={<UserPage />} />
        <Route path="/users/:userId/followers" element={<FollowersPage />} />
        <Route path="/users/:userId/following" element={<FollowingPage />} />
      </Routes>
    </Router>
  );
}

export default App;