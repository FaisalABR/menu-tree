"use client";

import { useState } from "react";

interface Props {
  onSubmit: (name: string) => void;
  onClose: () => void;
  defaultValue?: string;
}

export default function MenuModal({ onSubmit, onClose, defaultValue }: Props) {
  const [name, setName] = useState(defaultValue || "");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-lg font-semibold mb-4">Menu Form</h2>

        <input
          className="border w-full p-2 mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button className="px-3 py-1 bg-gray-200 rounded" onClick={onClose}>
            Cancel
          </button>

          <button
            className="px-3 py-1 bg-blue-600 text-white rounded"
            onClick={() => onSubmit(name)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
