import { PDFDocument } from 'pdf-lib';
import fs from 'fs';

/**
 * Analysiert ein PDF-Dokument und gibt alle verfügbaren Formularfelder aus
 * 
 * Verwendung:
 *   node tools/analyze-pdf-fields.js <pfad-zum-pdf>
 * 
 * Beispiel:
 *   node tools/analyze-pdf-fields.js docs/formular.pdf
 */

async function analyzePdfFields(pdfPath) {
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
    const textFields = fields.filter(f => f.constructor.name === 'PDFTextField');
    const checkboxes = fields.filter(f => f.constructor.name === 'PDFCheckBox');
    const radioButtons = fields.filter(f => f.constructor.name === 'PDFRadioGroup');
    const dropdowns = fields.filter(f => f.constructor.name === 'PDFDropdown');
    const buttons = fields.filter(f => f.constructor.name === 'PDFButton');
    
    console.log('Zusammenfassung:');
    console.log(`   Gesamt: ${fields.length} Felder`);
    console.log(`   - Textfelder: ${textFields.length}`);
    console.log(`   - Checkboxen: ${checkboxes.length}`);
    console.log(`   - Radio-Gruppen: ${radioButtons.length}`);
    console.log(`   - Dropdowns: ${dropdowns.length}`);
    console.log(`   - Buttons: ${buttons.length}\n`);
    
    const allFields = fields.map(field => ({
      name: field.getName(),
      type: field.constructor.name.replace('PDF', ''),
      required: field.isRequired(),
      ...(field.getOptions && { options: field.getOptions() })
    }));
    
    console.log('JSON:');
    console.log(JSON.stringify(allFields, null, 2));
    
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
  console.log('  node tools/analyze-pdf-fields.js <pfad-zum-pdf>');
  console.log('');
  console.log('Beispiel:');
  console.log('  node tools/analyze-pdf-fields.js docs/formular.pdf');
  process.exit(1);
}

const pdfPath = args[0];

// Pfadprüfung
if (!fs.existsSync(pdfPath)) {
  console.error(`Fehler: Datei nicht gefunden: ${pdfPath}`);
  process.exit(1);
}

// PDF-Analyse durchführen
analyzePdfFields(pdfPath);
