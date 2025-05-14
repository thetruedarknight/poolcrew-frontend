import React, { useEffect, useState } from 'react';

function HeadToHead() {
  const [players, setPlayers] = useState([]);
  const [playerA, setPlayerA] = useState('');
  const [playerB, setPlayerB] = useState('');
  const [h2hStats, setH2hStats] = useState(null);
  const [selectedGameType, setSelectedGameType] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/players')
      .then(res => res.json())
      .then(data => setPlayers(data));
  }, []);

  const fetchStats = async () => {
    if (!playerA || !playerB || playerA === playerB) return;
    const res = await fetch(`http://localhost:3001/h2h?playerA=${playerA}&playerB=${playerB}`);
    const data = await res.json();
    setH2hStats(data);
    setSelectedGameType(''); // Reset game type filter
  };

  const filteredMatches = h2hStats?.matchDetails.filter(
    m => !selectedGameType || m.gameType === selectedGameType
  ) || [];

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-900 rounded-lg space-y-6">
      <h2 className="text-2xl font-bold text-center mb-2">🔄 Head-to-Head</h2>

      <div className="grid grid-cols-2 gap-4">
        <select value={playerA} onChange={e => setPlayerA(e.target.value)} className="p-2 bg-gray-800 rounded">
          <option value="">Select Player A</option>
          {players.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
        </select>

        <select value={playerB} onChange={e => setPlayerB(e.target.value)} className="p-2 bg-gray-800 rounded">
          <option value="">Select Player B</option>
          {players.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
        </select>
      </div>

      <button
        onClick={fetchStats}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full"
      >
        View Head-to-Head
      </button>

      {h2hStats && (
        <div className="bg-gray-800 p-4 rounded space-y-4">
          <h3 className="text-xl font-bold text-center">🧾 Summary</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <p><strong>Total Games:</strong> {h2hStats.totalGames}</p>
            <p><strong>Game Types:</strong> {h2hStats.gameTypes.join(', ')}</p>
            <p><strong>{playerA} Wins:</strong> {h2hStats.winsA}</p>
            <p><strong>{playerB} Wins:</strong> {h2hStats.winsB}</p>
            <p><strong>Last Match:</strong> {h2hStats.lastMatchDate} — {h2hStats.lastWinner} won</p>
            <p><strong>🔥 Current Streak:</strong> {h2hStats.currentStreak.player} ({h2hStats.currentStreak.count})</p>
            <p><strong>🏆 Longest Streak:</strong> {playerA}: {h2hStats.longestStreaks[playerA] || 0} | {playerB}: {h2hStats.longestStreaks[playerB] || 0}</p>
          </div>

          <hr className="border-gray-700" />

          {h2hStats.gameTypes.length > 1 && (
            <select
              value={selectedGameType}
              onChange={e => setSelectedGameType(e.target.value)}
              className="p-2 bg-gray-700 rounded w-full"
            >
              <option value="">All Game Types</option>
              {h2hStats.gameTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          )}

          <h4 className="text-lg font-semibold mt-4">📅 Match History</h4>
          <ul className="divide-y divide-gray-700 max-h-80 overflow-y-auto">
            {filteredMatches.map((match, i) => (
              <li key={i} className="py-2 flex justify-between text-sm text-gray-300">
                <span>{match.date} — {match.source} ({match.gameType})</span>
                <span>🏆 {match.winner}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default HeadToHead;
