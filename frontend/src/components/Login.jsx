import { useState, useEffect } from 'react';

const Login = ({ onLogin }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/user', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        onLogin(data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  const handleLogout = async () => {
    await fetch('http://localhost:5000/api/auth/logout', { credentials: 'include' });
    setUser(null);
    onLogin(null);
  };

  if (user) {
    return (
      <div className="login">
        <p>Welcome, {user.name} ({user.email})</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div className="login">
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default Login;