/**
 * Groq AI - Suggest optimal booking slots
 * Based on historical bookings for a resource.
 */
async function callGroq({ system, prompt, temperature=0.3, max_tokens=220 }){
  const apiKey = process.env.GROQ_API_KEY;
  if(!apiKey) throw new Error("GROQ_API_KEY missing in .env");

  const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt }
      ],
      temperature,
      max_tokens
    })
  });

  const data = await response.json();
  if(!response.ok){
    const msg = data?.error?.message || "Groq API error";
    throw new Error(msg);
  }

  return data?.choices?.[0]?.message?.content?.trim() || "";
}

export async function suggestSlots({ resourceName, requestedDate, requestedSlot, trendText }){
  const prompt = `You are an AI assistant for college booking system.
Resource: ${resourceName}
Requested: ${requestedDate} at ${requestedSlot}

Historical usage trends:
${trendText}

Suggest 3 alternative optimal slots (best availability + less conflicts).
Return ONLY a JSON array of strings.
Example:
["2026-02-10 09:00-10:00","2026-02-10 15:00-16:00","2026-02-11 11:00-12:00"]`;

  const out = await callGroq({
    system: "You recommend best booking slots based on trends and availability.",
    prompt,
    temperature: 0.25,
    max_tokens: 140
  });

  try{
    const parsed = JSON.parse(out);
    if(Array.isArray(parsed)) return parsed.map(String).slice(0,3);
  }catch{}

  // fallback parse lines
  return out.split(/\r?\n/).map(x=>x.replace(/^[-*]\s*/,"").trim()).filter(Boolean).slice(0,3);
}
