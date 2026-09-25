# MARXSIM — Simulationsmodell

Dieses Dokument definiert die **erste implementierbare Version** des Modells. Zahlen sind Startwerte für Balancing, keine empirischen Behauptungen.

## 1. Designregel

Jeder wichtige sichtbare Zustand muss aus wenigen nachvollziehbaren Größen entstehen. Keine versteckten Boni wie `+10 % Krise`, wenn derselbe Effekt über Nachfrage, Lager, Preise, Beschäftigung und Liquidität erzeugt werden kann.

Die Simulation ist deterministisch. Zufall wird nur über einen Seed erzeugt und hauptsächlich für Firmengründungen, kleinere Produktivitätsschocks und Ereignisvariation benutzt.

---

## 2. Tick-Reihenfolge

Ein Tick entspricht einem Monat.

1. Bevölkerung und Erwerbspersonen aktualisieren
2. Lebenshaltungskosten berechnen
3. Lohnangebote der Firmen anpassen
4. Arbeitsmarkt matchen
5. Produktion berechnen
6. Güterangebot und Lager aktualisieren
7. Haushaltsnachfrage berechnen
8. Verkäufe und Preise berechnen
9. Firmenkosten, Gewinne und Liquidität buchen
10. Insolvenzen prüfen
11. quartalsweise: Investitionen / Rationalisierung / Gründungen
12. Mieten und Bodenwerte aktualisieren
13. Umzüge und Stadtentwicklung aktualisieren
14. Organisierung, Konflikt und Politik aktualisieren
15. öffentliche Finanzen buchen
16. Kennzahlen und Ursachenbeiträge speichern
17. Ereignisse und Theorie-Karten prüfen

Die Reihenfolge wird nicht spontan verändert; sie ist Teil der Reproduzierbarkeit.

---

## 3. Haushaltsgruppen

Haushalte werden pro Kartenbezirk und Klasse aggregiert.

### Felder

- `population`
- `workers_available`
- `workers_employed`
- `money`
- `wage_income`
- `capital_income`
- `benefits`
- `rent`
- `food_spend`
- `discretionary_spend`
- `savings_rate`
- `organization`
- `discontent`
- `political_radicalization`

### Konsum

Verfügbares Einkommen:

`Yd = Löhne + Kapitaleinkommen + Transfers - direkte Steuern - Miete`

Bedarf wird in zwei Blöcke getrennt:

1. Grundbedarf: Nahrung und Wohnen
2. diskretionärer Konsum: Textilien und sonstige Waren

Arbeiterhaushalte haben eine höhere marginale Konsumquote als Kapitalbesitzer. Dadurch wirkt Einkommensverteilung auf Gesamtnachfrage, ohne dafür einen Sondermechanismus zu benötigen.

Startwerte fürs Balancing:

- Arbeiter: 92–98 % des verfügbaren Einkommens konsumierbar
- Kleinbürger: 80–90 %
- Kapitalbesitzer: 55–75 %

Nicht ausgegebenes Einkommen erhöht Vermögen / investierbares Kapital.

---

## 4. Firmenmodell

### Felder

- `sector`
- `district`
- `cash`
- `capital_stock`
- `technology`
- `employees`
- `desired_employees`
- `wage_offer`
- `capacity`
- `inventory`
- `unit_cost`
- `price`
- `sales`
- `revenue`
- `profit`
- `expected_demand`
- `age`

### Produktionsfunktion

Für V1 reicht eine verständliche Cobb-Douglas-ähnliche Näherung, aber mit klarer Kapazitätsgrenze:

`potential_output = base_productivity × labor^alpha × effective_capital^(1-alpha)`

`effective_capital = capital_stock × technology`

`output = min(potential_output, capacity)`

Start: `alpha ≈ 0.65`.

Das ist eine **Spielgleichung**, keine Behauptung, Marx habe diese Funktion verwendet.

---

## 5. Kapazitätsauslastung

`utilization = trailing_sales / productive_capacity`

Interpretation:

- < 0.65: deutliche Überkapazität
- 0.65–0.85: normal
- 0.85–0.95: hoher Auslastungsdruck
- > 0.95: Expansion wahrscheinlich

Unternehmen reagieren nicht nur auf aktuellen Gewinn, sondern auf geglättete Werte der letzten 6–12 Monate.

---

## 6. Preisbildung

Keine zentrale Auktion. Jede Firma hat einen Preis.

Monatliche Preisanpassung basiert auf:

