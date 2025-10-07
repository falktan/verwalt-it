let submissionData

document.addEventListener('DOMContentLoaded', async () => {
  const token = getAccessToken();

  if(!token) {
    // Student öffnet die Seite als leeres Formular.
    showRoleInfo('student-initial');
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
    form.querySelector(`[name="${key}"]`).value = value;
  });
}

function updateForm() {
  const {userRole} = submissionData;
  const submitButton = document.querySelector('#submit-button');

  // Zeige rollenspezifische Info-Box an
  showRoleInfo(userRole);

  if(userRole === 'student') {
    submitButton.style.display = 'none';
    addConfirmationFields();
    disableForm();
  } else if(userRole === 'pruefungsamt') {
    submitButton.value = 'Speichern';
    addConfirmationFields();
  } else if(['betreuer_betrieblich', 'betreuer_hochschule', 'betreuer_korreferent'].includes(userRole)) {
    submitButton.value = 'Bestätigen';
    disableForm();
  } else if(userRole === 'pruefungsausschuss') {
    submitButton.value = 'Antrag genehmigen';
    addConfirmationFields();
  }
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
      <input type="checkbox" id="hochschulbetreuer_confirmation" name="hochschulbetreuer_confirmation" ${confirmations.betreuer_hochschule ? 'checked' : ''}>
      <label for="hochschulbetreuer_confirmation">Bestätigung des Referenten</label>
    </div>
    <div class="field full checkbox">
      <input type="checkbox" id="korreferent_confirmation" name="korreferent_confirmation" ${confirmations.betreuer_korreferent ? 'checked' : ''}>
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
    } else if(['betreuer_betrieblich', 'betreuer_hochschule', 'betreuer_korreferent'].includes(userRole)) {
      await handleConfirmSubmission(token);
    } else if(userRole === 'pruefungsausschuss') {
      await handleApproveSubmission(token);
    }
    
    // Zeige Erfolgsmeldung
    showSuccessMessage(userRole);
    
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
    body: JSON.stringify({formData: getFormData(event)})
  });

  if (!response.ok) {
    throw new Error('Fehler beim Erstellen der Einreichung');
  }

  const result = await response.json();
}

async function handleUpdateSubmission(event, token) {
  const formData = getFormData(event);
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

function getFormData(event) {
  const formData = [...(new FormData(event.target))];
  const data = Object.fromEntries(formData.filter(
    ([key]) => ![
      'betreuer_betrieblich_confirmation', 
      'hochschulbetreuer_confirmation', 
      'korreferent_confirmation', 
      'pruefungsamt_confirmation'].includes(key)));
  return data;
}

function getConfirmationsData(event) {
  const formData = [...(new FormData(event.target))];
  const confirmations = {};
  
  // Map form field names to confirmation keys
  const confirmationMapping = {
    'betreuer_betrieblich_confirmation': 'betreuer_betrieblich',
    'hochschulbetreuer_confirmation': 'betreuer_hochschule', 
    'korreferent_confirmation': 'betreuer_korreferent',
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
    message = 'Ihr Antrag wurde erfolgreich eingereicht! Sie erhalten in Kürze eine Bestätigungs-E-Mail mit einem Link zur Statusverfolgung.';
  } else if (userRole === 'pruefungsamt') {
    message = 'Die Änderungen wurden erfolgreich gespeichert.';
  } else if (['betreuer_betrieblich', 'betreuer_hochschule', 'betreuer_korreferent'].includes(userRole)) {
    message = 'Ihre Bestätigung wurde erfolgreich übermittelt. Vielen Dank!';
  } else if (userRole === 'pruefungsausschuss') {
    message = 'Der Antrag wurde erfolgreich genehmigt. Die entsprechenden E-Mails wurden versendet.';
  }
  
  messageContainer.innerHTML = `<div class="info-box" style="background-color: #d4edda; border-color: #c3e6cb; color: #155724;"><p><strong>✓ Erfolgreich!</strong> ${message}</p></div>`;
  messageContainer.style.display = 'block';
  
  // Scrolle zur Nachricht
  messageContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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

// Make handleFormSubmit globally available for the HTML form
window.handleFormSubmit = handleFormSubmit;
