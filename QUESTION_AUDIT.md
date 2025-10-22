# Question & Slider Audit

## Overview
This audit maps all 18 questions and 2 sliders to their effects on the model equations.

---

## SLIDERS

### 1. Industry-Specific Friction (industry-pace)
- **Range**: 0.5x - 2.0x (default: 1.0x)
- **Effect**: Multiplies `domainPenalty` in H_r function
- **Formula Impact**: `totalPenalty = rolePenalty × industryFriction` → divides `H50_0`
- **✓ CORRECT**: Affects CAPABILITY (via penalty), NOT doubling time
- **Location**: `resolvedDomainPace()` line 2298, used in `H_r()` line 2375

### 2. AI Reliability (ai-reliability)
- **Range**: 50% - 99% (default: 95%)
- **Effect**: Sets reliability requirement `r` → affects `f(r)` factor
- **Formula Impact**: Higher r → larger f(r) → divides H → contracts capability
- **✓ CORRECT**: f(0.95) ≈ 33×, f(0.99) ≈ 235×
- **Location**: `resolvedReliabilityTarget()` line 2324, used in `H_r()` line 2366

---

## QUESTIONS BY CATEGORY

### Category 1: AI Capability Assessment (Q1-Q4)
Questions that assess how well AI can currently perform the role.

#### Q1: Current AI Performance
- **Purpose**: Direct assessment of AI capability in this role
- **Effect**: **BLUE curve** (ampMult)
- **Weight**: `amp: +0.80` (strongest single question!)
- **Formula**: Higher score (5=Near-Human) → +ampMult → earlier automation
- **✓ CORRECT**: Directly measures AI readiness

#### Q2: Data Availability
- **Purpose**: Training data abundance for AI
- **Effect**: **BLUE curve** (ampMult) + **THETA** (via s_e)
- **Weights**:
  - `amp: +0.40` (QUESTION_WEIGHTS)
  - Part of `s_e` calculation (inferredExplicitness, positive contributor)
- **Formula**:
  - High data → +ampMult → earlier automation
  - High data → higher s_e → **LOWERS theta** (line 2889: `explicitnessShift = 0.10 * (0.5 - s_e)`)
- **✓ CORRECT**: Data-rich roles automate faster AND at lower capability thresholds

#### Q3: Benchmark Clarity
- **Purpose**: Measurability of success
- **Effect**: **BLUE curve** (ampMult) + **THETA** (via s_e)
- **Weights**:
  - `amp: +0.35`
  - Part of `s_e` calculation (positive contributor)
- **Formula**: Clear benchmarks → faster automation + lower theta
- **✓ CORRECT**: Easy-to-measure roles automate faster

#### Q4: Task Digitization
- **Purpose**: Digital/text format percentage
- **Effect**: **BLUE curve** (ampMult) + **THETA** (via s_e) + **domainPenalty**
- **Weights**:
  - `amp: +0.55` (QUESTION_WEIGHTS)
  - `+0.28` (DOMAIN_ALIGNMENT_WEIGHTS)
  - Part of `s_e` calculation (positive contributor)
- **Formula**:
  - High digitization → +ampMult → earlier automation
  - High digitization → +alignment → LOWER domainPenalty (exp(-weightedSum)) → higher H
  - High digitization → higher s_e → lower theta
- **✓ CORRECT**: Triple effect is appropriate - digital work is most automatable

---

### Category 2: Task Structure (Q5-Q9)
Questions about work structure, complexity, and knowledge requirements.

#### Q5: Task Decomposability
- **Purpose**: Can work be broken into discrete tasks?
- **Effect**: **BLUE curve** (ampMult) + **THETA** (via s_e) + **domainPenalty** + **Task Weights**
- **Weights**:
  - `amp: +0.50` (QUESTION_WEIGHTS)
  - `+0.24` (DOMAIN_ALIGNMENT_WEIGHTS)
  - Part of `s_e` calculation (positive contributor)
  - Affects task duration bucket weights (via seniority + decomposability shifts)
- **Formula**:
  - Structured (5) → +ampMult, +alignment, +s_e → lower theta, higher H
  - Structured → shifts task weights toward SHORTER buckets
- **✓ CORRECT**: Decomposable work automates faster across all dimensions

#### Q6: Task Standardization
- **Purpose**: Procedure/workflow standardization
- **Effect**: **BLUE curve** (ampMult) + **THETA** (via s_e) + **domainPenalty**
- **Weights**:
  - `amp: +0.45` (QUESTION_WEIGHTS)
  - `+0.22` (DOMAIN_ALIGNMENT_WEIGHTS)
  - Part of `s_e` calculation (positive contributor)
