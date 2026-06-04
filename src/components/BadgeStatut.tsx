import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

type Statut =
  | 'en_cours' | 'livre' | 'archive' | 'annule'
  | 'en_attente' | 'payee' | 'litige'
  | 'brouillon' | 'a_valider' | 'valide' | 'envoye' | 'cloture'
  | 'actif' | 'inactif' | 'consultation'

const CONFIG: Record<Statut, { label: string; bg: string; text: string }> = {
  // Commandes
  en_cours:     { label: 'En cours',       bg: '#E6F1FB', text: '#185FA5' },
  livre:        { label: 'Livré',           bg: '#E1F5EE', text: '#0F6E56' },
  archive:      { label: 'Archivé',         bg: '#F1EFE8', text: '#5F5E5A' },
  annule:       { label: 'Annulé',          bg: '#FCEBEB', text: '#A32D2D' },
  // Factures
  en_attente:   { label: 'En attente',      bg: '#FAEEDA', text: '#854F0B' },
  payee:        { label: 'Payée',           bg: '#E1F5EE', text: '#0F6E56' },
  litige:       { label: 'Litige',          bg: '#FCEBEB', text: '#A32D2D' },
  // BDC
  brouillon:    { label: 'Brouillon',       bg: '#F1EFE8', text: '#5F5E5A' },
  a_valider:    { label: 'À valider',       bg: '#FAEEDA', text: '#854F0B' },
  valide:       { label: 'Validé',          bg: '#E1F5EE', text: '#0F6E56' },
  envoye:       { label: 'Envoyé',          bg: '#E6F1FB', text: '#185FA5' },
  cloture:      { label: 'Clôturé',         bg: '#F1EFE8', text: '#5F5E5A' },
  // Fournisseurs
  actif:        { label: 'Actif',           bg: '#E1F5EE', text: '#0F6E56' },
  inactif:      { label: 'Inactif',         bg: '#F1EFE8', text: '#5F5E5A' },
  consultation: { label: 'Consultation',    bg: '#E6F1FB', text: '#185FA5' },
}

type Props = {
  statut: Statut
  size?: 'sm' | 'md'
}

export default function BadgeStatut({ statut, size = 'md' }: Props) {
  const config = CONFIG[statut] ?? { label: statut, bg: '#F1EFE8', text: '#5F5E5A' }
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }, size === 'sm' && styles.sm]}>
      <Text style={[styles.text, { color: config.text }, size === 'sm' && styles.textSm]}>
        {config.label}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 99,
    alignSelf: 'flex-start',
  },
  sm: { paddingHorizontal: 7, paddingVertical: 2 },
  text: { fontSize: 12, fontWeight: '500' },
  textSm: { fontSize: 11 },
})
