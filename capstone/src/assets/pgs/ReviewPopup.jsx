import { useState } from 'react';
import axios from 'axios';
import "../../../src/Popup.css" 

const ReviewPopup = ({ gameId, onClose }) => {
  const [rating, setRating] = useState(1);
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem("token");
    if (!token) {
        alert("You must be logged in to create a review");
        return; 
      }
  
  
    try {
      await axios.post(
        "http://localhost:3808/api/reviews",
        { rating: Number(rating), content, gameId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Review submitted!");
      onClose(); 
      window.location.reload(); 
    } catch (error) {
      console.error("Error submitting review:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to submit review.");
    }
  };
  

  return (
    <div className="popup-overlay create-review-popup">
    <div className="popup-container">
      <div className="flex justify-between items-center">
        <h2>Review this Game</h2>
        <button onClick={onClose} className="text-xl font-bold text-gray-500 hover:text-gray-700">
          ×
        </button>
      </div>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label htmlFor="rating">Rating (1 to 5)</label>
          <input
            type="number"
            id="rating"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content">Review Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="4"
          />
        </div>
        <div className="flex justify-end">
          <button type="button" onClick={onClose} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            Submit Review
          </button>
        </div>
      </form>
    </div>
  </div>
  );
};

export default ReviewPopup;
