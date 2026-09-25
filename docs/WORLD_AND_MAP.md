# MARXSIM — Rotfeld: Welt- und Kartenplan

## 1. Grundidee

Die Spielregion **Rotfeld** ist keine generische rechteckige City-Builder-Karte, sondern ein enger Flusskorridor, dessen Geographie Industrialisierung räumlich kanalisiert.

Die Karte soll wie ein vermessenes Blatt aus einem Katasteratlas wirken. Das Gelände erzeugt echte ökonomische Entscheidungen: billiges Land ist oft schlecht angebunden; zentraler Raum ist knapp; Kohle liegt nicht dort, wo Arbeiter wohnen; die Bahn verändert das gesamte Standortgefüge.

---

## 2. Kartenform

Ungefähr 1400 × 900 interne SVG-Einheiten.

### Natürliche Struktur

- Fluss **Rote** verläuft von Nordwest nach Südost.
- enger Altstadtkern an einer historischen Steinbrücke.
- flacher Talboden südlich des Flusses: billig, überschwemmungsgefährdet, später Industrie.
- Hügel im Nordosten: Kohlevorkommen, teuer zu erschließen.
- westlicher Rand: Dörfer und Landwirtschaft.
- südöstlicher Rand: möglicher Eisenbahnanschluss zur Außenwelt.

Die Karte besitzt zu Beginn keine flächendeckende Bahn.

---

## 3. Acht Bezirke

### A. Altmarkt

Historischer Stadtkern.

Start:
- hohe Bevölkerungsdichte
- Handwerker
- Markt
- hohe Bodenwerte
- schlechte Erweiterbarkeit

Ökonomische Funktion:
- zentrale Nachfrage
- frühe Kleingewerbe
- später Verdrängungsdruck durch steigende Mieten

Visuell:
- enge schwarze Gebäudekonturen
- Marktplatz
- Kirche/Rathaus nur als Orientierungspunkte, ohne spielmechanische Dominanz

---

### B. Mühlenwerder

Flussufer westlich der Stadt.

Start:
- Wassermühlen
- frühe Textilproduktion
- mittlerer Bodenpreis

Entwicklung:
- idealer Ort für erste größere Textilfabriken
- später logistischer Nachteil gegenüber Bahnstandorten möglich

Lernfunktion:
- Übergang vom Handwerk zur Fabrik

---

### C. Rabenfeld

Südlicher Talboden.

Start:
- Landwirtschaft
- sehr billiges Land
- geringe Erreichbarkeit

Entwicklung:
- klassischer Industriegürtel, sobald Straße/Bahn gebaut wird
- Fabrikhallen, Lager, Schornsteine

Lernfunktion:
- Infrastruktur verändert Kapitalstandorte

---

### D. Kohlberg

Nordöstliche Hänge.

Start:
- kleines Dorf
- Kohlereserve
- geringe Wohnattraktivität

Entwicklung:
- Bergbau
- hoher Arbeitskräftebedarf
- Umweltbelastung
- starker Transportbedarf

Lernfunktion:
- Rohstofflage, Lohnarbeit und Infrastruktur

---

### E. Brückenvorstadt

Direkt südlich der historischen Brücke.

Start:
- günstige Wohnbebauung
- viele Tagelöhner

Entwicklung:
- dichtes Arbeiterviertel
- Mietdruck
- politische Organisierung

Lernfunktion:
- räumliche Konzentration von Arbeitern und Klassenbildung

---

### F. Lindenhöhe

Höher gelegenes Gebiet nördlich des Altmarkts.

Start:
- dünn besiedelt
- sauber
- teuer

Entwicklung:
- Wohnort wohlhabender Haushalte / Unternehmer
- hohe Bodenpreise

Lernfunktion:
- räumliche Segregation durch Einkommen und Bodenwert

---

### G. Südbahnhof

Zu Spielbeginn nur unerschlossenes Land am Kartenrand.

Freischaltung:
- über große Infrastrukturentscheidung

Entwicklung:
- Bahnhof
- Maschinenbau
- Lager
- neue Wohnquartiere

Lernfunktion:
- Infrastruktur kann alte Zentren entwerten und neue schaffen

---

### H. Weiden

Westliches Umland.

Start:
- Dörfer
- Landwirtschaft
- geringe Löhne

Entwicklung:
- Bevölkerung wandert bei städtischer Arbeitsnachfrage in die Stadt
- bleibt bei hoher städtischer Arbeitslosigkeit länger agrarisch

Lernfunktion:
- Entstehung eines industriellen Arbeitskräfteangebots

---

## 4. Grundstückscluster

