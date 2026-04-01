import React, { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { clearToken, getUser } from "../lib/auth";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";
import Toast from "../components/Toast";
import CalendarGrid from "../components/CalendarGrid";
import { LogOut, Plus, Sparkles, Shield, CheckCircle2, XCircle } from "lucide-react";

function Modal({ open, title, children, onClose }){
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-[28px] glass overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="text-lg font-semibold">{title}</div>
          <button onClick={onClose} className="text-slate-300 hover:text-white">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export default function Dashboard(){
  const user = getUser();
  const isAdmin = user?.role === "admin";

  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [monthDate, setMonthDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().toISOString().slice(0,10));
  const [toast, setToast] = useState(null);
  const notify = (title, message="") => { setToast({ title, message }); setTimeout(()=>setToast(null), 3200); };

  const fetchAll = async () => {
    try{
      const [r, b] = await Promise.all([
        api.get("/resources"),
        api.get("/bookings")
      ]);
      setResources(r.data);
      setBookings(b.data);
    }catch(err){
      notify("Error", err?.response?.data?.message || err.message);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const logout = async () => {
    try{ await api.post("/auth/logout", {}); }catch{}
    clearToken();
    window.location.href = "/login";
  };

  const dayBookings = useMemo(() => {
    return bookings.filter(b => (b.date||"").slice(0,10) === selectedDay);
  }, [bookings, selectedDay]);

  // booking request
  const [openBook, setOpenBook] = useState(false);
  const [bookForm, setBookForm] = useState({ resourceId:"", date:selectedDay, slot:"10:00-11:00" });

  const requestBooking = async (e) => {
    e.preventDefault();
    try{
      const res = await api.post("/bookings", bookForm);
      notify("Requested", "Booking requested. AI suggested slots updated.");
      setSuggestions(res.data.aiSuggestions || []);
      setOpenBook(false);
      fetchAll();
    }catch(err){
      notify("Error", err?.response?.data?.message || err.message);
    }
  };

  // admin create resource
  const [openRes, setOpenRes] = useState(false);
  const [resForm, setResForm] = useState({ name:"", type:"Lab", location:"Block A" });

  const createResource = async (e) => {
    e.preventDefault();
    try{
      await api.post("/resources", resForm);
      notify("Created", "Resource created.");
      setOpenRes(false);
      setResForm({ name:"", type:"Lab", location:"Block A" });
      fetchAll();
    }catch(err){
      notify("Error", err?.response?.data?.message || err.message);
    }
  };

  // admin approve/cancel
  const updateStatus = async (id, status) => {
    try{
      const res = await api.put(`/bookings/${id}/status`, { status });
      notify("Updated", "Booking updated.");
      setSuggestions(res.data.aiSuggestions || []);
      fetchAll();
    }catch(err){
      notify("Error", err?.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="rounded-[28px] glass p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-sm text-slate-200">
                <Sparkles size={16} />
                Smart Resource Booking
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold mt-3 tracking-tight">
                Calendar Booking Dashboard
              </h1>
              <p className="text-slate-300 mt-2">
                Logged in as <span className="font-semibold">{user?.name}</span> ({user?.role})
              </p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button onClick={()=>setOpenBook(true)}><Plus size={18}/> Book Slot</Button>
              {isAdmin ? <Button variant="secondary" onClick={()=>setOpenRes(true)}><Shield size={18}/> Add Resource</Button> : null}
              <Button variant="secondary" onClick={logout}><LogOut size={18}/> Logout</Button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <CalendarGrid
              monthDate={monthDate}
              bookings={bookings}
              onSelectDay={(d)=>{ setSelectedDay(d); setBookForm(f=>({...f,date:d})); }}
            />
          </div>

          <div className="rounded-[28px] glass p-5">
            <div className="text-lg font-bold">Bookings on {selectedDay}</div>
            <div className="text-sm text-slate-400 mt-1">Color-coded status</div>

            <div className="mt-4 grid gap-3">
              {dayBookings.length === 0 ? <div className="text-slate-400">No bookings.</div> : null}
              {dayBookings.map(b => (
                <div key={b._id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                  <div className="font-semibold">{b.resource?.name} • {b.slot}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    By: {b.user?.email} • {b.resource?.location}
                  </div>
                  <div className="mt-2 text-sm">
                    Status: <span className={b.status==="pending"?"text-amber-200":b.status==="approved"?"text-emerald-200":"text-rose-200"}>{b.status}</span>
                  </div>

                  {isAdmin && b.status==="pending" ? (
                    <div className="mt-3 flex gap-2 justify-end">
                      <button onClick={()=>updateStatus(b._id,"approved")} className="px-4 py-2 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-100 font-semibold inline-flex items-center gap-2">
                        <CheckCircle2 size={16}/> Approve
                      </button>
                      <button onClick={()=>updateStatus(b._id,"cancelled")} className="px-4 py-2 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-100 font-semibold inline-flex items-center gap-2">
                        <XCircle size={16}/> Cancel
                      </button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            {suggestions?.length ? (
              <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                <div className="text-sm font-semibold">🤖 AI Slot Suggestions</div>
                <ul className="mt-2 text-sm text-slate-200 list-disc list-inside">
                  {suggestions.map((s,i)=> <li key={i}>{s}</li>)}
                </ul>
              </div>
            ) : null}
          </div>
        </div>

        <Modal open={openBook} title="Request Booking" onClose={()=>setOpenBook(false)}>
          <form onSubmit={requestBooking} className="grid gap-4">
            <Select label="Resource" required value={bookForm.resourceId} onChange={(e)=>setBookForm(f=>({...f,resourceId:e.target.value}))}>
              <option value="" disabled>Select resource</option>
              {resources.map(r => <option key={r._id} value={r._id}>{r.name} ({r.type})</option>)}
            </Select>
            <Input label="Date" type="date" value={bookForm.date} onChange={(e)=>setBookForm(f=>({...f,date:e.target.value}))} />
            <Select label="Slot" value={bookForm.slot} onChange={(e)=>setBookForm(f=>({...f,slot:e.target.value}))}>
              {["09:00-10:00","10:00-11:00","11:00-12:00","12:00-13:00","14:00-15:00","15:00-16:00","16:00-17:00"].map(s => <option key={s}>{s}</option>)}
            </Select>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={()=>setOpenBook(false)}>Cancel</Button>
              <Button type="submit">Request + AI Suggest</Button>
            </div>
          </form>
        </Modal>

        <Modal open={openRes} title="Add Resource (Admin)" onClose={()=>setOpenRes(false)}>
          <form onSubmit={createResource} className="grid gap-4">
            <Input label="Resource Name" required value={resForm.name} onChange={(e)=>setResForm(f=>({...f,name:e.target.value}))} placeholder="Seminar Hall" />
            <Select label="Type" value={resForm.type} onChange={(e)=>setResForm(f=>({...f,type:e.target.value}))}>
              <option>Lab</option>
              <option>Classroom</option>
              <option>Seminar Hall</option>
              <option>Conference Room</option>
            </Select>
            <Input label="Location" value={resForm.location} onChange={(e)=>setResForm(f=>({...f,location:e.target.value}))} />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={()=>setOpenRes(false)}>Cancel</Button>
              <Button type="submit">Create</Button>
            </div>
          </form>
        </Modal>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
