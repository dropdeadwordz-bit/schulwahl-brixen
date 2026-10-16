/* Wochenstunden pro Schuljahr (Stundentafeln der Schulen, Stand Oktober 2026).
   Jede Zeile: [Fach, [1., 2., 3., 4., 5. Klasse]]; null = Fach in dieser Klasse nicht vorhanden.
   Fehlt ein Bildungsweg hier, zeigt die Seite „Stundentafel folgt“. */
window.TAFELN = (function () {
  const n = null;
  const sportRel = [["Bewegung und Sport", [2, 2, 2, 2, 2]], ["Katholische Religion", [1, 1, 1, 1, 1]]];
  // Gemeinsame Blöcke für das 4. und 5. Jahr
  const SHARED = {
    patisserie: { title: "4. Jahr: Spezialisierung Patisserie", heads: ["4."], rows: [
      ["Deutsch", [3]], ["Italienisch", [2]], ["Englisch", [2]], ["Mathematik", [3]], ["Betriebswirtschaft", [2]], ["Geschichte und Gesellschaftslehre", [2]],
      ["Nahrungsmittelkunde (Ernährung, Rohstoffe, Diätetik)", [3]], ["Fachkunde Nahrungsmitteltechnologie, Arbeitskunde", [6]], ["EDV-Anwendungen", [3]],
      ["Praxis Patisserie", [8]], ["Bewegung und Sport", [1]], ["Religion", [1]]
    ], total: [36] },
    frontoffice: { title: "4. Jahr: Spezialisierung Service und Front Office", heads: ["4."], rows: [
      ["Deutsch", [3]], ["Italienisch", [2]], ["Englisch", [2]], ["Mathematik", [3]], ["Betriebswirtschaft", [2]], ["Geschichte und Gesellschaftslehre", [2]],
      ["EDV-Anwendungen", [3]], ["Empfang und Beherbergung", [4]], ["Ernährungslehre", [2]], ["Praxis Empfang / Hauswirtschaft", [3]],
      ["Restaurantführung und -organisation", [3]], ["Praxis Service", [5]], ["Bewegung und Sport", [1]], ["Religion", [1]]
    ], total: [36] },
    oeno: { title: "5. Jahr: Maturalehrgang Önogastronomie", heads: ["5."], rows: [
      ["Deutsch", [5]], ["Italienisch", [4]], ["Englisch", [3]], ["Geschichte", [3]], ["Mathematik", [4]], ["BWL", [3]],
      ["Ökologie und Nachhaltigkeit", [3]], ["Projektmanagement", [2]], ["Projekte", [3]], ["Ernährungslehre und Lebensmitteltechnologie", [3]],
      ["Bewegung und Sport", [1]], ["Religion", [1]]
    ], total: [35] },
    matura5: { title: "5. Jahr: Matura", heads: ["5."], rows: [
      ["Deutsch", [5]], ["Italienisch", [4]], ["Englisch", [2]], ["Geschichte", [3]], ["Mathematik", [4]], ["Betriebswirtschaftslehre", [3]],
      ["Fachrichtungsbezogene Wirtschaft – technische Physik", [5]], ["Projektmanagement", [2]], ["Projekte", [3]],
      ["Installation, Wartung, Instandhaltung bzw. Fertigungstechnik und Produktion", [2]], ["Bewegung und Sport", [1]], ["Religion", [1]]
    ], total: [35] }
  };

  const T = {
    rg: {
      rows: [
        ["Deutsch", [4, 4, 3, 4, 4]], ["Italienisch", [4, 4, 4, 3, 4]], ["Englisch", [3, 3, 3, 3, 3]], ["Latein", [3, 3, 3, 3, 2]],
        ["Geschichte und Geografie", [3, 3, n, n, n]], ["Geschichte", [n, n, 2, 2, 3]], ["Philosophie", [n, n, 3, 3, 3]],
        ["Mathematik / Informatik", [5, 5, n, n, n]], ["Mathematik", [n, n, 5, 5, 4]], ["Physik", [2, 2, 3, 3, 3]],
        ["Naturwissenschaften", [4, 4, 3, 3, 3]], ["Zeichnen und Kunstgeschichte", [2, 2, 2, 2, 2]], ...sportRel
      ],
      total: [33, 33, 34, 34, 34],
      notes: ["Gesellschaftliche Bildung fließt in den Unterricht ein.", "Dazu 1 Std. Wahlbereich pro Woche."]
    },
    rgan: {
      rows: [
        ["Deutsch", [4, 4, 3, 4, 4]], ["Italienisch", [4, 4, 4, 4, 3]], ["Englisch", [3, 3, 3, 3, 2]],
        ["Geschichte und Geografie", [3, 3, n, n, n]], ["Geschichte", [n, n, 2, 2, 3]], ["Philosophie", [n, n, 2, 2, 2]],
        ["Mathematik / Informatik", [5, 5, n, n, n]], ["Mathematik", [n, n, 4, 4, 4]], ["Informatik", [n, n, 2, 2, 2]],
        ["Physik", [3, 3, 3, 3, 3]], ["Naturwissenschaften", [4, 4, 6, 5, 6]], ["Zeichnen und Kunstgeschichte", [2, 2, 2, 2, 2]],
        ["Recht und Wirtschaft", [2, 2, n, n, n]], ...sportRel
      ],
      total: [33, 33, 34, 34, 34],
      notes: ["Gesellschaftliche Bildung ist in die anderen Fächer integriert.", "Dazu 1 Std. Wahlbereich pro Woche."]
    },
    sg: {
      rows: [
        ["Deutsch", [4, 4, 3, 4, 4]], ["Italienisch", [4, 4, 4, 3, 4]], ["Englisch", [3, 4, 4, 4, 4]], ["Französisch oder Russisch", [4, 4, 3, 4, 4]],
        ["Latein", [3, 3, 3, 2, 2]], ["Sprachennachmittag", [2, 2, 2, 2, n]],
        ["Geschichte und Geografie", [3, 2, n, n, n]], ["Geschichte", [n, n, 2, 2, 3]], ["Philosophie", [n, n, 2, 2, 2]],
        ["Mathematik / Informatik", [3, 2, n, n, n]], ["Mathematik", [n, n, 2, 2, 2]], ["Physik", [n, n, 2, 2, 2]],
        ["Naturwissenschaften", [2, 3, 2, 2, 2]], ["Kunstgeschichte", [n, n, 2, 2, 2]], ["Recht und Wirtschaft", [2, 2, n, n, n]], ...sportRel
      ],
      total: [33, 33, 34, 34, 34],
      notes: ["Gesellschaftliche Bildung ist in die anderen Fächer integriert.", "Dazu 1 Std. Wahlbereich pro Woche."]
    },
    tfoi: {
      rows: [
        ["Deutsch", [4, 4, 3, 3, 3]], ["Italienisch", [4, 4, 3, 3, 3]], ["Englisch", [3, 3, 3, 3, 3]], ["Geschichte", [2, 2, 2, 2, 2]],
        ["Mathematik", [4, 4, 4, 4, 3]], ["Biologie und Erdwissenschaften", [3, 2, n, n, n]], ["Chemie", [2, 3, n, n, n]], ["Physik", [2, 3, n, n, n]],
        ["Recht und Wirtschaft", [2, 2, n, n, n]], ["Technologien und Technisches Zeichnen", [3, 2, n, n, n]],
        ["Angewandte Technologien und wiss. Arbeiten", [n, 2, n, n, n]], ["Informatik", [2, n, 6, 6, 7]], ["Systeme und Netze", [n, n, 4, 5, 4]],
        ["Technologien und Planung informatischer Systeme", [n, n, 4, 3, 4]], ["Telekommunikation", [n, n, 3, 3, n]],
        ["Projektmanagement und Betriebsorganisation", [n, n, n, n, 3]], ...sportRel
      ],
      total: [34, 34, 35, 35, 35],
      notes: ["Gesellschaftliche Bildung ist in die anderen Fächer integriert.", "Dazu 1 Std. Wahlbereich pro Woche."]
    },
    wfov: {
      rows: [
        ["Deutsch", [4, 4, 3, 4, 4]], ["Italienisch", [4, 4, 4, 3, 4]], ["Englisch", [3, 3, 3, 3, 3]], ["Geschichte", [2, 2, 2, 2, 2]],
        ["Mathematik", [4, 4, 3, 3, 3]], ["Biologie und Erdwissenschaften", [3, 2, n, n, n]], ["Physik und Chemie", [2, 3, n, n, n]],
        ["Recht und Wirtschaft", [2, 2, n, n, n]], ["Betriebswirtschaft", [2, 2, 7, 8, 9]], ["Geographie", [2, 4, n, n, n]],
        ["Informations- und Kommunikationstechnologien", [2, 2, 2, 2, 1]], ["Volkswirtschaft", [n, n, 3, 2, 3]], ["Rechtskunde", [n, n, 3, 3, 3]],
        ["Wirtschaftsgeographie", [n, n, 2, 2, n]], ...sportRel
      ],
      total: [33, 35, 35, 35, 35],
      notes: ["Dazu fächerübergreifende Lernangebote: 34 Std. pro Schuljahr.", "Dazu 1 Std. Wahlbereich pro Woche."]
    },
    wfot: {
      rows: [
        ["Deutsch", [4, 4, 4, 4, 4]], ["Italienisch", [4, 4, 4, 4, 4]], ["Englisch", [3, 3, 3, 3, 3]], ["Spanisch oder Französisch", [n, n, 3, 3, 3]],
        ["Geschichte", [2, 2, 2, 2, 2]], ["Mathematik", [4, 4, 3, 3, 3]], ["Biologie und Erdwissenschaften", [3, 2, n, n, n]], ["Physik und Chemie", [2, 3, n, n, n]],
        ["Recht und Wirtschaft", [2, 2, n, n, n]], ["Informations- und Kommunikationstechnologien", [2, 2, n, n, n]], ["Geographie", [2, 4, n, n, n]],
        ["Betriebswirtschaft", [2, 2, n, n, n]], ["Betriebswirtschaft und Tourismuslehre", [n, n, 6, 6, 6]],
        ["Rechtskunde und Tourismusgesetzgebung", [n, n, 3, 3, 3]], ["Tourismusgeographie", [n, n, 2, 2, 2]], ["Kunst und Territorium", [n, n, 2, 2, 2]], ...sportRel
      ],
      total: [33, 35, 35, 35, 35],
      notes: ["Dazu fächerübergreifende Lernangebote: 34 Std. pro Schuljahr.", "Dazu 1 Std. Wahlbereich pro Woche."]
    },
    tfog: {
      rows: [
        ["Deutsch", [4, 4, 3, 4, 4]], ["Italienisch", [4, 4, 4, 4, 3]], ["Englisch", [3, 3, 3, 3, 3]], ["Geschichte", [2, 2, 2, 2, 2]],
        ["Mathematik", [4, 4, 3, 3, 3]], ["Biologie und Erdwissenschaften", [3, 2, n, n, n]], ["Physik und Chemie", [2, 2, n, n, n]],
        ["Recht und Wirtschaft", [2, 2, n, n, n]], ["Informations- und Kommunikationstechnologien", [2, 2, n, n, n]],
        ["Technologien und Technisches Zeichnen", [4, 5, n, n, n]], ["Angewandte Technologien und wiss. Arbeiten", [n, 2, n, n, n]],
        ["Geschichte der Kunst und des Kommunikationsdesigns", [n, n, 2, 2, n]], ["Theorie der Kommunikation", [n, n, 3, 2, n]],
        ["Fachspezifischer Praxisunterricht", [n, n, 5, 5, 6]], ["Multimediale Entwürfe", [n, n, 3, 4, 4]],
        ["Technologie der Produktionsprozesse", [n, n, 4, 3, 3]], ["Organisation und Führung der Produktionsprozesse", [n, n, n, n, 4]], ...sportRel
      ],
      total: [33, 35, 35, 35, 35],
      notes: ["Dazu fächerübergreifende Lernangebote: 34 Std. pro Schuljahr.", "Dazu 1 Std. Wahlbereich pro Woche."]
    },
    swg: {
      rows: [
        ["Deutsch", [4, 4, 4, 4, 4]], ["Italienisch", [4, 4, 4, 4, 4]], ["Englisch", [3, 3, 3, 3, 3]], ["Latein", [3, 3, 2, 2, 2]],
        ["Humanwissenschaften", [5, 5, 5, 5, 5]], ["Geschichte und Geografie", [3, 3, n, n, n]], ["Geschichte", [n, n, 2, 2, 2]], ["Philosophie", [n, n, 2, 3, 2]],
        ["Mathematik und Informatik", [3, 3, n, n, n]], ["Mathematik", [n, n, 3, 2, 2]], ["Physik", [n, n, 2, 2, 2]], ["Naturwissenschaften", [3, 3, 2, 2, 3]],
        ["Kunstgeschichte", [n, n, 2, 2, 2]], ["Recht und Wirtschaft", [2, 2, n, n, n]], ["Fächerübergreifende Lernangebote", [n, n, 1, 1, 1]], ...sportRel
      ],
      total: [33, 33, 35, 35, 35],
      notes: ["In der 1. und 2. Klasse ist das fächerübergreifende Lernangebot in den Unterricht integriert.", "Dazu 1 Std. Wahlbereich pro Woche."]
    },
    swvw: {
      rows: [
        ["Deutsch", [4, 4, 4, 4, 4]], ["Italienisch", [4, 4, 4, 4, 4]], ["Englisch", [4, 4, 3, 3, 3]],
        ["Sozialwissenschaften", [4, 4, 3, 4, 4]], ["Volkswirtschaft und Recht", [4, 4, 3, 3, 4]],
        ["Geschichte und Geografie", [3, 3, n, n, n]], ["Geschichte", [n, n, 2, 2, 2]], ["Philosophie", [n, n, 2, 2, 2]],
        ["Mathematik und Informatik", [4, 4, n, n, n]], ["Mathematik", [n, n, 4, 3, 2.5]], ["Physik", [n, n, 2, 2, 1.5]], ["Naturwissenschaften", [3, 3, 2, 2, 2]],
        ["Kunstgeschichte", [n, n, 2, 2, 2]], ["Fächerübergreifende Lernangebote", [n, n, 1, 1, 1]], ...sportRel
      ],
      total: [33, 33, 35, 35, 35],
      notes: ["In der 1. und 2. Klasse ist das fächerübergreifende Lernangebot in den Unterricht integriert.", "Dazu 1 Std. Wahlbereich pro Woche."]
    },
    swmj: {
      rows: [
        ["Deutsch", [4, 4, 4, 4, 4]], ["Italienisch", [4, 4, 4, 4, 4]], ["Englisch", [3, 3, 3, 3, 3]], ["Latein", [3, 3, 2, 2, 2]],
        ["Humanwissenschaften", [4, 4, 4, 4, 5]], ["Medienerziehung und Journalismus", [1, 1, 2, 2, 1]],
        ["Geschichte und Geografie", [3, 3, n, n, n]], ["Geschichte", [n, n, 2, 2, 2]], ["Philosophie", [n, n, 2, 3, 2]],
        ["Mathematik und Informatik", [3, 3, n, n, n]], ["Mathematik", [n, n, 3, 2, 2]], ["Physik", [n, n, 2, 2, 2]], ["Naturwissenschaften", [3, 3, 2, 2, 3]],
        ["Kunstgeschichte", [n, n, 2, 2, 2]], ["Recht und Wirtschaft", [2, 2, n, n, n]], ...sportRel
      ],
      total: [33, 33, 35, 35, 35],
      notes: ["In der 1. und 2. Klasse zusätzlich 34 Std. Blockunterricht zu Medien und Journalismus.", "Dazu 1 Std. Wahlbereich pro Woche."]
    },
    swmu: {
      rows: [
        ["Deutsch", [4, 4, 3, 3, 3]], ["Italienisch", [4, 4, 3, 3, 3]], ["Englisch", [3, 3, 3, 3, 3]], ["Latein", [2, 2, 2, 2, 2]],
        ["Humanwissenschaften", [3, 3, 4, 4, 4]], ["Musiktheorie / -technologie", [3, 3, n, n, n]], ["Musiktheorie und Musikgeschichte", [n, n, 3, 3, 3]],
        ["Instrument und Gesang", [1, 1, 1.5, 1.5, 1.5]], ["Ensemble und Chor", [1, 1, 1, 1, 1]],
        ["Geschichte und Geografie", [2, 3, n, n, n]], ["Geschichte", [n, n, 2, 2, 2]], ["Philosophie", [n, n, 2, 2, 2]],
        ["Mathematik und Informatik", [3, 3, n, n, n]], ["Mathematik", [n, n, 2, 2, 2]], ["Physik", [n, n, 1.5, 1.5, 1.5]], ["Naturwissenschaften", [3, 2, 2, 2, 2]],
        ["Kunstgeschichte", [n, n, 2, 2, 2]], ["Recht und Wirtschaft", [2, 2, n, n, n]], ["Fächerübergreifende Lernangebote", [n, n, 1, 1, 1]], ...sportRel
      ],
      total: [34, 34, 36, 36, 36],
      notes: ["In der 1. und 2. Klasse ist das fächerübergreifende Lernangebot in den Unterricht integriert.", "Dazu 1 Std. Wahlbereich pro Woche."]
    },
    ip: {
      years: 3,
      rows: [
        ["English", [4, 4, 4]], ["Deutsch", [4, 4, 4]], ["Italiano", [4, 4, 4]], ["Individual Learning (Sprachen)", [2, 2, n]],
        ["History, Geography & Humanities", [2, 2, 4]], ["Mathematics", [6, 4, 4]], ["Natural Sciences", [4, 4, 4]], ["Physics", [2, 2, 4]],
        ["Design (Digital Technologies & Technical Drawing)", [2, 2, n]], ["Individual Learning (MINT)", [n, 2, 2]],
        ["Theatre & Visual Arts", [2, 2, 2]], ["Physical & Health Education", [2, 2, 2]]
      ],
      total: [34, 34, 34],
      notes: ["Gezeigt sind die ersten drei Jahre (Middle Years Programme). Die Stundentafel für die 4. und 5. Klasse (Diploma Programme) wird laut Schule gerade festgelegt.", "Dazu Projektzeit für das Personal Project und fächerübergreifende Einheiten."]
    },
    kg: {
      rows: [
        ["Deutsch", [4, 4, 4, 4, 4]], ["Italienisch", [4, 4, 4, 4, 4]], ["Englisch", [4, 4, 4, 3, 3]],
        ["Latein und römische Kultur", ["6 / 5", 4, 3, 4, 3]], ["Griechische Sprache und Kultur", ["0 / 1", 4, 4, 3, 2]],
        ["Geschichte", [2, 2, 2, 2, 3]], ["Philosophie", [n, n, 3, 3, 2]], ["Mathematik und Informatik", [4, 4, 2, 2, 2]],
        ["Physik", [n, n, 2, 2, 2]], ["Naturwissenschaften und Geografie", [4, 4, 2, 2, 2]], ["Kunst- und Kulturgeschichte", [n, n, 2, 2, 2]],
        ["Recht und Wirtschaft", [2, 2, n, n, n]], ["IKT", [2, n, n, n, n]], ["Religion und Weltanschauungen", [2, 2, 2, 1, 2]],
        ["Bewegung und Sport", [2, 2, 2, 2, 2]], ["Fächerübergreifender Unterricht", [1, 1, 1, 1, 1]], ["Wahlfach Chor", [1, 1, 1, 1, 1]],
        ["Schwerpunkt (Kultur, Sprache & Gesellschaft oder Natur, Medizin & Technik)", [n, n, n, 2, 3]]
      ],
      total: [38, 38, 38, 38, 38],
      notes: ["Einheiten à 45 Minuten; fächerübergreifender Unterricht in Einheiten à 60 Minuten, Chor 75 Minuten pro Woche.", "1. Klasse: Latein 6 Einheiten im 1. Semester, 5 im 2. Semester – dann beginnt Griechisch.", "Englisch (1.–3. Klasse), Mathematik (1.–2.), Religion und IKT sind am Vinzentinum gegenüber dem Regelstundenplan aufgestockt."]
    },
    lsc: {
      rows: [
        ["Italiano", [4, 4, 4, 4, 4]], ["Tedesco (Zweitsprache)", [4, 4, 4, 4, 4]], ["Inglese", [3, 3, 3, 3, 3]], ["Latino", [3, 3, 3, 3, 3]],
        ["Storia e geografia", [3, 3, n, n, n]], ["Storia", [n, n, 2, 2, 2]], ["Filosofia", [n, n, 3, 3, 3]], ["Diritto ed economia", [2, 2, n, n, n]],
        ["Matematica (mit Informatik)", [5, 5, 5, 5, 5]], ["Fisica", [2, 2, 3, 3, 3]], ["Scienze naturali", [4, 4, 3, 3, 3]],
        ["Storia dell'arte e disegno", [2, 2, 2, 2, 2]], ["Scienze motorie", [2, 2, 2, 2, 2]], ["Religione", [1, 1, 1, 1, 1]]
      ],
      total: [35, 35, 35, 35, 35],
      notes: ["Ab der 3. Klasse Module in Mathematik und Naturwissenschaften auf Englisch.", "Scienze naturali = Biologie, Chemie, Erdwissenschaften."]
    },
    lli: {
      rows: [
        ["Italiano", [4, 4, 4, 4, 4]], ["Tedesco (Zweitsprache)", [4, 4, 4, 4, 4]], ["Inglese", [4, 4, 4, 4, 4]], ["Francese", [5, 5, 3, 3, 3]],
        ["Spagnolo", [n, n, 3, 3, 3]], ["Latino", [3, 3, n, n, n]], ["Storia e geografia", [3, 3, n, n, n]], ["Storia", [n, n, 2, 2, 2]],
        ["Filosofia", [n, n, 3, 3, 3]], ["Diritto ed economia", [2, 2, n, n, n]], ["Matematica (mit Informatik)", [4, 4, 3, 3, 3]],
        ["Fisica", [n, n, 2, 2, 2]], ["Scienze naturali", [3, 3, 2, 2, 2]], ["Storia dell'arte e disegno", [n, n, 2, 2, 2]],
        ["Scienze motorie", [2, 2, 2, 2, 2]], ["Religione", [1, 1, 1, 1, 1]]
      ],
      total: [35, 35, 35, 35, 35],
      notes: ["In Englisch, Französisch und Spanisch ist je eine Stunde Konversation mit Muttersprachler:innen enthalten.", "Geschichte und Geografie in der 1. Klasse auf Deutsch, Geschichte in der 4. und 5. Klasse auf Französisch."]
    },
    ite: {
      rows: [
        ["Italiano", [4, 4, 4, 4, 4]], ["Tedesco (Zweitsprache)", [4, 4, 4, 4, 4]], ["Inglese", [3, 3, 3, 3, 3]], ["Storia", [2, 2, 2, 2, 2]],
        ["Matematica", [4, 4, 3, 3, 3]], ["Scienze integrate (Biologie, Erdwissenschaften)", [2, 2, n, n, n]], ["Scienze integrate (Physik)", [3, n, n, n, n]],
        ["Scienze integrate (Chemie)", [n, 3, n, n, n]], ["Geografia", [3, 3, n, n, n]], ["Diritto ed economia", [2, 2, n, n, n]], ["Diritto", [n, n, 3, 4, 4]],
        ["Informatica", [3, 3, 3, 3, 1]], ["Economia politica", [n, n, 3, 2, 3]], ["Economia aziendale", [3, 3, 8, 8, 9]],
        ["Scienze motorie", [2, 2, 2, 2, 2]], ["Religione", [1, 1, 1, 1, 1]]
      ],
      total: [36, 36, 36, 36, 36],
      notes: ["Physik und Chemie: davon je 2 Std. Labor.", "Ab der 3. Klasse wird Informatik nach Möglichkeit teilweise auf Englisch unterrichtet."]
    },
    hfs: {
      blocks: [{ heads: ["1.", "2."], rows: [
        ["Deutsch", [3, 3]], ["Italienisch", [3, 3]], ["Englisch", [3, 3]], ["Französisch", [2, 2]], ["Geschichte", [2, 2]],
        ["Rechtskunde und Volkswirtschaft", [2, 2]], ["Mathematik / Informatik", [3, 3]], ["Naturwissenschaften und Technik", [2, 2]],
        ["Ernährungslehre und Ernährungskultur", [2, 2]], ["Service", [4, 4]], ["Kochen", [5, 5]], ["Empfang und Beherbergung", [2, 2]],
        ["Bewegung und Sport", [2, 2]], ["Religion", [1, 1]]
      ], total: [36, 36] }],
      notes: ["Danach: 3. Klasse an der Landeshotelfachschule Kaiserhof in Meran oder an der Landeshotelfachschule Bruneck (Hotelkaufmann/-frau mit Matura) – oder Wechsel in eine Berufsfachschule."]
    },
    bfk: {
      blocks: [
        { title: "Berufsfachschule (1.–3. Klasse)", heads: ["1.", "2.", "3."], rows: [
          ["Deutsch", [3, 3, 3]], ["Italienisch", [3, 2, 2]], ["Englisch", [2, 2, 2]], ["Berufs-, Gemeinschaftskunde, Zeitgeschichte", [3, n, n]],
          ["Gemeinschaftskunde / Zeitgeschichte", [n, 2, n]], ["Rechts- und Wirtschaftskunde", [n, n, 2]], ["Mathematik", [2, 2, 2]],
          ["Informationstechnische Grundbildung", [2, n, n]], ["Kochkunde", [2, 3, 3]], ["Nahrungsmittelkunde", [2, 1, 1]], ["Ernährungslehre", [2, 1, 1]],
          ["Speisenkunde", [n, 3, 3]], ["Praxis Kochen", [6, 14, 14]], ["Praxis Servieren", [3, n, n]], ["Praxis Empfang", [3, n, n]],
          ["Bewegung und Sport", [2, 2, 2]], ["Religion", [1, 1, 1]]
        ], total: [36, 36, 36] },
        "patisserie", "oeno"
      ],
      notes: ["Pflichtpraktika: je 3 Wochen in der 2. und 3. Klasse, dazu 5 Wochen im Sommer nach der 2. Klasse.", "4. und 5. Jahr sind freiwillig: Spezialisierung (Berufsdiplom), danach Maturalehrgang."]
    },
    bfs: {
      blocks: [
        { title: "Berufsfachschule (1.–3. Klasse)", heads: ["1.", "2.", "3."], rows: [
          ["Deutsch", [3, 3, 5]], ["Italienisch", [3, 4, 2]], ["Englisch", [2, 2, 4]], ["Berufs-, Gemeinschaftskunde, Zeitgeschichte", [3, n, n]],
          ["Gemeinschaftskunde / Zeitgeschichte", [n, 2, n]], ["Rechts- und Wirtschaftskunde", [n, n, 2]], ["Mathematik", [2, 2, 2]],
          ["Informationstechnische Grundbildung", [2, n, n]], ["Serviertechnik", [2, n, n]], ["Getränke- und Speisenkunde", [2, n, n]],
          ["Ernährungslehre", [2, n, n]], ["Restaurantführung und -organisation", [n, 6, 6]], ["Touristik", [n, 2, n]],
          ["Praxis Servieren", [6, 12, 12]], ["Praxis Kochen", [3, n, n]], ["Praxis Empfang", [3, n, n]],
          ["Bewegung und Sport", [2, 2, 2]], ["Religion", [1, 1, 1]]
        ], total: [36, 36, 36] },
        "frontoffice", "oeno"
      ],
      notes: ["Pflichtpraktika: je 3 Wochen in der 2. und 3. Klasse, dazu 5 Wochen im Sommer nach der 2. Klasse.", "4. und 5. Jahr sind freiwillig: Spezialisierung (Berufsdiplom), danach Maturalehrgang."]
    },
    bfbk: {
      blocks: [
        { title: "Berufsfachschule (1.–3. Klasse)", heads: ["1.", "2.", "3."], rows: [
          ["Deutsch", [3, 3, 3]], ["Italienisch", [3, 2, 2]], ["Englisch", [2, 2, 2]], ["Berufs-, Gemeinschaftskunde, Zeitgeschichte", [3, n, n]],
          ["Gemeinschaftskunde / Zeitgeschichte", [n, 2, n]], ["Rechts- und Wirtschaftskunde", [n, n, 2]], ["Mathematik", [2, 3, 3]],
          ["Informationstechnische Grundbildung", [2, n, n]], ["Arbeitskunde", [2, 4, 4]], ["Rohstoffkunde", [2, 2, 2]], ["Ernährungslehre", [2, 2, 2]],
          ["Praxis Bäckerei", [4, 5, 5]], ["Praxis Konditorei", [6, 8, 8]], ["Praxis Empfang / Hauswirtschaft", [2, n, n]],
          ["Bewegung und Sport", [2, 2, 2]], ["Religion", [1, 1, 1]]
        ], total: [36, 36, 36] },
        "patisserie", "oeno"
      ],
      notes: ["Pflichtpraktika: je 3 Wochen in der 2. und 3. Klasse, dazu 5 Wochen im Sommer nach der 2. Klasse.", "4. und 5. Jahr sind freiwillig: Spezialisierung (Berufsdiplom), danach Maturalehrgang."]
    },
    bfht: {
      blocks: [
        { title: "Berufsfachschule (1.–3. Klasse)", heads: ["1.", "2.", "3."], rows: [
          ["Deutsch", [3, 3, 3]], ["Italienisch", [3, 2, 2]], ["Englisch", [2, 2, 2]], ["Berufs-, Gemeinschaftskunde, Zeitgeschichte", [3, n, n]],
          ["Gemeinschaftskunde / Zeitgeschichte", [n, 2, n]], ["Rechts- und Wirtschaftskunde", [n, n, 2]], ["Mathematik", [2, 2, 2]],
          ["Informationstechnische Grundbildung", [2, n, n]], ["Naturwissenschaft und Technik", [3, n, n]], ["Technisch Zeichnen", [3, n, n]],
          ["Entwerfen und Gestalten", [2, n, n]], ["Fachrechnen / Geometrie", [n, 2, 2]], ["Fachzeichnen / CAD / Stilkunde", [n, 2, 2]],
          ["Werkstoffkunde", [n, 2, 1]], ["Arbeitskunde", [n, 1, 1]], ["Geräte- und Maschinenkunde", [n, 1, n]], ["Raumgestaltung", [n, n, 2]],
          ["Praxis Elektro", [2, n, n]], ["Praxis Holz", [8, 14, 14]], ["Bewegung und Sport", [2, 2, 2]], ["Religion", [1, 1, 1]]
        ], total: [36, 36, 36] },
        { title: "4. Jahr: Spezialisierung Möbelbau", heads: ["4."], rows: [
          ["Deutsch", [3]], ["Italienisch", [2]], ["Englisch", [2]], ["Geschichte und Gesellschaftslehre", [2]], ["Mathematik", [3]],
          ["Fachrechnen, Kalkulation", [2]], ["Rechts- und Wirtschaftskunde", [2]], ["Entwerfen und Gestalten", [3]], ["Fertigungstechnik (CNC)", [2]],
          ["Bauphysik", [3]], ["Konstruktion (CAD)", [2]], ["Praxis", [8]], ["Bewegung und Sport", [1]], ["Religion", [1]]
        ], total: [36] },
        "matura5"
      ],
      notes: ["Die Schulseite nennt für die 1.–3. Klasse keine Summe; die Einzelstunden ergeben 36 pro Woche.", "4. und 5. Jahr sind freiwillig: Spezialisierung (Berufsdiplom), danach 5. Jahr bis zur Matura."]
    },
    bfmt: {
      blocks: [
        { title: "Berufsfachschule (1.–3. Klasse)", heads: ["1.", "2.", "3."], rows: [
          ["Deutsch", [3, 3, 3]], ["Italienisch", [3, 2, 2]], ["Englisch", [2, 2, 2]], ["Berufs-, Gemeinschaftskunde, Zeitgeschichte", [3, n, n]],
          ["Gemeinschaftskunde / Zeitgeschichte", [n, 2, n]], ["Rechts- und Wirtschaftskunde", [n, n, 2]], ["Mathematik", [2, 2, 2]],
          ["Informationstechnische Grundbildung", [2, n, n]], ["Naturwissenschaft und Technik mit Robotik", [3, n, n]], ["Technisch Zeichnen", [3, n, n]],
          ["Entwerfen und Gestalten", [2, n, n]], ["Technische Mechanik", [n, 2, 2]], ["Technologie", [n, 3, 3]], ["Technische Kommunikation", [n, 3, 3]],
          ["Praxis Elektro", [2, n, n]], ["Praxis Metall", [8, n, n]], ["Praxis Maschinenbau mit Robotik", [n, 8, 8]], ["Praxis Stahlbau", [n, 6, 6]],
          ["Bewegung und Sport", [2, 2, 2]], ["Religion", [1, 1, 1]]
        ], total: [36, 36, 36] },
        { title: "4. Jahr: Spezialisierung Maschinenbau mit Robotik", heads: ["4."], rows: [
          ["Deutsch", [3]], ["Italienisch", [2]], ["Englisch", [2]], ["Geschichte und Gesellschaftslehre", [2]], ["Mathematik", [3]],
          ["Rechts- und Wirtschaftskunde", [2]], ["Konstruktion (CAD) und Produktentwicklung", [3]], ["Fertigungstechnik mit Robotik", [3]],
          ["Festigkeitslehre und Maschinenelemente", [4]], ["Werkzeug- und Vorrichtungsbau", [2]], ["Praxis Zerspanungstechnik", [8]],
          ["Bewegung und Sport", [1]], ["Religion", [1]]
        ], total: [36] },
        "matura5"
      ],
      notes: ["Das Spezialisierungsjahr schließt mit dem Berufsdiplom (EQR 4) ab.", "4. und 5. Jahr sind freiwillig: Spezialisierung, danach 5. Jahr bis zur Matura."]
    },
    bffi: {
      blocks: [
        { title: "Berufsfachschule (1.–3. Klasse)", heads: ["1.", "2.", "3."], rows: [
          ["Deutsch", [3, 3, 3]], ["Italienisch", [3, 3, 3]], ["Englisch", [3, 4, 4]], ["Berufs-, Gemeinschaftskunde, Zeitgeschichte", [3, n, n]],
          ["Gemeinschaftskunde / Zeitgeschichte", [n, 2, n]], ["Rechts- und Wirtschaftskunde", [n, n, 2]], ["Mathematik", [3, 3, 3]],
          ["Informationstechnische Grundbildung", [2, n, n]], ["Naturwissenschaft und Technik", [3, n, n]], ["Technisch Zeichnen", [2, n, n]],
          ["Praxis Informatik", [5, n, n]], ["Praxis Elektro", [5, n, n]],
          ["Modul Computertechnologien", [n, 7.3, n]], ["Modul Systeme und Netze", [n, n, 7.3]], ["Modul Anwendungsentwicklung", [n, 3.1, 3.1]],
          ["Modul Webentwicklung", [n, 2.7, 2.7]], ["Modul Elektronik und Automatisierung", [n, 5, 5]],
          ["Bewegung und Sport", [3, 2, 2]], ["Religion", [1, 1, 1]]
        ], total: [36, 36, 36] },
        { title: "4. Jahr: Spezialisierung Fachinformatik und Netzwerktechnik", heads: ["4."], rows: [
          ["Deutsch", [3]], ["Italienisch", [2]], ["Englisch", [2]], ["Mathematik", [3]], ["Rechts- und Wirtschaftskunde", [2]],
          ["Geschichte und Gesellschaftslehre", [2]], ["Informations- und Kommunikationselektronik", [4]], ["Informationstechnische Sicherheitssysteme", [2]],
          ["Datenbanksysteme", [2]], ["Anwendungsentwicklung", [4]], ["Betriebssysteme und Netzwerktechnik", [5]], ["Steuerungstechnische Systeme", [3]],
          ["Bewegung und Sport", [1]], ["Religion", [1]]
        ], total: [36] },
        "matura5"
      ],
      notes: ["Ab der 2. Klasse wird der Fachunterricht in Modulen mit zusammen 18 Std. pro Woche erteilt. Die Schule gibt Jahresstunden an; hier umgerechnet auf Wochenstunden (Jahresstunden ÷ 34 Schulwochen).", "Danach: Lehrgang für Systemadministration oder 5. Jahr bis zur Matura."]
    },
    bfhv: {
      blocks: [
        { title: "Berufsfachschule (1.–3. Klasse)", heads: ["1.", "2.", "3. H", "3. V"], rows: [
          ["Deutsch", [3, 3, 3, 3]], ["Italienisch", [3, 3, 3, 3]], ["Englisch", [2, 3, 3, 3]], ["Gemeinschaftskunde, Zeitgeschichte", [3, 2, 2, 2]],
          ["Mathematik", [2, 2, 2, 2]], ["Informationstechnische Grundbildung", [2, n, n, n]], ["Naturwissenschaften und Technik", [2, n, n, n]],
          ["Angewandte Wirtschaftskunde", [2, 2, 2, 2]], ["Entwerfen / Gestalten", [2, n, n, n]], ["Rechts- und Wirtschaftskunde", [n, 2, 2, 2]],
          ["Warenkunde / Verkaufskunde", [n, 2, 2, n]], ["Warenkunde", [n, n, n, 2]], ["Verkaufskunde", [n, n, n, 2]], ["Werbetechnik", [n, n, n, 2]],
          ["Bürotechnik und -organisation", [n, 2, 2, 2]], ["Buchhaltung", [n, n, n, 2]], ["EDV-Anwendungen", [n, 3, 2, 6]], ["Lernbüro", [n, 3, n, 6]],
          ["Praxis Handel", [6, n, n, n]], ["Praxis Verwaltung", [6, n, n, n]], ["Praxis Werbetechnik", [n, 3, 4, n]], ["Praxis Verkauf", [n, 3, 4, n]],
          ["Bewegung und Sport", [2, 2, 2, n]], ["Religion", [1, 1, 1, 1]]
        ] },
        { title: "4. Jahr: Spezialisierung Handel oder Verwaltung", heads: ["4. H", "4. V"], rows: [
          ["Deutsch", [3, 3]], ["Italienisch", [3, 3]], ["Englisch", [3, 3]], ["Geschichte und Gesellschaftslehre", [2, 2]], ["Mathematik", [3, 3]],
          ["Rechts- und Wirtschaftskunde", [2, 2]], ["Betriebswirtschaftslehre", [4, 4]], ["Buchhaltung", [n, 4]], ["EDV-Anwendungen", [4, 4]],
          ["Lernbüro", [n, 6]], ["Innovation und Entwicklungen", [4, n]], ["Praxis Handel", [6, n]], ["Bewegung und Sport", [1, 1]], ["Religion", [1, 1]]
        ], total: [34, 34] },
        "matura5"
      ],
      notes: ["H = Handel, V = Verwaltung. In der 3. Klasse trennen sich die Bereiche.", "Für die 1.–3. Klasse nennt die Schulseite keine Summen; bei der 3. Klasse wirkt die Tabelle auf der Schulseite verschoben. Beim 4. Jahr nennt die Schule 34 Std., die Einzelstunden ergeben 36 – im Zweifel bei der Schule nachfragen."]
    },
    bfsp: {
      blocks: [{ heads: ["1."], rows: [
        ["Deutsch", [3]], ["Italienisch", [3]], ["Englisch", [2]], ["Berufs-, Gemeinschaftskunde, Zeitgeschichte", [3]], ["Mathematik", [2]],
        ["Informationstechnische Grundbildung", [2]], ["Naturwissenschaft und Technik", [6]], ["Praxis Körperpflege", [6]], ["Praxis Friseur", [6]],
        ["Bewegung und Sport", [2]], ["Religion", [1]]
      ], total: [36] }],
      notes: ["Danach meist Lehre als Friseur:in oder Schönheitspfleger:in – oder Berufsfachschule für Schönheitspflege in Bruneck oder Meran."]
    }
  };
  T.lsb = { rows: T.lsc.rows, total: T.lsc.total, notes: ["Die Curvatura biomedica läuft innerhalb des Liceo Scientifico: Grundlage ist diese Stundentafel. Ab der 3. Klasse kommt eine Vertiefung in Biologie und Medizin dazu – eine eigene Stundentafel dafür ist nicht veröffentlicht."].concat(T.lsc.notes) };
  Object.values(T).forEach(t => { if (t.blocks) t.blocks = t.blocks.map(b => typeof b === "string" ? SHARED[b] : b); });
  return T;
})();
