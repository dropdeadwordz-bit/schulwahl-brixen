# Schulwahl Brixen

Website mit Übersicht aller Oberschulen in Brixen (plus International Program Bozen), Vergleich zweier Bildungswege und Interessentest mit Passung in Prozent. Reines HTML/CSS/JavaScript, kein Build-Schritt, keine Installation.

## Lokal ansehen

ZIP entpacken und `index.html` doppelklicken. Alles läuft im Browser, auch ohne Internet.

## Online stellen – komplett im Browser

**1. GitHub-Repository anlegen**
1. Auf github.com oben rechts auf **+** → **New repository**.
2. Name: `schulwahl-brixen`, Sichtbarkeit nach Wahl (Private geht auch mit Vercel), **Create repository**.
3. Auf der leeren Repo-Seite auf **uploading an existing file** klicken.
4. Den **Inhalt** des entpackten Ordners hineinziehen: `index.html`, `README.md`, `vercel.json` und den Ordner `assets`. Nicht den äußeren Ordner selbst.
5. Unten **Commit changes**.

**2. Mit Vercel verbinden**
1. Auf vercel.com mit **Continue with GitHub** anmelden.
2. **Add New → Project** → bei `schulwahl-brixen` auf **Import**.
3. Framework Preset: **Other**. Alles andere leer lassen → **Deploy**.
4. Nach etwa einer halben Minute ist die Seite unter `schulwahl-brixen.vercel.app` (oder ähnlich) erreichbar.

**3. Später etwas ändern**
In GitHub die Datei öffnen (meist `assets/data.js`) → Stift-Symbol → ändern → **Commit changes**. Vercel veröffentlicht die neue Version automatisch.

## Dateien

| Datei | Inhalt |
|---|---|
| `index.html` | Seitengerüst |
| `assets/data.js` | **Alle Schuldaten**: Schulen, 26 Bildungswege, Stundenprofile, Termine |
| `assets/tafeln.js` | Wochenstunden pro Schuljahr für den Reiter „Stunden“ im Steckbrief |
| `assets/careers.js` | Berufsfelder pro Bildungsweg mit Einschätzung für 2032 und 2035 |
| `assets/engine.js` | Die 14 Testfragen und die Berechnung der Passung; Gewichte in `const W` |
| `assets/app.js` | Oberfläche: Übersicht, Steckbrief, Vergleich, Test, Ergebnis, Methode |
| `assets/styles.css` | Gestaltung inkl. Dark Mode und Mobil-Ansicht |
| `assets/fonts.css` | Eingebettete Schriften (SIL Open Font License, Lizenzen in `assets/fonts`) – nicht bearbeiten |

## Daten pflegen (assets/data.js)

- `hours`: Pflichtstunden über die gesamte Ausbildung je Bereich (SPR Sprachen, MAT, NAT, TEC, WIR, GES, KRE, PRX Werkstatt/Praxis), ohne Sport und Religion.
- `basis`: Herkunft des Profils. Enthält der Text „Schätzung“, zeigt die Seite keine Stundenzahlen an.
- `riasec`: Holland-Profil des Bildungswegs [R, I, A, S, E, C], Werte 0–1.
- `pra` (0–100) und `aca` (0–1): Praxisanteil und Studienorientierung.
- `special`: besondere Voraussetzung mit Einfluss auf die Passung (`music`, `media`, `classic`, `italian`, `english`, `gastro` …).
- `events`: Termine; `open: true` markiert Tage der offenen Tür. Gleiche Tage werden automatisch zusammengefasst.

## Stundentafeln ergänzen (assets/tafeln.js)

Pro Bildungsweg eine Liste aus `["Fach", [1., 2., 3., 4., 5. Klasse]]`; `null` heißt: Fach gibt es in dieser Klasse nicht. Fehlt ein Bildungsweg, zeigt die Seite „Stundentafel folgt“.

## Berufe pflegen (assets/careers.js)

`o32` und `o35` sind die Einschätzungen für 2032 und 2035: 2 wächst, 1 gefragt, 0 wandelt sich stark, −1 unter Druck, −2 stark unter Druck. `MAP` legt fest, welche Berufsfelder bei welchem Bildungsweg erscheinen.

## Noch geschätzt (Stand Oktober 2026)

- Uhrzeiten der Tage der offenen Tür bei Vinzentinum, IIS Bressanone, Hellenstainer und Tschuggmall.
- Stundentafel der 4. und 5. Klasse des International Program (wird laut Schule noch festgelegt) und eine eigene Tafel für die Curvatura biomedica.
- Tschuggmall, Handel und Verwaltung: Spalten der 3. Klasse auf der Schulseite unklar.
