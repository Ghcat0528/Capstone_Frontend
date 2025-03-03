import React, { useState } from 'react';
import axios from 'axios';

const AddGame = ({ onGameAdded }) => {
  const [gameDetails, setGameDetails] = useState({
    title: '',
    genre: '',
    image: '',
  });

  const handleChange = (e) => {
    setGameDetails({
      ...gameDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3808/api/games', gameDetails);
      if (response.status === 201) {
        onGameAdded(response.data.game); // Call onGameAdded to update the games list
        setGameDetails({ title: '', genre: '', image: '' }); // Reset form
      }
    } catch (error) {
      console.error('Error adding game:', error);
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold">Add a New Game</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={gameDetails.title}
          onChange={handleChange}
          placeholder="Game Title"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="genre"
          value={gameDetails.genre}
          onChange={handleChange}
          placeholder="Genre"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="image"
          value={gameDetails.image}
          onChange={handleChange}
          placeholder="Image URL (Optional)"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Add Game
        </button>
      </form>
    </div>
  );
};

export default AddGame;
