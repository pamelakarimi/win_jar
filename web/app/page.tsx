'use client';

import { useEffect, useState } from 'react';
import Jar from '@/components/Jar';
import NavBar from '@/components/NavBar';
import WinCard from '@/components/WinCard';
import WinForm from '@/components/WinForm';
import { addWin, errorMessage, getRandomWin, getWins } from '@/lib/api';
import { localDateString } from '@/lib/date';
import type { Win } from '@/lib/types';
import { useRequireAuth } from '@/lib/useRequireAuth';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function HomePage() {
  const ready = useRequireAuth();
  const [loading, setLoading] = useState(true);
  const [todayWin, setTodayWin] = useState<Win | null>(null);
  const [randomWin, setRandomWin] = useState<Win | null>(null);
  const [shaking, setShaking] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // When the page opens, check whether today's win is already logged.
  useEffect(() => {
    if (!ready) return;
    getWins()
      .then((wins) => setTodayWin(wins.find((w) => w.date === localDateString()) ?? null))
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [ready]);

  async function handleAdd(text: string, emoji: string | null) {
    const win = await addWin(text, emoji);
    setTodayWin(win);
  }

  async function handleShake() {
    setShaking(true);
    setMessage('');
    setError('');
    try {
      // Wait for the animation AND the server at the same time.
      const [win] = await Promise.all([getRandomWin(), sleep(700)]);
      setRandomWin(win);
    } catch (err) {
      setRandomWin(null);
      await sleep(700);
      setMessage(errorMessage(err));
    } finally {
      setShaking(false);
    }
  }

  if (!ready) return null;

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-2xl space-y-8 px-4 pb-16">
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

        {loading ? (
          <p className="text-center text-stone-500">Loading...</p>
        ) : todayWin ? (
          <section className="space-y-2">
            <h2 className="font-semibold">✅ Today&apos;s win is in the jar</h2>
            <WinCard win={todayWin} />
          </section>
        ) : (
          <WinForm onSubmit={handleAdd} />
        )}

        <section className="space-y-4 rounded-2xl bg-amber-100/60 p-6">
          <h2 className="text-center font-semibold">Having a rough day?</h2>
          <Jar shaking={shaking} onShake={handleShake} />
          {message && <p className="text-center text-stone-600">{message}</p>}
          {randomWin && !shaking && (
            <div className="space-y-2">
              <p className="text-center text-sm text-stone-500">Remember this?</p>
              <WinCard win={randomWin} />
            </div>
          )}
        </section>
      </main>
    </>
  );
}