Je Bezirk ca. 6–10 Cluster.

Gesamtziel: 56–64 Cluster.

Cluster sind unregelmäßige Polygone, keine quadratischen Tiles.

Jeder Cluster enthält:

- `districtId`
- `landArea`
- `landValue`
- `roadAccess`
- `railAccess`
- `riverAccess`
- `resourceCoal`
- `floodRisk`
- `pollution`
- `housingCapacity`
- `industrialCapacity`
- `use`

---

## 5. Startbild 1840

Der erste Blick soll fast enttäuschend wenig „Industrie“ zeigen:

- kompakter Altmarkt
- einige Mühlen
- Felder
- Dörfer
- eine primitive Kohlegrube
- zwei Hauptstraßen
- keine Bahn

Damit sieht der Spieler später tatsächlich, was Industrialisierung räumlich bedeutet.

### Startfirmen

Beispiel:

- Gebrüder Falk Textilwerkstatt — Mühlenwerder
- Tuchhaus Bern — Altmarkt
- Eisenwaren Kranz — Altmarkt
- Kohlengrube Morgenstern — Kohlberg
- Mühle Rott & Sohn — Mühlenwerder
- Baugeschäft Hecht — Brückenvorstadt
- mehrere kleine Nahrungsmittelbetriebe

Firmennamen werden aus lokalen Namenslisten erzeugt; keine albernen Zufallsnamen.

---

## 6. Erwartbare, aber nicht geskriptete Stadtentwicklung

### Typischer früher Verlauf

`Mühlenwerder wächst → Arbeitsplätze steigen → Brückenvorstadt verdichtet sich → Mieten steigen`

### Nach Bahnanschluss

`Südbahnhof wird attraktiv → neue Maschinenbetriebe → Rabenfeld industrialisiert → Altmarkt verliert Gewerbeanteil`

### Bei starkem Kohlestahl-Komplex

`Kohlberg + Rabenfeld wachsen → Umweltbelastung steigt → wohlhabende Haushalte ziehen Richtung Lindenhöhe`

### Bei starker Regulierung / öffentlichem Wohnungsbau

`Brückenvorstadt bleibt dichter, aber Mietbelastung sinkt → weniger Verdrängung → höheres verfügbares Einkommen`

Nichts davon wird fest vorgegeben. Die Karte liefert nur die Bedingungen.

---

## 7. Infrastrukturentscheidungen

### Straße ausbauen

Kosten: niedrig bis mittel.

Wirkung:
- Zugang verbessert
- Pendelzeit sinkt
- Standortwert steigt

### Eisenbahn

Kosten: sehr hoch.

Wirkung:
- großer Logistikbonus
- Kohle / Eisen profitieren besonders
- Bodenwerte entlang Knoten steigen
- kann alte Produktionsstandorte schwächen

### Flusshafen

Kosten: mittel.

Wirkung:
- günstiger Massengütertransport
- stärkt Mühlenwerder / Altmarkt

### Öffentlicher Wohnungsbau

Wirkung:
- Wohnkapazität
- Mieten
- Pendelstruktur
- Staatsbudget

---

## 8. Karten-Semantik

Gebäudegröße ist niemals rein dekorativ.

### Fabrik-Footprint

Abgeleitet aus:

- Kapitalstock
- Kapazität
- Branche

### Schornsteinaktivität

Abgeleitet aus:

- tatsächlicher Auslastung

Eine stillgelegte Fabrik raucht nicht.

### Wohnungsdichte

Abgeleitet aus:

- Haushalten / Kapazität
- Bauinvestitionen

### Leerstand

Sichtbar durch:

- blassere Schraffur
- unterbrochene Gebäudekonturen

---

## 9. Kleine narrative Details

Die Welt soll Charakter haben, ohne die Simulation mit Story zu überladen.

Beispiele:

- Firmen bekommen Gründungsjahr und Besitzername.
- Straßen können nach Jahrzehnten ihren informellen Namen wechseln („Mühlenweg“ → „Fabrikstraße“).
- Zeitung nennt reale Firmen aus der Simulation.
- Ein großer Streik wird später im Chronikbuch referenziert.
- geschlossene Fabriken bleiben einige Jahre als leere Gebäude sichtbar.

Damit entwickelt die Partie eine eigene Geschichte.

---

## 10. Karte als historische Quelle

Am Ende einer Partie kann der Spieler zwischen:

- Karte 1840
- Karte 1860
- Karte 1880
- Karte 1900
- Endkarte

umschalten.

So wird Industrialisierung nicht nur als Diagramm, sondern als räumliche Transformation sichtbar.
