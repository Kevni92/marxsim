# MARXSIM

**Status:** Preproduction / Game-Design-Phase. Das eigentliche Spiel ist noch nicht implementiert.

MARXSIM wird eine in sich geschlossene Singleplayer-Wirtschaftssimulation für den Browser. Ziel ist nicht, Marx' Aussagen als Wahrheit zu behaupten, sondern die von Marx beschriebenen Mechanismen als **spielbares Modell** erfahrbar zu machen: Lohnarbeit, Mehrwert, Konkurrenz, Kapitalakkumulation, technische Rationalisierung, Reservearmee der Arbeit, Nachfragekrisen, Klassenbildung, Gewerkschaften, Reformen und politische Konflikte.

Der Spieler steuert **nicht die gesamte Wirtschaft**. Private Betriebe und Haushalte handeln autonom. Der Spieler beeinflusst die Entwicklung als kommunale/staatliche Instanz durch Infrastruktur, Regeln, Steuern, Sozialpolitik und politische Entscheidungen. Dadurch soll der eigentliche Kern sichtbar werden: Akteure reagieren auf Anreize und Zwänge des Systems, statt nur Skripte abzuarbeiten.

## Leitprinzipien

- **Spiel zuerst, Theorie aus dem Spiel heraus erklären.** Keine Quiz-App.
- **Systemische Rückkopplungen statt geskripteter Moral.** Gute Absichten können schlechte Folgen haben und umgekehrt.
- **Keine vorgegebene marxistische Erfolgsgeschichte.** Kapitalismus kann stabilisiert, reformiert, oligopolisiert oder in eine Systemkrise geführt werden.
- **Visuell eigenständig.** 19.-Jahrhundert-Katasterkarte, Industrie-Lithografie, Buchhaltung und politische Flugblätter statt generischer Game-Dashboard-Optik.
- **Offline-fähig.** Kein Backend, keine API, keine externen Laufzeitabhängigkeiten. Die spätere Spielversion soll per `index.html` lokal startbar sein.
- **Deterministisch testbar.** Gleicher Seed + gleiche Entscheidungen = gleiche Entwicklung.

## Dokumentation

- [Game Design](docs/GAME_DESIGN.md)
- [Simulationsmodell](docs/SIMULATION_MODEL.md)
- [Visuelle Richtung](docs/VISUAL_DIRECTION.md)
- [Umsetzungsplan](docs/IMPLEMENTATION_PLAN.md)

## Geplanter technischer Rahmen

Die endgültige Anwendung bleibt statisch und browserbasiert. Die Simulation wird in klar getrennte Systeme zerlegt (Zeit, Bevölkerung, Firmen, Markt, Investitionen, Politik, Ereignisse, Erklärungsschicht). Die Karte wird als eigene Simulations- und Darstellungsebene behandelt, nicht als dekorativer Hintergrund.

GitHub Pages soll bei jedem Push auf `main` den aktuellen Stand veröffentlichen. Während der Preproduction zeigt Pages zunächst nur das Design-Dossier; später wird derselbe Deployment-Pfad das eigentliche Spiel ausliefern.
