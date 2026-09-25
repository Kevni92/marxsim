# MARXSIM — Konkreter Umsetzungsplan

## 1. Technische Zielsetzung

Das fertige Spiel soll:

- als statische Website funktionieren,
- ohne Backend auskommen,
- per GitHub Pages deploybar sein,
- lokal durch Öffnen von `index.html` funktionieren,
- keine externen Laufzeitabhängigkeiten benötigen,
- deterministisch und automatisiert testbar sein,
- auf Desktop-Browsern flüssig laufen.

### Technologiewahl

Für V1 bewusst **kein Framework und kein Build-Zwang**.

Geplante Struktur:

```text
/
├─ index.html
├─ assets/
│  ├─ styles/
│  ├─ icons/
│  ├─ textures/
│  └─ audio/
├─ src/
│  ├─ bootstrap.js
│  ├─ config.js
│  ├─ state.js
│  ├─ rng.js
│  ├─ sim/
│  │  ├─ clock.js
│  │  ├─ population.js
│  │  ├─ households.js
│  │  ├─ firms.js
│  │  ├─ labor.js
│  │  ├─ production.js
│  │  ├─ market.js
│  │  ├─ investment.js
│  │  ├─ housing.js
│  │  ├─ politics.js
│  │  ├─ publicFinance.js
│  │  └─ metrics.js
│  ├─ map/
│  │  ├─ mapModel.js
│  │  ├─ renderer.js
│  │  ├─ layers.js
│  │  └─ hitTest.js
│  ├─ ui/
│  │  ├─ shell.js
│  │  ├─ inspector.js
│  │  ├─ ledger.js
│  │  ├─ charts.js
│  │  ├─ policy.js
│  │  └─ theoryCards.js
│  ├─ explain/
│  │  ├─ causalLog.js
│  │  └─ causalInspector.js
│  └─ save/
│     └─ persistence.js
├─ data/
│  ├─ scenario.json
│  ├─ sectors.json
│  ├─ technologies.json
│  ├─ policies.json
│  └─ theory.json
├─ tests/
└─ docs/
```

Wichtig: Für lokale `file://`-Nutzung werden keine ES-Module vorausgesetzt, falls Browser damit restriktiv umgehen. V1 kann klassische Scripts in sauber definierten Namespaces verwenden. Alternativ kann später ein optionaler Build ein einzelnes Bundle erzeugen, aber die veröffentlichte Fassung bleibt vollständig statisch.

---

# Phase 0 — Repository und Deployment

## Ziel

Jeder Push nach `main` veröffentlicht den aktuellen statischen Stand auf GitHub Pages.

## Aufgaben

- Preproduction-Seite bereitstellen
- GitHub-Pages-Workflow anlegen
- Deployment nur aus `site/` während Preproduction
- später Deployment-Pfad auf fertiges Spiel umstellen
- README und Dokumentation verlinken

## Abnahme

- Workflow startet bei Push auf `main`
- Pages-Artefakt wird erzeugt
- Deployment verwendet `github-pages` Environment
- keine Secrets nötig

---

# Phase 1 — Simulationskern ohne UI

## Ziel

Eine komplette 20-jährige Simulation kann ohne Karte und UI deterministisch durchlaufen.

## Implementieren

### 1.1 State

Ein zentraler `GameState` enthält:

- Datum / Tick
- RNG-Seed
- Bezirke
- Haushaltsgruppen
- Firmen
- öffentliche Finanzen
- politische Regeln
- Zeitreihen
- Ereignisprotokoll
- Kausalprotokoll

### 1.2 Deterministischer RNG

Eigener einfacher Seed-RNG.

Keine direkte Nutzung von `Math.random()` in Simulationssystemen.

### 1.3 Tick-Pipeline

Genau die Reihenfolge aus `SIMULATION_MODEL.md`.

Jedes Subsystem erhält State und schreibt nur die dafür vorgesehenen Felder.

### 1.4 Test-Szenario

Minimalwelt:

- 4 Bezirke
- 3 Branchen
- 8 Firmen
- 4 Haushaltsgruppen
- 1.000–2.000 simulierte Personen als Aggregate

## Abnahme

Nach 240 Ticks:

- keine NaN-Werte
- keine negativen Bestände
- identischer Seed = identische Ergebnisse
- Wirtschaft produziert, beschäftigt, verkauft und investiert
- mindestens einzelne Firmen können wachsen / schrumpfen / schließen

---

# Phase 2 — Vollständiger Marktzyklus

## Ziel

Die Ökonomie besitzt echte Rückkopplungen.

## Implementieren

