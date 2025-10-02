document.addEventListener('DOMContentLoaded', async () => {
  const token = getAccessToken();
  const userRole = getUserRole();

  if(token) {
    const submissionData = await loadSubmission(token);

    populateForm(submissionData.formData);  
  }
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

async function handleFormSubmit(event) {
  console.log('handleFormSubmit');
  event.preventDefault();

  const token = getAccessToken();
  const userRole = getUserRole();

  if(!userRole) {
    await handleCreateSubmission(event);
  } else if(userRole === 'pruefungsamt') {
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
  document.getElementById('test-output').innerText = JSON.stringify(result);
}

async function handleUpdateSubmission(event, token) {
  const response = await fetch('/api/update-submission', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({formData: getFormData(event), accessToken: token})
  });
}

async function handleConfirmSubmission(token) {
  const response = await fetch('/api/confirm-submission', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({accessToken: token})
  });
}

function getFormData(event) {
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);
  return data;
}

function getAccessToken() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  return token;
}

function getUserRole() {
  const urlParams = new URLSearchParams(window.location.search);
  const userRole = urlParams.get('userRole');
  return userRole;
}