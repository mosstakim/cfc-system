# Rapport de Projet : Système de Gestion des Centres de Formation Continue (CFC)

## 1. Introduction
Ce document présente l'architecture technique, la modélisation UML et les instructions de déploiement pour la plateforme de gestion des inscriptions aux formations continues (CFC). Le système permet aux candidats de postuler aux formations offertes par différents établissements (FST, ENCG, etc.) et aux administrateurs de gérer le cycle de vie des inscriptions.

## 2. Architecture Technique
Le projet repose sur une architecture moderne et conteneurisée :

*   **Backend** : NestJS (Node.js framework), TypeORM (ORM), PostgreSQL (Base de données).
*   **Frontend** : React avec Vite et TypeScript.
*   **Infrastructure** : Docker Compose pour l'orchestration des services (Base de données, API, Interface Utilisateur).

## 3. Modélisation UML
Voici les diagrammes PlantUML décrivant la structure et le comportement du système.

### 3.1 Diagramme de Cas d'Utilisation
Vue d'ensemble des acteurs et de leurs interactions avec le système.

```plantuml
@startuml
title Diagramme de Cas d'Utilisation - Système CFC
left to right direction
skinparam packageStyle rectangle

actor "Candidat" as candidate
actor "Coordinateur" as coordinator
actor "Admin Établissement" as admin_etab
actor "Super Admin" as super_admin

rectangle "Système CFC" {

  usecase "Consulter catalogue formations" as UC1
  usecase "Se préinscrire / Créer compte" as UC2
  usecase "Déposer / Compléter dossier" as UC3
  usecase "Suivre statut inscription" as UC4
  
  usecase "Gérer formations (CRUD)" as UC5
  usecase "Ouvrir/Fermer période inscription" as UC6
  usecase "Valider/Refuser inscriptions" as UC7
  usecase "Publier formation" as UC8
  
  usecase "Gérer tous les établissements" as UC9
  usecase "Gérer utilisateurs et rôles" as UC10
  usecase "Configuration globale" as UC11
  usecase "Reporting global" as UC12
}

candidate --> UC1
candidate --> UC2
candidate --> UC3
candidate --> UC4

coordinator --> UC1
coordinator --> UC6 : (pour sa formation)
coordinator --> UC5 : (Brouillon uniquement)

admin_etab --> UC5 : (Complet pour son Etab)
admin_etab --> UC7
admin_etab --> UC8
admin_etab -up-|> coordinator : (hérite accès lecture)

super_admin --> UC9
super_admin --> UC10
super_admin --> UC11
super_admin --> UC12
super_admin -up-|> admin_etab : (peut tout faire)

note right of UC6
  Possible uniquement si
  date courante dans intervalle
end note

note right of UC3
  Téléchargement pièces :
  CV, Diplôme, CIN
end note

@enduml
```

### 3.2 Diagramme de Classes
Structure des données et relations entre les entités.

```plantuml
@startuml
title Diagramme de Classes - Système CFC
hide empty methods

enum UserRole {
  SUPER_ADMIN
  ADMIN_ETAB
  COORDINATOR
  CANDIDATE
}

enum RegistrationStatus {
  PENDING
  VALIDATED
  REJECTED
}

class User {
  +id: UUID
  +email: String
  +passwordHash: String
  +firstName: String
  +lastName: String
  +role: UserRole
  +isActive: Boolean
}

class Establishment {
  +id: UUID
  +name: String
  +address: String
  +city: String
}

class Formation {
  +id: UUID
  +title: String
  +description: Text
  +tuitionFees: Decimal
  +duration: String
  +isPublished: Boolean
}

class Session {
  +id: UUID
  +name: String
  +startDate: Date
  +endDate: Date
  +isOpen: Boolean
}

class Registration {
  +id: UUID
  +status: RegistrationStatus
  +createdAt: Date
}

class Dossier {
  +id: UUID
  +isComplete: Boolean
  +documents: Json (CV, Diploma, ID)
}

' Relations

User "1" -- "*" Registration : candidate
User "*" -- "1" Establishment : admin/coord (via logic/role)

Establishment "1" *-- "*" Formation : offers
Formation "1" *-- "*" Session : has instances

Registration "*" -- "1" Session : registers for
Registration "1" -- "1" Dossier : contains

note "RBAC Rules:\n- SuperAdmin manages Establishments & Users\n- AdminEtab manages Formations of their Establishment\n- Coordinator manages Session dates\n- Candidate manages their Registration/Dossier" as N1

@enduml
```

