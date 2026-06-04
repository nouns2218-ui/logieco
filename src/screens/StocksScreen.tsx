import React, { useState } from 'react'
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, ActivityIndicator
} from 'react-native'
import { useStockLogistique, useStockEtablissement } from '../hooks/useStocks'
import BadgeStatut from '../components/BadgeStatut'

type Onglet = 'logistique' | 'etablissements'

function AlerteBadge({ quantite, seuil }: { quantite: number; seuil: number }) {
  const alerte = quantite <= seuil
  return (
    <View style={[styles.alertBadge, { backgroundColor: alerte ? '#FAEEDA' : '#E1F5EE' }]}>
      <Text style={[styles.alertText, { color: alerte ? '#854F0B' : '#0F6E56' }]}>
        {alerte ? '⚠ Alerte' : '✓ OK'}
      </Text>
    </View>
  )
}

export default function StocksScreen() {
  const [onglet, setOnglet] = useState<Onglet>('logistique')
  const { stocks, loading } = useStockLogistique()

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {(['logistique', 'etablissements'] as Onglet[]).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, onglet === t && styles.tabActive]}
            onPress={() => setOnglet(t)}
          >
            <Text style={[styles.tabText, onglet === t && styles.tabTextActive]}>
              {t === 'logistique' ? 'Entrepôt central' : 'Établissements'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {onglet === 'logistique' && (
        <>
          {/* Résumé alertes */}
          {!loading && (
            <View style={styles.alertBanner}>
              <Text style={styles.alertBannerText}>
                {stocks.filter((s) => s.quantite <= s.seuil_alerte).length} article(s) sous le seuil
              </Text>
            </View>
          )}

          {loading ? (
            <ActivityIndicator style={{ marginTop: 40 }} color="#1D9E75" />
          ) : (
            <FlatList
              data={stocks}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.reference}>{item.articles?.reference}</Text>
                      <Text style={styles.designation}>{item.articles?.designation}</Text>
                    </View>
                    <AlerteBadge quantite={item.quantite} seuil={item.seuil_alerte} />
                  </View>
                  <View style={styles.cardFooter}>
                    <Text style={styles.meta}>Catégorie : {item.articles?.categorie}</Text>
                    <Text style={styles.quantiteText}>
                      <Text style={[styles.quantiteNum, item.quantite <= item.seuil_alerte && { color: '#854F0B' }]}>
                        {item.quantite}
                      </Text>
                      {' '}/ seuil {item.seuil_alerte} {item.articles?.unite}
                    </Text>
                  </View>
                  {item.emplacement && (
                    <Text style={styles.emplacement}>📍 {item.emplacement}</Text>
                  )}
                </View>
              )}
              ListEmptyComponent={<Text style={styles.empty}>Aucun article en stock</Text>}
            />
          )}
        </>
      )}

      {onglet === 'etablissements' && (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Sélectionner un établissement pour voir son inventaire
          </Text>
          {/* TODO: Picker établissements + useStockEtablissement(id) */}
        </View>
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
  alertBanner: {
    backgroundColor: '#FAEEDA', padding: 10, paddingHorizontal: 16,
    borderBottomWidth: 0.5, borderBottomColor: '#FAC775',
  },
  alertBannerText: { fontSize: 13, color: '#854F0B', fontWeight: '500' },
  list: { padding: 16, gap: 10 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 14, borderWidth: 0.5, borderColor: '#E0E0DC' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  reference: { fontSize: 12, color: '#888780', marginBottom: 2 },
  designation: { fontSize: 14, fontWeight: '500', color: '#2C2C2A' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  meta: { fontSize: 12, color: '#888780' },
  quantiteText: { fontSize: 12, color: '#5F5E5A' },
  quantiteNum: { fontSize: 14, fontWeight: '500', color: '#1D9E75' },
  emplacement: { fontSize: 12, color: '#888780', marginTop: 6 },
  alertBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  alertText: { fontSize: 11, fontWeight: '500' },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  placeholderText: { fontSize: 14, color: '#888780', textAlign: 'center' },
  empty: { textAlign: 'center', marginTop: 40, color: '#888780', fontSize: 14 },
})
