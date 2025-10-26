# Tools

Verschiedene Hilfswerkzeuge für die Verwaltung und Entwicklung der verwalt-it Anwendung.

## PDF-Feld-Analyse

### Tool: `analyze-pdf-fields.js`

Analysiert ein PDF-Dokument und listet alle verfügbaren Formularfelder auf.

#### Abhängigkeiten

Das Tool benötigt `pdf-lib`:

```bash
npm install pdf-lib
```

#### Verwendung

```bash
node tools/analyze-pdf-fields.js <pfad-zum-pdf>
```

#### Beispiel

```bash
node tools/analyze-pdf-fields.js docs/formular.pdf
```

#### Ausgabe

Das Tool gibt folgende Informationen aus:

- **Textfelder**: Alle Text-Eingabefelder mit Namen, Pflichtfeld-Status und maximaler Länge
- **Checkboxen**: Alle Checkbox-Felder
- **Radio-Gruppen**: Radio-Button-Gruppen mit verfügbaren Optionen
- **Dropdown-Felder**: Dropdown/Select-Felder mit Optionen
- **Buttons**: Button-Felder

Am Ende wird eine JSON-Struktur mit allen Feldnamen ausgegeben, die für die Code-Generierung verwendet werden kann.

#### Zweck

Dieses Tool hilft beim:

1. Mapping der PDF-Formularfelder zu den HTML-Formularfeldern
2. Verstehen der Struktur eines neuen PDF-Formulars
3. Generieren von Code für das Ausfüllen des PDFs
4. Debugging von PDF-Formularproblemen
