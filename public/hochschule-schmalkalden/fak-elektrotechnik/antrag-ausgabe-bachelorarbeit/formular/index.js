let submissionData

document.addEventListener('DOMContentLoaded', async () => {
  const token = getAccessToken();

  if(!token) {
    // Student öffnet die Seite als leeres Formular.
    showRoleInfo('student-initial');
    // Prüfungsamt-Felder für Studenten deaktivieren
    updatePruefungsamtFields('student');
    return;
  }

  submissionData = await loadSubmission(token);
  const {userRole, formData} = submissionData;

  populateForm(formData);  
  updateForm();
});

async function loadSubmission(token) {
  const response = await fetch('/api/fetch-submission', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({accessToken: token})
  });

  return await response.json();
}

function populateForm(formData) {
  const form = document.querySelector('form');
  Object.entries(formData).forEach(([key, value]) => {
    const field = form.querySelector(`[name="${key}"]`);
    if (!field) return;
    
    // Checkbox speziell behandeln
    if (field.type === 'checkbox') {
      field.checked = (value === 'on' || value === true);
    } else {
      field.value = value;
    }
  });
}

function updateForm() {
  const {userRole} = submissionData;
  const submitButton = document.querySelector('#submit-button');
  const cancelButton = document.querySelector('#cancel-button');

  // Zeige rollenspezifische Info-Box an
  showRoleInfo(userRole);

  // Steuere Prüfungsamt-Felder basierend auf Benutzerrolle
  updatePruefungsamtFields(userRole);

  if(userRole === 'student') {
    submitButton.style.display = 'none';
    addConfirmationFields();
    disableForm();
  } else if(userRole === 'pruefungsamt') {
    submitButton.value = 'Speichern';
    addConfirmationFields();
    cancelButton.style.display = 'inline-block';
  } else if(['betreuer_betrieblich', 'betreuer_hochschule', 'korreferent'].includes(userRole)) {
    submitButton.value = 'Bestätigen';
    disableForm();
  } else if(userRole === 'pruefungsausschuss') {
    submitButton.value = 'Antrag genehmigen';
    addConfirmationFields();
    cancelButton.style.display = 'inline-block';
  }
}

function updatePruefungsamtFields(userRole) {
  const pruefungsamtFields = [
    'pruefungsleistungen_noch_zu_erbringen',
    'immatrikulation_laufend', 
    'zulassung_praxissemester'
  ];

  pruefungsamtFields.forEach(fieldName => {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (!field) return;

    const label = document.querySelector(`label[for="${field.id}"]`);
    
    if (userRole === 'student' || !userRole) {
      // Für Studenten: Felder nicht editierbar und nicht Pflicht
      field.disabled = true;
      field.required = false;
      
      // Entferne required-Markierung aus dem Label
      if (label) {
        const requiredSpan = label.querySelector('.required');
        if (requiredSpan) {
          requiredSpan.remove();
        }
      }
    } else if (userRole === 'pruefungsamt') {
      // Für Prüfungsamt: Select-Felder editierbar und Pflicht
      field.disabled = false;
      
      // Nur Select-Felder sind Pflicht
      if (field.tagName === 'SELECT') {
        field.required = true;
        
        // Füge required-Markierung zum Label hinzu falls nicht vorhanden
        if (label && !label.querySelector('.required')) {
          label.innerHTML += ' <span class="required">*</span>';
        }
      } else {
        // Textarea ist optional
        field.required = false;
        
        // Entferne required-Markierung aus dem Label
        if (label) {
          const requiredSpan = label.querySelector('.required');
          if (requiredSpan) {
            requiredSpan.remove();
          }
        }
      }
    } else {
      // Für andere Rollen: Felder nicht editierbar
      field.disabled = true;
      field.required = false;
      
      // Entferne required-Markierung aus dem Label
      if (label) {
        const requiredSpan = label.querySelector('.required');
        if (requiredSpan) {
          requiredSpan.remove();
        }
      }
    }
  });
}

function addConfirmationFields() {
  const {confirmations} = submissionData;
  const confirmationContainer = document.querySelector('#confirmation-container');
  confirmationContainer.innerHTML = `
    <h2>Bestätigungen</h2>
    <div class="field full checkbox">
      <input type="checkbox" id="betreuer_betrieblich_confirmation" name="betreuer_betrieblich_confirmation" ${confirmations.betreuer_betrieblich ? 'checked' : ''}>
      <label for="betreuer_betrieblich_confirmation">Bestätigung des betrieblichen Betreuers</label>
    </div>
    <div class="field full checkbox">
      <input type="checkbox" id="betreuer_hochschule_confirmation" name="betreuer_hochschule_confirmation" ${confirmations.betreuer_hochschule ? 'checked' : ''}>
      <label for="betreuer_hochschule_confirmation">Bestätigung des Referenten</label>
    </div>
    <div class="field full checkbox">
      <input type="checkbox" id="korreferent_confirmation" name="korreferent_confirmation" ${confirmations.korreferent ? 'checked' : ''}>
      <label for="korreferent_confirmation">Bestätigung des Korreferenten</label>
    </div>
    <div class="field full checkbox">
      <input type="checkbox" id="pruefungsamt_confirmation" name="pruefungsamt_confirmation" ${confirmations.pruefungsamt ? 'checked' : ''}>
      <label for="pruefungsamt_confirmation">Bestätigung des Prüfungsamtes</label>
    </div>
  `;
}

