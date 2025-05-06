document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.signup-card form');

  function setError(input, message) {
    const errorDiv = input.nextElementSibling;
    errorDiv.textContent = message;
    input.classList.add('is-invalid');
  }

  function clearError(input) {
    const errorDiv = input.nextElementSibling;
    errorDiv.textContent = '';
    input.classList.remove('is-invalid');
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    let isValid = true;

    [nameInput, emailInput, phoneInput, passwordInput, confirmPasswordInput].forEach(clearError);

    if (name === '') {
      setError(nameInput, 'Full Name is required.');
      isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
      setError(emailInput, 'Email is required.');
      isValid = false;
    } else if (!emailPattern.test(email)) {
      setError(emailInput, 'Please enter a valid email address.');
      isValid = false;
    }

    const phonePattern = /^(\+92|0)3\d{9}$/;
    if (phone === '') {
      setError(phoneInput, 'Phone number is required.');
      isValid = false;
    } else if (!phonePattern.test(phone)) {
      setError(phoneInput, 'Enter a valid Pakistani phone number.');
      isValid = false;
    }

    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (password === '') {
      setError(passwordInput, 'Password is required.');
      isValid = false;
    } else if (!passwordPattern.test(password)) {
      setError(passwordInput, 'Password must have 8 characters, an uppercase, a digit & a special character.');
      isValid = false;
    }

    if (confirmPassword === '') {
      setError(confirmPasswordInput, 'Please confirm your password.');
      isValid = false;
    } else if (password !== confirmPassword) {
      setError(confirmPasswordInput, 'Passwords do not match.');
      isValid = false;
    }

    if (isValid) {
      const data = { name, email, phone, password };

      fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(result => {
          if (result.message.includes("OTP")) {
            alert('Registration successful! Please check your email for OTP.');

            // Show OTP Input
            const otpFormHtml = `
              <div class="mb-3">
                <label for="otp" class="form-label">Enter OTP</label>
                <input type="text" class="form-control" id="otp" placeholder="Enter OTP sent to your email" />
                <div class="error-message text-danger small mt-1"></div>
              </div>
              <button type="submit" class="btn btn-custom w-100" id="verify-otp-btn">Verify OTP</button>
            `;
            document.querySelector('.signup-card').innerHTML = otpFormHtml;

            // Handle OTP Submit
            document.getElementById('verify-otp-btn').addEventListener('click', function (e) {
              e.preventDefault();
              const otp = document.getElementById('otp').value.trim();
              console.log(otp);

              if (otp === '') {
                alert('Please enter the OTP.');
                return;
              }

              fetch('http://localhost:3000/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
              })
                .then(res => res.json())
                .then(result => {
                  if (result.success) {
                    alert('OTP verified successfully! You are now verified.');
                    window.location.href = 'login.html';
                  } else {
                    alert(result.message);
                  }
                })
                .catch(error => {
                  console.error('Error:', error);
                  alert('Error verifying OTP. Please try again.');
                });
            });
          }
        })
        .catch(error => console.error('Error:', error));
    }
  });
});
