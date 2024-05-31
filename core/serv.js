// Importer les modules nécessaires
const mysql = require('mysql2');
const express = require('express');
const app = express();
const cors = require('cors');

// Utiliser CORS middleware
app.use(cors());

// Créer une connexion à la base de données
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'adrien',
    password: 'adrien',
    database: 'todolist_db'
});

// Vérifier la connexion
connection.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données : ', err);
        return;
    }
    console.log('Connecté à la base de données MySQL');
});

// Middleware pour analyser les corps des requêtes POST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route pour ajouter une tâche à la base de données
app.post('/tache', (req, res) => {
    const { taskId, taskText, taskDeadlineInput, taskNotes, taskPriority } = req.body;

    // Insérer les données de la tâche dans la base de données
    // Vous devrez adapter cette requête en fonction de votre schéma de base de données
    connection.query(
        'INSERT INTO Task (id_task, titre, date_echeance, description, priorite) VALUES (?, ?, ?, ?, ?);',
        [taskId, taskText, taskDeadlineInput, taskNotes, taskPriority],
        (err, result) => {
            if (err) {
                console.error('Erreur lors de l\'insertion de la tâche : ', err);
                res.status(500).send('Erreur serveur');
                return;
            }
            res.status(200).send('Tâche ajoutée avec succès');
        }
    );
});

// Route pour valider une tâche dans la base de données
app.post('/valider-tache', (req, res) => {
    const { taskId } = req.body;

    // Mettre à jour l'état de la tâche dans la base de données pour la marquer comme validée
    // Vous devrez adapter cette requête en fonction de votre schéma de base de données
    connection.query(
        'UPDATE Task SET status = TRUE WHERE id_task = ?',
        [taskId],
        (err, result) => {
            if (err) {
                console.error('Erreur lors de la validation de la tâche : ', err);
                res.status(500).send('Erreur serveur');
                return;
            }
            res.status(200).send('Tâche validée avec succès');
        }
    );
});

// Route pour modifier le nom d'une tâche dans la base de données
app.post('/modifier-nom-tache', (req, res) => {
    const { taskId, newTaskText } = req.body;

    // Mettre à jour le nom de la tâche dans la base de données
    // Vous devrez adapter cette requête en fonction de votre schéma de base de données
    connection.query(
        'UPDATE Task SET titre = ? WHERE id_task = ?',
        [newTaskText, taskId],
        (err, result) => {
            if (err) {
                console.error('Erreur lors de la modification de la tâche : ', err);
                res.status(500).send('Erreur serveur');
                return;
            }
            res.status(200).send('Tâche modifiée avec succès');
        }
    );
});

// Route pour supprimer une tâche de la base de données
app.post('/supprimer-tache', (req, res) => {
    const { taskId } = req.body;

    // Supprimer la tâche de la base de données
    // Vous devrez adapter cette requête en fonction de votre schéma de base de données
    connection.query(
        'DELETE FROM Task WHERE id_task = ?',
        [taskId],
        (err, result) => {
            if (err) {
                console.error('Erreur lors de la suppression de la tâche : ', err);
                res.status(500).send('Erreur serveur');
                return;
            }
            res.status(200).send('Tâche supprimée avec succès');
        }
    );
});

// Démarrer le serveur
app.listen(3000, () => {
    console.log('Serveur Express en cours d\'écoute sur le port 3000');
});
