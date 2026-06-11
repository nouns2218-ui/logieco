import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

const stats = [
  { label: "Bons en attente", value: "14", color: "#E24B4A" },
  { label: "Commandes ce mois", value: "63", color: "#639922" },
  { label: "Établissements", value: "27", color: "#1A3A5C" },
  { label: "Fournisseurs", value: "38", color: "#534AB7" },
];

const modules = [
  { name: "Archives", desc: "Commandes & factures", color: "#E6F1FB" },
  { name: "Stocks", desc: "Logistique & établissements", color: "#EAF3DE" },
  { name: "Bons de commande", desc: "Commandes en cours", color: "#FAEEDA" },
  { name: "Fournisseurs EPI", desc: "EPI & maintenance", color: "#EEEDFE" },
  { name: "Entretien", desc: "Produits d entretien", color: "#E1F5EE" },
  { name: "Bureautique", desc: "Matériel bureau", color: "#FAECE7" },
];

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>LOGIECO</Text>
        <Text style={styles.sub}>AAPISE · 27 établissements</Text>
      </View>
      <View style={styles.statsGrid}>
        {stats.map((s, i) => (
          <View key={i} style={styles.statCard}>
            <Text style={styles.statLabel}>{s.label}</Text>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.sectionTitle}>Modules</Text>
      <View style={styles.modulesGrid}>
        {modules.map((m, i) => (
          <TouchableOpacity key={i} style={[styles.moduleCard, { backgroundColor: m.color }]}>
            <Text style={styles.moduleName}>{m.name}</Text>
            <Text style={styles.moduleDesc}>{m.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F6FA" },
  header: { backgroundColor: "#1A3A5C", padding: 24, paddingTop: 48 },
  logo: { color: "#fff", fontSize: 24, fontWeight: "600", letterSpacing: 2 },
  sub: { color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 4 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", padding: 12, gap: 10 },
  statCard: { backgroundColor: "#fff", borderRadius: 10, padding: 14, width: "47%", borderWidth: 0.5, borderColor: "#E0E0E0" },
  statLabel: { fontSize: 11, color: "#888", marginBottom: 4 },
  statValue: { fontSize: 26, fontWeight: "600" },
  sectionTitle: { fontSize: 13, fontWeight: "600", color: "#1A3A5C", paddingHorizontal: 16, marginBottom: 8 },
  modulesGrid: { flexDirection: "row", flexWrap: "wrap", padding: 12, gap: 10 },
  moduleCard: { borderRadius: 12, padding: 14, width: "47%" },
  moduleName: { fontSize: 13, fontWeight: "600", color: "#1A3A5C", marginBottom: 3 },
  moduleDesc: { fontSize: 11, color: "#555" },
});
