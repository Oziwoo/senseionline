import { useState, useEffect, useRef } from "react";

const C = {
  bg: "#FAF8F4", bgAlt: "#F2EFE8", bgCard: "#FFFFFF",
  ink: "#0D0D0D", inkSoft: "#3A3A3A", inkMuted: "#767676",
  accent: "#C8102E", accentSoft: "#C8102E15",
  gold: "#B8860B", goldSoft: "#B8860B12",
  indigo: "#2D3561", indigoSoft: "#2D356110",
  border: "#E8E4DC", borderLight: "#F0ECE4",
};

const SUBJECTS = [
  { icon: "📐", name: "Matematyka", teachers: 142, price: "1.20–2.50", desc: "Algebra, geometria, analiza, matura" },
  { icon: "🧪", name: "Chemia", teachers: 87, price: "1.30–2.80", desc: "Organiczna, nieorganiczna, biochemia" },
  { icon: "🔬", name: "Fizyka", teachers: 93, price: "1.20–2.60", desc: "Mechanika, optyka, elektryczność" },
  { icon: "🇬🇧", name: "Angielski", teachers: 231, price: "1.00–3.00", desc: "Konwersacje, FCE, IELTS, biznesowy" },
  { icon: "🇩🇪", name: "Niemiecki", teachers: 78, price: "1.10–2.40", desc: "Goethe-Zertifikat, gramatyka" },
  { icon: "📖", name: "Polski", teachers: 119, price: "1.00–2.20", desc: "Wypracowania, lektury, matura" },
  { icon: "🧬", name: "Biologia", teachers: 65, price: "1.20–2.50", desc: "Genetyka, anatomia, ekologia" },
  { icon: "💻", name: "Informatyka", teachers: 54, price: "1.50–3.50", desc: "Python, algorytmy, bazy danych" },
  { icon: "🌍", name: "Geografia", teachers: 41, price: "1.00–2.00", desc: "Fizyczna, społeczna, kartografia" },
  { icon: "📜", name: "Historia", teachers: 58, price: "1.00–2.10", desc: "Starożytność po współczesność" },
];

const TEACHERS = [
  { name: "Anna Kowalska", subject: "Matematyka", rating: 4.9, reviews: 312, price: 1.8, ini: "AK", exp: "8 lat", badge: "先生", sessions: 2841, bio: "Absolwentka UW, przygotowuje do matury z 95% skutecznością." },
  { name: "Piotr Nowak", subject: "Fizyka", rating: 4.8, reviews: 198, price: 2.1, ini: "PN", exp: "12 lat", badge: "師匠", sessions: 1920, bio: "Doktor nauk fizycznych, trudne koncepty tłumaczy prosto." },
  { name: "Marta Wiśniewska", subject: "Angielski", rating: 5.0, reviews: 487, price: 2.5, ini: "MW", exp: "10 lat", badge: "先生", sessions: 4102, bio: "Cambridge CELTA, 3 lata w Londynie, native-level fluency." },
  { name: "Tomasz Zieliński", subject: "Chemia", rating: 4.7, reviews: 156, price: 1.6, ini: "TZ", exp: "6 lat", badge: null, sessions: 1205, bio: "Pasjonat chemii organicznej, każdą reakcję wyjaśni na przykładach." },
  { name: "Karolina Dąbrowska", subject: "Informatyka", rating: 4.9, reviews: 223, price: 3.0, ini: "KD", exp: "5 lat", badge: "師匠", sessions: 1678, bio: "Full-stack developer, uczy od podstaw po zaawansowane projekty." },
  { name: "Michał Lewandowski", subject: "Polski", rating: 4.8, reviews: 189, price: 1.5, ini: "ML", exp: "15 lat", badge: "先生", sessions: 3540, bio: "Polonista z pasją, autor materiałów maturalnych, egzaminator OKE." },
];

const REVIEWS = [
  { name: "Kasia M.", role: "Uczennica, 2 klasa LO", text: "Dzięki Sensei Online zdałam maturę z matmy na 92%! Płacę tylko za realny czas nauki.", rating: 5 },
  { name: "Marek W.", role: "Rodzic", text: "Widzę dokładnie ile czasu i pieniędzy idzie na lekcje córki. Pełna kontrola wydatków.", rating: 5 },
  { name: "Ola K.", role: "Studentka UW", text: "Czasem potrzebuję 15 minut konsultacji, a nie całą godzinę. Sensei to rozumie.", rating: 5 },
  { name: "Jan P.", role: "Uczeń, 3 klasa LO", text: "Nauczyciel fizyki wytłumaczył mi w 20 minut to, czego nie zrozumiałem cały semestr.", rating: 5 },
];

