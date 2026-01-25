import React from "react";

interface ConfirmDeleteModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ open, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-zinc-900 rounded-lg shadow-lg p-6 min-w-[300px] border border-zinc-700 flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-2 text-zinc-100">Delete Opening?</h2>
        <p className="text-sm text-zinc-400 mb-4">Are you sure you want to delete this opening? This action cannot be undone.</p>
        <div className="flex gap-4 mt-2">
          <button
            className="px-4 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white font-semibold shadow"
            onClick={onConfirm}
          >
            Delete
          </button>
          <button
            className="px-4 py-1.5 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-200 font-semibold shadow"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
