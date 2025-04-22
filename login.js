
  async function loginUser() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to dashboard if login is successful
        window.location.href = 'dash.html';
      } else {
        alert(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again later.');
    }
  }

