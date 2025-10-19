# Complete Mathematical Model Extraction - AI Job Automation Risk Calculator

## Core Mathematical Framework

### 1. Survival and Hazard Relationships

**Survival Function (Job Loss Probability):**
```
P_loss(t) = 1 - S(t) = 1 - exp(-∫[0 to t] λ_total(s) ds)
```

**Total Hazard (Stacked Framework):**
```
λ_total(s) = λ_AI(s) + λ_macro(s) + λ_firm(s) + λ_role(s) + λ_personal(s)
```

**AI Hazard Component:**
```
λ_AI(s) = F₀ · e^(-λs) · [max(0, A_job(s)/θ - 1)]^γ · M_fric(s)
```

---

## 2. Capability Growth Functions

### Explicit Capability (AI/Digital Skills)
```
A_explicit(t) = 2^(t / (d_eff / 12))
```
Where:
- t = time in years
- d_eff = effective doubling time in months

**Effective Doubling Time:**
```
d_eff = d_base / (computeMultiplier × domainPace)
```
- d_base = 7 months (baseline from METR benchmarks)
- computeMultiplier = scaling factor (default 1.0, adjustable via slider)
- domainPace = domain-specific learning pace (0.6 to 1.8)

### Tacit Capability (Experience-Based Skills)
```
A_tacit(t) = 1 + δ_tacit · t
```
- δ_tacit = 0.07 (slow linear growth)

### Combined Job Capability
```
A_job(t) = s_e · A_explicit(t) + (1 - s_e) · A_tacit(t)
```
Where s_e = role explicitness (0 to 1)

---

## 3. Role Explicitness Calculation

```
s_e = clamp(0.65 · norm(S_pos) - 0.35 · norm(S_neg) + 0.10, 0, 1)
```

Where:
- **S_pos** = avg(Q1, Q3, Q4, Q5, Q6, Q8)
- **S_neg** = avg(Q7, Q9)
- **norm(x)** = clamp(toScore(x) / 4, 0, 1)
- **toScore(x)** = converts Likert 1-5 to 0-4 scale

---

## 4. Friction Decay Parameter

```
λ = clamp(0.02 + adjustments, 0.005, 0.05)
```

**Adjustments:**
- +0.01 × (norm(Q14) - 0.5)  [Company AI adoption readiness]
- +0.01 × (norm(Q17) - 0.5)  [IT infrastructure]
- +0.005 × (norm(Q15) - 0.5) [Labor cost pressure]
- +0.005 × (norm(Q16) - 0.5) [Labor market tightness]
- -0.01 × (norm(Q12) - 0.5)  [Physical presence]
- -0.01 × (norm(Q10) - 0.5)  [Human relationships]

---

## 5. Domain Pace Calculation

```
pace = clamp(1.0 + adjustments, 0.6, 1.8)
```

**Adjustments:**
- +0.20 × (norm(Q2) - 0.5)  [Data availability]
- +0.15 × (norm(Q17) - 0.5) [IT infrastructure]
- +0.15 × (norm(Q14) - 0.5) [Company AI adoption]
- +0.10 × (norm(Q8) - 0.5)  [Feedback loop speed]
- +0.10 × (norm(Q6) - 0.5)  [Task standardization]

---

## 6. Hazard Multipliers

### Answer Coding
```
codeAnswer(qid, raw):
  if raw is 1-5: return raw - 3  (yields -2 to +2)
  if raw is boolean: return ±1
  else: return 0
```

### Amplification and Friction Multipliers
```
sumAmp = Σ(w_amp[i] × x[i]) for all questions
sumFric = Σ(w_fric[i] × x[i]) for all questions

sumAmp = clamp(sumAmp, -2.0, +2.0)
sumFric = clamp(sumFric, -2.0, +2.0)

ampMult = e^(sumAmp)    [range: ~0.14× to ~7.4×]
fricMult = e^(sumFric)  [range: ~0.14× to ~7.4×]
```

