import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useLocation } from "react-router-dom";

const FollowList = () => {
    const { userId } = useParams();
    const location = useLocation();
    const isFollowingPage = location.pathname.includes("following"); 
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const getData = async () => {
          try {
            const endpoint = isFollowingPage
              ? `http://localhost:3808/api/users/${userId}/following`
              : `http://localhost:3808/api/users/${userId}/followers`;
    
            const res = await axios.get(endpoint);
            setUsers(res.data);
          } catch (error) {
            console.error("Error fetching data:", error);
          } 
        };
    
        getData();
      }, [userId, isFollowingPage]);
    

    
      return (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold">
            {isFollowingPage ? "Following" : "Followers"}
          </h1>
          {users.length > 0 ? (
            <ul>
              {users.map((user) => (
                <li key={user.id}>
                  <Link to={`/users/${user.id}`} className="text-blue-500 underline">
                    {user.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>{isFollowingPage ? "You are not following anyone." : "You have no followers."}</p>
          )}
        </div>
      );
    };
    
    export default FollowList;
