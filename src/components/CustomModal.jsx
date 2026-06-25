import {
  AlertTriangle,
  CheckCircle2,
  X,
} from "lucide-react";

export default function CustomModal({
  open,
  title,
  message,
  type = "error",
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">

      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6">

        <div className="flex justify-between items-center mb-5">

          <div className="flex items-center gap-3">

            {type === "success" ? (
              <CheckCircle2 className="text-green-400" />
            ) : (
              <AlertTriangle className="text-red-400" />
            )}

            <h2 className="font-bold text-xl">
              {title}
            </h2>

          </div>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        <p className="text-slate-300">
          {message}
        </p>

        <button
          onClick={onClose}
          className="
            mt-6
            w-full
            bg-blue-600
            hover:bg-blue-700
            rounded-xl
            py-3
            font-semibold
          "
        >
          Tutup
        </button>

      </div>

    </div>
  );
}