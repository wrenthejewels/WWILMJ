# Complete Mathematical Model Extraction - AI Job Automation Risk Calculator
## METR-Powered Model (Updated)

---

## Core Mathematical Framework

### 1. Survival and Hazard Relationships

**Survival Function (Job Loss Probability):**
```
P_loss(t) = 1 - S(t) = 1 - exp(-âˆ«[0 to t] Î»_total(s) ds)
```

**Total Hazard (Stacked Framework):**
```
Î»_total(s) = Î»_AI(s) + Î»_macro(s) + Î»_firm(s) + Î»_role(s) + Î»_personal(s)
```

**AI Hazard Component (NEW - Logistic Gate):**
```
Î»_AI(t) = [h_AI / (1 + exp(-Î³ Â· (A(t) - Î¸_0)))] Ã— userMult
```

Where:
- h_AI = 0.40 (max base annual hazard, 40% per year at full automation)
- Î³ = 8.0 baseline (logistic steepness, dynamically adjusted via kEff() and clamped to [3.0, 16.0])
- Î¸_0 = 0.50 baseline (task readiness threshold, dynamically adjusted and clamped to [0.35, 0.72])
- userMult âˆˆ [0.33, 3.0] (bounded multiplier from questions)
- Effective max clamped to 0.95 yrâ»Â¹

**Dynamic Adjustments:**

Î³ (Logistic Steepness):
```
Î³ = kEff(8.0, answers) = 8.0 Ã— exp(sumK)
sumK = Î£ K_WEIGHTS[i] Ã— x[i], clamped to [-1.0, +1.0]
Î³ = clamp(Î³, 3.0, 16.0)

K_WEIGHTS (affects curve steepness):
Accelerators: Q1: +0.20, Q2: +0.10, Q3: +0.10, Q4: +0.15, Q8: +0.12
Decelerators: Q5: -0.20, Q6: -0.20, Q7: -0.20, Q9: -0.15, Q10: -0.15, Q11: -0.15
```

Î¸ (Coverage Threshold):
```
Î¸ = Î¸_base + thetaLift + alignmentShift + explicitnessShift - feasibilityBonus
alignmentShift = 0.12 Ã— (0.5 - domainAlignment)
explicitnessShift = 0.10 Ã— (0.5 - s_e)
feasibilityBonus = 0.05Ã—(norm(Q2)-0.5) + 0.04Ã—(norm(Q6)-0.5) + 0.03Ã—(norm(Q8)-0.5)
Î¸ = clamp(Î¸, 0.35, 0.72)

Where:
- Î¸_base = 0.50 (Entry level baseline)
- thetaLift from seniority profile (see section 8)
- domainAlignment âˆˆ [0, 1] from domain mismatch calculation
- s_e = explicitness score from questions
- feasibilityBonus: Data-rich (Q2), standardized (Q6), fast-feedback (Q8) jobs
  can be automated at LOWER AI capability (lower Î¸ means easier to automate)
- Negative bonus (subtracts from Î¸) = easier automation at lower capability
```

---

## 2. METR Capability Engine

### AI Capability Function (Maximum Task Length)

```
H_r(t) = [H_{50,0} Ã— 2^(months_elapsed / D_eff)] / [p_domain Ã— f(r)]
```

Where:
- **H_{50,0}** = 137 minutes (baseline max task length at 50% reliability, GPT-5 Aug 2025)
- **months_elapsed** = t Ã— 12 (time in months)
- **D_eff** = D_base Ã— domainFriction Ã— industryFriction
- **D_base** = 7 months (METR baseline doubling time)
- **p_domain** âˆˆ [0.5, 3.0] (domain alignment penalty; dampens capability for tacit or physical work)
- **f(r)** = exp(-Ïƒ Â· logit(r)) (reliability adjustment factor, logistic calibration)

