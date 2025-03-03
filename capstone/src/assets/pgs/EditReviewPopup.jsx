import { useState } from 'react';
import axios from 'axios';

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
      await axios.put(`http://localhost:3808/api/reviews/${review.id}`, updatedReview);
      onClose();
      onEditSubmit();  // Refresh reviews on the page
    } catch (error) {
      console.error('Error editing review:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded">
        <h2 className="text-lg font-bold mb-2">Edit Review</h2>
        <textarea
          name="content"
          value={updatedReview.content}
          onChange={handleChange}
          placeholder="Your review"
          className="w-full p-2 border mb-2"
          required
        />
        <select
          name="rating"
          value={updatedReview.rating}
          onChange={handleChange}
          className="w-full p-2 border mb-2"
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>{num} / 5</option>
          ))}
        </select>
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="p-2 bg-gray-300 rounded">Cancel</button>
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default EditReviewPopup;
