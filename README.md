# RailQual v4 — Contrôle Qualité Ferroviaire

Application de gestion qualité pour chantiers ferroviaires RATP.

## Structure du projet

```
railqual/
├── index.html    # Structure HTML (706 lignes)
├── styles.css    # Design system "Signal" — thèmes, composants (~5 700 lignes)
├── app.js        # Logique métier, données, rendu (~3 900 lignes)
└── README.md
```

## Utilisation

Ouvrir `index.html` directement dans un navigateur — aucune dépendance serveur requise.  
Les données sont persistées en `localStorage`.

> ⚠️ Le fichier `app.js` utilise `localStorage` pour sauvegarder les projets, thèmes et préférences utilisateur. Pour un déploiement GitHub Pages, aucune configuration supplémentaire n'est nécessaire.

## Déploiement GitHub Pages

1. Pousser les fichiers sur votre dépôt GitHub
2. Aller dans **Settings → Pages**
3. Choisir la branche `main` / dossier racine `/`
4. L'app sera accessible sur `https://<user>.github.io/<repo>/`

## Fonctionnalités

- Gestion de projets ferroviaires (phases, zones, voies)
- Fiches FCQ (Fiche de Contrôle Qualité) avec statuts C / NC / Attente
- Suivi PK (point kilométrique) et couverture de voie
- Pièces jointes (images, PDF) intégrées en base64
- Synoptique général avec vue par zone
- Import CSV / XLSX de plan de contrôle
- 8 thèmes visuels (Light, Dark, Midnight, Copper, Forest, Sand, RATP, Vercel)
- Mode hors-ligne via Service Worker inline

## Auteur

LOKONON Godfree Samir
