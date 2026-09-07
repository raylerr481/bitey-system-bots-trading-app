import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

const DEFAULT_API = "https://bitey-system-bots-trading-api.onrender.com";
type Tick = { timestamp?: string | number; bid?: number; ask?: number; last?: number; spread?: number; error?: string };
type Candle = { time?: string | number; timestamp?: string | number; open: number; high: number; low: number; close: number; volume?: number };
type Market = { id: string; label: string; examples: string[] };
type Analysis = { [key: string]: unknown };

const MARKETS: Market[] = [
  { id: "forex", label: "Divisas", examples: ["EURUSD", "GBPUSD", "USDJPY", "USDBRL"] },
  { id: "indices", label: "Índices", examples: ["US30", "NAS100", "SPX500", "GER40"] },
  { id: "stocks", label: "Acciones", examples: ["AAPL", "MSFT", "NVDA", "TSLA"] },
  { id: "crypto", label: "Crypto", examples: ["BTCUSD", "ETHUSD", "SOLUSD"] },
  { id: "commodities", label: "Materias primas", examples: ["XAUUSD", "XAGUSD", "USOIL"] },
];
const TIMEFRAMES = ["M1", "M5", "M15", "M30", "H1", "H4", "D1"];
const COPY = { es: { title: "Bitey SBT", subtitle: "Trading intelligence y mercado en tiempo real", market: "Mercado", timeframe: "Temporalidad", connected: "CONECTADO", disconnected: "SIN CONEXIÓN", price: "Precio", bid: "Bid", ask: "Ask", spread: "Spread", gateway: "Bitey SBT Market Gateway", analyze: "ANALIZAR MERCADO", event: "Evento", result: "Resultado", candles: "Velas OHLC", loadingCandles: "Cargando velas…", noCandles: "Sin velas disponibles para este instrumento", note: "SBT es la plataforma de trading. MT5, Alpaca, TradingView y otros proveedores son conectores; las credenciales no pasan por la app." }, pt: { title: "Bitey SBT", subtitle: "Inteligência de trading e mercado em tempo real", market: "Mercado", timeframe: "Período", connected: "CONECTADO", disconnected: "SEM CONEXÃO", price: "Preço", bid: "Bid", ask: "Ask", spread: "Spread", gateway: "Bitey SBT Market Gateway", analyze: "ANALISAR MERCADO", event: "Evento", result: "Resultado", candles: "Velas OHLC", loadingCandles: "Carregando velas…", noCandles: "Sem velas disponíveis para este instrumento", note: "SBT é a plataforma de trading. MT5, Alpaca, TradingView e outros provedores são conectores; as credenciais não passam pelo app." }, en: { title: "Bitey SBT", subtitle: "Trading intelligence and real-time market", market: "Market", timeframe: "Timeframe", connected: "CONNECTED", disconnected: "DISCONNECTED", price: "Price", bid: "Bid", ask: "Ask", spread: "Spread", gateway: "Bitey SBT Market Gateway", analyze: "ANALYZE MARKET", event: "Event", result: "Result", candles: "OHLC Candles", loadingCandles: "Loading candles…", noCandles: "No candles available for this instrument", note: "SBT is the trading platform. MT5, Alpaca, TradingView and other providers are connectors; credentials never pass through the app." } } as const;

function wsUrl(api: string, symbol: string) { const base = api.replace(/\/$/, "").replace(/^http:/, "ws:").replace(/^https:/, "wss:"); return `${base}/api/v1/market/stream/${encodeURIComponent(symbol)}`; }
function candlesUrl(api: string, symbol: string, timeframe: string) { return `${api.replace(/\/$/, "")}/api/v1/market/candles/${encodeURIComponent(symbol)}?timeframe=${encodeURIComponent(timeframe)}&limit=80`; }

