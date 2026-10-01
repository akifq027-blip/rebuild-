import React from 'react';
import { AlertTriangle, RotateCcw, X } from 'lucide-react';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
}

export const ResetModal: React.FC<ResetModalProps> = ({
  isOpen,
  onClose,
  onConfirmReset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-stone-900 border border-red-700/60 rounded-2xl p-6 max-w-md w-full shadow-2xl text-left relative animate-in zoom-in-95 fade-in duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-100 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-red-950/80 border border-red-700/50 text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-red-200">
              Reset Civilization?
            </h3>
            <span className="text-xs text-stone-400">
              This action cannot be undone
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-5 border-t border-stone-800 pt-3">
          "Are you sure you want to reset your civilization?" All gathered resources, constructed buildings, researched technologies, and mission milestones will return to their starting values.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-300 hover:text-stone-100 bg-stone-850 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirmReset();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-red-700 hover:bg-red-600 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Game</span>
          </button>
        </div>
      </div>
    </div>
  );
};
