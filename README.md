# MARXSIM

**Status:** Version 1.0 — spielbarer Release.

**GitHub Pages:** https://kevni92.github.io/marxsim/

MARXSIM ist eine in sich geschlossene Singleplayer-Wirtschaftssimulation für den Browser. Sie macht zentrale Zusammenhänge aus Marx' Kapitalismusanalyse als dynamisches Modell erfahrbar, ohne deren Ergebnis vorzugeben. Firmen, Haushalte und politische Konflikte reagieren auf die tatsächlich simulierten Bedingungen statt auf vorgegebene historische Skripte.

## Version 1.0

- deterministischer Wirtschafts-, Arbeits- und Marktzyklus
- fünf gekoppelte Branchen: Nahrungsmittel, Textilien, Haushaltswaren, Kohle/Energie und Maschinenbau
- Zwischenproduktnachfrage und branchenübergreifende Lieferengpässe
- autonome Firmen mit Konkurrenz, Rationalisierung, Investition, Gründung, Insolvenz und Konzentration
- acht Bezirke und 64 Parzellen als interaktive Katasterkarte
- Bodenwerte, Mieten, Wohnungsdruck, Bautätigkeit und Binnenwanderung
- Chausseen, Bahnanschlüsse, Arbeiterwohnungsbau und Kanalisation
- Organisation, Unzufriedenheit, emergente Streiks und sieben politische Reforminstrumente
- Kausalinspektor mit strukturierten Ursachenketten
- acht Marx-Theorie-Karten mit Evidenz aus der laufenden Partie
- historische Diagramme, Betriebskartei, Kartenlegenden, Zoom/Pan und Ereignisstempel
- lokales Speichern/Laden sowie JSON-Export und -Import
- Abschlussbericht mit Klassenstruktur, Reallohn, Lohn-/Profitquote, Konzentration, Krisen und Streiktagen
- automatisierte Monte-Carlo-Validierung über 100 Seeds sowie Politikvergleich
- 15 maschinenlesbare Release-Kriterien für Version 1.0

## Entwicklung und Tests

`npm test` führt die Phasentests 1–11 aus. `npm run balance` simuliert 100 Seeds über jeweils 240 Monate und prüft auf numerische Instabilität, uniforme Endzustände und extreme Explosionen. GitHub Actions führt beides bei jedem Push auf `main` aus.

## Dokumentation

- [Game Design](docs/GAME_DESIGN.md)
- [Simulationsmodell](docs/SIMULATION_MODEL.md)
- [Rotfeld: Welt und Karte](docs/WORLD_AND_MAP.md)
- [Theorie-Matrix](docs/THEORY_MATRIX.md)
- [Visuelle Richtung](docs/VISUAL_DIRECTION.md)
- [Umsetzungsplan](docs/IMPLEMENTATION_PLAN.md)

Die veröffentlichte Anwendung benötigt kein Backend und keine externen Laufzeitbibliotheken.
