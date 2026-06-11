import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView, Alert } from "react-native";
import { ETABLISSEMENTS } from "../data/etablissements";
import * as DocumentPicker from "expo-document-picker";

type Statut = "brouillon" | "a_valider" | "valide" | "envoye" | "cloture";
type BDC = {
  id: string; numero: string; etablissement: string; pole: string;
  description: string; statut: Statut; date: string; pieceJointe?: string;
};

const STATUT_CONFIG = {
  brouillon:  { label: "Brouillon",  bg: "#F1EFE8", text: "#5F5E5A" },
  a_valider:  { label: "A valider",  bg: "#FAEEDA", text: "#854F0B" },
  valide:     { label: "Valide",     bg: "#EAF3DE", text: "#3B6D11" },
  envoye:     { label: "Envoye",     bg: "#E6F1FB", text: "#185FA5" },
  cloture:    { label: "Cloture",    bg: "#EEEDFE", text: "#534AB7" },
};

const INITIAL: BDC[] = [
  { id: "1", numero: "BDC-2026-001", etablissement: "IME La Feuilleraie", pole: "Pole Autonomie Enfance", description: "Gants de protection x50", statut: "valide", date: "03/06/2026" },
  { id: "2", numero: "BDC-2026-002", etablissement: "Foyer Le Pont de Pierre", pole: "Pole Habitat Accompagne", description: "Detergent sol x10L", statut: "envoye", date: "01/06/2026" },
  { id: "3", numero: "BDC-2026-003", etablissement: "MAS La Beauceraie", pole: "Pole Hebergement Medicalise", description: "Papier A4 x20 ramettes", statut: "cloture", date: "29/05/2026" },
  { id: "4", numero: "BDC-2026-004", etablissement: "ESAT Les Ateliers du Vieux Chatres", pole: "Pole Insertion Professionnelle", description: "Masques FFP2 x5 boites", statut: "a_valider", date: "27/05/2026" },
];

const POLES = [...new Set(ETABLISSEMENTS.map(e => e.pole))];

