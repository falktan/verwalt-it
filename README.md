# verwalt-it
Webanwendung zum Bereitstellen von Formularen und Workflows für Verwaltungen.
Der jeweils aktuelle Entwicklungsstand ist hier erreichbar: https://verwalt-it-6e1f6e3175e9.herokuapp.com/


Die Anwendung ist noch nicht produktiv im Einsatz.

## Umgesetzter Usecase: Anmeldung zur Abschlussarbeit

Aktuell ermöglicht die Anwendung die Anmeldung zur Abschlussarbeit. Nutzer können sich über ein Formular registrieren und ihre relevanten Daten eingeben. Die Anwendung speichert diese. Dem angegebenen Betreuer wird eine Email gesendet, welche einen Link enthält, welche es erlaubt das Formular einzusehen und zu bestätigen.

## Tools
* npm, express, dotenv, mongoDB

## Entwicklung

### Umgebung konfigurieren
```
cp .env.example .env
```

### Installieren der Abhängigkeiten
```
npm install
```

### Start der Anwendung
```
npm start
```

### Verifikation
Die Anwendung steht dann im Browser unter
```
http://localhost:3000
```
zur Verfügung.


Health-Check testen:
```
curl http://localhost:3000/api/health
```
Erwartete Antwort: `{"status": "ok", "timestamp": "..."}`


### MongoDB Varianten
Im normalen betrieb wird eine MongoDB verwendet. Dafür muss sie über die Umgebung konfiguriert werden
indem der Wert `MONGODB_URL` gesetzt wird.

Um die Anwendung leichter testen zu können, kann auch eine einfache Mock-Datenbank, welche direkt
im Speicher der Anwendung liegt konfiguriert werden: `USE_MOCK_DB=true`.
Das ist der empfohlene Weg für Entwicklung an der Anwendung.

Eine weitere Variante ist es eine volle MongoDB, die im Speicher liegt zu starten. Das erlaubt
es insbesondere sicherzustellen, dass verwendete Funktionen sich mit einer echten MongoDB
gleich verhalten werden. Dafür muss die in-memory MongoDB installiert werden:
```
npm install mongodb-memory-server@10.2.0
```
Über die Umgebungsvariablen kann man diese dann verwenden:
```
USE_IN_MEMORY_DB=true
USE_MOCK_DB=false
```
Das Packet ist nicht in den normalen- oder dev-dependencies, damit das repo einfach und schnell mit
dem üblichen `npm install` Komando installiert werden kann, ohne diese etwas schwergewichtige
Abhängigkeit.

## Wichtige API-Endpunkte

- `GET /api/health` – Statusabfrage
- `POST /api/submit-form` – Formular absenden
- `POST /api/get-form-data` – Formulardaten per Token abrufen

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
