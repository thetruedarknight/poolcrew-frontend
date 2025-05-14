import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function PlayerProfile() {
  const { name } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3001/player/${name}/stats`)
      .then(res => res.json())
      .then(data => {
        setPlayer(data);
        setLoading(false);
      });
  }, [name]);

  if (loading) return <div className="text-center py-10">Loading player stats...</div>;
  if (!player) return <div className="text-center py-10">Player not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 text-white rounded-lg space-y-6">
      <div className="flex items-center space-x-4">
        {player.photo && (
          <img src={player.photo} alt={player.name} className="w-20 h-20 rounded-full object-cover" />
        )}
        <div>
          <h2 className="text-2xl font-bold">{player.name}</h2>
          {player.nickname && <p className="text-gray-400 italic">"{player.nickname}"</p>}
          <p className="text-sm text-green-400">🎯 ELO: {player.elo}</p>
          <p className="text-sm">🎱 Favorite Game: {player.favoriteGame}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <p><strong>Total Games:</strong> {player.totalGames}</p>
        <p><strong>Win %:</strong> {player.winRate}%</p>
        <p><strong>Wins:</strong> {player.wins}</p>
        <p><strong>Losses:</strong> {player.losses}</p>
        <p><strong>🔥 Longest Streak:</strong> {player.longestStreak}</p>
        <p><strong>📈 Most Wins Against:</strong> {player.mostWinsAgainst || '—'}</p>
        <p><strong>📉 Most Losses Against:</strong> {player.mostLossesAgainst || '—'}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">🕘 Recent Matches</h3>
        <ul className="divide-y divide-gray-700 text-sm">
          {player.recentMatches.map((match, i) => (
            <li key={i} className="py-2 flex justify-between">
              <span>{match.date} — {match.source} ({match.gameType})</span>
              <span className={match.winner === player.name ? 'text-green-400' : 'text-red-400'}>
                {match.winner === player.name ? '✅ Win' : '❌ Loss'} vs {match.opponent}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PlayerProfile;