- Lagerquote
- Auslastung
- durchschnittlichem Branchenpreis
- eigener Kostenentwicklung

Vereinfachte Zielregel:

`target_price = unit_cost × (1 + target_markup)`

Dann Modifikation:

- hohe Lagerbestände → Preis nähert sich nach unten
- knappe Lager / hohe Auslastung → Preis nähert sich nach oben
- sehr großer Abstand zum Branchenpreis → Wettbewerbsdruck

Preise springen nicht, sondern bewegen sich begrenzt pro Tick, z. B. maximal ±3 %.

---

## 7. Lohnbildung

Jede Firma setzt ein Lohnangebot.

Basis:

`subsistence_wage = cost_of_basic_basket`

Zielangebot:

`target_wage = subsistence_wage × labor_market_factor × organization_factor × legal_factor × profitability_factor`

### Arbeitsmarktfaktor

- Arbeitslosigkeit > 15 % → < 1.0
- Arbeitslosigkeit 5–8 % → ungefähr 1.0
- Arbeitslosigkeit < 3 % → > 1.0

### Organisationsfaktor

Gewerkschaften erhöhen die Fähigkeit, Produktivitäts- und Gewinnsteigerungen in höhere Löhne umzusetzen.

### Recht

Mindestlohn setzt Untergrenze.

### Begrenzung

Löhne verändern sich monatlich nur langsam. Das erzeugt Trägheit und macht Krisen sichtbar.

---

## 8. Arbeitsmarkt

Firmen melden gewünschte Arbeitsplätze.

Arbeiter wählen Arbeitgeber anhand von:

- Lohn
- Entfernung / Erreichbarkeit
- Arbeitsplatzsicherheit
- Arbeitszeit

Matching erfolgt aggregiert pro Bezirk, nicht personengenau.

Wenn offene Stellen > Arbeitslose:

- Besetzungsquote sinkt
- Firmen erhöhen tendenziell Löhne

Wenn Arbeitslose > offene Stellen:

- Firmen können Angebote langsamer erhöhen oder reduzieren

Damit entsteht die Reservearmee als **Resultat des Arbeitsmarkts**, nicht als fixer Modifier.

---

## 9. Gewinn und Überschuss

Firmenrechnung:

`revenue = sold_units × price`

`operating_cost = wages + inputs + rent + maintenance + taxes`

`profit = revenue - operating_cost`

Zusätzlich wird für die Erklärungsschicht gerechnet:

`net_new_value = revenue - intermediate_inputs - depreciation`

Verteilung:

- Löhne
- Steuern
- ggf. Finanzierung
- verbleibender Unternehmensüberschuss

Die Theorie-Karte erklärt, dass Marx die Beziehung von Arbeitswert, notwendiger Arbeit und Mehrarbeit anders und tiefer fasst als diese vereinfachte Spielrechnung. Die UI darf `profit == Mehrwert` **nicht** behaupten.

---

## 10. Investitionen

Quartalsweise prüft jede Firma:

### Expansion

Wahrscheinlich, wenn:

- hohe Auslastung
- positive erwartete Nachfrage
- genügend Liquidität
- Profitrate attraktiv

Effekt:

- Kapitalbestand steigt
- Kapazität steigt
- kurzfristig Nachfrage nach Bau / Maschinen steigt

### Rationalisierung

Wahrscheinlich, wenn:

- Lohnkosten hoch
- Technologie verfügbar
- Konkurrenzdruck hoch
- genügend Kapital vorhanden

Effekt:

- Technologie steigt
- Output pro Arbeiter steigt
- gewünschte Beschäftigung kann sinken

### Keine Investition

Bei schlechten Erwartungen halten Firmen Geld zurück. Dadurch können gleichzeitig viele profitable, aber pessimistische Firmen eine schwache Investitionsphase erzeugen.

---

## 11. Firmengründung und Insolvenz

### Gründung

Neue Firmen entstehen, wenn:

- Branchenprofitrate über Schwellenwert
- freies investierbares Vermögen vorhanden
- geeignetes Grundstück verfügbar
- erwartete Nachfrage positiv

### Insolvenz

Eine Firma schließt, wenn ihre Liquidität über mehrere Monate negativ bleibt und kein Puffer mehr vorhanden ist.

Folgen:

- Beschäftigte werden arbeitslos
- Grundstück wird frei
- produktives Kapital wird teilweise abgeschrieben / übernommen
- Marktanteile verteilen sich neu

Später kann ein Teil insolventer Firmen von Konkurrenten übernommen werden. Das verstärkt Konzentration.

---

