import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import "../../../src/Popup.css";

const EditReviewPopup = ({ review, onClose, onEditSubmit }) => {
    const navigate = useNavigate(); 
    const [updatedReview, setUpdatedReview] = useState({
      content: review.content,
      rating: review.rating,
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setUpdatedReview((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const token = localStorage.getItem('authToken'); 
  
      if (!token) {
        console.log("User is not authenticated");
        return;
      }
  
      try {
          await axios.put(
            `https://capstone-backend-1-1cia.onrender.com/api/reviews/${review.id}`,
            updatedReview,
            {
              headers: {
                  'Authorization': `Bearer ${token}`  
                }
            }
          );
          onClose();
          onEditSubmit();
        } catch (error) {
          console.error('Error editing review:', error);
        }
    };
  

  return (
    <div className="popup-overlay edit-review-popup">
      <form onSubmit={handleSubmit} className="popup-container">
        <h2>Edit Review</h2>
        <textarea
          name="content"
          value={updatedReview.content}
          onChange={handleChange}
          placeholder="Your review"
          required
        />
        <select
          name="rating"
          value={updatedReview.rating}
          onChange={handleChange}
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>{num} / 5</option>
          ))}
        </select>
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="save-btn">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};


export default EditReviewPopup;
