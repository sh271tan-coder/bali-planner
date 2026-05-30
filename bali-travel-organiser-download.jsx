import { useState } from "react";

const STEPS = ["Welcome", "Trip Details", "Style & Budget", "Interests", "Generate"];

const vibes = [
  { id: "honeymoon", label: "Honeymoon", emoji: "💑" },
  { id: "adventure", label: "Adventure", emoji: "🧗" },
  { id: "wellness", label: "Wellness & Yoga", emoji: "🧘" },
  { id: "culture", label: "Culture & Temples", emoji: "🛕" },
  { id: "party", label: "Party & Nightlife", emoji: "🎉" },
  { id: "family", label: "Family", emoji: "👨‍👩‍👧" },
  { id: "solo", label: "Solo Explorer", emoji: "🎒" },
  { id: "foodie", label: "Food & Coffee", emoji: "☕" },
];

const interests = [
  "Rice terraces", "Temple ceremonies", "Surfing", "Cooking class",
  "Waterfall hikes", "Spa & massage", "Scuba diving", "Sunset views",
  "Art galleries", "Night markets", "Villa pool days", "Monkey forest",
  "White water rafting", "Traditional dance shows", "Cycling tours", "Coffee plantation",
];

const budgetLevels = [
  { id: "budget", label: "Budget", range: "$50–100/day", desc: "Warungs, guesthouses, scooter hire" },
  { id: "mid", label: "Mid-range", range: "$100–250/day", desc: "Boutique hotels, private driver, fine dining" },
  { id: "luxury", label: "Luxury", range: "$250–600/day", desc: "Private villas, spa retreats, helicopter tours" },
];

const baliAreas = [
  { id: "ubud", label: "Ubud", desc: "Jungle, culture, yoga" },
  { id: "seminyak", label: "Seminyak", desc: "Beach clubs, boutiques" },
  { id: "canggu", label: "Canggu", desc: "Surf, cafés, digital nomads" },
  { id: "uluwatu", label: "Uluwatu", desc: "Clifftop temples, waves" },
  { id: "nusapenida", label: "Nusa Penida", desc: "Dramatic scenery, diving" },
  { id: "kuta", label: "Kuta", desc: "Nightlife, budget shopping" },
];

const affiliateLinks = {
  flights: "https://www.travelpayouts.com",
  hotels: "https://www.booking.com/region/id/bali.html",
  viator: "https://www.viator.com/Bali/d333-ttd",
};

