# Bitey System Bots Trading App

Mobile application for **Bitey System Bots Trading**, a specialized module of **Bitey IA / Supracerebro**.

## Objective

Provide a mobile interface to monitor and control the trading-system laboratory without placing real-money trades by default.

The app will connect to the Bitey System Bots Trading backend and, through the Bitey IA ecosystem, access authorized data and services from the shared platform infrastructure.

## Planned capabilities

- Demo trading dashboard
- Paper-trading dashboard
- Virtual portfolio
- Bots and strategies
- Backtest results
- Performance metrics
- Risk and drawdown monitoring
- Trade/event history
- Strategy experiments
- Alerts
- Emergency stop for supported execution modes
- Bitey IA / Supracerebro status

## Safety

The initial application is **DEMO/PAPER only**. Real-money trading is disabled until the backend, risk engine, audit trail, monitoring, authentication, and operational safeguards have been independently validated.

The mobile app must never contain broker credentials, exchange secrets, or privileged risk-control secrets.

## Ecosystem

```text
                         BITEY IA
                      SUPRACEREBRO
                            │
             ┌──────────────┴──────────────┐
             │                             │
      BITEY TRAINER              SYSTEM BOTS TRADING
             │                             │
      AI evaluation                  Trading engine
      and training                   Strategies
             │                       Backtesting
             │                       Demo/Paper
             └───────────┬───────────────┘
                         │
                  Trading App
```

Bitey Trainer and Bitey System Bots Trading are separate modules that can exchange authorized results and evaluations through Bitey IA. The app is a client of the trading module, not a replacement for its backend risk and execution controls.

## Planned stack

- Expo / React Native
- Expo Router
- TypeScript
- Secure client-side session handling
- Bitey System Bots Trading API
- Bitey IA / Supracerebro APIs

## Development stages

1. UI and navigation
2. Demo portfolio
3. Backend API integration
4. Backtesting visualization
5. Paper trading
6. Authentication and authorization
7. Automated Android APK builds
8. Device testing
9. Production hardening
10. Live trading only after explicit safety gates

## Disclaimer

Trading financial assets involves risk, including loss of capital. No bot, strategy, or AI system guarantees profits. This application is initially intended for research, simulation, and controlled testing.
