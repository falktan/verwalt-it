import { PDFDocument } from 'pdf-lib';
import fs from 'fs';

/**
 * Füllt ein PDF-Formular mit den Feldnamen für Debugging-Zwecke
 * 
 * Verwendung:
 *   node tools/fill-pdf-debug.js <pfad-zum-pdf>
 * 
 * Beispiel:
 *   node tools/fill-pdf-debug.js docs/formular.pdf
 */

async function fillPdfDebug(pdfPath) {
  try {
    console.log(`Analysiere PDF: ${pdfPath}\n`);
    
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    let form;
    try {
      form = pdfDoc.getForm();
    } catch (error) {
      console.log('Kein Formular gefunden.');
      return;
    }
    
    const fields = form.getFields();
    let filledCount = 0;
    
    fields.forEach(field => {
      const fieldName = field.getName();
      const fieldType = field.constructor.name;
      
      try {
        if (fieldType === 'PDFTextField') {
          field.setText(fieldName);
          filledCount++;
        } else if (fieldType === 'PDFCheckBox') {
          field.check();
          filledCount++;
        } else if (fieldType === 'PDFRadioGroup') {
          const options = field.getOptions();
          if (options.length > 0) {
            field.select(options[0]);
            filledCount++;
          }
        } else if (fieldType === 'PDFDropdown') {
          const options = field.getOptions();
          if (options.length > 0) {
            field.select(options[0]);
            filledCount++;
          }
        }
      } catch (error) {
        console.log(`   Konnte Feld "${fieldName}" nicht ausfüllen: ${error.message}`);
      }
    });
    
    console.log(`Ausgefüllt: ${filledCount} von ${fields.length} Feldern\n`);
    
    const filledPdfBytes = await pdfDoc.save();
    const outputPath = pdfPath.replace('.pdf', '_filled.pdf');
    fs.writeFileSync(outputPath, filledPdfBytes);
    
    console.log(`Gespeichert: ${outputPath}`);
    
  } catch (error) {
    console.error('Fehler:', error.message);
    process.exit(1);
  }
}

// Kommandozeilen-Argumente auslesen
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Fehler: Kein PDF-Pfad angegeben');
  console.log('');
  console.log('Verwendung:');
  console.log('  node tools/fill-pdf-debug.js <pfad-zum-pdf>');
  console.log('');
  console.log('Beispiel:');
  console.log('  node tools/fill-pdf-debug.js docs/formular.pdf');
  process.exit(1);
}

const pdfPath = args[0];

// Pfadprüfung
if (!fs.existsSync(pdfPath)) {
  console.error(`Fehler: Datei nicht gefunden: ${pdfPath}`);
  process.exit(1);
}

// PDF-Analyse durchführen
fillPdfDebug(pdfPath);
