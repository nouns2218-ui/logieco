$commandes = @'
import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, ScrollView } from "react-native";

const ETABLISSEMENTS = ["IME La Colline","ESAT Horizon","MAS Les Pins","FAM Esperanza","SESSAD Nord","ITEP La Garrigue","MAS Saint-Joseph","FAM Les Oliviers","SESSAD Sud","SESSAD Est"];

const CATALOGUE = [
  { id: "1", ref: "EPI-0041", nom: "Gants nitrile T8", unite: "boîte x100", stock: 24, categorie: "EPI" },
  { id: "2", ref: "EPI-0038", nom: "Masques FFP2", unite: "boîte x20", stock: 8, categorie: "EPI" },
  { id: "3", ref: "EPI-0022", nom: "Lunettes de protection", unite: "unité", stock: 15, categorie: "EPI" },
  { id: "4", ref: "EPI-0031", nom: "Gilet haute visibilité", unite: "unité", stock: 10, categorie: "EPI" },
  { id: "5", ref: "ENT-0018", nom: "Désinfectant sol 5L", unite: "bidon 5L", stock: 6, categorie: "Entretien" },
  { id: "6", ref: "ENT-0022", nom: "Savon mains 5L", unite: "bidon 5L", stock: 10, categorie: "Entretien" },
  { id: "7", ref: "ENT-0031", nom: "Produit vitres", unite: "spray 1L", stock: 18, categorie: "Entretien" },
  { id: "8", ref: "ENT-0041", nom: "Sacs poubelle 100L", unite: "rouleau x25", stock: 30, categorie: "Entretien" },
  { id: "9", ref: "BUR-0072", nom: "Ramette A4 80g", unite: "ramette 500 feuilles", stock: 120, categorie: "Bureautique" },
  { id: "10", ref: "BUR-0031", nom: "Cartouches HP noir", unite: "unité", stock: 18, categorie: "Bureautique" },
  { id: "11", ref: "BUR-0044", nom: "Stylos bille bleu", unite: "boîte x50", stock: 25, categorie: "Bureautique" },
  { id: "12", ref: "BUR-0055", nom: "Classeurs A4", unite: "unité", stock: 40, categorie: "Bureautique" },
  { id: "13", ref: "MNT-0012", nom: "Ampoules LED E27", unite: "boîte x10", stock: 45, categorie: "Maintenance" },
  { id: "14", ref: "MNT-0018", nom: "Ruban adhésif", unite: "rouleau", stock: 22, categorie: "Maintenance" },
];

const INITIAL_BDC = [
  { id: "1", ref: "BC-2026-063", etab: "IME La Colline", articles: 3, statut: "En attente", date: "03/06/2026" },
  { id: "2", ref: "BC-2026-062", etab: "ESAT Horizon", articles: 5, statut: "Validé", date: "01/06/2026" },
  { id: "3", ref: "BC-2026-061", etab: "MAS Les Pins", articles: 2, statut: "Livré", date: "29/05/2026" },
];

const STATUT_COLOR = { "En attente": "#FAEEDA", "Validé": "#EAF3DE", "Livré": "#E6F1FB", "Urgent": "#FCEBEB" };
const STATUT_TEXT = { "En attente": "#854F0B", "Validé": "#3B6D11", "Livré": "#185FA5", "Urgent": "#A32D2D" };
const CAT_COLOR = { "EPI": "#EEEDFE", "Entretien": "#E1F5EE", "Bureautique": "#E6F1FB", "Maintenance": "#FAEEDA" };

type Selection = { [id: string]: number };

