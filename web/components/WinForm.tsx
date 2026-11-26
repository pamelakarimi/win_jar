'use client';

import { useState } from 'react';
import { errorMessage } from '@/lib/api';

const EMOJIS = ['🎉', '💪', '🧠', '❤️', '🚀', '🌱', '😊', '🏆'];

type Props = {
  onSubmit: (text: string, emoji: string | null) => Promise<void>;
};

export default function WinForm({ onSubmit }: Props) {
  const [text, setText] = useState('');
  const [emoji, setEmoji] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setSaving(true);
    setError('');
    try {
      await onSubmit(text.trim(), emoji);
      setText('');
      setEmoji(null);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl bg-white p-5 shadow-sm">
      <label className="block font-medium">What did you do well today?</label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={280}
        rows={3}
        placeholder="e.g. Finished my first API"
        className="w-full rounded-lg border border-stone-200 p-3 outline-none focus:border-amber-500"
      />
      <div className="flex flex-wrap gap-2">
        {EMOJIS.map((e) => (
          <button
            type="button"
            key={e}
            onClick={() => setEmoji(emoji === e ? null : e)}
            className={`rounded-lg border px-2 py-1 text-xl ${
              emoji === e ? 'border-amber-500 bg-amber-100' : 'border-stone-200'
            }`}
          >
            {e}
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex items-center justify-between">
        <span className="text-xs text-stone-400">{text.length}/280</span>
        <button
          type="submit"
          disabled={saving || !text.trim()}
          className="rounded-full bg-amber-500 px-5 py-2 font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Add to jar'}
        </button>
      </div>
    </form>
  );
}
