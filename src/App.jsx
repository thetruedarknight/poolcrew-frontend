import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Leaderboard from './pages/Leaderboard';
import MatchInput from './pages/MatchInput';
import OneVsOneLog from './pages/OneVsOneLog';
import StartSession from './pages/StartSession';
import HeadToHead from './pages/HeadToHead';
import AddPlayer from './pages/AddPlayer';
import PlayerProfile from './pages/PlayerProfile';
import PlayerSelectPage from './pages/PlayerSelectPage.jsx';
import MatchHistory from './pages/MatchHistory';
import TrainingLog from './pages/TrainingLog';

function App() {
  return (
    <Router>
      <div className="p-4">
        <nav className="mb-4 space-x-4">
          <Link to="/" className="text-green-400 underline">Leaderboard</Link>
          <Link to="/match" className="text-green-400 underline">Enter a Match</Link>
          <Link to="/start-session" className="text-blue-400 underline">➕ New 1v1 Session</Link>
          <Link to="/1v1" className="text-blue-400 underline">Log 1v1 Game</Link>
          <Link to="/h2h" className="text-blue-300 underline">🔍 Compare Players</Link>
          <Link to="/add-player" className="text-green-400 underline">➕ Add Player</Link>
          <Link to="/player-select" className="text-green-400 underline">Individual Stats</Link>
          <Link to="/match-history" className="text-blue-300 underline">🧾 Match History</Link>
          <Link to="/training" className="text-green-400 underline">🧪 Log Training</Link>

        </nav>

       <Routes>
  <Route path="/" element={<Leaderboard />} />
  <Route path="/match" element={<MatchInput />} />
  <Route path="/start-session" element={<StartSession />} />
  <Route path="/1v1/:sessionId" element={<OneVsOneLog />} />
  <Route path="/h2h" element={<HeadToHead />} />
  <Route path="/add-player" element={<AddPlayer />} />
  <Route path="/player/:name" element={<PlayerProfile />} />
  <Route path="/player-select" element={<PlayerSelectPage />} />
  <Route path="/match-history" element={<MatchHistory />} />
  <Route path="/training" element={<TrainingLog />} />
</Routes>

      </div>
    </Router>
  );
}

export default App;
