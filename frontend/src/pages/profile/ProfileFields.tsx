"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { PropsProfile } from "./ProfileInterface"

export default function ProfileFields({
  values,
  onChange,
  isEditing,
  isEmailChecking,
  showErrors,
  validationStatus,
}: PropsProfile) {
  return (
    <>
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input
            id="firstName"
            name="firstName"
            placeholder="Prénom"
            value={values.firstName}
            onChange={onChange}
            readOnly={!isEditing}
          />
          {isEditing && !showErrors.firstName && values.firstName && (
            <p className="text-sm text-muted-foreground">Vérification en cours...</p>
          )}
          {isEditing && showErrors.firstName && !validationStatus.firstNameValid && (
            <p className="text-sm text-destructive">Le prénom est requis</p>
          )}
          {isEditing && showErrors.firstName && !validationStatus.firstNameFormatValid && (
            <p className="text-sm text-destructive">Le format du prénom est invalide</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input
            id="lastName"
            name="lastName"
            placeholder="Nom"
            value={values.lastName}
            onChange={onChange}
            readOnly={!isEditing}
          />
          {isEditing && !showErrors.lastName && values.lastName && (
            <p className="text-sm text-muted-foreground">Vérification en cours...</p>
          )}
          {isEditing && showErrors.lastName && !validationStatus.lastNameValid && (
            <p className="text-sm text-destructive">Le nom est requis</p>
          )}
          {isEditing && showErrors.lastName && !validationStatus.lastNameFormatValid && (
            <p className="text-sm text-destructive">Le format du nom est invalide</p>
          )}
        </div>
      </div>

      <div className="space-y-2 pt-4">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="exemple@email.com"
          value={values.email}
          onChange={onChange}
          readOnly={!isEditing}
        />
        {isEditing && isEmailChecking && <p className="text-sm text-muted-foreground">Vérification en cours...</p>}
        {isEditing && showErrors.email && !validationStatus.emailValid && (
          <p className="text-sm text-destructive">Le format est invalide</p>
        )}
        {isEditing && showErrors.email && validationStatus.emailValid && validationStatus.emailExists && (
          <p className="text-sm text-destructive">L'email est déjà utilisé</p>
        )}
      </div>
    </>
  )
}
