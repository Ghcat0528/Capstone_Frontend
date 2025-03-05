import { useEffect, useState } from "react"; 
import { useNavigate } from "react-router-dom";  // Import useNavigate
import axios from "axios";
import "../../../src/non-loggedin.css";

const Home = () => {
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState([]);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();  // useNavigate hook

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("https://capstone-backend-1-1cia.onrender.com/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
       
        setUser(res.data);
        setReviews(res.data.reviews || []); 
        setFollowing(res.data.following || []); 
      } catch (error) {
        console.error(error);
      }
    };

    getUserData();
  }, []);

  return (
    <div className="container">
      <h1>Welcome to the Game Review Site</h1>

      {!user && (
        <div className="mt-4">
          <button onClick={() => navigate("/auth")} className="profile-link">
            Sign up or Log in
          </button>  {/* Consistent useNavigate for navigation */}
        </div>
      )}

      {/* Following List */}
      {user && following.length > 0 && (
        <div className="mt-6">
          <h2>Following</h2>
          <ul>
            {following.map((followedUser) => (
              <li key={followedUser.id} className="flex items-center space-x-4 my-2">
                <button onClick={() => navigate(`/users/${followedUser.id}`)} className="profile-link">
                  {followedUser.name}
                </button>  {/* Consistent useNavigate for user profile */}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* User Reviews */}
      {user && (
        <div className="mt-6">
          <h2>Your Reviews</h2>
          {reviews.length > 0 ? (
            <ul>
              {reviews.map((review) => (
                <li key={review.id} className="review-card">
                  <strong>{review.game ? review.game.title : 'Unknown Game'}</strong>: {review.content} ({review.rating}/5)
                </li>
              ))}
            </ul>
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      )}

      {/* Go to My Profile Button */}
      {user && (
        <div className="mt-6">
          <button
            onClick={() => navigate("/myuserpage")}
            className="btn profile-button"
          >
            Go to My Profile
          </button>  {/* Consistent useNavigate for profile navigation */}
        </div>
      )}

      <div className="mt-6">
        <button onClick={() => navigate("/games")} className="profile-link">
          Browse Games
        </button> 
      </div>
    </div>
  );
};

export default Home;
