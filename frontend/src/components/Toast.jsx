import React from "react";
import { X } from "lucide-react";

export default function Toast({ toast, onClose }){
  if(!toast) return null;
  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-card px-4 py-3 flex items-start gap-3 max-w-sm">
        <div className="flex-1">
          <div className="font-semibold">{toast.title}</div>
          {toast.message ? <div className="text-sm text-slate-300 mt-1">{toast.message}</div> : null}
        </div>
        <button onClick={onClose} className="text-slate-300 hover:text-white"><X size={18} /></button>
      </div>
    </div>
  );
}
