import React from 'react';
import { useNavigate } from 'react-router-dom';

function StartSession() {
  const navigate = useNavigate();

  const generateSessionId = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const time = now.toTimeString().slice(0, 5).replace(':', '-'); // HH-MM
    return `${date}_${time}`;
  };

  const handleStart = () => {
    const sessionId = generateSessionId();
    navigate(`/1v1/${sessionId}`);
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg text-center">
      <h2 className="text-xl font-bold mb-4">🎱 Start New Game Session</h2>
      <button
        onClick={handleStart}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg"
      >
        Start New Session
      </button>
    </div>
  );
}

export default StartSession;
