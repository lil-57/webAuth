export const ErrorMessages = {
  // ===== USER MODULE =====
  user: {
    notFound: (id: string) => `Utilisateur avec l'ID ${id} introuvable`,
    emailExists: "Un utilisateur avec cet email existe déjà",
    invalidIdFormat: "Format d'ID utilisateur invalide",
    noUsersFound: "Aucun utilisateur trouvé",
    deleteFailed: (id: string) => `La suppression de l\'utilisateur ${id} a échoué`,
    updateFailed: (id: string) => `La mise à jour de l\'utilisateur ${id} a échoué`,
    samePassword: "Le nouveau mot de passe doit être différent de l’ancien",
    cannotDeleteAdmin: "Un admin ne peut pas supprimé son propre compte",
  },

  // ===== AUTH MODULE =====
  auth: {
    invalidCredentials: "Email ou mot de passe incorrect",
    invalidOldPassword: "Ancien mot de passe incorrect",
    unauthorized: "Vous devez être connecté pour accéder à cette ressource",
    tokenMissing: "Aucun token fourni",
    tokenExpired: "Votre session a expiré, veuillez vous reconnecter",
    accessDenied: "Accès refusé : permission insuffisante",
    alreadyLoggedIn: "Vous êtes déjà connecté",
    invalidRefreshToken: "Refresh token invalide",
    expiredRefreshToken: "Refresh token expiré ou invalide",
    accountLocked: "Account is locked. Please try again later.",
  },

  // ===== VALIDATION ERRORS =====
  validation: {
    emailInvalid: "Email invalide",
    passwordTooShort: "Le mot de passe doit contenir au moins 6 caractères",
    requiredFields: "Certains champs obligatoires sont manquants",
    passwordMismatch: "Les mots de passe ne correspondent pas",
  },

  // ===== GENERIC / SYSTEM =====
  generic: {
    serverError: "Une erreur interne est survenue",
    databaseError: "Une erreur de base de données est survenue",
    unknownError: "Une erreur inconnue est survenue",
    notImplemented: "Cette fonctionnalité n'est pas encore disponible",
  },
}
