import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface AuthFormProps {
  onAuth: (user: any) => void;
}

export const AuthForm = ({ onAuth }: AuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      let result;
      if (isLogin) {
        result = await supabase.auth.signInWithPassword({ email, password });
      } else {
        result = await supabase.auth.signUp({ email, password });
      }
      if (result.error) {
        setError(result.error.message);
      } else if (result.data.user) {
        onAuth(result.data.user);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 350, margin: '0 auto', padding: 24, background: 'white', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 8 }}>{isLogin ? 'Login' : 'Sign Up'}</h2>
      <input
        type="email"
        placeholder="Email (username)"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
      />
      {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
      <button type="submit" disabled={loading} style={{ marginTop: 8 }}>
        {loading ? (isLogin ? 'Logging in...' : 'Signing up...') : (isLogin ? 'Login' : 'Sign Up')}
      </button>
      <div style={{ textAlign: 'center', marginTop: 8 }}>
        {isLogin ? (
          <span>Don't have an account? <button type="button" style={{ color: '#007bff', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} onClick={() => setIsLogin(false)}>Sign Up</button></span>
        ) : (
          <span>Already have an account? <button type="button" style={{ color: '#007bff', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} onClick={() => setIsLogin(true)}>Login</button></span>
        )}
      </div>
    </form>
  );
}; 