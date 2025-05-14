import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PlayerSelectPage() {
  const [players, setPlayers] = useState([]);
  const [selected, setSelected] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/players')
      .then(res => res.json())
      .then(data => setPlayers(data));
  }, []);

  const handleView = () => {
    if (selected) {
      navigate(`/player/${selected}`);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-900 text-white p-6 rounded space-y-4">
      <h2 className="text-xl font-bold text-center">📋 View Individual Stats</h2>

      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="p-2 bg-gray-800 rounded w-full"
      >
        <option value="">Select a player</option>
        {players.map((p) => (
          <option key={p.id} value={p.name}>{p.name}</option>
        ))}
      </select>

      <button
        onClick={handleView}
        disabled={!selected}
        className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded disabled:opacity-50"
      >
        View Stats
      </button>
    </div>
  );
}

export default PlayerSelectPage;
