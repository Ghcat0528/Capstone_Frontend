import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const UserPage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data including followers and following
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found.");
          return;
        }

        const res = await axios.get(`http://localhost:3808/api/users/${userId}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = res.data;
        setUser(userData);
        setIsFollowing(userData.isFollowing); // Set follow status directly from API response
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Handle the "Follow" action
  const handleFollow = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.post(
        `http://localhost:3808/api/users/follow/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsFollowing(true);
      setUser((prevUser) => ({
        ...prevUser,
        followers: [...prevUser.followers, { id: userId }],
      }));
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  // Handle the "Unfollow" action
  const handleUnfollow = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.post(
        `http://localhost:3808/api/users/unfollow/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsFollowing(false);
      setUser((prevUser) => ({
        ...prevUser,
        followers: prevUser.followers.filter((f) => f.id !== userId),
      }));
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  if (loading) return <p>Loading user profile...</p>;
  if (!user) return <p>Error loading user data.</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 text-white bg-gray-500 rounded"
        >
          Back
        </button>
        <h1 className="text-3xl font-bold">{user.name}'s Profile</h1>

        {String(user.id) !== String(userId) && (
          <button
            onClick={isFollowing ? handleUnfollow : handleFollow}
            className={`px-4 py-2 rounded ${
              isFollowing ? "bg-gray-400" : "bg-blue-500 text-white"
            }`}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>

      <div className="mt-4">
        <Link to={`/users/${userId}/following`} className="text-blue-500 underline">
          Following ({user.following.length})
        </Link>
        {" | "}
        <Link to={`/users/${userId}/followers`} className="text-blue-500 underline">
          Followers ({user.followers.length})
        </Link>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Reviews</h2>
        {user.reviews && user.reviews.length > 0 ? (
          <ul>
            {user.reviews.map((review) => (
              <li key={review.id} className="border p-2 my-2">
                <Link to={`/games/${review.game.id}`} className="text-blue-500 font-bold">
                  {review.game.title}
                </Link>
                <p>
                  {review.content} ({review.rating}/5)
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserPage;