### Other Friction Multipliers
```
M_fric(t) = questionMultiplier × drag × seniorityMultiplier
```

Where:
- **questionMultiplier** = ampMult × fricMult
- **drag** = 1 / (1 + κ × frictionStock / 5)
  - κ = 0.3 (baseline friction damping)
  - frictionStock = 3.0 (constant)
- **seniorityMultiplier** = 1 - hazardShield
  - hazardShield varies by seniority level

---

## 7. Question Weights for Technical Feasibility

### QUESTION_WEIGHTS (affects Blue Curve - Technical Feasibility)

**High-Risk Amplifiers (amp):**
- Q1: +0.80  [AI Performance - better AI = more risk]
- Q2: +0.40  [Data Availability - more data = easier automation]
- Q3: +0.35  [Benchmark Clarity - clear metrics = easier automation]
- Q4: +0.55  [Task Digitization - more digital = more automatable]
- Q6: +0.45  [Task Standardization - standardized = risky]
- Q8: +0.45  [Feedback Loop Speed - fast feedback helps AI learn]

**Protective Factors (fric):**
- Q5: -0.50  [Task Decomposability - complex = protective]
- Q7: -0.50  [Context Dependency - high context = protective]
- Q9: -0.40  [Tacit Knowledge - more tacit = protective]
- Q10: -0.45 [Human Relationships - more relationships = protective]
- Q11: -0.85 [Union/Labor Protections - strong unions = protective]
- Q13: -0.35 [Trust Requirements - high trust needs = protective]

**Reverse Scale (amp):**
- Q12: -0.60 [Physical Presence - more physical = protective]

---

## 8. Implementation Delay (Green Curve)

```
delayScore = Σ(IMPLEMENTATION_WEIGHTS[i] × x[i])
delayScore = clamp(delayScore, -2.0, +2.0)

delay = 1.75 - (delayScore × 1.25)
delay = clamp(delay, 0.5, 3.0)

final_delay = clamp(delay + delayShift, 0.4, 4.0)
```

### IMPLEMENTATION_WEIGHTS:
- Q14: +0.40  [Company AI Adoption - Leading Edge = less delay]
- Q15: +0.30  [Labor Cost Pressure - High pressure = less delay]
- Q16: -0.35  [Labor Market Tightness - Difficult hiring = more delay]
- Q17: +0.35  [IT Infrastructure - Cutting Edge = less delay]
- Q19: -0.25  [AI Complementarity - Amplify Only = more delay]
- Q21: -0.25  [Job Performance - Top 10% = more delay]

**Formula yields:**
- High positive delayScore → Low delay (0.5-1.0 years)
- Low/negative delayScore → High delay (2.0-3.0 years)

---

## 9. Re-employment Probability

```
reemployScore = Σ(REEMPLOYMENT_WEIGHTS[i] × x[i])
reemployScore = clamp(reemployScore, -2.0, +2.0)

base_probability = 0.6 + (reemployScore × 0.2)
```

**Timing Penalty:**
```
if medianTechYears < 3:  timingPenalty = 0.30
if 3 ≤ medianTechYears < 7:  timingPenalty = 0.15
if 7 ≤ medianTechYears < 12: timingPenalty = 0.05
if medianTechYears ≥ 12: timingPenalty = 0.00

probability = (base_probability - timingPenalty) × reemploymentBoost
probability = clamp(probability, 0.1, 0.85)
```

### REEMPLOYMENT_WEIGHTS:
- Q18: +0.50  [Skill Transferability]
- Q20: +0.50  [Adaptability/Learning Speed]

---

## 10. Capability Gate Steepness (Timing Shift)

```
k_eff = k_base × e^(sumK)
```

Where:
```
sumK = Σ(K_WEIGHTS[i] × x[i])
sumK = clamp(sumK, -1.0, +1.0)
k_base = γ = 1.2 (baseline sensitivity to surplus capability)
```

### K_WEIGHTS (affects Blue Curve timing):

