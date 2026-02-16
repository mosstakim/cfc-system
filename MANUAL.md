# Manuel d'Utilisation - Système de Gestion CFC

Bienvenue dans le manuel d'utilisation de l'application de gestion du Centre de Formation Continue (CFC). Ce document est destiné aux administrateurs, coordinateurs et étudiants.

## 1. Accès à l'Application

Une fois le système lancé (via Docker), l'application est accessible aux adresses suivantes :

- **Frontend (Application Web)** : [http://localhost:5173](http://localhost:5173)
- **Backend (API)** : [http://localhost:3000](http://localhost:3000)
- **Base de Données (Adminer - optionnel)** : [http://localhost:8080](http://localhost:8080)

## 2. Comptes par Défaut

Pour vos premiers tests, vous pouvez utiliser les comptes suivants (mot de passe pour tous : `password123`) :

| Rôle | Email | Description |
| :--- | :--- | :--- |
| **Super Admin** | `admin@cfc.usms.ac.ma` | Accès complet au système. |
| **Admin Établissement** | `fst.admin@cfc.usms.ac.ma` | Gestion de la FST (Faculté des Sciences et Techniques). |
| **Coordinateur** | `coord.mst@cfc.usms.ac.ma` | Gestion d'une formation (ex : MST). |
| **Candidat** | `etudiant@test.com` | Compte étudiant pour tester l'inscription. |

> **Note :** Vous pouvez créer votre propre compte candidat via le formulaire d'inscription sur la page d'accueil.

## 3. Fonctionnalités Principales par Rôle

### 👨‍🎓 Pour les Candidats (Étudiants)

1.  **Consulter le Catalogue** : Sur la page d'accueil, cliquez sur "Formations" pour voir la liste des cours disponibles.
2.  **S'inscrire** :
    - Cliquez sur le bouton "S'inscrire" d'une formation ouverte.
    - Si vous n'avez pas de compte, remplissez le formulaire.
    - Une fois connecté, confirmez votre choix de session.
3.  **Tableau de Bord** :
    - Allez dans "Mon Espace".
    - Vous verrez l'état de votre inscription (En attente, Validé, Refusé).
    - **Téléversez vos pièces** (CV, Diplôme, CIN) dans la section "Mon Dossier".

### 👨‍🏫 Pour les Coordinateurs

1.  **Gestion des Sessions** :
    - Connectez-vous et accédez à votre Tableau de Bord.
    - Vous verrez la liste des sessions pour vos formations.
    - Cliquez sur **"Ouvrir"** ou **"Fermer"** pour contrôler la période d'inscription.
    - Modifiez les dates de début et de fin.
2.  **Suivi** : Consultez la liste des étudiants inscrits à vos sessions.

### 🏛️ Pour l'Admin Établissement

1.  **Validation des Inscriptions** :
    - Sur le tableau de bord, consultez la liste "Inscriptions à valider".
    - Cliquez sur une inscription pour voir les détails.
    - Vérifiez les pièces jointes (CV, Diplôme).
    - Cliquez sur **"Valider"** ou **"Rejeter"**.
    - Le candidat recevra une notification (voir section Emails).
2.  **Gestion des Formations** :
    - Ajoutez ou modifiez des formations pour votre établissement.
    - Définissez les frais de scolarité et la description.

### 🛠️ Pour le Super Admin

1.  **Vue Globale** : Accès à toutes les statistiques du CFC.
2.  **Gestion Utilisateurs** : Créer ou supprimer des comptes administrateurs ou coordinateurs.
3.  **Paramètres** : Configuration globale du système.

## 4. Dépannage

- **Erreur de connexion ?** Vérifiez que le serveur backend est lancé (`docker-compose up`).
- **Liste vide ?** Assurez-vous d'avoir lancé le script de "seed" pour remplir la base de données.
- **Problème d'affichage ?** Essayez de rafraîchir la page (F5) ou videz le cache du navigateur.
