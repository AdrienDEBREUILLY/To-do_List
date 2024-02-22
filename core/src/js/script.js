// Ajout d'un gestionnaire d'événements pour le formulaire
document.getElementById('taskForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');

    // Vérification que la saisie n'est pas vide
    if (taskInput.value.trim() !== '') {
        // Création d'un nouvel élément li pour la tâche
        const taskItem = document.createElement('li');
        taskItem.className = 'flex justify-between items-center bg-gray-200 p-2 rounded-md';
        taskItem.innerHTML = `
            <!-- Affichage du texte de la tâche -->
            <span>${taskInput.value}</span>

            <!-- Bouton de suppression de la tâche -->
            <button class="text-red-500 hover:text-red-700 focus:outline-none" onclick="removeTask(this)">X</button>
        `;

        // Ajout de la tâche à la liste
        taskList.appendChild(taskItem);

        // Réinitialisation du champ de saisie
        taskInput.value = '';
    }
});

// Fonction pour supprimer une tâche de la liste
function removeTask(button) {
    const taskItem = button.parentNode;
    taskItem.remove();
}