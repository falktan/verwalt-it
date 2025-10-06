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
  }
}

function addConfirmationFields() {
  const {confirmations} = submissionData;
  const form = document.querySelector('form');
  const confirmationFields = document.createElement('div');
  confirmationFields.classList.add('field', 'full');
  confirmationFields.innerHTML = `
    <h2>Bestätigungen</h2>
    <div class="field full checkbox">
      <input type="checkbox" id="betreuer_betrieblich_confirmation" name="betreuer_betrieblich_confirmation" ${confirmations.betreuer_betrieblich ? 'checked' : ''}>
      <label for="confirmation">Bestätigung des betrieblichen Betreuers</label>
    </div>
    <div class="field full checkbox">
      <input type="checkbox" id="hochschulbetreuer_confirmation" name="hochschulbetreuer_confirmation" ${confirmations.betreuer_hochschule ? 'checked' : ''}>
      <label for="confirmation">Bestätigung des Referenten</label>
    </div>
    <div class="field full checkbox">
      <input type="checkbox" id="korreferent_confirmation" name="korreferent_confirmation" ${confirmations.betreuer_korreferent ? 'checked' : ''}>
      <label for="confirmation">Bestätigung des Korreferenten</label>
    </div>
    <div class="field full checkbox">
      <input type="checkbox" id="pruefungsamt_confirmation" name="pruefungsamt_confirmation" ${confirmations.pruefungsamt ? 'checked' : ''}>
      <label for="confirmation">Bestätigung des Prüfungsamtes</label>
    </div>
  `;

  form.append(confirmationFields);
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

  const token = getAccessToken();
  const userRole = submissionData?.userRole;

  if(!userRole) {
    await handleCreateSubmission(event);
  } else if(userRole === 'pruefungsamt') {
    console.log('handleUpdateSubmission');
    await handleUpdateSubmission(event, token);
  } else if(['betreuer_betrieblich', 'betreuer_hochschule', 'betreuer_korreferent'].includes(userRole)) {
    await handleConfirmSubmission(token);
  }
}

async function handleCreateSubmission(event) {
  const response = await fetch('/api/create-submission', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({formData: getFormData(event)})
  });

  const result = await response.json();
}

async function handleUpdateSubmission(event, token) {
  const formData = getFormData(event);
  const confirmations = getConfirmationsData(event);
  
  // Update both form data and confirmations
  await Promise.all([
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
}

async function handleConfirmSubmission(token) {
  const response = await fetch('/api/confirm-submission', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({accessToken: token})
  });
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

// Make handleFormSubmit globally available for the HTML form
window.handleFormSubmit = handleFormSubmit;
