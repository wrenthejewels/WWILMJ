# METR-Based AI Hazard Model - Usage Guide

## Overview

The AI job automation risk calculator has been refactored to use METR's 7-month doubling benchmark as the core capability engine. This provides a more grounded, empirically-based model for forecasting AI capability growth and job automation risk.

---

## Key Improvements

### Before (Old Model)
- Mixed explicit/tacit capability with arbitrary blending
- Hand-tuned exponential decay `e^(-λt)` in hazard function
- Theta-based threshold with power-law surplus term
- Capability ratio without clear empirical grounding

### After (METR Model)
- **METR benchmark-based capability:** H_r(t) using 7-month doubling
- **Task bucket aggregation:** Weighted sum of logistic gates over task durations
- **Pure logistic hazard:** No artificial time decay, hazard purely driven by A(t)
- **Reliability adjustment:** Explicit reliability target (r) parameter
- **Bounded AI readiness:** A(t) ∈ [0, 1] mathematically guaranteed

---

## How It Works

### 1. Capability Growth (H_r)

AI capability is measured as task completion time in minutes. Lower time = higher capability.

```
At t=0 years: H_r(0) ≈ 7.22 minutes
At t=5 years: H_r(5) ≈ 0.067 minutes (100× improvement)
At t=10 years: H_r(10) ≈ 0.0006 minutes (10,000× improvement)
```

The function respects:
- METR's 7-month baseline doubling
- User adjustments via compute slider
- Domain-specific pace adjustments
- Reliability requirements (95% default)

### 2. Task Buckets

Jobs are decomposed into task duration buckets:

| Task Type | Duration | Weight | Example Tasks |
|-----------|----------|--------|---------------|
| Quick | <5 min | 25% | Email triage, simple queries |
| Short | 5-15 min | 35% | Document review, basic analysis |
| Medium | 15-60 min | 25% | Report writing, problem solving |
| Long | 1-3 hr | 10% | Complex projects, strategic planning |
| Very Long | >3 hr | 5% | Multi-day initiatives, novel research |

Each bucket has a logistic gate G(H, L) that determines if AI can handle tasks of that duration.

### 3. AI Readiness Score

```
A(t) = Σ (weight_i × gate_i)
```

Example at t=5 years:
- Quick tasks (2.5 min): G ≈ 0.97 → 0.25 × 0.97 = 0.24
- Short tasks (10 min): G ≈ 0.82 → 0.35 × 0.82 = 0.29
- Medium tasks (37.5 min): G ≈ 0.22 → 0.25 × 0.22 = 0.05
- Long tasks (120 min): G ≈ 0.01 → 0.10 × 0.01 = 0.00
- Very long (360 min): G ≈ 0.00 → 0.05 × 0.00 = 0.00

**Total: A(5) ≈ 0.58** (AI can handle 58% of job tasks)

### 4. Hazard Function

The annual displacement hazard uses a logistic gate:

```
λ_AI(t) = 0.50 / (1 + exp(-8.0 × (A(t) - 0.75)))
```

Key thresholds:
- A(t) < 0.50: Minimal hazard (<5% per year)
- A(t) = 0.75: Threshold reached (25% hazard)
- A(t) > 0.90: Near maximum (45%+ hazard)
- A(t) = 1.00: Maximum hazard (50% per year)

User multipliers from questionnaire can scale this 0.5× to 2.0×.

### 5. Risk Curves

**Blue Curve (Technical Feasibility):**
- Cumulative probability AI can technically automate the role
- Calculated by integrating hazard over time
- Represents "when AI capability crosses the threshold"

**Green Curve (Actual Job Loss):**
- Blue curve shifted right by implementation delay
- Represents "when organizations actually adopt automation"
- Accounts for organizational friction, legal barriers, etc.

---

## Using the Model

### Adjusting Parameters

**AI Doubling Time Slider:**
- Default: 7 months (METR baseline)
- Range: 2-24 months
- Effect: Faster doubling → earlier automation milestones

**Compute Scaling Slider:**
- Default: 1.0× (baseline)
- Range: 0.5× to 3.0×
- Effect: Higher compute → faster capability growth

**Domain Pace:**
- Automatically inferred from questionnaire (Q2, Q6, Q8, Q14, Q17)
- Represents domain-specific learning rates
- Range: 0.6× to 1.8× METR baseline

### Interpreting Results

**Risk Profile Scores:**
- AI Readiness (Q1-Q4): How automation-ready your work is
- Task Adaptability (Q5-Q9): How hard it is to automate
- Friction (Q10-Q13): Organizational/human barriers
- Firm Readiness (Q14-Q17): Company adoption speed
- Personal Adaptability (Q18-Q21): Your ability to pivot

**Timeline Milestones:**
- 25% risk: Early warning threshold
- 50% risk: Median outcome timing
- 75% risk: High likelihood zone
- 90% risk: Near certainty

**Curves Interpretation:**
- Blue rising early: High technical automation potential
- Green lagging far behind: Strong organizational friction
- Both rising together: Rapid, inevitable automation
- Both flat: Low automation risk overall

