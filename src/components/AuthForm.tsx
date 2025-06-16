import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
    <form onSubmit={handleSubmit} className="max-w-[350px] mx-auto p-6 bg-white rounded-lg shadow flex flex-col gap-4">
      <h2 className="text-center mb-2 text-xl font-semibold">{isLogin ? 'Login' : 'Sign Up'}</h2>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email (username)</Label>
        <Input
          id="email"
          type="email"
          placeholder="Email (username)"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <div className="text-red-600 text-center">{error}</div>}
      <Button type="submit" disabled={loading} className="mt-2 w-full">
        {loading ? (isLogin ? 'Logging in...' : 'Signing up...') : (isLogin ? 'Login' : 'Sign Up')}
      </Button>
      <div className="text-center mt-2">
        {isLogin ? (
          <span>Don't have an account? <button type="button" className="text-blue-600 underline" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} onClick={() => setIsLogin(false)}>Sign Up</button></span>
        ) : (
          <span>Already have an account? <button type="button" className="text-blue-600 underline" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} onClick={() => setIsLogin(true)}>Login</button></span>
        )}
      </div>
    </form>
  );
}; 