export default function Home() {
  const [language, setLanguage] = useState<keyof typeof COPY>("es");
  const [apiUrl, setApiUrl] = useState(DEFAULT_API);
  const [market, setMarket] = useState("forex");
  const [symbol, setSymbol] = useState("EURUSD");
  const [timeframe, setTimeframe] = useState("M5");
  const [event, setEvent] = useState("market_structure");
  const [loading, setLoading] = useState(false);
  const [loadingCandles, setLoadingCandles] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [tick, setTick] = useState<Tick | null>(null);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const t = COPY[language];
  const selectedMarket = MARKETS.find((item) => item.id === market) ?? MARKETS[0];

  useEffect(() => {
    setTick(null); setConnected(false);
    const socket = new WebSocket(wsUrl(apiUrl, symbol));
    socketRef.current = socket;
    socket.onopen = () => setConnected(true);
    socket.onmessage = (message) => { try { const data = JSON.parse(message.data) as Tick; setTick(data); setConnected(!data.error); } catch { setConnected(false); } };
    socket.onerror = () => setConnected(false); socket.onclose = () => setConnected(false);
    return () => { socket.close(); if (socketRef.current === socket) socketRef.current = null; };
  }, [apiUrl, symbol]);

  useEffect(() => {
    let cancelled = false;
    async function loadCandles() {
      setLoadingCandles(true);
      try {
        const response = await fetch(candlesUrl(apiUrl, symbol, timeframe));
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = await response.json();
        const next = Array.isArray(payload?.candles) ? payload.candles : [];
        if (!cancelled) setCandles(next.filter((c: Candle) => [c.open, c.high, c.low, c.close].every((v) => Number.isFinite(Number(v)))).slice(-80));
      } catch { if (!cancelled) setCandles([]); }
      finally { if (!cancelled) setLoadingCandles(false); }
    }
    loadCandles();
    return () => { cancelled = true; };
  }, [apiUrl, symbol, timeframe]);

  const chart = useMemo(() => {
    if (!candles.length) return { candles: [], min: 0, max: 0, range: 1 };
    const min = Math.min(...candles.map((c) => Number(c.low)));
    const max = Math.max(...candles.map((c) => Number(c.high)));
    return { candles, min, max, range: Math.max(max - min, Math.abs(max) * 0.000001, 0.000001) };
  }, [candles]);

  async function analyze() { setLoading(true); setAnalysis(null); try { const response = await fetch(`${apiUrl.replace(/\/$/, "")}/api/v1/sbt/market-intelligence/analyze`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ symbol, timeframe, candles, capital: 1000, language, event, evidence: [{ source: "sbt-live-market", source_type: "market", title: `${symbol} ${timeframe} live quote`, reliability: connected ? 1 : 0, impact: 0.5, direction: "neutral" }] }) }); if (!response.ok) throw new Error(`HTTP ${response.status}`); setAnalysis(await response.json()); } catch (error) { setAnalysis({ error: String(error) }); } finally { setLoading(false); } }

  return <ScrollView contentContainerStyle={styles.container}>
    <View style={styles.header}><Text style={styles.eyebrow}>BITEY IA · SBT</Text><Text style={styles.title}>{t.title}</Text><Text style={styles.subtitle}>{t.subtitle}</Text></View>
    <View style={styles.card}><Text style={styles.section}>{t.market}</Text><View style={styles.chips}>{MARKETS.map((item) => <Pressable key={item.id} onPress={() => { setMarket(item.id); setSymbol(item.examples[0]); }} style={[styles.chip, market === item.id && styles.chipActive]}><Text style={styles.chipText}>{item.label}</Text></Pressable>)}</View><View style={styles.chips}>{selectedMarket.examples.map((item) => <Pressable key={item} onPress={() => setSymbol(item)} style={[styles.instrument, symbol === item && styles.instrumentActive]}><Text style={styles.instrumentText}>{item}</Text></Pressable>)}</View><TextInput value={symbol} onChangeText={setSymbol} autoCapitalize="characters" style={styles.input} /></View>
    <View style={styles.card}><View style={styles.rowBetween}><Text style={styles.section}>{symbol} · {timeframe}</Text><Text style={[styles.status, connected ? styles.ok : styles.off]}>{connected ? `● ${t.connected}` : `● ${t.disconnected}`}</Text></View><View style={styles.quoteRow}><Text style={styles.quote}>{t.price}: {tick?.last ?? tick?.bid ?? "—"}</Text><Text style={styles.quote}>{t.bid}: {tick?.bid ?? "—"}</Text><Text style={styles.quote}>{t.ask}: {tick?.ask ?? "—"}</Text><Text style={styles.quote}>{t.spread}: {tick?.spread ?? "—"}</Text></View><Text style={styles.chartTitle}>{t.candles}</Text><View style={styles.chart}>{loadingCandles ? <ActivityIndicator /> : chart.candles.length ? chart.candles.map((c, index) => { const open = Number(c.open), high = Number(c.high), low = Number(c.low), close = Number(c.close); const top = ((chart.max - high) / chart.range) * 100; const bottom = ((chart.max - low) / chart.range) * 100; const bodyTop = ((chart.max - Math.max(open, close)) / chart.range) * 100; const bodyHeight = Math.max(((Math.abs(open - close)) / chart.range) * 100, 1.2); const up = close >= open; return <View key={`${index}-${c.time ?? c.timestamp ?? index}`} style={styles.candleSlot}><View style={[styles.wick, { top: `${top}%` as `${number}%`, height: `${Math.max(bottom - top, 1)}%` as `${number}%` }]} /><View style={[styles.body, up ? styles.up : styles.down, { top: `${bodyTop}%` as `${number}%`, height: `${bodyHeight}%` as `${number}%` }]} /></View>; }) : <Text style={styles.empty}>{t.noCandles}</Text>}</View><View style={styles.chips}>{TIMEFRAMES.map((item) => <Pressable key={item} onPress={() => setTimeframe(item)} style={[styles.instrument, timeframe === item && styles.instrumentActive]}><Text style={styles.instrumentText}>{item}</Text></Pressable>)}</View><Text style={styles.hint}>{t.gateway} → OHLC {timeframe} → conector autorizado · quote WebSocket ~1 s</Text></View>
    <View style={styles.card}><Text style={styles.section}>{t.gateway}</Text><TextInput value={apiUrl} onChangeText={setApiUrl} autoCapitalize="none" style={styles.input} /><Text style={styles.hint}>{t.note}</Text></View>
    <View style={styles.card}><Text style={styles.section}>{t.event}</Text><TextInput value={event} onChangeText={setEvent} style={styles.input} /><View style={styles.languages}>{(Object.keys(COPY) as Array<keyof typeof COPY>).map((code) => <Pressable key={code} onPress={() => setLanguage(code)} style={[styles.lang, language === code && styles.langActive]}><Text style={styles.langText}>{code.toUpperCase()}</Text></Pressable>)}</View><Pressable onPress={analyze} disabled={loading} style={styles.primary}><Text style={styles.primaryText}>{loading ? "..." : t.analyze}</Text></Pressable></View>
    {loading && <ActivityIndicator size="large" />}{analysis && <View style={styles.result}><Text style={styles.resultTitle}>{t.result}</Text><Text style={styles.json}>{JSON.stringify(analysis, null, 2)}</Text></View>}
  </ScrollView>;
}

