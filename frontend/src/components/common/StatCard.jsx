import React from 'react';

export default function StatCard({ title, value, icon, color = 'primary' }) {
  const colorStyles = {
    primary: 'border-l-[#E2725B] text-[#E2725B]',
    secondary: 'border-l-[#3B593F] text-[#3B593F]',
    success: 'border-l-emerald-500 text-emerald-500',
    warning: 'border-l-amber-500 text-amber-500',
    danger: 'border-l-rose-500 text-rose-500',
    info: 'border-l-sky-500 text-sky-500',
  };

  return (
    <div className={`flex items-center justify-between rounded-2xl border-l-4 bg-[#1E232A]/50 p-6 shadow-xl backdrop-blur-md border border-slate-700/30 ${colorStyles[color] || colorStyles.primary}`}>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">{title}</span>
        <span className="text-3xl font-extrabold text-white tracking-tight">{value}</span>
      </div>
      <div className={`rounded-xl bg-[#1E232A] p-3 border border-slate-700/50 ${colorStyles[color]}`}>
        {icon}
      </div>
    </div>
  );
}
