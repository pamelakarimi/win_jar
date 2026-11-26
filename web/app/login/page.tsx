'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { errorMessage, login, signup } from '@/lib/api';
import { setToken } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result =
        mode === 'login' ? await login(email, password) : await signup(email, password);
      setToken(result.token);
      router.push('/');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <div className="mb-6 text-center">
        <div className="text-6xl">🫙</div>
        <h1 className="mt-2 text-2xl font-bold">Win Jar</h1>
        <p className="text-sm text-stone-500">One win a day. Shake it on a bad day.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-semibold">{mode === 'login' ? 'Log in' : 'Create account'}</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full rounded-lg border border-stone-200 p-3 outline-none focus:border-amber-500"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (min 8 characters)"
          required
          className="w-full rounded-lg border border-stone-200 p-3 outline-none focus:border-amber-500"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-amber-500 py-2.5 font-semibold text-white hover:bg-amber-600 disabled:opacity-60"
        >
          {loading ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Sign up'}
        </button>
        <button
          type="button"
          onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
          className="w-full text-sm text-stone-500 hover:text-stone-800"
        >
          {mode === 'login' ? "No account? Sign up" : 'Already have an account? Log in'}
        </button>
      </form>
    </main>
  );
}
