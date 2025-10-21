# Mathematical Model Specification — AI Job Automation Risk Calculator

This document specifies the equations used in the calculator and reflects the audited, friction-only design: the METR doubling period is fixed and never modified by questions; domain effects act through capability penalties and feasibility gates, not through time scaling.

---

## 1. Survival and Hazard

- Survival complement (job loss probability): `P_loss(t) = 1 - S(t) = 1 - exp(-∫_0^t λ_total(s) ds)`
- Stacked hazard: `λ_total(t) = λ_AI(t) + λ_macro(t) + λ_firm(t) + λ_role(t) + λ_personal(t)`
- AI hazard (logistic gate): `λ_AI(t) = [h_AI / (1 + exp(-γ · (A(t) - θ)))] × M_user`
  - `h_AI` = base annual max hazard
  - `γ` = logistic steepness (clamped to `[3.0, 16.0]` via kEff in code)
  - `θ` = coverage threshold (Section 4)
  - `M_user` ∈ `[0.33, 3.0]` (bounded multiplier from questions)

---

## 2. METR Capability Engine (Fixed Time Base)

- Capability (max task length) at reliability r:
  - `H_r(t) = [H50_0 · 2^{(t·12)/D_eff}] / [p_domain · f(r)]`
  - `H50_0` = 137 minutes (50% success horizon, GPT‑5 Aug 2025)
  - `D_eff = D_base = 7` months (METR doubling; fixed, not modified by questions or sliders)
  - `f(r) = exp(-σ · logit(r))` (reliability factor fitted from METR H50/H80; `σ ≈ -1.19`)
  - `p_domain` = domain penalty (Section 3)

Notes
- Time scale is fixed to METR: doubling never changes due to answers. Domain effects act as capability penalties, not time stretching.

---

## 3. Domain Alignment and Friction (Capability Penalty Only)

### 3.1 Domain alignment penalty (structure/mismatch)
- Weights reflect how METR’s software tasks transfer:
  - Q4: `+0.28` (Task digitization)
  - Q5: `+0.24` (Task decomposability)
  - Q6: `+0.22` (Task standardization)
  - Q7: `−0.32` (Context dependency)
  - Q9: `−0.28` (Tacit knowledge)
  - Q10: `−0.34` (Human judgment & relationships)
  - Q11: `−0.38` (Physical presence)
- Combine to `weightedSum` (answers coded to `−2…+2` then weighted, clamped to `[−3, +3]`).
- Penalty and alignment:
  - `p_align = clamp(exp(-weightedSum), 0.5, 3.0)`
  - `alignment ∈ [0,1] = clamp(0.5 + 0.18·weightedSum, 0, 1)`

### 3.2 Domain friction (Q7/Q9/Q10/Q11 and slider)
- Friction only ever increases penalty (never decreases below 1.0):
  - Inferred: `fric_infer = clamp(1.0 + 0.18·(norm(Q7)−0.5) + 0.20·(norm(Q9)−0.5) + 0.24·(norm(Q10)−0.5) + 0.28·(norm(Q11)−0.5), 1.0, 2.0)`
  - Slider: `fric_slider ∈ [1.0, 2.0]` (baseline 1.0)
- Effective capability penalty:
  - `p_domain = clamp(p_align · fric_infer · fric_slider, 0.5, 3.0)`

Result
- Domain characteristics slow capability via a penalty multiplier in `H_r(t)`. They do not modify the doubling period.

---

## 4. Coverage Threshold θ (Feasibility Gate)

- Formula: `θ = θ_base + thetaLift + alignmentShift + explicitnessShift − feasibilityBonus`, clamped to `[0.35, 0.72]`.
- Components:
  - `θ_base = 0.50` (entry baseline)
  - `thetaLift` from seniority profile
  - `alignmentShift = 0.12·(0.5 − alignment)` (harder domains raise θ)
  - `explicitnessShift = 0.10·(0.5 − s_e)` (less explicit roles raise θ)
  - `feasibilityBonus = 0.05·(norm(Q2)−0.5) + 0.04·(norm(Q6)−0.5) + 0.03·(norm(Q8)−0.5)`

Interpretation
- Q2/Q6/Q8 lower θ (automation becomes viable at lower capability); they do not change time.

---

## 5. Task Buckets and Weights (Personalization)

- Five duration buckets: `<5m`, `5–15m`, `15–60m`, `1–3h`, `>3h`.
- Gate: `G_i(H) = 1 / (1 + exp(−(ln H − ln L_i)/s))`.
- Readiness: `A(t) = Σ_i w_i · G_i(H_r(t))`.
- Personalization drivers:
  - Seniority level (entry → executive)
  - Q5 (decomposability), Q6 (standardization), Q7 (context)
  - Structured/explicit roles shift weight to short buckets; complex/context-heavy roles shift to longer buckets.

---

## 6. Implementation Delay and Other Channels

- Implementation delay (green curve shift): based on company/market and retention factors only.
  - Q12: `+0.40` (AI adoption; higher → less delay)
  - Q13: `+0.30` (Labor cost pressure; higher → less delay)
  - Q14: `−0.35` (Labor market tightness; higher → more delay)
  - Q15: `+0.35` (IT infrastructure; higher → less delay)
  - Q18: `−0.35` (Top performers retained longer → more delay)
- Hazard amplitude/friction channels remain as in the code, bounded into `M_user ∈ [0.33, 3.0]`.

---

## 7. Constants and Guards

- Doubling time: `D_eff = 7` months (METR fixed; not altered by Qs or sliders).
- Domain friction: `fric_infer, fric_slider ≥ 1.0` (never speeds up vs METR).
- Reliability: `f(r) = exp(−σ · logit(r))`, examples: `f(0.95) ≈ 33.1`, `f(0.99) ≈ 235`.
- Penalty clamps: `p_domain ∈ [0.5, 3.0]`.
- θ clamps: `[0.35, 0.72]`. γ clamps: `[3.0, 16.0]`.

---

## 8. Question Routing (Audit Summary)

- Time (D_eff): none (fixed to METR).
- Capability penalty (p_domain): Q4, Q5, Q6, Q7, Q9, Q10, Q11 for alignment; Q7, Q9, Q10, Q11 and slider for friction (multiplicative; ≥1.0).
- θ feasibility: Q2, Q6, Q8 only (negative bonus lowers θ).
- Implementation delay: Q12, Q13, Q14, Q15, Q18 only.
- Task weights: seniority, Q5, Q6, Q7.

This routing ensures no question or slider inadvertently speeds or slows the METR doubling clock; all domain effects act through capability and feasibility gates or through implementation delay.