## 12. Erwartungsbildung

Firmen sind keine allwissenden Optimierer.

`expected_demand = weighted_average(sales_last_12_months) × trend_factor`

Neue Informationen werden mit Trägheit aufgenommen. So können Firmen gleichzeitig zu optimistisch investieren und Überkapazität erzeugen.

---

## 13. Krise

Es gibt keinen einzelnen Krisenwürfel.

Ein **Krisenindex** dient nur zur Diagnose und basiert auf:

- Rückgang realer Verkäufe
- steigenden Lagern
- fallender Auslastung
- Insolvenzen
- steigender Arbeitslosigkeit
- rückläufigen Investitionen

Beispiel:

`crisis_index = weighted(z_sales_drop, z_inventory, z_unemployment, z_bankruptcies, z_investment_drop)`

Eine "Krise" wird als Ereignis gemeldet, wenn der Index mehrere Monate über einem Schwellenwert bleibt.

---

## 14. Kapitalakkumulation und Konzentration

Unternehmensvermögen:

`capital_next = capital_current + retained_profit + new_investment - depreciation`

Konzentration wird gemessen über:

- Marktanteil Top 1
- Marktanteil Top 3
- HHI
- Anteil des produktiven Kapitals der größten 10 % Firmen

Die UI zeigt Veränderungen über Jahrzehnte.

---

## 15. Produktivität und Technologie

Technologie wird nicht als abstrakter globaler Bonus verteilt.

Es gibt Epochen-Schwellen:

- frühe Mechanisierung
- Dampfkraft
- verbesserte Werkzeugmaschinen
- Eisenbahnlogistik
- spätere Elektrifizierung als optionales Endspiel

Firmen übernehmen Technologien abhängig von:

- Kapital
- Branchenpassung
- Lohnkosten
- Konkurrenzdruck

Technischer Fortschritt kann deshalb gleichzeitig Wohlstand **und** Verdrängung erzeugen.

---

## 16. Raumökonomie

### Erreichbarkeit

Jeder Bezirk erhält einen `access_score` aus:

- Straße
- Bahn
- Hafen
- Entfernung zum Marktzentrum

### Firmenstandort

Attraktivität:

`firm_score = access + labor_supply + resource_bonus - land_cost - tax_cost - congestion`

### Wohnstandort

`housing_score = job_access + service_access - rent - pollution - crowding`

Haushaltsklassen gewichten diese Faktoren unterschiedlich.

### Bodenwert

Steigt bei:

- besserer Erreichbarkeit
- hoher Nachfrage
- zentraler Lage

Sinkt bei:

- starker Umweltbelastung
- Leerstand

Damit kann Infrastruktur gleichzeitig Wachstum und Verdrängung auslösen.

---

## 17. Wohnen und Mieten

Jeder Bezirk hat Wohnkapazität.

`rent_pressure = households_demanding_space / available_housing`

Mieten reagieren langsam auf Druck.

Hohe Mieten:

- erhöhen Lebenshaltungskosten
- erhöhen notwendigen Lohn
- reduzieren verfügbaren Konsum
- treiben ärmere Haushalte in Randbezirke
- schaffen Anreiz für Bauinvestitionen

Damit wird Wohnungsnot Teil der Ökonomie und nicht nur ein Zufallsevent.

---

## 18. Klassenstruktur

Klassenzuordnung basiert primär auf Einkommen und Eigentum:

- Arbeiter: Haupteinkommen aus Lohn
- Arbeitslose: arbeitsfähig, kein Beschäftigungsverhältnis
- Kleinbürger: eigenes kleines produktives Eigentum + eigene Arbeit
- Kapitalbesitzer: Haupteinkommen aus Unternehmens-/Kapitalertrag

Übergänge sind möglich:

- Handwerker wird erfolgreicher Unternehmer
- Kleinbetrieb geht bankrott → Besitzer wird Arbeiter
- Arbeiter akkumuliert kleines Vermögen → geringe Chance auf Selbstständigkeit

---

## 19. Organisierung und Konflikt

`organization` steigt durch:

- räumliche Konzentration vieler Arbeiter
- stabile große Betriebe
- gemeinsame schlechte Erfahrungen
- legalisierte Gewerkschaften
- erfolgreiche frühere Aktionen

`discontent` steigt durch:

- Reallohnverlust
- Arbeitslosigkeit
- hohe Mietbelastung
- lange Arbeitszeit
- sichtbare Gewinnsteigerungen bei stagnierenden Löhnen