function Timer({ ppm = 1.8 }) {
  const [s, setS] = useState(0);
  const [on, setOn] = useState(false);
  const r = useRef(null);
  useEffect(() => {
    if (on) r.current = setInterval(() => setS(p => p + 1), 70);
    return () => clearInterval(r.current);
  }, [on]);
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 48, fontWeight: 700, color: C.ink }}>{String(s).padStart(2, "0")}<span style={{ fontSize: 18, color: C.inkMuted, marginLeft: 4 }}>min</span></div>
      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 22, color: C.accent, fontWeight: 600, marginTop: 6 }}>{(s * ppm).toFixed(2)} PLN</div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 14 }}>
        <button onClick={() => setOn(!on)} style={{ ...bs, background: on ? C.bgAlt : C.accent, color: on ? C.ink : "#fff", border: `1.5px solid ${on ? C.border : C.accent}` }}>{on ? "⏸ Pauza" : "▶ Start"}</button>
        <button onClick={() => { setS(0); setOn(false); clearInterval(r.current); }} style={{ ...bs, background: C.bgAlt, color: C.inkSoft, border: `1.5px solid ${C.border}` }}>↻ Reset</button>
      </div>
    </div>
  );
}
const bs = { padding: "8px 20px", borderRadius: 40, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .25s", fontFamily: "inherit" };
const Stars = ({ n }) => <span style={{ color: C.gold, letterSpacing: 1, fontSize: 14 }}>{"★".repeat(Math.floor(n))}<span style={{ color: C.inkSoft, marginLeft: 6, fontSize: 13, fontWeight: 600 }}>{n}</span></span>;
const inp = { padding: "13px 16px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.bgCard, fontSize: 14, fontFamily: "inherit", color: C.ink, outline: "none", width: "100%", boxSizing: "border-box" };

function TCard({ t, onClick }) {
  return (
    <div className="card" style={{ padding: 24, cursor: "pointer", position: "relative" }} onClick={onClick}>
      {t.badge && <div style={{ position: "absolute", top: 14, right: 14, padding: "3px 10px", borderRadius: 16, fontSize: 11, fontWeight: 700, fontFamily: "'Noto Serif JP',serif", background: C.accentSoft, color: C.accent, border: `1px solid ${C.accent}30` }}>{t.badge}</div>}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        <div style={{ width: 50, height: 50, borderRadius: 14, background: `linear-gradient(135deg,${C.accentSoft},${C.goldSoft})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: C.accent }}>{t.ini}</div>
        <div><h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{t.name}</h3><div style={{ fontSize: 12, color: C.inkMuted }}>{t.subject} · {t.exp}</div></div>
      </div>
      <p style={{ fontSize: 13, color: C.inkSoft, lineHeight: 1.6, marginBottom: 14 }}>{t.bio}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}><Stars n={t.rating} /><span style={{ fontSize: 12, color: C.inkMuted }}>{t.reviews} opinii</span></div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: C.bgAlt, borderRadius: 12, border: `1px solid ${C.borderLight}` }}>
        <div>
          <div style={{ fontSize: 10, color: C.inkMuted, textTransform: "uppercase", letterSpacing: 1 }}>Stawka/min</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.accent, fontFamily: "'DM Mono',monospace" }}>{t.price.toFixed(2)} <span style={{ fontSize: 11, fontWeight: 500, color: C.inkMuted }}>PLN</span></div>
        </div>
        <button className="bm" style={{ padding: "9px 20px", fontSize: 13 }}>Umów się</button>
      </div>
      <div style={{ textAlign: "center", marginTop: 10, fontSize: 12, color: C.inkMuted }}>{t.sessions.toLocaleString()} sesji</div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [mob, setMob] = useState(false);
  const [sq, setSq] = useState("");
  const [sf, setSf] = useState(null);
  const nav = p => { setPage(p); setMob(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const ft = TEACHERS.filter(t => (!sf || t.subject === sf) && (!sq || t.name.toLowerCase().includes(sq.toLowerCase()) || t.subject.toLowerCase().includes(sq.toLowerCase())));

  return (
    <div style={{ fontFamily: "'Outfit',sans-serif", background: C.bg, color: C.ink, minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@400;500&family=Noto+Serif+JP:wght@400;700;900&display=swap" rel="stylesheet" />
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        ::selection{background:${C.accentSoft};color:${C.accent}}
        @keyframes fu{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes sf{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        .fu{animation:fu .6s ease-out both}.fu2{animation:fu .6s ease-out .15s both}
        .card{background:${C.bgCard};border:1px solid ${C.border};border-radius:16px;transition:all .35s cubic-bezier(.23,1,.32,1)}
        .card:hover{transform:translateY(-5px);box-shadow:0 14px 40px rgba(26,26,46,.07);border-color:${C.accent}25}
        .nl{color:${C.inkSoft};text-decoration:none;font-size:14px;font-weight:500;cursor:pointer;transition:color .25s;padding:6px 0;border-bottom:2px solid transparent}
        .nl:hover,.nl.on{color:${C.accent};border-bottom-color:${C.accent}}
        .tag{display:inline-block;padding:5px 14px;border-radius:30px;font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase}
        .chip{padding:9px 18px;border-radius:40px;border:1.5px solid ${C.border};background:${C.bgCard};cursor:pointer;transition:all .25s;font-size:13px;font-weight:500;color:${C.inkSoft};white-space:nowrap;font-family:inherit}
        .chip:hover,.chip.on{border-color:${C.accent};background:${C.accentSoft};color:${C.accent}}
        .bm{background:${C.accent};color:#fff;border:none;padding:15px 34px;border-radius:50px;font-weight:700;font-size:15px;cursor:pointer;transition:all .3s;font-family:inherit;letter-spacing:.3px}
        .bm:hover{transform:translateY(-2px);box-shadow:0 8px 28px ${C.accent}28}
        .bg{background:transparent;color:${C.ink};border:1.5px solid ${C.border};padding:14px 30px;border-radius:50px;font-weight:600;font-size:14px;cursor:pointer;transition:all .3s;font-family:inherit}
        .bg:hover{border-color:${C.accent};color:${C.accent}}
        .jp{font-family:'Noto Serif JP',serif}
        .sec{padding:100px 40px;max-width:1160px;margin:0 auto}
        .dv{height:1px;max-width:180px;margin:0 auto;background:linear-gradient(90deg,transparent,${C.border},transparent)}
        @media(max-width:800px){
          .sec{padding:60px 20px}
          .g2{grid-template-columns:1fr!important}
          .g3{grid-template-columns:1fr!important}
          .g4{grid-template-columns:1fr 1fr!important}
          .hf{flex-direction:column!important;text-align:center!important}
          .hf>div:first-child{align-items:center!important}
          .ht{font-size:34px!important}
          .hm{display:none!important}
          .sm{display:block!important}
          .fg{grid-template-columns:1fr 1fr!important}
          .cr{flex-wrap:wrap!important;justify-content:center!important}
        }
      `}</style>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: `${C.bg}E6`, backdropFilter: "blur(14px)", borderBottom: `1px solid ${C.borderLight}`, padding: "0 40px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 62 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => nav("home")}>
            <div style={{ width: 33, height: 33, borderRadius: 9, background: C.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 900, fontFamily: "'Noto Serif JP',serif" }}>先</div>
            <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: -.3 }}>sensei<span style={{ color: C.accent }}>online</span></span>
          </div>
          <div className="hm" style={{ display: "flex", gap: 26, alignItems: "center" }}>
            {[["Strona główna","home"],["Jak to działa","how"],["Przedmioty","subjects"],["Nauczyciele","teachers"],["Cennik","pricing"],["Dla nauczycieli","for-teachers"]].map(([l,p]) => (
              <span key={p} className={`nl ${page===p?"on":""}`} onClick={() => nav(p)}>{l}</span>
            ))}
          </div>
          <div className="hm" style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button className="bg" style={{ padding: "8px 20px", fontSize: 13 }} onClick={() => nav("login")}>Zaloguj się</button>
            <button className="bm" style={{ padding: "8px 20px", fontSize: 13 }} onClick={() => nav("register")}>Dołącz za darmo</button>
          </div>
          <button className="sm" onClick={() => setMob(!mob)} style={{ display: "none", background: "none", border: "none", fontSize: 22, cursor: "pointer", color: C.ink }}>{mob ? "✕" : "☰"}</button>
        </div>
        {mob && (
          <div style={{ padding: "12px 0 20px", borderTop: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 10 }}>
            {[["Strona główna","home"],["Jak to działa","how"],["Przedmioty","subjects"],["Nauczyciele","teachers"],["Cennik","pricing"],["Dla nauczycieli","for-teachers"]].map(([l,p]) => (
              <span key={p} style={{ padding: "8px 0", fontSize: 15, fontWeight: 500, color: page===p?C.accent:C.inkSoft, cursor: "pointer" }} onClick={() => nav(p)}>{l}</span>
            ))}
            <button className="bm" style={{ marginTop: 8 }} onClick={() => nav("register")}>Dołącz za darmo</button>
          </div>
        )}
      </nav>

      {/* PAGES */}
      {page === "home" && <>
        {/* HERO */}
        <section style={{ padding: "80px 40px 60px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -80, right: -60, width: 380, height: 380, borderRadius: "50%", background: `${C.accent}06`, animation: "sf 10s ease-in-out infinite" }} />
          <div className="hf fu" style={{ maxWidth: 1160, margin: "0 auto", display: "flex", alignItems: "center", gap: 50 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <span className="tag" style={{ background: C.accentSoft, color: C.accent, marginBottom: 18 }}>🎓 Nowa era korepetycji</span>
              <h1 className="ht" style={{ fontSize: 54, fontWeight: 900, lineHeight: 1.08, letterSpacing: -2, marginBottom: 18, position: "relative" }}>
                Znajdź swojego<br />
                <span style={{ color: C.accent }}>nauczyciela</span>
                <span className="jp" style={{ color: C.accent, fontWeight: 900, fontSize: ".28em", opacity: 0.22, marginLeft: 10, verticalAlign: "middle" }}>先生</span><br />
                <span style={{ color: C.inkSoft, fontWeight: 500, fontSize: ".62em" }}>i ucz się minuta po minucie</span>
              </h1>
              <p style={{ fontSize: 17, color: C.inkSoft, lineHeight: 1.75, maxWidth: 450, marginBottom: 30 }}>
                Połącz się z najlepszymi nauczycielami online. Płać <strong style={{ color: C.accent }}>od 1 PLN/min</strong> — bez abonamentów, bez zobowiązań.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button className="bm" onClick={() => nav("subjects")}>Znajdź nauczyciela →</button>
                <button className="bg" onClick={() => nav("for-teachers")}>Zostań Senseim</button>
              </div>
              <div style={{ display: "flex", gap: 36, marginTop: 44, borderTop: `1px solid ${C.border}`, paddingTop: 24, flexWrap: "wrap" }}>
                {[["1 200+","Nauczycieli"],["50 000+","Lekcji"],["4.9 ★","Średnia ocena"]].map(([v,l],i) => (
                  <div key={i}><div style={{ fontSize: 24, fontWeight: 800 }}>{v}</div><div style={{ fontSize: 12, color: C.inkMuted, marginTop: 2 }}>{l}</div></div>
                ))}
              </div>
            </div>
            <div className="fu2 hm" style={{ flex: "0 0 370px" }}>
              <div className="card" style={{ padding: 32, borderRadius: 20 }}>
                <div style={{ textAlign: "center", marginBottom: 6 }}>
                  <span className="jp" style={{ fontSize: 16, color: C.accent, opacity: 0.25 }}>時</span>
                  <div style={{ fontSize: 11, color: C.inkMuted, fontWeight: 500, letterSpacing: 1.5, marginTop: 4, textTransform: "uppercase" }}>Symulacja kosztu lekcji</div>
                </div>
                <div style={{ margin: "20px 0" }}><Timer /></div>
                <div style={{ background: C.bgAlt, borderRadius: 12, padding: 14 }}>
                  {[["15 min","27.00"],["30 min","54.00"],["60 min","108.00"]].map(([t,c],i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.inkSoft, padding: "5px 0", borderBottom: i < 2 ? `1px solid ${C.borderLight}` : "none" }}>
                      <span>{t}</span><span style={{ fontWeight: 600, color: C.accent, fontFamily: "'DM Mono',monospace" }}>{c} PLN</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="dv" />

        {/* HOW IT WORKS MINI */}
        <section className="sec">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="tag" style={{ background: C.indigoSoft, color: C.indigo }}>Jak to działa</span>
            <h2 style={{ fontSize: 36, fontWeight: 800, marginTop: 12, letterSpacing: -1 }}>Prosto i <span style={{ color: C.accent }}>szybko</span><span className="jp" style={{ fontSize: 14, color: C.accent, opacity: 0.2, marginLeft: 10, fontWeight: 400 }}>一二三</span></h2>
          </div>
          <div className="g4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
            {[["一","🔍","Wybierz przedmiot","Porównaj profile, oceny i stawki"],["二","📅","Zarezerwuj lekcję","Wybierz termin lub połącz się teraz"],["三","🎥","Ucz się online","Wideo, tablica, czat w przeglądarce"],["四","⏱️","Zapłać za minuty","Tylko za realny czas nauki"]].map(([jp,ic,t,d],i) => (
              <div key={i} className="card" style={{ padding: 26, textAlign: "center", cursor: "pointer" }} onClick={() => nav("how")}>
                <div style={{ fontSize: 28, marginBottom: 8, position: "relative" }}>{ic}<span className="jp" style={{ position: "absolute", bottom: -4, right: "calc(50% - 28px)", fontSize: 10, color: C.accent, opacity: 0.2 }}>{jp}</span></div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{t}</h3>
                <p style={{ fontSize: 13, color: C.inkMuted, lineHeight: 1.5 }}>{d}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 28 }}><button className="bg" onClick={() => nav("how")}>Dowiedz się więcej →</button></div>
        </section>
        <div className="dv" />

        {/* TOP TEACHERS */}
        <section className="sec">
          <div style={{ textAlign: "center", marginBottom: 42 }}>
            <span className="tag" style={{ background: C.goldSoft, color: C.gold }}>Sensei</span>
            <h2 style={{ fontSize: 36, fontWeight: 800, marginTop: 12, letterSpacing: -1 }}>Najlepsi <span style={{ color: C.accent }}>nauczyciele</span></h2>
          </div>
          <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
            {TEACHERS.slice(0, 3).map((t, i) => <TCard key={i} t={t} onClick={() => nav("teachers")} />)}
          </div>
          <div style={{ textAlign: "center", marginTop: 28 }}><button className="bm" onClick={() => nav("teachers")}>Zobacz wszystkich →</button></div>
        </section>
        <div className="dv" />

        {/* REVIEWS */}
        <section style={{ background: C.bgAlt, padding: "80px 40px", borderTop: `1px solid ${C.borderLight}`, borderBottom: `1px solid ${C.borderLight}` }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 42 }}>
              <span className="tag" style={{ background: C.accentSoft, color: C.accent }}>Opinie</span>
              <h2 style={{ fontSize: 36, fontWeight: 800, marginTop: 12, letterSpacing: -1 }}>Co mówią <span style={{ color: C.accent }}>uczniowie</span></h2>
            </div>
            <div className="g2" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 18 }}>
              {REVIEWS.map((r, i) => (
                <div key={i} className="card" style={{ padding: 26 }}>
                  <Stars n={r.rating} />
                  <p style={{ fontSize: 14, color: C.inkSoft, lineHeight: 1.75, margin: "12px 0 16px", fontStyle: "italic" }}>"{r.text}"</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: C.accent }}>{r.name[0]}</div>
                    <div><div style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</div><div style={{ fontSize: 12, color: C.inkMuted }}>{r.role}</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="sec" style={{ textAlign: "center" }}>
          <span className="jp" style={{ fontSize: 44, color: C.accent, opacity: .12 }}>道</span>
          <h2 style={{ fontSize: 40, fontWeight: 900, letterSpacing: -1.5, marginTop: 6 }}>Gotowy na pierwszą lekcję?</h2>
          <p style={{ color: C.inkSoft, fontSize: 16, lineHeight: 1.7, marginTop: 10, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
            Pierwsza lekcja do 15 minut — <strong style={{ color: C.accent }}>za darmo</strong>. Bez karty kredytowej.
          </p>
          <button className="bm" style={{ fontSize: 16, padding: "16px 38px", marginTop: 24 }} onClick={() => nav("register")}>Zacznij naukę za darmo →</button>
        </section>
      </>}

      {/* HOW */}
      {page === "how" && (
        <section className="sec fu">
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <span className="tag" style={{ background: C.indigoSoft, color: C.indigo }}>Jak to działa</span>
            <h1 style={{ fontSize: 40, fontWeight: 900, marginTop: 12, letterSpacing: -1.5 }}>Jak to <span style={{ color: C.accent }}>działa</span><span className="jp" style={{ fontSize: 16, color: C.accent, opacity: 0.2, marginLeft: 10, fontWeight: 400 }}>道</span></h1>
          </div>
          <div style={{ maxWidth: 660, margin: "0 auto" }}>
            {[["一","🔍","Wybierz przedmiot i nauczyciela","Przeglądaj profile, doświadczenie, oceny i stawki. Każdy nauczyciel ma zweryfikowany profil i opinie."],["二","📅","Zarezerwuj lub połącz się teraz","Zaplanuj lekcję lub użyj 'Połącz teraz' — system znajdzie nauczyciela w 30 sekund."],["三","🎥","Ucz się w przeglądarce","Wideo HD, interaktywna tablica, czat, udostępnianie ekranu. Nic nie instalujesz."],["四","⏱️","Zapłać za minuty","Licznik startuje z lekcją i kończy gdy ją zakończysz. Środki pobierane po sesji."],["五","⭐","Oceń i wróć","Oceń nauczyciela, zostaw opinię. Twoja historia, notatki i postępy zapisane w panelu."]].map(([jp,ic,t,d],i) => (
              <div key={i} style={{ display: "flex", gap: 20, marginBottom: 28, alignItems: "flex-start" }}>
                <div style={{ flex: "0 0 52px", height: 52, borderRadius: 14, background: i === 0 ? C.accent : C.bgAlt, color: i === 0 ? "#fff" : C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, border: `1.5px solid ${i === 0 ? C.accent : C.border}`, position: "relative", flexDirection: "column", gap: 0 }}>{i + 1}<span className="jp" style={{ fontSize: 8, opacity: 0.35, fontWeight: 400, lineHeight: 1 }}>{jp}</span></div>
                <div><div style={{ fontSize: 22, marginBottom: 4 }}>{ic}</div><h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{t}</h3><p style={{ fontSize: 14, color: C.inkSoft, lineHeight: 1.7 }}>{d}</p></div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 32 }}><button className="bm" onClick={() => nav("register")}>Zacznij teraz — za darmo →</button></div>
        </section>
      )}

      {/* SUBJECTS */}
      {page === "subjects" && (
        <section className="sec fu">
          <div style={{ textAlign: "center", marginBottom: 42 }}>
            <span className="tag" style={{ background: C.goldSoft, color: C.gold }}>Przedmioty</span>
            <h1 style={{ fontSize: 40, fontWeight: 900, marginTop: 12, letterSpacing: -1.5 }}>Znajdź swojego <span style={{ color: C.accent }}>nauczyciela</span></h1>
          </div>
          <div className="g2" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
            {SUBJECTS.map((s, i) => (
              <div key={i} className="card" style={{ padding: 26, cursor: "pointer" }} onClick={() => { setSf(s.name); nav("teachers"); }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div><div style={{ fontSize: 34, marginBottom: 8 }}>{s.icon}</div><h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 3 }}>{s.name}</h3><p style={{ fontSize: 13, color: C.inkMuted }}>{s.desc}</p></div>
                  <div style={{ textAlign: "right" }}><div style={{ fontSize: 13, color: C.inkMuted }}>{s.teachers} nauczycieli</div><div style={{ fontSize: 15, fontWeight: 700, color: C.accent, fontFamily: "'DM Mono',monospace", marginTop: 4 }}>{s.price}</div><div style={{ fontSize: 11, color: C.inkMuted }}>PLN/min</div></div>
                </div>
                <div style={{ marginTop: 10, fontSize: 13, color: C.accent, fontWeight: 600 }}>Zobacz nauczycieli →</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TEACHERS */}
      {page === "teachers" && (
        <section className="sec fu">
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <span className="tag" style={{ background: C.goldSoft, color: C.gold }}>Nauczyciele</span>
            <h1 style={{ fontSize: 40, fontWeight: 900, marginTop: 12, letterSpacing: -1.5 }}>Nasi <span style={{ color: C.accent }}>nauczyciele</span></h1>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.bgCard, border: `1.5px solid ${C.border}`, borderRadius: 50, padding: "10px 18px", width: "100%", maxWidth: 420 }}>
              <span>🔍</span>
              <input type="text" placeholder="Szukaj nauczyciela lub przedmiotu..." value={sq} onChange={e => setSq(e.target.value)} style={{ border: "none", outline: "none", background: "transparent", fontSize: 14, width: "100%", fontFamily: "inherit", color: C.ink }} />
            </div>
          </div>
          <div className="cr" style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 28, flexWrap: "nowrap", overflowX: "auto" }}>
            <button className={`chip ${!sf ? "on" : ""}`} onClick={() => setSf(null)}>Wszystkie</button>
            {SUBJECTS.map(s => <button key={s.name} className={`chip ${sf === s.name ? "on" : ""}`} onClick={() => setSf(sf === s.name ? null : s.name)}>{s.icon} {s.name}</button>)}
          </div>
          <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
            {ft.map((t, i) => <TCard key={i} t={t} />)}
          </div>
          {ft.length === 0 && <div style={{ textAlign: "center", padding: 40, color: C.inkMuted }}>Brak wyników. Spróbuj zmienić filtry.</div>}
        </section>
      )}

      {/* PRICING */}
      {page === "pricing" && (
        <section className="sec fu">
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <span className="tag" style={{ background: C.accentSoft, color: C.accent }}>Cennik</span>
            <h1 style={{ fontSize: 40, fontWeight: 900, marginTop: 12, letterSpacing: -1.5 }}>Płać za <span style={{ color: C.accent }}>minuty</span>, nie za godziny</h1>
            <p style={{ color: C.inkSoft, marginTop: 8, fontSize: 15, maxWidth: 480, margin: "8px auto 0" }}>Zero abonamentów. Stawka nauczyciela × czas = Twój koszt.</p>
          </div>
          <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginBottom: 40 }}>
            {[["⚡","Szybka pomoc","5–15 min","Jedno pytanie","7.50–37.50 PLN",false],["📚","Standardowa","30–45 min","Pełna lekcja","45.00–112.50 PLN",true],["🎯","Intensywna","60–90 min","Przygotowanie do egzaminu","90.00–225.00 PLN",false]].map(([ic,n,m,d,ex,best],i) => (
              <div key={i} className="card" style={{ padding: 30, textAlign: "center", position: "relative", border: best ? `2px solid ${C.accent}` : undefined }}>
                {best && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: C.accent, color: "#fff", padding: "4px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>POPULARNE</div>}
                <div style={{ fontSize: 34, marginBottom: 10 }}>{ic}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{n}</h3>
                <div style={{ fontSize: 26, fontWeight: 800, color: C.accent, fontFamily: "'DM Mono',monospace", margin: "10px 0" }}>{m}</div>
                <p style={{ fontSize: 13, color: C.inkMuted, marginBottom: 10 }}>{d}</p>
                <div style={{ background: C.bgAlt, borderRadius: 10, padding: "8px 14px", fontSize: 13, color: C.inkSoft }}>Koszt: <strong style={{ color: C.ink }}>{ex}</strong></div>
              </div>
            ))}
          </div>
          <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
            {[["🛡️","Bezpieczeństwo","Stripe & BLIK. Środki blokowane po rozpoczęciu lekcji."],["🔄","Zwroty","Pełny zwrot za lekcje krótsze niż 5 minut."],["👨‍👩‍👧","Panel rodziców","Kontrola wydatków i postępów w jednym miejscu."]].map(([ic,t,d],i) => (
              <div key={i} className="card" style={{ padding: 22 }}>
                <div style={{ fontSize: 26, marginBottom: 8 }}>{ic}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{t}</h3>
                <p style={{ fontSize: 13, color: C.inkMuted, lineHeight: 1.6 }}>{d}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 32 }}><button className="bm" onClick={() => nav("register")}>Pierwsza lekcja za darmo →</button></div>
        </section>
      )}

      {/* FOR TEACHERS */}
      {page === "for-teachers" && (
        <section className="sec fu">
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <span className="tag" style={{ background: C.goldSoft, color: C.gold }}>Dla nauczycieli</span>
            <h1 style={{ fontSize: 40, fontWeight: 900, marginTop: 12, letterSpacing: -1.5 }}>Zostań <span style={{ color: C.accent }}>nauczycielem</span> na senseionline</h1>
          </div>
          <div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, alignItems: "start" }}>
            <div>
              {[["80%","przychodów do Ciebie","Najniższa prowizja na rynku."],["0 PLN","za rejestrację","Zacznij zarabiać od pierwszej lekcji."],["48h","wypłata","Szybkie przelewy. Stripe Connect."],["100%","kontroli","Ty ustalasz stawkę i grafik."]].map(([v,l,d],i) => (
                <div key={i} className="card" style={{ padding: 22, marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 26, fontWeight: 900, color: C.accent, fontFamily: "'DM Mono',monospace" }}>{v}</span>
                    <span style={{ fontSize: 15, fontWeight: 600 }}>{l}</span>
                  </div>
                  <p style={{ fontSize: 13, color: C.inkMuted }}>{d}</p>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding: 30 }}>
              <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 18 }}>💰 Kalkulator zarobków</h3>
              <div style={{ fontSize: 13, color: C.inkMuted }}>Stawka: 2.00 PLN/min · 3h/dzień · 22 dni</div>
              <div style={{ background: C.bgAlt, borderRadius: 14, padding: 24, textAlign: "center", marginTop: 16, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 11, color: C.inkMuted, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>Zarobek / miesiąc</div>
                <div style={{ fontSize: 44, fontWeight: 900, fontFamily: "'DM Mono',monospace", color: C.accent }}>6 336 PLN</div>
                <div style={{ fontSize: 12, color: C.inkMuted, marginTop: 4 }}>netto, po prowizji (20%)</div>
              </div>
              <button className="bm" style={{ width: "100%", marginTop: 20 }} onClick={() => nav("register")}>Dołącz jako Sensei →</button>
            </div>
          </div>
        </section>
      )}

      {/* AUTH */}
      {(page === "login" || page === "register") && (() => {
        const [tab, setTab] = [page, (v) => nav(v)];
        return (
          <section className="sec fu" style={{ display: "flex", justifyContent: "center", minHeight: "65vh", alignItems: "center" }}>
            <div className="card" style={{ padding: 40, width: "100%", maxWidth: 420, borderRadius: 22 }}>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <span className="jp" style={{ fontSize: 20, color: C.accent, opacity: 0.2 }}>門</span>
                <h2 style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>{page === "login" ? "Witaj ponownie" : "Dołącz do Sensei"}</h2>
                <p style={{ fontSize: 13, color: C.inkMuted, marginTop: 4 }}>{page === "login" ? "Zaloguj się na konto" : "Stwórz konto za darmo"}</p>
              </div>
              <div style={{ display: "flex", background: C.bgAlt, borderRadius: 10, padding: 3, marginBottom: 20 }}>
                {[["login","Logowanie"],["register","Rejestracja"]].map(([v,l]) => (
                  <button key={v} onClick={() => nav(v)} style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "none", background: page === v ? C.bgCard : "transparent", color: page === v ? C.ink : C.inkMuted, fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit", boxShadow: page === v ? "0 2px 6px rgba(0,0,0,.05)" : "none", transition: "all .25s" }}>{l}</button>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {page === "register" && <input type="text" placeholder="Imię i nazwisko" style={inp} />}
                <input type="email" placeholder="Adres e-mail" style={inp} />
                <input type="password" placeholder="Hasło" style={inp} />
              </div>
              <button className="bm" style={{ width: "100%", marginTop: 18 }}>{page === "login" ? "Zaloguj się" : "Stwórz konto"}</button>
              {page === "login" && <div style={{ textAlign: "center", marginTop: 12, fontSize: 13, color: C.accent, cursor: "pointer" }}>Zapomniałeś hasła?</div>}
              <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
                <button style={{ width: "100%", padding: 11, borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.bgCard, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", color: C.ink }}>G  Kontynuuj z Google</button>
              </div>
            </div>
          </section>
        );
      })()}

      {/* FOOTER */}
      <footer style={{ background: C.bgAlt, borderTop: `1px solid ${C.border}`, padding: "52px 40px 24px" }}>
        <div className="fg" style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 32, marginBottom: 32 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, cursor: "pointer" }} onClick={() => nav("home")}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: C.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, fontFamily: "'Noto Serif JP',serif" }}>先</div>
              <span style={{ fontSize: 16, fontWeight: 700 }}>sensei<span style={{ color: C.accent }}>online</span></span>
            </div>
            <p style={{ fontSize: 13, color: C.inkMuted, lineHeight: 1.7, maxWidth: 260 }}>先生 (Sensei) — nauczyciel, mistrz. Łączymy uczniów z najlepszymi nauczycielami. Płatność za minutę.</p>
          </div>
          {[
            ["Platforma",[["Jak to działa","how"],["Przedmioty","subjects"],["Cennik","pricing"],["Nauczyciele","teachers"]]],
            ["Dla nauczycieli",[["Dołącz","for-teachers"],["Zarobki","for-teachers"],["Zasady","home"]]],
            ["Firma",[["O nas","home"],["Kontakt","home"],["Regulamin","home"],["Polityka prywatności","home"]]],
          ].map(([title,links],i) => (
            <div key={i}>
              <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: C.inkSoft }}>{title}</h4>
              {links.map(([l,p],j) => <span key={j} onClick={() => nav(p)} style={{ display: "block", color: C.inkMuted, fontSize: 13, marginBottom: 8, cursor: "pointer", transition: "color .2s" }} onMouseEnter={e => e.target.style.color = C.accent} onMouseLeave={e => e.target.style.color = C.inkMuted}>{l}</span>)}
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, maxWidth: 1160, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 12, color: C.inkMuted }}>© 2026 senseionline.pl</span>
          <span style={{ fontSize: 12, color: C.inkMuted }}>🇵🇱 Polska · RODO ✓ · Stripe ✓ · BLIK ✓</span>
        </div>
      </footer>
    </div>
  );
}