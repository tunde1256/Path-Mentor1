// Handle Teacher Registration
document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Collect form data
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const subjectsInput = document.getElementById('subjects').value.trim();
    const messageDiv = document.getElementById('registerMessage');

    // Validate inputs
    if (!name || !email || !password || !subjectsInput) {
        messageDiv.textContent = 'All fields are required.';
        messageDiv.style.color = 'red';
        return;
    }

    const subjects = subjectsInput.split(',').map(subject => subject.trim());

    try {
        // Send data to the server to register the teacher
        const response = await fetch('http://localhost:2070/api/teacher/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, subjects }),
        });

        // Handle the server response
        const result = await response.json();

        if (response.ok) {
            messageDiv.textContent = result.message || 'Teacher registered successfully!';
            messageDiv.style.color = 'green';

            // Optionally reset form
            document.getElementById('registerForm').reset();
        } else {
            messageDiv.textContent = result.message || 'Failed to register teacher.';
            messageDiv.style.color = 'red';
        }
    } catch (error) {
        console.error('Error:', error);
        messageDiv.textContent = 'A network error occurred. Please try again later.';
        messageDiv.style.color = 'red';
    }
});
