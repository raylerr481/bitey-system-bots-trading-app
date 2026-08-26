# Bitey Ecosystem Integration

This mobile app is the client for the independent **Bitey System Bots Trading** module inside the Bitey IA / Supracerebro ecosystem.

```text
Bitey IA / Supracerebro
        |
        +-- Bitey IA App
        +-- Bitey Trainer
        +-- JobIA
        +-- Bitey System Bots Trading
                |
                +-- Bitey System Bots Trading App
```

The app must authenticate through the Bitey IA ecosystem, consume trading APIs rather than holding provider secrets, and expose demo/paper functionality before any live capability.

## Safety boundary

The mobile app cannot independently enable live trading. Live execution, if ever introduced, must be controlled by the backend, provider-specific credentials, risk policies and explicit account-level authorization.

## Development progression

- Dashboard
- Demo portfolio
- Strategy/backtest experiments
- Paper trading
- Controlled live capability only after validation
