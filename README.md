# 🔐 Authentification Fullstack - NestJS + React

Ce projet est une application web complète d’authentification, développée avec NestJS pour le backend et React pour le frontend. Il est hébergé en ligne, avec gestion sécurisée des utilisateurs.

## ⚙️ Fonctionnalités

- Inscription, connexion et déconnexion
- Authentification sécurisée avec JWT (access + refresh tokens)
- Cookies httpOnly pour protéger les sessions
- Système de rôles (`user`, `admin`) avec accès restreint
- Connexion possible par mot de passe ou lien magique (magic link)
- Réinitialisation de mot de passe par email
- Validation dynamique des champs (Zod, React Hook Form)
- Rafraîchissement automatique du token d’accès
- Interface moderne et responsive

## 🛠️ Technologies utilisées

- **Frontend** : React, TypeScript, Vite, TailwindCSS
- **Backend** : NestJS, PostgreSQL, MikroORM, Argon2, JWT
- **Autres outils** : Docker, pnpm, Zod, React Hook Form, Nodemailer

## 📁 Structure

- `frontend/` : interface utilisateur, logique de formulaire, appels API sécurisés
- `backend/` : API NestJS, gestion des utilisateurs, rôles, sécurité
- `docker-compose.yml` : base de données PostgreSQL pour le développement
- `.env` : configuration de l’environnement (JWT, base de données…)

 

 
