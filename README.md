# verwalt-it
Webanwendung zum Bereitstellen von Formularen und Workflows für Verwaltungen

## Umgesetzter Usecase: Anmeldung zur Abschlussarbeit

Aktuell ermöglicht die Anwendung die Anmeldung zur Abschlussarbeit. Nutzer können sich über ein Formular registrieren und ihre relevanten Daten eingeben. Die Anwendung speichert diese. Dem angegebenen Betreuer wird eine Email gesendet, welche einen Link enthält, welche es erlaubt das Formular einzusehen und zu bestätigen.

## Tools
* npm, express, dotenv, mongoDB

## Entwicklung

### Installieren der Abhängigkeiten

```
npm install
```

### Start der Anwendung
```
npm start
```

### MongoDB Varianten
Die App ist in der .env so konfiguriert, das für die MongoDB ein einfacher Mock verwendet wird.
Um einer echten MongoDB näher zu kommen kann auch eine in-memory MongoDB installiert werden:
```
npm install mongodb-memory-server@10.2.0
```
Über die Umgebungsvariablen kann man diese dann verwenden:
```
USE_IN_MEMORY_DB=true
USE_MOCK_DB=false
```
Das Packet ist nicht in den normalen- oder dev-dependencies, damit das repo einfach und schnell mit
dem üblichen `npm install` Komando installiert werden kann. Das ist insbesondere für Copilot in der Github Umgebung relevant, weil dort die Installation wegen Netzwerkeinschränkungen fehlschlägt.

## Verzeichnisstuktur

```
│   .env  # configuration based on "dotenv"
│   app.js  # main entry point
│   package.json
│   README.md  # this readme
│
├───api  # the backend
│       dataStore.js
│       dbConnect.js
│       index.js
│       mockDatabase.js
│       renderEmail.js
│
└───public  # the frontend. Static sites served without processing
    │   index.html  # start page
    │   main.js
    │   style.css  # one style file used everywhere
    │
    ├───assets
    │       logo.png
    │
    └───form  # Anmeldung zur Abschlussarbeit
        │   confirm.html
        │   confirm.js
        │   index.html
        │   main.js
```
