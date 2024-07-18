const loginSection = document.getElementById('log-in-section');
const profile = document.getElementById('profile-section');

window.addEventListener('load', () => {
    fetch("https://kirtanmojidra.pythonanywhere.com/api/v1/login", {
        method: 'POST',
        credentials: 'include',
        // body: JSON.stringify({"username":username,"password":password})
    })
    .then((res) => {
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return res.json(); // assuming response is JSON
    })
    .then((data) => {
        console.log(data); // assuming response data
        // Assuming you get some data indicating successful login

        loginSection.classList.add('hidden');
        return fetch('https://kirtanmojidra.pythonanywhere.com/api/v1/getuser', {
            method: 'GET',
            credentials: 'include'
        });
    })
    .then((res) => {
        if (!res.ok) {
            throw new Error('Failed to fetch user information');
        }
        return res.json(); // assuming response is JSON
    })
    .then((userData) => {
        console.log(userData); // Handle user data as needed
        // Update UI or perform actions based on user data
    })
    .catch((error) => {
        console.error('Error:', error);
        // Handle errors here, such as displaying an error message
    });
});
