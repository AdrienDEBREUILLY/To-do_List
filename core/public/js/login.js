// Attendre que le DOM soit entièrement chargé
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Sélectionner le formulaire de login par son identifiant
        const loginForm = document.getElementById('login-form');
    
        // Ajouter un événement de soumission au formulaire
        loginForm.addEventListener('submit', async (e) => {
            // Empêcher la soumission par défaut du formulaire
            e.preventDefault();
    
            // Récupérer les valeurs saisies par l'utilisateur dans les champs username et mot de passe
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
    
            try {
                // Envoyer une requête POST au serveur avec les informations de connexion
                const response = await fetch('http://localhost:3000/login', {
                    method: 'post', // Utiliser la méthode POST
                    headers: { 'Content-Type': 'application/json' }, // Définir le type de contenu
                    body: JSON.stringify({ username, password }) // Convertir les données en JSON
                });
    
                // Convertir la réponse en format JSON
                const data = await response.json();
    
                // Vérifier si la réponse du serveur est OK (statut 200)
                if (response.ok) {
                    // Stocker le token reçu dans le localStorage du navigateur
                    localStorage.setItem('token', data.token);
                    // Rediriger l'utilisateur vers la page d'accueil
                    window.location.href = './index.html';
                } else {
                    // Afficher un message d'erreur si les informations de connexion sont incorrectes
                    alert(data.message);
                }
            } catch (error) {
                // Afficher un message d'erreur en cas de problème avec la requête
                console.error('Erreur:', error);
                alert('Une erreur est survenue. Veuillez réessayer.');
            }
        });
    } catch (error) {
        console.error("Erreur pendant l'initialisation du DOM:", error);
    }
});