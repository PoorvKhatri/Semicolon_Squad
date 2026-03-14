import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/50 backdrop-blur-sm">
      <div className="glass w-full max-w-md rounded-2xl border border-secondary-200 dark:border-white/10 bg-secondary-50 dark:bg-white/5 shadow-soft">
        <header className="flex items-center justify-between border-b border-secondary-200 dark:border-white/10 px-6 py-4">
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="text-secondary-500 dark:text-secondary-300 hover:text-secondary-700 dark:hover:text-white">
            <X size={20} />
          </button>
        </header>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
