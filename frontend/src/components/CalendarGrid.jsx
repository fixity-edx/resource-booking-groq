import React, { useMemo } from "react";
import { clsx } from "clsx";

function startOfWeek(d){
  const x = new Date(d);
  const day = (x.getDay()+6)%7;
  x.setDate(x.getDate()-day);
  x.setHours(0,0,0,0);
  return x;
}
function addDays(d,n){ const x=new Date(d); x.setDate(x.getDate()+n); return x; }

export default function CalendarGrid({ monthDate=new Date(), bookings=[], onSelectDay }){
  const grid = useMemo(() => {
    const first = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const start = startOfWeek(first);
    return Array.from({ length: 42 }).map((_,i) => addDays(start,i));
  }, [monthDate]);

  const map = useMemo(() => {
    const m = new Map();
    for(const b of bookings){
      const key = (b.date||"").slice(0,10);
      m.set(key, (m.get(key)||0)+1);
    }
    return m;
  }, [bookings]);

  return (
    <div className="rounded-3xl glass p-5">
      <div className="grid grid-cols-7 gap-2 text-xs text-slate-400 mb-3">
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(x => <div key={x} className="text-center">{x}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {grid.map((d, idx) => {
          const isCurrentMonth = d.getMonth() === monthDate.getMonth();
          const key = d.toISOString().slice(0,10);
          const count = map.get(key) || 0;
          return (
            <button
              key={idx}
              onClick={()=>onSelectDay?.(key)}
              className={clsx(
                "rounded-2xl p-3 text-left border transition hover:bg-white/10",
                "border-white/10 bg-slate-950/35",
                !isCurrentMonth && "opacity-40"
              )}
            >
              <div className="text-sm font-bold">{d.getDate()}</div>
              <div className="text-[11px] text-slate-400 mt-1">
                {count ? `${count} booking(s)` : "—"}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