- **Formula**: Standardized → earlier automation, lower capability threshold
- **✓ CORRECT**: Standardization enables automation

#### Q7: Context Dependency
- **Purpose**: Organizational context requirements
- **Effect**: **BLUE curve** (fricMult) + **THETA** (via s_e, negative) + **domainPenalty**
- **Weights**:
  - `fric: -0.50` (QUESTION_WEIGHTS)
  - `-0.32` (DOMAIN_ALIGNMENT_WEIGHTS, strongest penalty!)
  - Part of `s_e` calculation (NEGATIVE contributor)
- **Formula**:
  - Critical context (5) → -fricMult → later automation
  - Critical context → -alignment → HIGHER domainPenalty → lower H
  - Critical context → LOWER s_e → HIGHER theta
- **✓ CORRECT**: Context-heavy roles face triple barrier

#### Q8: Feedback Loop Speed
- **Purpose**: Speed of quality feedback
- **Effect**: **BLUE curve** (ampMult) + **THETA** (via s_e)
- **Weights**:
  - `amp: +0.45` (QUESTION_WEIGHTS)
  - Part of `s_e` calculation (positive contributor)
- **Formula**: Fast feedback → easier to train AI → earlier automation, lower theta
- **✓ CORRECT**: Iteration speed enables learning

#### Q9: Tacit Knowledge
- **Purpose**: Implicit, hard-to-codify knowledge
- **Effect**: **BLUE curve** (fricMult) + **THETA** (via s_e, negative) + **domainPenalty**
- **Weights**:
  - `fric: -0.40` (QUESTION_WEIGHTS)
  - `-0.28` (DOMAIN_ALIGNMENT_WEIGHTS)
  - Part of `s_e` calculation (NEGATIVE contributor)
- **Formula**: High tacit → delays automation, higher capability threshold needed
- **✓ CORRECT**: Tacit knowledge is a moat

---

### Category 3: Human Moats (Q10-Q11)
Questions about uniquely human requirements.

#### Q10: Human Judgment & Relationships
- **Purpose**: Trust, empathy, judgment requirements
- **Effect**: **BLUE curve** (fricMult) + **domainPenalty**
- **Weights**:
  - `fric: -0.45` (QUESTION_WEIGHTS)
  - `-0.34` (DOMAIN_ALIGNMENT_WEIGHTS)
- **Formula**: High relationship needs → delays automation, higher capability penalty
- **✓ CORRECT**: Human connection is a barrier
- **⚠️ NOTE**: Does NOT affect s_e/theta (unlike Q7, Q9) - is this intentional?

#### Q11: Physical Presence
- **Purpose**: On-site, in-person requirements
- **Effect**: **BLUE curve** (fricMult) + **domainPenalty**
- **Weights**:
  - `fric: -0.60` (QUESTION_WEIGHTS, STRONGEST friction barrier!)
  - `-0.38` (DOMAIN_ALIGNMENT_WEIGHTS, STRONGEST penalty!)
- **Formula**: Physical work → major barrier via both channels
- **✓ CORRECT**: Embodiment is the biggest moat
- **⚠️ NOTE**: Does NOT affect s_e/theta - is this intentional?

---

### Category 4: Company/Industry Context (Q12-Q15)
Questions affecting implementation delay (GREEN curve), NOT technical feasibility.

#### Q12: Company AI Adoption Readiness
- **Purpose**: How ready is company to adopt AI?
- **Effect**: **Implementation Delay ONLY**
- **Weight**: `+0.40` (IMPLEMENTATION_WEIGHTS)
- **Formula**: `delay = 1.75 - (delayScore × 1.25)`
  - Resistant company (1) → low score → MORE delay (green curve shifts right)
  - Leading edge (5) → high score → LESS delay
- **✓ CORRECT**: Does NOT affect blue curve (technical feasibility)
- **✓ CORRECT**: Positive weight = higher score → less delay

#### Q13: Labor Cost Pressure
- **Purpose**: Sensitivity to labor costs
- **Effect**: **Implementation Delay ONLY**
- **Weight**: `+0.30` (IMPLEMENTATION_WEIGHTS)
- **Formula**: High cost pressure (5) → high score → less delay (faster adoption)
- **✓ CORRECT**: Economics accelerate implementation

