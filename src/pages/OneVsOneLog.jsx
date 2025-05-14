import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function OneVsOneLog() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);
  const [playerA, setPlayerA] = useState('');
  const [playerB, setPlayerB] = useState('');
  const [winner, setWinner] = useState('');
  const [gameType, setGameType] = useState('9-ball');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/players')
      .then(res => res.json())
      .then(data => setPlayers(data));
  }, []);

  const handleSubmit = async (endSession = false) => {
    if (!playerA || !playerB) return alert('Please select both players.');
    if (playerA === playerB) return alert('Players must be different.');
    if (!winner) return alert('Please select a winner.');

    const date = new Date().toISOString().split('T')[0];

    const body = {
      date,
      playerA,
      playerB,
      winner,
      gameType,
      sessionId,
      notes,
    };

    const res = await fetch('http://localhost:3001/1v1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) return alert('Error saving game');

    if (endSession) {
      navigate('/');
    } else {
      // Continue session: set winner as new playerA
      setPlayerA(winner);
      setPlayerB('');
      setWinner('');
      setNotes('');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg space-y-4">
      <h2 className="text-xl font-bold mb-2">🎯 1v1 Game Logging</h2>
      <p className="text-sm text-gray-400">Session ID: <code>{sessionId}</code></p>

      <div className="grid grid-cols-2 gap-4">
        <select value={playerA} onChange={e => setPlayerA(e.target.value)} className="p-2 bg-gray-700 rounded">
          <option value="">Player A</option>
          {players.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
        </select>

        <select value={playerB} onChange={e => setPlayerB(e.target.value)} className="p-2 bg-gray-700 rounded">
          <option value="">Player B</option>
          {players.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
        </select>
      </div>

      <select value={winner} onChange={e => setWinner(e.target.value)} className="p-2 bg-gray-700 rounded w-full">
        <option value="">Select Winner</option>
        {[playerA, playerB].filter(p => p).map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      <select value={gameType} onChange={e => setGameType(e.target.value)} className="p-2 bg-gray-700 rounded w-full">
        <option value="9-ball">9-ball</option>
        <option value="8-ball">8-ball</option>
        <option value="10-ball">10-ball</option>
      </select>

      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Notes (optional)"
        className="p-2 bg-gray-700 rounded w-full"
      ></textarea>

      <div className="flex space-x-4 justify-between">
        <button
          onClick={() => handleSubmit(false)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Log & Continue
        </button>

        <button
          onClick={() => handleSubmit(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full"
        >
          End Session
        </button>
      </div>
    </div>
  );
}

export default OneVsOneLog;
