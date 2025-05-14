import React, { useEffect, useState } from 'react';

function TrainingLog() {
  const [drills, setDrills] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedDrill, setSelectedDrill] = useState(null);
  const [newDrill, setNewDrill] = useState({ name: '', skill: '', maxScore: '' });
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [scores, setScores] = useState({});

  useEffect(() => {
    fetch('https://poolcrew-backend.onrender.com/drills')
      .then(res => res.json())
      .then(setDrills);

    fetch('https://poolcrew-backend.onrender.com/players')
      .then(res => res.json())
      .then(setPlayers);
  }, []);

  const handleScoreChange = (player, value) => {
    setScores({ ...scores, [player]: value });
  };

  const handleSubmit = async () => {
    const drill = selectedDrill === 'new' ? newDrill : drills.find(d => d.name === selectedDrill);
    if (!drill || !drill.name || !drill.skill || !drill.maxScore) return alert('Drill details incomplete');

    // Add drill if new
   if (selectedDrill === 'new') {
  await fetch('https://poolcrew-backend.onrender.com/drills', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newDrill)
  });

  // Refresh drills list and auto-select new drill
  const updated = await fetch('https://poolcrew-backend.onrender.com/drills').then(res => res.json());
  setDrills(updated);
  setSelectedDrill(newDrill.name);
}


    const today = new Date().toISOString().split('T')[0];
    const entries = selectedPlayers.map(p => ({
      date: today,
      player: p,
      drill: drill.name,
      score: scores[p] || '',
      notes: ''
    }));

    await fetch('https://poolcrew-backend.onrender.com/training-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entries })
    });

    alert('Training data logged!');
    setSelectedPlayers([]);
    setScores({});
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-900 text-white rounded space-y-6">
      <h2 className="text-xl font-bold">🏋️ Log Training Drill</h2>

      <label className="block mb-2">📋 Select or Add Drill</label>
      <select
        className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
        onChange={e => setSelectedDrill(e.target.value)}
        value={selectedDrill || ''}
      >
        <option value="">-- Select a drill --</option>
        {drills.map(d => (
          <option key={d.name} value={d.name}>{d.name} ({d.skill})</option>
        ))}
        <option value="new">➕ Add New Drill</option>
      </select>

      {selectedDrill === 'new' && (
        <div className="space-y-2">
          <input
            className="w-full p-2 bg-gray-800 text-white rounded"
            placeholder="Drill Name"
            value={newDrill.name}
            onChange={e => setNewDrill({ ...newDrill, name: e.target.value })}
          />
          <input
            className="w-full p-2 bg-gray-800 text-white rounded"
            placeholder="Skill Tested"
            value={newDrill.skill}
            onChange={e => setNewDrill({ ...newDrill, skill: e.target.value })}
          />
          <input
            className="w-full p-2 bg-gray-800 text-white rounded"
            placeholder="Max Score"
            type="number"
            value={newDrill.maxScore}
            onChange={e => setNewDrill({ ...newDrill, maxScore: e.target.value })}
          />
        </div>
      )}

      <label className="block mt-6 mb-2">👥 Select Player(s)</label>
      <div className="grid grid-cols-2 gap-2">
        {players.map(p => (
          <label key={p.name} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedPlayers.includes(p.name)}
              onChange={e => {
                const updated = e.target.checked
                  ? [...selectedPlayers, p.name]
                  : selectedPlayers.filter(name => name !== p.name);
                setSelectedPlayers(updated);
              }}
            />
            <span>{p.name}</span>
          </label>
        ))}
      </div>

      {selectedPlayers.length > 0 && (
        <div className="mt-6 space-y-2">
          <h3 className="text-lg font-semibold">📝 Enter Scores</h3>
          {selectedPlayers.map(p => (
            <div key={p} className="flex items-center space-x-4">
              <span className="w-24">{p}</span>
              <input
                type="number"
                max={selectedDrill === 'new' ? newDrill.maxScore : drills.find(d => d.name === selectedDrill)?.maxScore}
                min={0}
                value={scores[p] || ''}
                onChange={e => handleScoreChange(p, e.target.value)}
                className="p-2 rounded bg-gray-800 text-white w-24"
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={handleSubmit}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
        >
          ✅ Submit Training Log
        </button>
      </div>
    </div>
  );
}

export default TrainingLog;