export default function BaliOrganiser() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "", email: "", arrivalDate: "", duration: "7",
    groupSize: "2", vibe: "", budget: "", areas: [], interests: [],
    specialRequests: "",
  });
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState("");

  const toggle = (field, value) => {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(value)
        ? f[field].filter(x => x !== value)
        : [...f[field], value],
    }));
  };

  const generateItinerary = async () => {
    setLoading(true);
    setError("");
    const prompt = `You are an expert Bali travel planner. Create a detailed, personalized ${form.duration}-day Bali itinerary for ${form.name}.

Trip details:
- Group: ${form.groupSize} people
- Vibe: ${form.vibe}
- Budget level: ${form.budget}
- Areas of interest: ${form.areas.join(", ") || "flexible"}
- Activities they love: ${form.interests.join(", ") || "open to suggestions"}
- Arrival date: ${form.arrivalDate || "flexible"}
- Special requests: ${form.specialRequests || "none"}

Return ONLY a valid JSON object (no markdown, no backticks) with this exact structure:
{
  "title": "catchy trip title",
  "tagline": "one evocative sentence",
  "days": [
    {
      "day": 1,
      "theme": "day theme",
      "morning": "morning activity description",
      "afternoon": "afternoon activity description",
      "evening": "evening activity description",
      "stay": "recommended area to stay",
      "tip": "insider tip for this day"
    }
  ],
  "mustEat": ["dish 1", "dish 2", "dish 3"],
  "packingTips": ["tip 1", "tip 2", "tip 3"],
  "budgetNote": "specific budget breakdown note for this trip type"
}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === "text")?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setItinerary(parsed);
      setStep(4);
    } catch (e) {
      setError("Something went wrong generating your itinerary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return form.name && form.duration && form.groupSize;
    if (step === 2) return form.vibe && form.budget;
    if (step === 3) return form.interests.length > 0;
    return true;
  };

  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,215,120,0.2)",
    borderRadius: "10px", padding: "13px 16px", color: "#F5EDD8", fontSize: "15px",
    fontFamily: "'Crimson Text', Georgia, serif", outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0E1A0A 0%, #101510 40%, #1A1208 100%)",
      fontFamily: "'Crimson Text', Georgia, serif",
      color: "#F5EDD8",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Cinzel:wght@400;600&display=swap');
        input::placeholder, textarea::placeholder { color: rgba(245,237,216,0.3); }
        input:focus, select:focus, textarea:focus { border-color: rgba(255,215,120,0.5) !important; }
        select option { background: #1A1A0E; color: #F5EDD8; }
        @keyframes fadeUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
        .card-hover:hover { border-color: rgba(255,215,120,0.4) !important; background: rgba(255,215,120,0.08) !important; }
        .btn-primary { cursor: pointer; background: linear-gradient(135deg, #C8961A, #E8B84B); border: none; border-radius: 10px; padding: 14px 32px; color: #1A0E00; font-weight: 600; font-size: 16px; font-family: 'Cinzel', serif; letter-spacing: 1px; transition: all 0.2s; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(200,150,26,0.35); }
        .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
      `}</style>

      {/* Header */}
      <div style={{
        width: "100%", textAlign: "center", padding: "40px 24px 32px",
        borderBottom: "1px solid rgba(255,215,120,0.1)",
        background: "rgba(0,0,0,0.2)",
        animation: "fadeUp 0.6s ease both",
      }}>
        <div style={{ fontSize: "13px", letterSpacing: "5px", color: "#C8961A", textTransform: "uppercase", fontFamily: "'Cinzel', serif", marginBottom: "10px" }}>
          ✦ Bali Travel Organiser ✦
        </div>
        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(24px, 5vw, 42px)", fontWeight: "400", margin: "0 0 8px", letterSpacing: "2px" }}>
          Your Private Bali Planner
        </h1>
        <p style={{ color: "rgba(245,237,216,0.5)", fontSize: "16px", margin: 0, fontStyle: "italic" }}>
          AI-crafted itineraries • Curated bookings • Local secrets
        </p>
      </div>

      {/* Progress */}
      {step < 4 && (
        <div style={{ display: "flex", gap: "8px", padding: "24px 24px 0", animation: "fadeUp 0.6s 0.1s ease both", opacity: 0, animationFillMode: "forwards" }}>
          {STEPS.slice(1, 4).map((s, i) => (
            <div key={i} style={{
              height: "3px", width: "60px", borderRadius: "2px",
              background: i < step ? "linear-gradient(90deg, #C8961A, #E8B84B)" : "rgba(255,255,255,0.12)",
              transition: "background 0.3s",
            }} />
          ))}
        </div>
      )}

      <div style={{ width: "100%", maxWidth: "620px", padding: "32px 24px 60px", animation: "fadeUp 0.6s 0.15s ease both", opacity: 0, animationFillMode: "forwards" }}>

        {/* STEP 0: Welcome */}
        {step === 0 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "80px", marginBottom: "24px" }}>🌴</div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "26px", fontWeight: "400", marginBottom: "16px" }}>
              Let's Plan Your Bali Journey
            </h2>
            <p style={{ color: "rgba(245,237,216,0.6)", fontSize: "17px", lineHeight: "1.7", marginBottom: "32px" }}>
              Answer a few questions and our AI planner will craft a personalised Bali itinerary — 
              complete with restaurant picks, hidden temples, and booking links.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "36px" }}>
              {[["✈️", "Custom itinerary"], ["🏨", "Curated hotels"], ["🎭", "Best activities"]].map(([icon, label], i) => (
                <div key={i} style={{ background: "rgba(255,215,120,0.05)", border: "1px solid rgba(255,215,120,0.15)", borderRadius: "10px", padding: "16px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: "24px", marginBottom: "6px" }}>{icon}</div>
                  <div style={{ fontSize: "13px", color: "rgba(245,237,216,0.6)" }}>{label}</div>
                </div>
              ))}
            </div>
            <button className="btn-primary" onClick={() => setStep(1)}>Begin Planning →</button>
          </div>
        )}

        {/* STEP 1: Trip Details */}
        {step === 1 && (
          <div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "22px", fontWeight: "400", marginBottom: "28px" }}>Tell us about your trip</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label style={{ fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", color: "#C8961A", display: "block", marginBottom: "8px" }}>Your Name</label>
                <input style={inputStyle} placeholder="e.g. Sarah & James" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", color: "#C8961A", display: "block", marginBottom: "8px" }}>Arrival Date</label>
                <input type="date" style={inputStyle} value={form.arrivalDate} onChange={e => setForm(f => ({ ...f, arrivalDate: e.target.value }))} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", color: "#C8961A", display: "block", marginBottom: "8px" }}>Duration</label>
                  <select style={inputStyle} value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}>
                    {["5","7","10","14","21"].map(d => <option key={d} value={d}>{d} days</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", color: "#C8961A", display: "block", marginBottom: "8px" }}>Group Size</label>
                  <select style={inputStyle} value={form.groupSize} onChange={e => setForm(f => ({ ...f, groupSize: e.target.value }))}>
                    {["1","2","3","4","5","6","8","10+"].map(n => <option key={n} value={n}>{n} {n === "1" ? "person" : "people"}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Style & Budget */}
        {step === 2 && (
          <div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "22px", fontWeight: "400", marginBottom: "8px" }}>What's your travel vibe?</h2>
            <p style={{ color: "rgba(245,237,216,0.4)", fontSize: "15px", marginBottom: "24px" }}>Pick one that best describes this trip</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "32px" }}>
              {vibes.map(v => (
                <div key={v.id} className="card-hover"
                  onClick={() => setForm(f => ({ ...f, vibe: v.id }))}
                  style={{
                    padding: "14px 16px", borderRadius: "10px", cursor: "pointer",
                    border: `1px solid ${form.vibe === v.id ? "rgba(255,215,120,0.6)" : "rgba(255,255,255,0.08)"}`,
                    background: form.vibe === v.id ? "rgba(255,215,120,0.1)" : "rgba(255,255,255,0.03)",
                    display: "flex", alignItems: "center", gap: "10px", transition: "all 0.15s",
                  }}>
                  <span style={{ fontSize: "20px" }}>{v.emoji}</span>
                  <span style={{ fontSize: "15px" }}>{v.label}</span>
                  {form.vibe === v.id && <span style={{ marginLeft: "auto", color: "#E8B84B", fontSize: "14px" }}>✓</span>}
                </div>
              ))}
            </div>

            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "18px", fontWeight: "400", marginBottom: "8px" }}>Budget Level</h3>
            <p style={{ color: "rgba(245,237,216,0.4)", fontSize: "15px", marginBottom: "16px" }}>Per person, per day (excluding flights)</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {budgetLevels.map(b => (
                <div key={b.id} className="card-hover"
                  onClick={() => setForm(f => ({ ...f, budget: b.id }))}
                  style={{
                    padding: "16px 20px", borderRadius: "10px", cursor: "pointer",
                    border: `1px solid ${form.budget === b.id ? "rgba(255,215,120,0.6)" : "rgba(255,255,255,0.08)"}`,
                    background: form.budget === b.id ? "rgba(255,215,120,0.08)" : "rgba(255,255,255,0.03)",
                    display: "flex", alignItems: "center", gap: "16px", transition: "all 0.15s",
                  }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "4px" }}>
                      <span style={{ fontSize: "16px", fontWeight: "600" }}>{b.label}</span>
                      <span style={{ fontSize: "14px", color: "#C8961A" }}>{b.range}</span>
                    </div>
                    <div style={{ fontSize: "14px", color: "rgba(245,237,216,0.45)" }}>{b.desc}</div>
                  </div>
                  {form.budget === b.id && <span style={{ color: "#E8B84B", fontSize: "18px" }}>✓</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Interests & Areas */}
        {step === 3 && (
          <div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "22px", fontWeight: "400", marginBottom: "8px" }}>What excites you?</h2>
            <p style={{ color: "rgba(245,237,216,0.4)", fontSize: "15px", marginBottom: "20px" }}>Select all that interest you</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "32px" }}>
              {interests.map(i => (
                <div key={i}
                  onClick={() => toggle("interests", i)}
                  style={{
                    padding: "8px 14px", borderRadius: "20px", cursor: "pointer", fontSize: "14px",
                    border: `1px solid ${form.interests.includes(i) ? "#C8961A" : "rgba(255,255,255,0.12)"}`,
                    background: form.interests.includes(i) ? "rgba(200,150,26,0.15)" : "rgba(255,255,255,0.03)",
                    color: form.interests.includes(i) ? "#E8B84B" : "rgba(245,237,216,0.7)",
                    transition: "all 0.15s", userSelect: "none",
                  }}>
                  {i}
                </div>
              ))}
            </div>

            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "18px", fontWeight: "400", marginBottom: "8px" }}>Bali areas to explore?</h3>
            <p style={{ color: "rgba(245,237,216,0.4)", fontSize: "15px", marginBottom: "16px" }}>Pick your favourites (or leave open)</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "24px" }}>
              {baliAreas.map(a => (
                <div key={a.id} className="card-hover"
                  onClick={() => toggle("areas", a.id)}
                  style={{
                    padding: "12px 14px", borderRadius: "10px", cursor: "pointer",
                    border: `1px solid ${form.areas.includes(a.id) ? "rgba(255,215,120,0.5)" : "rgba(255,255,255,0.08)"}`,
                    background: form.areas.includes(a.id) ? "rgba(255,215,120,0.08)" : "rgba(255,255,255,0.03)",
                    transition: "all 0.15s",
                  }}>
                  <div style={{ fontSize: "15px", marginBottom: "2px" }}>{a.label}</div>
                  <div style={{ fontSize: "12px", color: "rgba(245,237,216,0.4)" }}>{a.desc}</div>
                </div>
              ))}
            </div>

            <div>
              <label style={{ fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", color: "#C8961A", display: "block", marginBottom: "8px" }}>Special Requests</label>
              <textarea
                style={{ ...inputStyle, minHeight: "80px", resize: "vertical", lineHeight: "1.5" }}
                placeholder="Honeymoon surprise, dietary restrictions, accessibility needs..."
                value={form.specialRequests}
                onChange={e => setForm(f => ({ ...f, specialRequests: e.target.value }))}
              />
            </div>
          </div>
        )}

        {/* STEP 4: Itinerary Result */}
        {step === 4 && itinerary && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div style={{ fontSize: "13px", letterSpacing: "4px", color: "#C8961A", fontFamily: "'Cinzel', serif", marginBottom: "12px" }}>✦ YOUR ITINERARY IS READY ✦</div>
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(20px, 4vw, 30px)", fontWeight: "400", margin: "0 0 10px" }}>{itinerary.title}</h2>
              <p style={{ fontStyle: "italic", color: "rgba(245,237,216,0.55)", fontSize: "16px" }}>{itinerary.tagline}</p>
            </div>

            {/* Days */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "28px" }}>
              {itinerary.days?.slice(0, parseInt(form.duration)).map((day, i) => (
                <div key={i} style={{
                  background: "rgba(255,215,120,0.04)", border: "1px solid rgba(255,215,120,0.14)",
                  borderRadius: "12px", overflow: "hidden",
                }}>
                  <div style={{ background: "rgba(200,150,26,0.12)", padding: "12px 18px", borderBottom: "1px solid rgba(255,215,120,0.1)" }}>
                    <span style={{ fontFamily: "'Cinzel', serif", fontSize: "13px", letterSpacing: "2px", color: "#C8961A" }}>DAY {day.day}</span>
                    <span style={{ marginLeft: "12px", fontSize: "15px" }}>{day.theme}</span>
                  </div>
                  <div style={{ padding: "16px 18px", display: "grid", gap: "10px" }}>
                    {[["🌅 Morning", day.morning], ["☀️ Afternoon", day.afternoon], ["🌙 Evening", day.evening]].map(([label, text]) => (
                      <div key={label} style={{ display: "flex", gap: "10px" }}>
                        <div style={{ fontSize: "13px", color: "#C8961A", minWidth: "90px", paddingTop: "2px" }}>{label}</div>
                        <div style={{ fontSize: "14px", color: "rgba(245,237,216,0.75)", lineHeight: "1.5" }}>{text}</div>
                      </div>
                    ))}
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "10px", display: "flex", gap: "8px" }}>
                      <span style={{ fontSize: "13px", color: "#6EC88E" }}>💡</span>
                      <span style={{ fontSize: "13px", color: "rgba(110,200,142,0.8)", fontStyle: "italic" }}>{day.tip}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Must Eat & Budget Note */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
              <div style={{ background: "rgba(200,80,80,0.06)", border: "1px solid rgba(200,80,80,0.15)", borderRadius: "12px", padding: "16px" }}>
                <div style={{ fontSize: "12px", letterSpacing: "2px", color: "#E88B6A", textTransform: "uppercase", marginBottom: "10px" }}>🍜 Must Eat</div>
                {itinerary.mustEat?.map((f, i) => <div key={i} style={{ fontSize: "14px", color: "rgba(245,237,216,0.7)", marginBottom: "5px" }}>• {f}</div>)}
              </div>
              <div style={{ background: "rgba(80,150,200,0.06)", border: "1px solid rgba(80,150,200,0.15)", borderRadius: "12px", padding: "16px" }}>
                <div style={{ fontSize: "12px", letterSpacing: "2px", color: "#6EAEC8", textTransform: "uppercase", marginBottom: "10px" }}>🎒 Pack</div>
                {itinerary.packingTips?.map((t, i) => <div key={i} style={{ fontSize: "14px", color: "rgba(245,237,216,0.7)", marginBottom: "5px" }}>• {t}</div>)}
              </div>
            </div>

            {itinerary.budgetNote && (
              <div style={{ background: "rgba(200,150,26,0.06)", border: "1px solid rgba(200,150,26,0.15)", borderRadius: "10px", padding: "14px 18px", marginBottom: "28px", fontSize: "14px", color: "rgba(245,237,216,0.65)", fontStyle: "italic" }}>
                💰 {itinerary.budgetNote}
              </div>
            )}

            {/* Booking Links */}
            <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,215,120,0.2)", borderRadius: "12px", padding: "20px 22px", marginBottom: "20px" }}>
              <div style={{ fontSize: "12px", letterSpacing: "3px", color: "#C8961A", textTransform: "uppercase", marginBottom: "16px" }}>Book Your Trip</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { label: "✈️ Search Flights to Bali", url: affiliateLinks.flights, note: "Compare prices across 750+ airlines" },
                  { label: "🏨 Browse Bali Hotels", url: affiliateLinks.hotels, note: "From guesthouses to private villas" },
                  { label: "🎭 Book Bali Activities", url: affiliateLinks.viator, note: "Tours, temples, cooking classes & more" },
                ].map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px",
                      background: "rgba(255,215,120,0.05)", border: "1px solid rgba(255,215,120,0.12)",
                      borderRadius: "8px", textDecoration: "none", transition: "all 0.15s",
                    }}
                    onMouseOver={e => e.currentTarget.style.borderColor = "rgba(255,215,120,0.3)"}
                    onMouseOut={e => e.currentTarget.style.borderColor = "rgba(255,215,120,0.12)"}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "15px", color: "#E8B84B" }}>{link.label}</div>
                      <div style={{ fontSize: "12px", color: "rgba(245,237,216,0.35)", marginTop: "2px" }}>{link.note}</div>
                    </div>
                    <div style={{ color: "rgba(232,184,75,0.5)", fontSize: "16px" }}>→</div>
                  </a>
                ))}
              </div>
            </div>

            <button className="btn-primary" onClick={() => { setStep(1); setItinerary(null); setForm({ name:"",email:"",arrivalDate:"",duration:"7",groupSize:"2",vibe:"",budget:"",areas:[],interests:[],specialRequests:"" }); }} style={{ width: "100%", marginBottom: "8px" }}>
              Plan Another Trip
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: "rgba(200,80,80,0.1)", border: "1px solid rgba(200,80,80,0.3)", borderRadius: "8px", padding: "14px 16px", marginTop: "16px", fontSize: "14px", color: "#E88A8A" }}>
            {error}
          </div>
        )}

        {/* Navigation */}
        {step > 0 && step < 4 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "32px" }}>
            <button onClick={() => setStep(s => s - 1)} style={{
              background: "transparent", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px",
              padding: "12px 20px", color: "rgba(245,237,216,0.6)", cursor: "pointer", fontSize: "15px",
              fontFamily: "'Crimson Text', Georgia, serif",
            }}>← Back</button>

            {step < 3 ? (
              <button className="btn-primary" onClick={() => setStep(s => s + 1)} disabled={!canProceed()}>
                Continue →
              </button>
            ) : (
              <button className="btn-primary" onClick={generateItinerary} disabled={loading || !canProceed()}>
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ display: "inline-block", width: "14px", height: "14px", border: "2px solid rgba(26,14,0,0.3)", borderTopColor: "#1A0E00", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                    Crafting your itinerary...
                  </span>
                ) : "✨ Generate My Itinerary"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
