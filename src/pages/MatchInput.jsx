import React, { useState, useEffect } from 'react';

function MatchInput() {
  const [players, setPlayers] = useState([]);
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [p1Score, setP1Score] = useState('');
  const [p2Score, setP2Score] = useState('');
  const [gameType, setGameType] = useState('9-ball');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/players')
      .then(res => res.json())
      .then(data => setPlayers(data));
  }, []);

const handleSubmit = async (e) => {
  e.preventDefault();

  // Basic validation
  if (!p1 || !p2) return alert('Please select both players.');
  if (p1 === p2) return alert('Players must be different.');
  if (p1Score === '' || p2Score === '') return alert('Enter scores for both players.');
  if (parseInt(p1Score) < 0 || parseInt(p2Score) < 0) return alert('Scores cannot be negative.');
  if (parseInt(p1Score) === 0 && parseInt(p2Score) === 0) return alert('Both scores cannot be zero.');

  const body = {
    player1: p1,
    player2: p2,
    p1Score,
    p2Score,
    gameType,
    notes,
  };

  const res = await fetch('http://localhost:3001/match', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (res.ok) {
    alert('Match recorded!');
    // Optionally reset form
    setP1('');
    setP2('');
    setP1Score('');
    setP2Score('');
    setNotes('');
  } else {
    alert('Error saving match');
  }
};


  return (
    <form className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-2">🎯 Record Match</h2>

      <div className="grid grid-cols-2 gap-4">
        <select value={p1} onChange={e => setP1(e.target.value)} className="p-2 bg-gray-700 rounded">
          <option value="">Select Player 1</option>
          {players.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
        </select>
        <select value={p2} onChange={e => setP2(e.target.value)} className="p-2 bg-gray-700 rounded">
          <option value="">Select Player 2</option>
          {players.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
  type="number"
  min="0"
  placeholder="P1 Score"
  value={p1Score}
  onChange={e => setP1Score(e.target.value)}
  className="p-2 bg-gray-700 rounded"
/>

<input
  type="number"
  min="0"
  placeholder="P2 Score"
  value={p2Score}
  onChange={e => setP2Score(e.target.value)}
  className="p-2 bg-gray-700 rounded"
/>
      </div>

      <select value={gameType} onChange={e => setGameType(e.target.value)} className="p-2 bg-gray-700 rounded w-full">
        <option value="9-ball">9-ball</option>
        <option value="8-ball">8-ball</option>
        <option value="10-ball">10-ball</option>
      </select>

      <textarea
        placeholder="Notes (optional)"
        value={notes}
        onChange={e => setNotes(e.target.value)}
        className="p-2 bg-gray-700 rounded w-full"
      ></textarea>

      <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
        Submit Match
      </button>
    </form>
  );
}

export default MatchInput;
