import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel, theme }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`${theme.cardBg} max-w-md w-full rounded-2xl p-6 shadow-xl border-2 ${theme.border}`}>
        <div className="flex items-start gap-4">
          <div className="p-2 bg-yellow-500/20 rounded-lg">
            <AlertTriangle size={24} className="text-yellow-500" />
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-semibold mb-4 ${theme.primary}`}>Confirm Action</h3>
            <p className={`${theme.secondary} mb-6`}>{message}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={onCancel}
                className={`px-4 py-2 rounded-lg ${theme.cardBg} ${theme.border} border hover:bg-[#06c1ff]/10 transition-colors`}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
