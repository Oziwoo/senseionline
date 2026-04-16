import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════
   SENSEI ONLINE — senseionline.pl  ·  MVP v2 (Investor Demo)
   ═══════════════════════════════════════════════════════ */

const C = {
  bg: "#FAFAF7", bgAlt: "#F3F1EB", bgCard: "#FFFFFF",
  ink: "#1B1B2F", inkSoft: "#4A4A5E", inkMuted: "#8E8EA0",
  accent: "#C8102E", accentSoft: "#C8102E12", accentHover: "#A00D24",
  gold: "#D4A017", goldSoft: "#D4A01714",
  teal: "#0D7377", tealSoft: "#0D737712",
  green: "#16a34a", greenSoft: "#16a34a12",
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
  { icon: "📐", name: "Matematyka", teachers: 142, coins: "8–18" },
  { icon: "🧪", name: "Chemia", teachers: 87, coins: "9–20" },
  { icon: "🔬", name: "Fizyka", teachers: 93, coins: "8–18" },
  { icon: "🇬🇧", name: "Angielski", teachers: 231, coins: "7–22" },
  { icon: "🇩🇪", name: "Niemiecki", teachers: 78, coins: "8–17" },
  { icon: "📖", name: "Polski", teachers: 119, coins: "7–16" },
  { icon: "🧬", name: "Biologia", teachers: 65, coins: "8–18" },
  { icon: "💻", name: "Informatyka", teachers: 54, coins: "10–25" },
  { icon: "🌍", name: "Geografia", teachers: 41, coins: "7–14" },
  { icon: "📜", name: "Historia", teachers: 58, coins: "7–15" },
];

const TEACHERS = [
  { name: "Anna Kowalska", subject: "Matematyka", rating: 4.9, reviews: 312, coinsPerMin: 1, ini: "AK", exp: "8 lat", badge: "先生", sessions: 2841, bio: "Absolwentka UW, przygotowuje do matury z 95% skutecznością.", online: true },
  { name: "Piotr Nowak", subject: "Fizyka", rating: 4.8, reviews: 198, coinsPerMin: 1, ini: "PN", exp: "12 lat", badge: "師匠", sessions: 1920, bio: "Doktor nauk fizycznych, trudne koncepty tłumaczy prosto.", online: true },
  { name: "Marta Wiśniewska", subject: "Angielski", rating: 5.0, reviews: 487, coinsPerMin: 2, ini: "MW", exp: "10 lat", badge: "先生", sessions: 4102, bio: "Cambridge CELTA, 3 lata w Londynie, native-level fluency.", online: false },
  { name: "Tomasz Zieliński", subject: "Chemia", rating: 4.7, reviews: 156, coinsPerMin: 1, ini: "TZ", exp: "6 lat", badge: null, sessions: 1205, bio: "Pasjonat chemii organicznej, każdą reakcję wyjaśni na przykładach.", online: true },
  { name: "Karolina Dąbrowska", subject: "Informatyka", rating: 4.9, reviews: 223, coinsPerMin: 2, ini: "KD", exp: "5 lat", badge: "師匠", sessions: 1678, bio: "Full-stack developer, uczy od podstaw po zaawansowane.", online: false },
  { name: "Michał Lewandowski", subject: "Polski", rating: 4.8, reviews: 189, coinsPerMin: 1, ini: "ML", exp: "15 lat", badge: "先生", sessions: 3540, bio: "Polonista, autor materiałów maturalnych, egzaminator OKE.", online: true },
];

const COMPETITORS = [
  { name: "SenseiOnline", model: "SenseiCoin (za minutę)", commission: "20%", minLesson: "1 min", instantConnect: true, parentPanel: true, freeTrial: true, videoBuiltIn: true, pricing: "od 1.32 PLN/min", highlight: true },
  { name: "Superprof", model: "Za godzinę", commission: "~15–20%", minLesson: "60 min", instantConnect: false, parentPanel: false, freeTrial: true, videoBuiltIn: false, pricing: "60–150 PLN/h" },
  { name: "e-korepetycje", model: "Subskrypcja nauczyciela", commission: "Stała opłata", minLesson: "60 min", instantConnect: false, parentPanel: false, freeTrial: false, videoBuiltIn: false, pricing: "50–120 PLN/h" },
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

const CoinBadge = ({ n, size = "md" }) => {
  const s = size === "sm" ? { fontSize: 13, padding: "3px 10px", gap: 4 } : size === "lg" ? { fontSize: 22, padding: "6px 16px", gap: 6 } : { fontSize: 15, padding: "4px 12px", gap: 5 };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: s.gap, background: C.coinBg, border: `1.5px solid ${C.coinGold}40`, borderRadius: 30, padding: s.padding, fontWeight: 700, color: C.gold, fontFamily: "'DM Mono',monospace", fontSize: s.fontSize }}>
      <span style={{ fontSize: s.fontSize * 0.9 }}>先</span>{n}
    </span>
  );
};

