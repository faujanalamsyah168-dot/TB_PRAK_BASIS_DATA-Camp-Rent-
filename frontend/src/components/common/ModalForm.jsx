import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function ModalForm({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}) {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();

  /*
   * Simpan fungsi onClose terbaru tanpa menjadikannya dependency
   * pada efek pembukaan modal. Hal ini penting karena parent sering
   * mengirim fungsi inline yang identitasnya berubah setiap render.
   */
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Mengunci scroll dan memasang listener hanya saat modal dibuka/ditutup.
  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocusedElement = document.activeElement;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onCloseRef.current?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Fokus hanya sekali ketika modal pertama kali dibuka.
    const animationFrameId = requestAnimationFrame(() => {
      dialogRef.current?.focus();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);

      // Kembalikan fokus ke tombol/elemen yang membuka modal.
      if (previouslyFocusedElement instanceof HTMLElement) {
        previouslyFocusedElement.focus();
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto p-4 ${className}`}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Tutup modal"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[#0c0f12]/90 backdrop-blur-sm"
      />

      {/* Modal dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative z-10 flex max-h-[calc(100dvh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-700/50 bg-[#1E232A] shadow-2xl animate-zoom-in"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header modal */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-700/50 bg-[#1E232A] px-6 py-4 md:px-8">
          <h3
            id={titleId}
            className="text-xl font-bold tracking-wide text-white"
          >
            {title}
          </h3>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Isi modal yang dapat di-scroll */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 md:px-8 md:py-6">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
