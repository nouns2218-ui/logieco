import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from "react-native";

const ARCHIVES = [
  { id: "1", ref: "FAC-2026-063", etab: "Étab. Marseille", type: "Facture", date: "03/06/2026", statut: "Archivé" },
  { id: "2", ref: "BC-2026-062", etab: "Étab. Lyon", type: "Bon de commande", date: "01/06/2026", statut: "Archivé" },
  { id: "3", ref: "FAC-2026-061", etab: "Étab. Paris 12", type: "Facture", date: "29/05/2026", statut: "Archivé" },
  { id: "4", ref: "BC-2026-060", etab: "Étab. Bordeaux", type: "Bon de commande", date: "27/05/2026", statut: "Archivé" },
  { id: "5", ref: "FAC-2026-059", etab: "Étab. Nice", type: "Facture", date: "25/05/2026", statut: "Archivé" },
];

export default function ArchivesScreen() {
  const [search, setSearch] = useState("");
  const filtered = ARCHIVES.filter(a =>
    a.ref.toLowerCase().includes(search.toLowerCase()) ||
    a.etab.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Archives</Text>
        <Text style={styles.sub}>Commandes & factures des 27 établissements</Text>
      </View>
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Rechercher par référence ou établissement..."
          value={search}
          onChangeText={setSearch}
          style={styles.input}
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Text style={styles.ref}>{item.ref}</Text>
              <View style={styles.badge}><Text style={styles.badgeText}>{item.type}</Text></View>
            </View>
            <Text style={styles.etab}>{item.etab}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F6FA" },
  header: { backgroundColor: "#1A3A5C", padding: 20, paddingTop: 48 },
  title: { color: "#fff", fontSize: 20, fontWeight: "600" },
  sub: { color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 3 },
  searchBar: { padding: 12 },
  input: { backgroundColor: "#fff", borderRadius: 8, padding: 10, fontSize: 13, borderWidth: 0.5, borderColor: "#DDD" },
  card: { backgroundColor: "#fff", borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 0.5, borderColor: "#E0E0E0" },
  cardRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  ref: { fontSize: 14, fontWeight: "600", color: "#1A3A5C" },
  badge: { backgroundColor: "#E6F1FB", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontSize: 10, color: "#185FA5" },
  etab: { fontSize: 12, color: "#555" },
  date: { fontSize: 11, color: "#AAA", marginTop: 3 },
});
