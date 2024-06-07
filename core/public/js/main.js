document.addEventListener('DOMContentLoaded', () => {
    
    // Sélection des éléments du DOM nécessaires
    const taskList = document.getElementById('task-list');
    const newTaskInput = document.getElementById('new-task');
    const completedTaskList = document.getElementById('completed-task-list');

    // Fonction pour définir la couleur de fond en fonction de la priorité
    const setBackgroundColor = (task) => {
        const priority = task.querySelector('select').value;
        switch (priority) {
            case 'low':
                task.style.backgroundColor = '#f5f5f5';
                break;
            case 'medium':
                task.style.backgroundColor = '#ffffe6';
                break;
            case 'high':
                task.style.backgroundColor = '#ffebd2';
                break;
            default:
                task.style.backgroundColor = '#ffffff';
        }
    };

    // Fonction pour trier les tâches en fonction de leur priorité
    const sortTasks = () => {
        Array.from(taskList.children) // Convertir les éléments enfants en tableau
            .sort((a, b) => {
                const priorityOrder = { 'low': 3, 'medium': 2, 'high': 1 };
                const aPriority = priorityOrder[a.querySelector('select').value];
                const bPriority = priorityOrder[b.querySelector('select').value];
                return aPriority - bPriority;
            })
            .forEach((task) => {
                taskList.appendChild(task); // Réinsérer chaque tâche dans la liste triée
            });
    };

    const generateTaskId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
    };
    
    // Fonction pour inclure le token JWT dans les en-têtes
    const getHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    // Fonction pour afficher les données consolées dans l'élément div
    //const displayConsoleOutput = (taskId, taskText, taskDeadlineInput, taskNotes, taskPriority) => {
    //    const consoleOutputContent = document.getElementById('console-output-content');
    //    const outputHTML = `
    //        <p><strong>Task ID:</strong> ${taskId}</p>
    //        <p><strong>Task Text:</strong> ${taskText}</p>
    //        <p><strong>Task Deadline:</strong> ${taskDeadlineInput}</p>
    //        <p><strong>Task Notes:</strong> ${taskNotes}</p>
    //        <p><strong>Task Priority:</strong> ${taskPriority}</p>
    //        <hr>
    //    `;
    //    consoleOutputContent.innerHTML += outputHTML;
    //};

    // Supprimer une tâche
    const deleteTask = (task) => {
        task.remove();
    };

    // Ajouter une nouvelle tâche
    document.querySelector('form').addEventListener('submit', async (e) => {
        e.preventDefault(); // Empêcher le comportement par défaut du formulaire
        if (!newTaskInput.value.trim()) return; // Vérifier si le champ de saisie est vide

        const taskId = generateTaskId();  // Générer un identifiant unique

        // Création de l'élément de tâche
        const task = document.createElement('li');
        task.className = 'bg-white p-3 my-2 rounded shadow-md flex justify-between items-center';
        task.setAttribute('data-id', taskId);

        // Création des éléments de la tâche (texte, boutons, etc.)
        const taskContent = document.createElement('div');
        taskContent.className = 'flex-1';

        // Création de la case à cocher
        const taskCheckbox = document.createElement('input');
        taskCheckbox.type = 'checkbox';
        taskCheckbox.className = 'w-4 h-4 border border-gray-400 rounded cursor-pointer flex-shrink-0 mr-2';

        // Création du texte de la tâche
        const taskText = document.createElement('span');
        taskText.textContent = newTaskInput.value.trim();
        taskText.className = 'flex-1';

        // Création du bouton pour les notes
        const taskNotesButton = document.createElement('button');
        taskNotesButton.className = 'bg-yellow-500 text-white py-1 px-2 rounded mr-2 hover:bg-yellow-600';
        taskNotesButton.textContent = 'notes';

        // Création de la zone de notes
        const taskNotes = document.createElement('textarea');
        taskNotes.className = 'py-1 px-2 rounded mr-2';
        taskNotes.style.display = 'none'; // Initialement cachée
        taskNotes.placeholder = 'Add notes...';

        // Création du conteneur pour les boutons
        const taskButtons = document.createElement('div');
        taskButtons.className = 'flex';

        // Création du conteneur pour le bouton Note
        const taskButtonsNotes = document.createElement('div');
        taskButtonsNotes.className = 'flex';

        // Création du conteneur pour le bouton Edit
        const taskButtonsEdit = document.createElement('div');
        taskButtonsEdit.className = 'flex';

        // Création du champ pour la date de deadline
        const taskDeadlineInput = document.createElement('input');
        taskDeadlineInput.type = 'date';
        taskDeadlineInput.className = 'py-1 px-2 border border-gray-300 rounded mr-2';

        // Création de la liste déroulante pour la priorité
        const taskPriority = document.createElement('select');
        taskPriority.className = 'text-black py-1 px-2 rounded mr-2';
        taskPriority.innerHTML = `
            <option value="default">default</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
        `;

        // Création du bouton pour l'édition de la tâche
        const taskEditButton = document.createElement('button');
        taskEditButton.className = 'bg-blue-500 text-white py-1 px-2 rounded mr-2 hover:bg-blue-600';
        taskEditButton.textContent = 'edit';

        // Création du bouton pour la suppression de la tâche
        const taskDeleteButton = document.createElement('button');
        taskDeleteButton.className = 'bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600';
        taskDeleteButton.textContent = 'delete';

        // Ajout des éléments à la tâche
        task.appendChild(taskCheckbox);
        task.appendChild(taskText);
        task.appendChild(taskButtons);
        taskButtons.appendChild(taskPriority);
        taskButtons.appendChild(taskDeadlineInput);
        taskButtons.appendChild(taskNotes);
        taskButtonsNotes.appendChild(taskNotesButton);
        taskButtons.appendChild(taskButtonsNotes)
        taskButtonsEdit.appendChild(taskEditButton);
        taskButtons.appendChild(taskButtonsEdit)
        taskButtons.appendChild(taskDeleteButton);
        taskList.appendChild(task);

        // Définir la couleur de fond en fonction de la priorité
        setBackgroundColor(task)

        // Ajout d'un événement pour changer la priorité
        taskPriority.addEventListener('change', async () => {
            setBackgroundColor(task);
            sortTasks();
            //displayConsoleOutput(taskId, '', '', '', taskPriority.value);
            await updateTaskPriorityToDatabase(taskId, taskPriority.value);
        });

        // Ajout d'un événement pour écrire une note / description
        taskNotes.addEventListener('input', async () => {
            //displayConsoleOutput(taskId, '', '', taskNotes.value, '');
            await updateTaskNotesToDatabase(taskId, taskNotes.value);
        });

        // Ajout d'un événement pour mettre une deadline
        taskDeadlineInput.addEventListener('change', async () => {
            //displayConsoleOutput(taskId, '', taskDeadlineInput.value, '', '');
            await updateTaskDeadlineInputToDatabase(taskId, taskDeadlineInput.value);
        });

        // Validation d'une tâche
        taskCheckbox.addEventListener('change', async (e) => {
            const taskId = task.getAttribute('data-id');
            const dateInput = task.querySelector('input[type="date"]');
            const textarea = task.querySelector('textarea');

            if (e.target.checked) { // checked
                task.classList.toggle('line-through');
                task.style.backgroundColor = '#b3ffb3'; // Ajout du fond vert aux tâches validées
                task.querySelector('select').value = 'default'; // Réinitialiser la priorité à "default"
                task.querySelector('select').disabled = true; // Désactiver la sélection de priorité
                if (dateInput !== null) {dateInput.disabled = true;} // Désactiver la sélection de date
                if (textarea !== null) {textarea.disabled = true;} // Désactiver la zone text des notes
                task.setAttribute('data-completed', 'true'); // Marquer la tâche comme terminée
                completedTaskList.appendChild(task); // Déplacer la tâche vers la liste des tâches terminées
                await validateTaskInDatabase(taskId);

            } else { // unchecked
                task.classList.remove('line-through');
                task.style.backgroundColor = ''; // Retirer le fond vert si la tâche n'est plus validée
                task.querySelector('select').disabled = false; // Réactiver la sélection de priorité
                if (dateInput !== null) {dateInput.disabled = false;} // Réactiver la sélection de date
                if (textarea !== null) {task.querySelector('textarea').disabled = false;}// Réactiver la zone text des notes
                task.removeAttribute('data-completed'); // Supprimer la marque de la tâche comme terminée
                taskList.appendChild(task); // Déplacer la tâche vers la liste des tâches en cours
                await unvalidateTaskInDatabase(taskId)
            }
        });

        // Toggle pour afficher/masquer les notes
        taskNotesButton.addEventListener('click', () => {
            taskNotes.style.display = taskNotes.style.display === 'none' ? 'block' : 'none';
            taskButtonsNotes.appendChild(taskNotesButton);
        });

        // Modifier le nom d'une tâche
        taskEditButton.addEventListener('click', async () => {
            const newTaskText = prompt('Enter the new task text:');
            const isCompleted = task.getAttribute('data-completed');
            if (isCompleted !== 'true') {
                if (newTaskText) {
                    taskText.textContent = newTaskText;
                    await updateTaskNameInDatabase(taskId, newTaskText);
                    taskButtonsEdit.appendChild(taskEditButton);
                }else{
                    console.log('Cette édition ne peut être faite car la tache et validé.');
                }
            }
        });

        // Supprimer une tâche uniquement de la liste des tâches terminées
        taskDeleteButton.addEventListener('click', async () => {
            const isCompleted = task.getAttribute('data-completed');
            if (isCompleted === 'true') {
                deleteTask(task);
                await deleteTaskFromDatabase(taskId);
                taskButtons.appendChild(taskDeleteButton);
            }else{
                // Affiche un message ou empêchez la suppression de la tâche dans la liste des tâches à faire
                console.log('Cette tâche ne peut être supprimée car elle n\'est pas terminée.');
            }
        });

        newTaskInput.value = ''; // Réinitialiser la valeur de l'entrée
        newTaskInput.focus(); // Focus sur l'entrée

        // displayConsoleOutput(taskId, taskText.textContent);
        await TaskToDatabase(taskId, taskText.textContent);

    });

    /////////////////////////////////////////////////////////////////////

    // appels de données pour les routes
    const TaskToDatabase = async (taskId, taskText) => {
        try {
            const response = await fetch(`http://localhost:3000/task/${taskId}/add`, {
                method: 'POST',
                headers: getHeaders(), // Inclure le token JWT
                body: JSON.stringify({ taskText }),
            });
            if (response.ok) {
                console.log('Tâche ajoutée avec succès à la base de données.');
                // Réalisez les actions nécessaires après l'ajout de la tâche, par exemple, actualiser l'affichage des tâches
            } else {
                console.error('Erreur lors de l\'ajout de la tâche:', response.statusText);
            }
        } catch (error) {
            console.error('Erreur lors de la requête:', error.message);
        }
    };

    const updateTaskDeadlineInputToDatabase = async (taskId, taskDeadlineInput) => {
        try {
            const response = await fetch(`http://localhost:3000/task/${taskId}/updeadline`, {
                method: 'PUT',
                headers: getHeaders(), // Inclure le token JWT
                body: JSON.stringify({ taskDeadlineInput }),
            });
            if (response.ok) {
                console.log('DeadLine de la tâche ajoutée avec succès à la base de données.');
                // Réalisez les actions nécessaires après l'ajout de la tâche, par exemple, actualiser l'affichage des tâches
            } else {
                console.error('Erreur lors de l\'ajout de la tâche:', response.statusText);
            }
        } catch (error) {
            console.error('Erreur lors de la requête:', error.message);
        }
    };

    const updateTaskNotesToDatabase = async (taskId, taskNotes) => {
        try {
            const response = await fetch(`http://localhost:3000/task/${taskId}/upnotes`, {
                method: 'PUT',
                headers: getHeaders(), // Inclure le token JWT
                body: JSON.stringify({ taskNotes }),
            });
            if (response.ok) {
                console.log('Notes de la tâche ajoutée avec succès à la base de données.');
                // Réalisez les actions nécessaires après l'ajout de la tâche, par exemple, actualiser l'affichage des tâches
            } else {
                console.error('Erreur lors de l\'ajout de la tâche:', response.statusText);
            }
        } catch (error) {
            console.error('Erreur lors de la requête:', error.message);
        }
    };

    const updateTaskPriorityToDatabase = async (taskId, taskPriority) => {
        try {
            const response = await fetch(`http://localhost:3000/task/${taskId}/uppriority`, {
                method: 'PUT',
                headers: getHeaders(), // Inclure le token JWT
                body: JSON.stringify({ taskPriority }),
            });
            if (response.ok) {
                console.log('Priorité de la tâche ajoutée avec succès à la base de données.');
                // Réalisez les actions nécessaires après l'ajout de la tâche, par exemple, actualiser l'affichage des tâches
            } else {
                console.error('Erreur lors de l\'ajout de la tâche:', response.statusText);
            }
        } catch (error) {
            console.error('Erreur lors de la requête:', error.message);
        }
    };
    
    const validateTaskInDatabase = async (taskId) => {
        try {
            const response = await fetch(`http://localhost:3000/task/${taskId}/check`, {
                method: 'PUT',
                headers: getHeaders(), // Inclure le token JWT
                body: JSON.stringify({
                    completed: true,
                }),
            });
            if (response.ok) {
                console.log('Tâche validée avec succès dans la base de données.');
                // Réalisez les actions nécessaires après la validation de la tâche, par exemple, actualiser l'affichage des tâches
            } else {
                console.error('Erreur lors de la validation de la tâche:', response.statusText);
            }
        } catch (error) {
            console.error('Erreur lors de la requête:', error.message);
        }
    };
    
    const unvalidateTaskInDatabase = async (taskId) => {
        try {
            const response = await fetch(`http://localhost:3000/task/${taskId}/uncheck`, {
                method: 'PUT',
                headers: getHeaders(), // Inclure le token JWT
                body: JSON.stringify({
                    completed: false,
                }),
            });
            if (response.ok) {
                console.log('Tâche dévalidée avec succès dans la base de données.');
                // Réalisez les actions nécessaires après la validation de la tâche, par exemple, actualiser l'affichage des tâches
            } else {
                console.error('Erreur lors de la dévalidation de la tâche:', response.statusText);
            }
        } catch (error) {
            console.error('Erreur lors de la requête:', error.message);
        }
    };

    const updateTaskNameInDatabase = async (taskId, newTaskText) => {
        try {
            const response = await fetch(`http://localhost:3000/task/${taskId}/uptask`, {
                method: 'PUT',
                headers: getHeaders(), // Inclure le token JWT
                body: JSON.stringify({ newTaskText }),
            });
            if (response.ok) {
                console.log('Tâche modifiée avec succès dans la base de données.');
                // Réalisez les actions nécessaires après la modification de la tâche, par exemple, actualiser l'affichage des tâches
            } else {
                console.error('Erreur lors de la modification de la tâche:', response.statusText);
            }
        } catch (error) {
            console.error('Erreur lors de la requête:', error.message);
        }
    };

    const deleteTaskFromDatabase = async (taskId) => {
        try {
            const response = await fetch(`http://localhost:3000/task/${taskId}/delete`, {
                method: 'DELETE',
                headers: getHeaders(), // Inclure le token JWT
            });
            if (response.ok) {
                console.log('Tâche supprimée avec succès de la base de données.');
                // Réalisez les actions nécessaires après la suppression de la tâche, par exemple, actualiser l'affichage des tâches
            } else {
                console.error('Erreur lors de la suppression de la tâche:', response.statusText);
            }
        } catch (error) {
            console.error('Erreur lors de la requête:', error.message);
        }
    };
});