**Accelerators (higher = faster automation):**
- Q1: +0.20  [AI Performance]
- Q2: +0.10  [Data Availability]
- Q3: +0.10  [Benchmark Clarity]
- Q4: +0.15  [Task Digitization]
- Q8: +0.12  [Feedback Loop Speed]

**Decelerators (higher = slower automation):**
- Q5: -0.20  [Task Decomposability]
- Q6: -0.20  [Task Standardization]
- Q7: -0.20  [Context Dependency]
- Q9: -0.15  [Tacit Knowledge]
- Q10: -0.15 [Human Relationships]
- Q12: -0.15 [Physical Presence]
- Q13: -0.15 [Trust Requirements]

---

## 11. Seniority Profiles

| Level | Label | θ Lift | Hazard Shield | Delay Shift | Reemployment Boost |
|-------|-------|--------|---------------|-------------|-------------------|
| 1 | Entry | 0.000 | 0.00 | -0.4 | 1.00 |
| 2 | Mid-Level | 0.015 | 0.05 | -0.1 | 1.03 |
| 3 | Senior | 0.035 | 0.10 | +0.2 | 1.06 |
| 4 | Lead/Principal | 0.055 | 0.14 | +0.4 | 1.08 |
| 5 | Executive | 0.070 | 0.18 | +0.6 | 1.10 |

---

## 12. Baseline Parameters

| Parameter | Symbol | Value | Description |
|-----------|--------|-------|-------------|
| Base Hazard Scale | F₀ | 0.015 | Baseline annual displacement pressure |
| Entry Theta | θ_base | 0.94 | Entry-level coverage bar (~94%) |
| Capability Sensitivity | γ | 1.2 | Sensitivity to surplus capability |
| Friction Damping | κ | 0.3 | Baseline friction damping |
| Friction Stock | - | 3.0 | Constant friction value |
| Base Doubling | d_base | 7 months | METR baseline doubling time |
| Tacit Drift | δ_tacit | 0.07 | Annual tacit skill growth rate |

**Effective Theta:**
```
θ_effective = clamp(θ_base + thetaLift, 0.6, 1.4)
```

**Effective Gamma:**
```
γ_effective = clamp(k_eff(γ, answers), 0.8, 2.5)
```

---

## 13. Complete Questionnaire

### AI & Task Characteristics (Q1-Q4)

**Q1. AI Performance**
- Scale: 1=Far Behind → 5=State-of-the-Art
- Weight: amp +0.80, K +0.20

**Q2. Data Availability**
- Scale: 1=Almost None → 5=Extensive
- Weight: amp +0.40, K +0.10

**Q3. Benchmark Clarity**
- Scale: 1=Very Difficult → 5=Very Easy
- Weight: amp +0.35, K +0.10

**Q4. Task Digitization**
- Scale: 1=0-20% → 5=81-100%
- Weight: amp +0.55, K +0.15

### Task Structure & Adaptability (Q5-Q9)

**Q5. Task Decomposability**
- Scale: 1=Highly Structured → 5=Very Complex
- Weight: fric -0.50, K -0.20

**Q6. Task Standardization**
- Scale: 1=Highly Standardized → 5=Highly Variable
- Weight: amp +0.45, K -0.20

**Q7. Context Dependency**
- Scale: 1=Minimal → 5=Critical
- Weight: fric -0.50, K -0.20

**Q8. Feedback Loop Speed**
- Scale: 1=Months/Years → 5=Minutes/Instant
- Weight: amp +0.45, K +0.12

**Q9. Tacit Knowledge**
- Scale: 1=Fully Documented → 5=Mostly Tacit
- Weight: fric -0.40, K -0.15

### Human & Organizational Factors (Q10-Q13)

**Q10. Human Judgment & Relationships**
- Scale: 1=Minimal → 5=Essential
- Weight: fric -0.45, K -0.15

**Q11. Union/Labor Protections**
- Scale: 1=Very Weak → 5=Very Strong
- Weight: fric -0.85

**Q12. Physical Presence**
- Scale: 1=None → 5=Essential
- Weight: amp -0.60, K -0.15

