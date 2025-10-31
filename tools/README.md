# Tools

Verschiedene Hilfswerkzeuge für die Verwaltung und Entwicklung der verwalt-it Anwendung.

## PDF-Tools

Alle Tools benötigen `pdf-lib`, das bereits installiert ist.

### Tool: `analyze-pdf-fields.js`

Analysiert ein PDF-Dokument und listet alle verfügbaren Formularfelder auf.

#### Verwendung

```bash
node tools/analyze-pdf-fields.js <pfad-zum-pdf>
```

#### Beispiel

```bash
node tools/analyze-pdf-fields.js docs/formular.pdf
```

#### Ausgabe

- Zusammenfassung der Feldtypen und -anzahl
- JSON-Struktur mit allen Feldnamen

#### Zweck

- Mapping der PDF-Formularfelder zu den HTML-Formularfeldern
- Verstehen der Struktur eines PDF-Formulars
- Generieren von Code für das Ausfüllen des PDFs

---

### Tool: `fill-pdf-debug.js`

Füllt ein PDF-Formular mit den Namen der jeweiligen Felder für visuelles Mapping.

#### Verwendung

```bash
node tools/fill-pdf-debug.js <pfad-zum-pdf>
```

#### Beispiel

```bash
node tools/fill-pdf-debug.js docs/formular.pdf
```

#### Ausgabe

- Erstellt eine neue Datei mit dem Suffix `_filled.pdf`
- Beispiel: `docs/formular.pdf` → `docs/formular_filled.pdf`

#### Verhalten

- **Textfelder**: Werden mit dem Feldnamen ausgefüllt
- **Checkboxen**: Werden angehakt
- **Radio-Buttons**: Erste Option wird ausgewählt
- **Dropdowns**: Erste Option wird ausgewählt

#### Zweck

- Visuelles Mapping der PDF-Felder
- Bestätigung, dass alle Felder gefunden wurden
- Debugging von Position und Layout der Felder
