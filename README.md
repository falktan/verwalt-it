# verwalt-it
Webanwendung zum Bereitstellen von Formularen und Workflows für Verwaltungen

## Umgesetzter Usecase: Anmeldung zur Abschlussarbeit

Aktuell ermöglicht die Anwendung die Anmeldung zur Abschlussarbeit. Nutzer können sich über ein Formular registrieren und ihre relevanten Daten eingeben. Die Anwendung speichert diese. Dem angegebenen Betreuer wird eine Email gesendet, welche einen Link enthält, welche es erlaubt das Formular einzusehen und zu bestätigen.

## Tools
* npm, express, dotenv, mongoDB

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
    │   style.css
    │
    ├───assets
    │       logo.png
    │
    └───form  # Anmeldung zur Abschlussarbeit
        │   confirm.html
        │   confirm.js
        │   index.html
        │   main.js
        │
        └───datenschutzerklaertung
                index.html
```
