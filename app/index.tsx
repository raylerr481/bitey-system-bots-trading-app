import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

const DEFAULT_API = "https://bitey-system-bots-trading-api.onrender.com";

type Tick = { timestamp?: string | number; bid?: number; ask?: number; last?: number; spread?: number; error?: string };
type Analysis = { [key: string]: unknown };

const COPY = {
  es: { title: "Bitey SBT", subtitle: "Trading intelligence y mercado en tiempo real", analyze: "ANALIZAR MERCADO", market: "Mercado en tiempo real", symbol: "Instrumento", connected: "CONECTADO", disconnected: "SIN CONEXIÓN", price: "Precio", bid: "Bid", ask: "Ask", spread: "Spread", backend: "Backend SBT", event: "Evento", result: "Resultado", note: "Los datos vienen por el gateway propio de Bitey SBT. MT5 actúa como conector de mercado autorizado; las credenciales no pasan por la app." },
  pt: { title: "Bitey SBT", subtitle: "Inteligência de trading e mercado em tempo real", analyze: "ANALISAR MERCADO", market: "Mercado em tempo real", symbol: "Instrumento", connected: "CONECTADO", disconnected: "SEM CONEXÃO", price: "Preço", bid: "Bid", ask: "Ask", spread: "Spread", backend: "Backend SBT", event: "Evento", result: "Resultado", note: "Os dados chegam pelo gateway próprio do Bitey SBT. O MT5 atua como conector de mercado autorizado; as credenciais não passam pelo app." },
  en: { title: "Bitey SBT", subtitle: "Trading intelligence and real-time market", analyze: "ANALYZE MARKET", market: "Real-time market", symbol: "Instrument", connected: "CONNECTED", disconnected: "DISCONNECTED", price: "Price", bid: "Bid", ask: "Ask", spread: "Spread", backend: "SBT backend", event: "Event", result: "Result", note: "Data arrives through Bitey SBT's own gateway. MT5 acts as an authorized market connector; credentials never pass through the app." },
} as const;

function wsUrl(apiUrl: string, symbol: string) {
  const base = apiUrl.replace(/\/$/, "").replace(/^http:/, "ws:").replace(/^https:/, "wss:");
  return `${base}/api/v1/market/stream/${encodeURIComponent(symbol)}`;
}

