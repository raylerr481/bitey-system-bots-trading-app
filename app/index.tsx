import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_TRADING_API_URL ?? "http://127.0.0.1:8000";

type Profile = {
  id: string; name: string; short_description: string; beginner_explanation: string; professional_explanation: string;
  markets: string[]; risk: { level: string; max_loss_pct_per_trade: number; max_daily_loss_pct: number };
};

export default function Home() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [professional, setProfessional] = useState(false);
  const [selected, setSelected] = useState("conservative-eurusd");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/bot-profiles`).then((r) => r.json()).then(setProfiles).catch(() => setProfiles([])).finally(() => setLoading(false));
  }, []);
  const profile = profiles.find((item) => item.id === selected);

  return <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.eyebrow}>BITEY SBT</Text>
    <Text style={styles.title}>Elige tu grupo de bots</Text>
    <Text style={styles.subtitle}>Primero una explicación sencilla. Activa la vista profesional cuando quieras conocer los parámetros técnicos.</Text>
    {loading ? <ActivityIndicator /> : profiles.map((item) => <Pressable key={item.id} onPress={() => setSelected(item.id)} style={[styles.card, selected === item.id && styles.selected]}>
      <View style={styles.row}><Text style={styles.cardTitle}>{item.name}</Text><Text style={styles.risk}>{item.risk.level.toUpperCase()}</Text></View>
      <Text>{item.short_description}</Text>
      <Text style={styles.explanation}>{professional ? item.professional_explanation : item.beginner_explanation}</Text>
      <Text style={styles.meta}>Mercado: {item.markets.join(", ")}</Text>
      <Text style={styles.meta}>Pérdida configurada por operación: {(item.risk.max_loss_pct_per_trade * 100).toFixed(1)}%</Text>
    </Pressable>)}
    <Pressable onPress={() => setProfessional((v) => !v)} style={styles.secondary}><Text style={styles.secondaryText}>{professional ? "Ver explicación sencilla" : "Ver explicación profesional"}</Text></Pressable>
    {profile && <View style={styles.preview}><Text style={styles.previewTitle}>Si asignas $10</Text><Text>El límite configurado de pérdida por operación es aproximadamente ${(10 * profile.risk.max_loss_pct_per_trade).toFixed(2)}.</Text><Text style={styles.warning}>Es un control de riesgo, no una garantía. Slippage, gaps y condiciones de mercado pueden producir pérdidas mayores.</Text></View>}
    <Pressable disabled style={styles.live}><Text style={styles.liveText}>Activar dinero real — próximamente</Text></Pressable>
    <Text style={styles.safety}>El modo real permanece bloqueado. Su futura activación exigirá autenticación, conexión al broker/MT5, capital máximo, límites de pérdida, validación previa, auditoría, parada de emergencia y confirmación explícita.</Text>
  </ScrollView>;
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 56, gap: 14 }, eyebrow: { fontSize: 12, fontWeight: "800", letterSpacing: 2 },
  title: { fontSize: 30, fontWeight: "800" }, subtitle: { fontSize: 16, lineHeight: 23, opacity: 0.7 },
  card: { padding: 18, borderRadius: 18, borderWidth: 1, borderColor: "#ddd", gap: 8 }, selected: { borderWidth: 2 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 8 }, cardTitle: { fontSize: 19, fontWeight: "800", flex: 1 }, risk: { fontSize: 11, fontWeight: "800" },
  explanation: { fontSize: 14, lineHeight: 20, opacity: 0.8 }, meta: { fontSize: 12, opacity: 0.65 },
  secondary: { padding: 15, borderRadius: 14, borderWidth: 1, alignItems: "center" }, secondaryText: { fontWeight: "700" },
  preview: { padding: 18, borderRadius: 18, backgroundColor: "#f2f2f2", gap: 7 }, previewTitle: { fontSize: 18, fontWeight: "800" }, warning: { fontSize: 12, lineHeight: 18, opacity: 0.7 },
  live: { padding: 17, borderRadius: 14, alignItems: "center", opacity: 0.45 }, liveText: { fontWeight: "800" }, safety: { fontSize: 12, lineHeight: 18, opacity: 0.6, textAlign: "center" },
});
