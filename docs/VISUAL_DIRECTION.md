# MARXSIM — Visuelle Richtung

## 1. Leitidee

MARXSIM soll aussehen, als wäre eine **Katasterkarte, ein Fabrikbuch, eine Statistik des 19. Jahrhunderts und ein politisches Flugblatt** zu einer interaktiven Oberfläche geworden.

Nicht gewünscht:

- Neon-Dashboard
- generische Karten-Kacheln mit abgerundeten Panels
- 3D-Isometrie ohne funktionalen Mehrwert
- austauschbare „AI-Slop“-Illustrationen
- permanente KPI-Kachelwände
- große Hero-Illustrationen ohne Spielbezug

Gewünscht:

- Papier, Tinte, Messlinien, Schraffuren
- feine rote Verwaltungsmarkierungen
- schwarze / graue Industrieformen
- wenige gezielte Animationen
- typografische Hierarchie wie in Zeitung, Atlas und Hauptbuch
- Karte als dominierende Spielfläche

---

## 2. Farbwelt

Basis:

- Papier: warmes Beige / gebrochenes Weiß
- Tinte: tiefes Anthrazit
- Linien: graubraun
- Akzent: dunkles Verwaltungsrot
- Messing / Ocker nur sparsam

Semantische Farben werden zurückhaltend eingesetzt:

- Rot: Konflikt, Warnung, politischer Druck
- Blaugrün: Infrastruktur / Wasser / Transport
- dunkles Grün: Landwirtschaft
- Schwarzgrau: Industrie / Kohle

Kartenmodi dürfen stärker kolorieren, die physische Standardkarte bleibt gedämpft.

---

## 3. Typografie

Offline-fähig, daher Systemfonts statt Webfont-Abhängigkeit.

Empfehlung:

- Überschriften / Fließtext: Georgia oder Times New Roman
- Zahlen / UI / Beschriftungen: Arial / Arial Narrow / system sans-serif

Kontrast entsteht nicht durch fünf Schriftarten, sondern durch:

- Serif vs. Sans
- Versalien
- Letterspacing
- Linien
- Größenhierarchie

---

## 4. Karte

### Darstellung

Die Karte ist eine orthografische 2D-Fläche mit klar abgegrenzten Grundstücks- und Bezirksformen.

Sie zeigt:

- Fluss
- Straßen
- Bahn
- Grundstücksgrenzen
- Gebäudegrundrisse
- Fabrikhallen
- Schornsteine
- Wohnblöcke
- Märkte
- Bergbauflächen

### Gebäude

Keine detaillierten individuellen 3D-Gebäude. Stattdessen lesbare, abstrahierte 2D-Grundrisse und Fassadenmarker.

Ein Industriecluster verändert sich stufenweise:

1. kleine Werkstatt
2. Hofgebäude
3. frühe Fabrik
4. große Fabrikhalle
5. Fabrikkomplex

Wohnbebauung ebenfalls:

1. verstreute Häuser
2. Blockrandansätze
3. dichtes Arbeiterviertel
4. überfüllter Bestand / Hinterhöfe

### Animation

Sparsam:

- Rauch aus aktiven Fabriken
- kurze Zugbewegung entlang fertiger Strecke
- Lastkähne am Fluss
- schwache Bauanimation bei Expansion
- punktuelle Mensch-/Warenbewegung nur als abstrakte Striche/Punkte

Keine dauerhaft wuselnde „City Builder“-Masse.

---

## 5. Karten-Layer

Per Kartenmodus wird dieselbe Geometrie anders eingefärbt.

### Standard
Physische Stadtentwicklung.

### Arbeit
- Arbeitsplätze
- offene Stellen
- Arbeitslosigkeit nach Wohnbezirk

### Einkommen
- Reallohn
- verfügbares Haushaltseinkommen

### Wohnen
- Miete
- Überbelegung
- Wohnqualität

### Kapital
- Eigentümerstruktur
- Unternehmenskonzentration
- Investitionsvolumen

### Industrie
- Auslastung
- Lagerdruck
- Produktivität

### Politik
- Organisation
- Unzufriedenheit
- Streikpotenzial

### Umwelt
- Rauch / Belastung
- Wohnattraktivität

Layer sollen nie nur Farbe zeigen; Legende und Klick-Details erklären die zugrunde liegende Kennzahl.

---

## 6. Hauptlayout Desktop

### Oberer Rand

Schmale Zeitungs-/Chronikzeile:

- Jahr / Monat
- Pause / Geschwindigkeit
- Staatskasse
- 3–5 Schlüsselindikatoren
- aktueller Zustand („Expansion“, „Abschwung“, „Streikwelle“)

