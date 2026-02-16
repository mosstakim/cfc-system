# Système de Gestion - Centre de Formation Continue (CFC)

Application web complète pour la gestion des formations continues, des inscriptions et du suivi pédagogique. Conçue pour simplifier le processus administratif entre les candidats, les coordinateurs et l'administration.

## 🚀 Fonctionnalités Clés

- **Catalogue de Formations** : Consultation publique des offres de formation par établissement.
- **Gestion des Inscriptions** :
  - Préinscription en ligne.
  - Dépôt de dossier numérique (CV, Diplômes).
  - Workflow de validation (En attente -> Validé/Rejeté).
- **Rôles Multiples (RBAC)** :
  - **Super Admin** : Gestion globale.
  - **Admin Établissement** : Gestion locale (FST, EST, etc.).
  - **Coordinateur** : Gestion pédagogique et ouverture des sessions.
  - **Candidat** : Espace personnel de suivi.
- **Tableaux de Bord** : Vues personnalisées pour chaque acteur.

## 🛠️ Stack Technique

- **Backend** : NestJS (Node.js), TypeORM, PostgreSQL.
- **Frontend** : React, Vite, TypeScript.
- **Infrastructure** : Docker, Docker Compose.
- **Modélisation** : UML (PlantUML) pour la conception.

## 📦 Installation et Démarrage

### Prérequis
- Docker et Docker Compose installés sur votre machine.

### Lancement Rapide

1.  **Cloner le dépôt** :
    ```bash
    git clone https://github.com/votre-username/cfc-system.git
    cd cfc-system
    ```

2.  **Lancer l'application** :
    ```bash
    docker-compose up --build
    ```
    *Cette commande construit les images et lance les conteneurs (Backend, Frontend, Base de données).*

3.  **Accéder à l'application** :
    - Frontend : http://localhost:5173
    - Backend API : http://localhost:3000

## 📚 Documentation

- **Manuel d'Utilisation** : Voir le fichier [MANUAL.md](./MANUAL.md) pour le guide complet.
- **Modélisation UML** : Voir le dossier [modeling/](./modeling/) pour les diagrammes de conception (Cas d'utilisation, Classes, Séquence, etc.).

## 👥 Auteur
Projet réalisé dans le cadre du cours de Génie Logiciel / UML.