### 2.1 Arbeitsmarkt

- gewünschte Beschäftigung
- Lohnangebote
- Arbeitslosenquote
- Stellenbesetzung
- Pendel-/Standortfaktor

### 2.2 Produktion

- Kapital
- Technologie
- Arbeit
- Kapazität
- Inputs

### 2.3 Nachfrage

- Grundbedarf
- diskretionärer Konsum
- unterschiedliche Konsumquoten nach Klasse

### 2.4 Preis und Lager

- firmenindividuelle Preise
- Branchenpreis
- Lagerdruck
- Preisreaktion mit Trägheit

### 2.5 Gewinn

- Umsatz
- Löhne
- Inputs
- Miete
- Steuer
- Abschreibung

## Abnahme

Folgende experimentelle Szenarien müssen sichtbar funktionieren:

1. Nachfrage stark erhöhen → Auslastung steigt → Einstellungen / Investitionen steigen
2. Nachfrage stark reduzieren → Lager steigen → Produktion / Beschäftigung sinken
3. Arbeitskräfte verknappen → Löhne steigen
4. viele Arbeitslose erzeugen → Lohndruck sinkt

---

# Phase 3 — Kapitalakkumulation und Konkurrenz

## Ziel

Firmen entwickeln sich unterschiedlich und erzeugen Konzentration.

## Implementieren

- erwartete Nachfrage
- Expansion
- Rationalisierung
- Technologieübernahme
- Firmengründung
- Insolvenz
- optional Übernahme insolventer Kapazität
- Branchenmarktanteile
- HHI / Top-3-Konzentration

## Spezifischer Test

Zwei identische Firmen starten gleich. Eine erhält einmalig bessere Produktivität.

Erwartung:

- bessere Kostenposition
- höherer Marktanteil / höhere Marge
- größere Investitionsfähigkeit
- möglicher kumulativer Vorsprung

Nicht garantiert: Monopol. Die Rückkopplung muss sichtbar, aber nicht absolut sein.

## Abnahme

Nach 30–50 simulierten Jahren können aus vielen kleinen Firmen wenige dominante Firmen entstehen, ohne dass dies geskriptet ist.

---

# Phase 4 — Räumliche Karte

## Ziel

Die Karte wird zur sichtbaren Oberfläche der Simulation.

## Kartentechnik

Empfohlen: **SVG für Geometrie + HTML Overlay für UI**.

Warum SVG:

- Grundstücke und Bezirke sind klickbar
- scharfe Darstellung bei Zoom
- Karten-Layer leicht einfärbbar
- Linien, Bahn, Fluss und Schraffuren passen stilistisch
- weniger Aufwand als Canvas-Hit-Testing

Canvas nur für optionale Effekte wie Rauchpartikel.

## Implementieren

### 4.1 Feste Grundgeometrie

Eine handgezeichnet wirkende fiktive Karte mit:

- 6–8 Bezirken
- 48–72 Landclustern
- Fluss
- Straßenachsen
- Kohlebereich
- Marktkern
- Hafenpunkt

### 4.2 Standortsystem

Firma wählt Standort anhand von:

- Zugang
- Landpreis
- Arbeitskräften
- Ressource
- Steuer
- Verschmutzung / Nutzungsrestriktion

### 4.3 Kartenobjekte

Visuelle Stufen für:

- Werkstatt
- Fabrik
- Großfabrik
- Wohnbebauung
- Bergbau
- Bahnhof

### 4.4 Layer

- Arbeit
- Einkommen
- Wohnen
- Kapital
- Industrie
- Politik
- Umwelt

## Abnahme

Ein Spieler kann ohne Tabellen erkennen:

- wo Industrie wächst,
- wo Arbeiter wohnen,
- welche Gebiete teuer werden,
- wo Krise / Leerstand entsteht.

---

# Phase 5 — Wohnen, Boden und Infrastruktur

## Ziel

Industrialisierung verändert die Stadtstruktur.

## Implementieren

- Wohnkapazität
- Mietdruck
- Bauinvestitionen
- Haushaltsumzüge
- Pendelkosten
- Bodenwerte
- Umweltbelastung
- Straße
- Eisenbahn
- öffentlicher Bau

## Kernexperiment

Neue Bahnlinie in peripheren Bezirk bauen.

Erwartbare Kette:

`Erreichbarkeit ↑ → Firmenattraktivität ↑ → Arbeitsplätze ↑ → Wohnnachfrage ↑ → Miete/Bodenwert ↑ → Bauinvestition ↑`

Mögliche Nebenwirkung:

