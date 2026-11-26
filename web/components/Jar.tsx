'use client';

import styles from './Jar.module.css';

type Props = {
  shaking: boolean;
  onShake: () => void;
};

export default function Jar({ shaking, onShake }: Props) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`text-8xl select-none ${shaking ? styles.shake : ''}`}>🫙</div>
      <button
        onClick={onShake}
        disabled={shaking}
        className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-white shadow hover:bg-amber-600 disabled:opacity-60"
      >
        {shaking ? 'Shaking...' : 'Shake the jar'}
      </button>
    </div>
  );
}
