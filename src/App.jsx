import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════
   SENSEI ONLINE — senseionline.pl  ·  MVP v3 (Investor Demo)
   New: Connecting animation · Investor page · Toast system
        Interactive earnings calc · Star rating · Coin fx
   ═══════════════════════════════════════════════════════ */

const C = {
  bg: "#FAFAF7", bgAlt: "#F3F1EB", bgCard: "#FFFFFF",
  ink: "#1B1B2F", inkSoft: "#4A4A5E", inkMuted: "#8E8EA0",
  accent: "#C8102E", accentSoft: "#C8102E12", accentHover: "#A00D24",
  gold: "#D4A017", goldSoft: "#D4A01714",
  teal: "#0D7377", tealSoft: "#0D737712",
  green: "#16a34a", greenSoft: "#16a34a15",
  sidebar: "#1B1B2F", sidebarHover: "#2A2A42",
  border: "#E5E2DA", borderLight: "#EDEBE4",
  coinGold: "#F5B731", coinBg: "#FFF8E7",
};

const PACKAGES = [
  { coins: 15, price: 29, perMin: 1.93, save: 0, label: "Starter", icon: "🌱", desc: "Idealne na szybkie konsultacje." },
  { coins: 30, price: 49, perMin: 1.63, save: 15, label: "Standard", icon: "📚", desc: "Najpopularniejszy — pełna lekcja z zapasem.", popular: true },
  { coins: 60, price: 89, perMin: 1.48, save: 23, label: "Sensei Pack", icon: "🎯", desc: "Dla regularnych uczniów." },
  { coins: 90, price: 119, perMin: 1.32, save: 32, label: "Master Pack", icon: "👑", desc: "Maksymalny rabat dla ambitnych." },
];
const SUBJECTS = [
  { icon: "📐", name: "Matematyka", senseis: 142, coins: "8–18" },
  { icon: "🧪", name: "Chemia", senseis: 87, coins: "9–20" },
  { icon: "🔬", name: "Fizyka", senseis: 93, coins: "8–18" },
  { icon: "🇬🇧", name: "Angielski", senseis: 231, coins: "7–22" },
  { icon: "🇩🇪", name: "Niemiecki", senseis: 78, coins: "8–17" },
  { icon: "📖", name: "Polski", senseis: 119, coins: "7–16" },
  { icon: "🧬", name: "Biologia", senseis: 65, coins: "8–18" },
  { icon: "💻", name: "Informatyka", senseis: 54, coins: "10–25" },
  { icon: "🌍", name: "Geografia", senseis: 41, coins: "7–14" },
  { icon: "📜", name: "Historia", senseis: 58, coins: "7–15" },
];
const senseiS = [
  { name: "Anna Kowalska", subject: "Matematyka", rating: 4.9, reviews: 312, coinsPerMin: 1, ini: "AK", exp: "8 lat", badge: "sensei", sessions: 2841, bio: "Absolwentka UW, przygotowuje do matury z 95% skutecznością.", online: true },
  { name: "Piotr Nowak", subject: "Fizyka", rating: 4.8, reviews: 198, coinsPerMin: 1, ini: "PN", exp: "12 lat", badge: "master", sessions: 1920, bio: "Doktor nauk fizycznych, trudne koncepty tłumaczy prosto.", online: true },
  { name: "Marta Wiśniewska", subject: "Angielski", rating: 5.0, reviews: 487, coinsPerMin: 2, ini: "MW", exp: "10 lat", badge: "sensei", sessions: 4102, bio: "Cambridge CELTA, 3 lata w Londynie, native-level fluency.", online: false },
  { name: "Tomasz Zieliński", subject: "Chemia", rating: 4.7, reviews: 156, coinsPerMin: 1, ini: "TZ", exp: "6 lat", badge: null, sessions: 1205, bio: "Pasjonat chemii organicznej, każdą reakcję wyjaśni na przykładach.", online: true },
  { name: "Karolina Dąbrowska", subject: "Informatyka", rating: 4.9, reviews: 223, coinsPerMin: 2, ini: "KD", exp: "5 lat", badge: "master", sessions: 1678, bio: "Full-stack developer, uczy od podstaw po zaawansowane.", online: false },
  { name: "Michał Lewandowski", subject: "Polski", rating: 4.8, reviews: 189, coinsPerMin: 1, ini: "ML", exp: "15 lat", badge: "sensei", sessions: 3540, bio: "Polonista, autor materiałów maturalnych, egzaminator OKE.", online: true },
];
const COMPETITORS = [
  { name: "SenseiOnline", model: "SenseiCoin (za minutę)", commission: "20%", minLesson: "1 min", instantConnect: true, parentPanel: true, freeTrial: true, videoBuiltIn: true, pricing: "od 1.32 PLN/min", highlight: true },
  { name: "Superprof", model: "Za godzinę", commission: "~15–20%", minLesson: "60 min", instantConnect: false, parentPanel: false, freeTrial: true, videoBuiltIn: false, pricing: "60–150 PLN/h" },
  { name: "e-korepetycje", model: "Subskrypcja", commission: "Stała opłata", minLesson: "60 min", instantConnect: false, parentPanel: false, freeTrial: false, videoBuiltIn: false, pricing: "50–120 PLN/h" },
  { name: "Tutlo", model: "Za minutę (tylko języki)", commission: "N/A", minLesson: "1 min", instantConnect: true, parentPanel: false, freeTrial: true, videoBuiltIn: true, pricing: "1–3 PLN/min" },
  { name: "Preply", model: "Za godzinę", commission: "18–33%", minLesson: "60 min", instantConnect: false, parentPanel: false, freeTrial: false, videoBuiltIn: true, pricing: "40–200 PLN/h" },
];
const REVIEWS = [
  { name: "Kasia M.", role: "Uczennica LO", text: "Kupiłam 30 SenseiCoinów i starczyło mi na 3 sesje z matmy! Zdałam maturę na 92%.", rating: 5 },
  { name: "Marek W.", role: "Rodzic", text: "Widzę ile coinów córka wydaje i na co. Pełna kontrola budżetu edukacyjnego.", rating: 5 },
  { name: "Ola K.", role: "Studentka UW", text: "Czasem potrzebuję 10 minut konsultacji. Wydaję 10 coinów zamiast płacić za godzinę.", rating: 5 },
];

// ─── Helpers ───
const Stars = ({ n }) => (
  <span style={{ letterSpacing: 1, fontSize: 13 }}>
    <span style={{ color: C.coinGold }}>{"★".repeat(Math.floor(n))}</span>
    <span style={{ color: C.inkSoft, marginLeft: 4, fontWeight: 600 }}>{n}</span>
  </span>
);
const SectionTitle = ({ tag, tagColor, tagBg, title, accent, sub }) => (
  <div style={{ marginBottom: 48 }}>
    <span style={{ display: "inline-block", padding: "5px 14px", borderRadius: 30, fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", background: tagBg, color: tagColor }}>{tag}</span>
    <h2 style={{ fontSize: 36, fontWeight: 800, marginTop: 12, letterSpacing: -1, color: C.ink }}>{title} {accent && <span style={{ color: C.accent }}>{accent}</span>}</h2>
    {sub && <p style={{ color: C.inkSoft, marginTop: 8, fontSize: 15 }}>{sub}</p>}
  </div>
);

// ─── Toast Component ───
function ToastContainer({ toasts }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          padding: "12px 18px", borderRadius: 12, fontSize: 14, fontWeight: 600,
          background: t.type === "success" ? C.green : t.type === "coin" ? C.coinBg : C.sidebar,
          color: t.type === "coin" ? C.gold : "#fff",
          border: t.type === "coin" ? `1.5px solid ${C.coinGold}40` : "none",
          boxShadow: "0 8px 24px rgba(0,0,0,.15)",
          display: "flex", alignItems: "center", gap: 8,
          animation: "slideIn .3s ease-out both",
        }}>
          <span style={{ fontSize: 18 }}>{t.icon}</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── Connecting Overlay ───
function ConnectingOverlay({ sensei, onConnected, onCancel }) {
  const [phase, setPhase] = useState(0); // 0=searching, 1=found, 2=connecting
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 2200);
    const t2 = setTimeout(() => setPhase(2), 3000);
    const t3 = setTimeout(() => onConnected(), 3600);
    const prog = setInterval(() => setProgress(p => Math.min(p + 2.5, 100)), 55);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearInterval(prog); };
  }, []);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(13,13,26,.92)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", maxWidth: 360, padding: 40 }}>
        {/* Pulse rings */}
        <div style={{ position: "relative", width: 100, height: 100, margin: "0 auto 28px" }}>
          {phase < 1 && [0, 1, 2].map(i => (
            <div key={i} style={{
              position: "absolute", inset: -i * 18, borderRadius: "50%",
              border: `2px solid ${C.coinGold}${30 - i * 8}`,
              animation: `pingRing ${1.2 + i * 0.3}s ease-out ${i * 0.2}s infinite`,
            }} />
          ))}
          <div style={{
            width: 100, height: 100, borderRadius: "50%",
            background: phase >= 1
              ? `linear-gradient(135deg, ${C.green}30, ${C.green}50)`
              : `linear-gradient(135deg, ${C.accentSoft}, ${C.goldSoft})`,
            border: `3px solid ${phase >= 1 ? C.green : C.coinGold}60`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: phase >= 1 ? 36 : 28, fontWeight: 800, color: phase >= 1 ? C.green : C.accent,
            transition: "all .4s ease",
          }}>
            {phase >= 1 ? "✓" : sensei.ini}
          </div>
        </div>

        <div style={{ marginBottom: 8 }}>
          {phase === 0 && <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Szukam Senseia<span style={{ animation: "dots 1.2s infinite" }}>...</span></div>}
          {phase === 1 && <div style={{ fontSize: 20, fontWeight: 700, color: C.green, marginBottom: 6 }}>✓ Sensei znaleziony!</div>}
          {phase === 2 && <div style={{ fontSize: 20, fontWeight: 700, color: C.coinGold, marginBottom: 6 }}>Łączę z sesją...</div>}
        </div>

        {phase === 0 && (
          <div style={{ fontSize: 14, color: "#888", marginBottom: 20 }}>
            Sprawdzam dostępność <strong style={{ color: "#ccc" }}>{sensei.name}</strong>
          </div>
        )}
        {phase >= 1 && (
          <div style={{ fontSize: 14, color: "#aaa", marginBottom: 20 }}>
            <strong style={{ color: "#fff" }}>{sensei.name}</strong> jest gotowy!
          </div>
        )}

        {/* Progress bar */}
        <div style={{ background: "#2A2A42", borderRadius: 8, height: 6, overflow: "hidden", marginBottom: 20 }}>
          <div style={{ height: "100%", width: `${progress}%`, background: phase >= 1 ? `linear-gradient(90deg, ${C.green}, #22c55e)` : `linear-gradient(90deg, ${C.accent}, ${C.coinGold})`, borderRadius: 8, transition: "width .1s linear" }} />
        </div>

        <div style={{ fontSize: 12, color: "#555" }}>
          ⚡ Zwykle zajmuje to &lt; 30 sekund
        </div>
        <button onClick={onCancel} style={{ marginTop: 16, background: "none", border: "none", color: "#555", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Anuluj</button>
      </div>
    </div>
  );
}

