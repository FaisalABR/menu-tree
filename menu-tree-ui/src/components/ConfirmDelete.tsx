"use client";

import { Trash2, AlertTriangle, X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

export default function ConfirmDelete({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
              <Trash2 size={24} />
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
            >
              <X size={20} />
            </button>
          </div>

          <h3 className="text-xl font-extrabold text-gray-900 mb-2">
            Delete Menu?
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Are you sure you want to delete{" "}
            <span className="font-bold text-gray-900">"{itemName}"</span>? This
            will also permanently remove all of its nested child menu items.
          </p>

          <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-2xl text-orange-700 mb-8 border border-orange-100">
            <AlertTriangle size={20} className="shrink-0" />
            <p className="text-xs font-bold leading-tight">
              This action is destructive and cannot be undone.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-full py-4 text-sm transition-all shadow-lg shadow-red-200 active:scale-95"
            >
              Delete Permanently
            </button>
            <button
              onClick={onClose}
              className="w-full text-blue-600 hover:text-blue-700 font-bold text-sm py-2 hover:bg-blue-50 rounded-full transition-colors"
            >
              Keep Menu (Cancel)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
