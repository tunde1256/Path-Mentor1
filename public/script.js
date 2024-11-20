// Handle Teacher Registration
document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Collect form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const subjects = document.getElementById('subjects').value.split(',').map(subject => subject.trim());

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
        document.getElementById('registerMessage').textContent = 'Teacher registered successfully!';
        document.getElementById('registerMessage').style.color = 'green';
    } else {
        document.getElementById('registerMessage').textContent = result.message;
        document.getElementById('registerMessage').style.color = 'red';
    }
});
