import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const UserPage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await axios.get(`http://localhost:3808/api/users/${userId}`);
        setUser(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    const getLoggedInUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:3808/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLoggedInUser(res.data);
        setIsFollowing(res.data.following.some(followed => followed.id === parseInt(userId)));
      } catch (error) {
        console.error(error);
      }
    };

    getUserData();
    getLoggedInUser();
  }, [userId]);

  const handleFollow = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.post(
        `http://localhost:3808/api/users/${userId}/follow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsFollowing(res.data.isFollowing);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  if (!user) return <p>User not found.</p>;

  return (
    <div className="container mx-auto p-4">
      {/* Profile Info */}
      <div className="flex items-center space-x-4">
        <img
          src={user.profilePicture || "/default-pfp.png"}
          alt={`${user.name}'s profile`}
          className="w-16 h-16 rounded-full border"
        />
        <h1 className="text-3xl font-bold">
          {loggedInUser && loggedInUser.id === user.id ? "Your account" : `${user.name}'s Profile`}
        </h1>
        {/* Show Follow Button only for other users */}
        {loggedInUser && loggedInUser.id !== user.id && (
          <button
            onClick={handleFollow}
            className={`px-4 py-2 rounded ${isFollowing ? "bg-gray-400" : "bg-blue-500 text-white"}`}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>

      {/* Followers and Following Links */}
      <div className="mt-4">
        <Link to={`/users/${userId}/following`} className="text-blue-500 underline">
          Following ({user.following.length})
        </Link>{" "}
        |{" "}
        <Link to={`/users/${userId}/followers`} className="text-blue-500 underline">
          Followers ({user.followers.length})
        </Link>
      </div>

      {/* User Reviews */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Reviews</h2>
        {user.reviews.length > 0 ? (
          <ul>
            {user.reviews.map((review) => (
              <li key={review.id} className="border p-2 my-2">
                {/* Reviewer's profile picture and clickable username */}
                <div className="flex items-center space-x-3 mb-2">
                  <img
                    src={review.user.profilePicture || "/default-pfp.png"}
                    alt={review.user.name}
                    className="w-8 h-8 rounded-full border"
                  />
                  <Link to={`/users/${review.user.id}`} className="text-blue-500 font-semibold">
                    {review.user.name}
                  </Link>
                </div>

                {/* Game title link */}
                <Link to={`/games/${review.game.id}`} className="text-blue-500 font-bold">
                  {review.game.title}
                </Link>
                <p>{review.content} ({review.rating}/10)</p>
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