**Domain Alignment Penalty Calculation:**
```
DOMAIN_ALIGNMENT_WEIGHTS:
- Q4: +0.28  [Task digitization]
- Q5: +0.24  [Task decomposability]
- Q6: +0.22  [Task standardization]
- Q7: -0.32  [Context dependency]
- Q9: -0.28  [Tacit knowledge]
- Q10: -0.34 [Human judgment & relationships]
- Q11: -0.38 [Physical presence]

weightedSum = Î£(DOMAIN_ALIGNMENT_WEIGHTS[i] Ã— x[i])
weightedSum = clamp(weightedSum, -3.0, +3.0)
p_domain = clamp(exp(-weightedSum), 0.5, 3.0)
domainAlignment = clamp(0.5 + 0.18 Ã— weightedSum, 0, 1)
```
Higher p_domain (closer to 3.0) means AI is less capable for this domain (more penalty).
Lower p_domain (closer to 0.5) means AI is highly capable for this domain (less penalty).
- **Ïƒ** â‰ˆ -1.19 (fitted from METR's H50/H80 ratio)
- **r** = 0.95 (95% reliability target, default)

**Effective Doubling Time:**
```
D_eff = D_base Ã— domainFriction
```

Where:
- **D_base** = 7 months (METR baseline - observed frontier capability growth)
- **domainFriction** âˆˆ [1.0, 2.0] (domain-specific barriers)
  - Floor at 1.0: Cannot be faster than METR's observed frontier
  - Ceiling at 2.0: Maximum 2Ã— slower for highly mismatched domains
- **domainFriction** = inferredDomainFriction(Q7, Q9, Q10, Q11) Ã— slider
- Higher friction â†’ longer doubling time â†’ slower capability transfer to this domain

**Reliability Factor (Logistic Calibration):**
```
f(r) = exp(-Ïƒ Â· logit(r))
where logit(r) = ln(r / (1-r))
and Ïƒ = ln(H_{80,0} / H_{50,0}) / logit(0.8) â‰ˆ -1.19

Calibration anchors:
H_{50,0} = 137 minutes (50% reliability horizon, GPT-5 Aug 2025)
H_{80,0} = 26.37 minutes (80% reliability horizon, GPT-5 Aug 2025)

Examples:
f(0.50) = 1.00   (no adjustment - baseline)
f(0.80) â‰ˆ 5.19   (requires ~5.2Ã— more capability, validated by H50/H80 ratio)
f(0.95) â‰ˆ 33.1   (requires ~33Ã— more capability)
f(0.99) â‰ˆ 235    (requires ~235Ã— more capability)
```

**Effect on H_r(t):**
Since we divide by f(r), higher reliability requirements reduce the effective task horizon:
- H_r(0, r=0.50) = 137 min (baseline)
- H_r(0, r=0.80) = 26.4 min (can only handle shorter tasks)
- H_r(0, r=0.95) = 4.1 min (much more restrictive)
- H_r(0, r=0.99) = 0.6 min (extremely restrictive)

**Key Property:** Higher H_r(t) = higher AI capability (can handle longer/harder tasks)

---

## 3. Task Bucket Model

### Logistic Gate Function

```
G(H, L_i, s) = 1 / (1 + exp(-(ln(H) - ln(L_i)) / s))
```

Where:
- **H** = H_r(t) (current AI capability in minutes)
- **L_i** = task duration threshold for bucket i (minutes)
- **s** = 0.45 (softness parameter, controls gate steepness)

**Interpretation:** G(H, L_i, s) = probability AI can complete tasks of duration L_i

### AI Readiness (Bounded [0,1])

```
A(t) = Î£ w_i Â· G(H_r(t), L_i, s)
```

Subject to: Î£ w_i = 1.0

**Task Bucket Thresholds (Fixed):**

| Bucket | L_i (min) | Task Type |
|--------|-----------|-----------|
| 1 | 2.5 | <5 min (quick tasks) |
| 2 | 10.0 | 5-15 min (short tasks) |
| 3 | 37.5 | 15-60 min (medium tasks) |
| 4 | 120.0 | 1-3 hr (long tasks) |
| 5 | 360.0 | >3 hr (very long tasks) |

**Personalized Task Weights (w_i):**

The weights are **dynamically calculated** based on seniority and answers to Q5, Q6, Q7:

```
Baseline weights: [0.25, 0.35, 0.25, 0.10, 0.05]

1. Seniority shift (entry â†’ exec):
   seniorityShift = (level - 1) / 4
   w[0] -= 0.15 Ã— seniorityShift  (reduce <5min)
   w[1] -= 0.15 Ã— seniorityShift  (reduce 5-15min)
   w[2] += 0.05 Ã— seniorityShift  (increase 15-60min)
   w[3] += 0.15 Ã— seniorityShift  (increase 1-3hr)
   w[4] += 0.10 Ã— seniorityShift  (increase >3hr)

2. Task Decomposability (Q5: 1=complex â†’ 5=structured):
   structureShift = (Q5 - 3) / 2
   w[0] += 0.10 Ã— structureShift  (structured â†’ more quick)
   w[1] += 0.08 Ã— structureShift  (structured â†’ more short)
   w[3] -= 0.10 Ã— structureShift  (complex â†’ more long)
   w[4] -= 0.08 Ã— structureShift  (complex â†’ more very long)

3. Task Standardization (Q6: 1=variable â†’ 5=standardized):
   stdShift = (Q6 - 3) / 2
   w[1] += 0.08 Ã— stdShift   (standardized â†’ more short)
   w[2] += 0.06 Ã— stdShift   (standardized â†’ more medium)
   w[0] -= 0.08 Ã— stdShift   (variable â†’ more quick)
   w[4] -= 0.06 Ã— stdShift   (variable â†’ less very long)

4. Context Dependency (Q7: 1=minimal â†’ 5=critical):
   contextShift = (Q7 - 3) / 2
   w[0] -= 0.08 Ã— contextShift  (high context â†’ fewer quick)
   w[1] -= 0.06 Ã— contextShift  (high context â†’ fewer short)
   w[3] += 0.08 Ã— contextShift  (high context â†’ more long)
   w[4] += 0.06 Ã— contextShift  (high context â†’ more very long)

5. Normalize:
   w_i = max(0.01, w_i)  (ensure positive)
   w_i = w_i / Î£w_i      (ensure sum to 1.0)
```

**Examples:**
- **Entry-level customer service** (seniority=1, Q5=5, Q6=5, Q7=1):
  - Weights: [0.40, 0.35, 0.20, 0.04, 0.01]
  - Most work is quick/short tasks â†’ automates faster

- **Senior software architect** (seniority=4, Q5=2, Q6=2, Q7=4):
  - Weights: [0.12, 0.24, 0.28, 0.24, 0.12]
  - More medium/long tasks â†’ automates slower

**Key Property:** A(t) âˆˆ [0, 1] represents fraction of job tasks AI can perform. Jobs with more long-duration tasks require higher H_r(t) before A(t) crosses automation threshold Î¸.

---

## 4. User Multiplier Calculation

### Answer Coding
```
codeAnswer(qid, raw):
  if raw is 1-5: return raw - 3  (yields -2 to +2)
  if raw is boolean: return Â±1
  else: return 0
```

### Amplification and Friction Multipliers

```
sumAmp = Î£(w_amp[i] Ã— x[i]) for all questions
sumFric = Î£(w_fric[i] Ã— x[i]) for all questions

sumAmp = clamp(sumAmp, -2.0, +2.0)
sumFric = clamp(sumFric, -2.0, +2.0)

ampMult = e^(sumAmp)    [range: ~0.14Ã— to ~7.4Ã—]
fricMult = e^(sumFric)  [range: ~0.14Ã— to ~7.4Ã—]
```

### Final User Multiplier (Bounded)

```
rawMult = ampMult Ã— fricMult Ã— seniorityMult

userMult = clamp(rawMult, 0.33, 3.0)
```

Where:
- **seniorityMult** = 1 - hazardShield
- **hazardShield** varies by seniority level (0.00 to 0.10)

**Note:** Original bounds were [0.5, 2.0] but were widened to [0.33, 3.0] for better slider responsiveness and to eliminate dead zones in question weight space.

---

## 5. Question Weights for Technical Feasibility

### QUESTION_WEIGHTS (affects hazard multipliers)

**High-Risk Amplifiers (amp):**
- Q1: +0.80  [AI Performance - better AI = more risk]
- Q2: +0.40  [Data Availability - more data = easier automation]
- Q3: +0.35  [Benchmark Clarity - clear metrics = easier automation]
- Q4: +0.55  [Task Digitization - more digital = more automatable]
- Q8: +0.45  [Feedback Loop Speed - fast feedback helps AI learn]

**Task Structure:**
- Q5: amp +0.50  [Task Decomposability - 5=Highly Structured (risky), 1=Very Complex (protective)]
- Q6: amp +0.45  [Task Standardization - 5=Highly Standardized (risky), 1=Highly Variable (protective)]

**Protective Factors (fric):**
- Q7: -0.50  [Context Dependency - high context = protective]
- Q9: -0.40  [Tacit Knowledge - more tacit = protective]
- Q10: -0.45 [Human Relationships - more relationships = protective]
- Q11: -0.60 [Physical Presence - more physical = protective]

---

## 6. Implementation Delay (Green Curve Shift)

```
delayScore = Î£(IMPLEMENTATION_WEIGHTS[i] Ã— x[i])
delayScore = clamp(delayScore, -2.0, +2.0)

delay = 1.75 - (delayScore Ã— 1.25)
delay = clamp(delay, 0.5, 3.0)

final_delay = clamp(delay + delayShift, 0.3, 4.0)
```

### IMPLEMENTATION_WEIGHTS:

**Company/Industry Context:**
- Q12: +0.40  [Company AI Adoption - Leading Edge = less delay]
- Q13: +0.30  [Labor Cost Pressure - High pressure = less delay]
- Q14: -0.35  [Labor Market Tightness - Difficult hiring = more delay]
- Q15: +0.35  [IT Infrastructure - Cutting Edge = less delay]

**Job Retention Factors:**
- Q18: -0.35  [Job Performance - Top 10% = more delay]

**Formula yields:**
- High positive delayScore â†’ Low delay (0.5-1.0 years)
- Low/negative delayScore â†’ High delay (2.0-3.0 years)

---

## 7. Re-employment Probability

```
reemployScore = Î£(REEMPLOYMENT_WEIGHTS[i] Ã— x[i])
reemployScore = clamp(reemployScore, -2.0, +2.0)

base_probability = 0.6 + (reemployScore Ã— 0.2)
```

**Timing Penalty:**
```
if medianTechYears < 3:  timingPenalty = 0.30
if 3 â‰¤ medianTechYears < 7:  timingPenalty = 0.15
if 7 â‰¤ medianTechYears < 12: timingPenalty = 0.05
if medianTechYears â‰¥ 12: timingPenalty = 0.00

probability = (base_probability - timingPenalty) Ã— reemploymentBoost
probability = clamp(probability, 0.1, 0.85)
```

### REEMPLOYMENT_WEIGHTS:
- Q16: +0.50  [Skill Transferability]
- Q17: +0.50  [Adaptability/Learning Speed]
- Q18: +0.30  [Job Performance]

---

## 8. Seniority Profiles

| Level | Label | Î¸_0 Lift | Hazard Shield | Delay Shift | Reemployment Boost |
|-------|-------|----------|---------------|-------------|-------------------|
| 1 | Entry | -0.02 | 0.00 | -0.4 | 1.00 |
| 2 | Mid-Level | 0.00 | 0.02 | -0.1 | 1.03 |
| 3 | Senior | 0.03 | 0.05 | +0.2 | 1.06 |
| 4 | Lead/Principal | 0.05 | 0.08 | +0.4 | 1.08 |
| 5 | Executive | 0.08 | 0.10 | +0.6 | 1.10 |

**Note:** In the new model, Î¸_0 Lift is not directly applied. Seniority affects:
- Hazard Shield (reduces userMult via seniorityMult)
- Delay Shift (added to implementation delay)
- Reemployment Boost (multiplies re-employment probability)

---

## 9. Domain Pace Calculation (Industry Friction)

The domain pace calculation determines industry-specific friction that affects the effective doubling time.

**Inferred Base Pace:**
```
pace = clamp(1.0 + adjustments, 0.6, 1.8)
```

**Adjustments:**
- +0.20 Ã— (norm(Q2) - 0.5)  [Data availability]
- +0.15 Ã— (norm(Q17) - 0.5) [IT infrastructure]
- +0.15 Ã— (norm(Q14) - 0.5) [Company AI adoption]
- +0.10 Ã— (norm(Q8) - 0.5)  [Feedback loop speed]
- +0.10 Ã— (norm(Q6) - 0.5)  [Task standardization]

Where: norm(x) = clamp((x - 1) / 4, 0, 1)

**Resolved Domain Pace (from slider):**
```
resolvedDomainPace() = (sliderValue / baseline) Ã— basePace
```
- Slider range: 0.5 to 2.0 (default 1.0)
- Higher value = more friction = slower automation
- This multiplies D_eff (longer doubling time)

**Compute Multiplier (from slider):**
```
resolvedComputeMultiplier() = (sliderValue / baseline) Ã— baseMultiplier
```
- Slider range: 1.5 to 5.0 (default 3.4)
- Higher value = more barriers = slower AI progress
- This also multiplies D_eff (longer doubling time)

---

## 10. Chart Calculations

### Cumulative Risk from Hazard (Simpson's Rule Integration)

```
Risk(t) = 1 - exp(-âˆ«[0 to t] Î»_AI(u) du)
```

**Implementation:** Simpson's rule with n=100 steps:
```
integral = 0
dt = t / n

for i = 0 to n:
  s = i Ã— dt
  rate = Î»_AI(s)

  if i == 0 or i == n:
    integral += rate
  else if i is odd:
    integral += 4 Ã— rate
  else:
    integral += 2 Ã— rate

integral = integral Ã— dt / 3
return 1 - exp(-integral)
```

### Two Curves Generated:

**Blue Curve - Technical Feasibility:**
```
Risk_tech(t) = 1 - exp(-âˆ«[0 to t] Î»_AI(u) du)
```

**Green Curve - Actual Job Loss:**
```
Risk_actual(t) = Risk_tech(t - Î”)

where Î” = implementationDelay
```

**Key Property:** Green curve is Blue curve shifted right by Î” years

---

## 11. Complete Questionnaire

### AI & Task Characteristics (Q1-Q4)

**Q1. AI Performance**
- Scale: 1=Far Behind â†’ 5=State-of-the-Art
- Weight: amp +0.80

**Q2. Data Availability**
- Scale: 1=Almost None â†’ 5=Extensive
- Weight: amp +0.40

**Q3. Benchmark Clarity**
- Scale: 1=Very Difficult â†’ 5=Very Easy
- Weight: amp +0.35

**Q4. Task Digitization**
- Scale: 1=0-20% â†’ 5=81-100%
- Weight: amp +0.55

### Task Structure & Adaptability (Q5-Q9)

**Q5. Task Decomposability**
- Scale: 1=Highly Structured â†’ 5=Very Complex
- Weight: fric -0.50

**Q6. Task Standardization**
- Scale: 1=Highly Standardized â†’ 5=Highly Variable
- Weight: amp +0.45

**Q7. Context Dependency**
- Scale: 1=Minimal â†’ 5=Critical
- Weight: fric -0.50

**Q8. Feedback Loop Speed**
- Scale: 1=Months/Years â†’ 5=Minutes/Instant
- Weight: amp +0.45

**Q9. Tacit Knowledge**
- Scale: 1=Fully Documented â†’ 5=Mostly Tacit
- Weight: fric -0.40

### Human & Organizational Factors (Q10-Q11)

**Q10. Human Judgment & Relationships**
- Scale: 1=Minimal â†’ 5=Essential
- Weight: fric -0.45

**Q11. Physical Presence**
- Scale: 1=None â†’ 5=Essential
- Weight: fric -0.60

### Company & Industry Context (Q12-Q15)

**Q12. Company AI Adoption Readiness**
- Scale: 1=Resistant â†’ 5=Leading Edge
- Weight: Implementation +0.40

**Q13. Labor Cost Pressure**
- Scale: 1=Not Sensitive â†’ 5=Extremely Sensitive
- Weight: Implementation +0.30

**Q14. Labor Market Tightness**
- Scale: 1=Very Easy to Hire â†’ 5=Very Difficult to Hire
- Weight: Implementation -0.35

**Q15. IT Infrastructure**
- Scale: 1=Very Outdated â†’ 5=Cutting Edge
- Weight: Implementation +0.35

### Personal Adaptability (Q16-Q18)

**Q16. Skill Transferability**
- Scale: 1=Highly Specific â†’ 5=Highly Transferable
- Weight: Reemployment +0.50

**Q17. Adaptability/Learning**
- Scale: 1=Very Slow â†’ 5=Very Fast
- Weight: Reemployment +0.50

**Q18. Job Performance**
- Scale: 1=Below Average â†’ 5=Top Performer
- Weight: Implementation -0.35, Reemployment +0.30

---

## 12. Section Scores (Display Only)

These are calculated for display but don't directly affect the METR model:

**AI Readiness Score:**
```
aiReadiness = (Q1 + Q2 + Q3 + Q4) / 4
Display = (aiReadiness Ã— 20) / 100
```

**Task Adaptability Score:**
```
taskAdapt = (Q5 + Q6 + Q7 + Q8 + Q9) / 5
Display = ((6 - taskAdapt) Ã— 20) / 100
```

**Friction Score:**
```
friction = (Q10 + Q11) / 2
Display = (friction Ã— 20) / 100
```

**Firm Readiness Score:**
```
firmReadiness = (Q12 + Q13 + Q14 + Q15) / 4
Display = (firmReadiness Ã— 20) / 100
```

**Personal Adaptability Score:**
```
personalAdapt = (Q16 + Q17 + Q18) / 3
Display = (personalAdapt Ã— 20) / 100
```

---

## 13. Timeline Calculations

The system finds years where probability crosses specific thresholds using binary search:

```
findYearForProbability(targetProb):
  low = 0
  high = 50

  while high - low > 0.1:
    mid = (low + high) / 2
    prob = calculateDisplacementProbability(mid)

    if prob < targetProb:
      low = mid
    else:
      high = mid

  return mid
```

**Milestones calculated:** 25%, 50%, 75%, 90% risk

**Display:** Current year (2025.65) + years_to_milestone

---

## 14. Model Parameters Summary

### METR Capability Engine
```
H_{50,0} = 137 minutes          (baseline 50% task horizon, GPT-5 Aug 2025)
H_{80,0} = 26.37 minutes        (baseline 80% task horizon, GPT-5 Aug 2025)
D_base = 7 months               (METR doubling)
r = 0.95                        (95% reliability target)
Ïƒ â‰ˆ -1.19                       (logistic calibration parameter)
f(0.95) â‰ˆ 33.1                  (reliability factor)
p_domain âˆˆ [0.5, 3.0]           (domain alignment penalty)
```

### Task Buckets
```
L_1 = 2.5 min,   w_1 = 0.25    (<5 min tasks)
L_2 = 10 min,    w_2 = 0.35    (5-15 min tasks)
L_3 = 37.5 min,  w_3 = 0.25    (15-60 min tasks)
L_4 = 120 min,   w_4 = 0.10    (1-3 hr tasks)
L_5 = 360 min,   w_5 = 0.05    (>3 hr tasks)

s = 0.45                        (logistic softness)
```

### Hazard Parameters
```
h_AI = 0.40 yrâ»Â¹               (max base annual hazard)
Î³ = 8.0 baseline               (logistic steepness, dynamically adjusted and clamped to [3.0, 16.0])
Î¸_0 = 0.50 baseline            (readiness threshold, dynamically adjusted and clamped to [0.35, 0.72])
userMult âˆˆ [0.33, 3.0]         (bounded multiplier)
Î»_AI max = 0.95 yrâ»Â¹           (effective max after userMult Ã— h_AI, hard-clamped)
```

**Maximum Hazard Interpretation:**
- Theoretical max: h_AI Ã— userMult_max = 0.40 Ã— 3.0 = 1.20 yrâ»Â¹
- Effective max (clamped): Î»_AI = 0.95 yrâ»Â¹ corresponds to:
  - Half-life â‰ˆ 8.8 months (time for 50% displacement probability)
  - P(loss in 1 year) â‰ˆ 61%
  - P(loss in 2 years) â‰ˆ 85%
- Represents most automation-prone scenario: AI fully capable (A=1.0) + max amplifying factors (userMult=3.0)
- Clamp prevents extreme scenarios from exceeding realistic displacement rates

### Implementation
```
delayBase = 1.75 years
delayRange = [0.3, 4.0] years
```

---

## 15. Mathematical Flow Summary

1. **User inputs** â†’ 21 questions (Likert 1-5) + seniority level (1-5)

2. **Questions coded** â†’ -2 to +2 scale via codeAnswer()

3. **METR capability calculated:**
   - D_eff from compute/domain sliders
   - H_r(t) from METR formula
   - Task gates G(H, L_i, s) for each bucket
   - AI readiness A(t) from weighted sum (bounded [0,1])

4. **Hazard multipliers computed:**
   - ampMult, fricMult from question weights
   - seniorityMult from hazard shield
   - userMult = clamp(ampMult Ã— fricMult Ã— seniorityMult, 0.33, 3.0)

5. **Hazard function evaluated:**
   - Î»_AI(t) = [h_AI / (1 + exp(-Î³(A(t) - Î¸_0)))] Ã— userMult
   - Pure logistic gate, no time decay

6. **Implementation delay calculated:**
   - From Q12-Q15, Q18
   - Range: 0.3 to 4.0 years

7. **Cumulative risk computed:**
   - Integration of Î»_AI(t) using Simpson's rule
   - Blue: Risk_tech(t)
   - Green: Risk_actual(t) = Risk_tech(t - delay)

8. **Timeline milestones:** Binary search for 25%, 50%, 75%, 90% risk

9. **Re-employment probability:** From Q16, Q17, Q18, timing penalty, seniority boost

---

## 16. Key Differences from Old Model

### Removed Components

âŒ **Explicit/Tacit Split:**
```
OLD: A_job(t) = s_e Ã— A_explicit(t) + (1 - s_e) Ã— A_tacit(t)
NEW: A(t) = Î£ w_i Ã— G(H_r(t), L_i, s)  [task buckets]
```

âŒ **Artificial Time Decay:**
```
OLD: Î»_AI(t) = F_0 Ã— e^(-Î»t) Ã— ...
NEW: Î»_AI(t) = h_AI / (1 + exp(...))  [no decay]
```

âŒ **Threshold Ratio with Power Law:**
```
OLD: [max(0, A_job/Î¸ - 1)]^Î³
NEW: 1 / (1 + exp(-Î³(A - Î¸_0)))  [logistic gate]
```

âŒ **Unbounded Capability:**
```
OLD: A_explicit â†’ âˆž as t â†’ âˆž
NEW: A(t) âˆˆ [0, 1] always
```

âŒ **Division for Effective Doubling:**
```
OLD: D_eff = D_base / (computeMultiplier Ã— domainPace)
NEW: D_eff = D_base Ã— domainFriction Ã— industryFriction  [multiplication]
```
Note: The NEW model treats sliders as friction/barriers that slow down automation by INCREASING doubling time.

### New Components

âœ… **METR Grounding:**
- Empirical 7-month doubling benchmark
- Reliability adjustment f(r)
- Maximum task length capability metric

âœ… **Bounded Readiness:**
- A(t) âˆˆ [0, 1] guaranteed
- Clear interpretation (% of tasks)
- Weighted task buckets

âœ… **Clean Hazard:**
- Pure logistic S-curve
- No artificial decay
- Explicit max hazard (50% annual)

âœ… **Bounded Multipliers:**
- userMult âˆˆ [0.33, 3.0]
- Prevents extreme outliers
- More predictable behavior

---

## 17. Typical Calculations Example

**Inputs:**
- All questions = 3 (neutral)
- Seniority = 1 (Entry)
- t = 5 years

**Step 1: METR Capability**
```
D_eff = 7 Ã— 1.0 Ã— 1.0 = 7 months
months = 5 Ã— 12 = 60
f(0.95) â‰ˆ 33.1

H_r(5) = [137 Ã— 2^(60/7)] / 33.1
       = [137 Ã— 2^8.57] / 33.1
       = [137 Ã— 378.8] / 33.1
       = 51895 / 33.1
       = 1568 minutes
```

**Step 2: Task Gates**
```
G(1568, 2.5, 0.45) = 1 / (1 + exp(-(ln(1568) - ln(2.5)) / 0.45))
                    â‰ˆ 1.0000 (AI masters <5min tasks)

G(1568, 10, 0.45) â‰ˆ 1.0000 (AI masters 5-15min tasks)
G(1568, 37.5, 0.45) â‰ˆ 1.0000 (AI masters 15-60min tasks)
G(1568, 120, 0.45) â‰ˆ 1.0000 (AI handles 1-3hr tasks)
G(1568, 360, 0.45) â‰ˆ 0.9996 (AI can do >3hr tasks)
```

**Step 3: AI Readiness**
```
A(5) = 0.25Ã—1.0000 + 0.35Ã—1.0000 + 0.25Ã—1.0000 + 0.10Ã—1.0000 + 0.05Ã—0.9996
     = 0.2500 + 0.3500 + 0.2500 + 0.1000 + 0.0500
     â‰ˆ 1.0000 (AI can do ~100% of job tasks)
```

**Step 4: Hazard**
```
Neutral answers â†’ ampMult â‰ˆ 1.0, fricMult â‰ˆ 1.0
seniorityMult = 1 - 0.00 = 1.0
userMult = clamp(1.0 Ã— 1.0 Ã— 1.0, 0.5, 2.0) = 1.0

Î»_AI(5) = [0.50 / (1 + exp(-8.0 Ã— (1.0000 - 0.75)))] Ã— 1.0
        = [0.50 / (1 + exp(-2.0))]
        = [0.50 / (1 + 0.1353)]
        = [0.50 / 1.1353]
        = 0.440 yrâ»Â¹ (44.0% annual hazard)
```

**Step 5: Cumulative Risk**
```
Risk_tech(5) = 1 - exp(-âˆ«[0 to 5] Î»_AI(u) du)
             â‰ˆ 1 - exp(-2.1)  [via Simpson's rule]
             â‰ˆ 0.878 (87.8% probability)
```

This demonstrates the complete calculation pipeline from user inputs to final risk estimate.

---

## Summary

The METR-powered model provides:

1. **Empirical grounding** via METR 7-month doubling
2. **Bounded readiness** A(t) âˆˆ [0,1] with task bucket interpretation
3. **Clean hazard** logistic gate without artificial decay
4. **Controlled multipliers** user effects bounded [0.5Ã—, 2.0Ã—]
5. **Clear separation** capability (Blue) vs adoption (Green = Blue shifted)

All formulas are mathematically precise, empirically grounded, and produce interpretable, bounded outputs suitable for forecasting automation risk.
