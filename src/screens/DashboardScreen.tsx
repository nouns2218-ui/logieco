import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

const stats = [
  { label: "Bons en attente", value: "14", color: "#E24B4A" },
  { label: "Commandes ce mois", value: "63", color: "#1D9E75" },
  { label: "Etablissements", value: "27", color: "#1A3A5C" },
  { label: "Fournisseurs", value: "38", color: "#534AB7" },
];

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>LOGIECO</Text>
        <Text style={styles.sub}>AAPISE · 27 etablissements</Text>
      </View>
      <View style={styles.grid}>
        {stats.map((s, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.label}>{s.label}</Text>
            <Text style={[styles.value, { color: s.color }]}>{s.value}</Text>
          </View>
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
  grid: { flexDirection: "row", flexWrap: "wrap", padding: 12, gap: 10 },
  card: { backgroundColor: "#fff", borderRadius: 10, padding: 14, width: "47%", borderWidth: 0.5, borderColor: "#E0E0E0" },
  label: { fontSize: 11, color: "#888", marginBottom: 4 },
  value: { fontSize: 26, fontWeight: "600" },
});
