// Basic form validation and submission placeholder
const submitBtn = document.querySelector(".submit-btn");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");

submitBtn.addEventListener("click", () => {
  // Simple client-side validation
  if (!nameInput.value.trim()) {
    alert("Please enter your name.");
    nameInput.focus();
    return;
  }
  if (
    !emailInput.value.trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)
  ) {
    alert("Please enter a valid email address.");
    emailInput.focus();
    return;
  }
  if (!messageInput.value.trim()) {
    alert("Please enter your message.");
    messageInput.focus();
    return;
  }

  // Placeholder for form submission (no backend)
  alert("Thank you for your message! We will get back to you soon.");
  nameInput.value = "";
  emailInput.value = "";
  messageInput.value = "";
});

// Prepare form data
const formData = {
  name: nameInput.value.trim(),
  email: emailInput.value.trim(),
  message: messageInput.value.trim(),
};

const scriptURL =
  "https://script.google.com/macros/s/AKfycbzIo6wTwZVR6Mi7lb56xicvo2jsftR1KH1jRpthNMwsqt_Xif5196fZdkyGm4k2VtFYwg/exec";

  // Send data to Google Sheets
        fetch(scriptURL, {
          method: 'POST',
          body: JSON.stringify(formData),
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(response => response.json())
          .then(data => {
            if (data.status === 'success') {
              alert('Thank you for your message! We will get back to you soon.');
              // Clear the form
              nameInput.value = '';
              emailInput.value = '';
              messageInput.value = '';
            } else {
              alert('Error: ' + data.message);
            }
          })
          .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while sending your message. Please try again later.');
          });