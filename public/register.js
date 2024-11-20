const apiBaseUrl = 'http://localhost:2070/api/students';

// Register a new student
async function registerStudent() {
  // Get input values
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value.trim();
  const enrolledSubjects = document.getElementById('registerSubjects').value.trim();
  
  const messageDiv = document.getElementById('registerMessage');
  
  // Validate inputs
  if (!name || !email || !password || !enrolledSubjects) {
    messageDiv.style.color = 'red';
    messageDiv.textContent = 'All fields are required.';
    return;
  }

  try {
    // Make the API request
    const response = await fetch(`${apiBaseUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
        enrolledSubjects: enrolledSubjects.split(',').map(subject => subject.trim()), // Ensure subjects are trimmed
      }),
    });

    // Parse the response
    const data = await response.json();

    // Handle success or error messages
    if (response.ok) {
      messageDiv.style.color = 'green';
      messageDiv.textContent = data.message || 'Registration successful!';
    } else {
      messageDiv.style.color = 'red';
      messageDiv.textContent = data.message || 'Registration failed.';
    }
  } catch (error) {
    // Handle network or unexpected errors
    console.error('Error:', error);
    messageDiv.style.color = 'red';
    messageDiv.textContent = 'Server error. Please try again later.';
  }
}
