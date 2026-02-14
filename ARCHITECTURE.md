# FoodFinder.AI — Project Architecture & Execution Flow

**Version 1.0**

---

## 1. System Role Clarification

Four distinct system components:

| #   | Component                  | Responsibility                                                                                           |
| --- | -------------------------- | -------------------------------------------------------------------------------------------------------- |
| 1   | **Web Frontend**           | Camera, scan UI, overlay, result rendering, Eleven Labs playback (Vite app; mobile demo via Vite plugin) |
| 2   | **Backend API**            | Endpoints, image upload, Gemini + Eleven Labs integration, orchestration                                 |
| 3   | **Gemini (AI Extraction)** | Image → structured ingredient list only                                                                  |
| 4   | **Scoring Engine**         | Deterministic risk scoring (no AI, no CV)                                                                |

---

## 2. Scoring Engine — No Computer Vision

- Does **not** process images, call Gemini, or use AI/CV.
- **Input:** Structured ingredient list, e.g. `["maltodextrin", "peanuts", "soy lecithin"]`.
- **Behavior:** Compare vs user profile, apply weight matrix, compute risk, explanations.
- **Output:** Risk classification, health alignment score, conflict explanations.

Purely deterministic logic.

---

## 3. Where Gemini Is Used

**Gemini = ingredient extraction only.**

- **Does:** Image → Text → Structured ingredient list.
- **Does not:** Calculate risk, assign severity, personalize, or determine health score.

Gemini output is passed to the Scoring Engine.

---

## 4. User Flow (Simplified)

1. User opens camera view.
2. User points camera at ingredient label.
3. User taps **Analyze**.
4. Frontend captures image.
5. Backend sends image to **Gemini**.
6. Gemini returns ingredient list.
7. Backend sends **ingredient list + user profile** to **Scoring Engine**.
8. Scoring engine returns risk classification, health alignment score, conflict explanations.
9. Web app renders results (optionally over camera). **Eleven Labs** can read out results. _Mobile demo_ = same web app run or built via Vite plugin (no native mobile framework).

---

## 5. “Augmented Reality” Effect (MVP)

- Camera preview + overlay + single **Analyze** tap.
- One Gemini call per analysis; scoring engine run once.
- Overlay results for an AR-like experience without continuous CV.

---

## 6. Responsibility Matrix

| Role               | Focus                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| **Frontend**       | Camera, scan button, overlay UI, result rendering, TTS playback                                  |
| **Backend**        | API, image handling, Gemini + Eleven Labs, call Scoring Engine, return response                  |
| **AI Integration** | Gemini extraction prompt, JSON structured output, extraction error handling                      |
| **Scoring Engine** | Weight matrix, ingredient metadata, conflict detection, risk formula, explainability, unit tests |

---

## 7. Data Flow

```
User → Web Frontend → Backend → Gemini (extraction) → Backend → Scoring Engine → Backend → Web Frontend → User
```

---

## 8. Principle

**AI extracts. Logic judges.**

- Gemini = perception (ingredients from image).
- Scoring engine = reasoning (risk from ingredients + profile).

They are separate systems.

---

## Tech Stack

- **Frontend:** TypeScript, Vite, React. Web app only; **mobile demo** via **vite-plugin-multi-device** (no React Native/Expo/Capacitor).
- **Backend:** Node + TypeScript.
- **DB:** Supabase.
- **AI:** Gemini (extraction).
- **TTS:** Eleven Labs (read-out of scan results).
