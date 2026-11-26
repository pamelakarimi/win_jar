'use client';

import { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import WinCard from '@/components/WinCard';
import { deleteWin, errorMessage, getWins, updateWin } from '@/lib/api';
import type { Win } from '@/lib/types';
import { useRequireAuth } from '@/lib/useRequireAuth';

export default function HistoryPage() {
  const ready = useRequireAuth();
  const [wins, setWins] = useState<Win[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ready) return;
    getWins()
      .then(setWins)
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [ready]);

  async function handleSave(id: number, text: string) {
    try {
      const updated = await updateWin(id, text);
      setWins((current) => current.map((w) => (w.id === id ? updated : w)));
    } catch (err) {
      setError(errorMessage(err));
      throw err;
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteWin(id);
      setWins((current) => current.filter((w) => w.id !== id));
    } catch (err) {
      setError(errorMessage(err));
      throw err;
    }
  }

  if (!ready) return null;

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-2xl space-y-4 px-4 pb-16">
        <h1 className="text-xl font-bold">Your wins ({wins.length})</h1>
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
        {loading ? (
          <p className="text-stone-500">Loading...</p>
        ) : wins.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center text-stone-500">
            <div className="text-5xl">🫙</div>
            <p className="mt-2">Your jar is empty. Add your first win on the Jar page!</p>
          </div>
        ) : (
          wins.map((win) => (
            <WinCard key={win.id} win={win} onSave={handleSave} onDelete={handleDelete} />
          ))
        )}
      </main>
    </>
  );
}
