import Booking from "../models/Booking.js";
import Resource from "../models/Resource.js";
import { suggestSlots } from "../services/groqService.js";
import { sendEmail } from "../services/resendService.js";

const SLOTS = ["09:00-10:00","10:00-11:00","11:00-12:00","12:00-13:00","14:00-15:00","15:00-16:00","16:00-17:00"];

function buildTrend(bookings){
  // simple frequency count
  const freq = {};
  for(const b of bookings){
    freq[b.slot] = (freq[b.slot]||0)+1;
  }
  const lines = Object.entries(freq).sort((a,b)=>b[1]-a[1]).map(([slot,count]) => `- ${slot}: ${count} bookings`);
  return lines.join("\n") || "- No history yet";
}

export async function listBookings(req, res, next){
  try{
    const filter = req.user.role === "user" ? { user: req.user._id } : {};
    const items = await Booking.find(filter)
      .populate("resource", "name type location")
      .populate("user", "email name")
      .sort({ createdAt: -1 });
    res.json(items);
  }catch(err){ next(err); }
}

export async function createBooking(req, res, next){
  try{
    const { resourceId, date, slot } = req.body;

    const resource = await Resource.findById(resourceId);
    if(!resource){ res.status(400); throw new Error("Invalid resource"); }

    // conflict check if already approved booking exists
    const conflict = await Booking.findOne({ resource: resourceId, date, slot, status: "approved" });
    if(conflict){ res.status(400); throw new Error("Slot already booked (approved)"); }

    // historical bookings for trends (last 60 entries)
    const history = await Booking.find({ resource: resourceId, status: "approved" }).sort({ createdAt: -1 }).limit(60);
    const trendText = buildTrend(history);

    const aiSuggestions = await suggestSlots({
      resourceName: resource.name,
      requestedDate: date,
      requestedSlot: slot,
      trendText
    });

    const item = await Booking.create({
      resource: resourceId,
      user: req.user._id,
      date,
      slot,
      status: "pending",
      aiSuggestions
    });

    // optional email to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL || "delivered@resend.dev",
      subject: "New Booking Request",
      html: `<p><b>${req.user.email}</b> requested <b>${resource.name}</b> on ${date} (${slot}).</p>`
    }).catch(()=>{});

    res.status(201).json(item);
  }catch(err){ next(err); }
}

export async function updateStatus(req, res, next){
  try{
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findById(id).populate("resource", "name");
    if(!booking){ res.status(404); throw new Error("Booking not found"); }

    // if approve, conflict check
    if(status === "approved"){
      const conflict = await Booking.findOne({
        _id: { $ne: id },
        resource: booking.resource._id,
        date: booking.date,
        slot: booking.slot,
        status: "approved"
      });
      if(conflict){ res.status(400); throw new Error("Cannot approve: slot already taken"); }
    }

    booking.status = status;
    booking.actionBy = req.user._id;

    // refresh AI suggestions on update
    const history = await Booking.find({ resource: booking.resource._id, status: "approved" }).sort({ createdAt: -1 }).limit(60);
    const trendText = buildTrend(history);

    booking.aiSuggestions = await suggestSlots({
      resourceName: booking.resource.name,
      requestedDate: booking.date,
      requestedSlot: booking.slot,
      trendText
    });

    await booking.save();

    res.json(booking);
  }catch(err){ next(err); }
}
