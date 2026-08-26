import { ScrollView, StyleSheet, Text, View } from 'react-native';

const metrics = [
  ['Mode', 'DEMO'],
  ['Virtual balance', 'R$ 10,000.00'],
  ['P&L', 'R$ 0.00'],
  ['Drawdown', '0.00%'],
];

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.eyebrow}>BITEY IA · SUPRACEREBRO</Text>
      <Text style={styles.title}>System Bots Trading</Text>
      <Text style={styles.subtitle}>Trading systems laboratory</Text>

      <View style={styles.modeCard}>
        <Text style={styles.modeLabel}>CURRENT MODE</Text>
        <Text style={styles.mode}>DEMO</Text>
        <Text style={styles.safe}>No real-money orders</Text>
      </View>

      <View style={styles.grid}>
        {metrics.map(([label, value]) => (
          <View key={label} style={styles.card}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System status</Text>
        <Text style={styles.row}>● Trading engine · Ready for demo</Text>
        <Text style={styles.row}>● Risk engine · Enabled</Text>
        <Text style={styles.row}>● Paper trading · Not started</Text>
        <Text style={styles.row}>● Live trading · Disabled</Text>
      </View>

      <Text style={styles.footer}>Bitey System Bots Trading · v0.1.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 56, gap: 16 },
  eyebrow: { fontSize: 12, fontWeight: '700', letterSpacing: 1.2 },
  title: { fontSize: 32, fontWeight: '800' },
  subtitle: { fontSize: 16, opacity: 0.65 },
  modeCard: { padding: 20, borderRadius: 18, borderWidth: 1, gap: 6 },
  modeLabel: { fontSize: 11, fontWeight: '700', opacity: 0.6 },
  mode: { fontSize: 30, fontWeight: '800' },
  safe: { fontSize: 13, opacity: 0.65 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '47%', padding: 16, borderRadius: 16, borderWidth: 1, gap: 6 },
  label: { fontSize: 12, opacity: 0.6 },
  value: { fontSize: 18, fontWeight: '700' },
  section: { padding: 20, borderRadius: 18, borderWidth: 1, gap: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '800' },
  row: { fontSize: 14 },
  footer: { textAlign: 'center', fontSize: 12, opacity: 0.5, marginTop: 16 },
});
