# Minimale Anforderungen

Diese Anforderungen gelten für den produktiven Betrieb der verwalt-it Anwendung auf einem Server.

## Systemanforderungen

### Betriebssystem
- Die Anwendung läuft unter Linux, Windows, MacOS und jedes Betriebssystem das nodeJS unterstützt

### Hardware (Produktion)

#### Minimum
- **CPU**: 1 vCPU
- **RAM**: 1 GB
- **Festplatte**: 1 GB freier Speicher

#### Empfohlen
- **CPU**: 2 vCPU
- **RAM**: 2 GB
- **Festplatte**: 2 GB freier Speicher

## Software-Anforderungen

### Erforderliche Software

#### Node.js and npm
- Installationsanleitungen hier: https://nodejs.org/en/download
- **Version**: Node.js 20.19 oder höher (empfohlen: aktuellste LTS Version)

#### Reverse Proxy (empfohlen)
- **nginx**, **Apache** oder vergleichbare Lösung: Für HTTPS-Terminierung und Routing.

### Externe Dienste
#### MongoDB
- **Version**: MongoDB 8.0 oder höher
- **Download**: https://www.mongodb.com/try/download/community
- Hinweis: Falls erforderlich lässt sich mit überschaubarem Aufwand auch Kompatibilität zu anderen Datenbanksystemen (z.B. MySQL oder Postresql) herstellen
- Die Datenbank kann seperat oder auf dem gleichen Server installiert werden, muss aber natürlich übers Netzwerk erreichbar sein
- Für die Datenbank sollten geeignete Backups eingerichtet werden

#### SMTP-Server
- Für den Versand von E-Mails muss ein funktionsfähiger SMTP-Server konfiguriert werden

## Netzwerkanforderungen

- **Eingehend**: Port 80 (HTTP) und 443 (HTTPS)
- **Ausgehend**: 
  - SMTP-Zugriff für E-Mail-Versand
- **Lokaler Zugriff**: Verbindung zwischen Node.js-Anwendung und MongoDB

## Sicherheitsanforderungen

- HTTPS-Verschlüsselung (empfohlen via Reverse Proxy)
- Angemessene Netzwerk- und Firewall-Konfiguration
- Regelmäßige Sicherheitsupdates für Betriebssystem und Datenbanksystem
- Bereitstellen eines Ansprechpartners oder E-Mails-Funktionspostfachs, sollten Sicherheitslücken in der Anwendung auftreten und ein Update der Software nötig werden