// ─── sensei Card ───
function TCard({ t, onConnect }) {
  return (
    <div className="card" style={{ padding: 22, position: "relative" }}>
      {t.badge && <div style={{ position: "absolute", top: 12, right: 12, padding: "3px 10px", borderRadius: 14, fontSize: 11, fontWeight: 700, fontFamily: "'Noto Serif JP',serif", background: C.accentSoft, color: C.accent, border: `1px solid ${C.accent}25` }}>{t.badge}</div>}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div style={{ position: "relative" }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, background: `linear-gradient(135deg,${C.accentSoft},${C.goldSoft})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 800, color: C.accent }}>{t.ini}</div>
          {t.online && <div style={{ position: "absolute", bottom: -2, right: -2, width: 12, height: 12, borderRadius: "50%", background: C.green, border: "2px solid #fff" }} />}
        </div>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: C.ink, marginBottom: 1 }}>{t.name}</h3>
          <div style={{ fontSize: 12, color: C.inkMuted }}>{t.subject} · {t.exp}</div>
        </div>
      </div>
      <p style={{ fontSize: 12, color: C.inkSoft, lineHeight: 1.5, marginBottom: 12 }}>{t.bio}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <Stars n={t.rating} />
        <span style={{ fontSize: 11, color: C.inkMuted }}>{t.reviews} opinii</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: C.coinBg, borderRadius: 10, border: `1px solid ${C.coinGold}20` }}>
        <div>
          <div style={{ fontSize: 10, color: C.inkMuted, textTransform: "uppercase", letterSpacing: .8 }}>Stawka</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: C.gold, fontFamily: "'DM Mono',monospace" }}>{t.coinsPerMin}</span>
            <span className="jp" style={{ fontSize: 13, color: C.coinGold }}>先</span>
            <span style={{ fontSize: 11, color: C.inkMuted }}>/min</span>
          </div>
        </div>
        <button className="bm" style={{ padding: "8px 18px", fontSize: 12, opacity: t.online ? 1 : 0.45, cursor: t.online ? "pointer" : "not-allowed" }}
          onClick={() => t.online && onConnect(t)} title={t.online ? "" : "Niedostępny"}>
          {t.online ? "Połącz teraz →" : "Zarezerwuj"}
        </button>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        <span style={{ fontSize: 11, color: C.inkMuted }}>{t.sessions.toLocaleString()} sesji</span>
        <span style={{ fontSize: 11, color: t.online ? C.green : C.inkMuted, fontWeight: 600 }}>{t.online ? "● Online teraz" : "○ Niedostępny"}</span>
      </div>
    </div>
  );
}
//asd
// ─── Interactive Earnings Calculator ───
function EarningsCalc({ onJoin }) {
  const [hours, setHours] = useState(3);
  const [rate, setRate] = useState(1.5);
  const [days, setDays] = useState(20);
  const commission = 0.20;
  const grossPerMonth = hours * 60 * rate * days;
  const net = grossPerMonth * (1 - commission);
  const taxEst = net * 0.12;
  const takeHome = net - taxEst;
  return (
    <div className="card" style={{ padding: 28 }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: C.ink, marginBottom: 20 }}>💰 Kalkulator zarobków</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 22 }}>
        {[
          { label: "Godziny dziennie", val: hours, set: setHours, min: 1, max: 8, step: 0.5, unit: "h" },
          { label: "Stawka za minutę", val: rate, set: setRate, min: 1, max: 2.5, step: 0.25, unit: "先/min" },
          { label: "Dni w miesiącu", val: days, set: setDays, min: 5, max: 26, step: 1, unit: "dni" },
        ].map(({ label, val, set, min, max, step, unit }) => (
          <div key={label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.inkSoft }}>{label}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.ink, fontFamily: "'DM Mono',monospace" }}>{val} {unit}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={val}
              onChange={e => set(parseFloat(e.target.value))}
              style={{ width: "100%", accentColor: C.accent, cursor: "pointer" }} />
          </div>
        ))}
      </div>
      <div style={{ background: C.coinBg, borderRadius: 14, padding: 20, border: `1.5px solid ${C.coinGold}30`, marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: C.inkSoft }}>Przychód brutto</span>
          <span style={{ fontFamily: "'DM Mono',monospace", fontWeight: 700, color: C.ink }}>{grossPerMonth.toFixed(0)} PLN</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: C.inkSoft }}>Prowizja platformy (20%)</span>
          <span style={{ fontFamily: "'DM Mono',monospace", color: C.accent }}>−{(grossPerMonth * commission).toFixed(0)} PLN</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${C.coinGold}30` }}>
          <span style={{ fontSize: 13, color: C.inkSoft }}>Szac. podatek (12%)</span>
          <span style={{ fontFamily: "'DM Mono',monospace", color: C.inkMuted }}>−{taxEst.toFixed(0)} PLN</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>Do ręki / miesiąc</span>
          <span style={{ fontSize: 32, fontWeight: 900, color: C.green, fontFamily: "'DM Mono',monospace" }}>
            {takeHome.toFixed(0)} PLN
          </span>
        </div>
      </div>
      <button className="bm" style={{ width: "100%" }} onClick={onJoin}>Dołącz jako Sensei →</button>
    </div>
  );
}

