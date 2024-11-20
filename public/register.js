const apiBaseUrl = 'http://localhost:2070/api/students';

// Register a new student
async function registerStudent() {
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const enrolledSubjects = document.getElementById('registerSubjects').value;

  try {
    const response = await fetch(`${apiBaseUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
        enrolledSubjects: enrolledSubjects.split(','),
      }),
    });

    const data = await response.json();
    const messageDiv = document.getElementById('registerMessage');

    if (response.ok) {
      messageDiv.style.color = 'green';
      messageDiv.textContent = data.message;
    } else {
      messageDiv.style.color = 'red';
      messageDiv.textContent = data.message || 'Registration failed';
    }
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('registerMessage').textContent = 'Server error. Try again later.';
  }
}
