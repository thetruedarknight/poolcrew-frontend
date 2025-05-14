import React, { useEffect, useState } from 'react';

function MatchHistory() {
  const [matches, setMatches] = useState([]);

useEffect(() => {
  fetch('http://localhost:3001/match-history')
    .then(res => res.json())
    .then(data => {
      setMatches(data.map(m => ({ ...m }))); // ✅ inside the .then()
    });
}, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded space-y-6">
      <h2 className="text-2xl font-bold text-center">📜 Match History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-800 text-left">
              <th className="p-2">Date</th>
              <th className="p-2">Player A</th>
              <th className="p-2">Player B</th>
              <th className="p-2">Winner</th>
              <th className="p-2">Game Type</th>
              <th className="p-2">Session ID</th>
              <th className="p-2">Type</th>
              <th className="p-2">Ignore?</th>
            </tr>
          </thead>
          <tbody>
            {matches.map(match => (
              <tr key={match.id} className="border-t border-gray-700">
                <td className="p-2">{match.date}</td>
                <td className="p-2">{match.playerA}</td>
                <td className="p-2">{match.playerB}</td>
                <td className="p-2">{match.winner}</td>
                <td className="p-2">{match.gameType}</td>
                <td className="p-2">{match.sessionId || '-'}</td>
                <td className="p-2 text-yellow-400">{match.source}</td>
                <td className="p-2">
                 <input
  type="checkbox"
  checked={match.ignore}
  onChange={(e) => {
    const updated = [...matches];
    const idx = updated.findIndex(m => m.id === match.id);
    if (idx !== -1) {
      updated[idx].ignore = e.target.checked;
      setMatches(updated); // update local state immediately
    }

    fetch('http://localhost:3001/ignore-match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: match.source,
        rowIndex: parseInt(match.id.split('-')[1]),
        ignore: e.target.checked
      })
    }).then(() => {
      console.log(`Updated ${match.id} to ${e.target.checked}`);
    });
  }}
/>



                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {matches.length > 0 && (
        <div className="mt-6 text-center">
  <button
    onClick={() => {
  if (confirm('Are you sure you want to delete the most recent match? This cannot be undone.')) {
    fetch('http://localhost:3001/last-match', {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Server responded with ${res.status}`);
        }
        return res.json();
      })
      .then(() => {
        alert('✅ Last match deleted and ELO reverted.');
        window.location.reload();
      })
      .catch(err => {
        console.error('Delete failed:', err);
        alert('❌ Failed to delete last match. See console for details.');
      });
  }
}}

    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
  >
    🗑️ Delete Last Match
  </button>
</div>
        )}

      </div>
    </div>
  );
}

export default MatchHistory;
