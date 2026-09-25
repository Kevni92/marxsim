# MARXSIM — Game Design Specification

## 1. Ziel

MARXSIM ist eine kompakte Singleplayer-Wirtschaftssimulation über die Industrialisierung einer fiktiven europäischen Region. Eine Partie soll ca. 45–90 Minuten dauern und ungefähr 70–80 Simulationsjahre abbilden.

Das Spiel erklärt marxistische Begriffe nicht als Quiz oder Textkurs. Es baut ein kleines ökonomisches System, in dem die zugrunde liegenden Phänomene entstehen können. Erst wenn ein Phänomen erstmals sichtbar wird, bietet das Spiel die passende theoretische Einordnung an.

Die Spielwelt ist bewusst **kein Beweis für Marx**. Sie ist ein transparentes Modell mit marxistisch inspirierten Annahmen, dessen interne Konsequenzen der Spieler untersuchen kann.

---

## 2. Rolle des Spielers

Der Spieler ist keine einzelne Person und kein Unternehmen, sondern die **öffentliche Ordnung einer industrialisierenden Region**: ein abstrahierter Mix aus Kommune, Parlament und Verwaltung.

Der Spieler kann:

- öffentliche Straßen und Eisenbahntrassen bauen,
- neue Stadtflächen erschließen,
- Steuern verändern,
- Arbeitsrecht beschließen,
- Armenhilfe / Arbeitslosenunterstützung einführen,
- öffentliche Wohnungen oder Versorgungskapazitäten schaffen,
- auf Streiks, Krisen und politische Bewegungen reagieren,
- später Eigentums- und Unternehmensregeln verändern.

Der Spieler kann **nicht**:

- einzelnen Privatfirmen vorschreiben, wann sie investieren,
- direkt Löhne oder Preise jedes Betriebes setzen,
- Fabriken beliebig als kostenlose Spielfiguren platzieren,
- Nachfrage oder Klassenbewusstsein per Knopfdruck erzeugen.

Die Wirtschaft muss deshalb auf Entscheidungen reagieren, statt von ihnen direkt gesteuert zu werden.

---

## 3. Szenario

### Region

Arbeitstitel: **Rotfeld**.

Eine fiktive Flussregion mit:

- historischer Altstadt,
- Dörfern und Landwirtschaft im Umland,
- Kohlevorkommen,
- Flusshafen,
- späterer Eisenbahnanbindung,
- freien Industrieflächen,
- wachsender Arbeitervorstadt.

### Zeitraum

Start ungefähr um **1840**. Ende ungefähr um **1914**.

Der Zeitraum ist absichtlich lang genug, damit aus Werkstätten, frühen Fabriken und Landbevölkerung eine industrialisierte Klassengesellschaft entstehen kann.

Es gibt keine historische 1:1-Simulation realer Staaten. Reale Begriffe und Theorien werden erklärt, die Region selbst bleibt fiktiv.

---

## 4. Kern-Gameplay-Loop

1. **Beobachten**
   - Wo entstehen Arbeitsplätze?
   - Welche Firmen wachsen oder sterben?
   - Wie entwickeln sich Löhne, Preise und Profite?
   - Welche Viertel wachsen?

2. **Verstehen**
   - Kausalinspektor öffnen.
   - Ursachenketten für Arbeitslosigkeit, Preissteigerung, Gewinne oder Unruhen nachvollziehen.

3. **Eingreifen**
   - Infrastruktur bauen.
   - Gesetz verabschieden.
   - Steuer ändern.
   - Krisenmaßnahme wählen.

4. **Folgen beobachten**
   - Kurzfristige Reaktion.
   - Mittelfristige Anpassung der Firmen.
   - Langfristige Strukturveränderung.

5. **Neue Konflikte entstehen lassen**
   - Wachstum erzeugt Engpässe.
   - Rationalisierung erzeugt Arbeitslosigkeit.
   - hohe Löhne stärken Nachfrage, aber belasten Margen.
   - niedrige Löhne erhöhen Margen, können aber Nachfrage schwächen.

---

## 5. Zeitmodell

Die Simulation läuft kontinuierlich mit Pause und Geschwindigkeiten 1× / 2× / 4×.

- 1 Tick = 1 Monat.
- 12 Ticks = 1 Jahr.
- Unternehmen entscheiden monatlich über Produktion und Beschäftigung.
- Investitionsentscheidungen erfolgen quartalsweise.
- größere politische Entscheidungen werden jährlich oder ereignisgetrieben getroffen.
- Statistiken werden monatlich gespeichert und als Zeitreihe dargestellt.

