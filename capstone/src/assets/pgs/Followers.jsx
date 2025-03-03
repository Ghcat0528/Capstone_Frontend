import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const FollowersPage = () => {
  const { userId } = useParams();  // Extract userId from URL
  const [followers, setFollowers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFollowers = async () => {
        try {
          const token = localStorage.getItem('token');  
          const response = await axios.get(`http://localhost:3808/api/users/${userId}/followers`, {
            headers: {
              'Authorization': `Bearer ${token}`  // Include the token in the Authorization header
            }
          });
          setFollowers(response.data.followers);
        } catch (error) {
          console.error("Error fetching followers:", error);
        }
      };
      

    if (userId) { // Ensure the userId is available before making the request
      fetchFollowers();
    }
  }, [userId]);  // Only re-run if userId changes

  return (
    <div>
       <button onClick={() => navigate(-1)}>🔙 Back</button>  
      <h2>Followers</h2>
      {followers.length > 0 ? (
        <ul>
        {followers.map(({ follower }) => (
          <li key={follower.id}>
            <Link to={`/users/${follower.id}/profile`}>{follower.name}</Link>
          </li>
        ))}
      </ul>
      
      ) : (
        <p>No followers found.</p>
      )}
    </div>
  );
};

export default FollowersPage;
