import React, { useState } from 'react'
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, ActivityIndicator, RefreshControl
} from 'react-native'
import { useCommandes, useFactures } from '../hooks/useCommandes'
import BadgeStatut from '../components/BadgeStatut'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

type Onglet = 'commandes' | 'factures'

export default function ArchivesScreen() {
  const [onglet, setOnglet] = useState<Onglet>('commandes')
  const { commandes, loading: lC, refetch: rC } = useCommandes()
  const { factures, loading: lF, refetch: rF } = useFactures()

  const loading = onglet === 'commandes' ? lC : lF
  const refetch = onglet === 'commandes' ? rC : rF

  return (
    <View style={styles.container}>
      {/* Onglets */}
      <View style={styles.tabs}>
        {(['commandes', 'factures'] as Onglet[]).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, onglet === t && styles.tabActive]}
            onPress={() => setOnglet(t)}
          >
            <Text style={[styles.tabText, onglet === t && styles.tabTextActive]}>
              {t === 'commandes' ? 'Commandes' : 'Factures'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color="#1D9E75" />
      ) : onglet === 'commandes' ? (
        <FlatList
          data={commandes}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={false} onRefresh={rC} />}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.numero}>{item.numero}</Text>
                <BadgeStatut statut={item.statut} size="sm" />
              </View>
              <Text style={styles.etablissement}>
                {item.etablissements?.nom ?? '—'}
              </Text>
              <View style={styles.cardFooter}>
                <Text style={styles.meta}>
                  {item.fournisseurs?.nom ?? '—'} ·{' '}
                  {format(new Date(item.date_commande), 'dd MMM yyyy', { locale: fr })}
                </Text>
                {item.montant_ttc != null && (
                  <Text style={styles.montant}>
                    {item.montant_ttc.toLocaleString('fr-FR')} €
                  </Text>
                )}
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>Aucune commande archivée</Text>}
        />
      ) : (
        <FlatList
          data={factures}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={false} onRefresh={rF} />}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.numero}>{item.numero}</Text>
                <BadgeStatut statut={item.statut} size="sm" />
              </View>
              <Text style={styles.etablissement}>
                {item.etablissements?.nom ?? '—'}
              </Text>
              <View style={styles.cardFooter}>
                <Text style={styles.meta}>
                  {item.fournisseurs?.nom ?? '—'} ·{' '}
                  {format(new Date(item.date_facture), 'dd MMM yyyy', { locale: fr })}
                </Text>
                {item.montant_ht != null && (
                  <Text style={styles.montant}>
                    {item.montant_ht.toLocaleString('fr-FR')} € HT
                  </Text>
                )}
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>Aucune facture</Text>}
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    borderWidth: 0.5,
    borderColor: '#E0E0DC',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  numero: { fontSize: 14, fontWeight: '500', color: '#2C2C2A' },
  etablissement: { fontSize: 13, color: '#5F5E5A', marginBottom: 8 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  meta: { fontSize: 12, color: '#888780' },
  montant: { fontSize: 13, fontWeight: '500', color: '#2C2C2A' },
  empty: { textAlign: 'center', marginTop: 40, color: '#888780', fontSize: 14 },
})