### Linke Seite

Werkzeugleiste als Verwaltungsmappe:

- Infrastruktur
- Haushalt
- Arbeitsrecht
- Soziales
- Eigentum / Unternehmen
- Statistik

Keine riesigen Icons; beschriftete kleine Werkzeuge.

### Mitte

Karte: ca. 65–70 % der nutzbaren Fläche.

### Rechte Seite

Kontextinspektor erscheint nur bei Auswahl:

- Bezirk
- Firma
- soziale Gruppe
- Infrastruktur

### Unten

Ausziehbares „Hauptbuch“ mit:

- Zeitreihen
- Firmenliste
- Klassenstruktur
- Kausalinspektor
- Jahreschronik

---

## 7. Firmenansicht

Beim Klick auf eine Fabrik erscheint kein Sci-Fi-Panel, sondern eine Art Fabrikkarteikarte.

Inhalt:

- Name
- Branche
- Gründungsjahr
- Eigentümergruppe
- Beschäftigte
- Lohn
- Produktion
- Preis
- Lager
- Umsatz
- Gewinn
- Kapitalstock
- Technologie

Darunter ein kleines 12-Monats-Diagramm.

Besonders wichtig: **„Warum?“**

Beispiel:

> Beschäftigung -18
>
> - Nachfrageerwartung -9 %
> - neue Maschine +14 % Produktivität
> - Lagerbestand 2,4 Monatsverkäufe

---

## 8. Theorie-Einblendungen

Theorie soll optisch wie eine Randnotiz / eingefügte Buchseite erscheinen, nicht wie Tutorial-Popups.

Aufbau:

**MEHRWERT**

1. Im Spiel beobachtet
2. Marx' Interpretation
3. Modellannahme
4. alternative Lesart
5. Quelle

Ein Button „Auf der Karte zeigen“ markiert die Firmen / Daten, die den Begriff ausgelöst haben.

---

## 9. Diagramme

Diagramme sind ein zentraler Teil des Spiels, aber visuell wie historische Statistikblätter.

Regeln:

- dünne Linien
- kaum Hintergrundflächen
- klare Achsen
- maximal 3–4 Reihen gleichzeitig
- direkte Linienbeschriftung statt großer Legenden
- Vergleich „vor / nach Gesetz“ möglich

Wichtige Diagramme:

- Produktivität vs. Reallohn
- Arbeitslosigkeit vs. Lohnwachstum
- Lohnquote vs. Profitquote
- Investitionen vs. Auslastung
- Marktanteil Top-3
- Mieten vs. Haushaltseinkommen
- Organisationsgrad vs. Streiktage

---

## 10. Krisendarstellung

Eine Krise verändert die UI nicht künstlich in Rot.

Sie wird sichtbar durch:

- stillstehende Fabriken
- weniger Rauch
- freie Werkhallen
- sinkende Zugbewegungen
- Arbeitslosenmarkierungen in Wohnvierteln
- Zeitungsschlagzeilen
- fallende Zeitreihen

Nur ernsthafte akute Ereignisse bekommen rote Stempel / Warnmarkierungen.

---

## 11. Sound

Optional, lokal eingebettet.

Keine Musikschleife im MVP.

Später:

- leises Industrieambiente abhängig von Kartenausschnitt
- Zug / Dampf / Werkhalle
- Papier- und Stempelgeräusche für UI
- Streik / Menschenmenge sehr dezent

Sound darf keine externe CDN-Abhängigkeit erzeugen.

---

## 12. Responsive Verhalten

Primär Desktop.

Mindestziel: 1280×720.

Bei kleineren Breiten:

- rechte Seitenleiste wird Drawer
- Hauptbuch wird Fullscreen-Sheet
- Karte bleibt bedienbar

Smartphone-Unterstützung ist kein Ziel der ersten Version.

---

## 13. Wiedererkennbare visuelle Motive

MARXSIM soll drei wiederkehrende Motive besitzen:

1. **Roter Verwaltungsstempel**
   - Reform beschlossen
   - Streik
   - Insolvenz
   - Krisendiagnose

2. **Schwarze Produktionsschraffur**
   - Industrieintensität
   - aktives Kapital

3. **Bleistift-/Tintenpfeile**
   - Kausalinspektor
   - historische Entwicklung

Diese Motive ersetzen viele generische Icons.

---

## 14. Qualitätskriterium

Ein Screenshot ohne Logo soll erkennbar nach **MARXSIM** aussehen und nicht wie eine austauschbare React-Admin-Oberfläche.