---

## Verification & Testing

### Browser Console Tests

Open the calculator page and check the browser console for:

```
=== METR MODEL ACCEPTANCE TESTS ===

TEST 1: A(t) bounded [0,1]
  A(0yr) = 0.0234 ✓
  A(1yr) = 0.0419 ✓
  A(5yr) = 0.5823 ✓
  A(10yr) = 0.9876 ✓
  RESULT: PASS ✓

TEST 2: Increasing r → later milestones
  50% milestone at r=0.90: 6.32 years
  50% milestone at r=0.95: 7.15 years
  50% milestone at r=0.99: 8.42 years
  RESULT: PASS ✓

DIAGNOSTIC VALUES:
  H_r(0) = 7.22 minutes (baseline capability)
  H_r(5) = 0.0673 minutes (more capable → lower time)
  A(0) = 0.0234 (should be near 0)
  A(5) = 0.5823 (should be in [0,1])
  reliability factor f(0.95) = 14.4097
```

### Standalone Test Page

Open `test_metr.html` in a browser to run isolated tests of the core mathematical functions without the full UI.

### Manual Verification

1. **Test boundedness:**
   - Adjust sliders randomly
   - Check that A(t) never exceeds [0, 1]
   - Verify no NaN or Infinity values in curves

2. **Test monotonicity:**
   - Decrease AI doubling time → milestones should shift earlier
   - Increase reliability target → milestones should shift later
   - Increase compute → milestones should shift earlier

3. **Test curve relationship:**
   - Blue curve should always lead green curve
   - Gap should equal implementation delay
   - Both curves should be smooth (no discontinuities)

---

## Advanced Customization

### Changing Task Buckets

Edit `METR_DEFAULTS.taskBuckets` in index.html:

```javascript
taskBuckets: [
    { L: 1, w: 0.30 },     // Very quick tasks
    { L: 5, w: 0.40 },     // Quick tasks
    { L: 30, w: 0.20 },    // Medium tasks
    { L: 180, w: 0.10 }    // Long tasks
]
```

**Requirements:**
- Weights must sum to 1.0
- L values in minutes, must be > 0
- At least 2 buckets recommended

### Changing Reliability Target

Edit `METR_DEFAULTS.r_target`:

```javascript
r_target: 0.99  // 99% reliability (more conservative)
```

**Effect:**
- Higher r → AI needs more capability before deployment
- r = 0.50: No adjustment (baseline METR)
- r = 0.95: 14.4× capability multiplier needed
- r = 0.99: 71.8× capability multiplier needed

### Changing Hazard Parameters

Edit in `hazardAI()` function:

```javascript
const hAI = 0.50;      // Max annual hazard (0.30 = 30%, 0.50 = 50%)
const gamma = 8.0;     // Steepness (higher = sharper transition)
const theta0 = 0.75;   // Threshold (0.75 = 75% of tasks)
```

**Effects:**
- Lower hAI → gentler maximum risk
- Higher gamma → sharper "cliff" in risk curve
- Lower theta0 → risk starts earlier

### Changing Softness Parameter

Edit `METR_DEFAULTS.softness`:

```javascript
softness: 0.35  // Sharp transitions
softness: 0.45  // Default
softness: 0.60  // Gentle transitions
```

**Effect:**
- Controls how gradually AI "masters" each task bucket
- Lower = steeper logistic gates (all-or-nothing)
- Higher = smoother logistic gates (gradual capability)

---

## Common Questions

### Q: Why did my timeline shift so much?

The METR model is more sensitive to capability growth because it's exponential. A 2× change in compute can shift timelines by multiple years.

### Q: Why is A(0) not exactly 0?

At baseline, AI already has some minimal capability. The logistic gates assign small probabilities to very quick tasks even at t=0.

### Q: Can I return to the old model?

The old functions are preserved (commented as "legacy"). You can restore them by swapping the function definitions, but the new model is recommended.

### Q: How do I adjust for different job types?

Use the questionnaire! Questions Q1-Q13 capture job characteristics that automatically adjust:
- Domain pace (how fast AI learns your domain)
- User multipliers (0.5× to 2.0× hazard scaling)
- Implementation delay (0.4 to 4.0 years)

### Q: What if I disagree with the task buckets?

The default buckets are averages across all jobs. For specialized roles, you can:
1. Edit task buckets to match your work distribution
2. Adjust weights based on time-tracking data
3. Use questionnaire to capture role-specific factors

---

## References

- **METR Task Standard Benchmark:** 7-month doubling time for frontier AI capabilities
- **Logistic gates:** Standard sigmoid transitions used in capability forecasting
- **Hazard models:** Actuarial survival analysis applied to job automation
- **Task decomposition:** Labor economics literature on routine vs. non-routine tasks

---

## Support & Feedback

For issues or questions about the METR refactor:
1. Check browser console for diagnostic output
2. Run standalone tests in `test_metr.html`
3. Review `METR_REFACTOR_SUMMARY.md` for implementation details
4. Verify acceptance criteria in console output

All core mathematical functions are documented in `MATH_EXTRACTION.md`.
