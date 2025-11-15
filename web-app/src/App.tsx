import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

declare global {
  interface Window {
    electronAPI: any;
  }
}

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const currentUser = await window.electronAPI.auth.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  };

  const handleLogin = async (email: string, password: string) => {
    const result = await window.electronAPI.auth.login({ email, password });
    if (result.success) {
      setUser(result.user);
    } else {
      alert(result.error);
    }
  };

  const handleLogout = async () => {
    await window.electronAPI.auth.logout();
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
