const apiBaseUrls = {
    student: 'path-mentor1.onrender.com/api/students/',
    teacher: 'path-mentor1.onrender.com/api/teachers/',
  };
  
  // Universal Login Function for Students and Teachers
  async function loginUser() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const userType = document.getElementById('userType').value; // Select user type (student or teacher)
  
    const apiBaseUrl = userType === 'student' ? apiBaseUrls.student : apiBaseUrls.teacher;
  
    try {
      const response = await fetch(`${apiBaseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      const messageDiv = document.getElementById('loginMessage');
  
      if (response.ok) {
        messageDiv.style.color = 'green';
        messageDiv.textContent = `${userType.charAt(0).toUpperCase() + userType.slice(1)} logged in successfully!`;
        localStorage.setItem('token', data.token);
        // Redirect to another page if needed
      } else {
        messageDiv.style.color = 'red';
        messageDiv.textContent = data.message || 'Login failed';
      }
    } catch (error) {
      console.error('Error:', error);
      document.getElementById('loginMessage').textContent = 'Server error. Try again later.';
    }
  }
  