const SectionTitle = ({ tag, tagColor, tagBg, title, accent, sub }) => (
  <div style={{ marginBottom: 48 }}>
    <span style={{ display: "inline-block", padding: "5px 14px", borderRadius: 30, fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", background: tagBg, color: tagColor }}>{tag}</span>
    <h2 style={{ fontSize: 36, fontWeight: 800, marginTop: 12, letterSpacing: -1, color: C.ink }}>{title} {accent && <span style={{ color: C.accent }}>{accent}</span>}</h2>
    {sub && <p style={{ color: C.inkSoft, marginTop: 8, fontSize: 15 }}>{sub}</p>}
  </div>
);

// ─── Teacher Card ───
function TCard({ t, nav, onConnect }) {
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
        <button
          className="bm"
          style={{ padding: "8px 18px", fontSize: 12, opacity: t.online ? 1 : 0.5, cursor: t.online ? "pointer" : "not-allowed" }}
          onClick={() => t.online && onConnect(t)}
          title={t.online ? "" : "Niedostępny teraz"}
        >
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
  const [activeTeacher, setActiveTeacher] = useState(null);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionCoinsSpent, setSessionCoinsSpent] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const sessionRef = useRef(null);

  const nav = p => { setPage(p); setSidebarOpen(false); };

  // Start session
  const startSession = (teacher) => {
    if (studentCoins < 1) { nav("pricing"); return; }
    setActiveTeacher(teacher);
    setSessionSeconds(0);
    setSessionCoinsSpent(0);
    setSessionActive(true);
    nav("session");
  };

  // Session timer — 1 coin per 6 seconds (demo x10 speed), real would be 60s
  useEffect(() => {
    if (sessionActive && page === "session") {
      sessionRef.current = setInterval(() => {
        setSessionSeconds(s => {
          const newS = s + 1;
          // Every 6 seconds = 1 coin (demo speed)
          if (newS % 6 === 0 && newS > 0) {
            setStudentCoins(c => {
              if (c <= 0) {
                endSession();
                return 0;
              }
              return c - 1;
            });
            setSessionCoinsSpent(sc => sc + 1);
          }
          return newS;
        });
      }, 1000);
    }
    return () => clearInterval(sessionRef.current);
  }, [sessionActive, page]);

  const endSession = () => {
    clearInterval(sessionRef.current);
    setSessionActive(false);
    nav("session-end");
  };

  const MENU = [
    { section: "Menu" },
    { icon: "🏠", label: "Strona główna", p: "home" },
    { icon: "⚡", label: "Jak to działa", p: "how" },
    { icon: "📚", label: "Przedmioty", p: "subjects" },
    { icon: "👨‍🏫", label: "Nauczyciele", p: "teachers" },
    ...(userRole === "student" ? [{ icon: "先", label: "Pakiety SenseiCoin", p: "pricing", isJp: true }] : []),
    { section: "Analiza" },
    { icon: "📊", label: "Matryca konkurentów", p: "competitors" },
    { section: "Konto" },
    ...(userRole === "student" ? [
      { icon: "🎒", label: "Portfel studenta", p: "dashboard" },
      { icon: "👨‍👩‍👧", label: "Panel rodzica", p: "parent" },
      { icon: "🎓", label: "Dla nauczycieli", p: "for-teachers" },
    ] : [
      { icon: "👨‍🏫", label: "Panel Nauczyciela", p: "teacher-dashboard" }
    ])
  ];

  const ft = TEACHERS.filter(t => (!sf || t.subject === sf) && (!sq || (t.name + t.subject).toLowerCase().includes(sq.toLowerCase())));

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div style={{ fontFamily: "'Outfit',sans-serif", background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@400;500&family=Noto+Serif+JP:wght@400;700;900&display=swap" rel="stylesheet" />
      <style>{`
        html, body, #root { margin:0; padding:0; overflow-x:hidden; width:100%; background-color:${C.bg}; }
        *{margin:0;padding:0;box-sizing:border-box}
        ::selection{background:${C.accentSoft};color:${C.accent}}
        @keyframes fu{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes coinPop{0%{transform:scale(1)}50%{transform:scale(1.3)}100%{transform:scale(1)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
        @keyframes ping{0%{transform:scale(1);opacity:.7}100%{transform:scale(2.2);opacity:0}}
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
        @media(max-width:900px){
          .g2,.g3{grid-template-columns:1fr!important}
          .g4{grid-template-columns:1fr 1fr!important}
          .sidebar-d{display:none!important}
          .mob-header{display:flex!important}
          .main-content{margin-left:0!important}
          .hf{flex-direction:column!important;text-align:center!important}
          .hf>div:first-child{align-items:center!important}
          .ht{font-size:32px!important}
          .hid-m{display:none!important}
        }
      `}</style>

      {/* ══════════ SIDEBAR ══════════ */}
      <aside className="sidebar-d" style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: 240, background: C.sidebar, color: "#fff", zIndex: 100, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <div style={{ padding: "20px 20px 16px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", borderBottom: "1px solid #2A2A42" }} onClick={() => nav("home")}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: C.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 900, fontFamily: "'Noto Serif JP',serif" }}>先</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>sensei<span style={{ color: C.coinGold }}>online</span></div>
            <div style={{ fontSize: 10, color: "#888", letterSpacing: 1 }}>senseionline.pl</div>
          </div>
        </div>

        {userRole === "student" ? (
          <div style={{ padding: "14px 20px", background: "#22223A", margin: "12px 12px 4px", borderRadius: 10, cursor: "pointer" }} onClick={() => nav("dashboard")}>
            <div style={{ fontSize: 10, color: "#888", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Twoje SenseiCoiny</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: C.coinGold, fontFamily: "'DM Mono',monospace" }}>{studentCoins}</span>
              <span className="jp" style={{ fontSize: 14, color: C.coinGold }}>先</span>
              <span style={{ fontSize: 11, color: "#777", marginLeft: "auto" }}>= {studentCoins} min</span>
            </div>
          </div>
        ) : (
          <div style={{ padding: "14px 20px", background: "#22223A", margin: "12px 12px 4px", borderRadius: 10, cursor: "pointer" }} onClick={() => nav("teacher-dashboard")}>
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
            return (
              <div key={i} onClick={() => nav(item.p)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", margin: "1px 8px", borderRadius: 8, cursor: "pointer", transition: "all .2s", background: active ? C.accent : "transparent", color: active ? "#fff" : "#bbb", fontWeight: active ? 600 : 400, fontSize: 14 }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = C.sidebarHover; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
                <span style={{ fontSize: item.isJp ? 14 : 16, fontFamily: item.isJp ? "'Noto Serif JP',serif" : "inherit", width: 22, textAlign: "center" }}>{item.icon}</span>
                <span>{item.label}</span>
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
            <button onClick={() => { setShowOnboarding(true); setOnboardingStep(0); nav("register"); }} style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "none", background: C.accent, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Dołącz</button>
          </div>
        </div>
      </aside>

      {/* ══════════ MOBILE HEADER ══════════ */}
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
            return (
              <div key={i} onClick={() => nav(item.p)} style={{ padding: "12px 12px", borderRadius: 8, cursor: "pointer", color: page === item.p ? C.coinGold : "#ccc", fontWeight: page === item.p ? 600 : 400, fontSize: 16, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{item.icon}</span>{item.label}
              </div>
            );
          })}
        </div>
      )}

      {/* ══════════ MAIN CONTENT ══════════ */}
      <main className="main-content" style={{ marginLeft: 240, minHeight: "100vh" }}>
        <div style={{ paddingTop: 0 }}>

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
                      Kup minuty.<br />
                      Wybierz <span className="jp" style={{ color: C.accent }}>先生</span>.<br />
                      <span style={{ color: C.inkSoft, fontWeight: 600, fontSize: ".7em" }}>Ucz się na swoich zasadach.</span>
                    </h1>
                    <p style={{ fontSize: 16, color: C.inkSoft, lineHeight: 1.75, maxWidth: 440, marginBottom: 28 }}>
                      Kup pakiet <strong style={{ color: C.gold }}>SenseiCoinów</strong>, połącz się z nauczycielem i płać za minuty. Bez abonamentów, bez zmarnowanych pieniędzy.
                    </p>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button className="bm" onClick={() => nav("teachers")}>Znajdź Senseia →</button>
                      <button className="bo" onClick={() => nav("pricing")}>Kup SenseiCoiny</button>
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
                        <div className="jp" style={{ fontSize: 40, color: C.coinGold, lineHeight: 1 }}>先</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.inkMuted, letterSpacing: 1, marginTop: 4, textTransform: "uppercase" }}>SenseiCoin</div>
                      </div>
                      <div style={{ background: C.coinBg, borderRadius: 12, padding: 20, textAlign: "center", border: `1.5px solid ${C.coinGold}25`, marginBottom: 16 }}>
                        <div style={{ fontSize: 11, color: C.inkMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Jak to działa</div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                          <span style={{ fontSize: 28, fontWeight: 800, color: C.gold, fontFamily: "'DM Mono',monospace" }}>1</span>
                          <span className="jp" style={{ fontSize: 20, color: C.coinGold }}>先</span>
                          <span style={{ fontSize: 18, color: C.inkMuted }}>=</span>
                          <span style={{ fontSize: 28, fontWeight: 800, color: C.ink, fontFamily: "'DM Mono',monospace" }}>1</span>
                          <span style={{ fontSize: 14, color: C.inkSoft }}>minuta</span>
                        </div>
                      </div>
                      {PACKAGES.map((p, i) => (
                        <div key={i} onClick={() => nav("pricing")} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: 10, marginBottom: 6, cursor: "pointer", background: p.popular ? C.accentSoft : C.bgAlt, border: `1px solid ${p.popular ? C.accent + "25" : C.borderLight}`, transition: "all .2s" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span>{p.icon}</span>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{p.coins} <span className="jp" style={{ fontSize: 11, color: C.coinGold }}>先</span></div>
                              <div style={{ fontSize: 11, color: C.inkMuted }}>{p.label}</div>
                            </div>
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
                    {[["🪙", "Kup SenseiCoiny", "Wybierz pakiet 15–90 coinów. Im więcej, tym taniej za minutę."], ["🔍", "Znajdź Senseia", "Porównaj nauczycieli, ich oceny i stawki w coinach."], ["🎥", "Ucz się i płać coinami", "Minuty lekcji = coiny z Twojego konta. Proste."]].map(([ic, t, d], i) => (
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
                <SectionTitle tag="先生 Sensei" tagColor={C.gold} tagBg={C.goldSoft} title="Dostępni" accent="teraz" sub="Naciśnij 'Połącz teraz' aby zobaczyć demo sesji." />
                <div className="g3">
                  {TEACHERS.filter(t => t.online).slice(0, 3).map((t, i) => (
                    <TCard key={i} t={t} nav={nav} onConnect={startSession} />
                  ))}
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
                <p style={{ color: C.inkSoft, fontSize: 15, marginTop: 8, maxWidth: 440, marginLeft: "auto", marginRight: "auto" }}>
                  Zarejestruj się i odbierz <strong style={{ color: C.gold }}>5 darmowych SenseiCoinów</strong> na start.
                </p>
                <button className="bm" style={{ marginTop: 20, fontSize: 15, padding: "14px 36px" }} onClick={() => { setShowOnboarding(true); setOnboardingStep(0); nav("register"); }}>
                  Odbierz 5 darmowych 先 →
                </button>
              </section>
            </div>
          )}

          {/* ─── LIVE SESSION ─── */}
          {page === "session" && activeTeacher && (
            <div className="fu" style={{ minHeight: "100vh", background: "#0D0D1A", display: "flex", flexDirection: "column" }}>
              {/* Demo badge */}
              <div style={{ position: "fixed", top: 16, left: 260, background: C.coinGold, color: "#1B1B2F", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, zIndex: 200 }}>
                ⚡ DEMO — 10× prędkość
              </div>

              {/* Top bar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 28px", background: "#12122A", borderBottom: "1px solid #2A2A42" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: `linear-gradient(135deg,${C.accentSoft},${C.goldSoft})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: C.accent }}>{activeTeacher.ini}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{activeTeacher.name}</div>
                    <div style={{ fontSize: 11, color: "#888" }}>{activeTeacher.subject}</div>
                  </div>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, marginLeft: 4, animation: "pulse 1.5s infinite" }} />
                </div>

                {/* Coin meter — THE MONEY SHOT */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ fontSize: 10, color: "#888", letterSpacing: 1.5, textTransform: "uppercase" }}>Saldo SenseiCoin</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#22223A", padding: "8px 18px", borderRadius: 12 }}>
                    <span style={{ fontSize: 28, fontWeight: 900, color: studentCoins > 5 ? C.coinGold : C.accent, fontFamily: "'DM Mono',monospace", transition: "color .3s", animation: sessionSeconds % 6 === 0 && sessionSeconds > 0 ? "coinPop .3s ease" : "none" }}>
                      {studentCoins}
                    </span>
                    <span className="jp" style={{ fontSize: 18, color: C.coinGold }}>先</span>
                  </div>
                  <div style={{ fontSize: 11, color: C.inkMuted }}>
                    {activeTeacher.coinsPerMin} 先/min · ≈ {studentCoins / activeTeacher.coinsPerMin} min
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ fontSize: 10, color: "#888", letterSpacing: 1.5, textTransform: "uppercase" }}>Czas sesji</div>
                  <div style={{ fontSize: 28, fontWeight: 900, fontFamily: "'DM Mono',monospace", color: "#fff" }}>
                    {formatTime(sessionSeconds)}
                  </div>
                  <div style={{ fontSize: 11, color: C.accent, fontWeight: 600 }}>
                    Wydano: {sessionCoinsSpent} 先
                  </div>
                </div>
              </div>

              {/* Video area */}
              <div style={{ flex: 1, display: "flex", gap: 0, position: "relative" }}>
                {/* Main video */}
                <div style={{ flex: 1, background: "#0A0A18", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ width: 120, height: 120, borderRadius: "50%", background: `linear-gradient(135deg, ${C.accentSoft}, ${C.goldSoft})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, fontWeight: 800, color: C.accent, margin: "0 auto 16px", border: `3px solid ${C.accent}40` }}>
                      {activeTeacher.ini}
                    </div>
                    <div style={{ color: "#fff", fontSize: 18, fontWeight: 600 }}>{activeTeacher.name}</div>
                    <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>{activeTeacher.subject}</div>
                    <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 6 }}>
                      {[...Array(3)].map((_, i) => (
                        <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, animation: `pulse ${0.8 + i * 0.2}s infinite` }} />
                      ))}
                    </div>
                  </div>

                  {/* Self cam */}
                  <div style={{ position: "absolute", bottom: 20, right: 20, width: 140, height: 100, background: "#22223A", borderRadius: 10, border: "2px solid #3A3A5A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 28 }}>👤</div>
                      <div style={{ fontSize: 10, color: "#888", marginTop: 4 }}>Ty</div>
                    </div>
                  </div>

                  {/* Coin drain animation */}
                  {sessionSeconds % 6 === 0 && sessionSeconds > 0 && (
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 24, color: C.coinGold, fontWeight: 900, fontFamily: "'DM Mono',monospace", animation: "fu .5s ease-out both", pointerEvents: "none" }}>
                      -1 先
                    </div>
                  )}
                </div>

                {/* Whiteboard panel */}
                <div style={{ width: 320, background: "#F8F8F5", display: "flex", flexDirection: "column", borderLeft: "1px solid #2A2A42" }}>
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid #E5E2DA", fontSize: 12, fontWeight: 600, color: C.inkSoft, background: "#fff" }}>
                    📋 Tablica interaktywna
                  </div>
                  <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                    {/* Simulated whiteboard content */}
                    <div style={{ background: "#fff", borderRadius: 8, padding: 12, border: `1px solid ${C.border}`, fontSize: 12, color: C.inkSoft }}>
                      <div style={{ fontWeight: 600, color: C.ink, marginBottom: 6 }}>Zadanie 1:</div>
                      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: C.ink }}>2x² + 5x - 3 = 0</div>
                      <div style={{ marginTop: 8, fontSize: 11, color: C.inkMuted }}>Metoda: wyróżnik Δ = b² - 4ac</div>
                    </div>
                    <div style={{ background: C.coinBg, borderRadius: 8, padding: 12, border: `1px solid ${C.coinGold}20`, fontSize: 11, color: C.inkSoft }}>
                      <div style={{ fontWeight: 600, color: C.gold, marginBottom: 4 }}>Notatka nauczyciela:</div>
                      <div>Δ = 25 + 24 = 49 → √49 = 7</div>
                      <div style={{ marginTop: 4, color: C.ink, fontFamily: "'DM Mono',monospace" }}>x₁ = 0.5, x₂ = -3</div>
                    </div>
                    <div style={{ flex: 1 }} />
                    <div style={{ fontSize: 10, color: C.inkMuted, textAlign: "center" }}>Chat · Pliki · Rysowanie — dostępne</div>
                  </div>
                </div>
              </div>

              {/* Bottom controls */}
              <div style={{ padding: "16px 28px", background: "#12122A", borderTop: "1px solid #2A2A42", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 10 }}>
                  {[["🎤", "Mikrofon"], ["📷", "Kamera"], ["🖥️", "Ekran"]].map(([ic, label], i) => (
                    <button key={i} style={{ padding: "10px 16px", borderRadius: 10, border: "1px solid #3A3A5A", background: "#22223A", color: "#ccc", fontSize: 12, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
                      <span>{ic}</span><span>{label}</span>
                    </button>
                  ))}
                </div>

                {/* Progress bar: coins drain */}
                <div style={{ flex: 1, margin: "0 24px" }}>
                  <div style={{ fontSize: 10, color: "#888", textAlign: "center", marginBottom: 4 }}>Saldo coinów</div>
                  <div style={{ background: "#22223A", borderRadius: 8, height: 8, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.min((studentCoins / 42) * 100, 100)}%`, background: studentCoins > 10 ? `linear-gradient(90deg, ${C.coinGold}, #E8A800)` : `linear-gradient(90deg, ${C.accent}, #FF4444)`, borderRadius: 8, transition: "width .5s" }} />
                  </div>
                  {studentCoins <= 5 && <div style={{ fontSize: 10, color: C.accent, textAlign: "center", marginTop: 4, fontWeight: 600 }}>⚠ Kończy się saldo! Doładuj teraz</div>}
                </div>

                <button onClick={endSession} style={{ padding: "12px 24px", borderRadius: 50, border: "none", background: C.accent, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                  Zakończ lekcję
                </button>
              </div>
            </div>
          )}

          {/* ─── SESSION END ─── */}
          {page === "session-end" && activeTeacher && (
            <section className="fu" style={{ padding: "60px 40px", maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
              <h2 style={{ fontSize: 32, fontWeight: 900, color: C.ink, marginBottom: 8 }}>Lekcja zakończona!</h2>
              <p style={{ color: C.inkSoft, marginBottom: 32 }}>Świetna robota! Oto podsumowanie sesji.</p>

              <div className="card" style={{ padding: 28, marginBottom: 24, textAlign: "left" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ color: C.inkSoft }}>Nauczyciel</span>
                  <span style={{ fontWeight: 600 }}>{activeTeacher.name}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ color: C.inkSoft }}>Czas sesji</span>
                  <span style={{ fontWeight: 600, fontFamily: "'DM Mono',monospace" }}>{formatTime(sessionSeconds)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ color: C.inkSoft }}>Wydane SenseiCoiny</span>
                  <span style={{ fontWeight: 700, color: C.accent, fontFamily: "'DM Mono',monospace" }}>-{sessionCoinsSpent} 先</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: C.inkSoft }}>Pozostałe saldo</span>
                  <span style={{ fontWeight: 700, color: C.gold, fontFamily: "'DM Mono',monospace" }}>{studentCoins} 先</span>
                </div>
              </div>

              <div className="card" style={{ padding: 20, marginBottom: 24, background: C.coinBg, borderColor: `${C.coinGold}25` }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 10 }}>Oceń sesję z {activeTeacher.name}:</div>
                <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} style={{ fontSize: 28, background: "none", border: "none", cursor: "pointer" }}>★</button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button className="bm" onClick={() => nav("teachers")}>Ucz się ponownie →</button>
                <button className="bo" onClick={() => nav("pricing")}>Doładuj 先</button>
              </div>
            </section>
          )}

          {/* ─── HOW IT WORKS ─── */}
          {page === "how" && (
            <section className="fu" style={{ padding: "48px 40px", maxWidth: 800, margin: "0 auto" }}>
              <SectionTitle tag="Jak to działa" tagColor={C.teal} tagBg={C.tealSoft} title="Droga ucznia" accent="道" />
              <div style={{ maxWidth: 640 }}>
                {[
                  ["🪙", "Kup pakiet SenseiCoinów", "Wybierz pakiet od 15 do 90 coinów. 1 coin = 1 minuta nauki. Im większy pakiet, tym niższa cena za minutę. Płatność przez Stripe, BLIK lub Przelewy24."],
                  ["🔍", "Wybierz przedmiot i Senseia", "Przeglądaj profile nauczycieli — ich doświadczenie, oceny, liczbę sesji i stawkę w coinach. Każdy Sensei jest zweryfikowany."],
                  ["📅", "Zarezerwuj lub połącz się teraz", "Zaplanuj lekcję na konkretny termin lub użyj 'Połącz teraz' — system znajdzie wolnego Senseia w 30 sekund."],
                  ["🎥", "Ucz się w przeglądarce", "Wideo HD, interaktywna tablica, czat. Nic nie instalujesz. Minuty lekcji odliczają coiny z Twojego portfela."],
                  ["⭐", "Oceń i wróć", "Po lekcji oceń Senseia. Twoja historia, wydane coiny i postępy — wszystko w portfelu studenta."],
                ].map(([ic, t, d], i) => (
                  <div key={i} style={{ display: "flex", gap: 18, marginBottom: 28 }}>
                    <div style={{ flex: "0 0 48px", height: 48, borderRadius: 12, background: i === 0 ? C.accent : C.bgAlt, color: i === 0 ? "#fff" : C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, border: `1.5px solid ${i === 0 ? C.accent : C.border}` }}>{ic}</div>
                    <div><h3 style={{ fontSize: 17, fontWeight: 700, color: C.ink, marginBottom: 4 }}>{t}</h3><p style={{ fontSize: 14, color: C.inkSoft, lineHeight: 1.7 }}>{d}</p></div>
                  </div>
                ))}
              </div>
              <button className="bm" style={{ marginTop: 16 }} onClick={() => nav("pricing")}>Kup SenseiCoiny →</button>
            </section>
          )}

          {/* ─── SUBJECTS ─── */}
          {page === "subjects" && (
            <section className="fu" style={{ padding: "48px 40px", maxWidth: 1000, margin: "0 auto" }}>
              <SectionTitle tag="Przedmioty" tagColor={C.gold} tagBg={C.goldSoft} title="Znajdź swojego" accent="先生" sub="Stawki w SenseiCoinach za minutę lekcji." />
              <div className="g2">
                {SUBJECTS.map((s, i) => (
                  <div key={i} className="card" style={{ padding: 22, cursor: "pointer" }} onClick={() => { setSf(s.name); nav("teachers"); }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div><div style={{ fontSize: 32, marginBottom: 6 }}>{s.icon}</div><h3 style={{ fontSize: 18, fontWeight: 700, color: C.ink }}>{s.name}</h3><div style={{ fontSize: 12, color: C.inkMuted, marginTop: 2 }}>{s.teachers} nauczycieli</div></div>
                      <div style={{ textAlign: "right" }}><CoinBadge n={s.coins} size="sm" /><div style={{ fontSize: 11, color: C.inkMuted, marginTop: 4 }}>coinów/min</div></div>
                    </div>
                    <div style={{ marginTop: 10, fontSize: 13, color: C.accent, fontWeight: 600 }}>Zobacz nauczycieli →</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─── TEACHERS ─── */}
          {page === "teachers" && (
            <section className="fu" style={{ padding: "48px 40px", maxWidth: 1000, margin: "0 auto" }}>
              <SectionTitle tag="先生 Sensei" tagColor={C.gold} tagBg={C.goldSoft} title="Nasi" accent="nauczyciele" sub="Nauczyciele z zieloną kropką są dostępni teraz." />
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
              <div className="g3">{ft.map((t, i) => <TCard key={i} t={t} nav={nav} onConnect={startSession} />)}</div>
              {ft.length === 0 && <div style={{ textAlign: "center", padding: 40, color: C.inkMuted }}>Brak wyników.</div>}
            </section>
          )}

          {/* ─── PRICING ─── */}
          {page === "pricing" && (
            <section className="fu" style={{ padding: "48px 40px", maxWidth: 1000, margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: 48 }}>
                <div className="jp" style={{ fontSize: 48, color: C.coinGold, opacity: .3, marginBottom: 8 }}>先</div>
                <span style={{ display: "inline-block", padding: "5px 14px", borderRadius: 30, fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", background: C.coinBg, color: C.gold, border: `1px solid ${C.coinGold}30` }}>SenseiCoin</span>
                <h1 style={{ fontSize: 38, fontWeight: 900, marginTop: 12, letterSpacing: -1, color: C.ink }}>Kup minuty nauki</h1>
                <p style={{ color: C.inkSoft, marginTop: 8, fontSize: 15 }}>1 SenseiCoin = 1 minuta z nauczycielem. Im więcej kupujesz, tym taniej.</p>
              </div>
              <div className="g4" style={{ marginBottom: 40 }}>
                {PACKAGES.map((p, i) => (
                  <div key={i} className="card" style={{ padding: 26, textAlign: "center", position: "relative", border: p.popular ? `2px solid ${C.accent}` : undefined }}>
                    {p.popular && <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", background: C.accent, color: "#fff", padding: "3px 12px", borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: .5 }}>BESTSELLER</div>}
                    <div style={{ fontSize: 32, marginBottom: 8 }}>{p.icon}</div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: C.ink, marginBottom: 4 }}>{p.label}</h3>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, margin: "10px 0" }}>
                      <span style={{ fontSize: 36, fontWeight: 900, color: C.gold, fontFamily: "'DM Mono',monospace" }}>{p.coins}</span>
                      <span className="jp" style={{ fontSize: 20, color: C.coinGold }}>先</span>
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: C.ink, fontFamily: "'DM Mono',monospace" }}>{p.price} <span style={{ fontSize: 13, fontWeight: 500, color: C.inkMuted }}>PLN</span></div>
                    {p.save > 0 && <div style={{ fontSize: 12, color: C.accent, fontWeight: 600, marginTop: 4 }}>Oszczędzasz {p.save}%</div>}
                    <div style={{ fontSize: 12, color: C.inkMuted, marginTop: 4 }}>{p.perMin.toFixed(2)} PLN / minuta</div>
                    <p style={{ fontSize: 12, color: C.inkSoft, lineHeight: 1.5, marginTop: 10 }}>{p.desc}</p>
                    <button className="bm" onClick={() => setStudentCoins(c => c + p.coins)} style={{ width: "100%", marginTop: 14, padding: "10px 0", fontSize: 13 }}>Kup {p.coins} 先</button>
                  </div>
                ))}
              </div>
              <div className="card" style={{ padding: 28, background: C.coinBg, borderColor: `${C.coinGold}25` }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: C.ink, marginBottom: 14 }}>Jak działają SenseiCoiny?</h3>
                <div className="g3">
                  {[["🪙", "Kupujesz pakiet", "Coiny trafiają na Twój portfel. Nie mają daty ważności."], ["⏱️", "Używasz na lekcjach", "1 minuta = 1 coin. Widzisz w real-time jak tyka licznik."], ["🔄", "Doładowujesz kiedy chcesz", "Bez abonamentu. Stripe, BLIK, Przelewy24."]].map(([ic, t, d], i) => (
                    <div key={i} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 28, marginBottom: 6 }}>{ic}</div>
                      <h4 style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 4 }}>{t}</h4>
                      <p style={{ fontSize: 12, color: C.inkSoft, lineHeight: 1.5 }}>{d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ─── COMPETITOR MATRIX ─── */}
          {page === "competitors" && (
            <section className="fu" style={{ padding: "48px 40px", maxWidth: 1100, margin: "0 auto" }}>
              <SectionTitle tag="Analiza rynku" tagColor={C.teal} tagBg={C.tealSoft} title="Matryca" accent="konkurentów" sub="Porównanie platform korepetycji na polskim rynku." />
              <div style={{ overflowX: "auto", marginBottom: 32 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 700 }}>
                  <thead>
                    <tr style={{ background: C.sidebar, color: "#fff" }}>
                      {["Platforma", "Model", "Prowizja", "Min. lekcja", "Instant", "Panel rodzica", "Darmowy trial", "Wbudowane wideo", "Cennik"].map((h, i) => (
                        <th key={i} style={{ padding: "12px 10px", textAlign: "left", fontWeight: 600, fontSize: 12, letterSpacing: .3, whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COMPETITORS.map((c, i) => (
                      <tr key={i} style={{ background: c.highlight ? C.coinBg : i % 2 === 0 ? C.bgCard : C.bgAlt, borderBottom: `1px solid ${C.border}` }}>
                        <td style={{ padding: "10px", fontWeight: c.highlight ? 700 : 500, color: c.highlight ? C.accent : C.ink }}>
                          {c.highlight && <span className="jp" style={{ marginRight: 4, color: C.coinGold }}>先</span>}{c.name}
                        </td>
                        <td style={{ padding: "10px", color: C.inkSoft }}>{c.model}</td>
                        <td style={{ padding: "10px", color: C.inkSoft }}>{c.commission}</td>
                        <td style={{ padding: "10px", color: C.inkSoft }}>{c.minLesson}</td>
                        <td style={{ padding: "10px" }}>{c.instantConnect ? <span style={{ color: C.green }}>✓</span> : <span style={{ color: C.inkMuted }}>✗</span>}</td>
                        <td style={{ padding: "10px" }}>{c.parentPanel ? <span style={{ color: C.green }}>✓</span> : <span style={{ color: C.inkMuted }}>✗</span>}</td>
                        <td style={{ padding: "10px" }}>{c.freeTrial ? <span style={{ color: C.green }}>✓</span> : <span style={{ color: C.inkMuted }}>✗</span>}</td>
                        <td style={{ padding: "10px" }}>{c.videoBuiltIn ? <span style={{ color: C.green }}>✓</span> : <span style={{ color: C.inkMuted }}>✗</span>}</td>
                        <td style={{ padding: "10px", color: c.highlight ? C.accent : C.inkSoft, fontWeight: c.highlight ? 600 : 400, fontFamily: "'DM Mono',monospace", fontSize: 12 }}>{c.pricing}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: C.ink, marginBottom: 16 }}>Nasze przewagi konkurencyjne</h3>
              <div className="g2">
                {[
                  ["🪙", "SenseiCoin — wewnętrzna waluta", "Jedyna platforma z systemem coinów. Uczeń wie dokładnie ile minut ma w portfelu."],
                  ["⏱️", "Brak minimalnego czasu", "Superprof, e-korepetycje — minimum 60 min. U nas nawet 5 minut."],
                  ["📚", "Wszystkie przedmioty", "Tutlo = tylko języki. My pokrywamy 10+ przedmiotów."],
                  ["👨‍👩‍👧", "Panel rodzicielski", "Żaden konkurent nie oferuje dashboardu dla rodziców z kontrolą wydatków."],
                  ["⚡", "Natychmiastowe połączenie", "'Połącz teraz' — 30 sekund do lekcji."],
                  ["🎯", "Niższa bariera wejścia", "29 PLN za starter vs 80–150 PLN za jedną godzinę u konkurencji."],
                ].map(([ic, t, d], i) => (
                  <div key={i} className="card" style={{ padding: 20 }}>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>{ic}</div>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: C.ink, marginBottom: 4 }}>{t}</h4>
                    <p style={{ fontSize: 13, color: C.inkSoft, lineHeight: 1.6 }}>{d}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─── STUDENT DASHBOARD ─── */}
          {page === "dashboard" && (
            <section className="fu" style={{ padding: "48px 40px", maxWidth: 1000, margin: "0 auto" }}>
              <SectionTitle tag="🎒 Portfel studenta" tagColor={C.gold} tagBg={C.goldSoft} title="Twój portfel" />
              <div className="card" style={{ padding: 28, marginBottom: 24, background: `linear-gradient(135deg, ${C.sidebar}, #2A2A42)`, border: "none", color: "#fff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#999", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>Saldo SenseiCoinów</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 48, fontWeight: 900, color: C.coinGold, fontFamily: "'DM Mono',monospace" }}>{studentCoins}</span>
                      <span className="jp" style={{ fontSize: 28, color: C.coinGold }}>先</span>
                    </div>
                    <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>= {studentCoins} minut nauki</div>
                  </div>
                  <button onClick={() => nav("pricing")} style={{ padding: "12px 28px", borderRadius: 50, border: "none", cursor: "pointer", fontFamily: "inherit", background: `linear-gradient(135deg, ${C.coinGold}, #E8A800)`, color: "#1B1B2F", fontWeight: 700, fontSize: 14 }}>+ Doładuj coiny</button>
                </div>
              </div>
              <div className="g4" style={{ marginBottom: 24 }}>
                {[["📚", "Ukończone lekcje", "24", C.tealSoft], ["⏱️", "Czas nauki", "18h 32min", C.accentSoft], ["💰", "Wydane coiny", `${387 + sessionCoinsSpent} 先`, C.goldSoft], ["⭐", "Średnia ocena Sensei", "4.9", C.coinBg]].map(([ic, label, val, bg], i) => (
                  <div key={i} className="card" style={{ padding: 18, textAlign: "center", background: bg }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{ic}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: C.ink, fontFamily: "'DM Mono',monospace" }}>{val}</div>
                    <div style={{ fontSize: 11, color: C.inkMuted, marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </div>
              <div className="card" style={{ padding: 24, marginBottom: 24 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: C.ink, marginBottom: 16 }}>Historia transakcji</h3>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                      {["Data", "Typ", "Opis", "Coiny"].map(h => <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontWeight: 600, color: C.inkSoft, fontSize: 11, letterSpacing: .5, textTransform: "uppercase" }}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ...(sessionCoinsSpent > 0 ? [["Teraz", "Lekcja", `${activeTeacher?.subject || "Lekcja"} z ${activeTeacher?.name || "Senseia"} (${sessionCoinsSpent} min)`, `-${sessionCoinsSpent}`, C.accent]] : []),
                      ["15.04.2026", "Doładowanie", "Pakiet Standard (30 先)", "+30", C.green],
                      ["14.04.2026", "Lekcja", "Matematyka z Anną K. (23 min)", "-23", C.accent],
                      ["12.04.2026", "Lekcja", "Angielski z Martą W. (15 min)", "-15", C.accent],
                      ["10.04.2026", "Bonus", "Bonus za rejestrację", "+5", C.green],
                    ].map(([date, type, desc, coins, color], i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${C.borderLight}` }}>
                        <td style={{ padding: "10px", color: C.inkMuted, fontFamily: "'DM Mono',monospace", fontSize: 12 }}>{date}</td>
                        <td style={{ padding: "10px" }}>
                          <span style={{ padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 600, background: type === "Doładowanie" ? `${C.green}15` : type === "Bonus" ? C.coinBg : C.accentSoft, color: type === "Doładowanie" ? C.green : type === "Bonus" ? C.gold : C.accent }}>{type}</span>
                        </td>
                        <td style={{ padding: "10px", color: C.inkSoft }}>{desc}</td>
                        <td style={{ padding: "10px", fontWeight: 700, fontFamily: "'DM Mono',monospace", color }}>{coins} 先</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="g3">
                <div className="card" style={{ padding: 20, textAlign: "center", cursor: "pointer" }} onClick={() => nav("teachers")}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>🔍</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>Znajdź Senseia</div>
                </div>
                <div className="card" style={{ padding: 20, textAlign: "center", cursor: "pointer" }} onClick={() => nav("pricing")}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>🪙</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>Kup SenseiCoiny</div>
                </div>
                <div className="card" style={{ padding: 20, textAlign: "center", cursor: "pointer", background: C.accentSoft }} onClick={() => { setUserRole("teacher"); nav("teacher-dashboard"); }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>🔄</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.accent }}>Widok Nauczyciela</div>
                  <div style={{ fontSize: 11, color: C.inkSoft }}>Demo przełączania roli</div>
                </div>
              </div>
            </section>
          )}

          {/* ─── PARENT PANEL ─── */}
          {page === "parent" && (
            <section className="fu" style={{ padding: "48px 40px", maxWidth: 1000, margin: "0 auto" }}>
              <SectionTitle tag="👨‍👩‍👧 Dla rodziców" tagColor={C.teal} tagBg={C.tealSoft} title="Panel" accent="rodzica" sub="Pełna kontrola nad edukacją i wydatkami dziecka." />

              {/* Child selector */}
              <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
                <div className="card" style={{ padding: "12px 20px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", border: `2px solid ${C.accent}`, background: C.accentSoft }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👧</div>
                  <div><div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>Kasia</div><div style={{ fontSize: 11, color: C.inkMuted }}>Liceum · kl. 3</div></div>
                </div>
                <div className="card" style={{ padding: "12px 20px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", opacity: .6 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: C.bgAlt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👦</div>
                  <div><div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>Tomek</div><div style={{ fontSize: 11, color: C.inkMuted }}>Podstawówka · kl. 7</div></div>
                </div>
                <button className="bo" style={{ fontSize: 12, padding: "8px 16px" }}>+ Dodaj dziecko</button>
              </div>

              {/* Stats */}
              <div className="g4" style={{ marginBottom: 24 }}>
                {[
                  ["🪙", "Saldo Kasi", `${studentCoins} 先`, C.coinBg, C.gold],
                  ["📚", "Lekcje w tym miesiącu", "7", C.tealSoft, C.teal],
                  ["⏱️", "Godziny nauki", "5h 20min", C.accentSoft, C.accent],
                  ["💸", "Wydatki kwiecień", "49 PLN", C.bgAlt, C.ink],
                ].map(([ic, label, val, bg, color], i) => (
                  <div key={i} className="card" style={{ padding: 18, textAlign: "center", background: bg }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{ic}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color, fontFamily: "'DM Mono',monospace" }}>{val}</div>
                    <div style={{ fontSize: 11, color: C.inkMuted, marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Budget control */}
              <div className="card" style={{ padding: 24, marginBottom: 20 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: C.ink, marginBottom: 16 }}>💳 Kontrola budżetu</h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${C.border}` }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>Miesięczny limit coinów</div>
                    <div style={{ fontSize: 12, color: C.inkMuted }}>Kasia może wydać max. 60 先/miesiąc</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: C.gold, fontFamily: "'DM Mono',monospace" }}>60 先</span>
                    <button style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.bgCard, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Zmień</button>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${C.border}` }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>Powiadomienia SMS</div>
                    <div style={{ fontSize: 12, color: C.inkMuted }}>Po każdej zakończonej lekcji</div>
                  </div>
                  <div style={{ width: 44, height: 24, borderRadius: 12, background: C.green, position: "relative", cursor: "pointer" }}>
                    <div style={{ position: "absolute", right: 2, top: 2, width: 20, height: 20, borderRadius: "50%", background: "#fff" }} />
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>Autoryzacja nowych nauczycieli</div>
                    <div style={{ fontSize: 12, color: C.inkMuted }}>Musisz zatwierdzić zanim Kasia zacznie lekcję</div>
                  </div>
                  <div style={{ width: 44, height: 24, borderRadius: 12, background: C.bgAlt, border: `1px solid ${C.border}`, position: "relative", cursor: "pointer" }}>
                    <div style={{ position: "absolute", left: 2, top: 2, width: 20, height: 20, borderRadius: "50%", background: C.inkMuted }} />
                  </div>
                </div>
              </div>

              {/* Activity feed */}
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: C.ink, marginBottom: 16 }}>📋 Aktywność Kasi</h3>
                {[
                  { icon: "🎥", title: "Lekcja Matematyki", teacher: "Anna Kowalska", time: "dzisiaj, 14:00", duration: "23 min", coins: 23, color: C.tealSoft },
                  { icon: "⭐", title: "Ocena wystawiona", teacher: "Anna Kowalska", time: "dzisiaj, 14:25", detail: "5 gwiazdek", color: C.coinBg },
                  { icon: "🎥", title: "Lekcja Angielskiego", teacher: "Marta Wiśniewska", time: "12.04, 16:00", duration: "15 min", coins: 30, color: C.tealSoft },
                  { icon: "🪙", title: "Doładowanie coinów", teacher: "Pakiet Standard", time: "10.04", detail: "+30 先", color: C.greenSoft },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: i < 3 ? `1px solid ${C.borderLight}` : "none" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: item.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{item.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: C.inkMuted }}>{item.teacher} · {item.time}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.inkSoft, fontFamily: "'DM Mono',monospace" }}>
                      {item.duration ? `-${item.coins} 先` : item.detail}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─── TEACHER DASHBOARD ─── */}
          {page === "teacher-dashboard" && (
            <section className="fu" style={{ padding: "48px 40px", maxWidth: 1000, margin: "0 auto" }}>
              <SectionTitle tag="👨‍🏫 Panel" tagColor={C.accent} tagBg={C.accentSoft} title="Panel" accent="Nauczyciela" />
              <div className="g4" style={{ marginBottom: 24 }}>
                {[["💰", "Zarobki (kwiecień)", "1 240 PLN", C.greenSoft, C.green], ["📅", "Lekcje dzisiaj", "3", C.tealSoft, C.teal], ["⭐", "Średnia ocena", "4.9", C.coinBg, C.gold], ["⏱️", "Łączny czas", "89h", C.accentSoft, C.accent]].map(([ic, label, val, bg, color], i) => (
                  <div key={i} className="card" style={{ padding: 18, textAlign: "center", background: bg }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{ic}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color, fontFamily: "'DM Mono',monospace" }}>{val}</div>
                    <div style={{ fontSize: 11, color: C.inkMuted, marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Earnings breakdown */}
              <div className="card" style={{ padding: 24, marginBottom: 20 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: C.ink, marginBottom: 16 }}>Zarobki — kwiecień 2026</h3>
                {[["1 kwiecień – 7 kwiecień", "18 sesji", "312 PLN"], ["8 kwiecień – 14 kwiecień", "22 sesji", "398 PLN"], ["15 kwiecień – dziś", "15 sesji", "530 PLN"]].map(([period, sessions, earn], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < 2 ? `1px solid ${C.borderLight}` : "none" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{period}</div>
                      <div style={{ fontSize: 11, color: C.inkMuted }}>{sessions}</div>
                    </div>
                    <span style={{ fontSize: 16, fontWeight: 800, color: C.green, fontFamily: "'DM Mono',monospace" }}>{earn}</span>
                  </div>
                ))}
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: `2px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 700, color: C.ink }}>Razem</span>
                  <span style={{ fontSize: 20, fontWeight: 900, color: C.green, fontFamily: "'DM Mono',monospace" }}>1 240 PLN</span>
                </div>
                <div style={{ marginTop: 10, fontSize: 12, color: C.inkMuted }}>Wypłata 30.04.2026 · Stripe Connect</div>
              </div>

              <div className="card" style={{ padding: 24, marginBottom: 16 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: C.ink, marginBottom: 16 }}>📅 Dzisiaj</h3>
                {[["14:00", "Matematyka", "Kasia M.", "45 min", true], ["16:30", "Fizyka", "Olek T.", "30 min", false]].map(([time, subject, student, dur, now], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderRadius: 10, marginBottom: 8, background: now ? C.greenSoft : C.bgAlt, border: `1px solid ${now ? C.green + "30" : C.borderLight}` }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <span style={{ fontFamily: "'DM Mono',monospace", fontWeight: 700, fontSize: 14, color: C.ink }}>{time}</span>
                      <div><div style={{ fontSize: 14, fontWeight: 600 }}>{subject}</div><div style={{ fontSize: 12, color: C.inkMuted }}>{student} · {dur}</div></div>
                    </div>
                    <button className={now ? "bm" : "bo"} style={{ padding: "7px 16px", fontSize: 12 }}>{now ? "Dołącz →" : "Szczegóły"}</button>
                  </div>
                ))}
              </div>

              <div className="card" style={{ padding: 20, textAlign: "center", cursor: "pointer", background: C.accentSoft, border: `1px solid ${C.accent}30` }} onClick={() => { setUserRole("student"); nav("dashboard"); }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>🔄</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.accent }}>Przełącz na widok ucznia</div>
                <div style={{ fontSize: 11, color: C.inkSoft }}>Demo przełączania roli</div>
              </div>
            </section>
          )}

          {/* ─── FOR TEACHERS ─── */}
          {page === "for-teachers" && (
            <section className="fu" style={{ padding: "48px 40px", maxWidth: 1000, margin: "0 auto" }}>
              <SectionTitle tag="Dla nauczycieli" tagColor={C.gold} tagBg={C.goldSoft} title="Zostań" accent="先生 Senseim" />
              <div className="g2" style={{ alignItems: "start" }}>
                <div>
                  {[["80%", "przychodów do Ciebie", "Najniższa prowizja na polskim rynku."], ["0 PLN", "za rejestrację", "Zacznij zarabiać od pierwszej lekcji."], ["48h", "wypłata", "Szybkie przelewy. Stripe Connect."], ["100%", "kontroli", "Ustalasz stawkę, grafik i zasady."]].map(([v, l, d], i) => (
                    <div key={i} className="card" style={{ padding: 20, marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 3 }}>
                        <span style={{ fontSize: 24, fontWeight: 900, color: C.accent, fontFamily: "'DM Mono',monospace" }}>{v}</span>
                        <span style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>{l}</span>
                      </div>
                      <p style={{ fontSize: 13, color: C.inkMuted }}>{d}</p>
                    </div>
                  ))}
                </div>
                <div className="card" style={{ padding: 28 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: C.ink, marginBottom: 16 }}>💰 Kalkulator zarobków</h3>
                  <div style={{ fontSize: 13, color: C.inkMuted }}>Stawka: 2 coiny/min · 3h/dzień · 22 dni</div>
                  <div style={{ background: C.coinBg, borderRadius: 14, padding: 22, textAlign: "center", marginTop: 14, border: `1px solid ${C.coinGold}25` }}>
                    <div style={{ fontSize: 10, color: C.inkMuted, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Zarobek / miesiąc</div>
                    <div style={{ fontSize: 40, fontWeight: 900, fontFamily: "'DM Mono',monospace", color: C.gold }}>6 336 PLN</div>
                    <div style={{ fontSize: 12, color: C.inkMuted, marginTop: 4 }}>netto, po prowizji (20%)</div>
                  </div>
                  <button className="bm" style={{ width: "100%", marginTop: 18 }} onClick={() => { setUserRole("teacher"); nav("teacher-dashboard"); }}>
                    Dołącz jako Sensei →
                  </button>
                </div>
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
                  <p style={{ fontSize: 13, color: C.inkMuted, marginTop: 4 }}>
                    {page === "register" && <span>Odbierz <strong style={{ color: C.gold }}>5 darmowych SenseiCoinów 先</strong> na start!</span>}
                    {page === "login" && "Zaloguj się na swoje konto"}
                  </p>
                </div>
                <div style={{ display: "flex", background: C.bgAlt, borderRadius: 10, padding: 3, marginBottom: 18 }}>
                  {[["login", "Logowanie"], ["register", "Rejestracja"]].map(([v, l]) => (
                    <button key={v} onClick={() => nav(v)} style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "none", background: page === v ? C.bgCard : "transparent", color: page === v ? C.ink : C.inkMuted, fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit", boxShadow: page === v ? "0 2px 6px rgba(0,0,0,.04)" : "none" }}>{l}</button>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {page === "register" && <input type="text" placeholder="Imię i nazwisko" style={{ padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.bgCard, fontSize: 14, fontFamily: "inherit", color: C.ink, outline: "none" }} />}
                  <input type="email" placeholder="Adres e-mail" style={{ padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.bgCard, fontSize: 14, fontFamily: "inherit", color: C.ink, outline: "none" }} />
                  <input type="password" placeholder="Hasło" style={{ padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.bgCard, fontSize: 14, fontFamily: "inherit", color: C.ink, outline: "none" }} />
                </div>
                <button className="bm" style={{ width: "100%", marginTop: 16 }} onClick={() => {
                  if (page === "register") {
                    setStudentCoins(c => c + 5);
                    nav("dashboard");
                  } else {
                    nav("dashboard");
                  }
                }}>
                  {page === "login" ? "Zaloguj się" : "Stwórz konto i odbierz 5 先"}
                </button>
                {page === "login" && <div style={{ textAlign: "center", marginTop: 10, fontSize: 13, color: C.accent, cursor: "pointer" }}>Zapomniałeś hasła?</div>}
                <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
                  <button style={{ width: "100%", padding: 10, borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.bgCard, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", color: C.ink }}>G  Kontynuuj z Google</button>
                </div>
              </div>
            </section>
          )}

          {/* ══════════ FOOTER ══════════ */}
          {page !== "session" && (
            <footer style={{ background: C.bgAlt, borderTop: `1px solid ${C.border}`, padding: "40px 40px 20px" }}>
              <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 6, background: C.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, fontFamily: "'Noto Serif JP',serif" }}>先</div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>sensei<span style={{ color: C.accent }}>online</span><span style={{ color: C.inkMuted }}>.pl</span></span>
                </div>
                <span style={{ fontSize: 12, color: C.inkMuted }}>© 2026 · 🇵🇱 Polska · RODO ✓ · Stripe ✓ · BLIK ✓</span>
              </div>
            </footer>
          )}

        </div>
      </main>
    </div>
  );
}