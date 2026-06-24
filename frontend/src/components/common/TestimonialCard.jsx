import React from 'react';
import { Star, Quote } from 'lucide-react';

export default function TestimonialCard({ testimonial }) {
  const { name, comment, rating, created_at } = testimonial;

  return (
    <div className="relative rounded-3xl border border-slate-700/30 bg-[#1E232A]/50 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-slate-600/50">
      {/* Quote decoration */}
      <Quote className="absolute right-6 top-6 h-8 w-8 rotate-180 text-slate-700/30" />

      {/* Stars */}
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, idx) => (
          <Star
            key={idx}
            className={`h-4 w-4 ${
              idx < rating 
                ? 'fill-amber-400 text-amber-400' 
                : 'text-slate-600'
            }`}
          />
        ))}
      </div>

      {/* Review text */}
      <p className="mt-4 text-sm italic text-slate-300 leading-relaxed">
        "{comment}"
      </p>

      {/* Reviewer Details */}
      <div className="mt-6 flex items-center gap-3 border-t border-slate-700/20 pt-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3B593F] font-bold text-white uppercase border border-[#3B593F]/50">
          {name.charAt(0)}
        </div>
        <div>
          <h5 className="text-sm font-bold text-white">{name}</h5>
          <span className="text-[10px] text-slate-400">
            {new Date(created_at).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