`Miete ↑ → ärmere Haushalte verdrängt`

## Abnahme

Infrastruktur ist kein pauschaler `+10 % Wachstum`-Button, sondern verändert Standortentscheidungen.

---

# Phase 6 — Politik, Organisation und Klassenkonflikt

## Ziel

Politik reagiert auf reale gesellschaftliche Zustände.

## Implementieren

### 6.1 Organisation

- Gewerkschaftsgrad
- gemeinsame Betriebserfahrung
- Bezirkskonzentration
- Legalität

### 6.2 Unzufriedenheit

- Reallohn
- Arbeitslosigkeit
- Miete
- Arbeitszeit
- Gewinn-/Lohnentwicklung

### 6.3 Streik

- Entstehung
- Dauer
- Forderungen
- Ergebnis
- Erinnerungseffekt

### 6.4 Reformen

Mindestens:

- Arbeitszeitlimit
- Kinderarbeit / Schutzregel
- Gewerkschaftslegalisierung
- Mindestlohn
- Arbeitslosenhilfe
- progressive Steuer
- Sozialversicherung

## Abnahme

Politischer Konflikt kann in einer gut laufenden, breit wohlhabenden Gesellschaft niedrig bleiben und in einer stark angespannten Gesellschaft steigen.

Keine feste Uhrzeit: „Im Jahr 1870 kommt Streik“.

---

# Phase 7 — Kausalinspektor und Theorie

## Ziel

Der Spieler kann jede wichtige Entwicklung zurückverfolgen.

## Implementieren

### 7.1 Cause Records

Jedes System kann beim Ändern wichtiger Kennzahlen strukturierte Gründe mitschreiben:

- `metric`
- `delta`
- `sourceType`
- `sourceId`
- `reason`
- `parentCause`

### 7.2 Aggregation

Pro Monat nur Top-Ursachen behalten.

### 7.3 UI

Beispiel:

`Arbeitslosigkeit +3,1 pp`

aufklappbar zu:

- Textilfabrik Adler geschlossen
- Stahlwerke rationalisiert
- Landzuzug gestiegen

### 7.4 Theorie-Karten

Trigger abhängig von realen Zuständen.

Mindestens:

- Lohnarbeit
- Mehrwert
- Konkurrenz
- Akkumulation
- Reservearmee
- Konzentration
- Klassenkampf
- Krise / Überproduktion

## Abnahme

Für jede Theorie-Karte lässt sich mindestens ein konkretes Objekt oder Zeitreihensegment aus der aktuellen Partie anzeigen.

---

# Phase 8 — UI und visuelle Identität

## Ziel

Die Preproduction-Ästhetik wird zu einem vollständigen Interface.

## Implementieren

- Katasterkarten-Stil
- Hauptbuch-Leiste
- Firmenkarteikarte
- Verwaltungswerkzeuge
- rote Stempelereignisse
- historische Diagramme
- Kartenlegenden
- Tooltips
- Zoom / Pan
- dezente Rauch- und Zuganimation

## Strikte UI-Regeln

- keine generischen 12-KPI-Dashboards
- keine allgegenwärtigen abgerundeten Karten
- keine Emojis als Spielicons
- Zahlen mit Ursache verknüpfen
- Kontext statt permanentem Informationsrauschen

## Abnahme

Ein Screenshot muss ohne Logo visuell eigenständig erkennbar sein.

---

# Phase 9 — Speichern, Laden und Endbericht

## Speichern

Browser `localStorage` für:

- Spielstand
- Einstellungen
- Seed
- Theorie-Karten-Status

Zusätzlich:

- Export als JSON-Datei
- Import einer JSON-Datei

## Endbericht

Nach Endjahr:

- Klassenstruktur
- Produktivität
- Reallohn
- Lohnquote
- Profitquote
- Kapitalverteilung
- Firmendichte
- Konzentration
- Krisen
- Streiktage
- wichtigste Reformen

Daraus entsteht eine Diagnose mit begründeten Textbausteinen.

## Abnahme

Ein exportierter Spielstand kann geladen und deterministisch fortgeführt werden.

---

# Phase 10 — Balancing und Validierung

## Automatische Monte-Carlo-Läufe

Mindestens 100 Seeds ohne Spielerinteraktion simulieren.

Prüfen:

- kollabiert jede Wirtschaft? → schlecht
- wächst jede Wirtschaft perfekt? → schlecht
- identische Endzustände? → Modell zu starr
- extreme Geld-/Preisexplosionen? → Parameterproblem

## Policy-Vergleich

Für denselben Seed mehrere Strategien automatisch testen:

