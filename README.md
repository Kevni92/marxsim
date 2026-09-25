# MARXSIM

**Status:** Spielbarer Entwicklungsstand — Phasen 0–6 umgesetzt.

**GitHub Pages:** https://kevni92.github.io/marxsim/

MARXSIM ist eine in sich geschlossene Singleplayer-Wirtschaftssimulation für den Browser. Sie macht zentrale Zusammenhänge aus Marx' Kapitalismusanalyse als dynamisches Modell erfahrbar, ohne deren Ergebnis vorzugeben.

Aktuell umgesetzt sind ein deterministischer Wirtschafts- und Marktzyklus, autonome Firmen, Kapitalakkumulation und Konkurrenz, die acht Bezirke von Rotfeld als interaktive Katasterkarte, Boden- und Wohnungsmärkte, Infrastrukturinvestitionen sowie Organisation, Streiks und sozialpolitische Reformen.

## Aktuelle Spielsysteme

- Lohnarbeit, Produktion, Nachfrage, Lager, Preise und Gewinne
- Konkurrenz, Rationalisierung, Gründung, Insolvenz, Übernahme und Konzentration
- acht Bezirke, 64 Parzellen und räumliche Standortentscheidungen
- Mieten, Bodenwerte, Wohnungsdruck, private Bautätigkeit und Binnenwanderung
- Chausseen, Bahn, Arbeiterwohnungsbau und Kanalisation mit indirekten Raumwirkungen
- Organisation und Unzufriedenheit aus materiellen Bedingungen
- emergente Streiks mit Produktionswirkung und Erinnerungseffekt
- Reformdruck sowie sieben politische Eingriffe
- deterministische Seeds und automatisierte Phasentests

## Dokumentation

- [Game Design](docs/GAME_DESIGN.md)
- [Simulationsmodell](docs/SIMULATION_MODEL.md)
- [Rotfeld: Welt und Karte](docs/WORLD_AND_MAP.md)
- [Theorie-Matrix](docs/THEORY_MATRIX.md)
- [Visuelle Richtung](docs/VISUAL_DIRECTION.md)
- [Umsetzungsplan](docs/IMPLEMENTATION_PLAN.md)

GitHub Pages wird bei jedem Push auf `main` aktualisiert. Die Anwendung benötigt kein Backend und keine externen Laufzeitbibliotheken.
