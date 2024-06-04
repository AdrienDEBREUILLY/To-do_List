// Importer les modules nécessaires
const cors = require('cors');
const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Utiliser CORS et express middleware / pour analyser cors des requête post
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Créer une connexion à la base de données
const db = mysql.createConnection({
    host: 'localhost',
    user: 'adrien',
    password: 'adrien',
    database: 'todolist_db'
});

// Vérifier la connexion
db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données : ', err);
        return;
    }
    console.log('Connecté à la base de données MySQL');
});



// Route pour récupérer toutes les tâches
// app.get('/taskgetting', (req, res) => {
//     res.json(tasks);
// });

// Récupérer toutes les tâches
app.get('/gettask', (req, res) => {
    const sql = 'SELECT * FROM Task';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Erreur lors de la récupération des tâches à partir de la base de données:', err);
            res.status(500).send('Erreur lors de la récupération des tâches à partir de la base de données');
            return;
        }
        res.status(200).json(result);
    });
});

// Route pour ajouter une tâche à la base de données
app.post('/task/:id/add', (req, res) => {
    const taskId = req.params.id;
    const { taskText } = req.body;
    const sql = 'INSERT INTO Task (id_task, titre) VALUES (?, ?);';
    // Insérer les données de la tâche dans la base de données
    // Vous devrez adapter cette requête en fonction de votre schéma de base de données
    db.query(sql, [taskId, taskText],
        (err, result) => {
            if (err) {
                console.error('Erreur lors de l\'insertion de la tâche : ', err);
                res.status(500).send('Erreur serveur lors de l\'ajout de la tâche');
                return;
            }
            res.status(200).send('Tâche ajoutée avec succès');
        });
});

// mise à jour de la date
app.put('/task/:id/updeadline', (req, res) => {
    const taskId = req.params.id;
    const { taskDeadlineInput } = req.body;
    const sql = 'UPDATE Task SET date_echeance = ? WHERE id_task = ?;';
    // Insérer les données de la tâche dans la base de données
    // Vous devrez adapter cette requête en fonction de votre schéma de base de données
    db.query(sql, [taskDeadlineInput, taskId],
        (err, result) => {
            if (err) {
                console.error('Erreur lors de l\'insertion de la tâche : ', err);
                res.status(500).send('Erreur serveur');
                return;
            }
            res.status(200).send('Tâche ajoutée avec succès');
        });
});

// ajout de la note
app.put('/task/:id/upnotes', (req, res) => {
    const taskId = req.params.id;
    const { taskNotes} = req.body;
    const sql = 'UPDATE Task SET description = ? WHERE id_task = ?;';
    // Insérer les données de la tâche dans la base de données
    // Vous devrez adapter cette requête en fonction de votre schéma de base de données
    db.query(sql, [mysql.escape(taskNotes), taskId],
        (err, result) => {
            if (err) {
                console.error('Erreur lors de l\'insertion de la tâche : ', err);
                res.status(500).send('Erreur serveur');
                return;
            }
            res.status(200).send('Tâche ajoutée avec succès');
        });
});

// ajout de la priorité
app.put('/task/:id/uppriority', (req, res) => {
    const taskId = req.params.id;
    console.log(`Task ID: ${taskId}`);
    const { taskPriority } = req.body;
    console.log(`Task Prio: ${taskPriority}`);
    const sql = 'UPDATE Task SET priorite = ? WHERE id_task = ?;';
    // Insérer les données de la tâche dans la base de données
    // Vous devrez adapter cette requête en fonction de votre schéma de base de données
    db.query(sql, [taskPriority, taskId],
        (err, result) => {
            if (err) {
                console.error('Erreur lors de l\'insertion de la tâche : ', err);
                res.status(500).send('Erreur serveur');
                return;
            }
            res.status(200).send('Tâche ajoutée avec succès');
        });
});

// Route pour valider une tâche dans la base de données
app.put('/task/:id/check', (req, res) => {
    const taskId = req.params.id;
    const sql = 'UPDATE Task SET status = TRUE WHERE id_task = ?';
    // Mettre à jour l'état de la tâche dans la base de données pour la marquer comme validée
    // Vous devrez adapter cette requête en fonction de votre schéma de base de données
    db.query(sql, [taskId],
        (err, result) => {
            if (err) {
                console.error('Erreur lors de la validation de la tâche : ', err);
                res.status(500).send('Erreur serveur');
                return;
            }
            res.status(200).send('Tâche validée avec succès');
        });
});

// Route pour valider une tâche dans la base de données
app.put('/task/:id/uncheck', (req, res) => {
    const taskId = req.params.id;
    const sql = 'UPDATE Task SET status = FALSE WHERE id_task = ?';
    // Mettre à jour l'état de la tâche dans la base de données pour la marquer comme validée
    // Vous devrez adapter cette requête en fonction de votre schéma de base de données
    db.query(sql, [taskId],
        (err, result) => {
            if (err) {
                console.error('Erreur lors de la dévalidation de la tâche : ', err);
                res.status(500).send('Erreur serveur');
                return;
            }
            res.status(200).send('Tâche dévalidée avec succès');
        });
});

// Route pour modifier le nom d'une tâche dans la base de données
app.put('/task/:id/uptask', (req, res) => {
    const taskId = req.params.id;
    const { newTaskText } = req.body;
    const sql = 'UPDATE Task SET titre = ? WHERE id_task = ?';
    // Mettre à jour le nom de la tâche dans la base de données
    // Vous devrez adapter cette requête en fonction de votre schéma de base de données
    db.query(sql, [newTaskText, taskId],
        (err, result) => {
            if (err) {
                console.error('Erreur lors de la modification de la tâche : ', err);
                res.status(500).send('Erreur serveur');
                return;
            }
            res.status(200).send('Tâche modifiée avec succès');
        });
});

// Route pour supprimer une tâche de la base de données
app.delete('/task/:id/delete', (req, res) => {
    const taskId = req.params.id;
    const sql = 'DELETE FROM Task WHERE id_task = ?';
    // Supprimer la tâche de la base de données
    // Vous devrez adapter cette requête en fonction de votre schéma de base de données
    db.query(sql, [taskId],
        (err, result) => {
            if (err) {
                console.error('Erreur lors de la suppression de la tâche : ', err);
                res.status(500).send('Erreur serveur');
                return;
            }
            res.status(200).send('Tâche supprimée avec succès');
        });
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur Express en cours d\'écoute sur le port ${port}`);
});