export default function Home() {
  const [language, setLanguage] = useState<keyof typeof COPY>("es");
  const [apiUrl, setApiUrl] = useState(DEFAULT_API);
  const [symbol, setSymbol] = useState("EURUSD");
  const [event, setEvent] = useState("energy_supply_risk");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [tick, setTick] = useState<Tick | null>(null);
  const [prices, setPrices] = useState<number[]>([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const t = COPY[language];

  useEffect(() => {
    setTick(null);
    setPrices([]);
    setConnected(false);
    const socket = new WebSocket(wsUrl(apiUrl, symbol));
    socketRef.current = socket;
    socket.onopen = () => setConnected(true);
    socket.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data) as Tick;
        setTick(data);
        const value = Number(data.last ?? data.bid ?? data.ask);
        if (Number.isFinite(value)) setPrices((current) => [...current.slice(-39), value]);
        setConnected(!data.error);
      } catch { setConnected(false); }
    };
    socket.onerror = () => setConnected(false);
    socket.onclose = () => setConnected(false);
    return () => { socket.close(); if (socketRef.current === socket) socketRef.current = null; };
  }, [apiUrl, symbol]);

  const chartBars = useMemo(() => {
    if (!prices.length) return [];
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = Math.max(max - min, Math.abs(max) * 0.000001, 0.000001);
    return prices.map((value) => 10 + ((value - min) / range) * 90);
  }, [prices]);

  async function analyze() {
    setLoading(true);
    setAnalysis(null);
    try {
      const response = await fetch(`${apiUrl.replace(/\/$/, "")}/api/v1/sbt/market-intelligence/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ capital: 1000, language, event, evidence: [{ source: "sbt-live-market", source_type: "market", title: `${symbol} live quote`, reliability: connected ? 1 : 0, impact: 0.5, direction: "neutral" }] }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setAnalysis(await response.json());
    } catch (error) { setAnalysis({ error: String(error) }); }
    finally { setLoading(false); }
  }

  return <ScrollView contentContainerStyle={styles.container}>
    <View style={styles.header}>
      <Text style={styles.eyebrow}>BITEY IA · SBT</Text>
      <Text style={styles.title}>{t.title}</Text>
      <Text style={styles.subtitle}>{t.subtitle}</Text>
    </View>

    <View style={styles.card}>
      <View style={styles.rowBetween}><Text style={styles.section}>{t.market}</Text><Text style={[styles.status, connected ? styles.ok : styles.off]}>{connected ? `● ${t.connected}` : `● ${t.disconnected}`}</Text></View>
      <View style={styles.row}>
        <View style={styles.flex}><Text style={styles.label}>{t.symbol}</Text><TextInput value={symbol} onChangeText={setSymbol} autoCapitalize="characters" style={styles.input} /></View>
        <View style={styles.priceBox}><Text style={styles.label}>{t.price}</Text><Text style={styles.price}>{tick?.last ?? tick?.bid ?? "—"}</Text></View>
      </View>
      <View style={styles.quoteRow}>
        <Text style={styles.quote}>{t.bid}: {tick?.bid ?? "—"}</Text>
        <Text style={styles.quote}>{t.ask}: {tick?.ask ?? "—"}</Text>
        <Text style={styles.quote}>{t.spread}: {tick?.spread ?? "—"}</Text>
      </View>
      <View style={styles.chart}>
        {chartBars.length ? chartBars.map((height, index) => <View key={`${index}-${height}`} style={[styles.bar, { height: `${height}%` as `${number}%` }]} />) : <Text style={styles.empty}>Esperando ticks de {symbol}…</Text>}
      </View>
      <Text style={styles.hint}>SBT Market Gateway → MT5 → cotización → gráfico vivo · actualización aproximada: 1 s</Text>
    </View>

    <View style={styles.card}>
      <Text style={styles.section}>{t.backend}</Text>
      <TextInput value={apiUrl} onChangeText={setApiUrl} autoCapitalize="none" style={styles.input} />
      <Text style={styles.hint}>{t.note}</Text>
    </View>

    <View style={styles.card}>
      <Text style={styles.section}>{t.event}</Text>
      <TextInput value={event} onChangeText={setEvent} style={styles.input} />
      <View style={styles.languages}>{(Object.keys(COPY) as Array<keyof typeof COPY>).map((code) => <Pressable key={code} onPress={() => setLanguage(code)} style={[styles.lang, language === code && styles.langActive]}><Text style={styles.langText}>{code.toUpperCase()}</Text></Pressable>)}</View>
      <Pressable onPress={analyze} disabled={loading} style={styles.primary}><Text style={styles.primaryText}>{loading ? "..." : t.analyze}</Text></Pressable>
    </View>

    {loading && <ActivityIndicator size="large" />}
    {analysis && <View style={styles.result}><Text style={styles.resultTitle}>{t.result}</Text><Text style={styles.json}>{JSON.stringify(analysis, null, 2)}</Text></View>}
  </ScrollView>;
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 56, gap: 14 }, header: { gap: 5 }, eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 2, opacity: 0.6 },
  title: { fontSize: 34, fontWeight: "900" }, subtitle: { fontSize: 16, lineHeight: 22, opacity: 0.65 },
  card: { padding: 18, borderRadius: 20, borderWidth: 1, borderColor: "#ddd", gap: 10 }, section: { fontSize: 17, fontWeight: "800" },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, row: { flexDirection: "row", gap: 12 }, flex: { flex: 1 }, label: { fontSize: 11, opacity: 0.55, marginBottom: 5 },
  status: { fontSize: 10, fontWeight: "900" }, ok: { opacity: 0.9 }, off: { opacity: 0.5 }, input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 12, padding: 13, fontSize: 15 },
  priceBox: { minWidth: 125, justifyContent: "center" }, price: { fontSize: 26, fontWeight: "900" }, quoteRow: { flexDirection: "row", justifyContent: "space-between", gap: 8 }, quote: { fontSize: 11, fontWeight: "700" },
  chart: { height: 180, borderRadius: 14, borderWidth: 1, borderColor: "#ddd", padding: 12, flexDirection: "row", alignItems: "flex-end", gap: 3, overflow: "hidden" }, bar: { flex: 1, minWidth: 2, borderRadius: 3, backgroundColor: "#111" }, empty: { margin: "auto", opacity: 0.5, fontSize: 12 }, hint: { fontSize: 11, lineHeight: 16, opacity: 0.58 },
  languages: { flexDirection: "row", gap: 8 }, lang: { borderWidth: 1, borderRadius: 10, paddingVertical: 9, paddingHorizontal: 14 }, langActive: { borderWidth: 2 }, langText: { fontWeight: "800", fontSize: 12 },
  primary: { padding: 16, borderRadius: 14, alignItems: "center", backgroundColor: "#111" }, primaryText: { color: "#fff", fontWeight: "900" }, result: { padding: 18, borderRadius: 20, borderWidth: 1, gap: 10 }, resultTitle: { fontSize: 19, fontWeight: "900" }, json: { fontFamily: "monospace", fontSize: 11, lineHeight: 16 },
});