Ein deterministischer Seed sorgt dafür, dass identische Ausgangslage und identische Entscheidungen reproduzierbar bleiben.

---

## 6. Karte

### Grundstruktur

Die Karte besteht aus ca. **48–72 Grundstücksclustern** statt aus hunderten Mikrokacheln. Dadurch bleibt sie lesbar und performant.

Jeder Cluster besitzt:

- Bodenfläche,
- Bodenpreis,
- Entfernung zum Marktzentrum,
- Straßenanbindung,
- Bahnanbindung,
- Hafennähe,
- Ressourcenvorkommen,
- Wohnkapazität,
- Gewerbekapazität,
- Umweltbelastung,
- Attraktivität für Haushalte,
- Attraktivität für Unternehmen.

### Nutzungen

- Landwirtschaft
- Handwerk / Kleingewerbe
- Wohngebiet
- Industrie
- Bergbau
- Handel / Markt
- öffentliche Infrastruktur
- ungenutztes Land

### Sichtbare Transformation

Die Karte verändert sich tatsächlich:

- Werkstätten verschwinden.
- Fabrikhallen wachsen.
- Schornsteine erscheinen.
- Wohnblocks verdichten sich.
- Eisenbahnlinien entstehen.
- Bodenpreise steigen entlang wichtiger Verkehrsachsen.
- ärmere Haushalte werden aus teuren Zonen verdrängt.
- Industrie erzeugt Rauch und verschlechtert Wohnqualität.

Die Karte ist deshalb **kein Wallpaper**, sondern eine räumliche Darstellung derselben Ökonomie, die die Zahlen treibt.

---

## 7. Wirtschaftsakteure

### Haushalte

Haushalte werden gruppiert simuliert, nicht als zehntausende einzelne Personen.

Klassen / Gruppen:

- Landbevölkerung
- Arbeiter
- arbeitslose Arbeiter
- Handwerker / Kleinbürger
- Unternehmer / Kapitalbesitzer

Jede Gruppe besitzt:

- Größe,
- durchschnittliches Einkommen,
- Vermögen,
- Konsumbedarf,
- Wohnkosten,
- Sparquote,
- politische Unzufriedenheit,
- Organisationsgrad.

### Unternehmen

Jede Firma ist ein eigenes Simulationsobjekt.

Attribute:

- Branche
- Standort
- Kapitalbestand
- Beschäftigte
- Lohnsatz
- Technologielevel
- Produktionskapazität
- Lagerbestand
- Verkaufspreis
- Umsatz
- Kosten
- Gewinn
- Schulden (spätere Ausbaustufe)
- erwartete Nachfrage
- gewünschte Investition

Firmen können gegründet werden, expandieren, fusionieren oder insolvent gehen.

---

## 8. Branchen

Die erste vollständige Version soll nur wenige, klar gekoppelte Branchen besitzen:

1. **Nahrungsmittel**
   - Grundbedarf aller Haushalte
   - geringe Eintrittsbarriere

2. **Textilien**
   - frühe Industrialisierung
   - arbeitsintensiv
   - gut für Mechanisierungseffekte

3. **Kohle**
   - lokale Ressource
   - Input für Industrie und Transport

4. **Eisen / Maschinen**
   - kapitalintensiv
   - Voraussetzung für höhere Technologie

5. **Bauwirtschaft**
   - reagiert auf Stadtwachstum
   - verbindet Investitionen mit räumlicher Entwicklung

Mehr Branchen erhöhen nicht automatisch die Tiefe. Zuerst müssen diese fünf starke Rückkopplungen erzeugen.

---

## 9. Zentrale Spielsysteme

### 9.1 Lohnarbeit

Arbeiter verkaufen Arbeitskraft an Unternehmen.

Unternehmen stellen ein, wenn zusätzliche Arbeit voraussichtlich mehr zusätzlichen Ertrag erzeugt als sie kostet.

Der Lohn entwickelt sich aus:

- Existenzminimum / Lebenshaltungskosten,
- Arbeitskräfteknappheit,
- Arbeitslosigkeit,
- Organisationsgrad,
- gesetzlichen Mindeststandards,
- Profitabilität der Branche.

### 9.2 Mehrwert / Überschuss

Das Spiel zeigt den erzeugten Netto-Wert einer Firma und dessen Verteilung auf:

- Löhne,
- Steuern,
- Zins / Finanzierung (später),
- einbehaltenen Gewinn.

Die Erklärungsschicht weist darauf hin, wie Marx den Teil des erzeugten Werts interpretiert, der nicht als Lohn an Arbeiter zurückfließt.

### 9.3 Konkurrenz

Firmen konkurrieren um:

- Nachfrage,
- Arbeitskräfte,
- Land,
- Rohstoffe,
- Finanzierung.

Eine Firma mit höherer Produktivität kann Preise senken oder höhere Margen erzielen. Konkurrenten müssen reagieren.

### 9.4 Akkumulation

Gewinne können in neue Kapazität und Technologie reinvestiert werden.

Damit entsteht:

`Gewinn → Investition → größere Kapazität → potenziell höherer Gewinn → weiteres Kapital`

### 9.5 Rationalisierung

Technologie steigert Output je Arbeiter.

Kurzfristig kann dies Arbeitskräfte freisetzen. Langfristig kann zusätzliche Nachfrage wieder Beschäftigung schaffen. Das Ergebnis ist deshalb nicht fest geskriptet.

### 9.6 Reservearmee

Arbeitslosigkeit beeinflusst die Verhandlungsmacht von Arbeitern.

- hohe Arbeitslosigkeit → schwächerer Lohndruck
- geringe Arbeitslosigkeit → stärkerer Lohndruck

### 9.7 Nachfrage und Krise

Haushalte kaufen aus ihrem verfügbaren Einkommen.

Wenn Einkommen und Nachfrage hinter wachsender Produktionskapazität zurückbleiben:

- Lager steigen,
- Preise geraten unter Druck,
- Produktion wird reduziert,
- Beschäftigung sinkt,
- Einkommen sinkt,
- Nachfrage sinkt weiter.

Eine Krise wird erst als solche benannt, wenn diese Kette im Modell tatsächlich auftritt.

### 9.8 Konzentration

Erfolgreiche Firmen akkumulieren Kapital; schwache Firmen verschwinden.

Gemessen werden:

- Anteil der größten Firma,
- Anteil der Top-3-Firmen,
- Herfindahl-ähnlicher Konzentrationsindex,
- Anteil des Kapitals nach Klasse.

### 9.9 Klassenbildung

Klasse ist im Spiel keine frei gewählte Identität, sondern folgt primär aus Eigentums- und Einkommensposition.

Politisches Klassenbewusstsein entsteht zusätzlich aus:

- gemeinsamen wirtschaftlichen Erfahrungen,
- Organisationsgrad,
- Krisen,
- Ungleichheit,
- Arbeitsbedingungen,
- Reformen bzw. Repression.

---

## 10. Politik und Institutionen

Politische Optionen werden historisch und systemisch freigeschaltet.

### Früh verfügbar

- lokale Armenhilfe
- Infrastrukturinvestitionen
- geringe Unternehmenssteuern
- Zölle / keine Zölle als Szenariooption

### Nach wachsender Industrialisierung

- maximale Arbeitszeit
- Kinderarbeitsverbot
- Gewerkschaftslegalisierung
- Mindestlohn
- Unfallversicherung
- Arbeitslosenunterstützung
- progressive Besteuerung

### Späte Systemfragen

Nur bei hoher politischer Spannung:

- öffentliche Schlüsselbetriebe
- Mitbestimmung
- umfassende Vergesellschaftung bestimmter Branchen
- Eigentumsreformen

Diese Maßnahmen dürfen nicht als "Upgrade-Baum" funktionieren. Jede hat Gewinner, Verlierer, Kosten und Rückkopplungen.

---

## 11. Streiks und Konflikte

Streiks entstehen aus Bedingungen, nicht aus Zufall.

Wahrscheinlichkeit steigt bei:

- sinkenden Reallöhnen,
- hoher Arbeitszeit,
- stark steigenden Unternehmensgewinnen,
- hoher Organisierung,
- schlechter Wohnsituation,
- vorherigen erfolgreichen Streiks.

Wahrscheinlichkeit sinkt bei:

- sehr hoher Arbeitslosigkeit,
- sozialpolitischer Absicherung,
- Repression,
- hohen Reallöhnen.

Ein Streik reduziert Produktion, kann Lohnerhöhungen erzwingen oder scheitern. Beides verändert zukünftiges Verhalten.

---

## 12. Ereignisse

Ereignisse sollen möglichst **Zustände zuspitzen**, nicht das System ersetzen.

Gute Ereignisse:

- "Textilarbeiter gründen einen Verband" — ausgelöst durch tatsächliche Organisierung.
- "Bankrottwelle im Industriegürtel" — ausgelöst durch reale Insolvenzen.
- "Wohnungsnot wird politische Frage" — ausgelöst durch reale Mietbelastung.

Schlechte Ereignisse:

- zufällig "Wirtschaftskrise!" auslösen.
- zufällig "Kommunisten gewinnen 20 %" ohne gesellschaftliche Ursache.
- zufällig Produktionswerte verändern, nur um Drama zu erzeugen.

