import { useState } from "react";

const skills = [
  "Drawing / Art", "Photography", "Video Editing", "Coding", "Writing",
  "Music", "Sports / Fitness", "Cooking", "Gaming", "Social Media",
  "Math / Tutoring", "Languages", "Fashion / Style", "Fixing Things"
];

const timeOptions = ["1–2 hrs/day", "3–5 hrs/day", "Weekends only"];
const moneyOptions = ["$0 (no budget)", "$10–$50", "$50–$200"];

export default function App() {
  const [step, setStep] = useState(0);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [time, setTime] = useState("");
  const [budget, setBudget] = useState("");
  const [ideas, setIdeas] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleSkill = (s) => {
    setSelectedSkills(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  const generate = async () => {
    setLoading(true);
    setIdeas("");
    const prompt = `You are a teen money coach helping a 17-year-old earn money. Based on their profile, give 4 specific side hustle ideas they can START THIS WEEK.
Their skills: ${selectedSkills.join(", ")}
Time available: ${time}
Startup budget: ${budget}
For each idea give: 1. Idea name 2. How to start in 3 steps 3. Realistic earning per week 4. One pro tip. Use emojis. Be specific and teen-friendly.`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }]
      })
    });
    const data = await res.json();
    setIdeas(data.content?.map(b => b.text || "").join("\n") || "");
    setStep(3);
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0f0c29,#302b63,#24243e)", fontFamily:"sans-serif", color:"#fff", padding:"40px 20px" }}>
      <div style={{ maxWidth:600, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ fontSize:48 }}>💸</div>
          <h1 style={{ fontSize:32, fontWeight:800, margin:0 }}>Hustle Finder</h1>
          <p style={{ color:"#a78bfa" }}>AI-powered side hustle ideas for you</p>
        </div>

        {step === 0 && (
          <div>
            <h2>What are you good at? 🎯</h2>
            <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:20 }}>
              {skills.map(s => (
                <button key={s} onClick={() => toggleSkill(s)} style={{ padding:"8px 16px", borderRadius:999, border:`2px solid ${selectedSkills.includes(s)?"#7c3aed":"rgba(255,255,255,0.2)"}`, background:selectedSkills.includes(s)?"#7c3aed":"transparent", color:"#fff", cursor:"pointer" }}>{s}</button>
              ))}
            </div>
            <button disabled={!selectedSkills.length} onClick={() => setStep(1)} style={{ width:"100%", padding:16, background:"#7c3aed", border:"none", borderRadius:12, color:"#fff", fontSize:18, fontWeight:800, cursor:"pointer" }}>Next →</button>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2>How much time do you have? ⏰</h2>
            {timeOptions.map(t => (
              <button key={t} onClick={() => setTime(t)} style={{ display:"block", width:"100%", padding:14, marginBottom:10, border:`2px solid ${time===t?"#a78bfa":"rgba(255,255,255,0.15)"}`, borderRadius:12, background:time===t?"rgba(167,139,250,0.2)":"transparent", color:"#fff", cursor:"pointer", textAlign:"left", fontSize:16 }}>{t}</button>
            ))}
            <div style={{ display:"flex", gap:12, marginTop:10 }}>
              <button onClick={() => setStep(0)} style={{ flex:1, padding:14, background:"rgba(255,255,255,0.1)", border:"none", borderRadius:12, color:"#fff", cursor:"pointer" }}>← Back</button>
              <button disabled={!time} onClick={() => setStep(2)} style={{ flex:2, padding:14, background:"#7c3aed", border:"none", borderRadius:12, color:"#fff", fontWeight:800, cursor:"pointer" }}>Next →</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2>What's your startup budget? 💰</h2>
            {moneyOptions.map(m => (
              <button key={m} onClick={() => setBudget(m)} style={{ display:"block", width:"100%", padding:14, marginBottom:10, border:`2px solid ${budget===m?"#a78bfa":"rgba(255,255,255,0.15)"}`, borderRadius:12, background:budget===m?"rgba(167,139,250,0.2)":"transparent", color:"#fff", cursor:"pointer", textAlign:"left", fontSize:16 }}>{m}</button>
            ))}
            <div style={{ display:"flex", gap:12, marginTop:10 }}>
              <button onClick={() => setStep(1)} style={{ flex:1, padding:14, background:"rgba(255,255,255,0.1)", border:"none", borderRadius:12, color:"#fff", cursor:"pointer" }}>← Back</button>
              <button disabled={!budget} onClick={generate} style={{ flex:2, padding:14, background:"#7c3aed", border:"none", borderRadius:12, color:"#fff", fontWeight:800, cursor:"pointer" }}>Generate Ideas ✨</button>
            </div>
          </div>
        )}

        {loading && <div style={{ textAlign:"center", padding:40 }}><p style={{ color:"#a78bfa", fontSize:18 }}>Finding your perfect hustles... ✨</p></div>}

        {step === 3 && !loading && (
          <div>
            <h2>Your Personalized Ideas 🔥</h2>
            <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:16, padding:24, whiteSpace:"pre-wrap", lineHeight:1.8, color:"#e2e8f0", maxHeight:"60vh", overflowY:"auto" }}>{ideas}</div>
            <button onClick={() => { setStep(0); setSelectedSkills([]); setTime(""); setBudget(""); setIdeas(""); }} style={{ width:"100%", marginTop:20, padding:14, background:"rgba(255,255,255,0.1)", border:"none", borderRadius:12, color:"#fff", cursor:"pointer" }}>Start Over 🔄</button>
          </div>
        )}
      </div>
    </div>
  );
}