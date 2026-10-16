/* Schulwahl Brixen – Test und Passungsberechnung
   Modell: Interessen nach Holland (RIASEC) + Wunsch-Stundenplan + Lernstil + Studienwunsch
   + besondere Voraussetzungen (Aufnahmeprüfung, Unterrichtssprache, Latein …).
   Läuft komplett im Browser, nichts wird gespeichert oder gesendet. */
(function (root) {
  const RI = ["R", "I", "A", "S", "E", "C"];
  const RI_INFO = {
    R: { name: "Praktisch-technisch", short: "Praktisch", desc: "anpacken, bauen, reparieren, mit Werkzeug und Material arbeiten" },
    I: { name: "Forschend", short: "Forschend", desc: "verstehen wollen, tüfteln, analysieren, Fragen auf den Grund gehen" },
    A: { name: "Künstlerisch-kreativ", short: "Kreativ", desc: "gestalten, schreiben, Musik, sich ausdrücken, Neues erfinden" },
    S: { name: "Sozial", short: "Sozial", desc: "mit Menschen arbeiten, helfen, erklären, zuhören" },
    E: { name: "Unternehmerisch", short: "Unternehmerisch", desc: "organisieren, überzeugen, verhandeln, Verantwortung übernehmen" },
    C: { name: "Ordnend", short: "Ordnend", desc: "planen, strukturieren, genau arbeiten, Zahlen und Daten im Griff haben" }
  };
  const BUCKETS = ["SPR", "MAT", "NAT", "TEC", "WIR", "GES", "KRE", "PRX"];
  const BUCKET_INFO = {
    SPR: "Sprachen", MAT: "Mathe", NAT: "Natur & Labor", TEC: "Technik & Computer",
    WIR: "Wirtschaft & Recht", GES: "Mensch & Gesellschaft", KRE: "Kunst, Musik & Medien", PRX: "Werkstatt & Praxis"
  };
  const SIG_MAX = { GAS: 2, MUS: 1, WRI: 1.5, LAT: 1.3, MED: 1.5, IT: 1, EN: 1, BEA: 1.4 };

  // ---------------- Fragen (14, in 8 verschiedenen Formaten) ----------------
  const QUESTIONS = [
    {
      id: "nachmittag", type: "pick", max: 2, min: 2,
      title: "Ein freier Nachmittag, kein Plan. Was machst du am liebsten?",
      hint: "Wähle zwei.",
      options: [
        { label: "Etwas reparieren oder bauen", sub: "Fahrrad, Möbel, Lego Technic", ri: { R: 2 }, subj: { PRX: 1, TEC: 0.5 } },
        { label: "Dokus schauen, Rätseln auf den Grund gehen", ri: { I: 2 }, subj: { NAT: 0.6 } },
        { label: "Zeichnen, fotografieren, Videos schneiden", ri: { A: 2 }, subj: { KRE: 1 } },
        { label: "Mit Freund:innen reden, jemandem helfen", ri: { S: 2 }, subj: { GES: 0.6 } },
        { label: "Etwas organisieren oder verkaufen", sub: "Event, Flohmarkt, Vinted", ri: { E: 2 }, subj: { WIR: 0.6 } },
        { label: "Zimmer ordnen, Listen und Pläne machen", ri: { C: 2 } },
        { label: "Kochen oder backen", ri: { R: 1, A: 1 }, sig: { GAS: 1 } },
        { label: "Musik machen oder singen", ri: { A: 1.5, S: 0.5 }, subj: { KRE: 0.8 } },
        { label: "Programmieren oder Spiele modden", ri: { I: 1, R: 1 }, subj: { TEC: 1 } },
        { label: "Serien oder Bücher in einer anderen Sprache", ri: { A: 0.7, S: 0.5 }, subj: { SPR: 1 } }
      ]
    },
    {
      id: "schulfest", type: "single",
      title: "Eure Klasse organisiert das Schulfest. Welche Aufgabe schnappst du dir?",
      options: [
        { label: "Bühne, Technik und Licht aufbauen", ri: { R: 2 }, subj: { TEC: 0.5, PRX: 0.5 } },
        { label: "Umfrage machen, was sich alle wünschen, und auswerten", ri: { I: 1.5, C: 0.5 }, subj: { MAT: 0.4 } },
        { label: "Plakate, Deko und Social-Media-Posts gestalten", ri: { A: 2 }, subj: { KRE: 0.6 } },
        { label: "Gäste begrüßen und schauen, dass sich alle wohlfühlen", ri: { S: 2 } },
        { label: "Sponsoren anfragen und das Budget verhandeln", ri: { E: 2 }, subj: { WIR: 0.5 } },
        { label: "Kasse, Zeitplan und Einkaufsliste führen", ri: { C: 2 } },
        { label: "Das Buffet kochen", ri: { R: 1, S: 0.5 }, sig: { GAS: 1 } }
      ]
    },
    {
      id: "stundenplan", type: "budget", points: 12,
      title: "Bau dir deinen Stundenplan: Du darfst 12 Extra-Stunden pro Woche verteilen.",
      hint: "Tippe auf + und −. Alle 12 Stunden müssen verteilt sein.",
      buckets: [
        { key: "SPR", label: "Sprachen", ri: { S: 0.3, A: 0.3 } },
        { key: "MAT", label: "Mathe", ri: { I: 0.4, C: 0.3 } },
        { key: "NAT", label: "Natur & Labor", sub: "Biologie, Chemie, Physik", ri: { I: 0.6, R: 0.1 } },
        { key: "TEC", label: "Technik & Computer", ri: { R: 0.4, I: 0.3 } },
        { key: "WIR", label: "Wirtschaft & Recht", ri: { E: 0.5, C: 0.3 } },
        { key: "GES", label: "Mensch & Gesellschaft", sub: "Psychologie, Geschichte, Philosophie", ri: { S: 0.5, I: 0.2 } },
        { key: "KRE", label: "Kunst, Musik & Medien", ri: { A: 0.7 } },
        { key: "PRX", label: "Werkstatt & Praxis", sub: "Küche, Werkstatt, Übungsfirma", ri: { R: 0.7 } }
      ]
    },
    {
      id: "lernstil", type: "slider", target: "PRA",
      title: "Wie lernst du am besten?",
      left: "Erst verstehen, dann anwenden", right: "Ausprobieren und dabei lernen"
    },
    {
      id: "duelle", type: "duel",
      title: "Schnell entscheiden, nicht lang nachdenken.",
      pairs: [
        { a: { label: "Labor", ri: { I: 1 }, subj: { NAT: 0.4 } }, b: { label: "Bühne", ri: { A: 0.7, S: 0.3 }, subj: { KRE: 0.4 } } },
        { a: { label: "Tabelle", ri: { C: 1 }, subj: { MAT: 0.3 } }, b: { label: "Reel", ri: { A: 1 }, subj: { KRE: 0.3 } } },
        { a: { label: "Werkbank", ri: { R: 1 }, subj: { PRX: 0.4 } }, b: { label: "Debatte", ri: { E: 0.6, S: 0.4 }, subj: { GES: 0.3 } } },
        { a: { label: "Allein tüfteln", ri: { I: 1 } }, b: { label: "Im Team planen", ri: { S: 0.5, E: 0.5 } } },
        { a: { label: "Zahlenrätsel", ri: { I: 0.5, C: 0.5 }, subj: { MAT: 0.5 } }, b: { label: "Wortspiel", ri: { A: 0.6, S: 0.2 }, subj: { SPR: 0.5 } } }
      ]
    },
    {
      id: "faecher", type: "rank",
      title: "Ordne diese Fächer – vom Lieblingsfach bis „muss halt sein“.",
      hint: "Tippe die Fächer der Reihe nach an. Nochmal tippen nimmt sie zurück.",
      options: [
        { label: "Deutsch", subj: { SPR: 0.7 }, ri: { A: 0.4 } },
        { label: "Italienisch", subj: { SPR: 0.7 }, ri: { S: 0.3 }, sig: { IT: 0.3 } },
        { label: "Englisch", subj: { SPR: 0.7 }, ri: { S: 0.2 }, sig: { EN: 0.3 } },
        { label: "Mathe", subj: { MAT: 1 }, ri: { I: 0.4, C: 0.4 } },
        { label: "Naturkunde", subj: { NAT: 1 }, ri: { I: 0.6 } },
        { label: "Geschichte", subj: { GES: 1 }, ri: { I: 0.3, S: 0.3 }, sig: { LAT: 0.3 } },
        { label: "Kunst", subj: { KRE: 1 }, ri: { A: 0.7 } },
        { label: "Technik", subj: { TEC: 0.8, PRX: 0.3 }, ri: { R: 0.7 } }
      ]
    },
    {
      id: "stolz", type: "single",
      title: "Wann bist du so richtig stolz auf dich?",
      options: [
        { label: "Wenn etwas, das ich gebaut habe, funktioniert", ri: { R: 2 } },
        { label: "Wenn ich etwas Schwieriges endlich verstanden habe", ri: { I: 2 } },
        { label: "Wenn andere mein Werk schön oder originell finden", ri: { A: 2 } },
        { label: "Wenn ich jemandem wirklich helfen konnte", ri: { S: 2 } },
        { label: "Wenn ich andere von meiner Idee überzeugt habe", ri: { E: 2 } },
        { label: "Wenn alles fehlerfrei und pünktlich erledigt ist", ri: { C: 2 } }
      ]
    },
    {
      id: "zukunft", type: "pick", max: 3, min: 1,
      title: "Postkarte aus der Zukunft: Wo arbeitest du in zehn Jahren?",
      hint: "Wähle bis zu drei Orte.",
      options: [
        { label: "Labor oder Klinik", ri: { I: 1.2, S: 0.4 }, subj: { NAT: 0.8 }, sig: { MED: 0.8 } },
        { label: "Werkstatt oder Baustelle", ri: { R: 1.5 }, subj: { PRX: 0.8 } },
        { label: "Büro mit Blick auf die Berge", ri: { C: 1, E: 0.5 }, subj: { WIR: 0.6 } },
        { label: "Hotel, Restaurant oder Küche", ri: { S: 0.7, E: 0.5, R: 0.4 }, sig: { GAS: 1 } },
        { label: "Studio, Atelier oder Bühne", ri: { A: 1.5 }, subj: { KRE: 0.8 } },
        { label: "Klassenzimmer oder Beratungsstelle", ri: { S: 1.5 }, subj: { GES: 0.6 } },
        { label: "Im Ausland oder bei einer internationalen Firma", ri: { E: 0.8, S: 0.4 }, subj: { SPR: 0.6 }, sig: { EN: 0.3 } },
        { label: "Mein eigenes Start-up", ri: { E: 1.5 }, subj: { WIR: 0.4, TEC: 0.3 } },
        { label: "Redaktion oder Werbeagentur", ri: { A: 1, E: 0.5 }, subj: { KRE: 0.4, SPR: 0.3 }, sig: { WRI: 0.7 } },
        { label: "Salon, Spa oder Wellnesshotel", ri: { S: 0.8, A: 0.6, R: 0.4 }, subj: { PRX: 0.6 }, sig: { BEA: 1 } },
        { label: "Software-Firma", ri: { I: 1, R: 0.5 }, subj: { TEC: 0.8 } }
      ]
    },
    {
      id: "aussagen", type: "likert",
      title: "Wie sehr trifft das auf dich zu?",
      scale: ["gar nicht", "eher nicht", "teils", "eher schon", "total"],
      items: [
        { label: "Ich lerne gern Vokabeln und knoble an Grammatik.", subj: { SPR: 0.6 }, sig: { LAT: 1 } },
        { label: "Ich schreibe gern – Geschichten, Texte, Posts.", ri: { A: 0.8 }, subj: { SPR: 0.3 }, sig: { WRI: 1 } },
        { label: "Ich will wissen, warum Menschen so handeln, wie sie handeln.", ri: { S: 0.6, I: 0.4 }, subj: { GES: 0.8 } },
        { label: "Ich mag es, wenn Zahlen am Ende genau aufgehen.", ri: { C: 0.7, I: 0.3 }, subj: { MAT: 0.8 } }
      ]
    },
    {
      id: "musik", type: "single",
      title: "Musik: Wo stehst du gerade?",
      options: [
        { label: "Musik hören reicht mir völlig", sig: { MUS: 0 } },
        { label: "Ich spiele oder singe ein bisschen", ri: { A: 0.5 }, sig: { MUS: 0.5 } },
        { label: "Ich spiele ein Instrument oder singe seit Jahren regelmäßig", ri: { A: 1 }, subj: { KRE: 0.6 }, sig: { MUS: 1 } }
      ]
    },
    {
      id: "geraet", type: "single",
      title: "Dein Kopfhörer geht kaputt. Was machst du?",
      options: [
        { label: "Aufschrauben und selbst nachschauen", ri: { R: 2 } },
        { label: "Recherchieren, warum genau er kaputt ist", ri: { I: 2 } },
        { label: "Daraus etwas Neues basteln", ri: { A: 2 } },
        { label: "Jemanden fragen und es gemeinsam lösen", ri: { S: 2 } },
        { label: "Verkaufen und einen besseren besorgen", ri: { E: 2 } },
        { label: "Garantie prüfen und den Kassenzettel raussuchen", ri: { C: 2 } }
      ]
    },
    {
      id: "sprachen", type: "sliders",
      title: "Stell dir vor, der ganze Unterricht wäre in einer anderen Sprache.",
      hint: "Wie fühlt sich das an?",
      sliders: [
        { sig: "IT", label: "Alles auf Italienisch", left: "lieber nicht", right: "kein Problem" },
        { sig: "EN", label: "Alles auf Englisch", left: "lieber nicht", right: "kein Problem" }
      ]
    },
    {
      id: "danach", type: "slider", target: "ACA",
      title: "Nach der Schule …",
      left: "will ich bald arbeiten und eigenes Geld verdienen", right: "will ich auf jeden Fall studieren"
    },
    {
      id: "themen", type: "pick", max: 2, min: 2,
      title: "Welche Themen würdest du freiwillig googeln?",
      hint: "Wähle zwei.",
      options: [
        { label: "Körper und Medizin", ri: { I: 0.8, S: 0.5 }, subj: { NAT: 0.6 }, sig: { MED: 1 } },
        { label: "Weltall und Physik", ri: { I: 1.2 }, subj: { NAT: 0.5, MAT: 0.4 } },
        { label: "Psychologie und Beziehungen", ri: { S: 1.2 }, subj: { GES: 0.8 } },
        { label: "Geld, Börse und Firmen", ri: { E: 0.8, C: 0.4 }, subj: { WIR: 0.8 } },
        { label: "Design, Mode und Beauty", ri: { A: 1.2 }, subj: { KRE: 0.6 }, sig: { BEA: 0.6 } },
        { label: "Reisen und andere Kulturen", ri: { S: 0.6, E: 0.4 }, subj: { SPR: 0.6, GES: 0.3 } },
        { label: "Geschichte und Mythen", ri: { I: 0.6, A: 0.4 }, subj: { GES: 0.7 }, sig: { LAT: 0.4 } },
        { label: "Code und künstliche Intelligenz", ri: { I: 0.8, R: 0.4 }, subj: { TEC: 0.8 } },
        { label: "Rezepte und Food-Trends", ri: { R: 0.6, A: 0.5 }, sig: { GAS: 0.8 } },
        { label: "Klima und Umwelt", ri: { I: 0.8, R: 0.3 }, subj: { NAT: 0.6 } }
      ]
    }
  ];

  // ---------------- Hilfsfunktionen ----------------
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function pearson(a, b) {
    const n = a.length;
    const ma = a.reduce((s, x) => s + x, 0) / n, mb = b.reduce((s, x) => s + x, 0) / n;
    let cov = 0, va = 0, vb = 0;
    for (let i = 0; i < n; i++) { cov += (a[i] - ma) * (b[i] - mb); va += (a[i] - ma) ** 2; vb += (b[i] - mb) ** 2; }
    if (va < 1e-9 || vb < 1e-9) return 0;
    return cov / Math.sqrt(va * vb);
  }
  function cosine(a, b) {
    let d = 0, na = 0, nb = 0;
    for (let i = 0; i < a.length; i++) { d += a[i] * b[i]; na += a[i] ** 2; nb += b[i] ** 2; }
    if (na < 1e-9 || nb < 1e-9) return 0;
    return d / Math.sqrt(na * nb);
  }
  function add(target, loads, w) {
    if (!loads) return;
    for (const k in loads) target[k] = (target[k] || 0) + loads[k] * w;
  }

  // ---------------- Antworten → Profil ----------------
  function emptyProfile() {
    const ri = {}; RI.forEach(k => ri[k] = 0);
    const subj = {}; BUCKETS.forEach(k => subj[k] = 0);
    return { ri, subj, sigRaw: {}, PRA: 0.5, ACA: 0.5 };
  }

  function buildProfile(answers) {
    const p = emptyProfile();
    QUESTIONS.forEach(q => {
      const a = answers[q.id];
      if (a === undefined || a === null) return;
      if (q.type === "pick" || q.type === "single") {
        const idx = q.type === "single" ? [a] : a;
        idx.forEach(i => { const o = q.options[i]; add(p.ri, o.ri, 1); add(p.subj, o.subj, 1); add(p.sigRaw, o.sig, 1); });
      } else if (q.type === "budget") {
        q.buckets.forEach(b => {
          const v = a[b.key] || 0;
          p.subj[b.key] += v * 0.35;
          add(p.ri, b.ri, v * 0.35);
        });
      } else if (q.type === "slider") {
        p[q.target] = clamp(a / 100, 0, 1);
      } else if (q.type === "sliders") {
        q.sliders.forEach((s, i) => { p.sigRaw[s.sig] = (p.sigRaw[s.sig] || 0) + (a[i] ?? 50) / 100; });
      } else if (q.type === "duel") {
        q.pairs.forEach((pair, i) => { const side = a[i] === 0 ? pair.a : a[i] === 1 ? pair.b : null; if (side) { add(p.ri, side.ri, 1); add(p.subj, side.subj, 1); } });
      } else if (q.type === "rank") {
        const n = q.options.length;
        a.forEach((optIdx, pos) => {
          const w = (n - 1 - pos) / (n - 1); // Platz 1 = 1, letzter = 0
          const o = q.options[optIdx];
          add(p.ri, o.ri, w); add(p.subj, o.subj, w * 1.2); add(p.sigRaw, o.sig, w);
        });
      } else if (q.type === "likert") {
        q.items.forEach((it, i) => {
          const v = a[i]; if (v === undefined) return;
          const centered = (v - 2) / 2; // −1 … +1
          const pos = v / 4;            // 0 … 1
          add(p.ri, it.ri, centered);
          add(p.subj, it.subj, pos);
          add(p.sigRaw, it.sig, pos);
        });
      }
    });
    // Signale normalisieren
    const sig = {};
    Object.keys(SIG_MAX).forEach(k => sig[k] = clamp((p.sigRaw[k] || 0) / SIG_MAX[k], 0, 1));
    if (answers.sprachen) { sig.IT = clamp(answers.sprachen[0] / 100 * 0.85 + (p.sigRaw.IT - answers.sprachen[0] / 100) * 0.5, 0, 1); sig.EN = clamp(answers.sprachen[1] / 100 * 0.85 + (p.sigRaw.EN - answers.sprachen[1] / 100) * 0.5, 0, 1); }
    RI.forEach(k => p.ri[k] = Math.max(0, p.ri[k]));
    BUCKETS.forEach(k => p.subj[k] = Math.max(0, p.subj[k]));
    p.sig = sig;
    return p;
  }

  // ---------------- Profile der Bildungswege ----------------
  function wayShares(w) {
    const tot = BUCKETS.reduce((s, k) => s + (w.hours[k] || 0), 0);
    const sh = {}; BUCKETS.forEach(k => sh[k] = (w.hours[k] || 0) / tot);
    return sh;
  }
  function computeRatings(ways) {
    const cats = ["SPR", "MAT", "NAT", "TEC", "WIR", "GES", "KRE"];
    const shares = {}; ways.forEach(w => shares[w.id] = wayShares(w));
    const max = {}; cats.forEach(c => max[c] = Math.max(...ways.map(w => shares[w.id][c])));
    const out = {};
    ways.forEach(w => {
      const r = {};
      cats.forEach(c => r[c] = Math.round(100 * shares[w.id][c] / max[c]));
      r.PRA = w.pra;
      out[w.id] = { ratings: r, shares: shares[w.id] };
    });
    return out;
  }

  function specialFactor(w, s) {
    switch (w.special) {
      case "latin": case "lang-latin": return 0.93 + 0.1 * s.LAT;
      case "media": return (0.85 + 0.25 * s.WRI) * (0.93 + 0.1 * s.LAT);
      case "music": return (0.6 + 0.45 * s.MUS) * (0.95 + 0.05 * s.LAT);
      case "classic": return 0.76 + 0.32 * s.LAT;
      case "italian": return 0.5 + 0.5 * s.IT;
      case "italian-lang": return 0.5 + 0.5 * s.IT;
      case "italian-med": return (0.5 + 0.5 * s.IT) * (0.85 + 0.25 * s.MED);
      case "english": return 0.5 + 0.55 * s.EN;
      case "gastro": return 0.68 + 0.42 * s.GAS;
      case "med-light": return 0.97 + 0.06 * s.MED;
      case "beauty": return 0.65 + 0.45 * s.BEA;
      default: return 1;
    }
  }

  const W = { interest: 0.38, subject: 0.32, style: 0.15, academic: 0.15 };

  function scoreWay(p, w, shares) {
    const uRI = RI.map(k => p.ri[k]);
    const r = pearson(uRI, w.riasec);
    const interest = (r + 1) / 2;
    const uS = BUCKETS.map(k => p.subj[k]);
    const wS = BUCKETS.map(k => shares[k]);
    const cos = cosine(uS, wS);
    const subject = clamp((cos - 0.45) / 0.5, 0, 1);
    const style = 1 - Math.abs(p.PRA - w.pra / 100);
    const academic = 1 - Math.abs(p.ACA - w.aca);
    const raw = W.interest * interest + W.subject * subject + W.style * style + W.academic * academic;
    const factor = Math.min(1.05, specialFactor(w, p.sig));
    // lineare Skala: Rohwert 0,15 → 5 %, 1,0 → 97 %; 100 % gibt es bewusst nicht
    const pct = clamp(Math.round(5 + 92 * (raw * factor - 0.15) / 0.85), 3, 97);
    return { pct, r, interest, subject, style, academic, factor };
  }

  function topTypes(vals, n) {
    return RI.map((k, i) => ({ k, v: vals[i] })).sort((a, b) => b.v - a.v).slice(0, n).map(x => x.k);
  }

  function hollandCode(p) { return topTypes(RI.map(k => p.ri[k]), 3).join("-"); }

  function reasonsFor(p, w, sc, entry) {
    const pro = [], con = [];
    const uTop = topTypes(RI.map(k => p.ri[k]), 2);
    const wTop = topTypes(w.riasec, 2);
    const overlap = uTop.filter(k => wTop.includes(k));
    if (overlap.length === 2) pro.push(`Deine zwei stärksten Seiten – ${RI_INFO[uTop[0]].short} und ${RI_INFO[uTop[1]].short} – sind genau die, auf die dieser Weg setzt.`);
    else if (overlap.length === 1) pro.push(`Deine ${RI_INFO[overlap[0]].short.toLowerCase()}e Seite (${RI_INFO[overlap[0]].desc}) ist hier ein Kernthema.`);
    else if (sc.r < 0) con.push(`Dein Interessenprofil (${uTop.map(k => RI_INFO[k].short).join(", ")}) passt wenig zu dem, worum es hier hauptsächlich geht (${wTop.map(k => RI_INFO[k].short).join(", ")}).`);

    // Fächer: deine Top-3-Bereiche, gewichtet mit der Stärke des Bereichs an dieser Schule
    const u = p.subj; const uTot = BUCKETS.reduce((s, k) => s + u[k], 0) || 1;
    const shares = entry.shares, ratings = entry.ratings;
    const userTop = BUCKETS.slice().sort((a, b) => u[b] - u[a]).slice(0, 3).filter(k => u[k] / uTot > 0.12);
    let best = null, bestV = 0;
    userTop.forEach(k => { const rt = k === "PRX" ? w.pra : ratings[k]; const v = (u[k] / uTot) * rt; if (rt >= 55 && v > bestV) { bestV = v; best = k; } });
    if (best) {
      const exact = !/Schätzung/.test(w.basis);
      const pctTxt = Math.round(shares[best] * 100);
      const unit = w.total && best !== "PRX" ? ` (${String(w.hours[best]).replace(".", ",")} Std. über 5 Jahre)` : "";
      if (best === "PRX") pro.push(`${BUCKET_INFO[best]} hast du in deinem Wunsch-Stundenplan stark gewichtet – hier ist der Praxisanteil hoch.`);
      else pro.push(`${BUCKET_INFO[best]} hast du in deinem Wunsch-Stundenplan stark gewichtet – hier ${exact ? "sind das" : "sind das geschätzt"} ${pctTxt} % des Unterrichts${exact ? unit : ""}.`);
    }
    // Besondere Voraussetzungen
    const s = p.sig;
    if (w.special === "music") s.MUS >= 0.75 ? pro.push("Du machst schon länger Musik – eine gute Basis für die Aufnahmeprüfung.") : con.push("Für die Aufnahmeprüfung braucht es Erfahrung mit Instrument oder Gesang.");
    if (w.special === "media" && s.WRI >= 0.6) pro.push("Du schreibst gern – im Journalismus-Schwerpunkt ist das täglich gefragt.");
    if ((w.special === "classic") && s.LAT >= 0.6) pro.push("Du knobelst gern an Sprache und Grammatik – ideal für Latein und Griechisch.");
    if ((w.special === "classic") && s.LAT < 0.35) con.push("Latein und Griechisch sind hier zentral – Grammatik ist bei dir nicht gerade Lieblingsthema.");
    if (/italian/.test(w.special)) s.IT >= 0.65 ? pro.push("Unterricht auf Italienisch traust du dir zu.") : con.push("Der gesamte Unterricht ist auf Italienisch – das fühlt sich für dich noch nicht so gut an.");
    if (w.special === "english") s.EN >= 0.65 ? pro.push("Unterricht auf Englisch traust du dir zu.") : con.push("Unterricht fast nur auf Englisch (mind. B1+) – das fühlt sich für dich noch nicht so gut an.");
    if (w.special === "gastro") s.GAS >= 0.5 ? pro.push("Kochen, Gäste und Gastronomie tauchen in deinen Antworten immer wieder auf.") : con.push("Gastronomie kam in deinen Antworten kaum vor.");
    if (w.special === "beauty") s.BEA >= 0.5 ? pro.push("Beauty, Styling und Wellness tauchen in deinen Antworten auf.") : con.push("Kosmetik und Friseur kamen in deinen Antworten kaum vor.");
    if (w.special === "italian-med" && s.MED >= 0.5) pro.push("Medizin und Körper interessieren dich – genau dafür ist die Curvatura biomedica da.");

    // schwacher Bereich, den die Schule stark hat
    let worst = null, worstV = 0;
    BUCKETS.forEach(k => { const gap = shares[k] - (u[k] / uTot); const min = k === "SPR" ? 0.45 : 0.2; if (shares[k] > min && gap > worstV) { worstV = gap; worst = k; } });
    if (worst && worstV > 0.18 && worst !== best) con.push(`${BUCKET_INFO[worst]} macht hier ${Math.round(shares[worst] * 100)} % aus – in deinem Wunsch-Stundenplan spielt das kaum eine Rolle.`);

    // Lernstil
    const diff = p.PRA - w.pra / 100;
    if (Math.abs(diff) < 0.2) pro.push(w.pra >= 60 ? "Viel Praxis – das passt zu deiner Art zu lernen." : w.pra <= 30 ? "Eher theoretisch und verstehensorientiert – so lernst du gern." : "Theorie und Praxis halten sich die Waage, wie es dir liegt.");
    else if (diff < -0.35) con.push("Deutlich mehr Praxis und Werkstatt, als du dir wünschst.");
    else if (diff > 0.35) con.push("Mehr Theorie und Lernen aus Büchern, als du dir wünschst.");

    // Studienwunsch
    const ad = p.ACA - w.aca;
    if (ad > 0.45) con.push("Du willst studieren – hier liegt der Fokus zuerst auf einem Beruf. Die Matura ist aber über ein 4. und 5. Jahr möglich.");
    if (ad < -0.5) con.push("Du willst eher bald arbeiten – dieser Weg bereitet vor allem auf ein Studium vor.");

    return { pro: pro.slice(0, 3), con: con.slice(0, 2), highlight: w.highlights[0] || "" };
  }

  function rankAll(p, ways, cache) {
    return ways.map(w => {
      const sc = scoreWay(p, w, cache[w.id].shares);
      return { way: w, ...sc };
    }).sort((a, b) => b.pct - a.pct);
  }

  // Ergebnis teilen: Profil kompakt in die URL
  function encodeProfile(p) {
    const arr = [...RI.map(k => +p.ri[k].toFixed(1)), ...BUCKETS.map(k => +p.subj[k].toFixed(1)), +p.PRA.toFixed(2), +p.ACA.toFixed(2), ...Object.keys(SIG_MAX).map(k => +p.sig[k].toFixed(2))];
    return arr.join("_");
  }
  function decodeProfile(str) {
    const a = str.split("_").map(Number);
    const sigKeys = Object.keys(SIG_MAX);
    if (a.length !== RI.length + BUCKETS.length + 2 + sigKeys.length || a.some(isNaN)) return null;
    const p = emptyProfile(); let i = 0;
    RI.forEach(k => p.ri[k] = a[i++]); BUCKETS.forEach(k => p.subj[k] = a[i++]);
    p.PRA = a[i++]; p.ACA = a[i++]; p.sig = {}; sigKeys.forEach(k => p.sig[k] = a[i++]);
    return p;
  }

  const Engine = { RI, RI_INFO, BUCKETS, BUCKET_INFO, QUESTIONS, W, buildProfile, computeRatings, scoreWay, rankAll, reasonsFor, hollandCode, encodeProfile, decodeProfile, pearson, cosine };
  if (typeof module !== "undefined" && module.exports) module.exports = Engine;
  root.Engine = Engine;
})(typeof window !== "undefined" ? window : globalThis);
