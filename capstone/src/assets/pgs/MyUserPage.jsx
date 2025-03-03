import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const MyUserPage = () => {
  const [user, setUser] = useState(null);
  const [loggedInUserEmail, setLoggedInUserEmail] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAdmin, setIsAdmin] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const getLoggedInUser = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) return;
          
          const res = await axios.get("http://localhost:3808/api/users/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
    
          setUser(res.data);
        } catch (error) {
          console.error("Error fetching logged-in user data:", error);
        }
      };
    
      getLoggedInUser();
    }, []);
    
    useEffect(() => {
      if (user) {
        setFollowers(user.followers || []);
        setFollowing(user.following || []);
      }
    }, [user]);

  useEffect(() => {
    if (user) {
      checkFollowStatus(user.id);
    }
  }, [user]);

  const checkFollowStatus = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:3808/api/users/${userId}/isFollowing`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsFollowing(res.data.isFollowing);
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  };

  const handleFollow = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await axios.post(
        `http://localhost:3808/api/users/follow/${user.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsFollowing(true); // After following, set follow status to true
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await axios.post(
        `http://localhost:3808/api/users/unfollow/${user.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsFollowing(false); // After unfollowing, set follow status to false
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const updatedFields = {};
    if (name !== user.name) updatedFields.name = name;
    if (email !== user.email) updatedFields.email = email;

    if (Object.keys(updatedFields).length === 0) {
      setIsEditing(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.put("http://localhost:3808/api/users/profile", updatedFields, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser((prev) => ({ ...prev, ...updatedFields }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  useEffect(() => {
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT token
      if (decodedToken?.role === "Admin") {
        setIsAdmin(true);
      }
    }
  }, [token]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center space-x-4 mb-4">
        <h1 className="text-3xl font-bold">
          {user.email === loggedInUserEmail ? "Your Profile" : `${user.name}'s Profile`}
        </h1>
      </div>

      {/* Only show name and email for logged-in user */}
      <div className="bg-white shadow-md rounded p-4 mb-4">
        <h2 className="text-2xl font-semibold mb-2">{user.name}</h2>
        <p className="text-gray-700">Email: {user.email}</p>
      </div>

      <div className="mt-4">
        <Link to={`/users/${user.id}/following`} className="text-blue-500 underline">
          Following ({user.following?.length ?? 0})
        </Link>
        {" | "}
        <Link to={`/users/${user.id}/followers`} className="text-blue-500 underline">
          Followers ({user.followers?.length ?? 0})
        </Link>
      </div>
 {/* Small Footer Link to Admin Dashboard */}
 {isAdmin && (
          <div className="mt-4 text-center">
            <Link
              to="/admin-dashboard"
              className="text-blue-500 text-sm underline hover:text-blue-700"
            >
              Go to Admin Dashboard
            </Link>
          </div>
        )}
      {/* Edit Profile Button */}
      <button
        onClick={() => setIsEditing(!isEditing)}
        className="mt-4 px-4 py-2 text-white bg-blue-500 rounded"
      >
        {isEditing ? "Cancel" : "Edit Profile"}
      </button>

      {/* Edit Profile Form (Only visible when editing) */}
      {isEditing && (
        <form onSubmit={handleUpdateProfile} className="mt-4 space-y-2">
          <div>
            <label className="block text-lg">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block text-lg">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-green-500 rounded"
          >
            Save Changes
          </button>
        </form>
      )}

      <div className="mt-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 text-white bg-gray-500 rounded"
        >
          Back
        </button>
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

export default MyUserPage;
