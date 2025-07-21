import React, { useState } from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);

  const login = async () => {
    const res = await fetch('http://localhost:8000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.access_token) {
      setToken(data.access_token);
      alert('Logged in!');
    } else {
      alert('Login failed!');
    }
  };

  const getMe = async () => {
    const res = await fetch('http://localhost:8000/api/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setUser(data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>JWT Login</h1>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      /><br />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      <button onClick={login}>Login</button>

      {token && (
        <>
          <h2>Your Token:</h2>
          <code>{token}</code>
          <br />
          <button onClick={getMe}>Get Me</button>
        </>
      )}

      {user && (
        <>
          <h2>User Info</h2>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </>
      )}
    </div>
  );
}

export default App;
