document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');// récupération du token si il y a
    
    if (!token) {
        // Rediriger vers la page de login si l'utilisateur n'est pas connecté
        window.location.href='login.html';
    }else{
        // Afficher un message en console si l'utilisateur est connecté
        console.log('Utilisateur connecté.');
    }

    // Sélection des éléments du DOM nécessaires
    const taskList = document.getElementById('task-list');
    const newTaskInput = document.getElementById('new-task');
    const completedTaskList = document.getElementById('completed-task-list');

    /////////////////////////////////////////////////////////////////////

    // Fonction pour inclure le token JWT dans les en-têtes
    const getHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    const generateTaskId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
    };

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

    // Supprimer une tâche
    const deleteTask = (task) => {
        task.remove();
    };

    //////////////////////////////////

    // Fonction pour ajouter une tâche au DOM
    const addTaskToDOM = (task) => {
        const taskId = task.id_task || generateTaskId();
        const taskText = task.titre || task.taskText;
        console.log('Adding task to DOM:', taskText);
        const taskPriority = task.priorite || 'default';
        const taskDeadline = task.date_echeance || '';
        const taskNotes = task.description || '';
        const taskStatus = task.status || false;

        // Création de l'élément de tâche
        const taskElement = document.createElement('li');
        taskElement.className = 'bg-white p-3 my-2 rounded shadow-md flex justify-between items-center';
        taskElement.setAttribute('data-id', taskId);

        // Création de la case à cocher
        const taskCheckbox = document.createElement('input');
        taskCheckbox.type = 'checkbox';
        taskCheckbox.className = 'w-4 h-4 border border-gray-400 rounded cursor-pointer flex-shrink-0 mr-2';
        if (taskStatus) {
            taskCheckbox.checked = true;
            taskElement.classList.add('line-through');
            taskElement.style.backgroundColor = '#b3ffb3';
        }

        // Création du texte de la tâche
        const taskTextElement = document.createElement('span');
        taskTextElement.textContent = taskText;
        taskTextElement.className = 'flex-1';

        // Création du bouton pour les notes
        const taskNotesButton = document.createElement('button');
        taskNotesButton.className = 'bg-yellow-500 text-white py-1 px-2 rounded mr-2 hover:bg-yellow-600';
        taskNotesButton.textContent = 'notes';

        // Création de la zone de notes
        const taskNotesElement = document.createElement('textarea');
        taskNotesElement.className = 'py-1 px-2 rounded mr-2';
        taskNotesElement.style.display = 'none';
        taskNotesElement.placeholder = 'Add notes...';
        taskNotesElement.value = taskNotes || '';

        // Création du champ pour la date de deadline
        const taskDeadlineInput = document.createElement('input');
        taskDeadlineInput.type = 'date';
        taskDeadlineInput.className = 'py-1 px-2 border border-gray-300 rounded mr-2';
        taskDeadlineInput.value = taskDeadline || '';

        // Création de la liste déroulante pour la priorité
        const taskPrioritySelect = document.createElement('select');
        taskPrioritySelect.className = 'text-black py-1 px-2 rounded mr-2';
        taskPrioritySelect.innerHTML = `
            <option value="default">default</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
        `;
        taskPrioritySelect.value = taskPriority || 'default';

        // Création du bouton pour l'édition de la tâche
        const taskEditButton = document.createElement('button');
        taskEditButton.className = 'bg-blue-500 text-white py-1 px-2 rounded mr-2 hover:bg-blue-600';
        taskEditButton.textContent = 'edit';

        // Création du bouton pour la suppression de la tâche
        const taskDeleteButton = document.createElement('button');
        taskDeleteButton.className = 'bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600';
        taskDeleteButton.textContent = 'delete';

        // Création du conteneur pour les boutons
        const taskButtons = document.createElement('div');
        taskButtons.className = 'flex';
        taskButtons.appendChild(taskPrioritySelect);
        taskButtons.appendChild(taskDeadlineInput);
        taskButtons.appendChild(taskNotesElement);
        taskButtons.appendChild(taskNotesButton);
        taskButtons.appendChild(taskEditButton);
        taskButtons.appendChild(taskDeleteButton);

        // Ajout des éléments à la tâche
        taskElement.appendChild(taskCheckbox);
        taskElement.appendChild(taskTextElement);
        taskElement.appendChild(taskButtons);

        // Ajouter la tâche à la liste appropriée
        if (taskStatus) {
            completedTaskList.appendChild(taskElement);
        } else {
            taskList.appendChild(taskElement);
        }

        // Ajout des événements
        taskCheckbox.addEventListener('change', async (e) => {
            const dateInput = taskDeadlineInput;
            const textarea = taskNotesElement;

            if (e.target.checked) { // checked
                taskElement.classList.toggle('line-through');
                taskElement.style.backgroundColor = '#b3ffb3';
                taskPrioritySelect.value = 'default';
                taskPrioritySelect.disabled = true;
                dateInput.disabled = true;
                textarea.disabled = true;
                taskElement.setAttribute('data-completed', 'true');
                completedTaskList.appendChild(taskElement);
                await validateTaskInDatabase(taskId);
            } else { // unchecked
                taskElement.classList.remove('line-through');
                taskElement.style.backgroundColor = '';
                taskPrioritySelect.disabled = false;
                dateInput.disabled = false;
                textarea.disabled = false;
                taskElement.removeAttribute('data-completed');
                taskList.appendChild(taskElement);
                await unvalidateTaskInDatabase(taskId);
            }
        });

        taskPrioritySelect.addEventListener('change', async () => {
            setBackgroundColor(taskElement);
            sortTasks();
            await updateTaskPriorityToDatabase(taskId, taskPrioritySelect.value);
        });

        taskNotesElement.addEventListener('input', async () => {
            await updateTaskNotesToDatabase(taskId, taskNotesElement.value);
        });

        taskDeadlineInput.addEventListener('change', async () => {
            await updateTaskDeadlineInputToDatabase(taskId, taskDeadlineInput.value);
        });

        taskNotesButton.addEventListener('click', () => {
            taskNotesElement.style.display = taskNotesElement.style.display === 'none' ? 'block' : 'none';
        });

        taskEditButton.addEventListener('click', async () => {
            const newTaskText = prompt('Enter the new task text:', taskTextElement.textContent);
            const isCompleted = taskElement.getAttribute('data-completed');
            if (isCompleted !== 'true' && newTaskText) {
                taskTextElement.textContent = newTaskText;
                await updateTaskNameInDatabase(taskId, newTaskText);
            } else {
                console.log('Cette édition ne peut être faite car la tâche est validée.');
            }
        });

        taskDeleteButton.addEventListener('click', async () => {
            const isCompleted = taskElement.getAttribute('data-completed');
            if (isCompleted === 'true') {
                deleteTask(taskElement);
                await deleteTaskFromDatabase(taskId);
            } else {
                console.log('Cette tâche ne peut être supprimée car elle n\'est pas terminée.');
            }
        });

        setBackgroundColor(taskElement);
    };

    //////////////////////////////////

    // Fonction pour récupérer les tâches de l'utilisateur
    const fetchTasks = async () => {
        try {
            const response = await fetch('http://localhost:3000/gettasks', {
                method: 'GET',
                headers: getHeaders(), // Inclure le token JWT
            });
            if (response.ok) {
                const tasks = await response.json();
                if (tasks.length === 0) {
                    console.log('Aucune tâche trouvée pour cet utilisateur.');
                } else {
                    tasks.forEach(task => addTaskToDOM(task));
                }
            } else {
                console.error('Erreur lors de la récupération des tâches:', response.statusText);
            }
        } catch (error) {
            console.error('Erreur lors de la requête:', error.message);
        }
    };

    //////////////////////////////////

    // Appel de la fonction pour récupérer les tâches
    fetchTasks();

    //////////////////////////////////

    // Ajouter une nouvelle tâche
    document.querySelector('form').addEventListener('submit', async (e) => {
        e.preventDefault(); // Empêcher le comportement par défaut du formulaire
        if (!newTaskInput.value.trim()) return; // Vérifier si le champ de saisie est vide

        const task = {
            id_task: generateTaskId(),
            titre: newTaskInput.value.trim(),
            priorite: 'default',
            date_echeance: '',
            description: '',
            status: false
        };

        console.log('Creating new task:', task.titre);
        addTaskToDOM(task);

        newTaskInput.value = ''; // Réinitialiser la valeur de l'entrée
        newTaskInput.focus(); // Focus sur l'entrée

        await TaskToDatabase(task.id_task, task.titre);
    });

    /////////////////////////////////////////////////////////////////////

    // appels de données pour les routes
    const TaskToDatabase = async (taskId, taskText) => {
        console.log('Task to be sent to database:', taskText);
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