const styles = StyleSheet.create({ container: { padding: 20, paddingTop: 56, gap: 14 }, header: { gap: 5 }, eyebrow: { fontSize: 11, fontWeight: "800", letterSpacing: 2, opacity: 0.6 }, title: { fontSize: 34, fontWeight: "900" }, subtitle: { fontSize: 16, lineHeight: 22, opacity: 0.65 }, card: { padding: 18, borderRadius: 20, borderWidth: 1, borderColor: "#ddd", gap: 10 }, section: { fontSize: 17, fontWeight: "800" }, chartTitle: { fontSize: 12, fontWeight: "800", opacity: 0.65 }, chips: { flexDirection: "row", gap: 7, flexWrap: "wrap" }, chip: { borderWidth: 1, borderRadius: 14, paddingVertical: 10, paddingHorizontal: 12 }, chipActive: { borderWidth: 2 }, chipText: { fontSize: 12, fontWeight: "800" }, instrument: { borderWidth: 1, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 11 }, instrumentActive: { borderWidth: 2 }, instrumentText: { fontSize: 11, fontWeight: "800" }, rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, status: { fontSize: 10, fontWeight: "900" }, ok: { opacity: 0.9 }, off: { opacity: 0.5 }, quoteRow: { flexDirection: "row", justifyContent: "space-between", gap: 6, flexWrap: "wrap" }, quote: { fontSize: 11, fontWeight: "700" }, chart: { height: 260, borderRadius: 14, borderWidth: 1, borderColor: "#ddd", paddingHorizontal: 8, paddingVertical: 10, flexDirection: "row", alignItems: "stretch", gap: 2, overflow: "hidden", position: "relative" }, candleSlot: { flex: 1, position: "relative", minWidth: 3 }, wick: { position: "absolute", width: 1, left: "50%", backgroundColor: "#333" }, body: { position: "absolute", width: "70%", left: "15%", minHeight: 2, borderRadius: 1 }, up: { backgroundColor: "#111" }, down: { backgroundColor: "#777" }, empty: { margin: "auto", opacity: 0.5, fontSize: 12 }, input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 12, padding: 13, fontSize: 15 }, hint: { fontSize: 11, lineHeight: 16, opacity: 0.58 }, languages: { flexDirection: "row", gap: 8 }, lang: { borderWidth: 1, borderRadius: 10, paddingVertical: 9, paddingHorizontal: 14 }, langActive: { borderWidth: 2 }, langText: { fontWeight: "800", fontSize: 12 }, primary: { padding: 16, borderRadius: 14, alignItems: "center", backgroundColor: "#111" }, primaryText: { color: "#fff", fontWeight: "900" }, result: { padding: 18, borderRadius: 20, borderWidth: 1, gap: 10 }, resultTitle: { fontSize: 19, fontWeight: "900" }, json: { fontFamily: "monospace", fontSize: 11, lineHeight: 16 } });