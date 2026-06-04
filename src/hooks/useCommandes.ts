import { useEffect, useState } from 'react'
import { supabase, Commande, Facture } from '../lib/supabase'

// ── Commandes archivées ────────────────────────────────

export function useCommandes() {
  const [commandes, setCommandes] = useState<Commande[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    setLoading(true)
    const { data, error } = await supabase
      .from('commandes')
      .select(`
        *,
        etablissements (id, code, nom),
        fournisseurs (id, nom, categorie)
      `)
      .order('date_commande', { ascending: false })

    if (error) setError(error.message)
    else setCommandes(data as Commande[])
    setLoading(false)
  }

  async function creerCommande(payload: Partial<Commande>) {
    const { data, error } = await supabase
      .from('commandes')
      .insert([payload])
      .select()
      .single()

    if (error) throw new Error(error.message)
    setCommandes((prev) => [data as Commande, ...prev])
    return data as Commande
  }

  async function mettreAJourStatut(id: string, statut: Commande['statut']) {
    const { error } = await supabase
      .from('commandes')
      .update({ statut })
      .eq('id', id)

    if (error) throw new Error(error.message)
    setCommandes((prev) =>
      prev.map((c) => (c.id === id ? { ...c, statut } : c))
    )
  }

  useEffect(() => { fetch() }, [])

  return { commandes, loading, error, refetch: fetch, creerCommande, mettreAJourStatut }
}

// ── Factures ───────────────────────────────────────────

export function useFactures() {
  const [factures, setFactures] = useState<Facture[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    setLoading(true)
    const { data, error } = await supabase
      .from('factures')
      .select(`
        *,
        etablissements (id, code, nom),
        fournisseurs (id, nom, categorie)
      `)
      .order('date_facture', { ascending: false })

    if (error) setError(error.message)
    else setFactures(data as Facture[])
    setLoading(false)
  }

  useEffect(() => { fetch() }, [])

  return { factures, loading, error, refetch: fetch }
}
