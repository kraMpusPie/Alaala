<?php
session_start();

// Check if the user is an admin
if (isset($_SESSION['user_email']) && isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin') {
    echo '
    <div class="popup-form-container" id="popupFormContainer" style="display: none;">
        <div class="popup-form">
            <span class="close-popup-btn" onclick="closeObituaryForm()">×</span>
            <h2>Add Obituary</h2>
            <form id="obituary-form">
                <input type="text" id="name" placeholder="Name" required />
                <label for="dateOfBirth">Date of Birth:</label> 
                <input type="date" id="dateOfBirth" required />
                <label for="dateOfDeath">Date of Death:</label>
                <input type="date" id="dateOfDeath" required />
                <textarea id="message" placeholder="Message" rows="5" required></textarea>
                <input type="file" id="image" accept="image/*" required />
                <button type="submit">Add Obituary</button>
            </form>
        </div>
    </div>';
}
?>
