// Basic form validation and submission placeholder
      const submitBtn = document.querySelector('.submit-btn');
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');

      submitBtn.addEventListener('click', () => {
        // Simple client-side validation
        if (!nameInput.value.trim()) {
          alert('Please enter your name.');
          nameInput.focus();
          return;
        }
        if (!emailInput.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
          alert('Please enter a valid email address.');
          emailInput.focus();
          return;
        }
        if (!messageInput.value.trim()) {
          alert('Please enter your message.');
          messageInput.focus();
          return;
        }

        // Placeholder for form submission (no backend)
        alert('Thank you for your message! We will get back to you soon.');
        nameInput.value = '';
        emailInput.value = '';
        messageInput.value = '';
      });