- laissez-faire
- hohe Sozialausgaben
- starke Arbeitsregulierung
- investitionsorientierter Staat

Nicht Ziel: einen universellen Sieger finden.

Ziel: Unterschiede und Trade-offs sichtbar machen.

---

# Phase 11 — Release-Kriterien 1.0

V1 gilt erst als fertig, wenn:

1. komplette Partie ohne Fehler spielbar
2. mindestens 5 gekoppelte Branchen
3. mindestens 6 politische Instrumente
4. räumliche Entwicklung sichtbar
5. Firmen agieren autonom
6. Löhne und Preise reagieren endogen
7. Rationalisierung hat echte Arbeitsmarktwirkung
8. mindestens eine Krise kann emergent entstehen
9. Konzentration kann emergent entstehen
10. Streiks können emergent entstehen
11. Kausalinspektor erklärt zentrale Kennzahlen
12. Theorie-Karten sind mit aktuellen Spieldaten verknüpft
13. Spielstand exportierbar
14. identischer Seed reproduzierbar
15. GitHub-Pages-Deployment grün

---

# Konkrete Reihenfolge der ersten Commits nach Preproduction

## Commit A — App Shell

- `index.html`
- Grundlayout
- Papier-/Kataster-Styles
- leere Karte
- Pause / Geschwindigkeit

**Noch keine Wirtschaftssimulation.**

## Commit B — Deterministischer Simulationskern

- State
- RNG
- Clock
- minimaler Tick
- Debugausgabe

## Commit C — Firmen + Produktion

- Firmenobjekte
- Produktionsfunktion
- Kosten
- Output

## Commit D — Haushalte + Nachfrage

- Einkommensgruppen
- Konsum
- Grundbedarf

## Commit E — Markt + Arbeit

- Preise
- Lager
- Löhne
- Beschäftigung

Ab hier existiert der erste echte Wirtschaftskreislauf.

## Commit F — Investition + Insolvenz

- Akkumulation
- Expansion
- Rationalisierung
- Firmenschließung

## Commit G — Karte mit Simulationsbindung

- Bezirke
- Firmenstandorte
- Wohnstandorte
- Kartenlayer

## Commit H — Politik + Konflikt

- Organisation
- Streiks
- erste Reformen

## Commit I — Kausalinspektor

- strukturierte Causes
- Drilldown

## Commit J — Theorie und Endbericht

- Theorie-Karten
- Endzustände

Danach beginnt Balancing statt Feature-Expansion.

---

# Architekturregeln

## Simulation kennt UI nicht

Simulationsdateien schreiben niemals DOM.

## UI verändert Simulation nur über Commands

Beispiel:

- `buildRail(...)`
- `setTaxRate(...)`
- `enactPolicy(...)`

Keine direkte Manipulation beliebiger State-Felder aus Click-Handlern.

## Eine Quelle pro Kennzahl

Arbeitslosenquote wird zentral berechnet und nicht an mehreren UI-Stellen neu hergeleitet.

## Konfiguration statt Magic Numbers

Balancewerte in zentraler Config / Datendateien.

## Erklärbarkeit vor Perfektion

Eine ökonomisch komplexere Formel wird nicht verwendet, wenn sie das Ergebnis für den Spieler und Entwickler deutlich schlechter nachvollziehbar macht, ohne erkennbaren spielerischen Gewinn.

---

# Risiko-Liste

## Risiko 1: Modell oszilliert / explodiert

Gegenmittel:

- Änderungsraten begrenzen
- gleitende Erwartungen
- monatliche Tests
- Monte-Carlo-Simulation

## Risiko 2: Der Spieler versteht Ursachen nicht

Gegenmittel:

- Cause Records von Anfang an, nicht nachträglich

## Risiko 3: Spiel wirkt wie Excel

Gegenmittel:

- Karte zeigt dieselben Prozesse räumlich
- Tabellen nur sekundär

## Risiko 4: Marxismus wird als Skript statt Modell umgesetzt

Gegenmittel:

- keine garantierte Verelendung
- keine garantierte Revolution
- keine garantierte Monopolisierung
- Effekte entstehen nur, wenn Modellbedingungen sie hervorbringen

## Risiko 5: Scope wächst

Gegenmittel:

- Außenhandel, Banken, Aktienmarkt und individuelle Bürger erst nach V1

---

# Nächster tatsächlicher Entwicklungsschritt

Nach Freigabe dieses Plans ist **Phase 1 / Commit A: App Shell** der erste Code-Schritt. Vorher soll kein zusätzlicher Simulationsumfang ergänzt werden.