**Q13. Trust Requirements**
- Scale: 1=Not Important → 5=Critical
- Weight: fric -0.35, K -0.15

### Company & Industry Context (Q14-Q17)

**Q14. Company AI Adoption Readiness**
- Scale: 1=Resistant → 5=Leading Edge
- Weight: Implementation +0.40

**Q15. Labor Cost Pressure**
- Scale: 1=Not Sensitive → 5=Extremely Sensitive
- Weight: Implementation +0.30

**Q16. Labor Market Tightness**
- Scale: 1=Very Easy to Hire → 5=Very Difficult to Hire
- Weight: Implementation -0.35

**Q17. IT Infrastructure**
- Scale: 1=Very Outdated → 5=Cutting Edge
- Weight: Implementation +0.35

### Personal Adaptability (Q18-Q21)

**Q18. Skill Transferability**
- Scale: 1=Highly Specific → 5=Highly Transferable
- Weight: Reemployment +0.50

**Q19. AI Complementarity**
- Scale: 1=Replace Only → 5=Amplify Only
- Weight: Implementation -0.25

**Q20. Adaptability/Learning**
- Scale: 1=Very Slow → 5=Very Fast
- Weight: Reemployment +0.50

**Q21. Job Performance**
- Scale: 1=Below Average → 5=Top Performer
- Weight: Implementation -0.25

---

## 14. Chart Calculations

### Cumulative Risk from Hazard Series
```
cumulative_risk(t) = 1 - exp(-Σ[hazard(t_i) × dt])
```

Where hazard series is computed at discrete time steps with dt increment.

### Two Curves Generated:

**Blue Curve - Technical Feasibility:**
```
risk_tech(t) = 1 - exp(-∫[0 to t] λ_AI(s) ds)
```

**Green Curve - Actual Job Loss:**
```
risk_actual(t) = risk_tech(t - implementation_delay)
```
The green curve is the blue curve shifted right by the implementation delay period.

---

## 15. Section Scores (Display Only)

These are calculated for display but don't directly affect the hazard calculation:

**AI Readiness Score:**
```
aiReadiness = (Q1 + Q2 + Q3 + Q4) / 4
Display = (aiReadiness × 20) / 100
```

**Task Adaptability Score:**
```
taskAdapt = (Q5 + Q6 + Q7 + Q8 + Q9) / 5
Display = ((6 - taskAdapt) × 20) / 100
```

**Friction Score:**
```
friction = (Q10 + Q11 + Q12 + Q13) / 4
Display = (friction × 20) / 100
```

**Firm Readiness Score:**
```
firmReadiness = (Q14 + Q15 + Q16 + Q17) / 4
Display = (firmReadiness × 20) / 100
```

**Personal Adaptability Score:**
```
personalAdapt = (Q18 + Q19 + Q20 + Q21) / 4
Display = (personalAdapt × 20) / 100
```

---

## 16. Timeline Calculations

The system finds years where probability crosses specific thresholds (25%, 50%, 75%, 90%) and displays projected calendar years based on current year 2025.65.

**Example:**
- If 50% technical automation risk occurs at t=5 years
- Display: "2030.7 - 50% risk AI can technically automate role"

---

## Summary of Mathematical Flow

1. **User inputs** → 21 questions (Likert 1-5) + seniority level (1-5)
2. **Questions coded** → -2 to +2 scale via codeAnswer()
3. **Derived parameters calculated:**
   - s_e (explicitness)
   - λ (friction decay)
   - domainPace
   - ampMult, fricMult (hazard multipliers)
   - implementation delay
   - reemployment probability
4. **Capability growth** → A_job(t) from explicit + tacit mix
5. **Hazard function** → λ_AI(t) using surplus capability
6. **Cumulative risk** → Integration of hazard over time
7. **Two curves generated:**
   - Blue: Technical feasibility
   - Green: Actual job loss (delayed by implementation period)
8. **Timeline milestones** → Years to reach 25%, 50%, 75%, 90% risk