function disableForm() {
  const form = document.querySelector('form');
  form.querySelectorAll('input, select, textarea').forEach(field => {
    if (field.type !== 'submit') {
      field.disabled = true;
    }
  });
}

function showRoleInfo(userRole) {
  const roleInfoElement = document.querySelector(`#role-info-${userRole}`);
  if (roleInfoElement) {
    roleInfoElement.style.display = 'block';
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();

  const submitButton = document.querySelector('#submit-button');
  const originalButtonText = submitButton.value;
  
  // Deaktiviere Button und ändere Text
  submitButton.disabled = true;
  submitButton.value = 'Wird gesendet...';
  
  // Verstecke vorherige Nachrichten
  hideMessage();

  const token = getAccessToken();
  const userRole = submissionData?.userRole;

  try {
    if(!userRole) {
      await handleCreateSubmission(event);
    } else if(userRole === 'pruefungsamt') {
      await handleUpdateSubmission(event, token);
    } else if(['betreuer_betrieblich', 'betreuer_hochschule', 'korreferent'].includes(userRole)) {
      await handleConfirmSubmission(token);
    } else if(userRole === 'pruefungsausschuss') {
      await handleApproveSubmission(token);
    }
    
    showSuccessMessage(userRole);
    submitButton.value = originalButtonText;
    
    // Formular deaktivieren, aber NICHT für Prüfungsamt
    if(userRole !== 'pruefungsamt') {
      disableForm();
    } else {
      // Für Prüfungsamt: Button wieder aktivieren
      submitButton.disabled = false;
    }
    
  } catch (error) {
    // Bei Fehler: Button wieder aktivieren und Fehlermeldung anzeigen
    submitButton.disabled = false;
    submitButton.value = originalButtonText;
    showErrorMessage(error.message);
  }
}

async function handleCreateSubmission(event) {
  const response = await fetch('/api/create-submission', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({formData: getFormData()})
  });

  if (!response.ok) {
    throw new Error('Fehler beim Erstellen der Einreichung');
  }

  const result = await response.json();
}

async function handleUpdateSubmission(event, token) {
  const formData = getFormData();
  const confirmations = getConfirmationsData(event);
  
  // Update both form data and confirmations
  const responses = await Promise.all([
    fetch('/api/update-submission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({formData, accessToken: token})
    }),
    fetch('/api/update-confirmations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({confirmations, accessToken: token})
    })
  ]);
  
  // Check if all requests were successful
  responses.forEach((response, index) => {
    if (!response.ok) {
      throw new Error('Fehler beim Aktualisieren der Daten');
    }
  });
}

async function handleConfirmSubmission(token) {
  const response = await fetch('/api/confirm-submission', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({accessToken: token})
  });
  
  if (!response.ok) {
    throw new Error('Fehler beim Bestätigen der Einreichung');
  }
}

async function handleApproveSubmission(token) {
  const response = await fetch('/api/approve-submission', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({accessToken: token})
  });
  
  if (!response.ok) {
    throw new Error('Fehler beim Genehmigen des Antrags');
  }
}

function getFormData() {
  const form = document.querySelector('form');
  const formData = [...(new FormData(form))];
  const data = Object.fromEntries(formData.filter(
    ([key]) => ![
      'betreuer_betrieblich_confirmation', 
      'betreuer_hochschule_confirmation', 
      'korreferent_confirmation', 
      'pruefungsamt_confirmation'].includes(key)));
  return data;
}

function getConfirmationsData() {
  const form = document.querySelector('form');
  const formData = [...(new FormData(form))];
  const confirmations = {};
  
  // Map form field names to confirmation keys
  const confirmationMapping = {
    'betreuer_betrieblich_confirmation': 'betreuer_betrieblich',
    'betreuer_hochschule_confirmation': 'betreuer_hochschule', 
    'korreferent_confirmation': 'korreferent',
    'pruefungsamt_confirmation': 'pruefungsamt'
  };
  
  formData.forEach(([key, value]) => {
    if (confirmationMapping[key]) {
      confirmations[confirmationMapping[key]] = value === 'on';
    }
  });
  
  return confirmations;
}