### 3.3 Diagramme de Séquence (Inscription Candidat)
Détail du flux d'inscription et de création de compte.
*(Extrait du fichier sequence_diagrams.puml)*

```plantuml
@startuml
title Scénario B: Candidat se préinscrit + soumet dossier
actor Candidat
participant "Portail Inscription" as Portal
participant "API (Registration)" as API
participant "Database" as DB
participant "EmailService" as Mail

Candidat -> Portal: Choisit Formation/Session
Portal -> Candidat: Formulaire Inscription
Candidat -> Portal: Remplit info & Submit
Portal -> API: POST /users (Création compte)
API -> DB: INSERT User
API -> API: Generate Token (Login auto)
Portal -> API: POST /registration {sessionId, candidateId}
API -> DB: INSERT Registration (PENDING)
API -> DB: INSERT Dossier (Empty)
API --> Portal: 201 Created
Portal -> Candidat: "Inscription réussie, connectez-vous"
Candidat -> Portal: Upload Pièces (CV, Diplôme)
Portal -> API: POST /upload (File)
API -> DB: UPDATE Dossier SET documents...
API --> Portal: Upload Success
Portal -> Candidat: "Dossier Complet"
@enduml
```

### 3.4 Diagramme d'États (Cycle de vie d'une Inscription)

```plantuml
@startuml
title Cycle de vie d'une Inscription
[*] --> PENDING : Candidat s'inscrit
PENDING : Dossier en cours de constitution

state PENDING {
  [*] --> Incomplete : Création
  Incomplete --> Complete : Upload toutes pièces
  Complete --> Incomplete : Suppression pièce
}

PENDING --> VALIDATED : Admin valide
PENDING --> REJECTED : Admin refuse

VALIDATED : Candidat accepté
VALIDATED --> [*]

REJECTED : Candidature rejetée
REJECTED --> [*]
@enduml
```

### 3.5 Diagramme d'Activité (Parcours Candidat)

```plantuml
@startuml
title Parcours Candidat - Inscription CFC
start
:Consulter le catalogue;
:Choisir une formation;
if (Session ouverte ?) then (oui)
  :Cliquer "S'inscrire";
  if (Déjà un compte ?) then (non)
    :Remplir formulaire (Nom, Email...);
    :Créer compte;
  else (oui)
    :Se connecter;
  endif
  :Confirmer inscription à la session;
  :Accéder au Tableau de bord;
  repeat
    :Télécharger pièce justificative;
  repeat while (Dossier incomplet ?) is (oui)
  :Dossier complet;
  stop
else (non)
  :Afficher "Inscriptions fermées";
  stop
endif
@enduml
```

## 4. Correctifs Récents
Des améliorations majeures ont été apportées pour stabiliser l'application :
1.  **Résolution des dépendances circulaires** : Modification des entités `Formation` et `Session` pour éviter les boucles infinies lors de la sérialisation JSON (Erreur 500). Ajout de colonnes d'ID explicites (`establishmentId`, `formationId`).
2.  **Gestion des dépendances Backend** : Correction des modules NestJS pour assurer que tous les repositories (`Registration`, `Dossier`) sont correctement injectés, résolvant les crashs au démarrage.
3.  **Conteneurisation complète** : Configuration validée de `docker-compose` pour lancer PostgreSQL, le Backend et le Frontend en une seule commande.

## 5. Guide de Démarrage
Pour lancer le projet localement :

1.  **Prérequis** : Docker et Docker Compose installés.
2.  **Démarrage** :
    ```bash
    docker compose up -d
    ```
3.  **Accès** :
    *   Frontend : http://localhost:5173
    *   Backend API : http://localhost:3000
