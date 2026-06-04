import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
}

// Éviter la double initialisation avec Expo HMR
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const db = getFirestore(app)

// ============================================
// Types notifications
// ============================================

export type TypeNotification = 
  | 'alerte_stock'      // Stock sous le seuil
  | 'bdc_a_valider'     // BDC en attente de validation logistique
  | 'livraison_prevue'  // Livraison attendue ce jour
  | 'facture_echeance'  // Facture à payer bientôt

export type Notification = {
  id?: string
  type: TypeNotification
  titre: string
  message: string
  lien_id?: string          // id de la ressource concernée
  lu: boolean
  created_at: Timestamp
}

// ============================================
// Helpers Firebase
// ============================================

/** Ajoute une notification dans Firestore */
export async function pushNotification(notif: Omit<Notification, 'id' | 'created_at' | 'lu'>) {
  await addDoc(collection(db, 'notifications'), {
    ...notif,
    lu: false,
    created_at: Timestamp.now(),
  })
}

/** Écoute les notifications en temps réel */
export function onNotifications(callback: (notifs: Notification[]) => void) {
  const q = query(
    collection(db, 'notifications'),
    orderBy('created_at', 'desc')
  )
  return onSnapshot(q, (snapshot) => {
    const notifs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Notification[]
    callback(notifs)
  })
}

/** Helpers pour déclencher des alertes depuis n'importe où dans l'app */
export const alertes = {
  stockBas: (designation: string, quantite: number, seuil: number) =>
    pushNotification({
      type: 'alerte_stock',
      titre: 'Stock bas',
      message: `${designation} : ${quantite} restant(s) (seuil : ${seuil})`,
    }),

  bdcAValider: (numero: string, etablissement: string) =>
    pushNotification({
      type: 'bdc_a_valider',
      titre: 'BDC à valider',
      message: `${numero} de ${etablissement} attend une validation logistique`,
      lien_id: numero,
    }),

  factureEcheance: (numero: string, fournisseur: string, echeance: string) =>
    pushNotification({
      type: 'facture_echeance',
      titre: 'Facture à régler',
      message: `Facture ${numero} (${fournisseur}) — échéance le ${echeance}`,
      lien_id: numero,
    }),
}
