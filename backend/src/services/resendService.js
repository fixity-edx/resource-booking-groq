export async function sendEmail({ to, subject, html }){
  const key = process.env.RESEND_API_KEY;
  if(!key) return { skipped: true };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "Booking System <onboarding@resend.dev>",
      to,
      subject,
      html
    })
  });

  const data = await res.json();
  if(!res.ok) throw new Error(data?.message || "Resend error");
  return data;
}