#### Q14: Labor Market Tightness
- **Purpose**: Difficulty filling positions
- **Effect**: **Implementation Delay ONLY**
- **Weight**: `-0.35` (IMPLEMENTATION_WEIGHTS)
- **Formula**: Very tight (5) → MORE delay (harder to justify replacement when can't hire anyway)
- **✓ CORRECT**: Negative weight flips the logic correctly

#### Q15: IT Infrastructure
- **Purpose**: Technology readiness
- **Effect**: **Implementation Delay ONLY**
- **Weight**: `+0.35` (IMPLEMENTATION_WEIGHTS)
- **Formula**: Cutting edge (5) → high score → less delay
- **✓ CORRECT**: Infrastructure enables faster deployment

---

### Category 5: Personal Factors (Q16-Q18)
Questions affecting re-employment and job retention.

#### Q16: Skill Transferability
- **Purpose**: How transferable are skills to other roles?
- **Effect**: **Re-employment Probability ONLY**
- **Weight**: `+0.50` (REEMPLOYMENT_WEIGHTS)
- **Formula**: Highly transferable (5) → higher re-employment chance
- **✓ CORRECT**: Does NOT affect automation timing, only job search success
- **⚠️ NOTE**: Should this also affect implementation delay? Employers might retain workers with non-transferable skills longer?

#### Q17: Adaptability/Learning
- **Purpose**: Speed of learning new skills
- **Effect**: **Re-employment Probability ONLY**
- **Weight**: `+0.50` (REEMPLOYMENT_WEIGHTS)
- **Formula**: Fast learner (5) → higher re-employment
- **✓ CORRECT**: Affects ability to pivot to new career

#### Q18: Job Performance
- **Purpose**: Current performance level
- **Effect**: **BOTH Implementation Delay AND Re-employment**
- **Weights**:
  - `-0.35` (IMPLEMENTATION_WEIGHTS) - top performers retained longer
  - `+0.30` (REEMPLOYMENT_WEIGHTS) - top performers find jobs easier
- **Formula**:
  - Top 10% (5) → MORE delay (negative weight) → retained longer
  - Top 10% (5) → higher re-employment probability
- **✓ CORRECT**: Dual effect is appropriate

---

## THETA CALCULATION AUDIT

### Theta Formula (line 2887-2891):
```javascript
thetaBase = 0.50  // Entry-level baseline
thetaProfileBase = thetaBase + seniorityLift  // [-0.02 to +0.08]
alignmentShift = 0.12 × (0.5 - domainAlignment)  // Range: ±0.06
explicitnessShift = 0.10 × (0.5 - s_e)  // Range: ±0.05
thetaCandidate = thetaProfileBase + alignmentShift + explicitnessShift
thetaEffective = clamp(thetaCandidate, 0.35, 0.72)
```

### What LOWERS theta (automation happens at lower capability):
1. **High domainAlignment** (from Q4, Q5, Q6 positive; Q7, Q9, Q10, Q11 negative)
   - Digital, decomposable, standardized work with low context/tacit needs
2. **High s_e** (role explicitness) from:
   - Q1, Q3, Q4, Q5, Q6, Q8 (positive contributors)
   - Minus Q7, Q9 (negative contributors)
3. **Higher seniority** (executives get +0.08 to theta)

### ⚠️ POTENTIAL ISSUE:
**Q10 and Q11 do NOT affect s_e (explicitness)**
- They DO affect domainAlignment and fricMult
- But Q7 and Q9 (context, tacit) affect ALL THREE: fricMult, domainAlignment, AND s_e
- **Question**: Should Q10 (relationships) and Q11 (physical) also affect explicitness/theta?
  - Argument FOR: Jobs requiring human touch are less explicit/measurable
  - Argument AGAINST: These are separate dimensions (embodiment vs. codifiability)

---

## DOMAIN PENALTY CALCULATION AUDIT

### Formula (line 2712-2722):
```javascript
weightedSum = Σ(weight[qi] × coded_answer[qi])
  Q4: +0.28, Q5: +0.24, Q6: +0.22  // Positive = good for AI
  Q7: -0.32, Q9: -0.28, Q10: -0.34, Q11: -0.38  // Negative = bad for AI
penalty = clamp(exp(-weightedSum), 0.5, 3.0)
alignment = clamp(0.5 + 0.18 × weightedSum, 0, 1)
```

### Effect in H_r (line 2379-2380):
```javascript
totalPenalty = rolePenalty × industryFriction
baselineMinutes = H50_0 / totalPenalty
```

### ✓ CORRECT LOGIC:
- Positive weightedSum → penalty < 1 → H increases (AI is better)
- Negative weightedSum → penalty > 1 → H decreases (AI is worse)
- Both role-specific (questions) and industry (slider) penalties multiply

---

## HAZARD MULTIPLIERS AUDIT

### Formula (line 2756-2768):
```javascript
sumAmp = Σ(amp_weight[qi] × coded_answer[qi])
sumFric = Σ(fric_weight[qi] × coded_answer[qi])
ampMult = exp(clamp(sumAmp, -3, 3))  // Range: [0.05×, 20×]
fricMult = exp(-clamp(sumFric, -3, 3))  // Range: [0.05×, 20×]
```

### Used in hazard calculation (line 3043-3054):
```javascript
h0_adjusted = h0_base × ampMult × fricMult
```

### ✓ CORRECT:
- ampMult > 1 → accelerates hazard
- fricMult < 1 → delays hazard (note the negative sign in exp(-sumFric))
- Both affect h0 (base hazard rate), not H_r capability

---

## BUGS & INCONSISTENCIES FOUND

### 🐛 BUG 1: Pace Inference Function Still Uses Deleted Questions
**Location**: `inferredPace()` line 2265-2296
```javascript
function inferredPace(answers) {
    // FIXED: now represents domain-specific friction
    const sCore = avg(['Q1', 'Q5', 'Q6'], answers);  // ❌ Using Q1!
    const sTacit = avg(['Q7', 'Q9', 'Q11'], answers);
    const baseScore = 0.60 * norm(sCore) - 0.40 * norm(sTacit);
    let pace = 1.0 - 0.50 * baseScore;
    return clamp(pace, 0.5, 2.0);
}
```

**PROBLEM**: This function calculates a "domainPace" value from questions, but:
1. It's supposed to represent FRICTION (comment says so)
2. It uses Q1 (Current AI Performance) which should only affect ampMult
3. **This value is NEVER USED in current code!** (after we removed it from H_r)
4. The slider `industry-pace` calls `resolvedDomainPace()` which returns slider value, not this function

**ACTION NEEDED**: Either delete this function or clarify its purpose

---

### 🐛 BUG 2: Friction Decay Function Unused
**Location**: `inferredFrictionDecay()` line 2252-2263
```javascript
function inferredFrictionDecay(answers) {
    const sAdopt = avg(['Q12', 'Q13', 'Q14', 'Q15'], answers);
    const friction = 1.0 - 0.40 * norm(sAdopt);
    return clamp(friction, 0.3, 1.5);
}
```

**PROBLEM**: Returns a `lambda` value that gets stored in `currentParams.lambda` but:
1. Only used for display in `describeFriction()`
2. NOT used in any actual calculations anymore
3. Implementation delay uses IMPLEMENTATION_WEIGHTS directly, not lambda

**ACTION NEEDED**: Either wire this into the model or remove it

---

### ⚠️ DESIGN QUESTION 1: Should Q10/Q11 affect theta?
Currently:
- Q7 (Context) and Q9 (Tacit) affect: fricMult + domainPenalty + s_e (theta)
- Q10 (Relationships) and Q11 (Physical) affect: fricMult + domainPenalty ONLY

**Rationale for current design**: Physical presence and relationships are orthogonal to explicitness
**Counterargument**: Jobs requiring human touch are inherently less measurable/explicit

---

### ⚠️ DESIGN QUESTION 2: Should Q16 affect implementation delay?
Currently: Q16 (Skill Transferability) only affects re-employment

**Rationale**: Transferability doesn't affect automation decision
**Counterargument**: Employers might retain workers with firm-specific skills longer (harder to replace)

---

## SUMMARY

### ✅ WORKING CORRECTLY:
1. **METR doubling time**: Fixed at 7 months, never modified ✓
2. **Friction layers**: Industry slider + role questions → multiply for totalPenalty → divide H50_0 ✓
3. **Reliability factor**: Properly contracts capability via f(r) division ✓
4. **Question routing**: Q1-Q11 affect blue curve, Q12-Q15 affect delay, Q16-Q18 affect re-employment ✓
5. **Theta calculation**: Properly lowers for data-rich, standardized, explicit roles ✓
6. **Domain penalty**: Exp(-weightedSum) properly penalizes context/tacit/physical work ✓

### 🐛 NEEDS FIXING:
1. **inferredPace()**: Function calculates value from Q1/Q5/Q6/Q7/Q9/Q11 but result is never used
2. **inferredFrictionDecay()**: Function calculates lambda from Q12-Q15 but only used for display, not calculations

### ⚠️ NEEDS REVIEW:
1. Should Q10 (Relationships) and Q11 (Physical) also affect s_e/theta?
2. Should Q16 (Skill Transferability) also affect implementation delay?
3. Are Q1-Q11 weights properly calibrated? (especially Q1 at 0.80 amp)

---

## RECOMMENDATION

**Priority 1 (Critical)**: Remove or repurpose `inferredPace()` and `inferredFrictionDecay()` - they create confusion by calculating unused values

**Priority 2 (Design)**: Decide on Q10/Q11 theta influence and Q16 delay influence

**Priority 3 (Calibration)**: Consider whether Q1 weight (0.80 amp) is too strong relative to other questions
