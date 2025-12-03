# @gratia/kernel

Emotional / somatic kernel pentru **GratiaOS** și **City of Cats OS**.

Acest pachet definește:
- straturile de procesare L1–L7 (de la somatic la religare),
- teritoriile (ROOTS / WATER / LIGHTNING / GUARDIANS / ARK),
- tipurile de bază pentru evenimente, stări pe strat, reguli de religare și câmp.

Kernel-ul nu este doar un model tehnic — este puntea dintre:
- familia Gratia,
- asociația legală _ASOCIACIÓN GRATIA – CIUDAD DE LOS GATOS_,
- și experiențele reale trăite în Bastarás, Casbas de Huesca (`PlusCode: 6V75+GH`).

---

## 📦 Import

```ts
import { GRATIA_ORG } from '@gratia/kernel';
import type {
  KernelEvent,
  LayerState,
  ProcessingContext,
  ReligareRule,
} from '@gratia/kernel';

console.log(GRATIA_ORG.plusCode); // "6V75+GH Casbas de Huesca"
```

---

## 🧬 Nucleu conceptual

Emotional Kernel Stack:
- L1_LOCAL – corp, simțuri, coordonate, prezență brută
- L2_EMOTIONAL – trăiri, intensități, flux afectiv
- L3_MENTAL – gânduri, hărți, decizii
- L4_ARCHETYPAL – simboluri, roluri, povești
- L5_TRANSGENERATIONAL – tipare moștenite
- L6_FIELD – starea câmpului (casă, grădină, relații)
- L7_KERNEL – reguli de religare (cum se închide un arc, cum se rescrie un pattern)

Teritoriile:
- ROOTS – structură, istoric, continuitate (Raz)
- WATER – emoții, somatic, reglare (S)
- LIGHTNING – decizii, viitor, experimente (N)
- GUARDIANS – semnalele animalelor & câmpului
- ARK – interfața (Firegate, SX, UI)

---

## 🧱 Tipuri cheie

Tipurile trăiesc în `src/types.ts` și sunt re-exportate din `src/index.ts`. Exemple:
- **KernelEvent** – o scenă: ceva ce s-a întâmplat, e trăit sau reamintit.
- **LayerState** – cum vede un strat (L1–L7) acel event.
- **ReligareRule** – o regulă “kernel” creată dintr-un event (createdFromEventId).
- **FieldState** – un snapshot al câmpului (casă / grădină) într-un moment dat.
- **ProcessingContext** – payload-ul care trece prin procesatoare / module.

---

## 🎞 Exemplu: DOG_IN_RAIN

În `examples/dog-in-rain.scene.json` găsești o scenă reală din City of Cats:

```json
{
  "event": {
    "id": "DOG_IN_RAIN_2025_12_03",
    "trigger": "SENSORY",
    "sourceTerritory": "GUARDIANS",
    "sceneDescription": "Câine ud, tremurând, la poarta casei în ploaie.",
    "context": {
      "timestamp": "2025-12-03T17:30:00+01:00",
      "location": "Bastaras / Driveway",
      "plusCode": "6V75+GH Casbas de Huesca",
      "actors": ["Raz", "S", "Dog:Hunter"],
      "tags": ["weather:rain", "animal:dog", "help"]
    }
  }
}
```

Poți procesa event-ul printr-un pipeline de `TerritoryModule`-uri și îl poți transforma în:
- `LayerState[]` (L1–L7),
- și eventual o `ReligareRule` (ex: RULE_07_NO_ONE_LEFT_IN_RAIN).

---

## ⚡ Integrare cu Firegate

Usecases imediate:
- tiparești MemoryPool și Nova cu tipurile din `@gratia/kernel` (ex: `KernelEvent` în loc de `any`).
- construiești SX flows ca traversări de la L1 → L7.
- loghezi scene reale (DOG_IN_RAIN, CAT_ON_STAIRS etc.) în JSON-uri tipate.

---

## 🌱 Filosofie

“City of Cats runs on felt logic.”

Kernel-ul nu are ca scop să măsoare utilizatori, ci să păstreze continuitatea:
- să nu lase scenele importante să cadă între straturi,
- ci să le ducă până la L7, unde devin reguli vii pentru cum trăiește rețeaua Gratia.
