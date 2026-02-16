# Modélisation UML - Application Centre de Formation Continue (CFC)

Ce dossier contient la modélisation complète du système CFC, conformément aux règles métier et au standard UML.

## 1. Diagramme de Cas d'Utilisation

**Fichier :** [use_case.puml](file:///home/jo/.gemini/antigravity/scratch/cfc_system/modeling/use_case.puml)

**Explication :**
Ce diagramme illustre les interactions entre les acteurs (Candidat, Coordinateur, Admin Établissement, Super Admin) et le système.
- **Candidat** : Consulte les formations et gère son inscription.
- **Coordinateur** : Gère ses formations spécifiques et les périodes d'inscription.
- **Admin Établissement** : Supervise toutes les formations de son entité et valide les inscriptions.
- **Super Admin** : A une vue globale et gère le paramétrage système.

## 2. Diagramme de Classes (Domaine + RBAC)

**Fichier :** [class_diagram.puml](file:///home/jo/.gemini/antigravity/scratch/cfc_system/modeling/class_diagram.puml)

**Explication :**
Représente la structure statique des données.
- **User** : Entité centrale avec un rôle (`UserRole`).
- **Formation/Session** : Structure hiérarchique liée à un `Establishment`.
- **Registration/Dossier** : Lie un `User` (Candidat) à une `Session`.
- **RBAC** : Les permissions sont implicites via les relations et les rôles définis dans l'enum.

## 3. Diagrammes de Séquence

**Fichier :** [sequence_diagrams.puml](file:///home/jo/.gemini/antigravity/scratch/cfc_system/modeling/sequence_diagrams.puml)

**Scénarios couverts :**
- **A) Ouverture des inscriptions** : Interaction Coordinateur -> API -> Base de données.
- **B) Préinscription Candidat** : Création de compte, inscription session, upload dossier.
- **C) Validation Inscription** : Admin examine et valide, déclenchant une notification.
- **D) Fermeture Automatique** : Job cron vérifiant les dates d'échéance.

## 4. Diagramme d'États

**Fichier :** [state_diagram.puml](file:///home/jo/.gemini/antigravity/scratch/cfc_system/modeling/state_diagram.puml)

**Explication :**
Détaille le cycle de vie :
- **Inscription** : PENDING (en attente pièces) -> VALIDATED (accepté) ou REJECTED.
- **Formation** : BROUILLON (création) -> PUBLIEE (visible) -> ARCHIVEE (fin).

## 5. Diagramme d'Activités (Parcours Candidat)

**Fichier :** [activity_diagram.puml](file:///home/jo/.gemini/antigravity/scratch/cfc_system/modeling/activity_diagram.puml)

**Explication :**
Modélise le flux logiques des actions d'un candidat, de la consultation du catalogue à la finalisation de son dossier, en incluant les points de décision (Session ouverte ? Compte existant ? Dossier complet ?).
