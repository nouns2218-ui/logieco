$dashboard = @'
import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

const stats = [
  { label: "Bons en attente", value: "14", color: "#E24B4A", icon: "⏳" },
  { label: "Commandes ce mois", value: "63", color: "#1D9E75", icon: "📦" },
  { label: "Établissements", value: "27", color: "#1A3A5C", icon: "🏢" },
  { label: "Fournisseurs", value: "38", color: "#534AB7", icon: "🏪" },
];

const alertes = [
  { label: "Masques FFP2", stock: "8/30", urgent: true },
  { label: "Désinfectant sol", stock: "6/15", urgent: true },
  { label: "Savon mains 5L", stock: "10/12", urgent: false },
];

const modules = [
  { name: "📁 Archives", desc: "Commandes & factures", color: "#E6F1FB", border: "#B8D4F0" },
  { name: "📦 Stocks", desc: "Logistique & établissements", color: "#EAF3DE", border: "#B8DFA8" },
  { name: "📋 Bons de commande", desc: "Créer & suivre", color: "#FAEEDA", border: "#F5CC90" },
  { name: "🪖 Fournisseurs EPI", desc: "EPI & maintenance", color: "#EEEDFE", border: "#C5C2F8" },
  { name: "🧴 Entretien", desc: "Produits d entretien", color: "#E1F5EE", border: "#A8DFC8" },
  { name: "🖨 Bureautique", desc: "Matériel bureau", color: "#FAECE7", border: "#F5C4B0" },
];

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>LogiEco</Text>
          <Text style={styles.sub}>AAPISE · 27 établissements</Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>● En ligne</Text>
        </View>
      </View>

      {/* STATS */}
      <View style={styles.statsGrid}>
        {stats.map((s, i) => (
          <View key={i} style={styles.statCard}>
            <Text style={styles.statIcon}>{s.icon}</Text>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* ALERTES STOCK */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>⚠️ Alertes stock</Text>
          <View style={styles.alertCount}><Text style={styles.alertCountText}>7</Text></View>
        </View>
        {alertes.map((a, i) => (
          <View key={i} style={styles.alerteRow}>
            <View style={[styles.alerteDot, { backgroundColor: a.urgent ? "#E24B4A" : "#F59E0B" }]} />
            <Text style={styles.alerteLabel}>{a.label}</Text>
            <Text style={[styles.alerteStock, { color: a.urgent ? "#E24B4A" : "#F59E0B" }]}>{a.stock}</Text>
          </View>
        ))}
      </View>

      {/* MODULES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accès rapide</Text>
        <View style={styles.modulesGrid}>
          {modules.map((m, i) => (
            <TouchableOpacity key={i} style={[styles.moduleCard, { backgroundColor: m.color, borderColor: m.border }]}>
              <Text style={styles.moduleName}>{m.name}</Text>
              <Text style={styles.moduleDesc}>{m.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* DERNIÈRES ACTIVITÉS */}
      <View style={[styles.section, { marginBottom: 32 }]}>
        <Text style={styles.sectionTitle}>Dernière activité</Text>
        {[
          { ref: "BC-2026-063", etab: "IME La Colline", statut: "En attente", color: "#FAEEDA", textColor: "#854F0B" },
          { ref: "BC-2026-062", etab: "ESAT Horizon", statut: "Validé", color: "#EAF3DE", textColor: "#3B6D11" },
          { ref: "BC-2026-061", etab: "MAS Les Pins", statut: "Livré", color: "#E6F1FB", textColor: "#185FA5" },
        ].map((c, i) => (
          <View key={i} style={styles.activityRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.activityRef}>{c.ref}</Text>
              <Text style={styles.activityEtab}>{c.etab}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: c.color }]}>
              <Text style={[styles.badgeText, { color: c.textColor }]}>{c.statut}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F6FA" },
  header: { backgroundColor: "#1A3A5C", padding: 24, paddingTop: 52, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  logo: { color: "#fff", fontSize: 28, fontWeight: "700", letterSpacing: -0.5 },
  sub: { color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 2 },
  headerBadge: { backgroundColor: "rgba(29,158,117,0.3)", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  headerBadgeText: { color: "#4DFFB8", fontSize: 11, fontWeight: "600" },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", padding: 14, gap: 10 },
  statCard: { backgroundColor: "#fff", borderRadius: 12, padding: 14, width: "47%", borderWidth: 0.5, borderColor: "#E0E0E0", alignItems: "center" },
  statIcon: { fontSize: 22, marginBottom: 6 },
  statValue: { fontSize: 28, fontWeight: "700" },
  statLabel: { fontSize: 10, color: "#888", marginTop: 3, textAlign: "center" },
  section: { paddingHorizontal: 14, marginBottom: 20 },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#1A3A5C", marginBottom: 10 },
  alertCount: { backgroundColor: "#E24B4A", borderRadius: 99, width: 20, height: 20, alignItems: "center", justifyContent: "center", marginLeft: 8, marginBottom: 10 },
  alertCountText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  alerteRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 8, padding: 12, marginBottom: 6, borderWidth: 0.5, borderColor: "#E0E0E0" },
  alerteDot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  alerteLabel: { flex: 1, fontSize: 13, color: "#333" },
  alerteStock: { fontSize: 12, fontWeight: "600" },
  modulesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  moduleCard: { borderRadius: 12, padding: 14, width: "47%", borderWidth: 1 },
  moduleName: { fontSize: 13, fontWeight: "700", color: "#1A3A5C", marginBottom: 3 },
  moduleDesc: { fontSize: 11, color: "#555" },
  activityRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 0.5, borderColor: "#E0E0E0" },
  activityRef: { fontSize: 13, fontWeight: "600", color: "#1A3A5C" },
  activityEtab: { fontSize: 11, color: "#888", marginTop: 2 },
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 10, fontWeight: "700" },
});
'@
Set-Content -Path "C:\Users\DELL\Documents\logieco\logieco\src\src\screens\DashboardScreen.tsx" -Value $dashboard -Encoding UTF8