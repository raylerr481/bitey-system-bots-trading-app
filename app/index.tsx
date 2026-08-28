import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

const DEFAULT_API = "http://127.0.0.1:8000";

type Analysis = {
  event?: string;
  impact?: string;
  opportunities?: Array<{ asset?: string; direction?: string; score?: number; rationale?: string }>;
  risk?: { max_loss?: number; reward_target?: number; risk_reward?: number };
  [key: string]: unknown;
};

const COPY = {
  es: { title: "Bitey SBT", subtitle: "Inteligencia de mercados dentro de Bitey IA", analyze: "ANALIZAR MERCADO", capital: "Capital virtual", backend: "Backend SBT", event: "Evento", result: "Resultado", free: "MODO ZERO COST: Demo / Paper / Backtest", note: "No ejecuta dinero real. Una señal no es una garantía de ganancias." },
  pt: { title: "Bitey SBT", subtitle: "Inteligência de mercados dentro do Bitey IA", analyze: "ANALISAR MERCADO", capital: "Capital virtual", backend: "Backend SBT", event: "Evento", result: "Resultado", free: "MODO ZERO COST: Demo / Paper / Backtest", note: "Não executa dinheiro real. Um sinal não garante lucro." },
  en: { title: "Bitey SBT", subtitle: "Market intelligence inside Bitey IA", analyze: "ANALYZE MARKET", capital: "Virtual capital", backend: "SBT backend", event: "Event", result: "Result", free: "ZERO COST MODE: Demo / Paper / Backtest", note: "No real money is executed. A signal is not a profit guarantee." },
} as const;

export default function Home() {
  const [language, setLanguage] = useState<keyof typeof COPY>("es");
  const [capital, setCapital] = useState("1000");
  const [apiUrl, setApiUrl] = useState(DEFAULT_API);
  const [event, setEvent] = useState("energy_supply_risk");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const t = COPY[language];

  const demoEvidence = useMemo(() => [
    { source: "demo-news-1", source_type: "news", title: "Energy supply disruption risk", reliability: 0.85, impact: 0.9, direction: "long" },
    { source: "demo-news-2", source_type: "official", title: "Energy market risk confirmation", reliability: 0.9, impact: 0.85, direction: "long" },
    { source: "demo-market", source_type: "market", title: "Price confirmation", reliability: 0.8, impact: 0.8, direction: "long" },
  ], []);

  async function analyze() {
    setLoading(true);
    setAnalysis(null);
    try {
      const response = await fetch(`${apiUrl.replace(/\/$/, "")}/api/v1/sbt/market-intelligence/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ capital: Number(capital) || 1000, language, event, evidence: demoEvidence }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setAnalysis(await response.json());
    } catch (error) {
      setAnalysis({ error: String(error), status: "Backend not reachable. Check the LAN URL and keep SBT in demo mode." });
    } finally {
      setLoading(false);
    }
  }

  return <ScrollView contentContainerStyle={styles.container}>
    <View style={styles.header}>
      <Text style={styles.eyebrow}>BITEY IA · SBT</Text>
      <Text style={styles.title}>{t.title}</Text>
      <Text style={styles.subtitle}>{t.subtitle}</Text>
    </View>

    <View style={styles.badge}><Text style={styles.badgeText}>● {t.free}</Text></View>

    <View style={styles.card}>
      <Text style={styles.section}>{t.backend}</Text>
      <TextInput value={apiUrl} onChangeText={setApiUrl} autoCapitalize="none" style={styles.input} placeholder="http://192.168.1.x:8000" />
      <Text style={styles.hint}>En el teléfono, 127.0.0.1 apunta al propio teléfono. Usa la IP LAN del PC donde corre SBT.</Text>
    </View>

    <View style={styles.card}>
      <Text style={styles.section}>{t.capital}</Text>
      <TextInput value={capital} onChangeText={setCapital} keyboardType="decimal-pad" style={styles.input} />
      <Text style={styles.section}>{t.event}</Text>
      <TextInput value={event} onChangeText={setEvent} style={styles.input} />
      <View style={styles.languages}>
        {(Object.keys(COPY) as Array<keyof typeof COPY>).map((code) => <Pressable key={code} onPress={() => setLanguage(code)} style={[styles.lang, language === code && styles.langActive]}><Text style={styles.langText}>{code.toUpperCase()}</Text></Pressable>)}
      </View>
      <Pressable onPress={analyze} disabled={loading} style={styles.primary}><Text style={styles.primaryText}>{loading ? "..." : t.analyze}</Text></Pressable>
    </View>

    {loading && <ActivityIndicator size="large" />}
    {analysis && <View style={styles.result}>
      <Text style={styles.resultTitle}>{t.result}</Text>
      <Text style={styles.json}>{JSON.stringify(analysis, null, 2)}</Text>
    </View>}

    <View style={styles.card}>
      <Text style={styles.section}>Pipeline</Text>
      <Text style={styles.pipeline}>NEWS → SOURCES → DOMINO → MARKET CONFIRMATION → OPPORTUNITY → RISK → DEMO</Text>
      <Text style={styles.warning}>{t.note}</Text>
    </View>
  </ScrollView>;
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 56, gap: 14 }, header: { gap: 5 }, eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 2, opacity: 0.6 },
  title: { fontSize: 34, fontWeight: "900" }, subtitle: { fontSize: 16, lineHeight: 22, opacity: 0.65 },
  badge: { borderWidth: 1, borderRadius: 20, padding: 11, alignSelf: "flex-start" }, badgeText: { fontSize: 11, fontWeight: "800" },
  card: { padding: 18, borderRadius: 20, borderWidth: 1, borderColor: "#ddd", gap: 10 }, section: { fontSize: 16, fontWeight: "800" }, input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 12, padding: 13, fontSize: 15 }, hint: { fontSize: 11, lineHeight: 16, opacity: 0.6 },
  languages: { flexDirection: "row", gap: 8 }, lang: { borderWidth: 1, borderRadius: 10, paddingVertical: 9, paddingHorizontal: 14 }, langActive: { borderWidth: 2 }, langText: { fontWeight: "800", fontSize: 12 },
  primary: { marginTop: 4, padding: 16, borderRadius: 14, alignItems: "center", backgroundColor: "#111" }, primaryText: { color: "#fff", fontWeight: "900" },
  result: { padding: 18, borderRadius: 20, borderWidth: 1, gap: 10 }, resultTitle: { fontSize: 19, fontWeight: "900" }, json: { fontFamily: "monospace", fontSize: 11, lineHeight: 16 }, pipeline: { fontSize: 12, lineHeight: 20 }, warning: { fontSize: 12, lineHeight: 18, opacity: 0.65 },
});
