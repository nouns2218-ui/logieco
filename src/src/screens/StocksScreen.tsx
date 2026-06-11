import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

const CATEGORIES = ["Tous", "Logistique", "Établissements"];
const STOCKS = [
  { id: "1", nom: "Gants de protection", categorie: "Logistique", stock: 240, seuil: 50, unite: "paires" },
  { id: "2", nom: "Gilets haute visibilité", categorie: "Logistique", stock: 30, seuil: 40, unite: "unités" },
  { id: "3", nom: "Détergent sol", categorie: "Établissements", stock: 85, seuil: 20, unite: "litres" },
  { id: "4", nom: "Papier A4", categorie: "Établissements", stock: 500, seuil: 100, unite: "ramettes" },
  { id: "5", nom: "Masques FFP2", categorie: "Logistique", stock: 12, seuil: 50, unite: "boîtes" },
];

export default function StocksScreen() {
  const [categorie, setCategorie] = useState("Tous");
  const filtered = categorie === "Tous" ? STOCKS : STOCKS.filter(s => s.categorie === categorie);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Stocks</Text>
        <Text style={styles.sub}>Logistique centrale & établissements</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
        {CATEGORIES.map(c => (
          <TouchableOpacity key={c} onPress={() => setCategorie(c)} style={[styles.tab, categorie === c && styles.tabActive]}>
            <Text style={[styles.tabText, categorie === c && styles.tabTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView contentContainerStyle={{ padding: 12 }}>
        {filtered.map(item => {
          const pct = Math.round((item.stock / (item.seuil * 3)) * 100);
          const alerte = item.stock < item.seuil;
          return (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardRow}>
                <Text style={styles.nom}>{item.nom}</Text>
                {alerte && <View style={styles.alertBadge}><Text style={styles.alertText}>Stock bas</Text></View>}
              </View>
              <Text style={styles.stock}>{item.stock} {item.unite} · seuil min : {item.seuil}</Text>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: `${Math.min(pct, 100)}%`, backgroundColor: alerte ? "#E24B4A" : "#639922" }]} />
              </View>
              <Text style={styles.cat}>{item.categorie}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F6FA" },
  header: { backgroundColor: "#1A3A5C", padding: 20, paddingTop: 48 },
  title: { color: "#fff", fontSize: 20, fontWeight: "600" },
  sub: { color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 3 },
  tabs: { backgroundColor: "#fff", paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 0.5, borderColor: "#EEE" },
  tab: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginRight: 8, backgroundColor: "#F0F0F0" },
  tabActive: { backgroundColor: "#1A3A5C" },
  tabText: { fontSize: 12, color: "#555" },
  tabTextActive: { color: "#fff" },
  card: { backgroundColor: "#fff", borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 0.5, borderColor: "#E0E0E0" },
  cardRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  nom: { fontSize: 14, fontWeight: "600", color: "#1A3A5C" },
  alertBadge: { backgroundColor: "#FCEBEB", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  alertText: { fontSize: 10, color: "#A32D2D" },
  stock: { fontSize: 12, color: "#666", marginBottom: 8 },
  barBg: { height: 6, backgroundColor: "#EEE", borderRadius: 3, overflow: "hidden" },
  barFill: { height: 6, borderRadius: 3 },
  cat: { fontSize: 10, color: "#AAA", marginTop: 6 },
});
