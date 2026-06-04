import React, { useState } from 'react'
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, ActivityIndicator, Linking
} from 'react-native'
import { useFournisseurs } from '../hooks/useFournisseurs'
import { CategoriesFournisseur } from '../lib/supabase'

type Onglet = CategoriesFournisseur

const ONGLETS: { key: Onglet; label: string }[] = [
  { key: 'EPI',         label: 'EPI & Maint.' },
  { key: 'ENTRETIEN',   label: 'Entretien' },
  { key: 'BUREAUTIQUE', label: 'Bureautique' },
]

function StatutDot({ statut }: { statut: string }) {
  const color = statut === 'actif' ? '#1D9E75' : statut === 'consultation' ? '#185FA5' : '#888780'
  return <View style={[styles.dot, { backgroundColor: color }]} />
}

export default function FournisseursScreen() {
  const [onglet, setOnglet] = useState<Onglet>('EPI')
  const { fournisseurs, loading } = useFournisseurs(onglet)

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {ONGLETS.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, onglet === t.key && styles.tabActive]}
            onPress={() => setOnglet(t.key)}
          >
            <Text style={[styles.tabText, onglet === t.key && styles.tabTextActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color="#1D9E75" />
      ) : (
        <FlatList
          data={fournisseurs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <StatutDot statut={item.statut} />
                  <Text style={styles.nom}>{item.nom}</Text>
                </View>
                {item.delai_livraison && (
                  <Text style={styles.delai}>{item.delai_livraison} j</Text>
                )}
              </View>

              {item.contrat && (
                <Text style={styles.contrat}>{item.contrat}</Text>
              )}

              <View style={styles.contacts}>
                {item.contact_nom && (
                  <Text style={styles.contactText}>👤 {item.contact_nom}</Text>
                )}
                {item.contact_email && (
                  <TouchableOpacity onPress={() => Linking.openURL(`mailto:${item.contact_email}`)}>
                    <Text style={[styles.contactText, styles.link]}>✉ {item.contact_email}</Text>
                  </TouchableOpacity>
                )}
                {item.contact_tel && (
                  <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.contact_tel}`)}>
                    <Text style={[styles.contactText, styles.link]}>📞 {item.contact_tel}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>Aucun fournisseur dans cette catégorie</Text>}
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
  tabText: { fontSize: 13, color: '#888780' },
  tabTextActive: { color: '#1D9E75', fontWeight: '500' },
  list: { padding: 16, gap: 10 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 14, borderWidth: 0.5, borderColor: '#E0E0DC' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  nom: { fontSize: 15, fontWeight: '500', color: '#2C2C2A' },
  delai: { fontSize: 12, color: '#888780', backgroundColor: '#F1EFE8', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99 },
  contrat: { fontSize: 12, color: '#888780', marginBottom: 8 },
  contacts: { gap: 3, marginTop: 8 },
  contactText: { fontSize: 12, color: '#5F5E5A' },
  link: { color: '#185FA5' },
  dot: { width: 8, height: 8, borderRadius: 4 },
  empty: { textAlign: 'center', marginTop: 40, color: '#888780', fontSize: 14 },
})