---

## 13. Informationsdesign

### Hauptansicht

- 65–70 % der Fläche: Karte
- linke schmale Leiste: Zeit, Haushalt, Bau-/Politikwerkzeuge
- rechte kontextuelle Leiste: ausgewähltes Viertel, Betrieb oder soziale Gruppe
- untere ausziehbare Leiste: Diagramme / Zeitreihen / Kausalinspektor

### Kartenmodi

- physische Stadt
- Beschäftigung
- Löhne
- Mieten
- Bodenwerte
- Eigentum
- Industrieauslastung
- politische Spannung
- Umweltbelastung

### Keine permanenten KPI-Kacheln

Zahlen werden in einer **ökonomischen Zeitung / Kontobuch-Leiste** gebündelt. Nur 4–6 aktuelle Schlüsselindikatoren bleiben ständig sichtbar.

---

## 14. Kausalinspektor

Das wichtigste Lernwerkzeug.

Der Spieler klickt z. B. auf:

**Arbeitslosigkeit: 14,2 % (+3,1)**

Darauf zeigt das Spiel die stärksten Ursachen:

1. Textilindustrie: -312 Stellen
   - Nachfrage -11 %
   - Lagerbestand +24 %
2. Mechanisierung in Stahlwerken: -87 Stellen
   - Produktivität +18 %
3. Neue Arbeitskräfte aus dem Umland: +142 Erwerbspersonen

Danach kann der Spieler weiter aufklappen:

`niedrige Nachfrage → schwacher Arbeiterkonsum → Reallohnrückgang → hohe Nahrungsmittelpreise`

Damit wird Systemdenken sichtbar, ohne lange Lehrtexte zu erzwingen.

---

## 15. Theorie-Karten

Eine Theorie-Karte wird nur einmal beim ersten Auftreten eines relevanten Phänomens angeboten.

Beispiele:

- Ware und Arbeitskraft
- Mehrwert
- Akkumulation
- industrielle Reservearmee
- Konzentration des Kapitals
- Klassenkampf
- Entfremdung (später / optional)
- Basis und Überbau (nur vorsichtig und nicht mechanistisch)

Jede Karte enthält:

1. **Was ist gerade im Spiel passiert?**
2. **Wie hat Marx das interpretiert?**
3. **Welche Annahme macht unser Modell?**
4. **Welche anderen Erklärungen wären möglich?**
5. **Werk / Kapitel als Literaturhinweis.**

---

## 16. Endzustände

Kein klassisches "gewonnen / verloren".

Nach dem Endjahr erstellt das Spiel ein Gesellschaftsprofil.

Mögliche Diagnosen sind emergent und können kombiniert werden:

- konkurrenzgetriebener Industriekapitalismus
- oligopolistischer Kapitalismus
- sozial regulierte Marktwirtschaft
- stagnierende Niedriglohnökonomie
- hochproduktive Konsumgesellschaft
- chronische Krisenökonomie
- korporatistischer Klassenkompromiss
- autoritäre Stabilisierung
- demokratisch-sozialistische Transformation
- revolutionärer Systembruch

Der Endbericht zeigt nicht nur den Namen, sondern die Kennzahlen und Kausalketten, die zu dieser Diagnose geführt haben.

---

## 17. Scope-Grenzen der ersten spielbaren Version

Bewusst **nicht** im ersten Release:

- Außenhandel mit dutzenden Ländern
- Währungen und Wechselkurse
- individuelle Politiker
- militärische Konflikte
- komplexe Zentralbank
- vollständiges Bankensystem
- Aktienmarkt
- individuelle Bürgeragenten
- Multiplayer

Diese Dinge würden die Zahl der Systeme erhöhen, bevor die zentralen Rückkopplungen funktionieren.

---

## 18. Definition eines gelungenen Spiels

MARXSIM ist gelungen, wenn ein Spieler nach einer Partie Sätze sagen kann wie:

- "Ich habe verstanden, warum eine Firma trotz guter Gewinne rationalisieren wollte."
- "Ich habe gesehen, wie dieselbe Rationalisierung die Nachfrage später geschwächt hat."
- "Ich konnte nachvollziehen, warum Arbeitslosigkeit die Löhne beeinflusst hat."
- "Ich habe gemerkt, dass ein einzelner Unternehmer das System nicht allein kontrolliert."
- "Ich habe auch gesehen, wo politische Reformen diese Dynamik verändern konnten."

Dann erklärt das Spiel politische Ökonomie durch Mechanik statt durch Behauptung.
