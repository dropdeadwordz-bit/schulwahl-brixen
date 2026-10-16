/* Schulwahl Brixen – Oberfläche */
(function () {
  const D = window.DATA, E = window.Engine, T = window.TAFELN || {}, K = window.CAREERS;
  const cache = E.computeRatings(D.ways);
  const byId = Object.fromEntries(D.ways.map(w => [w.id, w]));
  const LANG = { de: "Deutsch", it: "Italienisch", en: "Englisch" };
  const CAT = Object.fromEntries(D.categories.map(c => [c.id, c]));
  const ATTR_NAMES = D.attrs.map(a => a.short || a.name);
  const ATTR_IDS = D.attrs.map(a => a.id);
  const TILE = { rg: "Realgymnasium", rgan: "RG Angewandte Naturwiss.", sg: "Sprachen­gymnasium", swg: "SOWI Grundform", swvw: "SOWI Volks­wirtschaft", swmj: "SOWI Medien & Journalismus", swmu: "SOWI Musik", kg: "Klassisches Gymnasium", lsc: "Liceo Scientifico", lsb: "Curvatura biomedica", lli: "Liceo Linguistico", ip: "International Program", tfoi: "TFO Informatik", wfov: "WFO Finanzen & Marketing", wfot: "WFO Tourismus", tfog: "TFO Grafik & Kommunikation", ite: "ITE Finanza e Marketing", hfs: "Hotelfach­schule (2 Jahre)", bfk: "Kochen", bfs: "Service", bfbk: "Bäckerei & Konditorei", bfmt: "Metall­technik & Robotik", bfht: "Holztechnik", bffi: "Fach­informatik", bfhv: "Handel & Verwaltung", bfsp: "Schönheits­pflege & Frisur" };
  const EMO = { rg: "📐", rgan: "🧬", sg: "🗣️", swg: "🧠", swvw: "⚖️", swmj: "🎙️", swmu: "🎵", kg: "🏛️", lsc: "🔭", lsb: "🩺", lli: "🌍", ip: "🌐", tfoi: "💻", wfov: "📈", wfot: "🏔️", tfog: "🎨", ite: "💼", hfs: "🛎️", bfk: "🍳", bfs: "🍽️", bfbk: "🧁", bfmt: "⚙️", bfht: "🪵", bffi: "🖥️", bfhv: "🛍️", bfsp: "💇‍♀️" };
  const Q_EMO = { nachmittag: "🌤️", schulfest: "🎪", stundenplan: "🗓️", lernstil: "🧩", duelle: "⚡", faecher: "🏆", stolz: "🌟", zukunft: "📮", aussagen: "💬", musik: "🎶", geraet: "🎧", sprachen: "🌍", danach: "🚀", themen: "🔎" };
  const Q_COL = ["--gym", "--fos", "--bb", "--b"];
  const FACES = ["😖", "🙁", "😐", "🙂", "🤩"];
  const TYPE_COL = { R: "var(--bb)", I: "var(--b)", A: "var(--gym)", S: "var(--fos)", E: "#B7791F", C: "#6B6F7B" };

  const state = { lang: "alle", answers: {}, qi: -1, profile: null, ranking: null, cmpA: "rg", cmpB: "sg", lastFocus: null, intro: true, celebrate: false };

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const num = v => String(v).replace(".", ",");
  const fmtDate = iso => new Date(iso + "T12:00:00").toLocaleDateString("de-AT", { weekday: "short", day: "numeric", month: "long" });
  const cssVar = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const setHash = h => { try { history.replaceState(null, "", h); } catch (e) { /* eingebettete Vorschau */ } };
  $("[data-stand]").textContent = D.stand;

  // ---------------- Radar ----------------
  function radar(axes, series, size = 320, opts = {}) {
    const n = axes.length, cx = size / 2, cy = size / 2, R = size / 2 - (opts.pad ?? 54), mx = opts.mx ?? 46;
    const pt = (i, v) => { const a = -Math.PI / 2 + (2 * Math.PI * i) / n; return [cx + Math.cos(a) * R * v, cy + Math.sin(a) * R * v]; };
    let g = "";
    [0.25, 0.5, 0.75, 1].forEach(l => { g += `<polygon class="grid" points="${axes.map((_, i) => pt(i, l).join(",")).join(" ")}"/>`; });
    axes.forEach((_, i) => { const [x, y] = pt(i, 1); g += `<line class="axis" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}"/>`; });
    series.forEach(s => {
      const pts = s.values.map((v, i) => pt(i, Math.max(0.02, v)).join(",")).join(" ");
      g += `<polygon points="${pts}" fill="${s.color}" fill-opacity="${s.fill ?? 0.2}" stroke="${s.color}" stroke-width="3" stroke-linejoin="round"/>`;
    });
    axes.forEach((label, i) => {
      const [x, y] = pt(i, 1.18);
      const anchor = Math.abs(x - cx) < 4 ? "middle" : x > cx ? "start" : "end";
      g += `<text x="${x}" y="${y + 4}" text-anchor="${anchor}">${esc(label)}</text>`;
    });
    return `<svg class="radar" viewBox="${-mx} 0 ${size + 2 * mx} ${size}" role="img" aria-label="${esc(opts.label || "Profil")}">${g}</svg>`;
  }
  const attrValues = id => ATTR_IDS.map(k => cache[id].ratings[k] / 100);

  // ---------------- Berufe ----------------
  function pathLabel(w, c) {
    const bb = w.cat === "bb";
    if (c.path === "direkt") return bb ? "nach dem Berufsdiplom" : "direkt nach der Matura";
    if (c.path === "studium") return bb ? "mit Matura (5. Jahr) und Studium" : "mit Studium";
    return bb ? "nach dem Berufsdiplom oder mit Studium" : "direkt oder mit Studium";
  }
  const jobsFor = id => (K.MAP[id] || []).map(k => ({ key: k, ...K.C[k] }));
  function mixFor(id) {
    const m = { "2": 0, "1": 0, "0": 0, "-1": 0, "-2": 0 };
    jobsFor(id).forEach(j => m[String(j.o35)]++);
    return m;
  }
  const outlookChip = (v, year) => `<span class="oc o-${v}">${year}: ${esc(K.SCALE[String(v)].short)}</span>`;
  function mixBar(id) {
    const m = mixFor(id), total = Object.values(m).reduce((s, v) => s + v, 0) || 1;
    const col = { "2": "var(--o2)", "1": "var(--o1)", "0": "var(--o0)", "-1": "var(--om1)", "-2": "var(--om2)" };
    return `<div class="mix" role="img" aria-label="Zukunftsmix 2035">${["2", "1", "0", "-1", "-2"].map(k => m[k] ? `<span style="width:${(m[k] / total) * 100}%;background:${col[k]}"></span>` : "").join("")}</div>
      <div class="mix-legend">${["2", "1", "0", "-1", "-2"].filter(k => m[k]).map(k => `<span><i style="background:${col[k]}"></i>${m[k]} ${esc(K.SCALE[k].short)}</span>`).join("")}</div>`;
  }
  const goodCount = id => jobsFor(id).filter(j => j.o35 >= 1).length;

  // ---------------- Router ----------------
  const views = ["uebersicht", "vergleich", "test", "methode"];
  function route() {
    if (!$("#drawer").hidden) { $("#drawer").hidden = true; document.body.style.overflow = ""; }
    const parts = (location.hash || "#uebersicht").slice(1).split("/");
    let view = parts[0] || "uebersicht";
    if (view === "ergebnis") { const p = E.decodeProfile(parts[1] || ""); if (p) setProfile(p); view = "test"; }
    if (!views.includes(view)) view = "uebersicht";
    views.forEach(v => { $("#view-" + v).hidden = v !== view; });
    $$("[data-nav]").forEach(a => a.dataset.nav === view ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
    document.body.classList.remove("in-quiz");
    if (view === "uebersicht") renderOverview();
    if (view === "vergleich") {
      if (parts[1] && byId[parts[1]]) state.cmpA = parts[1];
      if (parts[2] && byId[parts[2]]) state.cmpB = parts[2];
      renderCompare();
    }
    if (view === "test") renderTest();
    if (view === "methode") renderMethod();
    window.scrollTo({ top: 0 });
  }
  window.addEventListener("hashchange", route);
  function setProfile(p) { state.profile = p; state.ranking = E.rankAll(p, D.ways, cache); state.qi = -2; }

  // ---------------- Übersicht ----------------
  function tileHTML(w, i) {
    const tag = w.lang === "it" ? "Italienisch" : w.lang === "en" ? "Englisch" : D.schools[w.school].traeger.startsWith("privat") ? "privat" : "";
    const r = state.ranking && state.ranking.find(x => x.way.id === w.id);
    const dim = state.lang !== "alle" && w.lang !== state.lang;
    return `<button type="button" class="tile c-${w.cat}${dim ? " is-dim" : ""}" style="--i:${i}" data-open="${w.id}" aria-label="${esc(w.name)}, ${esc(D.schools[w.school].short)}${r ? `, Passung ${r.pct} Prozent` : ""}">
      <span class="tile__sym">${esc(w.sym)}</span>
      <span class="tile__emo" aria-hidden="true">${EMO[w.id] || ""}</span>
      <span><span class="tile__name">${TILE[w.id] || esc(w.name)}</span><span class="tile__school">${esc(D.schools[w.school].short)}</span>${tag ? `<span class="tile__tag">${tag}</span>` : ""}</span>
      ${r ? `<span class="tile__pct">${r.pct} %</span>` : ""}
    </button>`;
  }
  function renderOverview() {
    const el = $("#view-uebersicht");
    const cols = { gym: 4, fos: 2, bb: 3 };
    let idx = 0;
    const groups = D.categories.map(c => {
      const ws = D.ways.filter(w => w.cat === c.id);
      return `<div class="group group--${c.id} c-${c.id}">
        <div class="group__head"><h2>${esc(c.name)}</h2><span>${esc(c.note)}</span></div>
        <div class="tiles" style="--cols:${cols[c.id]}">${ws.map(w => tileHTML(w, idx++)).join("")}</div>
      </div>`;
    }).join("");
    const inBrixen = Object.values(D.schools).filter(s => !/Bozen/.test(s.addr)).length;
    const st = ["sg", "tfog", "bfbk"].map(id => byId[id]);
    el.innerHTML = `
      <div class="hero">
        <div>
          <h1 id="h-uebersicht">Welche Oberschule passt zu dir?</h1>
          <p class="lead">${D.ways.length} Bildungswege an ${inBrixen} Brixner Oberschulen – plus das internationale Programm in Bozen. Tippe auf ein Feld für Steckbrief, Stundenplan und Berufe mit Zukunft.</p>
          <div class="row">
            <a class="btn btn--pop" href="#test">${state.profile ? "Mein Ergebnis ansehen" : "Test starten – 6 Minuten"}</a>
            <a class="btn btn--ghost" href="#vergleich">Zwei Wege vergleichen</a>
          </div>
          <div class="legend" aria-label="Legende">
            <span class="c-gym"><i></i>Gymnasium / Liceo</span><span class="c-fos"><i></i>Fachoberschule</span><span class="c-bb"><i></i>Berufsbildung</span>
          </div>
        </div>
        <div class="stickers" aria-hidden="true">${st.map(w => `<div class="sticker c-${w.cat}"><b>${w.sym}</b><span>${EMO[w.id]}</span></div>`).join("")}</div>
      </div>
      <div class="filters" role="group" aria-label="Nach Unterrichtssprache filtern">
        <span class="filters__label">Unterricht auf:</span>
        ${["alle", "de", "it", "en"].map(l => `<button type="button" class="chip" data-lang="${l}" aria-pressed="${state.lang === l}">${l === "alle" ? "alle" : LANG[l]}</button>`).join("")}
      </div>
      ${state.profile ? `<p class="filters__hint">Die Prozentzahl in jedem Feld ist deine Passung aus dem Test.</p>` : ""}
      <div class="table${state.intro ? " is-intro" : ""}">${groups}</div>
      ${timelineHTML()}`;
    state.intro = false;
    $$("[data-lang]", el).forEach(b => b.addEventListener("click", () => { state.lang = b.dataset.lang; renderOverview(); $(`[data-lang="${state.lang}"]`).focus(); }));
    $$("[data-open]", el).forEach(b => b.addEventListener("click", () => openDetail(b.dataset.open, b)));
  }
  function timelineHTML() {
    const days = [];
    D.events.forEach(ev => { let d = days.find(x => x.date === ev.date); if (!d) days.push(d = { date: ev.date, evs: [] }); d.evs.push(ev); });
    const items = days.map(d => {
      const openCount = d.evs.filter(ev => ev.open && ev.school).length;
      return `<li class="${d.evs.some(ev => !ev.school) ? "is-key" : ""}">
        <span class="t-date">${fmtDate(d.date)}</span>${openCount > 1 ? `<span class="t-note">${openCount} Schulen gleichzeitig</span>` : ""}
        <ul class="t-list">${d.evs.map(ev => { const time = ev.time || (ev.open ? "Uhrzeit auf der Schulseite" : ""); return `<li><b>${esc(ev.school ? D.schools[ev.school].short : "Alle Oberschulen")}:</b> ${esc(ev.what)}${time ? ` <span class="muted small">${esc(time)}</span>` : ""}</li>`; }).join("")}</ul>
      </li>`;
    }).join("");
    return `<section class="timeline" aria-labelledby="h-termine">
      <div>
        <h2 id="h-termine">Termine bis zur Einschreibung</h2>
        <p class="muted" style="margin-top:10px">Die Einschreibung in die 1. Klasse läuft online über myCIVIS. Dafür braucht ihr SPID, den elektronischen Personalausweis oder eine aktivierte Bürgerkarte.</p>
        <p class="muted small">Am 27. und 28. November haben fast alle Schulen gleichzeitig offen. Hellenstainer und Tschuggmall liegen beide am Fischzuchtweg und lassen sich gut kombinieren.</p>
      </div>
      <ol>${items}</ol>
    </section>`;
  }

  // ---------------- Steckbrief ----------------
  const cellNum = v => typeof v === "string" ? v.split("/").map(x => parseFloat(x)).reduce((s, x) => s + x, 0) / v.split("/").length : v;
  function heatClass(v) { if (v === null || v === undefined) return "e"; v = cellNum(v); if (v <= 0) return "h0"; if (v <= 1) return "h1"; if (v <= 2) return "h2"; if (v <= 3) return "h3"; if (v <= 4) return "h4"; if (v <= 5) return "h5"; return "h6"; }
  function tafelBlocks(t) { return t.blocks || [{ heads: [...Array(t.years || t.rows[0][1].length)].map((_, i) => `${i + 1}.`), rows: t.rows, total: t.total }]; }
  function tafelHTML(id) {
    const t = T[id];
    if (!t) return `<div class="tt-missing"><b>Stundentafel folgt.</b><p class="small" style="margin:6px 0 0">Für diesen Bildungsweg liegt noch keine offizielle Stundentafel pro Klasse vor. Das Profil im Überblick ist eine Schätzung.</p></div>`;
    const blocks = tafelBlocks(t).map(b => {
      const heads = b.heads || b.rows[0][1].map((_, i) => `${i + 1}.`);
      const head = `<tr><th scope="col">Fach</th>${heads.map(h => `<th scope="col">${esc(h)}</th>`).join("")}</tr>`;
      const rows = b.rows.map(([name, vals]) => `<tr><td class="sub">${esc(name)}</td>${vals.map(v => `<td class="${heatClass(v)}">${v === null ? "" : esc(num(v))}</td>`).join("")}</tr>`).join("");
      const sum = b.total ? `<tr class="sum"><td class="sub">Pflichtstunden pro Woche</td>${b.total.map(v => `<td>${num(v)}</td>`).join("")}</tr>` : "";
      return `${b.title ? `<h4 class="tt-title">${esc(b.title)}</h4>` : ""}<div class="tt-wrap"><table class="tt"><thead>${head}</thead><tbody>${rows}${sum}</tbody></table></div>`;
    }).join("");
    return `${blocks}<p class="note" style="margin-top:8px">Wochenstunden pro Klasse. Je kräftiger die Farbe, desto mehr Stunden.</p>
      ${t.notes ? `<ul class="list note" style="margin-top:6px">${t.notes.map(n => `<li>${esc(n)}</li>`).join("")}</ul>` : ""}`;
  }
  function jobsHTML(w) {
    const jobs = jobsFor(w.id);
    return `<p class="small">Welche Berufsfelder sich nach diesem Weg anbieten – und wie gefragt sie zum Zeitpunkt der Matura (2032) und nach einem Bachelor (2035) voraussichtlich sind, in Zeiten von KI und Robotik.</p>
      ${mixBar(w.id)}
      <div class="jobs">${jobs.map(j => `<article class="job">
        <h4>${esc(j.name)}</h4>
        <div class="job__ex">${esc(j.ex)}</div>
        <div class="job__chips"><span class="oc oc--path">${esc(pathLabel(w, j))}</span>${outlookChip(j.o32, 2032)}${outlookChip(j.o35, 2035)}<span class="oc oc--path">KI-Risiko: ${esc(j.ai)}</span></div>
        <p>${esc(j.why)}</p>
      </article>`).join("")}</div>
      <p class="note" style="margin-top:12px">Begründete Einschätzung auf Basis aktueller Studien, keine Garantie. Je weiter weg, desto unsicherer – 2035 ist schwerer vorherzusagen als 2032. Mehr dazu unter „So funktioniert's“.</p>`;
  }
  function openDetail(id, trigger, tab = "ueberblick") {
    const w = byId[id], s = D.schools[w.school];
    state.lastFocus = trigger || document.activeElement;
    const r = state.ranking && state.ranking.find(x => x.way.id === id);
    const facts = [
      ["Schule", esc(s.name)],
      ["Adresse", `${esc(s.addr)}<br><a href="${esc(s.web)}" target="_blank" rel="noopener">Website der Schule</a>`],
      ["Träger", esc(s.traeger)],
      ["Unterricht auf", LANG[w.lang]],
      ["Abschluss", esc(w.abschluss)],
      ["Wochenstunden", esc(w.woche)],
      ["Fremdsprachen", esc(w.fl)],
      ["Latein", w.latin ? `${num(w.latin)} Std. über 5 Jahre` : "nein"],
      ["Aufnahme", w.aufnahme ? esc(w.aufnahme) : "ohne Aufnahmeverfahren"],
      ["Kosten", w.kosten ? esc(w.kosten) : "kein Schulgeld"]
    ];
    const tabs = [["ueberblick", "Überblick"], ["stunden", "Stunden"], ["zukunft", "Berufe"]];
    $("#drawer-body").innerHTML = `
      <div class="d-head c-${w.cat}">
        <div class="d-sym" aria-hidden="true">${esc(w.sym)}<i>${EMO[id] || ""}</i></div>
        <div><h2 id="drawer-title">${esc(w.name)}</h2><p>${esc(s.short)}, ${esc(CAT[w.cat].name.split(" und ")[0])}</p></div>
      </div>
      ${r ? `<div class="d-pct">Deine Passung: ${r.pct} %</div>` : ""}
      <div class="d-tabs c-${w.cat}" role="tablist" aria-label="Bereiche des Steckbriefs">${tabs.map(([k, l]) => `<button type="button" role="tab" id="tab-${k}" aria-controls="pane-${k}" aria-selected="${k === tab}" data-tab="${k}">${l}</button>`).join("")}</div>
      <div class="d-pane c-${w.cat}" role="tabpanel" id="pane-ueberblick" aria-labelledby="tab-ueberblick"${tab === "ueberblick" ? "" : " hidden"}>
        <p style="margin-top:12px">${esc(w.about)}</p>
        <div class="d-sec"><h3>Besonderheiten</h3><ul class="list">${w.highlights.map(x => `<li>${esc(x)}</li>`).join("")}</ul><p class="note">${esc(s.fact)}</p></div>
        ${w.caveats.length ? `<div class="d-sec"><h3>Gut zu wissen</h3><ul class="list list--warn">${w.caveats.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>` : ""}
        <dl class="facts">${facts.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("")}</dl>
        <div class="d-sec"><h3>Profil im Vergleich</h3>
          <div style="max-width:340px;margin:0 auto">${radar(ATTR_NAMES, [{ values: attrValues(id), color: cssVar("--" + w.cat) }], 320, { label: "Profil von " + w.name })}</div>
          <p class="note">100 = höchster Anteil unter allen Bildungswegen dieser Übersicht. Basis: ${esc(w.basis)}.</p>
        </div>
      </div>
      <div class="d-pane c-${w.cat}" role="tabpanel" id="pane-stunden" aria-labelledby="tab-stunden"${tab === "stunden" ? "" : " hidden"}>
        <div class="d-sec" style="margin-top:12px"><h3>Wochenstunden pro Schuljahr</h3>${tafelHTML(id)}</div>
      </div>
      <div class="d-pane c-${w.cat}" role="tabpanel" id="pane-zukunft" aria-labelledby="tab-zukunft"${tab === "zukunft" ? "" : " hidden"}>
        <div class="d-sec" style="margin-top:12px"><h3>Wohin danach?</h3>${jobsHTML(w)}</div>
      </div>
      <div class="row" style="margin-top:22px"><a class="btn btn--ghost" href="#vergleich/${id}/${id === state.cmpB ? state.cmpA : state.cmpB}">Mit einem anderen Weg vergleichen</a></div>`;
    const dr = $("#drawer");
    dr.hidden = false;
    document.body.style.overflow = "hidden";
    const panel = $(".drawer__scroll", dr);
    panel.scrollTop = 0;
    $(".drawer__panel", dr).focus();
    $$("#drawer-body a[href^='#']").forEach(a => a.addEventListener("click", closeDetail));
    $$("[data-tab]", dr).forEach(b => b.addEventListener("click", () => {
      $$("[data-tab]", dr).forEach(x => x.setAttribute("aria-selected", String(x === b)));
      $$(".d-pane", dr).forEach(p => { p.hidden = p.id !== "pane-" + b.dataset.tab; });
      const tabsEl = $(".d-tabs", dr); if (panel.scrollTop > tabsEl.offsetTop) panel.scrollTop = tabsEl.offsetTop;
    }));
  }
  function closeDetail() {
    $("#drawer").hidden = true;
    document.body.style.overflow = "";
    if (state.lastFocus && document.contains(state.lastFocus)) state.lastFocus.focus();
  }
  $$("#drawer [data-close]").forEach(b => b.addEventListener("click", closeDetail));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !$("#drawer").hidden) closeDetail();
    if (e.key === "Tab" && !$("#drawer").hidden) {
      const f = $$("#drawer button, #drawer a[href]").filter(x => x.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  // ---------------- Vergleich ----------------
  function selectHTML(name, value) {
    return `<select id="sel-${name}" aria-label="Bildungsweg ${name.toUpperCase()}">${D.categories.map(c => `<optgroup label="${esc(c.name)}">${D.ways.filter(w => w.cat === c.id).map(w => `<option value="${w.id}"${w.id === value ? " selected" : ""}>${EMO[w.id] || ""} ${esc(w.name)} (${esc(D.schools[w.school].short)})</option>`).join("")}</optgroup>`).join("")}</select>`;
  }
  function renderCompare() {
    const el = $("#view-vergleich");
    el.innerHTML = `
      <h1 id="h-vergleich">Zwei Wege im Duell</h1>
      <p class="lead">Wie bei Spieler-Vergleichen in Fußball-Apps: zwei Bildungswege, acht Werte, ein Blick.</p>
      <div class="cmp-pick">
        <div class="is-a"><label for="sel-a">Weg A</label>${selectHTML("a", state.cmpA)}</div>
        <button type="button" class="swap" id="swap" aria-label="A und B tauschen">⇄</button>
        <div class="is-b"><label for="sel-b">Weg B</label>${selectHTML("b", state.cmpB)}</div>
      </div>
      <div id="cmp-body"></div>`;
    const upd = () => { setHash(`#vergleich/${state.cmpA}/${state.cmpB}`); renderCompareBody(); };
    $("#sel-a").addEventListener("change", e => { state.cmpA = e.target.value; upd(); });
    $("#sel-b").addEventListener("change", e => { state.cmpB = e.target.value; upd(); });
    $("#swap").addEventListener("click", () => { [state.cmpA, state.cmpB] = [state.cmpB, state.cmpA]; $("#sel-a").value = state.cmpA; $("#sel-b").value = state.cmpB; upd(); });
    renderCompareBody();
  }
  function renderCompareBody() {
    const a = byId[state.cmpA], b = byId[state.cmpB];
    const ra = cache[a.id].ratings, rb = cache[b.id].ratings;
    const bars = D.attrs.map(at => {
      const va = ra[at.id], vb = rb[at.id];
      return `<div class="bar"><div class="bar__label">${esc(at.name)}</div>
        <span class="bar__v${va > vb ? " is-win" : ""}" style="color:var(--a)">${va}</span>
        <div class="bar__track is-a"><div class="bar__fill" style="width:${va}%;background:var(--a)"></div></div>
        <div class="bar__track"><div class="bar__fill" style="width:${vb}%;background:var(--b)"></div></div>
        <span class="bar__v is-b${vb > va ? " is-win" : ""}" style="color:var(--b)">${vb}</span></div>`;
    }).join("");
    const sa = D.schools[a.school], sb = D.schools[b.school];
    const pa = state.ranking && state.ranking.find(x => x.way.id === a.id), pb = state.ranking && state.ranking.find(x => x.way.id === b.id);
    const perYear = w => {
      const t = T[w.id]; if (!t) return esc(w.woche);
      return tafelBlocks(t).map((b, i) => { const tot = b.total ? b.total.join(" / ") : "siehe Stundentafel"; return i === 0 ? tot + (t.years === 3 ? " (1.–3. Klasse)" : "") : `${(b.heads || [""])[0].replace(/ .*/, "")} Jahr: ${b.total ? b.total[0] : "–"}`; }).join("; ");
    };
    const fut = w => `${goodCount(w.id)} von ${jobsFor(w.id).length} Berufsfeldern gefragt oder wachsend`;
    const rows = [
      pa ? ["Deine Passung", `<b>${pa.pct} %</b>`, `<b>${pb.pct} %</b>`] : null,
      ["Schule", esc(sa.short), esc(sb.short)],
      ["Schulart", esc(CAT[a.cat].name), esc(CAT[b.cat].name)],
      ["Unterricht auf", LANG[a.lang], LANG[b.lang]],
      ["Wochenstunden 1.–5. Klasse", perYear(a), perYear(b)],
      ["Abschluss", esc(a.abschluss), esc(b.abschluss)],
      ["Fremdsprachen", esc(a.fl), esc(b.fl)],
      ["Latein", a.latin ? num(a.latin) + " Std." : "nein", b.latin ? num(b.latin) + " Std." : "nein"],
      ["Aufnahme", a.aufnahme ? esc(a.aufnahme) : "ohne Verfahren", b.aufnahme ? esc(b.aufnahme) : "ohne Verfahren"],
      ["Kosten", a.kosten ? esc(a.kosten) : "kein Schulgeld", b.kosten ? esc(b.kosten) : "kein Schulgeld"],
      ["Berufe 2035", fut(a), fut(b)],
      ["Besonders", esc(a.highlights[0]), esc(b.highlights[0])],
      ["Datenbasis", esc(a.basis), esc(b.basis)]
    ].filter(Boolean);
    $("#cmp-body").innerHTML = `
      <div class="cmp-body">
        <div>${radar(ATTR_NAMES, [{ values: attrValues(a.id), color: cssVar("--a") }, { values: attrValues(b.id), color: cssVar("--b") }], 360, { label: "Profile im Vergleich" })}
          <p class="note">Werte 0–100: Anteil des Bereichs am Unterricht, 100 = höchster Wert aller Bildungswege. Praxis ist redaktionell eingeschätzt.</p></div>
        <div>
          <div class="cmp-names"><div class="cmp-name is-a">${EMO[a.id] || ""} ${esc(a.name)}<small>${esc(sa.short)}</small></div><div class="cmp-name is-b">${esc(b.name)} ${EMO[b.id] || ""}<small>${esc(sb.short)}</small></div></div>
          <div class="bars">${bars}</div>
        </div>
      </div>
      <table class="cmp-table"><thead><tr><th scope="col"><span class="muted">Steckbrief</span></th><th scope="col" style="color:var(--a)">A</th><th scope="col" style="color:var(--b)">B</th></tr></thead>
        <tbody>${rows.map(r => `<tr><th scope="row">${r[0]}</th><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("")}</tbody></table>
      <div class="row" style="margin-top:18px"><button type="button" class="btn btn--ghost" data-open="${a.id}" data-tab-open="zukunft">Berufe von A ansehen</button><button type="button" class="btn btn--ghost" data-open="${b.id}" data-tab-open="zukunft">Berufe von B ansehen</button></div>`;
    $$("#cmp-body [data-open]").forEach(btn => btn.addEventListener("click", () => openDetail(btn.dataset.open, btn, btn.dataset.tabOpen)));
  }

  // ---------------- Test ----------------
  const Q = E.QUESTIONS;
  function renderTest() {
    const el = $("#view-test");
    if (state.qi === -2 && state.profile) return renderResult(el);
    if (state.qi < 0) {
      el.innerHTML = `<div class="test">
        <h1 id="h-test">Der Schul-Test</h1>
        <div class="intro-card">
          <div class="intro-emojis" aria-hidden="true">🧪🎨<br>🗣️💻</div>
          <div class="intro-facts"><span>${Q.length} Fragen</span><span>ca. 6 Minuten</span><span>8 Aufgabentypen</span></div>
          <p style="font-size:1.12rem"><b>Finde heraus, welche Bildungswege in Brixen zu dir passen – mit Prozentwert und Begründung.</b></p>
          <p>Es gibt keine richtigen oder falschen Antworten. Antworte so, wie es für dich stimmt – nicht so, wie es klingen sollte.</p>
          <p class="muted small">Grundlage ist das Interessenmodell nach John L. Holland. Deine Antworten bleiben auf deinem Gerät.</p>
          <div class="row" style="margin-top:16px"><button class="btn" id="start" type="button">Los geht's</button></div>
        </div></div>`;
      $("#start").addEventListener("click", () => { state.answers = {}; state.qi = 0; renderTest(); focusTitle(); });
      return;
    }
    renderQuestion(el);
  }
  function isValid(q, a) {
    if (a === undefined || a === null) return q.type === "slider" || q.type === "sliders";
    switch (q.type) {
      case "pick": return a.length >= (q.min || 1);
      case "budget": return Object.values(a).reduce((s, v) => s + v, 0) === q.points;
      case "duel": return q.pairs.every((_, i) => a[i] === 0 || a[i] === 1);
      case "rank": return a.length === q.options.length;
      case "likert": return q.items.every((_, i) => a[i] !== undefined);
      default: return true;
    }
  }
  function renderQuestion(el) {
    document.body.classList.add("in-quiz");
    const q = Q[state.qi];
    let a = state.answers[q.id];
    if (q.type === "slider" && a === undefined) a = state.answers[q.id] = 50;
    if (q.type === "sliders" && a === undefined) a = state.answers[q.id] = q.sliders.map(() => 50);
    if (q.type === "budget" && a === undefined) a = state.answers[q.id] = Object.fromEntries(q.buckets.map(b => [b.key, 0]));
    if (["pick", "rank", "duel", "likert"].includes(q.type) && a === undefined) a = state.answers[q.id] = [];
    let body = "";
    if (q.type === "pick") {
      body = `<div class="opts">${q.options.map((o, i) => `<button type="button" class="opt" data-i="${i}" aria-pressed="${a.includes(i)}">${esc(o.label)}${o.sub ? `<small>${esc(o.sub)}</small>` : ""}</button>`).join("")}</div>
        <p class="q-count" style="margin-top:10px" aria-live="polite">${a.length} von ${q.max} gewählt</p>`;
    } else if (q.type === "single") {
      body = `<div class="opts opts--list" role="radiogroup" aria-label="${esc(q.title)}">${q.options.map((o, i) => `<button type="button" class="opt" role="radio" data-i="${i}" aria-checked="${a === i}">${esc(o.label)}</button>`).join("")}</div>`;
    } else if (q.type === "budget") {
      const used = Object.values(a).reduce((s, v) => s + v, 0), left = q.points - used;
      body = `<p class="budget__left${left === 0 ? " is-done" : ""}" aria-live="polite">${left === 0 ? "✓ Alle Stunden verteilt" : `Noch ${left} ${left === 1 ? "Stunde" : "Stunden"} übrig`}</p>
        <div class="budget">${q.buckets.map(b => `<div class="budget__row"><div><b>${esc(b.label)}</b>${b.sub ? `<small>${esc(b.sub)}</small>` : ""}<div class="dots" aria-hidden="true">${"<i></i>".repeat(a[b.key])}</div></div>
          <div class="stepper"><button type="button" data-k="${b.key}" data-d="-1" aria-label="${esc(b.label)} weniger"${a[b.key] === 0 ? " disabled" : ""}>−</button><output aria-label="${esc(b.label)}">${a[b.key]}</output><button type="button" data-k="${b.key}" data-d="1" aria-label="${esc(b.label)} mehr"${used >= q.points ? " disabled" : ""}>+</button></div></div>`).join("")}</div>`;
    } else if (q.type === "slider") {
      body = `<div class="range"><input type="range" min="0" max="100" step="5" value="${a}" id="rng" aria-label="${esc(q.left)} bis ${esc(q.right)}"></div>
        <div class="range__ends"><span>${esc(q.left)}</span><span>${esc(q.right)}</span></div>`;
    } else if (q.type === "sliders") {
      body = q.sliders.map((s, i) => `<p class="range__label">${esc(s.label)}</p><div class="range"><input type="range" min="0" max="100" step="5" value="${a[i]}" data-i="${i}" aria-label="${esc(s.label)}"></div>
        <div class="range__ends"><span>${esc(s.left)}</span><span>${esc(s.right)}</span></div>`).join("");
    } else if (q.type === "duel") {
      body = q.pairs.map((p, i) => `<div class="duel" role="group" aria-label="${esc(p.a.label)} oder ${esc(p.b.label)}">
        <button type="button" class="opt" data-p="${i}" data-s="0" aria-pressed="${a[i] === 0}">${esc(p.a.label)}</button><span class="vs" aria-hidden="true">VS</span>
        <button type="button" class="opt" data-p="${i}" data-s="1" aria-pressed="${a[i] === 1}">${esc(p.b.label)}</button></div>`).join("");
    } else if (q.type === "rank") {
      body = `<div class="opts">${q.options.map((o, i) => { const pos = a.indexOf(i); return `<button type="button" class="opt rank" data-i="${i}" aria-pressed="${pos >= 0}"><span class="rank__n">${pos >= 0 ? pos + 1 : ""}</span>${esc(o.label)}</button>`; }).join("")}</div>
        <p class="q-count" style="margin-top:10px" aria-live="polite">${a.length === q.options.length ? "Fertig sortiert" : `Als Nächstes: Platz ${a.length + 1} von ${q.options.length}`}</p>`;
    } else if (q.type === "likert") {
      body = q.items.map((it, i) => `<div class="likert" role="radiogroup" aria-label="${esc(it.label)}"><p>${esc(it.label)}</p><div class="likert__scale">${q.scale.map((s, v) => `<button type="button" class="opt" role="radio" data-it="${i}" data-v="${v}" aria-checked="${a[i] === v}" aria-label="${esc(s)}"><b aria-hidden="true">${FACES[v]}</b><span>${esc(s)}</span></button>`).join("")}</div></div>`).join("");
    }
    const valid = isValid(q, state.answers[q.id]);
    const qc = Q_COL[state.qi % Q_COL.length];
    el.innerHTML = `<div class="test" style="--qc:var(${qc})">
      <div class="steps" style="--n:${Q.length}" aria-hidden="true">${Q.map((_, i) => `<i class="${i < state.qi ? "done" : i === state.qi ? "now" : ""}"></i>`).join("")}</div>
      <p class="q-count">Frage ${state.qi + 1} von ${Q.length}</p>
      <div class="qcard" style="--qc:var(${qc})">
        <div class="q-emo" aria-hidden="true">${Q_EMO[q.id] || "✨"}</div>
        <h1 class="q-title" id="h-test" tabindex="-1">${esc(q.title)}</h1>
        ${q.hint ? `<p class="q-hint">${esc(q.hint)}</p>` : `<div style="height:12px"></div>`}
        ${body}
        <div class="q-nav">
          <button type="button" class="btn btn--ghost" id="back">${state.qi === 0 ? "Abbrechen" : "Zurück"}</button>
          <button type="button" class="btn btn--pop" id="next"${valid ? "" : " disabled"}>${state.qi === Q.length - 1 ? "Ergebnis zeigen" : "Weiter"}</button>
        </div>
      </div></div>`;
    const rerender = sel => { const y = window.scrollY; renderQuestion(el); window.scrollTo({ top: y }); if (sel) { const f = $(sel, el); if (f) f.focus({ preventScroll: true }); } };
    if (q.type === "pick") $$("[data-i]", el).forEach(b => b.addEventListener("click", () => {
      const i = +b.dataset.i, arr = state.answers[q.id], pos = arr.indexOf(i);
      if (pos >= 0) arr.splice(pos, 1); else if (arr.length < q.max) arr.push(i); else { arr.shift(); arr.push(i); }
      rerender(`[data-i="${i}"]`);
    }));
    if (q.type === "single") $$("[data-i]", el).forEach(b => b.addEventListener("click", () => { state.answers[q.id] = +b.dataset.i; rerender(`[data-i="${b.dataset.i}"]`); }));
    if (q.type === "budget") $$("[data-k]", el).forEach(b => b.addEventListener("click", () => {
      const k = b.dataset.k, d = +b.dataset.d, obj = state.answers[q.id], used = Object.values(obj).reduce((s, v) => s + v, 0);
      if (d > 0 && used >= q.points) return;
      obj[k] = Math.max(0, obj[k] + d);
      rerender(`[data-k="${k}"][data-d="${d}"]`);
    }));
    if (q.type === "slider") $("#rng", el).addEventListener("input", e => { state.answers[q.id] = +e.target.value; });
    if (q.type === "sliders") $$("input[type=range]", el).forEach(r => r.addEventListener("input", e => { state.answers[q.id][+e.target.dataset.i] = +e.target.value; }));
    if (q.type === "duel") $$("[data-p]", el).forEach(b => b.addEventListener("click", () => { state.answers[q.id][+b.dataset.p] = +b.dataset.s; rerender(`[data-p="${b.dataset.p}"][data-s="${b.dataset.s}"]`); }));
    if (q.type === "rank") $$("[data-i]", el).forEach(b => b.addEventListener("click", () => {
      const i = +b.dataset.i, arr = state.answers[q.id], pos = arr.indexOf(i);
      if (pos >= 0) arr.splice(pos, 1); else arr.push(i);
      rerender(`[data-i="${i}"]`);
    }));
    if (q.type === "likert") $$("[data-it]", el).forEach(b => b.addEventListener("click", () => { state.answers[q.id][+b.dataset.it] = +b.dataset.v; rerender(`[data-it="${b.dataset.it}"][data-v="${b.dataset.v}"]`); }));
    $("#back", el).addEventListener("click", () => { state.qi--; if (state.qi < 0) document.body.classList.remove("in-quiz"); renderTest(); focusTitle(); });
    $("#next", el).addEventListener("click", () => {
      if (!isValid(q, state.answers[q.id])) return;
      if (state.qi < Q.length - 1) { state.qi++; renderTest(); focusTitle(); return; }
      const p = E.buildProfile(state.answers);
      setProfile(p);
      state.celebrate = true;
      location.hash = "#ergebnis/" + E.encodeProfile(p);
    });
  }
  function focusTitle() { const t = $("#h-test"); if (t) { t.focus({ preventScroll: true }); window.scrollTo({ top: 0 }); } }

  function confetti() {
    if (reduced()) return;
    const c = document.createElement("canvas"); c.className = "confetti"; document.body.appendChild(c);
    const ctx = c.getContext("2d"), dpr = window.devicePixelRatio || 1;
    c.width = innerWidth * dpr; c.height = innerHeight * dpr; ctx.scale(dpr, dpr);
    const cols = ["--gym", "--pop", "--fos", "--bb", "--sun", "--b"].map(cssVar);
    const parts = Array.from({ length: 140 }, () => ({ x: innerWidth / 2 + (Math.random() - .5) * 120, y: innerHeight * .35, vx: (Math.random() - .5) * 12, vy: -Math.random() * 12 - 4, s: 5 + Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - .5) * .3, c: cols[Math.floor(Math.random() * cols.length)] }));
    const t0 = performance.now();
    (function tick(t) {
      const dt = t - t0; ctx.clearRect(0, 0, innerWidth, innerHeight);
      parts.forEach(p => { p.vy += .32; p.x += p.vx; p.y += p.vy; p.r += p.vr; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.globalAlpha = Math.max(0, 1 - dt / 2200); ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore(); });
      if (dt < 2200) requestAnimationFrame(tick); else c.remove();
    })(t0);
  }

  function renderResult(el) {
    const p = state.profile, rk = state.ranking;
    const vals = E.RI.map(k => p.ri[k]); const mx = Math.max(...vals, 0.001);
    const code = E.hollandCode(p).split("-");
    const medals = ["🥇", "🥈", "🥉"];
    const match = (x, i) => {
      const w = x.way, s = D.schools[w.school];
      const rs = E.reasonsFor(p, w, x, cache[w.id]);
      const other = i === 0 ? rk[1].way.id : rk[0].way.id;
      const best = jobsFor(w.id).slice().sort((a, b) => (b.o35 + b.o32) - (a.o35 + a.o32)).slice(0, 2);
      return `<article class="match c-${w.cat}">
        <div class="match__sym" aria-hidden="true">${esc(w.sym)}${medals[i] ? `<span class="match__medal">${medals[i]}</span>` : ""}</div>
        <div>
          <div class="match__top"><div><h3>${EMO[w.id] || ""} ${esc(w.name)}</h3><span class="muted small">${esc(s.short)}, Unterricht auf ${LANG[w.lang]}</span></div><span class="match__pct">${x.pct} %</span></div>
          <div class="match__bar" aria-hidden="true"><div style="width:${x.pct}%;animation-delay:${i * 120}ms"></div></div>
          ${rs.pro.length ? `<ul class="pro">${rs.pro.map(t => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
          ${rs.con.length ? `<ul class="con">${rs.con.map(t => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
          ${rs.highlight ? `<p class="small" style="margin:8px 0 6px"><b>Besonders:</b> ${esc(rs.highlight)}</p>` : ""}
          ${best.length ? `<div class="match__jobs"><b>Berufe mit Zukunft</b><ul>${best.map(j => `<li>${esc(j.name)} <span class="oc o-${j.o35}">2035: ${esc(K.SCALE[String(j.o35)].short)}</span></li>`).join("")}</ul></div>` : ""}
          <div class="row"><button type="button" class="btn btn--ghost" data-open="${w.id}">Steckbrief</button><a class="btn btn--ghost" href="#vergleich/${w.id}/${other}">Mit Platz ${i === 0 ? 2 : 1} vergleichen</a></div>
        </div></article>`;
    };
    el.innerHTML = `<div>
      <div class="res-head">
        <div>
          <h1 id="h-test" tabindex="-1">Dein Ergebnis</h1>
          <p class="muted" style="margin-top:12px">Dein Interessencode nach Holland</p>
          <div class="code" aria-label="Interessencode ${code.join("-")}">${code.map((k, i) => `<b style="--tc:${TYPE_COL[k]};--rot:${[-6, 3, -2][i]}deg">${k}</b>`).join("")}</div>
          <div class="types">${code.map((k, i) => `<div><b>${k} – ${E.RI_INFO[k].name}</b>${i === 0 ? " (am stärksten)" : ""}: ${esc(E.RI_INFO[k].desc)}</div>`).join("")}</div>
        </div>
        <div>${radar(E.RI.map(k => E.RI_INFO[k].short), [{ values: vals.map(v => Math.sqrt(Math.max(0, v) / mx)), color: cssVar("--gym"), fill: 0.2 }], 300, { label: "Dein Interessenprofil", pad: 46, mx: 58 })}</div>
      </div>
      <h2 style="margin-top:30px">Deine besten Treffer</h2>
      <p class="muted" style="margin-top:8px">Die Prozentzahl zeigt, wie gut deine Antworten zu Inhalt und Art des Unterrichts passen. Sie ist eine Orientierung, kein Urteil über dich.</p>
      <div class="matches">${rk.slice(0, 5).map(match).join("")}</div>
      <details class="allres"><summary>Alle ${rk.length} Bildungswege nach Passung</summary>
        <ol>${rk.map(x => `<li><button type="button" class="linkbtn" data-open="${x.way.id}">${EMO[x.way.id] || ""} ${esc(x.way.name)} <span class="muted">(${esc(D.schools[x.way.school].short)})</span> – <b>${x.pct} %</b></button></li>`).join("")}</ol>
      </details>
      <div class="row" style="margin-top:26px">
        <button type="button" class="btn btn--pop" id="share">Ergebnis-Link kopieren</button>
        <a class="btn btn--ghost" href="#uebersicht">In der Übersicht ansehen</a>
        <button type="button" class="btn btn--ghost" id="restart">Test neu starten</button>
      </div>
      <p class="note" style="margin-top:14px">Der Link enthält nur dein Ergebnisprofil als Zahlen, keine einzelnen Antworten. Nächster Schritt: die Top-Schulen beim Tag der offenen Tür besuchen – die Termine stehen in der Übersicht.</p>
    </div>`;
    $$("[data-open]", el).forEach(b => b.addEventListener("click", () => openDetail(b.dataset.open, b)));
    $("#restart", el).addEventListener("click", () => { state.profile = null; state.ranking = null; state.answers = {}; state.qi = -1; setHash("#test"); renderTest(); });
    $("#share", el).addEventListener("click", async () => {
      const url = location.href;
      try { await navigator.clipboard.writeText(url); toast("Link kopiert"); }
      catch (e) {
        let box = $("#share-box", el);
        if (!box) { box = document.createElement("input"); box.id = "share-box"; box.readOnly = true; box.className = "share-box"; box.setAttribute("aria-label", "Ergebnis-Link"); $("#share", el).closest(".row").after(box); }
        box.value = url; box.focus(); box.select(); toast("Link markiert – jetzt kopieren");
      }
    });
    focusTitle();
    if (state.celebrate) { state.celebrate = false; setTimeout(confetti, 250); }
  }
  function toast(msg) { const t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 2200); }

  // ---------------- Methode ----------------
  function renderMethod() {
    const el = $("#view-methode"), W = E.W;
    el.innerHTML = `<div class="prose">
      <h1 id="h-methode">So funktioniert's</h1>
      <p class="lead">Der Test misst deine Interessen, vergleicht sie mit dem echten Unterricht jedes Bildungswegs und rechnet daraus eine Passung. Die Berufe-Einschätzung stützt sich auf aktuelle Studien zu KI und Arbeitsmarkt.</p>

      <h2>1. Deine Interessen: das Holland-Modell</h2>
      <p>Der amerikanische Psychologe John L. Holland hat sechs Interessenbereiche beschrieben, die in der Berufs- und Studienberatung weltweit genutzt werden. Jeder Mensch hat alle sechs in unterschiedlicher Stärke; die drei stärksten ergeben den Interessencode.</p>
      <ul class="list">${E.RI.map(k => `<li><b>${k} – ${E.RI_INFO[k].name}:</b> ${esc(E.RI_INFO[k].desc)}</li>`).join("")}</ul>
      <p>Die ${Q.length} Fragen nutzen acht verschiedene Formate. Jeder Bereich wird mehrmals aus verschiedenen Richtungen abgefragt, damit das Ergebnis nicht an einer einzelnen Antwort hängt. Zusätzlich erfasst der Test, wie du lernst, ob du studieren oder bald arbeiten willst, und ob du dir Unterricht auf Italienisch oder Englisch zutraust.</p>

      <h2>2. Das Profil jedes Bildungswegs</h2>
      <p>Die Pflichtstunden aus den Stundentafeln der Schulen sind in acht Bereiche eingeteilt. Dazu kommen ein Holland-Code für den Bildungsweg, ein Praxisanteil und eine Einschätzung, wie stark er auf ein Studium vorbereitet. Bei den italienischsprachigen Schulen und den Berufsschulen sind die Profile Schätzungen; das steht jeweils im Steckbrief.</p>

      <h2>3. Die Berechnung</h2>
      <div class="formula">
        <div><b>${Math.round(W.interest * 100)} %</b><span>Interessen-Passung: Korrelation zwischen deinem Holland-Profil und dem des Bildungswegs</span></div>
        <div><b>${Math.round(W.subject * 100)} %</b><span>Fächer-Passung: Ähnlichkeit zwischen deinem Wunsch-Stundenplan und den echten Stundenanteilen</span></div>
        <div><b>${Math.round(W.style * 100)} %</b><span>Lernstil: Wie nah liegt der Praxisanteil an dem, wie du am liebsten lernst?</span></div>
        <div><b>${Math.round(W.academic * 100)} %</b><span>Ziel nach der Schule: Studium oder Beruf</span></div>
      </div>
      <p>Danach wird der Wert angepasst, wenn ein Weg besondere Voraussetzungen hat: Aufnahmeprüfung in Musik, Schreiben im Journalismus-Schwerpunkt, Latein und Griechisch, Unterricht auf Italienisch oder Englisch, Interesse an Gastronomie. Die Skala reicht von 3 bis 97 %. Der Schulweg zählt bewusst nicht mit.</p>

      <h2>4. Berufe und Zukunft</h2>
      <p>Für jeden Bildungsweg sind die typischen Berufsfelder aufgeführt – direkt nach der Matura bzw. dem Berufsdiplom oder über ein Studium. Jedes Feld hat eine Einschätzung für 2032 (Zeitpunkt der Matura) und 2035 (Abschluss eines Bachelors):</p>
      <div class="scale-list">${["2", "1", "0", "-1", "-2"].map(k => `<span class="oc o-${k}">${esc(K.SCALE[k].label)}</span>`).join("")}</div>
      <p>Grundlage sind drei große Studien. Der Future of Jobs Report 2025 des Weltwirtschaftsforums befragte über 1.000 Arbeitgeber zu wachsenden und schrumpfenden Berufen bis 2030. Die Internationale Arbeitsorganisation ILO hat 2025 für fast 30.000 Tätigkeiten untersucht, wie stark generative KI sie übernehmen kann – mit dem Ergebnis, dass Berufe meistens verändert statt ersetzt werden. Eine Stanford-Studie von 2025 zeigt, dass KI vor allem Einstiegsjobs junger Menschen in stark betroffenen Berufen trifft. Dazu kommt die Prognose des Landes, dass Südtirol bis etwa 2032 rund 30.000 Arbeitskräfte fehlen werden, besonders in Gastgewerbe und Bau.</p>
      <p>Die Faustregel dahinter: Berufe mit viel Routine am Bildschirm sind am stärksten betroffen. Berufe mit Händen, Menschen, Verantwortung oder Arbeit vor Ort sind am sichersten. Ein Hinweis, der für Mädchen besonders wichtig ist: Laut ILO arbeiten Frauen in reichen Ländern fast dreimal so oft in Jobs mit dem höchsten Automatisierungsrisiko wie Männer – vor allem, weil sie häufiger in Büroberufen arbeiten.</p>
      <p>Das sind begründete Einschätzungen, keine Garantien. Je weiter weg, desto unsicherer.</p>

      <h2>5. Was der Test nicht kann</h2>
      <p>Er ist kein wissenschaftlich geprüftes psychologisches Testverfahren, sondern eine sorgfältig gebaute Orientierungshilfe. Er misst keine Begabung und keine Noten, und Interessen verändern sich, besonders mit 13 oder 14 Jahren. Am meisten verraten der Tag der offenen Tür, ein Schnuppertag und Gespräche mit Schüler:innen. Kostenlose Beratung, auch mit Potenzialanalyse, bietet die <a href="https://berufsberatung-studieninfo.provinz.bz.it/de/potenzialanalyse" target="_blank" rel="noopener">Ausbildungs- und Berufsberatung des Landes</a>.</p>

      <h2>Quellen</h2>
      <ul class="sources">${Object.values(D.schools).map(s => `<li><a href="${esc(s.web)}" target="_blank" rel="noopener">${esc(s.name)}</a></li>`).join("")}${K.SOURCES.map(s => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)}</a></li>`).join("")}</ul>
      <p class="note">Stand ${esc(D.stand)}. Bei Schulangaben gelten die Seiten der jeweiligen Schule.</p>

      <h2>Datenschutz</h2>
      <p>Diese Seite setzt keine Cookies, nutzt keine Tracker und lädt keine Inhalte von Drittanbietern; auch die Schriften liegen auf dem eigenen Server. Der Test wird komplett in deinem Browser berechnet.</p>
    </div>`;
  }

  route();
})();
