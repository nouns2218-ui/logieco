import { useEffect, useState } from 'react'
import { supabase, Fournisseur, CategoriesFournisseur, BonDeCommande, StatutBDC } from '../lib/supabase'
import { alertes } from '../lib/firebase'

// ── Fournisseurs ───────────────────────────────────────

export function useFournisseurs(categorie?: CategoriesFournisseur) {
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    setLoading(true)
    let query = supabase
      .from('fournisseurs')
      .select('*')
      .order('nom')

    if (categorie) query = query.eq('categorie', categorie)

    const { data, error } = await query
    if (error) setError(error.message)
    else setFournisseurs(data as Fournisseur[])
    setLoading(false)
  }

  async function ajouterFournisseur(payload: Omit<Fournisseur, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('fournisseurs')
      .insert([payload])
      .select()
      .single()

    if (error) throw new Error(error.message)
    setFournisseurs((prev) => [...prev, data as Fournisseur].sort((a, b) => a.nom.localeCompare(b.nom)))
    return data as Fournisseur
  }

  useEffect(() => { fetch() }, [categorie])

  return { fournisseurs, loading, error, refetch: fetch, ajouterFournisseur }
}

// ── Bons de commande ───────────────────────────────────

export function useBonsDeCommande(statut?: StatutBDC) {
  const [bdc, setBdc] = useState<BonDeCommande[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    setLoading(true)
    let query = supabase
      .from('bons_de_commande')
      .select(`
        *,
        etablissements (id, code, nom),
        fournisseurs (id, nom),
        lignes_bdc (*)
      `)
      .order('created_at', { ascending: false })

    if (statut) query = query.eq('statut', statut)

    const { data, error } = await query
    if (error) setError(error.message)
    else setBdc(data as BonDeCommande[])
    setLoading(false)
  }

  async function creerBDC(payload: Partial<BonDeCommande>) {
    const numero = `BDC-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`
    const { data, error } = await supabase
      .from('bons_de_commande')
      .insert([{ ...payload, numero }])
      .select()
      .single()

    if (error) throw new Error(error.message)

    // Notifier via Firebase
    if (data && payload.etablissements?.nom) {
      alertes.bdcAValider(numero, payload.etablissements.nom)
    }

    setBdc((prev) => [data as BonDeCommande, ...prev])
    return data as BonDeCommande
  }

  async function changerStatut(id: string, statut: StatutBDC) {
    const { error } = await supabase
      .from('bons_de_commande')
      .update({ statut, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw new Error(error.message)
    setBdc((prev) => prev.map((b) => (b.id === id ? { ...b, statut } : b)))
  }

  async function ajouterLigne(bdcId: string, ligne: { designation: string; quantite: number; reference?: string; prix_unitaire?: number }) {
    const { error } = await supabase
      .from('lignes_bdc')
      .insert([{ bdc_id: bdcId, ...ligne }])

    if (error) throw new Error(error.message)
    fetch() // Recharger pour récupérer les lignes à jour
  }

  useEffect(() => { fetch() }, [statut])

  return { bdc, loading, error, refetch: fetch, creerBDC, changerStatut, ajouterLigne }
}
