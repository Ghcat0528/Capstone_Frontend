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

        const res = await axios.get("http://localhost:3808/api/users/profile", {
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
                <img
                  src={followedUser.profilePicture || "/default-pfp.png"}
                  alt={`${followedUser.name}'s profile`}
                  className="w-10 h-10 rounded-full"
                />
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
                  <strong>{review.game.title}</strong>: {review.content} (
                  {review.rating}/10)
                </li>
              ))}
            </ul>
          ) : (
            <p>No reviews yet.</p>
          )}
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
