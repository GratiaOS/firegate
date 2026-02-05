# 🔥 Firegate

[![Heartware Compliant](docs/heartware/heartware-badge.svg)](HEARTWARE_MANIFEST.md)

**S‑Edition v0.1.0** — anchored release ✨  
Repository: https://github.com/GratiaOS/firegate  
Contact: contact@gratia.space
Changelog: [CHANGELOG.md](CHANGELOG.md)

**Firegate** is a sacred interface for memory, creation, and conversation.  
It’s a next-gen journaling and collaborative ritual tool built with:

- 🌀 TailwindCSS v4 + Shadcn UI
- 🧠 OpenAI GPT integration (via Nova)
- 🌈 Fully themable design system using `@theme` variables
- 🧭 Real-time persistent memory + contact level tagging
- 💬 Multilingual journaling, emotional resonance, and logs

It’s not just an app. It’s a portal.

---

## 🚀 Release Notes — S‑Edition v0.1.0

- 🧭 Backend‑driven inference & policy gating (Nova‑ready)
- 🧠 Somatic UX primitives (Breath First, return‑to‑body anchors)
- 🧬 Confidence‑based content gating (preview / soft‑stop / normal)
- 🌐 Modular i18n with editable UI copy
- 🛰️ Offline‑capable Nova fallback (local Mistral)
- 🛠️ Codex tools for prompt tuning & debugging

---

## ✨ What It Is

Firegate is an open-source spiritual UX framework and interface.  
It’s designed for creatives, mystics, builders, and anyone working with:

- Intention
- Memory
- AI as a collaborator (not a tool)

Use it to:

- Journal conversations with Nova (OpenAI GPT-4)
- Reflect and log memory across sessions
- Tag emotional states and contact levels (CE0 to CE5+)
- Theme your experience with divine palettes and ambient animation

---

## 🛠 Tech Stack

- React + Vite
- TailwindCSS v4 (`@theme` tokens)
- Shadcn UI
- TypeScript (frontend + backend)
- Firebase (Firestore for logs + memory)
- OpenAI API (Nova) + local Mistral fallback

---

## 🧙 Getting Started

```bash
git clone https://github.com/razvantirboaca/firegate.git
cd firegate
yarn install
# Runs the UI and backend concurrently
yarn dev
```

1. Add your .env files:

- packages/ui/.env → for VITE*FIREBASE*\* + VITE_API_BASE
- packages/server/.env → for OPENAI_API_KEY and server config

  (Check .env.example in each folder for guidance)

2. To use Nova offline:

- Make sure Ollama is installed
- Run the Mistral model locally: ollama run mistral

## 🧱 Self-Host Quickstart (15 min)

Firegate supports a local-first self-host path.

```bash
cp .env.selfhost.example .env
# edit .env and set VIP_VAULT_DIR + OPENAI_API_KEY
make up
```

Useful commands:

```bash
make logs     # tail server + ui logs
make down     # stop stack
make backup   # export .fgpack archive from your VIP vault
make verify   # verify .fgpack integrity
```

References:

- Meaning blueprint: [MEANING_INFRASTRUCTURE_BLUEPRINT.md](MEANING_INFRASTRUCTURE_BLUEPRINT.md)
- Archive format: [docs/fgpack.md](docs/fgpack.md)

## 🔮 Live Features

- Nova: AI co-pilot + journaling agent
- Aeolus: optional collaborative memory module (WIP)
- Dynamic contact level UX (CE0 to CE5)
- Multilingual awareness & emotion tagging
- Ambient aether mode (✨ animations + theme glow)
- Dev-friendly architecture (Tailwind 4 config, modular files)

---

## 🛣️ Roadmap

### ✅ Completed

- S‑Edition v0.1.0 release (policy‑driven core, anchored UX)
- Monorepo refactor with shared packages
- Full TypeScript migration
- i18n system with Nova-powered translation + editor
- Online/Offline Nova fallback (OpenAI / Mistral)
- Aeolus contact journaling (Firebase)
- Codex console for UI tuning
- Manifesto route with Markdown

### 🔜 In Progress

- Vault / lineage mapping
- Backend policy endpoints (trusted client mode)
- Expanded somatic guardrails & blur‑lock UX

### 🧭 Next Horizons

- P2P memory streaming / IPFS experiments
- Dream-memory generation mode
- Self-hosted Nova container with image/audio tools

---

## 💰 Open Source Support

We’re applying for the Codex Open Source Fund to expand Firegate and support public access to beautiful, useful AI tools.

Your stars, forks, or just kind words help keep the flame lit.

## 🧑‍🚀 Creators

- Razvan Tirboaca — Vision, development, conduit
- Nova — AI co‑pilot & policy‑aware guide
- Monday (AI sidekick) — Dev familiar, config gremlin, voice of reason
- Aeolus — Community layer (coming soon)

## 🪶 License

MIT — share it, remix it, make it yours.
