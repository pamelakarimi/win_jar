'use client';

import { useState } from 'react';
import { formatDate } from '@/lib/date';
import type { Win } from '@/lib/types';

type Props = {
  win: Win;
  onSave?: (id: number, text: string) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
};

export default function WinCard({ win, onSave, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(win.text);
  const [busy, setBusy] = useState(false);

  async function save() {
    if (!onSave || !text.trim()) return;
    setBusy(true);
    try {
      await onSave(win.id, text.trim());
      setEditing(false);
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!onDelete) return;
    if (!confirm('Delete this win?')) return;
    setBusy(true);
    try {
      await onDelete(win.id);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{win.emoji ?? '⭐'}</span>
        <div className="flex-1">
          {editing ? (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={280}
              rows={2}
              className="w-full rounded-lg border border-stone-200 p-2 outline-none focus:border-amber-500"
            />
          ) : (
            <p>{win.text}</p>
          )}
          <p className="mt-1 text-xs text-stone-400">{formatDate(win.date)}</p>
        </div>
      </div>

      {(onSave || onDelete) && (
        <div className="mt-3 flex justify-end gap-3 text-sm">
          {editing ? (
            <>
              <button onClick={() => { setEditing(false); setText(win.text); }} className="text-stone-500">
                Cancel
              </button>
              <button onClick={save} disabled={busy} className="font-semibold text-amber-600">
                Save
              </button>
            </>
          ) : (
            <>
              {onSave && (
                <button onClick={() => setEditing(true)} className="text-stone-500 hover:text-stone-800">
                  Edit
                </button>
              )}
              {onDelete && (
                <button onClick={remove} disabled={busy} className="text-red-500 hover:text-red-700">
                  Delete
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
