-- Création de la base de données
CREATE DATABASE IF NOT EXISTS todolist_db;

-- Utilisation de la base de données
USE todolist_db;

-- Création de la table User
CREATE TABLE IF NOT EXISTS User (   -- Identifiant utilisateur, s'auto-incrémente
    username VARCHAR(50) NOT NULL UNIQUE, -- Nom d'utilisateur, ne peut pas être NULL
    email VARCHAR(100) NOT NULL UNIQUE, -- Adresse e-mail, ne peut pas être NULL et doit être unique
    password VARCHAR(255) NOT NULL,  -- Mot de passe, ne peut pas être NULL
    PRIMARY KEY (username)           -- Clé primaire
);

-- Création de la table Task
CREATE TABLE IF NOT EXISTS Task (
    id_task VARCHAR(50),            -- Identifiant tâche
    id_user VARCHAR(50),                    -- Clé étrangère référencant User(id_user)
    status BOOLEAN DEFAULT FALSE NOT NULL,    -- Statut de la tâche avec valeur par défaut FALSE
    titre VARCHAR(100) NOT NULL,    -- Titre de la tâche, ne peut pas être NULL
    date_echeance DATE,             -- Date d'échéance de la tâche
    description TEXT CHARACTER SET utf8 COLLATE utf8_general_ci,               -- Description de la tâche
    priorite VARCHAR(50),           -- Priorité de la tâche
    conception TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,  -- Date de création, par défaut à l'heure actuelle, ne peut pas être NULL
    actualiser DATETIME, -- Date de mise à jour, mise à jour automatique, ne peut pas être NULL
    PRIMARY KEY (id_task),          -- Clé primaire
    FOREIGN KEY (id_user) REFERENCES User(username)  -- Contrainte de clé étrangère
);

-- Déclencheur pour la colonne actualiser avant la mise à jour
DELIMITER //
CREATE TRIGGER before_update_task
BEFORE UPDATE ON Task
FOR EACH ROW
BEGIN
    SET NEW.actualiser = NOW();
END; //
DELIMITER ;
