import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

const CATEGORIES = [
  { key: "epi", label: "EPI & Maintenance", color: "#EEEDFE", textColor: "#534AB7" },
  { key: "entretien", label: "Produits entretien", color: "#E1F5EE", textColor: "#0F6E56" },
  { key: "bureautique", label: "Bureautique", color: "#FAECE7", textColor: "#993C1D" },
];

const FOURNISSEURS = {
  epi: [
    { id: "1", nom: "SafetyPro France", contact: "contact@safetypro.fr", tel: "01 23 45 67 89", produits: "Gants, casques, gilets, harnais" },
    { id: "2", nom: "Maintenance Expert", contact: "info@maintenanceexpert.fr", tel: "04 56 78 90 12", produits: "Outillage, pièces détachées" },
    { id: "3", nom: "EPI Direct", contact: "commande@epidirect.fr", tel: "03 11 22 33 44", produits: "EPI complet, formation sécurité" },
  ],
  entretien: [
    { id: "4", nom: "CleanPro Solutions", contact: "pro@cleanpro.fr", tel: "02 34 56 78 90", produits: "Détergents, désinfectants, balais" },
    { id: "5", nom: "Hygiène & Co", contact: "hygiene@co.fr", tel: "05 67 89 01 23", produits: "Papier hygiénique, savon, poubelles" },
  ],
  bureautique: [
    { id: "6", nom: "OfficeMax Pro", contact: "pro@officemax.fr", tel: "01 99 88 77 66", produits: "Papier, stylos, classeurs, enveloppes" },
    { id: "7", nom: "TechSupply", contact: "commande@techsupply.fr", tel: "04 44 33 22 11", produits: "Imprimantes, cartouches, câbles" },
  ],
};

export default function FournisseursScreen() {
  const [categorie, setCategorie] = useState("epi");
  const cat = CATEGORIES.find(c => c.key === categorie);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fournisseurs</Text>
        <Text style={styles.sub}>3 catégories</Text>
      </View>
      <View style={styles.tabs}>
        {CATEGORIES.map(c => (
          <TouchableOpacity key={c.key} onPress={() => setCategorie(c.key)} style={[styles.tab, categorie === c.key && { backgroundColor: c.color }]}>
            <Text style={[styles.tabText, categorie === c.key && { color: c.textColor, fontWeight: "600" }]}>{c.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView contentContainerStyle={{ padding: 12 }}>
        {FOURNISSEURS[categorie].map(f => (
          <View key={f.id} style={styles.card}>
            <View style={[styles.avatar, { backgroundColor: cat.color }]}>
              <Text style={[styles.avatarText, { color: cat.textColor }]}>{f.nom.substring(0, 2).toUpperCase()}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.nom}>{f.nom}</Text>
              <Text style={styles.contact}>{f.contact}</Text>
              <Text style={styles.tel}>{f.tel}</Text>
              <Text style={styles.produits}>{f.produits}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F6FA" },
  header: { backgroundColor: "#1A3A5C", padding: 20, paddingTop: 48 },
  title: { color: "#fff", fontSize: 20, fontWeight: "600" },
  sub: { color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 3 },
  tabs: { flexDirection: "row", backgroundColor: "#fff", borderBottomWidth: 0.5, borderColor: "#EEE" },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center" },
  tabText: { fontSize: 11, color: "#888", textAlign: "center" },
  card: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 0.5, borderColor: "#E0E0E0", gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  avatarText: { fontSize: 14, fontWeight: "600" },
  info: { flex: 1 },
  nom: { fontSize: 14, fontWeight: "600", color: "#1A3A5C", marginBottom: 2 },
  contact: { fontSize: 12, color: "#4DA8DA", marginBottom: 2 },
  tel: { fontSize: 12, color: "#666", marginBottom: 4 },
  produits: { fontSize: 11, color: "#999" },
});
