import React, { useEffect, useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import Bobblehead from './Bobblehead'; // ✅ Make sure this file exists

function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [eloHistory, setEloHistory] = useState({});
  const [bobbleData, setBobbleData] = useState([]);

  useEffect(() => {
    fetch('https://poolcrew-backend.onrender.com/players')
      .then(res => res.json())
      .then(setPlayers);

    fetch('https://poolcrew-backend.onrender.com/elo-history')
      .then(res => res.json())
      .then(setEloHistory);
  }, []);

  const playerColors = [
    '#22d3ee', '#f472b6', '#34d399', '#facc15', '#60a5fa', '#c084fc', '#fb923c'
  ];

  const getColor = (name) => {
    const index = Object.keys(eloHistory).sort().indexOf(name);
    return playerColors[index % playerColors.length];
  };

  const allDates = [...new Set(
    Object.values(eloHistory).flat().map(d => d.date)
  )].sort((a, b) => new Date(a) - new Date(b));

  const lastKnownElo = {};
  const chartData = allDates.map(date => {
    const row = { date };
    for (const player in eloHistory) {
      const match = eloHistory[player].find(d => d.date === date);
      if (match) {
        lastKnownElo[player] = match.elo;
      }
      if (lastKnownElo[player] !== undefined) {
        row[player] = lastKnownElo[player];
      }
    }
    return row;
  });

  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => b.elo - a.elo);
  }, [players]);

  useEffect(() => {
    if (!players.length || !Object.keys(eloHistory).length) return;

    const chartWidth = 640;
    const chartHeight = 300;
    const dates = chartData.map(d => d.date);
    const minELO = Math.min(...Object.values(eloHistory).flat().map(d => d.elo));
    const maxELO = Math.max(...Object.values(eloHistory).flat().map(d => d.elo));

    const prepared = Object.entries(eloHistory).map(([player, entries]) => {
      const photo = players.find(p => p.name === player)?.photo;
      if (!photo || entries.length < 2) return null;

      const duration = Math.min(8, 2.5 + entries.length * 0.05);
      const path = entries.map(entry => {
        const x = (dates.indexOf(entry.date) / (dates.length - 1)) * chartWidth;
        const y = chartHeight - ((entry.elo - minELO) / (maxELO - minELO)) * chartHeight;
        return { x: x - 16, y: y - 72 };
      });

      return { player, photo, path, duration };
    }).filter(Boolean);

    setBobbleData(prepared);
  }, [players, eloHistory, chartData]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded space-y-6">
      <h2 className="text-2xl font-bold text-center">🏆 Leaderboard</h2>
      <ul className="divide-y divide-gray-700">
        {sortedPlayers.map((player) => (
          <li key={player.id} className="py-3 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {player.photo && (
                <img src={player.photo} alt={player.name} className="w-10 h-10 rounded-full object-cover" />
              )}
              <div>
                <p className="font-semibold" style={{ color: getColor(player.name) }}>{player.name}</p>
                {player.nickname && <p className="text-gray-400 text-sm">"{player.nickname}"</p>}
              </div>
            </div>
            <span className="font-bold" style={{ color: getColor(player.name) }}>{player.elo}</span>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold mt-8 mb-4">📈 ELO Progress Chart</h2>
      <div className="relative bg-gray-800 p-4 rounded-lg" style={{ height: 300, overflow: 'visible' }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" stroke="#aaa" />
            <YAxis domain={['auto', 'auto']} stroke="#aaa" />
            <Tooltip />
            {Object.keys(eloHistory).map((player) => (
              <Line
                key={player}
                type="monotone"
                dataKey={player}
                stroke={getColor(player)}
                strokeWidth={2}
                dot={false}
                isAnimationActive={true}
                animationDuration={4000}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>

        {/* ✅ Bobbleheads safely rendered via child component */}
        {bobbleData.map(({ player, photo, path, duration }) => (
          <Bobblehead
            key={player}
            player={player}
            photo={photo}
            path={path}
            duration={duration}
          />
        ))}
      </div>
    </div>
  );
}

export default Leaderboard;
