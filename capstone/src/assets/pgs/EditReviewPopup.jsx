import { useState } from 'react';
import axios from 'axios';
import "../../../src/Popup.css";


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const EditReviewPopup = ({ review, onClose, onEditSubmit }) => {
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
    try {
      await axios.put(`${BACKEND_URL}/api/reviews/${review.id}`, updatedReview);
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
