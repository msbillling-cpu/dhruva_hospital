'use client';

import React from 'react';
import { motion } from 'framer-motion';
import toast, { Toast, resolveValue } from 'react-hot-toast';
import { X } from 'lucide-react';

interface Props {
  t: Toast;
}

export default function SwipeableToast({ t }: Props) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      whileHover={{ scale: 1.01 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={(_, info) => {
        // Swipe to wipe: if dragged horizontally by > 50px or flicked quickly
        if (Math.abs(info.offset.x) > 50 || Math.abs(info.velocity.x) > 300) {
          toast.dismiss(t.id);
        }
      }}
      className={`group relative flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-lg border text-sm font-medium transition-all select-none cursor-grab active:cursor-grabbing min-w-[280px] max-w-md ${
        t.type === 'error'
          ? 'bg-[#180808]/95 text-rose-100 border-rose-800/40 shadow-rose-950/40'
          : t.type === 'success'
          ? 'bg-[#061e14]/95 text-emerald-100 border-emerald-800/40 shadow-emerald-950/40'
          : 'bg-[#071b1e]/95 text-cyan-100 border-cyan-800/40 shadow-cyan-950/40'
      }`}
    >
      {/* Toast Message Content (No Emojis) */}
      <div className="flex-1 text-xs sm:text-sm font-sans tracking-wide leading-snug">
        {resolveValue(t.message, t)}
      </div>

      {/* Explicit X Dismiss Mark */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toast.dismiss(t.id);
        }}
        className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors shrink-0 flex items-center justify-center"
        aria-label="Close notification"
        title="Close"
      >
        <X size={15} strokeWidth={2.5} />
      </button>
    </motion.div>
  );
}
