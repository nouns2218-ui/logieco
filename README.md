# LogiEco — AAPISE Logistics App

Stack : Expo (React Native) + React Web · Supabase · Firebase

## Structure

```
logieco/
├── src/
│   ├── screens/          # Écrans Expo (mobile)
│   │   ├── ArchivesScreen.tsx
│   │   ├── StocksScreen.tsx
│   │   ├── BonsDeCommandeScreen.tsx
│   │   └── FournisseursScreen.tsx
│   ├── components/       # Composants partagés
│   │   ├── BadgeStatut.tsx
│   │   ├── TableauCommandes.tsx
│   │   └── StockCard.tsx
│   ├── lib/
│   │   ├── supabase.ts   # Client Supabase
│   │   └── firebase.ts   # Client Firebase
│   ├── hooks/
│   │   ├── useCommandes.ts
│   │   ├── useStocks.ts
│   │   └── useFournisseurs.ts
│   └── navigation/
│       └── AppNavigator.tsx
├── supabase/
│   └── schema.sql        # Schéma BDD complet
├── app.json
├── package.json
└── .env.example
```

## Setup

```bash
npm install
cp .env.example .env
# Remplir les clés Supabase + Firebase dans .env
npx expo start
```

## Modules

| Module | BDD | Description |
|---|---|---|
| Archives | Supabase | Commandes & factures historiques (27 établissements) |
| Bons de commande | Supabase | BDC en cours, à valider, envoyés |
| Stocks | Supabase | Stock logistique central + stock par établissement |
| Fournisseurs | Supabase | EPI/Maintenance · Entretien · Bureautique |
| Notifications | Firebase | Alertes stock bas, BDC à valider |
