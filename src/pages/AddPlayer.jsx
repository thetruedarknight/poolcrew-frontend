import React, { useState } from 'react';

function AddPlayer() {
  const [form, setForm] = useState({
    name: '',
    nickname: '',
    photo: '',
    cue: '',
    favoriteGame: '9-ball',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return alert('Name is required');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3001/players/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`✅ Player added with ID: ${data.id}`);
        setForm({ name: '', nickname: '', photo: '', cue: '', favoriteGame: '9-ball' });
      } else {
        alert(`❌ ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('❌ Failed to add player');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-gray-900 rounded-lg space-y-4">
      <h2 className="text-xl font-bold text-center">➕ Add New Player</h2>

      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Full Name *"
        required
        className="p-2 w-full bg-gray-800 rounded text-white"
      />

      <input
        type="text"
        name="nickname"
        value={form.nickname}
        onChange={handleChange}
        placeholder="Nickname (optional)"
        className="p-2 w-full bg-gray-800 rounded text-white"
      />

      <input
        type="url"
        name="photo"
        value={form.photo}
        onChange={handleChange}
        placeholder="Photo URL (optional)"
        className="p-2 w-full bg-gray-800 rounded text-white"
      />

      <input
        type="text"
        name="cue"
        value={form.cue}
        onChange={handleChange}
        placeholder="Cue Brand"
        className="p-2 w-full bg-gray-800 rounded text-white"
      />

      <select
        name="favoriteGame"
        value={form.favoriteGame}
        onChange={handleChange}
        className="p-2 w-full bg-gray-800 rounded text-white"
      >
        <option value="9-ball">9-ball</option>
        <option value="8-ball">8-ball</option>
        <option value="10-ball">10-ball</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        className="bg-green-500 hover:bg-green-600 text-white w-full py-2 px-4 rounded"
      >
        {loading ? 'Adding...' : 'Add Player'}
      </button>
    </form>
  );
}

export default AddPlayer;
