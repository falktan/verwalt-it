async function handleConfirm(event) {
  event.preventDefault();
  // TODO: Store confirmation in database
  alert('Vielen Dank für die Bestätigung der Anmeldung der Abschlussarbeit. Sie erhalten in Kürze eine Bestätigung per E-Mail.');
}

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  const response = await fetch('/api/get-form-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });

  const formData = await response.json();

  document.getElementById('vorname').value = formData.vorname;
  document.getElementById('nachname').value = formData.nachname;
  document.getElementById('email').value = formData.email;
});
