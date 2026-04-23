const biz = () => ({
  name:    process.env.BUSINESS_NAME  || 'TruFlow Heating & Cooling',
  phone:   process.env.BUSINESS_PHONE || '(630)999-0127',
  wa:      process.env.WHATSAPP_NUMBER|| '(888)581-5178',
  url:     process.env.FRONTEND_URL   || 'https://true-flow-hvac-frontend.vercel.app/',
  email:   process.env.BUSINESS_EMAIL || 'muzammilshaikh4373@gmail.com',
});

const userEmailHTML = ({ name, ticketId, serviceType, message }) => {
  const b = biz();
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Request Confirmed – ${b.name}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',Arial,sans-serif;background:#f1f5f9}
.wrap{max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)}
.hdr{background:linear-gradient(135deg,#0f2744 0%,#1a4480 100%);padding:40px;text-align:center}
.hdr-logo{font-size:13px;font-weight:700;color:#4fc3f7;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px}
.hdr h1{color:#fff;font-size:26px;font-weight:700}
.hdr p{color:rgba(255,255,255,.7);font-size:13px;margin-top:6px}
.body{padding:40px}
.greeting{font-size:17px;color:#0f2744;font-weight:600;margin-bottom:12px}
.text{font-size:14px;color:#4a5568;line-height:1.7;margin-bottom:16px}
.ticket-box{background:linear-gradient(135deg,#fff7ed,#fff);border:2px solid #ff6b35;border-radius:12px;padding:24px;margin:24px 0;text-align:center}
.ticket-label{font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#9ca3af;font-weight:600}
.ticket-id{font-size:28px;font-weight:800;color:#0f2744;letter-spacing:3px;font-family:'Courier New',monospace;margin-top:6px}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:20px 0}
.info-item{background:#f8fafc;border-radius:8px;padding:14px}
.info-item .label{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;font-weight:600}
.info-item .val{font-size:14px;color:#1e293b;font-weight:500;margin-top:4px}
.msg-box{background:#f8fafc;border-radius:10px;padding:16px;margin:16px 0;font-size:14px;color:#4a5568;line-height:1.6;font-style:italic;border-left:4px solid #ff6b35}
.btn-row{display:flex;gap:12px;margin:24px 0;flex-wrap:wrap}
.btn{display:inline-block;padding:14px 28px;border-radius:10px;font-weight:700;font-size:14px;text-decoration:none;text-align:center;flex:1}
.btn-call{background:#0f2744;color:#fff}
.btn-wa{background:#25d366;color:#fff}
.track-note{background:#eff6ff;border-radius:10px;padding:14px;font-size:13px;color:#1e40af;text-align:center}
.ftr{background:#f8fafc;padding:24px 40px;text-align:center;font-size:12px;color:#9ca3af;border-top:1px solid #e2e8f0}
.ftr a{color:#ff6b35;text-decoration:none}
</style></head><body>
<div class="wrap">
<div class="hdr">
  <div class="hdr-logo">🌡️ ${b.name}</div>
  <h1>Service Request Confirmed</h1>
  <p>We've received your request and will be in touch shortly</p>
</div>
<div class="body">
  <div class="greeting">Hi ${name},</div>
  <p class="text">Thank you for reaching out to ${b.name}! Your request has been successfully submitted. Our team will review it and contact you within <strong>2-4 hours</strong> (emergency requests: within 60 minutes).</p>
  <div class="ticket-box">
    <div class="ticket-label">Your Service Ticket ID</div>
    <div class="ticket-id">${ticketId}</div>
  </div>
  <div class="info-grid">
    <div class="info-item"><div class="label">Service Type</div><div class="val">${serviceType}</div></div>
    <div class="info-item"><div class="label">Status</div><div class="val" style="color:#f59e0b">⏳ Pending</div></div>
    <div class="info-item"><div class="label">Response Time</div><div class="val">2-4 Hours</div></div>
    <div class="info-item"><div class="label">Emergency</div><div class="val">Within 60 Min</div></div>
  </div>
  <p class="text"><strong>Your message:</strong></p>
  <div class="msg-box">"${message}"</div>
  <p class="text">Need immediate help? Contact us directly:</p>
  <div class="btn-row">
    <a href="tel:${b.phone}" class="btn btn-call">📞 ${b.phone}</a>
    <a href="https://wa.me/${b.wa}?text=Hi%2C%20my%20ticket%20is%20${ticketId}" class="btn btn-wa">💬 WhatsApp Us</a>
  </div>
  <div class="track-note">📋 Track your ticket at <a href="${b.url}/track-ticket">${b.url}/track-ticket</a> using ID: <strong>${ticketId}</strong></div>
</div>
<div class="ftr">© ${new Date().getFullYear()} ${b.name} · <a href="${b.url}">Visit Website</a> · <a href="mailto:${b.email}">Support</a></div>
</div>
</body></html>`;
};

const adminEmailHTML = ({ name, email, phone, serviceType, city, message, ticketId, priority }) => {
  const b = biz();
  const pColor = priority==='Emergency'?'#dc2626':priority==='High'?'#f59e0b':'#10b981';
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<title>New Request – ${b.name}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',Arial,sans-serif;background:#f1f5f9}
.wrap{max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)}
.hdr{background:#0f2744;padding:28px 40px;display:flex;align-items:center;justify-content:space-between}
.hdr h1{color:#fff;font-size:20px;font-weight:700}
.hdr p{color:#94a3b8;font-size:12px;margin-top:4px}
.priority{padding:6px 14px;border-radius:50px;font-size:12px;font-weight:700;color:#fff;background:${pColor}}
.alert{background:#fef2f2;border:1px solid #fecaca;border-left:4px solid #dc2626;padding:14px 20px;margin:0;font-size:14px;color:#991b1b;font-weight:600}
.body{padding:32px 40px}
.grid{border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin:16px 0}
.row{display:flex;border-bottom:1px solid #e2e8f0}
.row:last-child{border-bottom:none}
.lbl{background:#f8fafc;padding:12px 16px;width:130px;flex-shrink:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#6b7280}
.val{padding:12px 16px;font-size:14px;color:#1e293b}
.msg{background:#f8fafc;border-radius:10px;padding:16px;font-size:14px;color:#4a5568;line-height:1.6;font-style:italic;border-left:4px solid #ff6b35;margin:16px 0}
.btn{display:block;background:#ff6b35;color:#fff;text-decoration:none;text-align:center;padding:14px;border-radius:10px;font-weight:700;font-size:14px;margin-top:20px}
.ftr{background:#f8fafc;padding:16px 40px;font-size:12px;color:#9ca3af;border-top:1px solid #e2e8f0}
</style></head><body>
<div class="wrap">
<div class="hdr">
  <div><h1>🔔 New Service Request</h1><p>Received: ${new Date().toLocaleString('en-US',{timeZone:'America/Chicago'})} CST</p></div>
  <span class="priority">${priority}</span>
</div>
${priority==='Emergency'?'<div class="alert">⚠️ EMERGENCY REQUEST — Respond immediately!</div>':''}
<div class="body">
  <div class="grid">
    <div class="row"><div class="lbl">Ticket ID</div><div class="val"><strong style="font-family:monospace;font-size:16px">${ticketId}</strong></div></div>
    <div class="row"><div class="lbl">Name</div><div class="val">${name}</div></div>
    <div class="row"><div class="lbl">Email</div><div class="val"><a href="mailto:${email}" style="color:#ff6b35">${email}</a></div></div>
    <div class="row"><div class="lbl">Phone</div><div class="val"><a href="tel:${phone}" style="color:#ff6b35">${phone}</a></div></div>
    <div class="row"><div class="lbl">Service</div><div class="val">${serviceType}</div></div>
    <div class="row"><div class="lbl">City</div><div class="val">${city||'Not specified'}</div></div>
    <div class="row"><div class="lbl">Priority</div><div class="val" style="color:${pColor};font-weight:700">${priority}</div></div>
  </div>
  <div class="msg">"${message}"</div>
  <a href="${b.url}/admin" class="btn">🎛️ Open Admin Dashboard</a>
</div>
<div class="ftr">Automated notification from ${b.name} CRM System</div>
</div>
</body></html>`;
};

module.exports = { userEmailHTML, adminEmailHTML };
