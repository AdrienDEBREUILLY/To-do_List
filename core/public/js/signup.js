// Logique JavaScript exécutée après le chargement du document
document.addEventListener('DOMContentLoaded', () => {
    // Sélection des champs de mot de passe
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    // Événement lors de la saisie dans le champ de confirmation du mot de passe
    confirmPasswordInput.addEventListener('input', () => {
        // Vérification si les mots de passe correspondent
        if (passwordInput.value !== confirmPasswordInput.value) {
            // Affichage d'un message d'erreur si les mots de passe ne correspondent pas
            confirmPasswordInput.setCustomValidity('Les mots de passe ne correspondent pas.');
            document.getElementById('password-error').textContent = "Les mots de passe ne correspondent pas.";
        } else {
            // Réinitialisation du message d'erreur si les mots de passe correspondent
            confirmPasswordInput.setCustomValidity('');
            document.getElementById('password-error').textContent = "";
        }
    });

    // Appel pour enregistrement de l'utilisateur
    document.getElementById('signup-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        if (document.getElementById('username').checkVisibility() &&
            document.getElementById('email').checkValidity() &&
            passwordInput.checkVisibility() &&
            passwordInput.checkVisibility()) {

            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = passwordInput.value;

            try {
                const response = await fetch('http://localhost:3000/signup', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username,
                        email,
                        password,
                    }),
                });

                if (response.ok) {
                    document.getElementById('form-success').textContent = 'Inscription réussie !';
                    // Rediriger l'utilisateur vers la page de connexion après 3 secondes
                    setTimeout(() => {
                        window.location.href = './login.html';
                    }, 3000);
                } else {
                    document.getElementById('form-error').textContent = 'Erreur lors de l\'inscription : ' + response.statusText;
                }
            } catch (error) {
                document.getElementById('form-error').textContent = 'Erreur lors de la requête : ' + error.message;
            }
        }
    });
});