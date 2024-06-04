// Importer les modules nécessaires
const cors = require('cors');
const express = require('express');
const bcrypt = require('bcrypt');
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

///////////////////////////////////////////////////////////////////// index.html => serv.js

// Route pour ajouter une tâche à la base de données
app.post('/task/:id/add', async (req, res) => {
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
app.put('/task/:id/updeadline', async (req, res) => {
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
app.put('/task/:id/upnotes', async (req, res) => {
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
app.put('/task/:id/uppriority', async (req, res) => {
    const taskId = req.params.id;
    const { taskPriority } = req.body;
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
app.put('/task/:id/check', async (req, res) => {
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
app.put('/task/:id/uncheck', async (req, res) => {
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
app.put('/task/:id/uptask', async (req, res) => {
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
app.delete('/task/:id/delete', async (req, res) => {
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

///////////////////////////////////////////////////////////////////// signup.html => serv.js

// Route pour ajouter un utilisateur
app.post('/signup', async (req, res) => {
    const { username } = req.body;
    console.log(`UserName: ${username}`);
    const { email } = req.body;
    console.log(`email: ${email}`);
    const { password } = req.body;
    console.log(`password: ${password}`);
    const sql = 'INSERT INTO user (username, email, password) VALUES (?, ?, ?);';
    try {
        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(`HashPassword: ${hashedPassword}`);
        // Ajouter l'utilisateur à la base de données
        db.query(sql, [username, email, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    // Gérer le cas où l'e-mail est déjà utilisé
                    return res.status(400).send('Adresse e-mail déjà utilisée');
                }
                console.error('Erreur lors de l\'insertion de l\'utilisateur : ', err);
                return res.status(500).send('Erreur serveur lors de l\'ajout de l\'utilisateur');
            }
            res.status(200).send('Utilisateur ajouté avec succès');
            });
    } catch (error) {
        console.error('Erreur lors du hachage du mot de passe : ', error);
        res.status(500).send('Erreur serveur');
    }
});

///////////////////////////////////////////////////////////////////// login.html <=> serv.js



///////////////////////////////////////////////////////////////////// serv.js => index.html

// Récupérer toutes les tâches
app.get('/gettask', async (req, res) => {
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

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur Express en cours d\'écoute sur le port ${port}`);
});
