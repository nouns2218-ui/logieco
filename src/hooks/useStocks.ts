import { useEffect, useState } from 'react'
import { supabase, StockLogistique, AlerteStock } from '../lib/supabase'
import { alertes } from '../lib/firebase'

// ── Stock logistique central ───────────────────────────

export function useStockLogistique() {
  const [stocks, setStocks] = useState<StockLogistique[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetch() {
    setLoading(true)
    const { data, error } = await supabase
      .from('stock_logistique')
      .select(`
        *,
        articles (id, reference, designation, categorie, unite)
      `)
      .order('updated_at', { ascending: false })

    if (error) { setError(error.message); setLoading(false); return }
    const result = data as StockLogistique[]
    setStocks(result)

    // Déclencher alertes Firebase pour les articles sous seuil
    result
      .filter((s) => s.quantite <= s.seuil_alerte)
      .forEach((s) => {
        if (s.articles) {
          alertes.stockBas(s.articles.designation, s.quantite, s.seuil_alerte)
        }
      })

    setLoading(false)
  }

  async function mettreAJourQuantite(id: string, quantite: number) {
    const { error } = await supabase
      .from('stock_logistique')
      .update({ quantite, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw new Error(error.message)
    setStocks((prev) => prev.map((s) => (s.id === id ? { ...s, quantite } : s)))
  }

  useEffect(() => { fetch() }, [])

  return { stocks, loading, error, refetch: fetch, mettreAJourQuantite }
}

// ── Vue alertes stock ──────────────────────────────────

export function useAlertesStock() {
  const [alertesStock, setAlertesStock] = useState<AlerteStock[]>([])
  const [loading, setLoading] = useState(true)

  async function fetch() {
    setLoading(true)
    const { data, error } = await supabase
      .from('v_alertes_stock')
      .select('*')
      .eq('en_alerte', true)

    if (!error) setAlertesStock(data as AlerteStock[])
    setLoading(false)
  }

  useEffect(() => { fetch() }, [])

  return { alertesStock, loading, refetch: fetch }
}

// ── Stock par établissement ────────────────────────────

export function useStockEtablissement(etablissementId?: string) {
  const [stocks, setStocks] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  async function fetch(id: string) {
    setLoading(true)
    const { data, error } = await supabase
      .from('stock_etablissements')
      .select(`
        *,
        articles (id, reference, designation, categorie, unite)
      `)
      .eq('etablissement_id', id)

    if (!error) setStocks(data)
    setLoading(false)
  }

  useEffect(() => {
    if (etablissementId) fetch(etablissementId)
  }, [etablissementId])

  return { stocks, loading, refetch: fetch }
}
