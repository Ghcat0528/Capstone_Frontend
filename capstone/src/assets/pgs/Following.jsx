import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const FollowingPage = () => {
  const { userId } = useParams(); 
  const [following, setFollowing] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:3808/api/users/${userId}/following`, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFollowing(res.data.following);
      } catch (error) {
        console.error("Error fetching following:", error);
      }
    };

    if (userId) { 
      fetchFollowing();
    }
  }, [userId]);  

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
