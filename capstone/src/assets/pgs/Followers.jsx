import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const FollowersPage = () => {
  const { userId } = useParams();  
  const [followers, setFollowers] = useState([]);
  const navigate = useNavigate();  // useNavigate hook

  useEffect(() => {
    const fetchFollowers = async () => {
        try {
          const token = localStorage.getItem('token');  
          const response = await axios.get(`https://capstone-backend-1-1cia.onrender.com/api/users/${userId}/followers`, {
            headers: {
              'Authorization': `Bearer ${token}`  
            }
          });
          setFollowers(response.data.followers);
        } catch (error) {
          console.error("Error fetching followers:", error);
        }
      };
      
    if (userId) { 
      fetchFollowers();
    }
  }, [userId]); 

  return (
    <div>
       <button onClick={() => navigate(-1)}>🔙 Back</button>  {/* Button to go back */}
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