export default function CommandesScreen() {
  const [bdc, setBdc] = useState(INITIAL_BDC);
  const [step, setStep] = useState<"liste"|"etab"|"catalogue"|"recap">("liste");
  const [etabChoisi, setEtabChoisi] = useState("");
  const [selection, setSelection] = useState<Selection>({});
  const [filtrecat, setFiltrecat] = useState("Tous");

  const categories = ["Tous", "EPI", "Entretien", "Bureautique", "Maintenance"];
  const produitsFiltres = filtrecat === "Tous" ? CATALOGUE : CATALOGUE.filter(p => p.categorie === filtrecat);

  const ajouterProduit = (id: string) => {
    setSelection(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };
  const retirerProduit = (id: string) => {
    setSelection(prev => {
      const n = (prev[id] || 0) - 1;
      if (n <= 0) { const copy = { ...prev }; delete copy[id]; return copy; }
      return { ...prev, [id]: n };
    });
  };

  const nbProduits = Object.keys(selection).length;

  const genererBDC = () => {
    const newRef = `BC-2026-0${64 + bdc.length}`;
    const today = new Date().toLocaleDateString("fr-FR");
    setBdc([{ id: String(bdc.length + 1), ref: newRef, etab: etabChoisi, articles: nbProduits, statut: "En attente", date: today }, ...bdc]);
    setStep("liste"); setEtabChoisi(""); setSelection({});
  };

  // LISTE BDC
  if (step === "liste") return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bons de commande</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setStep("etab")}>
          <Text style={styles.addBtnText}>+ Nouveau BDC</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}><Text style={styles.summaryVal}>{bdc.filter(b=>b.statut==="En attente").length}</Text><Text style={styles.summaryLbl}>En attente</Text></View>
        <View style={styles.summaryCard}><Text style={styles.summaryVal}>{bdc.filter(b=>b.statut==="Validé").length}</Text><Text style={styles.summaryLbl}>Validés</Text></View>
        <View style={styles.summaryCard}><Text style={styles.summaryVal}>{bdc.filter(b=>b.statut==="Livré").length}</Text><Text style={styles.summaryLbl}>Livrés</Text></View>
      </View>
      <FlatList
        data={bdc}
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
            <Text style={styles.articleCount}>{item.articles} article(s)</Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>
        )}
      />
    </View>
  );

  // ÉTAPE 1 : CHOIX ÉTABLISSEMENT
  if (step === "etab") return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choisir un établissement</Text>
        <TouchableOpacity onPress={() => setStep("liste")}><Text style={styles.cancelTop}>✕ Annuler</Text></TouchableOpacity>
      </View>
      <Text style={styles.stepInfo}>Étape 1 / 3 — Sélectionnez l établissement</Text>
      <ScrollView contentContainerStyle={{ padding: 14 }}>
        {ETABLISSEMENTS.map(e => (
          <TouchableOpacity key={e} style={[styles.etabRow, etabChoisi === e && styles.etabRowActive]} onPress={() => setEtabChoisi(e)}>
            <Text style={[styles.etabRowText, etabChoisi === e && { color: "#fff" }]}>🏢 {e}</Text>
            {etabChoisi === e && <Text style={{ color: "#fff" }}>✓</Text>}
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={[styles.nextBtn, !etabChoisi && { opacity: 0.4 }]} onPress={() => etabChoisi && setStep("catalogue")} disabled={!etabChoisi}>
          <Text style={styles.nextBtnText}>Continuer →</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  // ÉTAPE 2 : CATALOGUE PRODUITS
  if (step === "catalogue") return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choisir les produits</Text>
        <TouchableOpacity onPress={() => setStep("liste")}><Text style={styles.cancelTop}>✕</Text></TouchableOpacity>
      </View>
      <Text style={styles.stepInfo}>Étape 2 / 3 — {etabChoisi}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
        {categories.map(c => (
          <TouchableOpacity key={c} style={[styles.catChip, filtrecat === c && styles.catChipActive]} onPress={() => setFiltrecat(c)}>
            <Text style={[styles.catChipText, filtrecat === c && { color: "#fff" }]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList
        data={produitsFiltres}
        keyExtractor={i => i.id}
        contentContainerStyle={{ padding: 12, paddingBottom: 100 }}
        renderItem={({ item }) => {
          const qty = selection[item.id] || 0;
          return (
            <View style={styles.produitCard}>
              <View style={[styles.catDot, { backgroundColor: CAT_COLOR[item.categorie] }]}>
                <Text style={{ fontSize: 10, fontWeight: "700", color: "#1A3A5C" }}>{item.categorie.slice(0,3).toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.produitRef}>{item.ref}</Text>
                <Text style={styles.produitNom}>{item.nom}</Text>
                <Text style={styles.produitUnite}>{item.unite} · Stock: {item.stock}</Text>
              </View>
              <View style={styles.qtyControls}>
                {qty > 0 ? (
                  <>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => retirerProduit(item.id)}><Text style={styles.qtyBtnText}>−</Text></TouchableOpacity>
                    <Text style={styles.qtyNum}>{qty}</Text>
                  </>
                ) : null}
                <TouchableOpacity style={[styles.qtyBtn, styles.qtyBtnAdd]} onPress={() => ajouterProduit(item.id)}>
                  <Text style={[styles.qtyBtnText, { color: "#fff" }]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
      {nbProduits > 0 && (
        <TouchableOpacity style={styles.floatingBtn} onPress={() => setStep("recap")}>
          <Text style={styles.floatingBtnText}>Voir le récapitulatif ({nbProduits} produit{nbProduits>1?"s":""}) →</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // ÉTAPE 3 : RÉCAPITULATIF
  if (step === "recap") return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Récapitulatif</Text>
        <TouchableOpacity onPress={() => setStep("catalogue")}><Text style={styles.cancelTop}>← Retour</Text></TouchableOpacity>
      </View>
      <Text style={styles.stepInfo}>Étape 3 / 3 — {etabChoisi}</Text>
      <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 120 }}>
        <View style={styles.recapHeader}>
          <Text style={styles.recapTitle}>📋 Bon de commande</Text>
          <Text style={styles.recapEtab}>{etabChoisi}</Text>
          <Text style={styles.recapDate}>Date : {new Date().toLocaleDateString("fr-FR")}</Text>
        </View>
        {Object.entries(selection).map(([id, qty]) => {
          const prod = CATALOGUE.find(p => p.id === id);
          if (!prod) return null;
          return (
            <View key={id} style={styles.recapRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.recapProdNom}>{prod.nom}</Text>
                <Text style={styles.recapProdRef}>{prod.ref} · {prod.unite}</Text>
              </View>
              <View style={styles.recapQtyBadge}>
                <Text style={styles.recapQtyText}>× {qty}</Text>
              </View>
            </View>
          );
        })}
        <View style={styles.recapTotal}>
          <Text style={styles.recapTotalText}>Total : {Object.values(selection).reduce((a,b)=>a+b,0)} articles · {nbProduits} références</Text>
        </View>
        <TouchableOpacity style={styles.generateBtn} onPress={genererBDC}>
          <Text style={styles.generateBtnText}>✅ Générer le bon de commande</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelBtnBottom} onPress={() => setStep("liste")}>
          <Text style={styles.cancelBtnBottomText}>Annuler</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  return null;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F6FA" },
  header: { backgroundColor: "#1A3A5C", padding: 20, paddingTop: 52, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { color: "#fff", fontSize: 18, fontWeight: "700" },
  addBtn: { backgroundColor: "#1D9E75", borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  addBtnText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  cancelTop: { color: "rgba(255,255,255,0.8)", fontSize: 13 },
  stepInfo: { backgroundColor: "#EAF3DE", padding: 10, paddingHorizontal: 16, fontSize: 12, color: "#3B6D11", fontWeight: "500" },
  summaryRow: { flexDirection: "row", padding: 12, gap: 8 },
  summaryCard: { flex: 1, backgroundColor: "#fff", borderRadius: 10, padding: 12, alignItems: "center", borderWidth: 0.5, borderColor: "#E0E0E0" },
  summaryVal: { fontSize: 22, fontWeight: "700", color: "#1A3A5C" },
  summaryLbl: { fontSize: 10, color: "#888", marginTop: 2 },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 0.5, borderColor: "#E0E0E0" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  ref: { fontSize: 14, fontWeight: "700", color: "#1A3A5C" },
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 10, fontWeight: "700" },
  etab: { fontSize: 12, color: "#444", marginBottom: 2 },
  articleCount: { fontSize: 12, color: "#1D9E75", fontWeight: "600" },
  date: { fontSize: 11, color: "#AAA", marginTop: 4 },
  etabRow: { backgroundColor: "#fff", borderRadius: 10, padding: 16, marginBottom: 8, borderWidth: 0.5, borderColor: "#E0E0E0", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  etabRowActive: { backgroundColor: "#1A3A5C", borderColor: "#1A3A5C" },
  etabRowText: { fontSize: 14, color: "#1A3A5C", fontWeight: "500" },
  nextBtn: { backgroundColor: "#1D9E75", borderRadius: 12, padding: 16, alignItems: "center", marginTop: 16 },
  nextBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  catScroll: { paddingVertical: 10, paddingHorizontal: 12, maxHeight: 52 },
  catChip: { backgroundColor: "#F0F0F0", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginRight: 8, height: 32 },
  catChipActive: { backgroundColor: "#1A3A5C" },
  catChipText: { fontSize: 12, color: "#333", fontWeight: "500" },
  produitCard: { backgroundColor: "#fff", borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 0.5, borderColor: "#E0E0E0", flexDirection: "row", alignItems: "center", gap: 10 },
  catDot: { borderRadius: 8, padding: 6, alignItems: "center", justifyContent: "center", width: 40, height: 40 },
  produitRef: { fontSize: 10, color: "#888", marginBottom: 2 },
  produitNom: { fontSize: 13, fontWeight: "600", color: "#1A3A5C" },
  produitUnite: { fontSize: 11, color: "#888", marginTop: 1 },
  qtyControls: { flexDirection: "row", alignItems: "center", gap: 6 },
  qtyBtn: { width: 28, height: 28, borderRadius: 8, backgroundColor: "#F0F0F0", alignItems: "center", justifyContent: "center" },
  qtyBtnAdd: { backgroundColor: "#1D9E75" },
  qtyBtnText: { fontSize: 16, fontWeight: "700", color: "#333" },
  qtyNum: { fontSize: 14, fontWeight: "700", color: "#1A3A5C", minWidth: 20, textAlign: "center" },
  floatingBtn: { position: "absolute", bottom: 20, left: 16, right: 16, backgroundColor: "#1A3A5C", borderRadius: 14, padding: 16, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 8 },
  floatingBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  recapHeader: { backgroundColor: "#1A3A5C", borderRadius: 12, padding: 16, marginBottom: 16 },
  recapTitle: { color: "#fff", fontSize: 16, fontWeight: "700", marginBottom: 4 },
  recapEtab: { color: "rgba(255,255,255,0.8)", fontSize: 13 },
  recapDate: { color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 4 },
  recapRow: { backgroundColor: "#fff", borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 0.5, borderColor: "#E0E0E0", flexDirection: "row", alignItems: "center" },
  recapProdNom: { fontSize: 13, fontWeight: "600", color: "#1A3A5C" },
  recapProdRef: { fontSize: 11, color: "#888", marginTop: 2 },
  recapQtyBadge: { backgroundColor: "#E6F1FB", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  recapQtyText: { fontSize: 13, fontWeight: "700", color: "#185FA5" },
  recapTotal: { backgroundColor: "#EAF3DE", borderRadius: 10, padding: 14, marginTop: 8, marginBottom: 16 },
  recapTotalText: { fontSize: 13, fontWeight: "600", color: "#3B6D11", textAlign: "center" },
  generateBtn: { backgroundColor: "#1D9E75", borderRadius: 14, padding: 16, alignItems: "center", marginBottom: 10 },
  generateBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  cancelBtnBottom: { alignItems: "center", padding: 12 },
  cancelBtnBottomText: { color: "#888", fontSize: 13 },
});
'@
Set-Content -Path "C:\Users\DELL\Documents\logieco\logieco\src\src\screens\CommandesScreen.tsx" -Value $commandes -Encoding UTF8