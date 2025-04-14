import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'https://backenddemo-three.vercel.app/api/users';

const App = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', age: '' });
  const [editingId, setEditingId] = useState(null);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_URL);
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create or Update user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form);
      } else {
        await axios.post(API_URL, form);
      }
      setForm({ name: '', email: '', age: '' });
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      console.error('Submit failed', err);
    }
  };

  // Edit user
  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email, age: user.age });
    setEditingId(user._id);
  };

  // Delete user
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchUsers();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h1>SEMINAR DEMO</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        /><br />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        /><br />
        <input
          name="age"
          placeholder="Age"
          type="number"
          value={form.age}
          onChange={handleChange}
          required
        /><br />
        <button type="submit">{editingId ? 'Update' : 'Create'} User</button>
      </form>

      <ul>
        {users.map(user => (
          <li key={user._id} style={{ marginBottom: '1rem' }}>
            <strong>{user.name}</strong> ({user.email}, {user.age} years)
            <br />
            <button onClick={() => handleEdit(user)}>Edit</button>
            <button onClick={() => handleDelete(user._id)} style={{ marginLeft: '0.5rem' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
