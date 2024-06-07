document.addEventListener('DOMContentLoaded', () => {
    // Logique de déconnexion ici, par exemple:
    // sessionStorage.clear();
    localStorage.clear();
    // Ajout d'un délai de 2 secondes avant la redirection
    setTimeout(() => {
        // Rediriger vers la page de connexion
        window.location.href = 'login.html';
    }, 3000); // 2000 millisecondes = 2 secondes
});