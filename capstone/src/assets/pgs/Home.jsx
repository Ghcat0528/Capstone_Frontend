import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Get user data, including reviews and following data
        const res = await axios.get("http://localhost:3808/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("API Response:", res.data);

        // Set both user data, reviews, and following
        setUser(res.data); // Set the full user data correctly
        setReviews(res.data.reviews || []); // Set the reviews correctly
        setFollowing(res.data.following || []); // Set the following correctly
      } catch (error) {
        console.error(error);
      }
    };

    getUserData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Welcome to the Game Review Site</h1>

      {/* Signup/Login Link */}
      {!user && (
        <div className="mt-4">
          <Link to="/auth" className="text-blue-500 underline">
            Sign up or Log in
          </Link>
        </div>
      )}

      {/* Following List */}
      {user && following.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Following</h2>
          <ul>
            {following.map((followedUser) => (
              <li key={followedUser.id} className="flex items-center space-x-4 my-2">
                
                <Link to={`/users/${followedUser.id}`} className="text-blue-500 font-bold">
                  {followedUser.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* User Reviews */}
      {user && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Your Reviews</h2>
          {reviews.length > 0 ? (
            <ul>
              {reviews.map((review) => (
                <li key={review.id} className="border p-2 my-2">
                  <strong>{review.game ? review.game.title : 'Unknown Game'}</strong>: {review.content} ({review.rating}/10)
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
          <Link
            to="/myuserpage"
            className="px-4 py-2 text-white bg-blue-500 rounded"
          >
            Go to My Profile
          </Link>
        </div>
      )}

      {/* Browse Games Link */}
      <div className="mt-6">
        <Link to="/games" className="text-blue-500 underline">
          Browse Games
        </Link>
      </div>
    </div>
  );
};
export default Home;
