/**
 * Shared JavaScript functions for all blocked pages
 */

// Show notification or alert message
function showAlert(message, duration = 3000) {
  const alertBox = document.getElementById('alertBox');
  if (alertBox) {
    alertBox.textContent = message;
    alertBox.style.display = 'block';

    setTimeout(() => {
      alertBox.style.display = 'none';
    }, duration);
  } else {
    console.log('Alert message:', message);
  }
}
