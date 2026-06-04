import React, { useState } from 'react'
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, ActivityIndicator
} from 'react-native'
import { useBonsDeCommande } from '../hooks/useFournisseurs'
import BadgeStatut from '../components/BadgeStatut'
import { StatutBDC } from '../lib/supabase'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

type Onglet = 'tous' | 'a_valider' | 'envoye'

export default function BonsDeCommandeScreen() {
  const [onglet, setOnglet] = useState<Onglet>('tous')

  const statutFiltre: StatutBDC | undefined =
    onglet === 'a_valider' ? 'a_valider' :
    onglet === 'envoye'    ? 'envoye'    : undefined

  const { bdc, loading, changerStatut } = useBonsDeCommande(statutFiltre)

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {(['tous', 'a_valider', 'envoye'] as Onglet[]).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, onglet === t && styles.tabActive]}
            onPress={() => setOnglet(t)}
          >
            <Text style={[styles.tabText, onglet === t && styles.tabTextActive]}>
              {t === 'tous' ? 'Tous' : t === 'a_valider' ? 'À valider' : 'Envoyés'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color="#1D9E75" />
      ) : (
        <FlatList
          data={bdc}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.numero}>{item.numero}</Text>
                <BadgeStatut statut={item.statut} size="sm" />
              </View>
              <Text style={styles.etablissement}>{item.etablissements?.nom ?? '—'}</Text>
              {item.fournisseurs && (
                <Text style={styles.meta}>Fournisseur : {item.fournisseurs.nom}</Text>
              )}
              <View style={styles.cardFooter}>
                {item.date_besoin && (
                  <Text style={styles.meta}>
                    Besoin le {format(new Date(item.date_besoin), 'dd MMM yyyy', { locale: fr })}
                  </Text>
                )}
                {item.montant_estime != null && (
                  <Text style={styles.montant}>≈ {item.montant_estime.toLocaleString('fr-FR')} €</Text>
                )}
              </View>

              {/* Actions rapides */}
              {item.statut === 'a_valider' && (
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.btn, styles.btnPrimary]}
                    onPress={() => changerStatut(item.id, 'valide')}
                  >
                    <Text style={styles.btnPrimaryText}>Valider</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.btn}
                    onPress={() => changerStatut(item.id, 'brouillon')}
                  >
                    <Text style={styles.btnText}>Renvoyer</Text>
                  </TouchableOpacity>
                </View>
              )}
              {item.statut === 'valide' && (
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.btn, styles.btnPrimary]}
                    onPress={() => changerStatut(item.id, 'envoye')}
                  >
                    <Text style={styles.btnPrimaryText}>Marquer envoyé</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>Aucun bon de commande</Text>}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF9' },
  tabs: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#E0E0DC', backgroundColor: '#fff' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#1D9E75' },
  tabText: { fontSize: 14, color: '#888780' },
  tabTextActive: { color: '#1D9E75', fontWeight: '500' },
  list: { padding: 16, gap: 10 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 14, borderWidth: 0.5, borderColor: '#E0E0DC' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  numero: { fontSize: 14, fontWeight: '500', color: '#2C2C2A' },
  etablissement: { fontSize: 13, color: '#5F5E5A', marginBottom: 4 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  meta: { fontSize: 12, color: '#888780' },
  montant: { fontSize: 13, fontWeight: '500', color: '#2C2C2A' },
  actions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  btn: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 8, borderWidth: 0.5, borderColor: '#E0E0DC',
  },
  btnPrimary: { backgroundColor: '#1D9E75', borderColor: '#1D9E75' },
  btnText: { fontSize: 13, color: '#2C2C2A' },
  btnPrimaryText: { fontSize: 13, color: '#fff', fontWeight: '500' },
  empty: { textAlign: 'center', marginTop: 40, color: '#888780', fontSize: 14 },
})
