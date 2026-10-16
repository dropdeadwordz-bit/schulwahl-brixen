/* Berufe nach der Schule – Einschätzung für 2032 (Matura) und 2035 (Bachelor).
   Skala: 2 wächst, 1 gefragt, 0 wandelt sich stark, -1 unter Druck, -2 stark unter Druck.
   ai: wie stark KI/Robotik die typischen Aufgaben übernehmen kann (niedrig / mittel / hoch).
   Grundlage: WEF Future of Jobs Report 2025, ILO-Index zu generativer KI 2025, Stanford-Studie zu Berufseinsteiger:innen 2025,
   Prognosen des Landes zum Arbeitskräftebedarf in Südtirol. Es sind begründete Einschätzungen, keine Garantien. */
window.CAREERS = (function () {
  const C = {
    med:       { name: "Medizin, Pflege und Therapie", ex: "Ärztin, Pflege, Physiotherapie, Hebamme", path: "studium", o32: 2, o35: 2, ai: "niedrig", why: "Die Bevölkerung wird älter, und Behandlung braucht Nähe und Verantwortung. KI hilft bei Diagnose und Dokumentation, ersetzt aber nicht die Hände am Menschen." },
    pharma:    { name: "Biotechnologie, Pharmazie und Labor", ex: "Biotechnologin, Apothekerin, Laborleitung", path: "studium", o32: 1, o35: 1, ai: "mittel", why: "Datenauswertung wird stark automatisiert. Experimente, Qualitätssicherung und Verantwortung für Medikamente bleiben Menschenarbeit." },
    research:  { name: "Naturwissenschaft und Forschung", ex: "Physik, Mathematik, Chemie, Geologie", path: "studium", o32: 1, o35: 1, ai: "mittel", why: "KI wird zum Werkzeug in der Forschung. Wer Mathe und Programmieren mit Fachwissen verbindet, ist gefragt." },
    engineering:{ name: "Ingenieurwesen", ex: "Maschinenbau, Elektrotechnik, Bau, Informatik-Ingenieurin", path: "studium", o32: 1, o35: 1, ai: "niedrig", why: "Ingenieur:innen tragen Verantwortung für echte Anlagen und Gebäude. Energiewende und Infrastruktur brauchen viele Leute." },
    energy:    { name: "Umwelt- und Energietechnik", ex: "Erneuerbare Energien, Klimaschutz, Umweltplanung", path: "studium", o32: 2, o35: 2, ai: "niedrig", why: "Laut WEF unter den am schnellsten wachsenden Berufen bis 2030 – getrieben durch die Energiewende." },
    data:      { name: "Data Science und Künstliche Intelligenz", ex: "Data Scientist, KI-Entwicklerin", path: "studium", o32: 2, o35: 2, ai: "mittel", why: "Laut WEF unter den drei am schnellsten wachsenden Berufen. Das Fach verändert sich aber so schnell, dass ständiges Weiterlernen dazugehört." },
    software:  { name: "Softwareentwicklung", ex: "App- und Webentwicklung, Backend", path: "beides", o32: 0, o35: 1, ai: "hoch", why: "KI schreibt inzwischen viel Code. In den USA sank die Beschäftigung von 22- bis 25-Jährigen in stark KI-betroffenen Berufen wie diesem um 13 %. Der Gesamtbedarf wächst laut WEF trotzdem – gesucht sind Leute, die KI gezielt einsetzen." },
    cyber:     { name: "IT-Sicherheit und Netzwerke", ex: "Security-Spezialistin, Netzwerkadministration", path: "beides", o32: 2, o35: 2, ai: "mittel", why: "Laut WEF unter den fünf am schnellsten wachsenden Berufen. Mit KI werden auch Angriffe raffinierter." },
    itsupport: { name: "IT-Support und Systembetreuung", ex: "Helpdesk, PC- und Netzwerkbetreuung in Firmen", path: "direkt", o32: 0, o35: -1, ai: "hoch", why: "Einfache Supportanfragen übernehmen zunehmend KI-Assistenten. Hardware, Netzwerke und Menschen vor Ort bleiben." },
    architecture:{ name: "Architektur und Raumplanung", ex: "Architektin, Innenarchitektur, Raumplanung", path: "studium", o32: 0, o35: 0, ai: "mittel", why: "KI entwirft schnell Varianten. Beratung, Genehmigungen und Bauleitung bleiben bei Menschen." },
    teach:     { name: "Lehramt und Pädagogik", ex: "Grundschule, Kindergarten, Oberschule", path: "studium", o32: 1, o35: 1, ai: "niedrig", why: "Beziehung, Aufsicht und Begleitung lassen sich nicht automatisieren; viele Lehrpersonen gehen in Pension. Die Fakultät für Bildungswissenschaften der Uni Bozen sitzt in Brixen." },
    psych:     { name: "Psychologie und Beratung", ex: "Psychologin, Schulberatung, Coaching", path: "studium", o32: 1, o35: 1, ai: "niedrig", why: "Vertrauen und Beziehung sind der Kern. KI-Apps ergänzen, ersetzen aber keine Therapie." },
    social:    { name: "Soziale Arbeit", ex: "Sozialarbeit, Jugendarbeit, Sozialpädagogik", path: "studium", o32: 1, o35: 1, ai: "niedrig", why: "Laut WEF gehören Sozialarbeit und Beratung zu den Berufen mit dem größten Zuwachs bis 2030." },
    law:       { name: "Recht", ex: "Anwältin, Richterin, Notariat (Studium meist 5 Jahre)", path: "studium", o32: 0, o35: 0, ai: "hoch", why: "Recherche und Standardverträge übernimmt zunehmend KI; Juristen-Hilfsberufe schrumpfen laut WEF. Verantwortung, Verhandlung und Gericht bleiben menschlich." },
    econ:      { name: "Wirtschaft und Management", ex: "BWL, VWL, Unternehmensführung, Controlling", path: "studium", o32: 0, o35: 1, ai: "mittel", why: "Routine-Analysen werden automatisiert. Führung, Entscheidungen und Verantwortung sind gefragt – Managementrollen zählen laut WEF zu den großen Zuwächsen." },
    account:   { name: "Buchhaltung und Lohnverrechnung", ex: "Buchhalterin, Lohnbüro", path: "direkt", o32: -1, o35: -2, ai: "hoch", why: "Laut WEF minus 18 % bis 2030. Software und KI erledigen Buchungen und Abrechnungen weitgehend selbst." },
    tax:       { name: "Steuerberatung und Wirtschaftsprüfung", ex: "Steuerberaterin, Wirtschaftsprüferin", path: "studium", o32: 0, o35: 0, ai: "hoch", why: "Die Routine fällt weg, Beratung und Haftung bleiben. Es wird weniger Einsteigerstellen geben, dafür anspruchsvollere." },
    bank:      { name: "Bank und Versicherung", ex: "Bankberatung, Versicherungsbüro", path: "direkt", o32: -1, o35: -1, ai: "hoch", why: "Bankschalter-Jobs gehören laut WEF zu den am schnellsten schrumpfenden Berufen. Beratung bei großen Entscheidungen bleibt." },
    office:    { name: "Sekretariat und Sachbearbeitung", ex: "Assistenz, Büro, Sachbearbeitung", path: "direkt", o32: -1, o35: -2, ai: "hoch", why: "Laut WEF minus 20 % bis 2030; Büroberufe sind laut ILO am stärksten von KI betroffen – und dort arbeiten besonders viele Frauen." },
    public:    { name: "Öffentlicher Dienst", ex: "Landesverwaltung, Gemeinde, Sanitätsverwaltung", path: "direkt", o32: 0, o35: 0, ai: "mittel", why: "Viele Pensionierungen und der Zweisprachigkeitsnachweis sichern Stellen in Südtirol. Routinearbeit wird trotzdem digitalisiert." },
    marketing: { name: "Marketing und Kommunikation", ex: "Marketing, PR, Online-Werbung", path: "beides", o32: 0, o35: 0, ai: "hoch", why: "KI erstellt Texte, Bilder und Anzeigen in Sekunden. Strategie, Budget und Kundenbeziehung bleiben menschlich – der Beruf wird anspruchsvoller." },
    content:   { name: "Social Media und Content", ex: "Social-Media-Management, Content Creation", path: "direkt", o32: 0, o35: -1, ai: "hoch", why: "KI produziert Inhalte in riesiger Menge. Gefragt bleibt, wer eine eigene Stimme und echte Community hat." },
    journalism:{ name: "Journalismus und Redaktion", ex: "Redakteurin, Reporterin, Moderation", path: "studium", o32: -1, o35: -1, ai: "hoch", why: "Medienberufe sind laut ILO stark KI-betroffen. Recherche vor Ort, Lokaljournalismus und Vertrauen bleiben wichtig – aber der Markt ist eng." },
    translation:{ name: "Übersetzen und Dolmetschen", ex: "Übersetzerin, Konferenzdolmetscherin", path: "studium", o32: -1, o35: -2, ai: "hoch", why: "Maschinelle Übersetzung ist sehr gut geworden. Live-Dolmetschen und Fachtexte mit Haftung bleiben ein kleiner Markt." },
    intl:      { name: "Internationale Beziehungen und EU", ex: "EU-Institutionen, Diplomatie, internationale Organisationen", path: "studium", o32: 0, o35: 0, ai: "mittel", why: "Sprachen und Verhandlungsgeschick zählen. Der Markt ist klein und sehr umkämpft – unabhängig von KI." },
    tourismMgmt:{ name: "Tourismus- und Hotelmanagement", ex: "Hotelleitung, Revenue Management, Destination", path: "studium", o32: 1, o35: 1, ai: "mittel", why: "Tourismus ist in Südtirol zentral, und dem Land fehlen bis 2032 rund 30.000 Arbeitskräfte. Buchung und Preisgestaltung werden automatisiert, Gastgeben nicht." },
    front:     { name: "Rezeption und Front Office", ex: "Rezeption, Gästebetreuung, Reservierung", path: "direkt", o32: 0, o35: 0, ai: "mittel", why: "Self-Check-in und KI-Chats übernehmen Routine. Die Gastgeber-Rolle und Lösungen bei Problemen bleiben menschlich." },
    events:    { name: "Event- und Reiseorganisation", ex: "Eventmanagement, Reisebüro, Reiseleitung", path: "beides", o32: 0, o35: 0, ai: "mittel", why: "Buchen geht online, Planen hilft KI. Organisation vor Ort und Krisenmanagement bleiben gefragt." },
    uxui:      { name: "UX/UI- und Produktdesign", ex: "App-Design, Interface-Design, Produktdesign", path: "studium", o32: 2, o35: 1, ai: "mittel", why: "Laut WEF plus 48 % bis 2030. KI-Werkzeuge verändern den Beruf schnell; gefragt ist, wer Nutzer:innen versteht." },
    graphic:   { name: "Grafikdesign", ex: "Layout, Logos, Print, Werbemittel", path: "direkt", o32: -1, o35: -2, ai: "hoch", why: "Laut WEF erstmals unter den am schnellsten schrumpfenden Berufen – Bildgeneratoren übernehmen Standardaufträge." },
    media:     { name: "Foto, Film und Animation", ex: "Fotografin, Videoproduktion, 3D-Animation", path: "beides", o32: -1, o35: -1, ai: "hoch", why: "KI-Bilder und -Videos werden ständig besser. Event-, Doku- und Live-Produktion vor Ort bleiben." },
    print:     { name: "Druck und Druckvorstufe", ex: "Druckerei, Mediengestaltung Print", path: "direkt", o32: -2, o35: -2, ai: "mittel", why: "Druckberufe gehören laut WEF zu den am stärksten schrumpfenden Berufen." },
    music:     { name: "Musik und Musikpädagogik", ex: "Musikschule, Ensemble, Musiktherapie", path: "studium", o32: 0, o35: 0, ai: "niedrig", why: "Live-Musik und Unterricht bleiben menschlich. KI-Musik drückt aber Auftragsmusik für Werbung und Medien." },
    culture:   { name: "Kultur, Geschichte und Museum", ex: "Museum, Archiv, Kulturvermittlung", path: "studium", o32: 0, o35: 0, ai: "mittel", why: "Ein kleiner Arbeitsmarkt – das liegt nicht an KI. Vermittlung, Führungen und Projekte bleiben bei Menschen." },
    agrifood:  { name: "Agrar- und Lebensmittelwissenschaften", ex: "Lebensmitteltechnologie, Agrarwissenschaft, Önologie", path: "studium", o32: 1, o35: 1, ai: "niedrig", why: "Ernährung und Klima sind Zukunftsthemen; Landwirtschaft hat laut WEF weltweit den größten Jobzuwachs." },
    cook:      { name: "Köchin / Koch", ex: "Restaurant, Hotel, Catering", path: "direkt", o32: 1, o35: 1, ai: "niedrig", why: "Kochroboter bleiben Nische. Südtirols Gastgewerbe gehört zu den Branchen, denen am meisten Fachkräfte fehlen." },
    service:   { name: "Service, Restaurant und Bar", ex: "Servicefachkraft, Sommelière, Barkeeper", path: "direkt", o32: 1, o35: 1, ai: "niedrig", why: "Servicekräfte gehören laut WEF zu den größten Zuwächsen. Gastfreundschaft ist Menschensache." },
    bakery:    { name: "Bäckerei, Konditorei und Patisserie", ex: "Konditorin, Patissière, Bäckerin", path: "direkt", o32: 1, o35: 0, ai: "mittel", why: "Industriebrot wird automatisiert. Handwerk, Patisserie und Torten auf Bestellung bleiben gefragt." },
    metal:     { name: "Metall, Maschinenbau und Mechatronik", ex: "Mechatronikerin, Schlosserin, Instandhaltung", path: "direkt", o32: 1, o35: 1, ai: "mittel", why: "Roboter übernehmen die Serienfertigung. Einrichten, Warten und Reparieren der Maschinen wird dafür wichtiger." },
    carpentry: { name: "Tischlerei und Holzbau", ex: "Tischlerin, Zimmerin, Möbelbau", path: "direkt", o32: 1, o35: 1, ai: "niedrig", why: "Die CNC-Maschine fräst, Menschen planen, montieren und passen an. Holzbau wächst mit den Klimazielen." },
    electric:  { name: "Elektro, Photovoltaik und Gebäudetechnik", ex: "Elektrikerin, PV-Installation, Smart Home", path: "direkt", o32: 2, o35: 2, ai: "niedrig", why: "Die Energiewende braucht für jede Anlage Menschen, die sie vor Ort installieren und warten." },
    kfz:       { name: "KFZ und E-Mobilität", ex: "KFZ-Mechatronikerin, E-Auto-Technik", path: "direkt", o32: 1, o35: 1, ai: "niedrig", why: "Laut WEF sind Spezialist:innen für E-Fahrzeuge unter den Top-Wachstumsberufen." },
    retail:    { name: "Verkauf und Beratung im Handel", ex: "Fachverkäuferin, Filialleitung", path: "direkt", o32: 0, o35: 0, ai: "mittel", why: "Kassen werden automatisiert (WEF: stärkster Rückgang). Beratung im Geschäft wächst dagegen – weltweit plus 4,3 Millionen Stellen." },
    beauty:    { name: "Friseur, Kosmetik und Wellness", ex: "Friseurin, Kosmetikerin, Spa im Wellnesshotel", path: "direkt", o32: 1, o35: 1, ai: "niedrig", why: "Haare schneiden und Hautpflege brauchen geschickte Hände und Vertrauen – Roboter sind hier weit weg. Wellnesshotels in Südtirol suchen Fachkräfte; Termine und Beratung werden digitaler." },
    logistics: { name: "Büro, Lager und Logistik", ex: "Lagerverwaltung, Einkauf, Disposition", path: "direkt", o32: -1, o35: -1, ai: "hoch", why: "Lager- und Bestandserfassung gehört laut WEF zu den schrumpfenden Tätigkeiten." }
  };

  // Welche Berufsfelder passen zu welchem Bildungsweg – und auf welchem Weg erreicht man sie?
  // "direkt" = direkt nach Matura bzw. Berufsdiplom, "studium" = über ein Studium
  const MAP = {
    rg: ["med", "engineering", "data", "research", "architecture", "law"],
    rgan: ["med", "pharma", "energy", "agrifood", "data", "engineering"],
    sg: ["intl", "teach", "tourismMgmt", "marketing", "translation", "journalism"],
    swg: ["teach", "psych", "social", "med", "law", "culture"],
    swvw: ["econ", "law", "social", "psych", "public", "marketing"],
    swmj: ["journalism", "content", "marketing", "teach", "psych"],
    swmu: ["music", "teach", "psych", "social", "culture"],
    kg: ["law", "med", "culture", "teach", "intl", "research"],
    lsc: ["engineering", "med", "data", "research", "architecture", "econ"],
    lsb: ["med", "pharma", "research", "data"],
    lli: ["intl", "translation", "teach", "tourismMgmt", "marketing"],
    ip: ["med", "engineering", "data", "research", "energy", "intl"],
    tfoi: ["software", "cyber", "itsupport", "data", "engineering"],
    wfov: ["account", "bank", "public", "econ", "tax", "marketing"],
    ite: ["account", "bank", "public", "econ", "tax", "marketing"],
    wfot: ["front", "tourismMgmt", "events", "marketing", "intl"],
    tfog: ["graphic", "uxui", "media", "marketing", "print"],
    hfs: ["front", "tourismMgmt", "service", "cook", "events"],
    bfk: ["cook", "bakery", "agrifood", "tourismMgmt"],
    bfs: ["service", "front", "tourismMgmt", "events"],
    bfbk: ["bakery", "cook", "agrifood"],
    bfmt: ["metal", "kfz", "electric", "engineering"],
    bfht: ["carpentry", "architecture", "engineering"],
    bffi: ["itsupport", "cyber", "software"],
    bfhv: ["logistics", "retail", "account", "office"],
    bfsp: ["beauty", "retail"]
  };

  const SCALE = {
    "2": { label: "wächst", short: "wächst" },
    "1": { label: "gefragt", short: "gefragt" },
    "0": { label: "wandelt sich stark", short: "wandelt sich" },
    "-1": { label: "unter Druck", short: "unter Druck" },
    "-2": { label: "stark unter Druck", short: "stark unter Druck" }
  };

  const SOURCES = [
    { name: "World Economic Forum: Future of Jobs Report 2025", url: "https://www.weforum.org/publications/the-future-of-jobs-report-2025/" },
    { name: "ILO: Generative AI and Jobs – A Refined Global Index of Occupational Exposure (2025)", url: "https://www.ilo.org/publications/generative-ai-and-jobs-refined-global-index-occupational-exposure" },
    { name: "Brynjolfsson, Chandar, Chen: Canaries in the Coal Mine? (Stanford, 2025)", url: "https://siepr.stanford.edu/publications/working-paper/canaries-coal-mine-six-facts-about-recent-employment-effects-artificial" }
  ];

  return { C, MAP, SCALE, SOURCES };
})();
