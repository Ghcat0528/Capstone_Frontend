import { Link, useNavigate } from "react-router-dom"; 
import "../../../src/non-loggedin.css";

const Header = () => {
    const navigate = useNavigate();  

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");  
        window.location.reload(); 
    };

    return (
        <header className="grey">
            <div className="container mx-auto flex justify-between items-center">
                <button onClick={() => navigate("/")} className="text-2xl font-bold profile-link">
                    Home
                </button>  {/* Consistent useNavigate for Home navigation */}
                
                <button
                    onClick={handleLogout}
                    className="bun"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;
