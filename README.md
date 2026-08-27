# Bitey SBT App

`bitey-system-bots-trading-app` is the mobile application for the independent **Bitey System Bots Trading** module of Bitey IA.

## Current product experience

The app is designed so a person who does not know trading can understand a bot group before activating it:

- Choose a bot group: **Conservative, Balanced or Aggressive**.
- See what the group does in simple language.
- Enter a capital amount and preview the configured risk.
- Example: **“If you assign $10, the configured loss limit per trade is about $0.20.”**
- Switch to **Professional explanation** to see markets, strategies and risk parameters.
- Demo/paper modes are the normal starting point.
- The **“Activar dinero real”** control is prepared in the UI but remains disabled until the backend safety milestone is complete.

These examples are illustrative. No profit is guaranteed and configured loss limits cannot guarantee protection against gaps, slippage or exceptional execution conditions.

## Real-money activation design

The future activation flow will require:

1. User authentication.
2. Broker/account connection.
3. Explicit real-account selection.
4. Maximum capital allocation.
5. Per-trade loss limit.
6. Daily loss limit.
7. Preflight risk validation.
8. Audit logging.
9. Emergency stop.
10. Explicit final confirmation.

The mobile app must never store broker credentials, exchange secrets or privileged risk-control secrets.

## Backend contract

The app consumes the Bitey System Bots Trading API, including:

- `/api/v1/bot-profiles`
- `/api/v1/bot-profiles/{profile_id}`
- `/api/v1/bot-profiles/{profile_id}/risk-preview`
- `/api/v1/bot-profiles/live/activation-status`
- `/api/v1/demo/portfolio`

Configure the backend with `EXPO_PUBLIC_TRADING_API_URL` for a reachable development or production API. The default localhost value is intended for local development only.

## Development

- Expo / React Native.
- Expo Router.
- TypeScript.
- Bitey System Bots Trading API.

Start with Expo Go during development; use EAS/custom builds only when required by the target feature set.

## Relationship

```text
BITEY IA
   │
   └── Bitey System Bots Trading
             │
             └── Bitey SBT App
```

Bitey Trainer/JobIA and BiteFixes are separate products/modules.

## Disclaimer

Trading financial assets involves risk, including loss of capital. No bot, strategy or AI system guarantees profits. The application is initially intended for research, simulation and controlled testing.
