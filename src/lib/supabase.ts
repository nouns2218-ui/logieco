import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import 'react-native-url-polyfill/auto'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// ============================================
// Types TypeScript (générés depuis le schéma)
// ============================================

export type Etablissement = {
  id: string
  code: string
  nom: string
  adresse?: string
  responsable?: string
  telephone?: string
  email?: string
  created_at: string
}

export type CategoriesFournisseur = 'EPI' | 'MAINTENANCE' | 'ENTRETIEN' | 'BUREAUTIQUE'

export type Fournisseur = {
  id: string
  nom: string
  categorie: CategoriesFournisseur
  contact_nom?: string
  contact_email?: string
  contact_tel?: string
  delai_livraison?: number
  contrat?: string
  statut: 'actif' | 'inactif' | 'consultation'
  created_at: string
}

export type StatutCommande = 'en_cours' | 'livre' | 'archive' | 'annule'

export type Commande = {
  id: string
  numero: string
  etablissement_id: string
  fournisseur_id: string
  date_commande: string
  date_livraison?: string
  montant_ht?: number
  montant_ttc?: number
  statut: StatutCommande
  notes?: string
  created_at: string
  // Relations (jointures)
  etablissements?: Etablissement
  fournisseurs?: Fournisseur
}

export type StatutFacture = 'en_attente' | 'payee' | 'litige' | 'archive'

export type Facture = {
  id: string
  numero: string
  commande_id?: string
  fournisseur_id: string
  etablissement_id: string
  date_facture: string
  date_echeance?: string
  montant_ht?: number
  montant_ttc?: number
  statut: StatutFacture
  created_at: string
  etablissements?: Etablissement
  fournisseurs?: Fournisseur
}

export type StatutBDC = 'brouillon' | 'a_valider' | 'valide' | 'envoye' | 'cloture'

export type BonDeCommande = {
  id: string
  numero: string
  etablissement_id: string
  fournisseur_id?: string
  date_besoin?: string
  montant_estime?: number
  statut: StatutBDC
  notes?: string
  created_at: string
  updated_at: string
  etablissements?: Etablissement
  fournisseurs?: Fournisseur
  lignes_bdc?: LigneBDC[]
}

export type LigneBDC = {
  id: string
  bdc_id: string
  reference?: string
  designation: string
  quantite: number
  prix_unitaire?: number
}

export type Article = {
  id: string
  reference: string
  designation: string
  categorie: 'EPI' | 'MAINTENANCE' | 'ENTRETIEN' | 'BUREAUTIQUE' | 'AUTRE'
  fournisseur_id?: string
  prix_unitaire?: number
  unite: string
  created_at: string
}

export type StockLogistique = {
  id: string
  article_id: string
  quantite: number
  seuil_alerte: number
  emplacement?: string
  updated_at: string
  articles?: Article
}

export type AlerteStock = {
  reference: string
  designation: string
  categorie: string
  quantite: number
  seuil_alerte: number
  emplacement?: string
  en_alerte: boolean
}