// ─── Investor Page ───
function InvestorPage({ nav }) {
  const metrics = [
    { label: "TAM", value: "2 mld PLN", sub: "Rynek korepetycji PL/rok", icon: "🌍", color: C.teal },
    { label: "SAM", value: "400 mln PLN", sub: "Segment online (rosnący)", icon: "💻", color: C.accent },
    { label: "SOM (rok 1)", value: "8 mln PLN", sub: "2% SAM — cel realistyczny", icon: "🎯", color: C.gold },
    { label: "Benchmark", value: "50+ mln PLN", sub: "Tutlo — tylko język angielski", icon: "📈", color: C.green },
  ];
  const unitEcon = [
    ["CAC (cel)", "25 PLN", "Google Ads + SEO", C.teal],
    ["Avg. Order", "49 PLN", "Pakiet Standard", C.accent],
    ["Gross Margin", "~80%", "Platforma take 20% GMV", C.green],
    ["LTV (cel)", "180 PLN", "6 sesji × avg 30 PLN", C.gold],
    ["LTV/CAC", "7.2×", "Zdrowy biznes od początku", C.green],
    ["Break-even", "~500 MAU", "Miesięcznych aktywnych", C.ink],
  ];
  const roadmap = [
    { q: "Q2 2026", title: "MVP Launch", items: ["Pierwsze 100 nauczycieli", "Stripe + BLIK integracja", "10 przedmiotów"], done: false },
    { q: "Q3 2026", title: "Traction", items: ["1 000 aktywnych uczniów", "Panel rodzica LIVE", "Mobile app (PWA)"], done: false },
    { q: "Q4 2026", title: "Scale", items: ["5 000 MAU", "B2B (szkoły, centra)", "Ekspansja: CZ, SK"], done: false },
    { q: "Q1 2027", title: "Series A", items: ["50 000 MAU", "GMV 2M PLN/mies.", "Pełna EU expansion"], done: false },
  ];
  return (
    <section className="fu" style={{ padding: "48px 40px", maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 30, background: C.accentSoft, border: `1px solid ${C.accent}30`, marginBottom: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.accent, letterSpacing: 1.5, textTransform: "uppercase" }}>📊 Investor Deck</span>
        </div>
        <h1 style={{ fontSize: 42, fontWeight: 900, letterSpacing: -2, color: C.ink, marginBottom: 12 }}>
          Dlaczego <span style={{ color: C.accent }}>SenseiOnline</span> wygra rynek
        </h1>
        <p style={{ fontSize: 16, color: C.inkSoft, maxWidth: 560, margin: "0 auto" }}>
          Polska EdTech — rosnący rynek, udowodniony model (Tutlo), nieobsłużony segment: wszystkie przedmioty, poMinutowo, z panelem rodzica.
        </p>
      </div>

      {/* Market size */}
      <div className="g4" style={{ marginBottom: 40 }}>
        {metrics.map((m, i) => (
          <div key={i} className="card" style={{ padding: 22, textAlign: "center", borderTop: `3px solid ${m.color}` }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{m.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: m.color, fontFamily: "'DM Mono',monospace", lineHeight: 1.2, marginBottom: 4 }}>{m.value}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 11, color: C.inkMuted }}>{m.sub}</div>
          </div>
        ))}
      </div>

      <div className="g2" style={{ marginBottom: 40, alignItems: "start" }}>
        {/* Unit Economics */}
        <div className="card" style={{ padding: 28 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: C.ink, marginBottom: 20 }}>📐 Unit Economics</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {unitEcon.map(([label, val, note, color], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < unitEcon.length - 1 ? `1px solid ${C.borderLight}` : "none" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{label}</div>
                  <div style={{ fontSize: 11, color: C.inkMuted }}>{note}</div>
                </div>
                <span style={{ fontSize: 18, fontWeight: 800, color, fontFamily: "'DM Mono',monospace" }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue model */}
        <div>
          <div className="card" style={{ padding: 24, marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: C.ink, marginBottom: 16 }}>💸 Model przychodów</h3>
            {[
              ["GMV (transakcje)", "100%", C.inkSoft],
              ["Prowizja platformy", "20% GMV", C.accent],
              ["Premium Sensei listing", "+5% / nauczyciel", C.gold],
              ["B2B (szkoły)", "Subskrypcja", C.teal],
            ].map(([label, val, color], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 3 ? `1px solid ${C.borderLight}` : "none" }}>
                <span style={{ fontSize: 13, color: C.inkSoft }}>{label}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color, fontFamily: "'DM Mono',monospace" }}>{val}</span>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: 24, background: C.greenSoft, border: `1.5px solid ${C.green}30` }}>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: C.ink, marginBottom: 14 }}>📊 Projekcja rok 1</h4>
            {[
              ["MAU (aktywni)", "5 000"],
              ["Śr. GMV / user", "49 PLN/mies."],
              ["GMV / miesiąc", "245 000 PLN"],
              ["Przychód (20%)", "49 000 PLN/mies."],
              ["Przychód rok 1", "~490 000 PLN"],
            ].map(([l, v], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                <span style={{ fontSize: 12, color: C.inkSoft }}>{l}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.green, fontFamily: "'DM Mono',monospace" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why us */}
      <div className="card" style={{ padding: 28, marginBottom: 40 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: C.ink, marginBottom: 20 }}>🏆 Dlaczego wygramy — moat</h3>
        <div className="g3">
          {[
            ["🪙", "SenseiCoin Flywheel", "Wewnętrzna waluta tworzy lock-in. Uczniowie mają 'nieużyte minuty' — wracają. Jak Duolingo Streaks, ale finansowy."],
            ["👨‍👩‍👧", "Panel Rodzica", "Jedyna platforma z pełną kontrolą rodzicielską. Adresuje główne obiekcje zakupowe: 'nie wiem ile wydaje dziecko'."],
            ["⚡", "Network Effect", "Więcej nauczycieli = krótszy czas czekania = więcej uczniów = wyższe prowizje = lepsi nauczyciele. Klasyczny marketplace flywheel."],
          ].map(([ic, t, d], i) => (
            <div key={i} style={{ textAlign: "center", padding: "8px 16px" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>{ic}</div>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: C.ink, marginBottom: 6 }}>{t}</h4>
              <p style={{ fontSize: 12, color: C.inkSoft, lineHeight: 1.6 }}>{d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap */}
      <h3 style={{ fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 20 }}>🗺️ Roadmap</h3>
      <div className="g4" style={{ marginBottom: 40 }}>
        {roadmap.map((r, i) => (
          <div key={i} className="card" style={{ padding: 20, borderTop: `3px solid ${i === 0 ? C.accent : i === 1 ? C.gold : i === 2 ? C.teal : C.green}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.inkMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{r.q}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.ink, marginBottom: 10 }}>{r.title}</div>
            {r.items.map((item, j) => (
              <div key={j} style={{ fontSize: 12, color: C.inkSoft, padding: "3px 0", display: "flex", gap: 6 }}>
                <span style={{ color: C.accent }}>→</span>{item}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Team / Ask */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card" style={{ padding: 28, background: `linear-gradient(135deg, ${C.sidebar}, #2A2A42)`, border: "none" }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 16 }}>🤝 Szukamy inwestora</h3>
          {[
            ["Runda", "Pre-seed"],
            ["Cel", "500 000 PLN"],
            ["Przeznaczenie", "Tech + Marketing"],
            ["Equity", "Do negocjacji"],
            ["Forma", "Sp. z o.o."],
          ].map(([l, v], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 4 ? "1px solid #2A2A42" : "none" }}>
              <span style={{ fontSize: 13, color: "#888" }}>{l}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.coinGold, fontFamily: "'DM Mono',monospace" }}>{v}</span>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: 28 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: C.ink, marginBottom: 16 }}>📬 Kontakt</h3>
          <p style={{ fontSize: 14, color: C.inkSoft, lineHeight: 1.7, marginBottom: 16 }}>
            Zainteresowany inwestycją lub partnerstwem? Chętnie omówimy szczegóły. Pełny deck na żądanie.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[["📧", "investor@senseionline.pl"], ["🌐", "senseionline.pl"], ["📍", "Wrocław, Polska"]].map(([ic, val], i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13, color: C.inkSoft }}>
                <span>{ic}</span><span style={{ fontFamily: "'DM Mono',monospace" }}>{val}</span>
              </div>
            ))}
          </div>
          <button className="bm" style={{ marginTop: 20, width: "100%" }}>Umów spotkanie →</button>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sq, setSq] = useState("");
  const [sf, setSf] = useState(null);
  const [studentCoins, setStudentCoins] = useState(42);
  const [userRole, setUserRole] = useState("student");
  const [activesensei, setActivesensei] = useState(null);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionCoinsSpent, setSessionCoinsSpent] = useState(0);
  const [connectingsensei, setConnectingsensei] = useState(null);
  const [sessionRating, setSessionRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [streak, setStreak] = useState(7); // 7 дней серии
const [streakBonusClaimed, setStreakBonusClaimed] = useState(false);
  const [toasts, setToasts] = useState([]);
  const sessionRef = useRef(null);
  const toastRef = useRef(0);

  const nav = p => { setPage(p); setSidebarOpen(false); };

  const addToast = useCallback((msg, type = "success", icon = "✓") => {
    const id = ++toastRef.current;
    setToasts(t => [...t, { id, msg, type, icon }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  }, []);

  const handleConnect = (sensei) => {
    if (studentCoins < 1) { nav("pricing"); addToast("Uzupełnij saldo 先 aby rozpocząć lekcję", "info", "⚠️"); return; }
    setConnectingsensei(sensei);
  };

  const onConnected = () => {
    setActivesensei(connectingsensei);
    setConnectingsensei(null);
    setSessionSeconds(0);
    setSessionCoinsSpent(0);
    setSessionRating(0);
    setSessionActive(true);
    nav("session");
    addToast(`Połączono z ${connectingsensei?.name}!`, "success", "🎥");
  };

  const buyCoins = (pack) => {
    setStudentCoins(c => c + pack.coins);
    addToast(`+${pack.coins} SenseiCoinów dodano!`, "coin", "先");
  };

  // Session timer
  useEffect(() => {
    if (sessionActive && page === "session") {
      sessionRef.current = setInterval(() => {
        setSessionSeconds(s => {
          const newS = s + 1;
          if (newS % 6 === 0) {
            setStudentCoins(c => {
              if (c <= 0) { endSession(); return 0; }
              return c - (activesensei?.coinsPerMin || 1);
            });
            setSessionCoinsSpent(sc => sc + (activesensei?.coinsPerMin || 1));
          }
          return newS;
        });
      }, 1000);
    }
    return () => clearInterval(sessionRef.current);
  }, [sessionActive, page, activesensei]);

  const endSession = () => {
    clearInterval(sessionRef.current);
    setSessionActive(false);
    nav("session-end");
    addToast("Lekcja zakończona! Zostaw ocenę.", "success", "⭐");
  };

  const formatTime = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const MENU = [
    { section: "Menu" },
    { icon: "🏠", label: "Strona główna", p: "home" },
    { icon: "⚡", label: "Jak to działa", p: "how" },
    { icon: "📚", label: "Przedmioty", p: "subjects" },
    { icon: "👨‍🏫", label: "Nauczyciele", p: "senseis" },
    ...(userRole === "student" ? [{ icon: "先", label: "Pakiety SenseiCoin", p: "pricing", isJp: true }] : []),
    { section: "Analiza" },
    { icon: "📊", label: "Matryca konkurentów", p: "competitors" },
    { icon: "📈", label: "Dla inwestorów", p: "investor" },
    { section: "Konto" },
    ...(userRole === "student" ? [
      { icon: "🎒", label: "Portfel studenta", p: "dashboard" },
      { icon: "👨‍👩‍👧", label: "Panel rodzica", p: "parent" },
      { icon: "🎓", label: "Dla nauczycieli", p: "for-senseis" },
    ] : [
      { icon: "👨‍🏫", label: "Panel Nauczyciela", p: "sensei-dashboard" }
    ])
  ];

  const ft = senseiS.filter(t => (!sf || t.subject === sf) && (!sq || (t.name + t.subject).toLowerCase().includes(sq.toLowerCase())));

  return (
    <div style={{ fontFamily: "'Outfit',sans-serif", background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@400;500&family=Noto+Serif+JP:wght@400;700;900&display=swap" rel="stylesheet" />
      <style>{`
        html,body,#root{margin:0;padding:0;overflow-x:hidden;width:100%;background:${C.bg}}
        *{margin:0;padding:0;box-sizing:border-box}
        ::selection{background:${C.accentSoft};color:${C.accent}}
        @keyframes fu{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(60px)}to{opacity:1;transform:translateX(0)}}
        @keyframes pingRing{0%{transform:scale(1);opacity:.6}100%{transform:scale(1.8);opacity:0}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes dots{0%{content:'...'}33%{content:'.'}66%{content:'..'}100%{content:'...'}}
        @keyframes coinPop{0%{transform:scale(1)}50%{transform:scale(1.25)}100%{transform:scale(1)}}
        @keyframes glow{0%,100%{box-shadow:0 0 0 0 ${C.coinGold}40}50%{box-shadow:0 0 20px 4px ${C.coinGold}30}}
        .fu{animation:fu .5s ease-out both}
        .card{background:${C.bgCard};border:1px solid ${C.border};border-radius:14px;transition:all .3s cubic-bezier(.23,1,.32,1)}
        .card:hover{transform:translateY(-4px);box-shadow:0 12px 36px rgba(27,27,47,.06);border-color:${C.accent}20}
        .bm{background:${C.accent};color:#fff;border:none;padding:13px 30px;border-radius:50px;font-weight:700;font-size:14px;cursor:pointer;transition:all .3s;font-family:inherit}
        .bm:hover{background:${C.accentHover};transform:translateY(-1px);box-shadow:0 6px 20px ${C.accent}25}
        .bo{background:transparent;color:${C.ink};border:1.5px solid ${C.border};padding:12px 26px;border-radius:50px;font-weight:600;font-size:14px;cursor:pointer;transition:all .3s;font-family:inherit}
        .bo:hover{border-color:${C.accent};color:${C.accent}}
        .chip{padding:8px 16px;border-radius:40px;border:1.5px solid ${C.border};background:${C.bgCard};cursor:pointer;transition:all .25s;font-size:13px;font-weight:500;color:${C.inkSoft};white-space:nowrap;font-family:inherit}
        .chip:hover,.chip.on{border-color:${C.accent};background:${C.accentSoft};color:${C.accent}}
        .jp{font-family:'Noto Serif JP',serif}
        .g2{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
        .g3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        .g4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
        @media(max-width:900px){.g2,.g3{grid-template-columns:1fr!important}.g4{grid-template-columns:1fr 1fr!important}.sidebar-d{display:none!important}.mob-header{display:flex!important}.main-content{margin-left:0!important}.hf{flex-direction:column!important;text-align:center!important}.hf>div:first-child{align-items:center!important}.ht{font-size:32px!important}.hid-m{display:none!important}}
      `}</style>

      <ToastContainer toasts={toasts} />
      {connectingsensei && <ConnectingOverlay sensei={connectingsensei} onConnected={onConnected} onCancel={() => setConnectingsensei(null)} />}

      {/* ══ SIDEBAR ══ */}
      <aside className="sidebar-d" style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: 240, background: C.sidebar, color: "#fff", zIndex: 100, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <div style={{ padding: "20px 20px 16px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", borderBottom: "1px solid #2A2A42" }} onClick={() => nav("home")}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: C.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 900, fontFamily: "'Noto Serif JP',serif" }}>先</div>
          <div><div style={{ fontSize: 16, fontWeight: 700 }}>sensei<span style={{ color: C.coinGold }}>online</span></div><div style={{ fontSize: 10, color: "#888", letterSpacing: 1 }}>senseionline.pl</div></div>
        </div>
        {userRole === "student" ? (
          <div style={{ padding: "14px 20px", background: "#22223A", margin: "12px 12px 4px", borderRadius: 10, cursor: "pointer", animation: "glow 3s ease-in-out infinite" }} onClick={() => nav("dashboard")}>
            <div style={{ fontSize: 10, color: "#888", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Twoje SenseiCoiny</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: C.coinGold, fontFamily: "'DM Mono',monospace", transition: "all .3s" }}>{studentCoins}</span>
              <span className="jp" style={{ fontSize: 14, color: C.coinGold }}>先</span>
              <span style={{ fontSize: 11, color: "#777", marginLeft: "auto" }}>= {studentCoins} min</span>
            </div>
          </div>
        ) : (
          <div style={{ padding: "14px 20px", background: "#22223A", margin: "12px 12px 4px", borderRadius: 10, cursor: "pointer" }} onClick={() => nav("sensei-dashboard")}>
            <div style={{ fontSize: 10, color: "#888", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Zarobki (kwiecień)</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: C.green, fontFamily: "'DM Mono',monospace" }}>1 240</span>
              <span style={{ fontSize: 14, color: C.green }}>PLN</span>
            </div>
          </div>
        )}
        <nav style={{ flex: 1, padding: "8px 0" }}>
          {MENU.map((item, i) => {
            if (item.section) return <div key={i} style={{ padding: "16px 20px 6px", fontSize: 10, fontWeight: 600, color: "#666", letterSpacing: 1.5, textTransform: "uppercase" }}>{item.section}</div>;
            const active = page === item.p;
            const isInvestor = item.p === "investor";
            return (
              <div key={i} onClick={() => nav(item.p)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", margin: "1px 8px", borderRadius: 8, cursor: "pointer", transition: "all .2s", background: active ? C.accent : isInvestor && !active ? C.accentSoft + "20" : "transparent", color: active ? "#fff" : isInvestor ? C.coinGold : "#bbb", fontWeight: active ? 600 : 400, fontSize: 14 }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = C.sidebarHover; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = isInvestor ? C.accentSoft + "20" : "transparent"; }}>
                <span style={{ fontSize: item.isJp ? 14 : 16, fontFamily: item.isJp ? "'Noto Serif JP',serif" : "inherit", width: 22, textAlign: "center" }}>{item.icon}</span>
                <span>{item.label}</span>
                {isInvestor && !active && <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 700, background: C.coinGold, color: "#1B1B2F", padding: "1px 6px", borderRadius: 8, letterSpacing: .5 }}>NEW</span>}
              </div>
            );
          })}
        </nav>
        <div style={{ padding: "12px 20px", borderTop: "1px solid #2A2A42" }}>
          <button onClick={() => nav("pricing")} style={{ width: "100%", padding: "10px 0", borderRadius: 8, background: `linear-gradient(135deg, ${C.coinGold}, #E8A800)`, border: "none", color: "#1B1B2F", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
            Doładuj SenseiCoiny
          </button>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button onClick={() => nav("login")} style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "1px solid #444", background: "transparent", color: "#aaa", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Zaloguj</button>
            <button onClick={() => nav("register")} style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "none", background: C.accent, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Dołącz</button>
          </div>
        </div>
      </aside>

      {/* ══ MOBILE HEADER ══ */}
      <div className="mob-header" style={{ display: "none", position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: `${C.sidebar}F5`, backdropFilter: "blur(12px)", padding: "0 16px", height: 56, alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: C.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 900, fontFamily: "'Noto Serif JP',serif" }}>先</div>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>sensei<span style={{ color: C.coinGold }}>online</span></span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div onClick={() => nav("dashboard")} style={{ display: "flex", alignItems: "center", gap: 4, background: "#22223A", padding: "5px 10px", borderRadius: 20, cursor: "pointer" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.coinGold, fontFamily: "'DM Mono',monospace" }}>{studentCoins}</span>
            <span className="jp" style={{ fontSize: 11, color: C.coinGold }}>先</span>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer" }}>{sidebarOpen ? "✕" : "☰"}</button>
        </div>
      </div>
      {sidebarOpen && (
        <div style={{ position: "fixed", top: 56, left: 0, right: 0, bottom: 0, background: C.sidebar, zIndex: 99, padding: 16, overflowY: "auto" }}>
          {MENU.map((item, i) => {
            if (item.section) return <div key={i} style={{ padding: "14px 8px 4px", fontSize: 10, fontWeight: 600, color: "#666", letterSpacing: 1.5, textTransform: "uppercase" }}>{item.section}</div>;
            return <div key={i} onClick={() => nav(item.p)} style={{ padding: "12px 12px", borderRadius: 8, cursor: "pointer", color: page === item.p ? C.coinGold : "#ccc", fontWeight: page === item.p ? 600 : 400, fontSize: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{item.icon}</span>{item.label}
            </div>;
          })}
        </div>
      )}

      {/* ══ MAIN CONTENT ══ */}
      <main className="main-content" style={{ marginLeft: 240, minHeight: "100vh" }}>

        {/* ─── HOME ─── */}
        {page === "home" && (
          <div className="fu">
            <section style={{ padding: "60px 40px 48px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -60, right: -40, width: 300, height: 300, borderRadius: "50%", background: `${C.coinGold}08` }} />
              <div className="hf" style={{ maxWidth: 1000, margin: "0 auto", display: "flex", alignItems: "center", gap: 48 }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 30, fontSize: 12, fontWeight: 600, background: C.coinBg, color: C.gold, border: `1px solid ${C.coinGold}30`, marginBottom: 18 }}>
                    <span className="jp" style={{ fontSize: 14 }}>先</span> 1 SenseiCoin = 1 minuta nauki
                  </span>
                  <h1 className="ht" style={{ fontSize: 48, fontWeight: 900, lineHeight: 1.1, letterSpacing: -2, marginBottom: 16, color: C.ink }}>
                    Kup minuty.<br />Wybierz <span className="jp" style={{ color: C.accent }}>sensei</span>.<br />
                    <span style={{ color: C.inkSoft, fontWeight: 600, fontSize: ".7em" }}>Ucz się na swoich zasadach.</span>
                  </h1>
                  <p style={{ fontSize: 16, color: C.inkSoft, lineHeight: 1.75, maxWidth: 440, marginBottom: 28 }}>
                    Kup pakiet <strong style={{ color: C.gold }}>SenseiCoinów</strong>, połącz się z nauczycielem i płać za minuty. Bez abonamentów.
                  </p>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button className="bm" onClick={() => nav("senseis")}>Znajdź Senseia →</button>
                    <button className="bo" onClick={() => nav("investor")}>Dla inwestorów 📈</button>
                  </div>
                  <div style={{ display: "flex", gap: 32, marginTop: 36, borderTop: `1px solid ${C.border}`, paddingTop: 20, flexWrap: "wrap" }}>
                    {[["1 200+", "Nauczycieli"], ["50 000+", "Lekcji"], ["4.9 ★", "Ocena"]].map(([v, l], i) => (
                      <div key={i}><div style={{ fontSize: 22, fontWeight: 800, color: C.ink }}>{v}</div><div style={{ fontSize: 11, color: C.inkMuted, marginTop: 2 }}>{l}</div></div>
                    ))}
                  </div>
                </div>
                <div className="hid-m" style={{ flex: "0 0 340px" }}>
                  <div className="card" style={{ padding: 28, borderRadius: 18 }}>
                    <div style={{ textAlign: "center", marginBottom: 16 }}>
                      <div className="jp" style={{ fontSize: 40, color: C.coinGold }}>先</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: C.inkMuted, letterSpacing: 1, marginTop: 4, textTransform: "uppercase" }}>SenseiCoin</div>
                    </div>
                    <div style={{ background: C.coinBg, borderRadius: 12, padding: 20, textAlign: "center", border: `1.5px solid ${C.coinGold}25`, marginBottom: 16 }}>
                      <div style={{ fontSize: 11, color: C.inkMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Kurs</div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        <span style={{ fontSize: 28, fontWeight: 800, color: C.gold, fontFamily: "'DM Mono',monospace" }}>1</span>
                        <span className="jp" style={{ fontSize: 20, color: C.coinGold }}>先</span>
                        <span style={{ fontSize: 18, color: C.inkMuted }}>=</span>
                        <span style={{ fontSize: 28, fontWeight: 800, color: C.ink, fontFamily: "'DM Mono',monospace" }}>1</span>
                        <span style={{ fontSize: 14, color: C.inkSoft }}>min</span>
                      </div>
                    </div>
                    {PACKAGES.map((p, i) => (
                      <div key={i} onClick={() => nav("pricing")} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: 10, marginBottom: 6, cursor: "pointer", background: p.popular ? C.accentSoft : C.bgAlt, border: `1px solid ${p.popular ? C.accent + "25" : C.borderLight}`, transition: "all .2s" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span>{p.icon}</span>
                          <div><div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{p.coins} <span className="jp" style={{ fontSize: 11, color: C.coinGold }}>先</span></div><div style={{ fontSize: 11, color: C.inkMuted }}>{p.label}</div></div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, fontFamily: "'DM Mono',monospace" }}>{p.price} PLN</div>
                          {p.save > 0 && <div style={{ fontSize: 10, color: C.accent, fontWeight: 600 }}>-{p.save}%</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section style={{ padding: "48px 40px", background: C.bgAlt, borderTop: `1px solid ${C.borderLight}`, borderBottom: `1px solid ${C.borderLight}` }}>
              <div style={{ maxWidth: 1000, margin: "0 auto" }}>
                <SectionTitle tag="Jak to działa" tagColor={C.teal} tagBg={C.tealSoft} title="Trzy kroki do" accent="nauki" />
                <div className="g3">
                  {[["🪙", "Kup SenseiCoiny", "Wybierz pakiet 15–90 coinów. Im więcej, tym taniej za minutę."], ["🔍", "Znajdź Senseia", "Porównaj nauczycieli, ich oceny i stawki."], ["🎥", "Ucz się i płać coinami", "Minuty lekcji = coiny z portfela. Proste."]].map(([ic, t, d], i) => (
                    <div key={i} className="card" style={{ padding: 24, cursor: "pointer" }} onClick={() => nav("how")}>
                      <div style={{ fontSize: 32, marginBottom: 10 }}>{ic}</div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, color: C.ink }}>{t}</h3>
                      <p style={{ fontSize: 13, color: C.inkSoft, lineHeight: 1.6 }}>{d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section style={{ padding: "48px 40px", maxWidth: 1000, margin: "0 auto" }}>
              <SectionTitle tag="sensei Online" tagColor={C.gold} tagBg={C.goldSoft} title="Dostępni" accent="teraz" sub="Kliknij 'Połącz teraz' aby zobaczyć pełne demo sesji z odliczaniem coinów." />
              <div className="g3">
                {senseiS.filter(t => t.online).slice(0, 3).map((t, i) => <TCard key={i} t={t} onConnect={handleConnect} />)}
              </div>
            </section>

            <section style={{ padding: "48px 40px", background: C.bgAlt, borderTop: `1px solid ${C.borderLight}` }}>
              <div style={{ maxWidth: 1000, margin: "0 auto" }}>
                <SectionTitle tag="Opinie" tagColor={C.accent} tagBg={C.accentSoft} title="Co mówią" accent="uczniowie" />
                <div className="g3">
                  {REVIEWS.map((r, i) => (
                    <div key={i} className="card" style={{ padding: 22 }}>
                      <Stars n={r.rating} />
                      <p style={{ fontSize: 14, color: C.inkSoft, lineHeight: 1.7, margin: "10px 0 14px", fontStyle: "italic" }}>"{r.text}"</p>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{r.name} <span style={{ fontWeight: 400, color: C.inkMuted }}>· {r.role}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section style={{ padding: "56px 40px", textAlign: "center" }}>
              <div className="jp" style={{ fontSize: 40, color: C.coinGold, opacity: .15 }}>道</div>
              <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, color: C.ink }}>Gotowy na pierwszą lekcję?</h2>
              <p style={{ color: C.inkSoft, fontSize: 15, marginTop: 8, maxWidth: 440, margin: "8px auto 0" }}>
                Zarejestruj się i odbierz <strong style={{ color: C.gold }}>5 darmowych SenseiCoinów</strong> na start.
              </p>
              <button className="bm" style={{ marginTop: 20, fontSize: 15, padding: "14px 36px" }} onClick={() => nav("register")}>Odbierz 5 darmowych 先 →</button>
            </section>
          </div>
        )}

        {/* ─── INVESTOR PAGE ─── */}
        {page === "investor" && <InvestorPage nav={nav} />}

        {/* ─── LIVE SESSION ─── */}
        {page === "session" && activesensei && (
          <div className="fu" style={{ minHeight: "100vh", background: "#0D0D1A", display: "flex", flexDirection: "column" }}>
            <div style={{ position: "fixed", top: 16, left: 260, background: C.coinGold, color: "#1B1B2F", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, zIndex: 200 }}>
              ⚡ DEMO — 10× prędkość
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 28px", background: "#12122A", borderBottom: "1px solid #2A2A42" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: `linear-gradient(135deg,${C.accentSoft},${C.goldSoft})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: C.accent }}>{activesensei.ini}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{activesensei.name}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>{activesensei.subject}</div>
                </div>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, marginLeft: 4, animation: "pulse 1.5s infinite" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ fontSize: 10, color: "#888", letterSpacing: 1.5, textTransform: "uppercase" }}>Saldo</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#22223A", padding: "8px 18px", borderRadius: 12, animation: sessionSeconds % 6 === 0 && sessionSeconds > 0 ? "coinPop .3s ease" : "none" }}>
                  <span style={{ fontSize: 28, fontWeight: 900, color: studentCoins > 5 ? C.coinGold : C.accent, fontFamily: "'DM Mono',monospace", transition: "color .3s" }}>{studentCoins}</span>
                  <span className="jp" style={{ fontSize: 18, color: C.coinGold }}>先</span>
                </div>
                <div style={{ fontSize: 11, color: C.inkMuted }}>{activesensei.coinsPerMin} 先/min · ≈{studentCoins} min</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ fontSize: 10, color: "#888", letterSpacing: 1.5, textTransform: "uppercase" }}>Czas sesji</div>
                <div style={{ fontSize: 28, fontWeight: 900, fontFamily: "'DM Mono',monospace", color: "#fff" }}>{formatTime(sessionSeconds)}</div>
                <div style={{ fontSize: 11, color: C.accent, fontWeight: 600 }}>Wydano: {sessionCoinsSpent} 先</div>
              </div>
            </div>
            <div style={{ flex: 1, display: "flex" }}>
              <div style={{ flex: 1, background: "#0A0A18", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: 120, height: 120, borderRadius: "50%", background: `linear-gradient(135deg,${C.accentSoft},${C.goldSoft})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, fontWeight: 800, color: C.accent, margin: "0 auto 16px", border: `3px solid ${C.accent}40` }}>{activesensei.ini}</div>
                  <div style={{ color: "#fff", fontSize: 18, fontWeight: 600 }}>{activesensei.name}</div>
                  <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>{activesensei.subject}</div>
                  <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 6 }}>
                    {[0.8, 1.0, 1.2].map((d, i) => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, animation: `pulse ${d}s infinite` }} />)}
                  </div>
                </div>
                <div style={{ position: "absolute", bottom: 20, right: 20, width: 140, height: 100, background: "#22223A", borderRadius: 10, border: "2px solid #3A3A5A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ textAlign: "center" }}><div style={{ fontSize: 28 }}>👤</div><div style={{ fontSize: 10, color: "#888" }}>Ty</div></div>
                </div>
                {sessionSeconds % 6 === 0 && sessionSeconds > 0 && (
                  <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 22, color: C.coinGold, fontWeight: 900, fontFamily: "'DM Mono',monospace", animation: "fu .5s ease-out both", pointerEvents: "none", background: "rgba(0,0,0,.6)", padding: "6px 14px", borderRadius: 20 }}>
                    −{activesensei.coinsPerMin} 先
                  </div>
                )}
              </div>
              <div style={{ width: 320, background: "#F8F8F5", display: "flex", flexDirection: "column", borderLeft: "1px solid #2A2A42" }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #E5E2DA", fontSize: 12, fontWeight: 600, color: C.inkSoft, background: "#fff" }}>📋 Tablica interaktywna</div>
                <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ background: "#fff", borderRadius: 8, padding: 12, border: `1px solid ${C.border}` }}>
                    <div style={{ fontWeight: 600, color: C.ink, marginBottom: 6, fontSize: 12 }}>Zadanie 1:</div>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: C.ink }}>2x² + 5x − 3 = 0</div>
                    <div style={{ marginTop: 8, fontSize: 11, color: C.inkMuted }}>Metoda: wyróżnik Δ = b² − 4ac</div>
                  </div>
                  <div style={{ background: C.coinBg, borderRadius: 8, padding: 12, border: `1px solid ${C.coinGold}20`, fontSize: 11, color: C.inkSoft }}>
                    <div style={{ fontWeight: 600, color: C.gold, marginBottom: 4 }}>Notatka:</div>
                    <div>Δ = 25 + 24 = 49 → √49 = 7</div>
                    <div style={{ marginTop: 4, fontFamily: "'DM Mono',monospace", color: C.ink }}>x₁ = 0.5, x₂ = −3</div>
                  </div>
                  <div style={{ flex: 1 }} />
                  <div style={{ fontSize: 10, color: C.inkMuted, textAlign: "center" }}>Chat · Pliki · Rysowanie</div>
                </div>
              </div>
            </div>
            <div style={{ padding: "16px 28px", background: "#12122A", borderTop: "1px solid #2A2A42", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 10 }}>
                {[["🎤", "Mikrofon"], ["📷", "Kamera"], ["🖥️", "Ekran"]].map(([ic, l], i) => (
                  <button key={i} style={{ padding: "10px 16px", borderRadius: 10, border: "1px solid #3A3A5A", background: "#22223A", color: "#ccc", fontSize: 12, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
                    <span>{ic}</span><span>{l}</span>
                  </button>
                ))}
              </div>
              <div style={{ flex: 1, margin: "0 24px" }}>
                <div style={{ fontSize: 10, color: "#888", textAlign: "center", marginBottom: 4 }}>Saldo coinów</div>
                <div style={{ background: "#22223A", borderRadius: 8, height: 8, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.min((studentCoins / 42) * 100, 100)}%`, background: studentCoins > 10 ? `linear-gradient(90deg,${C.coinGold},#E8A800)` : `linear-gradient(90deg,${C.accent},#FF4444)`, borderRadius: 8, transition: "width .5s" }} />
                </div>
                {studentCoins <= 5 && <div style={{ fontSize: 10, color: C.accent, textAlign: "center", marginTop: 4, fontWeight: 600 }}>⚠ Kończy się saldo!</div>}
              </div>
              <button onClick={endSession} style={{ padding: "12px 24px", borderRadius: 50, border: "none", background: C.accent, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Zakończ lekcję</button>
            </div>
          </div>
        )}

        {/* ─── SESSION END ─── */}
        {page === "session-end" && activesensei && (
          <section className="fu" style={{ padding: "60px 40px", maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontSize: 32, fontWeight: 900, color: C.ink, marginBottom: 8 }}>Lekcja zakończona!</h2>
            <p style={{ color: C.inkSoft, marginBottom: 32 }}>Świetna robota! Oto podsumowanie sesji.</p>
            <div className="card" style={{ padding: 28, marginBottom: 24, textAlign: "left" }}>
              {[
                ["Nauczyciel", activesensei.name, C.ink],
                ["Czas sesji", formatTime(sessionSeconds), C.ink],
                ["Wydane coiny", `-${sessionCoinsSpent} 先`, C.accent],
                ["Pozostałe saldo", `${studentCoins} 先`, C.gold],
              ].map(([l, v, c], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
                  <span style={{ color: C.inkSoft, fontSize: 14 }}>{l}</span>
                  <span style={{ fontWeight: 700, color: c, fontFamily: "'DM Mono',monospace" }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Interactive star rating */}
            <div className="card" style={{ padding: 24, marginBottom: 24, background: C.coinBg, borderColor: `${C.coinGold}25` }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 14 }}>Oceń sesję z {activesensei.name}:</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 10 }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <span key={n} onMouseEnter={() => setHoveredStar(n)} onMouseLeave={() => setHoveredStar(0)} onClick={() => { setSessionRating(n); addToast(`Oceniłeś ${activesensei.name} na ${n} gwiazdek!`, "success", "⭐"); }}
                    style={{ fontSize: 36, cursor: "pointer", color: n <= (hoveredStar || sessionRating) ? C.coinGold : "#ddd", transition: "all .15s", transform: n <= (hoveredStar || sessionRating) ? "scale(1.2)" : "scale(1)", display: "inline-block" }}>★</span>
                ))}
              </div>
              {sessionRating > 0 && (
                <div style={{ fontSize: 13, color: C.green, fontWeight: 600 }}>
                  {["", "Słaba lekcja 😕", "Mogło być lepiej", "W porządku 👍", "Bardzo dobra!", "Perfekcyjna! ⭐"][sessionRating]}
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button className="bm" onClick={() => nav("senseis")}>Ucz się ponownie →</button>
              <button className="bo" onClick={() => nav("pricing")}>Doładuj 先</button>
            </div>
          </section>
        )}

        {/* ─── HOW IT WORKS ─── */}
        {page === "how" && (
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <SectionTitle tag="Jak to działa" tagColor={C.teal} tagBg={C.tealSoft} title="Droga ucznia" accent="道" />
            <div style={{ maxWidth: 640 }}>
              {[["🪙","Kup pakiet SenseiCoinów","1 coin = 1 minuta. Im większy pakiet, tym niższy koszt za minutę. Płatność przez Stripe, BLIK, Przelewy24."],["🔍","Wybierz Senseia","Przeglądaj profile, oceny, stawki. Każdy Sensei zweryfikowany."],["📅","Połącz się natychmiast","'Połącz teraz' — znajdziemy wolnego Senseia w 30 sekund."],["🎥","Ucz się w przeglądarce","Wideo HD, tablica, czat. Nic nie instalujesz. Minuty = coiny."],["⭐","Oceń i wróć","Historia, wydane coiny, postępy — wszystko w portfelu."]].map(([ic,t,d],i) => (
                <div key={i} style={{ display: "flex", gap: 18, marginBottom: 28 }}>
                  <div style={{ 
  flex: "0 0 52px", height: 52, borderRadius: 14, 
  background: C.bgCard,
  display: "flex", alignItems: "center", justifyContent: "center", 
  fontSize: 26, 
  border: `1.5px solid ${C.border}`,
  boxShadow: "0 2px 8px rgba(27,27,47,.06)",
  flexShrink: 0
}}>{ic}</div>
                  <div><h3 style={{ fontSize: 17, fontWeight: 700, color: C.ink, marginBottom: 4 }}>{t}</h3><p style={{ fontSize: 14, color: C.inkSoft, lineHeight: 1.7 }}>{d}</p></div>
                </div>
              ))}
            </div>
            <button className="bm" onClick={() => nav("senseis")}>Znajdź Senseia →</button>
          </section>
        )}

        {/* ─── SUBJECTS ─── */}
        {page === "subjects" && (
          <section className="fu" style={{ padding: "48px 40px", maxWidth: 1000, margin: "0 auto" }}>
            <SectionTitle tag="Przedmioty" tagColor={C.gold} tagBg={C.goldSoft} title="Znajdź" accent="sensei" sub="Stawki w coinach za minutę lekcji." />
            <div className="g2">
              {SUBJECTS.map((s, i) => (
                <div key={i} className="card" style={{ padding: 22, cursor: "pointer" }} onClick={() => { setSf(s.name); nav("senseis"); }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div><div style={{ fontSize: 32, marginBottom: 6 }}>{s.icon}</div><h3 style={{ fontSize: 18, fontWeight: 700, color: C.ink }}>{s.name}</h3><div style={{ fontSize: 12, color: C.inkMuted }}>{s.senseis} nauczycieli</div></div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: C.coinBg, border: `1.5px solid ${C.coinGold}40`, borderRadius: 30, padding: "3px 10px", fontWeight: 700, color: C.gold, fontFamily: "'DM Mono',monospace", fontSize: 13 }}>
                        <span>先</span>{s.coins}
                      </span>
                      <div style={{ fontSize: 11, color: C.inkMuted, marginTop: 4 }}>coinów/min</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 10, fontSize: 13, color: C.accent, fontWeight: 600 }}>Zobacz →</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── senseiS ─── */}
        {page === "senseis" && (
          <section className="fu" style={{ padding: "48px 40px", maxWidth: 1000, margin: "0 auto" }}>
            <SectionTitle tag="sensei Sensei" tagColor={C.gold} tagBg={C.goldSoft} title="Nasi" accent="nauczyciele" sub="Zielona kropka = dostępny teraz. Kliknij 'Połącz teraz'." />
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.bgCard, border: `1.5px solid ${C.border}`, borderRadius: 50, padding: "9px 18px", width: "100%", maxWidth: 400 }}>
                <span style={{ color: C.inkMuted }}>🔍</span>
                <input type="text" placeholder="Szukaj nauczyciela..." value={sq} onChange={e => setSq(e.target.value)} style={{ border: "none", outline: "none", background: "transparent", fontSize: 14, width: "100%", fontFamily: "inherit", color: C.ink }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginBottom: 24 }}>
              <button className={`chip ${!sf ? "on" : ""}`} onClick={() => setSf(null)}>Wszystkie</button>
              {SUBJECTS.map(s => <button key={s.name} className={`chip ${sf === s.name ? "on" : ""}`} onClick={() => setSf(sf === s.name ? null : s.name)}>{s.icon} {s.name}</button>)}
            </div>
            <div className="g3">{ft.map((t, i) => <TCard key={i} t={t} onConnect={handleConnect} />)}</div>
            {ft.length === 0 && <div style={{ textAlign: "center", padding: 40, color: C.inkMuted }}>Brak wyników.</div>}
          </section>
        )}

        {/* ─── PRICING ─── */}
        {page === "pricing" && (
          <section className="fu" style={{ padding: "48px 40px", maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div className="jp" style={{ fontSize: 48, color: C.coinGold, opacity: .3 }}>先</div>
              <span style={{ display: "inline-block", padding: "5px 14px", borderRadius: 30, fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", background: C.coinBg, color: C.gold, border: `1px solid ${C.coinGold}30` }}>SenseiCoin</span>
              <h1 style={{ fontSize: 38, fontWeight: 900, marginTop: 12, letterSpacing: -1, color: C.ink }}>Kup minuty nauki</h1>
              <p style={{ color: C.inkSoft, marginTop: 8, fontSize: 15 }}>1 SenseiCoin = 1 minuta. Im więcej, tym taniej.</p>
            </div>
            <div className="g4" style={{ marginBottom: 40 }}>
              {PACKAGES.map((p, i) => (
                <div key={i} className="card" style={{ padding: 26, textAlign: "center", position: "relative", border: p.popular ? `2px solid ${C.accent}` : undefined }}>
                  {p.popular && <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", background: C.accent, color: "#fff", padding: "3px 12px", borderRadius: 20, fontSize: 10, fontWeight: 700 }}>BESTSELLER</div>}
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{p.icon}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: C.ink, marginBottom: 4 }}>{p.label}</h3>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, margin: "10px 0" }}>
                    <span style={{ fontSize: 36, fontWeight: 900, color: C.gold, fontFamily: "'DM Mono',monospace" }}>{p.coins}</span>
                    <span className="jp" style={{ fontSize: 20, color: C.coinGold }}>先</span>
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: C.ink, fontFamily: "'DM Mono',monospace" }}>{p.price} <span style={{ fontSize: 13, fontWeight: 500, color: C.inkMuted }}>PLN</span></div>
                  {p.save > 0 && <div style={{ fontSize: 12, color: C.accent, fontWeight: 600, marginTop: 4 }}>Oszczędzasz {p.save}%</div>}
                  <div style={{ fontSize: 12, color: C.inkMuted, marginTop: 4 }}>{p.perMin.toFixed(2)} PLN / min</div>
                  <p style={{ fontSize: 12, color: C.inkSoft, lineHeight: 1.5, marginTop: 10 }}>{p.desc}</p>
                  <button className="bm" onClick={() => buyCoins(p)} style={{ width: "100%", marginTop: 14, padding: "10px 0", fontSize: 13 }}>Kup {p.coins} 先</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── COMPETITORS ─── */}
        {page === "competitors" && (
          <section className="fu" style={{ padding: "48px 40px", maxWidth: 1100, margin: "0 auto" }}>
            <SectionTitle tag="Analiza rynku" tagColor={C.teal} tagBg={C.tealSoft} title="Matryca" accent="konkurentów" sub="Porównanie platform korepetycji na polskim rynku." />
            <div style={{ overflowX: "auto", marginBottom: 32 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 700 }}>
                <thead><tr style={{ background: C.sidebar, color: "#fff" }}>
                  {["Platforma","Model","Prowizja","Min. lekcja","Instant","Panel rodzica","Trial","Video","Cennik"].map((h,i) => (
                    <th key={i} style={{ padding: "12px 10px", textAlign: "left", fontWeight: 600, fontSize: 12, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {COMPETITORS.map((c, i) => (
                    <tr key={i} style={{ background: c.highlight ? C.coinBg : i % 2 === 0 ? C.bgCard : C.bgAlt, borderBottom: `1px solid ${C.border}` }}>
                      <td style={{ padding: "10px", fontWeight: c.highlight ? 700 : 500, color: c.highlight ? C.accent : C.ink }}>{c.highlight && <span className="jp" style={{ marginRight: 4, color: C.coinGold }}>先</span>}{c.name}</td>
                      <td style={{ padding: "10px", color: C.inkSoft, fontSize: 12 }}>{c.model}</td>
                      <td style={{ padding: "10px", color: C.inkSoft }}>{c.commission}</td>
                      <td style={{ padding: "10px", color: C.inkSoft }}>{c.minLesson}</td>
                      {["instantConnect","parentPanel","freeTrial","videoBuiltIn"].map(k => (
                        <td key={k} style={{ padding: "10px" }}><span style={{ color: c[k] ? C.green : C.inkMuted, fontWeight: 700 }}>{c[k] ? "✓" : "✗"}</span></td>
                      ))}
                      <td style={{ padding: "10px", color: c.highlight ? C.accent : C.inkSoft, fontWeight: c.highlight ? 600 : 400, fontFamily: "'DM Mono',monospace", fontSize: 12 }}>{c.pricing}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <button className="bm" onClick={() => nav("investor")}>Zobacz pełną analizę inwestorską →</button>
            </div>
          </section>
        )}

        {/* ─── STUDENT DASHBOARD ─── */}
        {page === "dashboard" && (
          <section className="fu" style={{ padding: "48px 40px", maxWidth: 1000, margin: "0 auto" }}>
            {/* STREAK CARD */}
<div className="card" style={{ 
  padding: 24, marginBottom: 24,
  background: `linear-gradient(135deg, #1B1B2F, #2D1B4E)`,
  border: `1px solid ${C.coinGold}30`, position: "relative", overflow: "hidden"
}}>
  {/* Декоративный фон */}
  <div style={{ position: "absolute", top: -20, right: -20, fontSize: 80, opacity: .06 }}>🔥</div>
  
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
    <div>
      <div style={{ fontSize: 11, color: "#888", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>
        Twoja seria nauki
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 40 }}>🔥</span>
        <div>
          <span style={{ fontSize: 42, fontWeight: 900, color: C.coinGold, fontFamily: "'DM Mono',monospace" }}>{streak}</span>
          <span style={{ fontSize: 16, color: "#888", marginLeft: 6 }}>dni z rzędu</span>
        </div>
      </div>
      {/* Прогресс до следующей награды */}
      <div style={{ marginTop: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#777", marginBottom: 4 }}>
          <span>Do nagrody: {10 - (streak % 10)} dni</span>
          <span>+10 先 za 10-dniowy streak!</span>
        </div>
        <div style={{ background: "#2A2A42", borderRadius: 6, height: 6, overflow: "hidden" }}>
          <div style={{ 
            height: "100%", 
            width: `${(streak % 10) * 10}%`,
            background: `linear-gradient(90deg, ${C.coinGold}, #FF6B00)`,
            borderRadius: 6, transition: "width .5s"
          }} />
        </div>
      </div>
    </div>
    
    {/* Кнопка получить бонус (если кратно 10) */}
    {streak % 10 === 0 && !streakBonusClaimed ? (
      <button className="bm" style={{ 
        padding: "12px 22px", fontSize: 13,
        background: `linear-gradient(135deg, ${C.coinGold}, #E8A800)`,
        color: "#1B1B2F", flexShrink: 0
      }} onClick={() => {
        setStudentCoins(c => c + 10);
        setStreakBonusClaimed(true);
        addToast("+10 先 za 10-dniowy streak! 🔥", "coin", "先");
      }}>
        Odbierz +10 先 🎁
      </button>
    ) : (
      <div style={{ textAlign: "center" }}>
        {/* Мини-календарь последних 7 дней */}
        <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
          {["Pn","Wt","Śr","Cz","Pt","Sb","Nd"].map((d, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ 
                width: 28, height: 28, borderRadius: "50%",
                background: i < (streak % 7 || 7) ? `linear-gradient(135deg, ${C.coinGold}, #E8A800)` : "#2A2A42",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12
              }}>
                {i < (streak % 7 || 7) ? "✓" : ""}
              </div>
              <div style={{ fontSize: 9, color: "#666", marginTop: 2 }}>{d}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#666" }}>Ucz się jutro, aby nie stracić serii!</div>
      </div>
    )}
  </div>
</div>
            <SectionTitle tag="🎒 Portfel" tagColor={C.gold} tagBg={C.goldSoft} title="Twój portfel" />
            <div className="card" style={{ padding: 28, marginBottom: 24, background: `linear-gradient(135deg,${C.sidebar},#2A2A42)`, border: "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: "#999", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>Saldo SenseiCoinów</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 48, fontWeight: 900, color: C.coinGold, fontFamily: "'DM Mono',monospace" }}>{studentCoins}</span>
                    <span className="jp" style={{ fontSize: 28, color: C.coinGold }}>先</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>= {studentCoins} minut nauki</div>
                </div>
                <button onClick={() => nav("pricing")} style={{ padding: "12px 28px", borderRadius: 50, border: "none", cursor: "pointer", fontFamily: "inherit", background: `linear-gradient(135deg,${C.coinGold},#E8A800)`, color: "#1B1B2F", fontWeight: 700, fontSize: 14 }}>+ Doładuj coiny</button>
              </div>
            </div>
            <div className="g4" style={{ marginBottom: 24 }}>
              {[["📚","Ukończone lekcje","24",C.tealSoft],["⏱️","Czas nauki","18h 32min",C.accentSoft],["💰","Wydane coiny",`${387+sessionCoinsSpent} 先`,C.goldSoft],["⭐","Śr. ocena Senseia","4.9",C.coinBg]].map(([ic,l,v,bg],i) => (
                <div key={i} className="card" style={{ padding: 18, textAlign: "center", background: bg }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{ic}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: C.ink, fontFamily: "'DM Mono',monospace" }}>{v}</div>
                  <div style={{ fontSize: 11, color: C.inkMuted, marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding: 24, marginBottom: 24 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: C.ink, marginBottom: 16 }}>Historia transakcji</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead><tr style={{ borderBottom: `2px solid ${C.border}` }}>
                  {["Data","Typ","Opis","Coiny"].map(h => <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontWeight: 600, color: C.inkSoft, fontSize: 11, letterSpacing: .5, textTransform: "uppercase" }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {[
                    ...(sessionCoinsSpent > 0 ? [["Teraz","Lekcja",`${activesensei?.subject} z ${activesensei?.name} (${sessionCoinsSpent} min)`,`-${sessionCoinsSpent}`,C.accent]] : []),
                    ["15.04.2026","Doładowanie","Pakiet Standard (30 先)","+30",C.green],
                    ["14.04.2026","Lekcja","Matematyka z Anną K. (23 min)","-23",C.accent],
                    ["12.04.2026","Lekcja","Angielski z Martą W. (15 min)","-15",C.accent],
                    ["10.04.2026","Bonus","Bonus za rejestrację","+5",C.green],
                  ].map(([date,type,desc,coins,color],i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${C.borderLight}` }}>
                      <td style={{ padding: "10px", color: C.inkMuted, fontFamily: "'DM Mono',monospace", fontSize: 12 }}>{date}</td>
                      <td style={{ padding: "10px" }}><span style={{ padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 600, background: type==="Doładowanie" ? `${C.green}15` : type==="Bonus" ? C.coinBg : C.accentSoft, color: type==="Doładowanie" ? C.green : type==="Bonus" ? C.gold : C.accent }}>{type}</span></td>
                      <td style={{ padding: "10px", color: C.inkSoft }}>{desc}</td>
                      <td style={{ padding: "10px", fontWeight: 700, fontFamily: "'DM Mono',monospace", color }}>{coins} 先</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="g3">
              <div className="card" style={{ padding: 20, textAlign: "center", cursor: "pointer" }} onClick={() => nav("senseis")}><div style={{ fontSize: 28, marginBottom: 6 }}>🔍</div><div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>Znajdź Senseia</div></div>
              <div className="card" style={{ padding: 20, textAlign: "center", cursor: "pointer" }} onClick={() => nav("pricing")}><div style={{ fontSize: 28, marginBottom: 6 }}>🪙</div><div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>Kup SenseiCoiny</div></div>
              <div className="card" style={{ padding: 20, textAlign: "center", cursor: "pointer", background: C.accentSoft }} onClick={() => { setUserRole("sensei"); nav("sensei-dashboard"); }}><div style={{ fontSize: 28, marginBottom: 6 }}>🔄</div><div style={{ fontSize: 14, fontWeight: 600, color: C.accent }}>Widok Nauczyciela</div></div>
            </div>
          </section>
        )}

        {/* ─── PARENT PANEL ─── */}
        {page === "parent" && (
          <section className="fu" style={{ padding: "48px 40px", maxWidth: 1000, margin: "0 auto" }}>
            <SectionTitle tag="👨‍👩‍👧 Dla rodziców" tagColor={C.teal} tagBg={C.tealSoft} title="Panel" accent="rodzica" sub="Pełna kontrola nad edukacją i wydatkami dziecka." />
            <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
              {[["👧","Kasia","Liceum · kl. 3",true],["👦","Tomek","Podstawówka · kl. 7",false]].map(([ic,n,s,active],i) => (
                <div key={i} className="card" style={{ padding: "12px 20px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", border: active ? `2px solid ${C.accent}` : undefined, background: active ? C.accentSoft : undefined, opacity: active ? 1 : .65 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{ic}</div>
                  <div><div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>{n}</div><div style={{ fontSize: 11, color: C.inkMuted }}>{s}</div></div>
                </div>
              ))}
              <button className="bo" style={{ fontSize: 12, padding: "8px 16px" }}>+ Dodaj dziecko</button>
            </div>
            <div className="g4" style={{ marginBottom: 24 }}>
              {[["🪙",`Saldo Kasi`,`${studentCoins} 先`,C.coinBg,C.gold],["📚","Lekcje / miesiąc","7",C.tealSoft,C.teal],["⏱️","Godziny nauki","5h 20min",C.accentSoft,C.accent],["💸","Wydatki kwiecień","49 PLN",C.bgAlt,C.ink]].map(([ic,l,v,bg,c],i) => (
                <div key={i} className="card" style={{ padding: 18, textAlign: "center", background: bg }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{ic}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: c, fontFamily: "'DM Mono',monospace" }}>{v}</div>
                  <div style={{ fontSize: 11, color: C.inkMuted, marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding: 24, marginBottom: 20 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: C.ink, marginBottom: 16 }}>💳 Kontrola budżetu</h3>
              {[
                ["Miesięczny limit coinów","Kasia może wydać max. 60 先/mies.", "60 先", true],
                ["Powiadomienia SMS","Po każdej lekcji", null, true],
                ["Autoryzacja nowych Senseiów","Zatwierdzaj przed lekcją", null, false],
              ].map(([t,s,val,on],i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: i < 2 ? `1px solid ${C.border}` : "none" }}>
                  <div><div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{t}</div><div style={{ fontSize: 12, color: C.inkMuted }}>{s}</div></div>
                  {val ? <span style={{ fontSize: 16, fontWeight: 700, color: C.gold, fontFamily: "'DM Mono',monospace" }}>{val}</span>
                    : <div style={{ width: 44, height: 24, borderRadius: 12, background: on ? C.green : C.bgAlt, border: on ? "none" : `1px solid ${C.border}`, position: "relative", cursor: "pointer" }}>
                        <div style={{ position: "absolute", top: 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left .2s", left: on ? 22 : 2 }} />
                      </div>}
                </div>
              ))}
            </div>
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: C.ink, marginBottom: 16 }}>📋 Aktywność Kasi</h3>
              {[
                { ic: "🎥", t: "Lekcja Matematyki", sub: "Anna Kowalska · dzisiaj 14:00", val: "-23 先", col: C.tealSoft },
                { ic: "⭐", t: "Ocena wystawiona", sub: "Anna Kowalska · dzisiaj 14:25", val: "★★★★★", col: C.coinBg },
                { ic: "🎥", t: "Lekcja Angielskiego", sub: "Marta Wiśniewska · 12.04 16:00", val: "-15 先", col: C.tealSoft },
                { ic: "🪙", t: "Doładowanie coinów", sub: "Pakiet Standard · 10.04", val: "+30 先", col: C.greenSoft },
              ].map((item,i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: i < 3 ? `1px solid ${C.borderLight}` : "none" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: item.col, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{item.ic}</div>
                  <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{item.t}</div><div style={{ fontSize: 12, color: C.inkMuted }}>{item.sub}</div></div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.inkSoft, fontFamily: "'DM Mono',monospace" }}>{item.val}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── sensei DASHBOARD ─── */}
        {page === "sensei-dashboard" && (
          <section className="fu" style={{ padding: "48px 40px", maxWidth: 1000, margin: "0 auto" }}>
            <SectionTitle tag="👨‍🏫 Panel" tagColor={C.accent} tagBg={C.accentSoft} title="Panel" accent="Nauczyciela" />
            <div className="g4" style={{ marginBottom: 24 }}>
              {[["💰","Zarobki (kwiecień)","1 240 PLN",C.greenSoft,C.green],["📅","Lekcje dzisiaj","3",C.tealSoft,C.teal],["⭐","Średnia ocena","4.9",C.coinBg,C.gold],["⏱️","Łączny czas","89h",C.accentSoft,C.accent]].map(([ic,l,v,bg,c],i) => (
                <div key={i} className="card" style={{ padding: 18, textAlign: "center", background: bg }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{ic}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: c, fontFamily: "'DM Mono',monospace" }}>{v}</div>
                  <div style={{ fontSize: 11, color: C.inkMuted, marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding: 24, marginBottom: 20 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: C.ink, marginBottom: 16 }}>Zarobki — kwiecień 2026</h3>
              {[["1–7 kwiecień","18 sesji","312 PLN"],["8–14 kwiecień","22 sesji","398 PLN"],["15 kwiecień–dziś","15 sesji","530 PLN"]].map(([p,s,e],i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i<2 ? `1px solid ${C.borderLight}` : "none" }}>
                  <div><div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{p}</div><div style={{ fontSize: 11, color: C.inkMuted }}>{s}</div></div>
                  <span style={{ fontSize: 16, fontWeight: 800, color: C.green, fontFamily: "'DM Mono',monospace" }}>{e}</span>
                </div>
              ))}
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: `2px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, color: C.ink }}>Razem</span>
                <span style={{ fontSize: 20, fontWeight: 900, color: C.green, fontFamily: "'DM Mono',monospace" }}>1 240 PLN</span>
              </div>
            </div>
            <div className="card" style={{ padding: 24, marginBottom: 16 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: C.ink, marginBottom: 16 }}>📅 Dzisiaj</h3>
              {[["14:00","Matematyka","Kasia M.","45 min",true],["16:30","Fizyka","Olek T.","30 min",false]].map(([t,s,st,d,now],i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderRadius: 10, marginBottom: 8, background: now ? C.greenSoft : C.bgAlt, border: `1px solid ${now ? C.green+"30" : C.borderLight}` }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontWeight: 700, fontSize: 14, color: C.ink }}>{t}</span>
                    <div><div style={{ fontSize: 14, fontWeight: 600 }}>{s}</div><div style={{ fontSize: 12, color: C.inkMuted }}>{st} · {d}</div></div>
                  </div>
                  <button className={now ? "bm" : "bo"} style={{ padding: "7px 16px", fontSize: 12 }}>{now ? "Dołącz →" : "Szczegóły"}</button>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding: 20, textAlign: "center", cursor: "pointer", background: C.accentSoft }} onClick={() => { setUserRole("student"); nav("dashboard"); }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>🔄</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.accent }}>Przełącz na widok ucznia</div>
            </div>
          </section>
        )}

        {/* ─── FOR senseiS ─── */}
        {page === "for-senseis" && (
          <section className="fu" style={{ padding: "48px 40px", maxWidth: 1000, margin: "0 auto" }}>
            <SectionTitle tag="Dla nauczycieli" tagColor={C.gold} tagBg={C.goldSoft} title="Zostań" accent="sensei Senseim" />
            <div className="g2" style={{ alignItems: "start" }}>
              <div>
                {[["80%","przychodów do Ciebie","Najniższa prowizja na polskim rynku."],["0 PLN","za rejestrację","Zacznij zarabiać od pierwszej lekcji."],["48h","wypłata","Stripe Connect. Szybkie przelewy."],["100%","kontroli","Ustalasz stawkę, grafik i zasady."]].map(([v,l,d],i) => (
                  <div key={i} className="card" style={{ padding: 20, marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 24, fontWeight: 900, color: C.accent, fontFamily: "'DM Mono',monospace" }}>{v}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{l}</span>
                    </div>
                    <p style={{ fontSize: 13, color: C.inkMuted }}>{d}</p>
                  </div>
                ))}
              </div>
              <EarningsCalc onJoin={() => { setUserRole("sensei"); nav("sensei-dashboard"); }} />
            </div>
          </section>
        )}

        {/* ─── AUTH ─── */}
        {(page === "login" || page === "register") && (
          <section className="fu" style={{ padding: "48px 40px", display: "flex", justifyContent: "center", minHeight: "70vh", alignItems: "center" }}>
            <div className="card" style={{ padding: 36, width: "100%", maxWidth: 400, borderRadius: 18 }}>
              <div style={{ textAlign: "center", marginBottom: 22 }}>
                <div className="jp" style={{ fontSize: 32, color: C.coinGold }}>門</div>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginTop: 6, color: C.ink }}>{page === "login" ? "Witaj ponownie" : "Dołącz do Sensei"}</h2>
                {page === "register" && <p style={{ fontSize: 13, color: C.inkMuted, marginTop: 4 }}>Odbierz <strong style={{ color: C.gold }}>5 darmowych SenseiCoinów 先</strong>!</p>}
              </div>
              <div style={{ display: "flex", background: C.bgAlt, borderRadius: 10, padding: 3, marginBottom: 18 }}>
                {[["login","Logowanie"],["register","Rejestracja"]].map(([v,l]) => (
                  <button key={v} onClick={() => nav(v)} style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "none", background: page===v ? C.bgCard : "transparent", color: page===v ? C.ink : C.inkMuted, fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>{l}</button>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {page === "register" && <input type="text" placeholder="Imię i nazwisko" style={{ padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.bgCard, fontSize: 14, fontFamily: "inherit", color: C.ink, outline: "none" }} />}
                <input type="email" placeholder="Adres e-mail" style={{ padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.bgCard, fontSize: 14, fontFamily: "inherit", color: C.ink, outline: "none" }} />
                <input type="password" placeholder="Hasło" style={{ padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.bgCard, fontSize: 14, fontFamily: "inherit", color: C.ink, outline: "none" }} />
              </div>
              <button className="bm" style={{ width: "100%", marginTop: 16 }} onClick={() => {
                if (page === "register") { setStudentCoins(c => c + 5); addToast("+5 SenseiCoinów za rejestrację!", "coin", "先"); }
                nav("dashboard");
              }}>{page === "login" ? "Zaloguj się" : "Stwórz konto i odbierz 5 先"}</button>
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
                <button style={{ width: "100%", padding: 10, borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.bgCard, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", color: C.ink }}>G  Kontynuuj z Google</button>
              </div>
            </div>
          </section>
        )}

        {/* ══ FOOTER ══ */}
        {!["session"].includes(page) && (
          <footer style={{ background: C.bgAlt, borderTop: `1px solid ${C.border}`, padding: "40px 40px 20px" }}>
            <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 26, height: 26, borderRadius: 6, background: C.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, fontFamily: "'Noto Serif JP',serif" }}>先</div>
                <span style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>sensei<span style={{ color: C.accent }}>online</span><span style={{ color: C.inkMuted }}>.pl</span></span>
              </div>
              <div style={{ display: "flex", gap: 20 }}>
                <span onClick={() => nav("investor")} style={{ fontSize: 12, color: C.accent, cursor: "pointer", fontWeight: 600 }}>📈 Dla inwestorów</span>
                <span style={{ fontSize: 12, color: C.inkMuted }}>© 2026 · 🇵🇱 Polska · RODO ✓ · Stripe ✓ · BLIK ✓</span>
              </div>
            </div>
          </footer>
        )}

      </main>
    </div>
  );
}