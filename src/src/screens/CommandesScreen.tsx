import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView } from "react-native";

const ETABLISSEMENTS = ["Étab. Marseille","Étab. Lyon","Étab. Paris 12","Étab. Bordeaux","Étab. Nice","Étab. Toulouse","Étab. Nantes"];
const INITIAL = [
  { id: "1", ref: "BC-2026-063", etab: "Étab. Marseille", article: "Gants de protection x50", statut: "En attente", date: "03/06/2026" },
  { id: "2", ref: "BC-2026-062", etab: "Étab. Lyon", article: "Détergent sol x10L", statut: "Validé", date: "01/06/2026" },
  { id: "3", ref: "BC-2026-061", etab: "Étab. Paris 12", article: "Papier A4 x20 ramettes", statut: "Livré", date: "29/05/2026" },
  { id: "4", ref: "BC-2026-060", etab: "Étab. Bordeaux", article: "Masques FFP2 x5 boîtes", statut: "Urgent", date: "27/05/2026" },
];
const STATUT_COLOR = { "En attente": "#FAEEDA", "Validé": "#EAF3DE", "Livré": "#E6F1FB", "Urgent": "#FCEBEB" };
const STATUT_TEXT = { "En attente": "#854F0B", "Validé": "#3B6D11", "Livré": "#185FA5", "Urgent": "#A32D2D" };

export default function CommandesScreen() {
  const [commandes, setCommandes] = useState(INITIAL);
  const [modal, setModal] = useState(false);
  const [etab, setEtab] = useState("");
  const [article, setArticle] = useState("");

  const ajouter = () => {
    if (!etab || !article) return;
    const newId = String(commandes.length + 1);
    const newRef = `BC-2026-0${64 + commandes.length}`;
    const today = new Date().toLocaleDateString("fr-FR");
    setCommandes([{ id: newId, ref: newRef, etab, article, statut: "En attente", date: today }, ...commandes]);
    setModal(false); setEtab(""); setArticle("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bons de commande</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModal(true)}>
          <Text style={styles.addBtnText}>+ Nouveau</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={commandes}
        keyExtractor={i => i.id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.ref}>{item.ref}</Text>
              <View style={[styles.badge, { backgroundColor: STATUT_COLOR[item.statut] }]}>
                <Text style={[styles.badgeText, { color: STATUT_TEXT[item.statut] }]}>{item.statut}</Text>
              </View>
            </View>
            <Text style={styles.etab}>{item.etab}</Text>
            <Text style={styles.article}>{item.article}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>
        )}
      />
      <Modal visible={modal} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Nouveau bon de commande</Text>
            <Text style={styles.fieldLabel}>Établissement</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              {ETABLISSEMENTS.map(e => (
                <TouchableOpacity key={e} onPress={() => setEtab(e)} style={[styles.chip, etab === e && styles.chipActive]}>
                  <Text style={[styles.chipText, etab === e && { color: "#fff" }]}>{e}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={styles.fieldLabel}>Article / Description</Text>
            <TextInput value={article} onChangeText={setArticle} placeholder="Ex: Gants de protection x50" style={styles.input} />
            <TouchableOpacity style={styles.submitBtn} onPress={ajouter}>
              <Text style={styles.submitText}>Créer le bon</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModal(false)} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F6FA" },
  header: { backgroundColor: "#1A3A5C", padding: 20, paddingTop: 48, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { color: "#fff", fontSize: 20, fontWeight: "600" },
  addBtn: { backgroundColor: "#4DA8DA", borderRadius: 8, paddingHorizontal: 14, paddingVertical: 7 },
  addBtnText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  card: { backgroundColor: "#fff", borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 0.5, borderColor: "#E0E0E0" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  ref: { fontSize: 14, fontWeight: "600", color: "#1A3A5C" },
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontSize: 10, fontWeight: "600" },
  etab: { fontSize: 12, color: "#444", marginBottom: 2 },
  article: { fontSize: 12, color: "#666" },
  date: { fontSize: 11, color: "#AAA", marginTop: 4 },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalBox: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalTitle: { fontSize: 16, fontWeight: "600", color: "#1A3A5C", marginBottom: 16 },
  fieldLabel: { fontSize: 12, color: "#555", marginBottom: 6 },
  chip: { backgroundColor: "#F0F0F0", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8 },
  chipActive: { backgroundColor: "#1A3A5C" },
  chipText: { fontSize: 12, color: "#333" },
  input: { borderWidth: 0.5, borderColor: "#DDD", borderRadius: 8, padding: 10, fontSize: 13, marginBottom: 14 },
  submitBtn: { backgroundColor: "#1A3A5C", borderRadius: 10, padding: 14, alignItems: "center", marginBottom: 8 },
  submitText: { color: "#fff", fontWeight: "600" },
  cancelBtn: { alignItems: "center", padding: 10 },
  cancelText: { color: "#888", fontSize: 13 },
});
