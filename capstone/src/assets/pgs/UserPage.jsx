import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../../src/Profiles.css";

const UserPage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return console.error("No token found.");

        const res = await axios.get(`${BACKEND_URL}/api/users/${userId}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const checkFollowStatus = async () => {
      const token = localStorage.getItem("token");
      const loggedInUserId = localStorage.getItem("userId");

      if (!token || !loggedInUserId) return;

      try {
        const res = await axios.get(`${BACKEND_URL}/api/users/${userId}/isFollowing`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFollowing(res.data.isFollowing);
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    };

    checkFollowStatus();
  }, [userId]);

  const handleFollow = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.post(
        `${BACKEND_URL}/api/users/follow/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsFollowing(true);

      const res = await axios.get(`${BACKEND_URL}/api/users/${userId}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.delete(
        `${BACKEND_URL}/api/users/unfollow/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsFollowing(false);

      const res = await axios.get(`${BACKEND_URL}/api/users/${userId}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  if (loading) return <p>Loading user profile...</p>;
  if (!user) return <p>Error loading user data.</p>;

  return (
    <div className="profile-container other-user-profile mx-auto p-4">
      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 text-white bg-gray-500 rounded"
        >
          Back
        </button>
        <h1 className="text-3xl font-bold">{user.name}'s Profile</h1>

        {String(user.id) !== String(localStorage.getItem("userId")) && (
          <button
            onClick={isFollowing ? handleUnfollow : handleFollow}
            className={`px-4 py-2 rounded transition-colors ${isFollowing ? "bg-gray-400" : "bg-blue-500 text-white"}`}
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