export default function BonsDeCommandeScreen() {
  const [bons, setBons] = useState<BDC[]>(INITIAL);
  const [modalAjout, setModalAjout] = useState(false);
  const [modalDetail, setModalDetail] = useState<BDC | null>(null);
  const [modalEtab, setModalEtab] = useState(false);
  const [searchEtab, setSearchEtab] = useState("");
  const [etabSelectionne, setEtabSelectionne] = useState("");
  const [poleSelectionne, setPoleSelectionne] = useState("");
  const [description, setDescription] = useState("");
  const [pieceJointe, setPieceJointe] = useState<string | undefined>();
  const [filterStatut, setFilterStatut] = useState("tous");

  const bonsFiltres = filterStatut === "tous" ? bons : bons.filter(b => b.statut === filterStatut);
  const etabFiltres = ETABLISSEMENTS.filter(e =>
    e.nom.toLowerCase().includes(searchEtab.toLowerCase()) ||
    e.pole.toLowerCase().includes(searchEtab.toLowerCase())
  );

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: ["application/pdf", "image/*"] });
      if (!result.canceled && result.assets?.[0]) setPieceJointe(result.assets[0].name);
    } catch { Alert.alert("Erreur", "Impossible d ouvrir le fichier"); }
  };

  const ajouter = () => {
    if (!etabSelectionne || !description) {
      Alert.alert("Champs manquants", "Veuillez remplir tous les champs obligatoires.");
      return;
    }
    const newBDC: BDC = {
      id: String(Date.now()),
      numero: `BDC-2026-${String(bons.length + 1).padStart(3, "0")}`,
      etablissement: etabSelectionne,
      pole: poleSelectionne,
      description,
      statut: "brouillon",
      date: new Date().toLocaleDateString("fr-FR"),
      pieceJointe,
    };
    setBons([newBDC, ...bons]);
    setModalAjout(false);
    setEtabSelectionne(""); setPoleSelectionne(""); setDescription(""); setPieceJointe(undefined); setSearchEtab("");
  };

  const supprimer = (id: string) => {
    Alert.alert("Supprimer", "Confirmer la suppression ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", style: "destructive", onPress: () => { setBons(bons.filter(b => b.id !== id)); setModalDetail(null); } },
    ]);
  };

  const changerStatut = (id: string, statut: Statut) => {
    setBons(bons.map(b => b.id === id ? { ...b, statut } : b));
    setModalDetail(prev => prev ? { ...prev, statut } : null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bons de commande</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalAjout(true)}>
          <Text style={styles.addBtnText}>+ Nouveau</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
        {["tous", ...Object.keys(STATUT_CONFIG)].map(s => (
          <TouchableOpacity key={s} onPress={() => setFilterStatut(s)}
            style={[styles.filterChip, filterStatut === s && styles.filterChipActive]}>
            <Text style={[styles.filterText, filterStatut === s && styles.filterTextActive]}>
              {s === "tous" ? "Tous" : STATUT_CONFIG[s as Statut].label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={bonsFiltres}
        keyExtractor={i => i.id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => setModalDetail(item)}>
            <View style={styles.cardRow}>
              <Text style={styles.numero}>{item.numero}</Text>
              <View style={[styles.badge, { backgroundColor: STATUT_CONFIG[item.statut].bg }]}>
                <Text style={[styles.badgeText, { color: STATUT_CONFIG[item.statut].text }]}>{STATUT_CONFIG[item.statut].label}</Text>
              </View>
            </View>
            <Text style={styles.pole}>{item.pole}</Text>
            <Text style={styles.etab}>{item.etablissement}</Text>
            <Text style={styles.desc}>{item.description}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.date}>{item.date}</Text>
              {item.pieceJointe && <Text style={styles.pj}>?? {item.pieceJointe}</Text>}
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal visible={modalAjout} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Nouveau bon de commande</Text>
            <Text style={styles.fieldLabel}>Etablissement *</Text>
            <TouchableOpacity style={styles.selectBtn} onPress={() => setModalEtab(true)}>
              <Text style={etabSelectionne ? styles.selectValue : styles.selectPlaceholder}>
                {etabSelectionne || "Selectionner un etablissement..."}
              </Text>
              <Text style={styles.chevron}>?</Text>
            </TouchableOpacity>
            <Text style={styles.fieldLabel}>Description *</Text>
            <TextInput value={description} onChangeText={setDescription}
              placeholder="Ex: Gants de protection x50" style={styles.input} multiline numberOfLines={3} />
            <Text style={styles.fieldLabel}>Piece jointe</Text>
            <TouchableOpacity style={styles.uploadBtn} onPress={pickDocument}>
              <Text style={styles.uploadText}>{pieceJointe ? `?? ${pieceJointe}` : "?? Choisir un fichier (PDF, image)"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={ajouter}>
              <Text style={styles.submitText}>Creer le bon</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalAjout(false)} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={modalEtab} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={[styles.modalBox, { maxHeight: "85%" }]}>
            <Text style={styles.modalTitle}>Choisir un etablissement</Text>
            <TextInput placeholder="Rechercher..." value={searchEtab} onChangeText={setSearchEtab}
              style={[styles.input, { marginBottom: 8 }]} />
            <ScrollView>
              {POLES.map(pole => {
                const etabsDuPole = etabFiltres.filter(e => e.pole === pole);
                if (etabsDuPole.length === 0) return null;
                return (
                  <View key={pole}>
                    <Text style={styles.poleHeader}>{pole}</Text>
                    {etabsDuPole.map(e => (
                      <TouchableOpacity key={e.id} style={styles.etabItem}
                        onPress={() => { setEtabSelectionne(e.nom); setPoleSelectionne(e.pole); setModalEtab(false); setSearchEtab(""); }}>
                        <View style={styles.etabCode}><Text style={styles.etabCodeText}>{e.code}</Text></View>
                        <Text style={styles.etabNom}>{e.nom}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                );
              })}
            </ScrollView>
            <TouchableOpacity onPress={() => setModalEtab(false)} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={!!modalDetail} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            {modalDetail && (
              <>
                <Text style={styles.modalTitle}>{modalDetail.numero}</Text>
                <Text style={styles.detailLabel}>Pole</Text>
                <Text style={styles.detailValue}>{modalDetail.pole}</Text>
                <Text style={styles.detailLabel}>Etablissement</Text>
                <Text style={styles.detailValue}>{modalDetail.etablissement}</Text>
                <Text style={styles.detailLabel}>Description</Text>
                <Text style={styles.detailValue}>{modalDetail.description}</Text>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>{modalDetail.date}</Text>
                {modalDetail.pieceJointe && <>
                  <Text style={styles.detailLabel}>Piece jointe</Text>
                  <Text style={[styles.detailValue, { color: "#185FA5" }]}>?? {modalDetail.pieceJointe}</Text>
                </>}
                <Text style={styles.detailLabel}>Changer le statut</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
                  {(Object.keys(STATUT_CONFIG) as Statut[]).map(s => (
                    <TouchableOpacity key={s}
                      style={[styles.statutBtn, modalDetail.statut === s && { backgroundColor: STATUT_CONFIG[s].bg, borderColor: STATUT_CONFIG[s].text }]}
                      onPress={() => changerStatut(modalDetail.id, s)}>
                      <Text style={[styles.statutBtnText, modalDetail.statut === s && { color: STATUT_CONFIG[s].text }]}>
                        {STATUT_CONFIG[s].label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => supprimer(modalDetail.id)}>
                  <Text style={styles.deleteBtnText}>Supprimer ce bon</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalDetail(null)} style={styles.cancelBtn}>
                  <Text style={styles.cancelText}>Fermer</Text>
                </TouchableOpacity>
              </>
            )}
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
  addBtn: { backgroundColor: "#1D9E75", borderRadius: 8, paddingHorizontal: 14, paddingVertical: 7 },
  addBtnText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  filterBar: { backgroundColor: "#fff", paddingHorizontal: 12, paddingVertical: 8, borderBottomWidth: 0.5, borderColor: "#EEE" },
  filterChip: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, marginRight: 8, backgroundColor: "#F0F0F0" },
  filterChipActive: { backgroundColor: "#1A3A5C" },
  filterText: { fontSize: 12, color: "#555" },
  filterTextActive: { color: "#fff" },
  card: { backgroundColor: "#fff", borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 0.5, borderColor: "#E0E0E0" },
  cardRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 2 },
  numero: { fontSize: 14, fontWeight: "600", color: "#1A3A5C" },
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontSize: 10, fontWeight: "600" },
  pole: { fontSize: 10, color: "#1D9E75", fontWeight: "600", marginBottom: 2 },
  etab: { fontSize: 12, color: "#444", marginBottom: 2 },
  desc: { fontSize: 12, color: "#666" },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  date: { fontSize: 11, color: "#AAA" },
  pj: { fontSize: 11, color: "#185FA5" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalBox: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalTitle: { fontSize: 16, fontWeight: "600", color: "#1A3A5C", marginBottom: 16 },
  fieldLabel: { fontSize: 12, color: "#555", marginBottom: 6, fontWeight: "500" },
  selectBtn: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 0.5, borderColor: "#DDD", borderRadius: 8, padding: 10, marginBottom: 14, backgroundColor: "#FAFAFA" },
  selectValue: { fontSize: 13, color: "#222" },
  selectPlaceholder: { fontSize: 13, color: "#AAA" },
  chevron: { fontSize: 12, color: "#888" },
  input: { borderWidth: 0.5, borderColor: "#DDD", borderRadius: 8, padding: 10, fontSize: 13, marginBottom: 14 },
  uploadBtn: { borderWidth: 0.5, borderColor: "#4DA8DA", borderRadius: 8, padding: 12, marginBottom: 14, alignItems: "center", backgroundColor: "#F0F8FF" },
  uploadText: { fontSize: 13, color: "#185FA5" },
  submitBtn: { backgroundColor: "#1A3A5C", borderRadius: 10, padding: 14, alignItems: "center", marginBottom: 8 },
  submitText: { color: "#fff", fontWeight: "600" },
  cancelBtn: { alignItems: "center", padding: 10 },
  cancelText: { color: "#888", fontSize: 13 },
  poleHeader: { fontSize: 11, fontWeight: "600", color: "#1D9E75", paddingVertical: 8, paddingHorizontal: 4, backgroundColor: "#F5F6FA", marginTop: 4 },
  etabItem: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: 0.5, borderColor: "#EEE", gap: 10 },
  etabCode: { backgroundColor: "#E6F1FB", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  etabCodeText: { fontSize: 11, color: "#185FA5", fontWeight: "600" },
  etabNom: { fontSize: 13, color: "#333", flex: 1 },
  detailLabel: { fontSize: 11, color: "#888", marginTop: 10, marginBottom: 2 },
  detailValue: { fontSize: 13, color: "#222", fontWeight: "500" },
  statutBtn: { borderWidth: 0.5, borderColor: "#DDD", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8 },
  statutBtnText: { fontSize: 11, color: "#555" },
  deleteBtn: { backgroundColor: "#FCEBEB", borderRadius: 10, padding: 12, alignItems: "center", marginBottom: 8 },
  deleteBtnText: { color: "#A32D2D", fontWeight: "600", fontSize: 13 },
});
