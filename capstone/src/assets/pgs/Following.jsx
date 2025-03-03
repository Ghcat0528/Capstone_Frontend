import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const FollowingPage = () => {
  const { userId } = useParams();  // userId should be passed in the route
  const [following, setFollowing] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:3808/api/users/${userId}/following`,  // Adjust URL as needed
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Following data:", res.data);
        setFollowing(res.data.following);  // Access the 'following' array from the response
      } catch (error) {
        console.error("Error fetching following:", error);
      }
    };

    if (userId) {  // Make sure userId exists before making request
      fetchFollowing();
    }
  }, [userId]);  // Only re-run when userId changes, no need for following.length

  return (
    <div>
       <button onClick={() => navigate(-1)}>🔙 Back</button>  
      <h2>Following</h2>
      {following.length > 0 ? (
        <ul>
          {following.map((followedUser) => (
            <li key={followedUser.id}>
              <Link to={`/users/${followedUser.id}/profile`}>
                {followedUser.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Not following anyone yet.</p>
      )}
    </div>
  );
};

export default FollowingPage;
