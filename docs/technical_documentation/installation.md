# Installation

Diese Anleitung beschreibt die Installation der verwalt-it Anwendung auf einem Server.

## Voraussetzungen

Siehe [minimale Anforderungen](minimum-requirements.md).

## Installation

### 1. Repository klonen

```bash
git clone https://github.com/falktan/verwalt-it.git
cd verwalt-it
```

### 2. Abhängigkeiten installieren

```bash
export NODE_ENV=production
npm ci
```

### 3. Konfiguration
Erstellen Sie eine `.env`-Datei im Hauptverzeichnis, z.B. indem Sie `.env.prod.example` kopieren. Passen Sie die Konfiguration dort entsprechend an. Statt mit einer Datei zu arbeiten, können die Werte auch als Umgebungsvariablen des Servers gesetzt werden. Umgebungsvariablen überschreiben Werte die in ".env" angegeben sind.
Hier wird insbesondere eine Verbindung zu einem SMTP-Server und zu einer Datenbank konfiguriert.   

### 4. Anwendung starten

```bash
export NODE_ENV=production
npm start
```

### 5. Verifizierung

Testen Sie die Anwendung:

```bash
curl http://localhost:3000/api/health
```

Erwartete Antwort: `{"status": "ok", "timestamp": "..."}`

### 6. Reverse Proxy (empfohlen)

Für Produktionsumgebungen sollte ein Reverse Proxy (nginx, Apache) vor der Anwendung eingesetzt werden, um HTTPS zu ermöglichen.
Der lokal unter den mit "PORT" konfiguriertem Port sollte entsprechend exponiert werden. Die Anwendung selbst hat keine Behandlung von SSL konfiguriert. Der Reverse Proxy sollte also die SSL-Terminierung vornehmen.
