# Bitey SBT App

`bitey-system-bots-trading-app` is the mobile application **Bitey SBT App** for the independent **Bitey System Bots Trading** module of Bitey IA.

## Product role

Bitey SBT App is the mobile channel for the trading module. It is not Bitey IA itself, not JobIA and not Bitey Trainer.

```text
BITEY IA / SUPRACEREBRO
          │
          └── Bitey System Bots Trading
                    │
               Bitey SBT App
```

## Objective

Provide a mobile interface to monitor and control the trading-system laboratory while keeping real-money execution disabled by default.

## Planned capabilities

- Demo trading dashboard.
- Paper-trading dashboard.
- Virtual portfolio.
- Bots and strategies.
- Backtest results.
- Performance metrics.
- Risk/drawdown monitoring.
- Trade and event history.
- Strategy experiments.
- Alerts.
- Emergency stop for supported execution modes.
- Authorized Bitey IA status/integration.

## Safety

Initial operation is **DEMO/PAPER only**. Live trading requires validated backend controls, audit trail, monitoring, authentication, explicit activation and safety gates.

The app must never contain broker credentials, exchange secrets or privileged risk-control secrets.

## Relationship to other modules

- **Bitey IA** — general Supracerebro.
- **JobIA** — employment/opportunity product.
- **Bitey Trainer** — internal motor of JobIA; not an app.
- **Bitey System Bots Trading** — this app's specialized backend/module.
- **BiteFixes** — separate enterprise product with Bitey IA Empresarial.

Trading may exchange authorized results with Bitey IA, but remains independently controlled.

## Planned stack

- Expo / React Native.
- Expo Router.
- TypeScript.
- Secure session handling.
- Bitey System Bots Trading API.
- Authorized Bitey IA APIs.

## Development stages

1. UI/navigation.
2. Demo portfolio.
3. Backend API integration.
4. Backtesting visualization.
5. Paper trading.
6. Authentication/authorization.
7. Android APK builds.
8. Physical-device testing.
9. Production hardening.
10. Live trading only after explicit safety gates.

## Disclaimer

Trading financial assets involves risk, including loss of capital. No bot, strategy or AI system guarantees profits. The application is initially intended for research, simulation and controlled testing.
