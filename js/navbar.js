// Load navbar content dynamically
fetch('navbar.php')
    .then(response => response.text())
    .then(html => {
        document.getElementById('navbar-placeholder').innerHTML = html;
    })
    .catch(error => {
        console.error('Error loading navbar:', error);
    });