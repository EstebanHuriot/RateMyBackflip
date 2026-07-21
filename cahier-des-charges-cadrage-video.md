# Cahier des charges — Capture vidéo (RateMyBackflip V1)

## 1. Format vidéo

| Critère | Règle |
|---|---|
| Orientation | Portrait (vertical) uniquement |
| Angle de prise de vue | Profil (de côté) — meilleure lecture de la rotation et de la hauteur |
| Durée maximale | 5 secondes |
| Environnement | Libre (intérieur ou extérieur), condition unique : **sol plat** |

## 2. Deux façons de fournir la vidéo

1. **Filmer en direct dans l'app**
2. **Importer depuis la galerie** (vidéo déjà filmée)

Dans les deux cas, les mêmes consignes de cadrage (portrait, profil, 5 sec max, sol plat) sont affichées **avant** l'action — avant d'ouvrir la caméra, et avant d'ouvrir le sélecteur de galerie.

## 3. Vérification automatique avant envoi

Contrôles techniques basiques appliqués à la vidéo (filmée ou importée) :
- Orientation : rejeter si paysage
- Durée : rejeter si > 5 secondes

→ Si la vidéo ne passe pas ces contrôles, message clair à l'utilisateur expliquant quoi corriger, retour à l'étape de capture/import.

*(Non couvert par la vérification automatique : angle de profil, sol plat, qualité de l'image — repose sur les consignes affichées à l'utilisateur, pas de détection automatique en V1)*

## 4. Étape de confirmation

Après capture ou import, et une fois les vérifications automatiques passées :
- Écran de confirmation simple : aperçu de la vidéo + question "C'est bon ?"
- Deux actions possibles : **Envoyer** / **Refaire** (retour à l'étape de capture/import)

## 5. Limite de soumission

- Un utilisateur ne peut avoir qu'**une seule vidéo en attente de notation à la fois**
- Il doit attendre d'avoir reçu sa note avant de pouvoir soumettre un nouveau salto
- Implication technique : l'app doit vérifier le statut de la dernière soumission de l'utilisateur avant de proposer une nouvelle capture/import (bloquer ou informer si une vidéo est déjà en attente)

## 6. Résumé du flux utilisateur

```
Écran d'accueil
   → Choix : Filmer / Importer depuis galerie
   → Affichage des consignes (portrait, profil, 5 sec, sol plat)
   → Capture ou sélection du fichier
   → Vérification automatique (orientation, durée)
        ✗ échec → message d'erreur → retour capture/import
        ✓ passé → écran de confirmation (aperçu + "C'est bon ?")
   → Refaire → retour capture/import
   → Envoyer → upload vers le cloud → statut "en attente de notation"
```

## Points restant à trancher plus tard (hors V1 immédiate)

- Modalités exactes de la notification quand la note est disponible
- Format exact du visuel de partage (story)
- Vérification automatique plus poussée (détection de l'angle, de la personne dans le cadre) — probablement en V2 avec l'IA
