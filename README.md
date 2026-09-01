# Bitey SBT App

`bitey-system-bots-trading-app` is the independent mobile channel for **Bitey System Bots Trading (Bitey SBT)**, the specialized trading product of Bitey IA.

The app has its own mobile UX and identity while consuming the same controlled SBT APIs as the future independent web platform. It is **not a clone of another trading application**.

## Product philosophy

Bitey SBT uses proven, non-exclusive trading-product dynamics—research, strategy creation, simulation, comparison, validation, demo, paper trading, publication and monitoring—while implementing its own:

- navigation;
- visual language;
- terminology;
- screens and components;
- workflows;
- data contracts;
- evaluation model;
- safety model.

No competitor code, artwork, copywriting, screenshots or proprietary implementation may be used in this app.

## User experience

The app should let beginners and experienced traders understand what a strategy does before activation.

Core experiences:

- Explore strategy profiles.
- Understand strategy logic in simple language.
- Switch to technical/professional detail.
- Enter capital and preview configured risk.
- Review backtest and validation evidence.
- Follow demo/paper performance.
- Inspect strategy versions.
- Monitor active strategies.
- Stop/suspend an eligible strategy.

The initial strategy groups remain **Conservador, Equilibrado and Agresivo EUR/USD**. They are seeds for the versioned SBT Strategy Registry, not fixed promises of performance.

## Bitey Model Workshop

Where supported by backend integrations, the user may choose Bitey Trading Intelligence or an external model such as ChatGPT or Claude for research and strategy proposals.

The app must make the distinction explicit:

**AI proposes → SBT evaluates → Risk Engine controls → execution layer acts only when authorized.**

The mobile client never receives provider secrets and never becomes the authority for trading permissions.

## SBT Evaluation

The app can present the backend's versioned evaluation evidence, which may include:

- net return;
- maximum drawdown;
- profit factor;
- risk-adjusted metrics;
- trade count;
- exposure;
- stability;
- out-of-sample behavior;
- demo/paper consistency;
- validation freshness.

A headline return must never be presented as proof of future profit.

## Strategy lifecycle

```text
IDEA
 ↓
SIMULATION
 ↓
ROBUSTNESS
 ↓
VALIDATION
 ↓
DEMO
 ↓
PAPER
 ↓
PUBLISH
 ↓
MONITOR
 ↓
REVALIDATE / SUSPEND
```

The app should always distinguish historical simulation from observed/demo/paper results.

## Market intelligence

The SBT intelligence flow is:

**Event → Asset → Possible effects → Time horizon → Technical context → Hypothesis → Simulation → Validation → Risk**

News and AI analysis are hypotheses and context, not automatic buy/sell instructions.

## Real-money activation

The **“Activar dinero real”** experience remains gated until the backend safety milestone is complete.

Future activation requires at minimum:

1. Authentication.
2. Explicit real-account selection.
3. Broker/exchange connection.
4. Maximum capital allocation.
5. Per-trade loss limit.
6. Daily loss limit.
7. Preflight risk validation.
8. Audit logging.
9. Emergency stop.
10. Explicit final confirmation.
11. Validated strategy status.
12. Execution and broker health checks.

The mobile app must never store broker credentials or privileged risk-control secrets.

## Backend contract

Current SBT endpoints include:

- `/api/v1/bot-profiles`
- `/api/v1/bot-profiles/{profile_id}`
- `/api/v1/bot-profiles/{profile_id}/risk-preview`
- `/api/v1/bot-profiles/live/activation-status`
- `/api/v1/demo/portfolio`
- `/api/v1/intelligence/news/analyze`
- `/api/v1/intelligence/health`

Configure `EXPO_PUBLIC_TRADING_API_URL` for a reachable SBT API. Localhost is for development only.

## Development

- Expo / React Native.
- Expo Router.
- TypeScript.
- Bitey SBT API.

## Relationship to the ecosystem

```text
                         BITEY IA
                            │
                  authorized SBT intelligence
                            │
                            ▼
                     BITEY SBT CORE
                       /         \
                      /           \
              SBT Web           SBT App
                 │                   │
                 └──── same API ────┘
```

The app is independent in frontend experience but interconnected internally with Bitey IA and the specialized SBT backend.

## Disclaimer

Trading financial assets involves risk, including loss of capital. No strategy, bot or AI system guarantees profits. The application is initially intended for research, simulation and controlled testing.
