// Importer les modules nécessaires
const cors = require('cors');
const express = require('express');
// const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const app = express();
const port = 3000;
const secretKey = 'k4zh684bfcidfr4g6j5253g6869lkdbrsd58jf64df6h5g64';

/* bloc de connexion de dossier pour tailwincss
// Servir les fichiers statiques du répertoire 'core/public'
app.use(express.static(path.join(__dirname, 'public')));
// Servir les fichiers du répertoire dist situé à la racine du projet
app.use('/dist', express.static(path.join(__dirname, '..', '..','dist')));
// Route pour l'index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});*/

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

// Middleware pour vérifier le token JWT et extraire l'utilisateur
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // Si le token est absent

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403); // Si le token est invalide

        req.user = user; // Assigne l'utilisateur extrait du token à req.user
        next(); // Passe au prochain middleware ou route
    });
}

///////////////////////////////////////////////////////////////////// index.html => serv.js

// Route pour ajouter une tâche à la base de données
app.post('/task/:id/add', authenticateToken, async (req, res) => {
    const taskId = req.params.id;
    const userId = req.user.username;
    const { taskText } = req.body;
    const sql = 'INSERT INTO Task (id_task, titre, id_user) VALUES (?, ?, ?);';
    // Insérer les données de la tâche dans la base de données
    // Vous devrez adapter cette requête en fonction de votre schéma de base de données
    db.query(sql, [taskId, taskText, userId],
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
app.put('/task/:id/updeadline', authenticateToken, async (req, res) => {
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
app.put('/task/:id/upnotes', authenticateToken, async (req, res) => {
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
app.put('/task/:id/uppriority', authenticateToken, async (req, res) => {
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
app.put('/task/:id/check', authenticateToken, async (req, res) => {
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

// Route pour dévalider une tâche dans la base de données
app.put('/task/:id/uncheck', authenticateToken, async (req, res) => {
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
app.put('/task/:id/uptask', authenticateToken, async (req, res) => {
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
app.delete('/task/:id/delete', authenticateToken, async (req, res) => {
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
    const { email } = req.body;
    const { password } = req.body;
    const sql = 'INSERT INTO user (username, email, password) VALUES (?, ?, ?);';
    try {
        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);
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

// Route pour vérifier les informations de connexion
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Requête SQL pour obtenir l'utilisateur avec le nom d'utilisateur fourni
    const sql = 'SELECT * FROM user WHERE username = ?';

    // Requête à la base de données
    db.query(sql, [username], async (err, results) => {
        if (err) {
            console.error('Erreur lors de la vérification de l\'utilisateur :', err);
            return res.status(500).send('Erreur serveur lors de la vérification de l\'utilisateur');
        }

        if (results.length === 0) {
            // Si aucun utilisateur n'est trouvé avec ce nom d'utilisateur
            return res.status(400).send('Nom d\'utilisateur ou mot de passe incorrect');
        }

        const user = results[0];

        // Comparer le mot de passe fourni avec le mot de passe haché dans la base de données
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            // Si le mot de passe ne correspond pas
            return res.status(400).send('Nom d\'utilisateur ou mot de passe incorrect');
        }

        // Si le mot de passe correspond, créer un token (par exemple JWT, ici un simple message)
        const token = jwt.sign({ userId: user.id, username: user.username }, secretKey, { expiresIn: '1h' });

        // Retourner une réponse positive avec le token
        res.status(200).json({ message: 'Connexion réussie', token });
    });
});

///////////////////////////////////////////////////////////////////// serv.js => index.html

// Récupérer toutes les tâches de l'utilisateur actuellement connecté
app.get('/gettasks', async (req, res) => {
    const userId = req.user.userId; // Obtenez l'identifiant de l'utilisateur à partir du token JWT
    const sql = 'SELECT * FROM Task WHERE id_user = ?';
    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error('Erreur lors de la récupération des tâches de l\'utilisateur :', err);
            res.status(500).send('Erreur lors de la récupération des tâches');
            return;
        }
        res.status(200).json(result);
    });
});

/////////////////////////////////////////////////////////////////////

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur Express en cours d\'écoute sur le port ${port}`);
});
