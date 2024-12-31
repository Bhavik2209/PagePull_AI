import { Download } from 'lucide-react';

interface DownloadButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function DownloadButton({ onClick, disabled = false }: DownloadButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
    >
      <Download className="w-4 h-4" />
      Download CSV
    </button>
  );
}