Streikpotenzial entsteht aus beiden Größen:

Hohe Unzufriedenheit ohne Organisation = diffuse Unruhe.
Hohe Organisation ohne Unzufriedenheit = Verhandlungsmacht.
Beides hoch = Streik / politischer Konflikt wahrscheinlich.

---

## 20. Staat und Budget

Einnahmen:

- Einkommen-/Lohnsteuer
- Unternehmenssteuer
- Bodensteuer
- Verbrauchsabgaben optional

Ausgaben:

- Infrastruktur
- Verwaltung
- Armenhilfe / Transfers
- Sozialversicherung
- öffentlicher Wohnungsbau

Defizite sind zunächst möglich, aber begrenzt. Ein vollständiger Anleihemarkt gehört nicht in V1.

---

## 21. Politische Unterstützung

Keine klassische Parteien-KI in V1.

Stattdessen besitzt jede soziale Gruppe Unterstützungswerte für Politikrichtungen:

- Laissez-faire
- sozialreformerisch
- sozialistisch
- autoritär / repressiv

Diese Werte ergeben sich aus materieller Lage, Sicherheit, Organisation und bisherigen Entscheidungen.

Reformen benötigen ausreichenden politischen Druck oder Legitimität. So werden starke Eingriffe nicht einfach als Tech-Tree gekauft.

---

## 22. Kausalprotokoll

Jede relevante Veränderung wird mit Ursachenbeiträgen gespeichert.

Beispiel:

`unemployment +2.4pp`

Beiträge:

- `+1.1pp textile layoffs`
- `+0.7pp mine closure`
- `+0.4pp rural migration`
- `+0.2pp machinery substitution`

Das Protokoll speichert nur die wichtigsten Beiträge pro Tick, damit Speicherbedarf klein bleibt.

Dasselbe System speist:

- Tooltips
- Kausalinspektor
- Jahresbericht
- Endbericht

---

## 23. Kernkennzahlen

Monatlich speichern:

### Produktion
- realer Output
- Output je Arbeiter
- Kapazitätsauslastung
- Investitionen

### Arbeit
- Beschäftigung
- Arbeitslosenquote
- nominaler Lohn
- Reallohn
- Arbeitszeit
- Organisationsgrad

### Verteilung
- Lohnquote
- Profitquote
- Vermögensanteil nach Klasse
- Kapitalanteil Top-10-%-Firmen

### Markt
- Preisindex
- Lagerquote
- Nachfrage
- Insolvenzen

### Raum
- Durchschnittsmiete
- Wohnungsengpass
- Bodenwert
- Pendeldistanz
- Umweltbelastung

### Politik
- Staatsbudget
- Transfers
- soziale Spannung
- Streiktage

---

## 24. Balancing-Ziele

Eine neutrale Baseline ohne extreme Spielereingriffe soll **nicht** immer dasselbe Ende erzeugen.

Gewünschtes Verhalten über unterschiedliche Seeds:

- Industrialisierung fast immer attraktiv
- mindestens eine merkliche Konjunkturdelle wahrscheinlich
- starke Firmenkonzentration möglich, aber nicht garantiert
- langfristig steigende Produktivität
- Reallöhne können langfristig steigen, müssen aber nicht proportional zur Produktivität steigen
- sozialpolitische Eingriffe können Stabilität erhöhen, aber Budget-/Kostenwirkungen besitzen
- maximale Deregulierung ist weder automatisch optimal noch automatisch katastrophal
- maximale Regulierung ist weder automatisch optimal noch kostenlos

---

## 25. Simulations-Invarianten

Automatisierte Tests müssen mindestens prüfen:

- Bevölkerung wird nie negativ
- Beschäftigte <= Erwerbspersonen
- Lagerbestände werden nie negativ
- Firma verkauft nie mehr als verfügbar
- Summe der Marktanteile ≈ 100 % je Branche
- Geldbuchungen erzeugen keine NaN/Infinity-Werte
- identischer Seed erzeugt identische Zeitreihen
- pausierte Simulation verändert keinen Zustand
- Regeln gelten identisch bei 1×, 2× und 4× Geschwindigkeit

---

## 26. V1-Parameterisierung

Alle Balancewerte liegen später in **einer zentralen Konfiguration**, nicht verteilt in UI- oder Simulationscode.

Parametergruppen:

- `population`
- `households`
- `firms`
- `laborMarket`
- `prices`
- `investment`
- `technology`
- `housing`
- `politics`
- `events`

So kann das Modell ohne Umbau des Codes kalibriert werden.
