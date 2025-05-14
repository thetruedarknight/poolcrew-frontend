import React, { useEffect, useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Customized
} from 'recharts';
import { motion, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';


function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [eloHistory, setEloHistory] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/players')
      .then(res => res.json())
      .then(data => setPlayers(data));
    fetch('http://localhost:3001/rebuild-elo', {
  method: 'POST'
})
.then(() => {
  console.log('ELO recalculated');
  // Optional: Refresh leaderboard or show toast
});
    fetch('http://localhost:3001/elo-history')
      .then(res => res.json())
      .then(data => setEloHistory(data));
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
      <div className="bg-gray-800 p-4 rounded-lg">
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

            <Customized component={({ height, width }) => {
  const minELO = Math.min(...Object.values(eloHistory).flat().map(d => d.elo));
  const maxELO = Math.max(...Object.values(eloHistory).flat().map(d => d.elo));
  const dates = chartData.map(d => d.date);

  return Object.entries(eloHistory).map(([player, entries]) => {
    const photo = players.find(p => p.name === player)?.photo;
    if (!photo || entries.length < 2) return null;

    const duration = Math.min(8, 2.5 + entries.length * 0.05);
    const path = entries.map(entry => {
      const x = (dates.indexOf(entry.date) / (dates.length - 1)) * width;
      const y = height - ((entry.elo - minELO) / (maxELO - minELO)) * height;
      return { x: x - 16, y: y - 48 };
    });

    const controls = useAnimation();

    useEffect(() => {
      async function animate() {
        await controls.start({
          x: path.map(p => p.x),
          y: path.map(p => p.y),
          transition: { duration, ease: 'easeInOut' }
        });
        controls.start({
          rotate: [0, 10, -10, 10, -10, 0],
          transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' }
        });
      }
      animate();
    }, []);

    return (
      <foreignObject
        key={player}
        width="32"
        height="32"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <motion.img
          src={photo}
          alt={player}
          width="32"
          height="32"
          style={{ borderRadius: '50%', cursor: 'pointer' }}
          animate={controls}
          initial={path[0]}
          onClick={() => navigate(`/player/${encodeURIComponent(player)}`)}
        />
      </foreignObject>
    );
  });
}} />

          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Leaderboard;
