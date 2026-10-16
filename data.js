/* Schulwahl Brixen – Daten
   Stand: Oktober 2026. Quellen: Websites der Schulen, Stundentafeln/Flyer, Terminpläne.
   hours: Pflichtstunden über die ganze Ausbildung je Bereich (ohne Sport und Religion).
   basis: woher das Stundenprofil stammt. Bei "Schätzung" sind es Richtwerte.
   riasec: Interessenprofil des Bildungswegs nach Holland [R, I, A, S, E, C], 0–1.
   pra: Praxisanteil 0–100 (Labor, Werkstatt, Übungsfirma, Praktika).
   aca: Studienorientierung 0–1 (1 = klar auf Studium ausgerichtet).
*/
window.DATA = (function () {
  const schools = {
    fallmerayer: {
      name: "Oberschulen J. Ph. Fallmerayer",
      short: "Fallmerayer",
      addr: "Dantestraße 39E, Brixen",
      web: "https://www.fallmerayer.it/bildungswege/",
      traeger: "staatlich",
      fact: "2026/27: 517 Schüler:innen in 29 Klassen, im Schnitt knapp 18 pro Klasse."
    },
    durst: {
      name: "Fachoberschule für Wirtschaft, Grafik und Kommunikation „Julius und Gilbert Durst“",
      short: "FO Durst",
      addr: "Maria-Montessori-Straße 4, Brixen",
      web: "https://fo-brixen.it/infos-schueler-innen/infos-fuer-mittelschueler-innen/",
      traeger: "staatlich",
      fact: "Unterricht nach dem Fachraumprinzip: Die Klassen wechseln in die Räume der Fachlehrpersonen."
    },
    sowi: {
      name: "Sozialwissenschaftliches Gymnasium „Josef Gasser“",
      short: "SOWI",
      addr: "Ignaz-Mader-Straße 3, Brixen",
      web: "https://www.gymnasiumbrixen.it/schulschwerpunkte/",
      traeger: "staatlich",
      fact: "Vier Schwerpunkte unter einem Dach; Praktika in der 3. und 4. Klasse."
    },
    vinz: {
      name: "Bischöfliches Institut Vinzentinum",
      short: "Vinzentinum",
      addr: "Brennerstraße 37, Brixen",
      web: "https://www.vinzentinum.it",
      traeger: "privat (staatlich gleichgestellt)",
      fact: "Von der Diözese geführt; Tagesinternat oder Vollinternat möglich."
    },
    iis: {
      name: "IIS Bressanone – Liceo „Dante Alighieri“ und ITE „Falcone e Borsellino“",
      short: "IIS Bressanone",
      addr: "Via Prà delle Suore 1, Brixen",
      web: "https://iis-bressanone.edu.it/indirizzo-di-studio/",
      traeger: "staatlich",
      fact: "Italienischsprachige Oberschule mit Liceo und Istituto Tecnico Economico."
    },
    hell: {
      name: "Berufsbildungszentrum Gastronomie und Kulinarik „Emma Hellenstainer“",
      short: "Hellenstainer",
      addr: "Fischzuchtweg 9, Brixen",
      web: "https://www.hellenstainer.berufsschule.it/de/Berufsausbildung",
      traeger: "Landesberufsschule",
      fact: "Rund 750 Jugendliche in Vollzeit oder Lehre; Lernmodell „Lernen in Eigenverantwortung“."
    },
    tschugg: {
      name: "Berufsbildungszentrum „Christian Josef Tschuggmall“",
      short: "Tschuggmall",
      addr: "Fischzuchtweg 18, Brixen",
      web: "https://www.tschuggmall.berufsschule.it/de/",
      traeger: "Landesberufsschule",
      fact: "Berufsausbildung in der Schule, ergänzt durch Praktika; Weg bis zur Matura oder zum Meister."
    },
    fagen: {
      name: "Realgymnasium Bozen „Peter Anich“ – Campus Fagen",
      short: "Campus Fagen, Bozen",
      addr: "Fagenstraße 10, Bozen",
      web: "https://www.campusfagen.com/de/ausbildung/international-program.html",
      traeger: "staatlich",
      fact: "Seit Juni 2026 erste staatliche Oberschule Südtirols mit IB-Autorisierung für das Middle Years Programme."
    }
  };

  const categories = [
    { id: "gym", name: "Gymnasien und Licei", note: "allgemeinbildend, Matura nach 5 Jahren" },
    { id: "fos", name: "Fachoberschulen und Istituti tecnici", note: "Allgemeinbildung plus Fachrichtung, Matura nach 5 Jahren" },
    { id: "bb", name: "Berufsbildung", note: "Beruf lernen, viel Praxis; Matura über ein 4. und 5. Jahr möglich" }
  ];

  const ways = [
    // ---------- Gymnasien & Licei ----------
    {
      id: "rg", sym: "Rg", name: "Realgymnasium", school: "fallmerayer", cat: "gym", lang: "de",
      abschluss: "Matura nach 5 Jahren", woche: "33–34", total: 168, latin: 14,
      fl: "Englisch, Latein", aufnahme: "", kosten: "",
      hours: { SPR: 67, MAT: 24, NAT: 30, TEC: 0, WIR: 0, GES: 22, KRE: 10, PRX: 0 },
      basis: "Stundentafel der Schule", pra: 20, aca: 0.95,
      riasec: [0.2, 0.85, 0.35, 0.45, 0.3, 0.5],
      about: "Der breiteste allgemeinbildende Weg: Mathematik und Naturwissenschaften als Schwerpunkt, dazu Sprachen, Latein und Philosophie bis zur Matura.",
      highlights: ["5 Std. Mathematik pro Woche in den ersten zwei Jahren", "Latein von der 1. bis zur 5. Klasse", "Philosophie ab der 3. Klasse"],
      caveats: ["Latein: 14 Std. über 5 Jahre"],
      special: "latin"
    },
    {
      id: "rgan", sym: "An", name: "Realgymnasium – Angewandte Naturwissenschaften", school: "fallmerayer", cat: "gym", lang: "de",
      abschluss: "Matura nach 5 Jahren", woche: "33–34", total: 168, latin: 0,
      fl: "Englisch", aufnahme: "", kosten: "",
      hours: { SPR: 52, MAT: 22, NAT: 40, TEC: 6, WIR: 4, GES: 19, KRE: 10, PRX: 0 },
      basis: "Stundentafel der Schule", pra: 45, aca: 0.95,
      riasec: [0.45, 1.0, 0.25, 0.35, 0.25, 0.45],
      about: "Ohne Latein. Ab der 3. Klasse deutlich mehr Biologie, Chemie und Erdwissenschaften, mit Laborarbeit und Experimenten; dazu Informatik als eigenes Fach.",
      highlights: ["Gentechnisches Praktikum in der 5. Klasse", "Naturwissenschaften 6 Std. pro Woche in der 3. und 5. Klasse", "Informatik ab der 3. Klasse"],
      caveats: [],
      special: "med-light"
    },
    {
      id: "sg", sym: "Sp", name: "Sprachengymnasium", school: "fallmerayer", cat: "gym", lang: "de",
      abschluss: "Matura nach 5 Jahren", woche: "33–34", total: 168, latin: 13,
      fl: "Englisch, Französisch oder Russisch, Latein", aufnahme: "", kosten: "",
      hours: { SPR: 97, MAT: 11, NAT: 17, TEC: 0, WIR: 4, GES: 18, KRE: 6, PRX: 0 },
      basis: "Stundentafel der Schule", pra: 20, aca: 0.95,
      riasec: [0.1, 0.45, 0.6, 0.75, 0.5, 0.4],
      about: "Sprachen im Mittelpunkt: Deutsch, Italienisch, Englisch, dazu Französisch oder Russisch und Latein. Ein Sprachennachmittag mit wechselnden Kursen kommt dazu.",
      highlights: ["Sprachennachmittag in der 1.–4. Klasse, jedes Jahr neu wählbar (z. B. Spanisch, MedienFit)", "Semester oder Schuljahr im Ausland in der 4. Klasse möglich", "Vorbereitung auf Sprachzertifikate in vier Sprachen"],
      caveats: ["Latein: 13 Std. über 5 Jahre"],
      special: "lang-latin"
    },
    {
      id: "swg", sym: "So", name: "Sozialwissenschaftliches Gymnasium – Grundform", school: "sowi", cat: "gym", lang: "de",
      abschluss: "Matura nach 5 Jahren", woche: "33–35", total: 171, latin: 12,
      fl: "Englisch, Latein", aufnahme: "", kosten: "",
      hours: { SPR: 67, MAT: 13, NAT: 19, TEC: 0, WIR: 4, GES: 44, KRE: 6, PRX: 0 },
      basis: "Stundentafel der Schule", pra: 25, aca: 0.9,
      riasec: [0.1, 0.6, 0.45, 1.0, 0.35, 0.35],
      about: "Der Mensch im Mittelpunkt: Psychologie, Pädagogik, Soziologie und Anthropologie mit 5 Std. pro Woche, dazu Latein und Philosophie.",
      highlights: ["Humanwissenschaften: 25 Std. über 5 Jahre", "Praktika in der 3. und 4. Klasse", "Auslands- oder Zweitsprachenjahr möglich"],
      caveats: ["Latein: 12 Std. über 5 Jahre"],
      special: "latin"
    },
    {
      id: "swvw", sym: "Vw", name: "Sozialwissenschaftliches Gymnasium – Volkswirtschaft", school: "sowi", cat: "gym", lang: "de",
      abschluss: "Matura nach 5 Jahren", woche: "33–35", total: 171, latin: 0,
      fl: "Englisch", aufnahme: "", kosten: "",
      hours: { SPR: 57, MAT: 17.5, NAT: 17.5, TEC: 0, WIR: 18, GES: 37, KRE: 6, PRX: 0 },
      basis: "Stundentafel der Schule", pra: 30, aca: 0.9,
      riasec: [0.1, 0.55, 0.25, 0.75, 0.7, 0.5],
      about: "Ohne Latein, dafür Volkswirtschaft und Recht und etwas mehr Englisch. Sozialwissenschaften mit Psychologie, Soziologie und Forschungsmethoden.",
      highlights: ["Eigene digitale Geräte ab der 1. Klasse", "Volkswirtschaft und Recht: 18 Std. über 5 Jahre", "Praxisorientierung im Fach Recht und Wirtschaft"],
      caveats: [],
      special: ""
    },
    {
      id: "swmj", sym: "Mj", name: "Sozialwissenschaftliches Gymnasium – Medien und Journalismus", school: "sowi", cat: "gym", lang: "de",
      abschluss: "Matura nach 5 Jahren", woche: "33–35", total: 171, latin: 12,
      fl: "Englisch, Latein", aufnahme: "Aufnahmegespräch (11.–12. Jänner 2027)", kosten: "",
      hours: { SPR: 67, MAT: 13, NAT: 19, TEC: 0, WIR: 4, GES: 40, KRE: 13, PRX: 0 },
      basis: "Stundentafel der Schule", pra: 45, aca: 0.9,
      riasec: [0.15, 0.5, 0.8, 0.8, 0.55, 0.3],
      about: "Grundform Sozialwissenschaften plus Journalismus: Schülerzeitung, Podcasts, Interviews, Kurzvideos, Social Media und Medienrecht.",
      highlights: ["Eigenes Fach Medienerziehung und Journalismus, dazu Blockunterricht", "Schülerzeitung, Podcasts und Kurzvideos selbst gestalten"],
      caveats: ["Aufnahmegespräch vor der Einschreibung", "Latein: 12 Std. über 5 Jahre"],
      special: "media"
    },
    {
      id: "swmu", sym: "Mu", name: "Sozialwissenschaftliches Gymnasium – Musik", school: "sowi", cat: "gym", lang: "de",
      abschluss: "Matura nach 5 Jahren", woche: "34–36", total: 176, latin: 10,
      fl: "Englisch, Latein", aufnahme: "Aufnahmeprüfung (11.–12. Jänner 2027)", kosten: "",
      hours: { SPR: 59, MAT: 12, NAT: 15.5, TEC: 0, WIR: 4, GES: 35, KRE: 32.5, PRX: 0 },
      basis: "Stundentafel der Schule", pra: 60, aca: 0.85,
      riasec: [0.3, 0.35, 1.0, 0.75, 0.3, 0.35],
      about: "Musiktheorie, Musikgeschichte, Instrument und Gesang, Chor und Ensemble – mit Konzerten vor Publikum, dazu Humanwissenschaften.",
      highlights: ["Instrumental- und Gesangsunterricht in allen fünf Jahren", "Konzerte und Projekte vor Publikum", "Musik: rund 26 Std. über 5 Jahre"],
      caveats: ["Aufnahmeprüfung in Musik", "Latein: 10 Std. über 5 Jahre"],
      special: "music"
    },
    {
      id: "kg", sym: "Kg", name: "Klassisches Gymnasium Plus", school: "vinz", cat: "gym", lang: "de",
      abschluss: "Matura nach 5 Jahren", woche: "38 Einheiten à 45 Min.", total: null, latin: 19.5,
      fl: "Englisch, Latein, Griechisch", aufnahme: "", kosten: "Schulgeld 1.080 € pro Jahr (Privatschule)",
      hours: { SPR: 91, MAT: 14, NAT: 22.5, TEC: 2, WIR: 4, GES: 21.5, KRE: 11, PRX: 0 },
      basis: "Stundentafel der Schule (Schwerpunkt gemittelt)", pra: 15, aca: 1.0,
      riasec: [0.1, 0.75, 0.6, 0.55, 0.3, 0.55],
      about: "Humanistisches Gymnasium mit Latein und Griechisch. Ab der 4. Klasse kommt ein Schwerpunkt dazu: Kultur, Sprache & Gesellschaft oder Natur, Medizin & Technik.",
      highlights: ["Latein und Griechisch, dazu mehr Englisch und Mathematik als im Regelstundenplan", "Schwerpunkt ab der 4. Klasse frei wählbar", "Extras wie Lerncoaching, Theater, Rhetorik und Chor", "Tagesinternat oder Vollinternat möglich"],
      caveats: ["Privatschule: Schulgeld 1.080 € pro Jahr", "Latein und Griechisch über alle fünf Jahre"],
      special: "classic"
    },
    {
      id: "lsc", sym: "Ls", name: "Liceo Scientifico", school: "iis", cat: "gym", lang: "it",
      abschluss: "Matura (Esame di Stato) nach 5 Jahren", woche: "35", total: 175, latin: 15,
      fl: "Deutsch als Zweitsprache, Englisch, Latein", aufnahme: "", kosten: "",
      hours: { SPR: 70, MAT: 25, NAT: 30, TEC: 0, WIR: 4, GES: 21, KRE: 10, PRX: 0 },
      basis: "Stundentafel der Schule (PTOF 2025–2028)", pra: 20, aca: 0.95,
      riasec: [0.25, 0.9, 0.3, 0.35, 0.3, 0.55],
      about: "Italienischsprachiges naturwissenschaftliches Gymnasium: 5 Std. Mathematik in allen fünf Jahren, dazu Physik, Naturwissenschaften und Latein.",
      highlights: ["Mathematik mit Informatik: 5 Std. pro Woche in jeder Klasse", "Ab der 3. Klasse Module in Mathe und Naturwissenschaften auf Englisch", "Teilnahme an den italienischen Astronomie-Meisterschaften"],
      caveats: ["Unterricht auf Italienisch"],
      special: "italian"
    },
    {
      id: "lsb", sym: "Bm", name: "Liceo Scientifico – Curvatura biomedica", school: "iis", cat: "gym", lang: "it",
      abschluss: "Matura (Esame di Stato) nach 5 Jahren", woche: "35 + Vertiefung", total: null, latin: 15,
      fl: "Deutsch als Zweitsprache, Englisch, Latein", aufnahme: "", kosten: "",
      hours: { SPR: 70, MAT: 25, NAT: 33, TEC: 0, WIR: 4, GES: 21, KRE: 10, PRX: 0 },
      basis: "Stundentafel des Liceo Scientifico; Umfang der Vertiefung geschätzt", pra: 30, aca: 1.0,
      riasec: [0.3, 0.95, 0.2, 0.7, 0.25, 0.5],
      about: "Vertiefung im Liceo Scientifico ab der 3. Klasse für alle, die Richtung Medizin oder Gesundheitsberufe wollen.",
      highlights: ["Orientierung auf Medizin und Gesundheitsstudien", "Startet ab der 3. Klasse innerhalb des Liceo Scientifico"],
      caveats: ["Unterricht auf Italienisch", "Eine eigene Stundentafel für die Vertiefung ist nicht veröffentlicht"],
      special: "italian-med"
    },
    {
      id: "lli", sym: "Ll", name: "Liceo Linguistico", school: "iis", cat: "gym", lang: "it",
      abschluss: "Matura (Esame di Stato) nach 5 Jahren", woche: "35", total: 175, latin: 6,
      fl: "Deutsch, Englisch, Französisch, ab der 3. Klasse Spanisch, Latein (1.–2. Klasse)", aufnahme: "", kosten: "",
      hours: { SPR: 94, MAT: 17, NAT: 18, TEC: 0, WIR: 4, GES: 21, KRE: 6, PRX: 0 },
      basis: "Stundentafel der Schule (PTOF 2025–2028)", pra: 20, aca: 0.95,
      riasec: [0.1, 0.4, 0.6, 0.75, 0.55, 0.4],
      about: "Italienischsprachiges Sprachengymnasium mit Deutsch, Englisch, Französisch und ab der 3. Klasse Spanisch.",
      highlights: ["Fünf Sprachen, in Englisch, Französisch und Spanisch mit einer Stunde Konversation bei Muttersprachler:innen", "Geschichte in der 4. und 5. Klasse auf Französisch, Geschichte und Geografie in der 1. Klasse auf Deutsch", "Module in Englisch in weiteren Fächern"],
      caveats: ["Unterricht auf Italienisch"],
      special: "italian-lang"
    },
    {
      id: "ip", sym: "Ib", name: "International Program (IB) – Bozen", school: "fagen", cat: "gym", lang: "en",
      abschluss: "Weg zum IB Diploma nach 5 Jahren", woche: "34 (1.–3. Klasse)", total: null, latin: 0,
      fl: "Englisch als Unterrichtssprache, Deutsch, Italienisch", aufnahme: "Pflichtgespräch, Englisch mindestens B1+, 22 Plätze, Test bei Überbuchung", kosten: "",
      hours: { SPR: 67, MAT: 30, NAT: 33, TEC: 7, WIR: 0, GES: 13, KRE: 10, PRX: 0 },
      basis: "MYP-Stundentafel (1.–3. Klasse) auf 5 Jahre hochgerechnet", pra: 40, aca: 1.0,
      riasec: [0.35, 0.9, 0.5, 0.55, 0.5, 0.4],
      about: "Unterricht hauptsächlich auf Englisch mit starkem Fokus auf Mathematik und Naturwissenschaften; Deutsch und Italienisch als Sprach- und Literaturfächer.",
      highlights: ["Forschendes, fächerübergreifendes Lernen in kleiner Gruppe", "Personal Project in der 3. Klasse", "Unterricht ab 8:40 Uhr, drei Nachmittage pro Woche"],
      caveats: ["Die Anerkennung des IB-Diploms als Matura wird noch geklärt", "Einstieg nur in die 1. Klasse", "Schulort Bozen"],
      special: "english"
    },
    // ---------- Fachoberschulen & Istituti tecnici ----------
    {
      id: "tfoi", sym: "In", name: "Technologische Fachoberschule – Informatik", school: "fallmerayer", cat: "fos", lang: "de",
      abschluss: "Matura nach 5 Jahren", woche: "34–35", total: 173, latin: 0,
      fl: "Englisch", aufnahme: "", kosten: "",
      hours: { SPR: 49, MAT: 19, NAT: 15, TEC: 61, WIR: 4, GES: 10, KRE: 0, PRX: 0 },
      basis: "Stundentafel der Schule", pra: 65, aca: 0.65,
      riasec: [0.65, 0.8, 0.3, 0.2, 0.4, 0.6],
      about: "Softwareentwicklung, Netzwerke, Planung informatischer Systeme und Telekommunikation – mit viel Projektarbeit im Team und Kontakten zu Betrieben.",
      highlights: ["Start-up Lab in der 5. Klasse, mit externen Firmen", "„Treffpunkt Informatikerinnen“ vernetzt Mädchen in der Fachrichtung", "Erste zwei Jahre allgemein-technisch, Fachrichtung danach noch überprüfbar"],
      caveats: [],
      special: ""
    },
    {
      id: "wfov", sym: "Wf", name: "Wirtschaftsfachoberschule – Verwaltung, Finanzwesen und Marketing", school: "durst", cat: "fos", lang: "de",
      abschluss: "Matura nach 5 Jahren", woche: "33–35", total: 173, latin: 0,
      fl: "Englisch", aufnahme: "", kosten: "",
      hours: { SPR: 53, MAT: 17, NAT: 10, TEC: 9, WIR: 53, GES: 16, KRE: 0, PRX: 0 },
      basis: "Stundentafel der Schule", pra: 50, aca: 0.65,
      riasec: [0.15, 0.35, 0.15, 0.45, 0.85, 0.9],
      about: "Wirtschaft praktisch: Buchhaltung, Marketing, Management, Handels- und Steuerrecht, dazu Übungsfirma und Praktika.",
      highlights: ["Übungsfirma: ein echter Betrieb im Klassenzimmer", "Projekt „Digitale Klasse“ mit Notebook für alle", "Betriebswirtschaft mit 7–9 Std. pro Woche ab der 3. Klasse"],
      caveats: [],
      special: ""
    },
    {
      id: "wfot", sym: "To", name: "Wirtschaftsfachoberschule – Tourismus", school: "durst", cat: "fos", lang: "de",
      abschluss: "Matura nach 5 Jahren", woche: "33–35", total: 173, latin: 0,
      fl: "Englisch, ab der 3. Klasse Spanisch oder Französisch", aufnahme: "", kosten: "",
      hours: { SPR: 64, MAT: 17, NAT: 10, TEC: 4, WIR: 35, GES: 22, KRE: 6, PRX: 0 },
      basis: "Stundentafel der Schule", pra: 55, aca: 0.65,
      riasec: [0.2, 0.3, 0.4, 0.75, 0.85, 0.55],
      about: "Tourismusmanagement, Tourismusgeografie und -recht, Kunst und Territorium und viele Sprachen – mit Übungsfirma und Betriebspraktika.",
      highlights: ["Übungsfirma „Hotel“", "Dritte Fremdsprache ab der 3. Klasse", "Betriebspraktika und Sprachaufenthalte"],
      caveats: [],
      special: "lang"
    },
    {
      id: "tfog", sym: "Gk", name: "Technologische Fachoberschule – Grafik und Kommunikation", school: "durst", cat: "fos", lang: "de",
      abschluss: "Matura nach 5 Jahren", woche: "33–35", total: 173, latin: 0,
      fl: "Englisch", aufnahme: "", kosten: "",
      hours: { SPR: 53, MAT: 17, NAT: 9, TEC: 29, WIR: 4, GES: 10, KRE: 36, PRX: 0 },
      basis: "Stundentafel der Schule", pra: 75, aca: 0.6,
      riasec: [0.55, 0.35, 1.0, 0.3, 0.45, 0.35],
      about: "Grafik und Design, Web und Multimedia, Druck, Film und Ton, Werbung und Marketing – mit viel praktischem Fachunterricht.",
      highlights: ["Mac-Räume und Fotostudio", "Fachpraxis mit 5–6 Std. pro Woche ab der 3. Klasse", "Betriebspraktika in Agenturen und Studios"],
      caveats: [],
      special: ""
    },
    {
      id: "ite", sym: "Af", name: "ITE – Amministrazione, Finanza e Marketing", school: "iis", cat: "fos", lang: "it",
      abschluss: "Matura (Esame di Stato) nach 5 Jahren", woche: "36", total: 180, latin: 0,
      fl: "Deutsch als Zweitsprache, Englisch", aufnahme: "", kosten: "",
      hours: { SPR: 55, MAT: 17, NAT: 10, TEC: 13, WIR: 54, GES: 16, KRE: 0, PRX: 0 },
      basis: "Stundentafel der Schule (PTOF 2025–2028)", pra: 40, aca: 0.65,
      riasec: [0.15, 0.35, 0.15, 0.45, 0.85, 0.9],
      about: "Italienischsprachige Wirtschaftsfachoberschule: Betriebswirtschaft, Recht, Volkswirtschaft und Informatik.",
      highlights: ["Betriebswirtschaft mit 8–9 Std. pro Woche ab der 3. Klasse", "Informatik in allen fünf Jahren, ab der 3. Klasse teilweise auf Englisch", "Schule-Arbeit-Projekte (PCTO) in Betrieben"],
      caveats: ["Unterricht auf Italienisch"],
      special: "italian"
    },
    // ---------- Berufsbildung ----------
    {
      id: "hfs", sym: "Hf", name: "Hotelfachschule – erste zwei Jahre", school: "hell", cat: "bb", lang: "de",
      abschluss: "Ab der 3. Klasse Landeshotelfachschule in Meran oder Bruneck, Abschluss Hotelkaufmann/-frau mit Matura", woche: "36", total: null, latin: 0,
      fl: "Englisch, Französisch", aufnahme: "", kosten: "",
      hours: { SPR: 22, MAT: 6, NAT: 8, TEC: 0, WIR: 4, GES: 4, KRE: 0, PRX: 22 },
      basis: "Stundentafel der Schule", pra: 60, aca: 0.6,
      riasec: [0.5, 0.2, 0.35, 0.8, 0.75, 0.5],
      about: "Breite Grundausbildung in Hotellerie und Gastronomie mit Schwerpunkt Sprachen: neben Deutsch und Italienisch auch Englisch und Französisch, dazu Praxis in Service, Küche und Empfang.",
      highlights: ["Vier Sprachen ab der 1. Klasse", "Praxis in Service, Kochen sowie Empfang und Beherbergung", "Danach Matura-Weg an der Landeshotelfachschule oder Einstieg in eine Berufsfachschule"],
      caveats: ["Ab der 3. Klasse Schulwechsel nach Meran (Kaiserhof) oder Bruneck"],
      special: "gastro"
    },
    {
      id: "bfk", sym: "Kü", name: "Berufsfachschule Kochen", school: "hell", cat: "bb", lang: "de",
      abschluss: "Berufsbefähigung nach 3 Jahren; mit 4. Jahr Berufsdiplom, mit 5. Jahr Matura", woche: "36", total: null, latin: 0,
      fl: "Englisch", aufnahme: "", kosten: "",
      hours: { SPR: 22, MAT: 6, NAT: 8, TEC: 2, WIR: 2, GES: 5, KRE: 0, PRX: 54 },
      basis: "Stundentafel der Schule", pra: 95, aca: 0.25,
      riasec: [0.9, 0.25, 0.65, 0.45, 0.4, 0.45],
      about: "Drei Jahre ganztägig mit viel Praxis in der Schulküche, Speisen- und Nahrungsmittelkunde und Pflichtpraktika. Danach Spezialisierung Patisserie und ein maturaführendes 5. Jahr möglich.",
      highlights: ["Praxis Kochen mit 14 Std. pro Woche in der 2. und 3. Klasse", "Pflichtpraktika: je 3 Wochen in der 2. und 3. Klasse, 5 Wochen im Sommer", "Maturalehrgang Önogastronomie im 5. Jahr"],
      caveats: [],
      special: "gastro"
    },
    {
      id: "bfs", sym: "Se", name: "Berufsfachschule Service", school: "hell", cat: "bb", lang: "de",
      abschluss: "Berufsbefähigung nach 3 Jahren; mit 4. Jahr Berufsdiplom, mit 5. Jahr Matura", woche: "36", total: null, latin: 0,
      fl: "Englisch", aufnahme: "", kosten: "",
      hours: { SPR: 28, MAT: 6, NAT: 4, TEC: 2, WIR: 14, GES: 7, KRE: 0, PRX: 38 },
      basis: "Stundentafel der Schule", pra: 90, aca: 0.25,
      riasec: [0.55, 0.15, 0.35, 0.95, 0.65, 0.45],
      about: "Service im Restaurant und an der Bar, Getränke- und Speisenkunde, Restaurantführung und Touristik – mit Pflichtpraktika.",
      highlights: ["Praxis Servieren mit 12 Std. pro Woche in der 2. und 3. Klasse", "Spezialisierungsjahr Service und Front Office", "Maturalehrgang Önogastronomie im 5. Jahr"],
      caveats: [],
      special: "gastro"
    },
    {
      id: "bfbk", sym: "Bä", name: "Berufsfachschule Konditorei und Bäckerei", school: "hell", cat: "bb", lang: "de",
      abschluss: "Berufsbefähigung nach 3 Jahren; mit 4. Jahr Berufsdiplom, mit 5. Jahr Matura", woche: "36", total: null, latin: 0,
      fl: "Englisch", aufnahme: "Verfahren zur Feststellung des Vorrangs vor der Einschreibung (Anmeldung im Sekretariat)", kosten: "",
      hours: { SPR: 22, MAT: 8, NAT: 12, TEC: 2, WIR: 2, GES: 5, KRE: 0, PRX: 48 },
      basis: "Stundentafel der Schule", pra: 95, aca: 0.25,
      riasec: [0.9, 0.3, 0.75, 0.3, 0.35, 0.5],
      about: "Brot, Gebäck, Torten und Pralinen in der Lehrbackstube, dazu Rohstoff- und Ernährungslehre – mit Pflichtpraktika.",
      highlights: ["Praxis Konditorei mit 8 Std. pro Woche ab der 2. Klasse", "Spezialisierungsjahr Patisserie", "Maturalehrgang Önogastronomie im 5. Jahr"],
      caveats: ["Vorrang-Verfahren vor der Einschreibung"],
      special: "gastro"
    },
    {
      id: "bfmt", sym: "Me", name: "Berufsfachschule Metalltechnik mit Robotik", school: "tschugg", cat: "bb", lang: "de",
      abschluss: "Berufsbefähigung nach 3 Jahren; mit 4. Jahr Berufsdiplom, mit 5. Jahr Matura", woche: "36", total: null, latin: 0,
      fl: "Englisch", aufnahme: "", kosten: "",
      hours: { SPR: 22, MAT: 6, NAT: 3, TEC: 23, WIR: 2, GES: 5, KRE: 2, PRX: 36 },
      basis: "Stundentafel der Schule", pra: 95, aca: 0.25,
      riasec: [1.0, 0.5, 0.2, 0.2, 0.25, 0.5],
      about: "Metall bearbeiten, Maschinenbau und Robotik, Stahlbau – mit viel Werkstattpraxis.",
      highlights: ["Praxis Maschinenbau mit Robotik und Stahlbau ab der 2. Klasse", "Spezialisierungsjahr Maschinenbau mit Robotik (Berufsdiplom EQR 4)", "Weg bis zur Matura oder Meisterausbildung"],
      caveats: [],
      special: ""
    },
    {
      id: "bfht", sym: "Hz", name: "Berufsfachschule Holztechnik", school: "tschugg", cat: "bb", lang: "de",
      abschluss: "Berufsbefähigung nach 3 Jahren; mit 4. Jahr Berufsdiplom, mit 5. Jahr Matura", woche: "36", total: null, latin: 0,
      fl: "Englisch", aufnahme: "", kosten: "",
      hours: { SPR: 22, MAT: 10, NAT: 3, TEC: 15, WIR: 2, GES: 5, KRE: 4, PRX: 38 },
      basis: "Stundentafel der Schule", pra: 95, aca: 0.25,
      riasec: [1.0, 0.35, 0.55, 0.2, 0.3, 0.45],
      about: "Tischlerei und Möbelbau – vom Entwurf mit CAD bis zum fertigen Stück, mit 14 Std. Werkstatt pro Woche ab der 2. Klasse.",
      highlights: ["Praxis Holz mit 14 Std. pro Woche ab der 2. Klasse", "Entwerfen, Fachzeichnen, CAD und Raumgestaltung", "Spezialisierungsjahr Möbelbau mit Aufträgen für echte Kund:innen"],
      caveats: [],
      special: ""
    },
    {
      id: "bffi", sym: "Fi", name: "Berufsfachschule Fachinformatik und Netzwerktechnik", school: "tschugg", cat: "bb", lang: "de",
      abschluss: "Berufsbefähigung nach 3 Jahren; mit 4. Jahr Berufsdiplom, mit 5. Jahr Matura", woche: "36", total: null, latin: 0,
      fl: "Englisch", aufnahme: "", kosten: "",
      hours: { SPR: 29, MAT: 9, NAT: 3, TEC: 40, WIR: 2, GES: 5, KRE: 0, PRX: 10 },
      basis: "Stundentafel der Schule (Module umgerechnet)", pra: 80, aca: 0.3,
      riasec: [0.6, 0.7, 0.25, 0.25, 0.3, 0.65],
      about: "Computer, Anwendungs- und Webentwicklung, Netze und Automatisierung – ab der 2. Klasse in Modulen mit 18 Std. pro Woche.",
      highlights: ["Modularer Fachunterricht ab der 2. Klasse", "Spezialisierungsjahr Fachinformatik und Netzwerktechnik", "Danach Lehrgang für Systemadministration oder 5. Jahr bis zur Matura"],
      caveats: ["Beim Spezialisierungsjahr gibt es ein Auswahlverfahren, wenn es mehr Anmeldungen als Plätze gibt"],
      special: ""
    },
    {
      id: "bfhv", sym: "Hv", name: "Berufsfachschule Handel und Verwaltung", school: "tschugg", cat: "bb", lang: "de",
      abschluss: "Berufsbefähigung nach 3 Jahren; mit 4. Jahr Berufsdiplom, mit 5. Jahr Matura", woche: "34–36", total: null, latin: 0,
      fl: "Englisch", aufnahme: "", kosten: "",
      hours: { SPR: 26, MAT: 6, NAT: 2, TEC: 11, WIR: 14, GES: 7, KRE: 2, PRX: 29 },
      basis: "Stundentafel der Schule", pra: 70, aca: 0.3,
      riasec: [0.2, 0.2, 0.15, 0.55, 0.75, 0.9],
      about: "Büro, Verkauf und Werbung – mit Lernbüro, Praxis Verkauf und Werbetechnik. In der 3. Klasse trennen sich die Bereiche Handel und Verwaltung.",
      highlights: ["Lernbüro und Praxis Verkauf", "Ab der 3. Klasse Schwerpunkt Handel oder Verwaltung", "Spezialisierungsjahr Handel und Verwaltung"],
      caveats: [],
      special: ""
    },
    {
      id: "bfsp", sym: "Fr", name: "Schönheitspflege und Frisur – 1. Klasse", school: "tschugg", cat: "bb", lang: "de",
      abschluss: "Abschlusszeugnis nach 1 Jahr; danach Lehre oder Berufsfachschule für Schönheitspflege", woche: "36", total: null, latin: 0,
      fl: "Englisch", aufnahme: "", kosten: "",
      hours: { SPR: 8, MAT: 2, NAT: 6, TEC: 2, WIR: 0, GES: 3, KRE: 0, PRX: 12 },
      basis: "Stundentafel der Schule", pra: 90, aca: 0.15,
      riasec: [0.75, 0.2, 0.75, 0.8, 0.45, 0.35],
      about: "Ein Jahr, um die Berufe Kosmetik und Friseur auszuprobieren: Praxis Körperpflege und Praxis Friseur mit je 6 Std. pro Woche, handlungsorientierter Unterricht.",
      highlights: ["Praxis Körperpflege und Praxis Friseur", "Danach meist Lehre als Friseur:in oder Schönheitspfleger:in"],
      caveats: ["Nur ein Jahr in Brixen – die Berufsfachschule für Schönheitspflege geht in Bruneck oder Meran weiter"],
      special: "beauty"
    }
  ];

  const events = [
    { date: "2026-11-27", time: "14:00–17:00", school: "fallmerayer", what: "Tag der offenen Tür", open: true },
    { date: "2026-11-27", time: "14:00–17:00", school: "sowi", what: "Tag der offenen Tür", open: true },
    { date: "2026-11-27", time: "", school: "vinz", what: "Tag der offenen Tür (1. Tag)", open: true },
    { date: "2026-11-28", time: "7:50–13:05", school: "durst", what: "Tag der offenen Tür im laufenden Unterricht", open: true },
    { date: "2026-11-28", time: "", school: "vinz", what: "Tag der offenen Tür (2. Tag)", open: true },
    { date: "2026-11-28", time: "", school: "iis", what: "Giornata delle porte aperte (Tag der offenen Tür)", open: true },
    { date: "2026-11-28", time: "", school: "hell", what: "Tag der offenen Tür", open: true },
    { date: "2026-11-28", time: "", school: "tschugg", what: "Tag der offenen Tür", open: true },
    { date: "2026-12-09", time: "14:10–16:40", school: "sowi", what: "Schnuppernachmittag mit Probestunden" },
    { date: "2026-12-12", time: "9:00–11:30", school: "fagen", what: "Open Day International Program (Platz reservieren)", open: true },
    { date: "2026-12-14", time: "14:10–16:40", school: "sowi", what: "Schnuppernachmittag mit Probestunden" },
    { date: "2027-01-11", time: "11.–12. Jänner", school: "sowi", what: "Aufnahmeprüfung Musik und Aufnahmegespräch Journalismus" },
    { date: "2027-01-12", time: "", school: "fagen", what: "Schnuppertag International Program" },
    { date: "2027-01-13", time: "14:00–16:30", school: "durst", what: "Schnuppernachmittag Finanzwesen und Marketing" },
    { date: "2027-01-15", time: "", school: null, what: "Online-Einschreibung startet (myCIVIS)" },
    { date: "2027-01-15", time: "", school: "fagen", what: "Schnuppertag International Program" },
    { date: "2027-01-18", time: "14:00–16:30", school: "durst", what: "Schnuppernachmittag Tourismus" },
    { date: "2027-01-19", time: "14:00–16:30", school: "durst", what: "Schnuppernachmittag Grafik und Kommunikation" },
    { date: "2027-02-15", time: "", school: null, what: "Letzter Tag der Online-Einschreibung" }
  ];


  const attrs = [
    { id: "SPR", name: "Sprachen" },
    { id: "MAT", name: "Mathe" },
    { id: "NAT", name: "Natur" },
    { id: "TEC", name: "Technik & IT", short: "Technik" },
    { id: "WIR", name: "Wirtschaft" },
    { id: "GES", name: "Mensch & Gesellschaft", short: "Gesellschaft" },
    { id: "KRE", name: "Kreativ" },
    { id: "PRA", name: "Praxis" }
  ];

  return { schools, categories, ways, events, attrs, stand: "Oktober 2026" };
})();