function getAccessToken() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  return token;
}

function showSuccessMessage(userRole) {
  const messageContainer = document.querySelector('#message-container');
  let message = '';
  
  if (!userRole) {
    message = 'Ihr Antrag wurde erfolgreich eingereicht. Sie erhalten in Kürze eine Bestätigungs-E-Mail mit einem Link zur Statusverfolgung.';
  } else if (userRole === 'pruefungsamt') {
    message = getPruefungsamtMessage();
  } else if (['betreuer_betrieblich', 'betreuer_hochschule', 'korreferent'].includes(userRole)) {
    message = 'Ihre Bestätigung wurde erfolgreich übermittelt. Vielen Dank!';
  } else if (userRole === 'pruefungsausschuss') {
    message = 'Der Antrag wurde erfolgreich genehmigt. Die entsprechenden E-Mails wurden versendet.';
  }
    
  messageContainer.innerHTML = `<div class="info-box"><p>${message}</p></div>`;
  messageContainer.style.display = 'block';
  
  // Scrolle zur Nachricht
  messageContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function getPruefungsamtMessage() {
  const confirmations = getConfirmationsData();
  
  const requiredConfirmations = ['betreuer_betrieblich', 'betreuer_hochschule', 'korreferent', 'pruefungsamt'];
  const missingConfirmations = requiredConfirmations.some(role => !confirmations[role]);
  
  // Prüfungsamt selbst hat nicht bestätigt
  if (!confirmations.pruefungsamt) {
    return '<strong>Achtung!</strong> Die Änderungen wurden gespeichert, aber die Bestätigung des Prüfungsamtes wurde nicht gesetzt.' +
      'Die Bearbeitung wird erst fortgesetzt, sobald auch diese Bestätigung gesetzt wird.';
  }
  
  if (missingConfirmations) {
    return 'Die Änderungen wurden erfolgreich gespeichert. Es fehlen noch Bestätigungen. '+
    'Eine E-Mail an den Prüfungsausschuss wird automatisch gesendet, sobald alle Bestätigungen vorliegen.';
  }
  return 'Die Änderungen wurden erfolgreich gespeichert. Alle Bestätigungen sind eingegangen. Eine E-Mail wurde an den Prüfungsausschuss gesendet.';
}

function showErrorMessage(errorMessage) {
  const messageContainer = document.querySelector('#message-container');
  
  messageContainer.innerHTML = `<div class="info-box" style="background-color: #f8d7da; border-color: #f5c6cb; color: #721c24;"><p><strong>Fehler!</strong> ${errorMessage || 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.'}</p></div>`;
  messageContainer.style.display = 'block';
  
  // Scrolle zur Nachricht
  messageContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideMessage() {
  const messageContainer = document.querySelector('#message-container');
  messageContainer.style.display = 'none';
  messageContainer.innerHTML = '';
}

async function handleCancelSubmission(event) {
  event.preventDefault();
  
  // Bestätigungsdialog anzeigen
  const confirmed = confirm('Möchten Sie diesen Antrag wirklich abbrechen und löschen? Diese Aktion kann nicht rückgängig gemacht werden.');
  
  if (!confirmed) {
    return;
  }
  
  const token = getAccessToken();
  const cancelButton = document.querySelector('#cancel-button');
  const submitButton = document.querySelector('#submit-button');
  const originalButtonText = cancelButton.textContent;
  
  // Deaktiviere Buttons und ändere Text
  cancelButton.disabled = true;
  cancelButton.textContent = 'Wird gelöscht...';
  submitButton.disabled = true;
  
  // Verstecke vorherige Nachrichten
  hideMessage();
  
  try {
    const response = await fetch('/api/delete-submission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({accessToken: token})
    });
    
    if (!response.ok) {
      throw new Error('Fehler beim Löschen des Antrags');
    }
    
    // Erfolg: Zeige Nachricht und deaktiviere alles
    const messageContainer = document.querySelector('#message-container');
    messageContainer.innerHTML = '<div class="info-box"><p><strong>Der Antrag wurde erfolgreich gelöscht.</strong></p></div>';
    messageContainer.style.display = 'block';
    messageContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Formular und Buttons deaktivieren
    disableForm();
    cancelButton.style.display = 'none';
    submitButton.style.display = 'none';
    
  } catch (error) {
    // Bei Fehler: Button wieder aktivieren und Fehlermeldung anzeigen
    cancelButton.disabled = false;
    cancelButton.textContent = originalButtonText;
    submitButton.disabled = false;
    showErrorMessage(error.message);
  }
}

// Make functions globally available for the HTML form
window.handleFormSubmit = handleFormSubmit;
window.handleCancelSubmission = handleCancelSubmission;
