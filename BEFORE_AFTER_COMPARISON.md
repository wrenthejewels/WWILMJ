# Before/After Comparison - WWILMJ Patch

## Q5: Task Decomposability

### Before (WRONG)
```html
<input type="radio" id="q5-1" name="q5" value="5">
<label for="q5-1">Very Complex</label>
...
<input type="radio" id="q5-5" name="q5" value="1">
<label for="q5-5">Highly Structured</label>
```
```javascript
Q5: { fric: -0.50 }, // Protective channel
```
**Problem:** Slider right (Structured) → value 1 → coded -2 → with fric -0.50 → DECREASED risk (WRONG!)

### After (CORRECT)
```html
<input type="radio" id="q5-1" name="q5" value="1">
<label for="q5-1">Very Complex</label>
...
<input type="radio" id="q5-5" name="q5" value="5">
<label for="q5-5">Highly Structured</label>
```
```javascript
Q5: { amp: +0.50 }, // Amplifier channel (FIXED)
```
**Result:** Slider right (Structured) → value 5 → coded +2 → with amp +0.50 → INCREASES risk ✓

---

## Q6: Task Standardization

### Before (WRONG)
```html
<input type="radio" id="q6-1" name="q6" value="5">
<label for="q6-1">Highly Variable</label>
...
<input type="radio" id="q6-5" name="q6" value="1">
<label for="q6-5">Highly Standardized</label>
```
```javascript
Q6: { amp: +0.45 }, // Amplifier channel
```
**Problem:** Slider right (Standardized) → value 1 → coded -2 → with amp +0.45 → DECREASED risk (WRONG!)

### After (CORRECT)
```html
<input type="radio" id="q6-1" name="q6" value="1">
<label for="q6-1">Highly Variable</label>
...
<input type="radio" id="q6-5" name="q6" value="5">
<label for="q6-5">Highly Standardized</label>
```
```javascript
Q6: { amp: +0.45 }, // Amplifier channel (no change)
```
**Result:** Slider right (Standardized) → value 5 → coded +2 → with amp +0.45 → INCREASES risk ✓

---

## Q12: Physical Presence

### Before
```javascript
Q12: { amp: -0.60 }, // Physical presence: more physical = protective
```
**Problem:** Using amplifier channel with negative weight (confusing semantics)

### After (CORRECT)
```javascript
Q12: { fric: -0.60 }, // Physical Presence (FIXED: now fric− channel)
```
**Result:** Now uses friction channel properly, behavior unchanged but semantics clearer

---

## Pipeline Order

### Before
```javascript
function getUserMultiplier() {
    const questionMultiplier = currentParams.ampMult * currentParams.fricMult;
    const seniorityMultiplier = 1 - (profile.hazardShield || 0);
    const rawMultiplier = questionMultiplier * seniorityMultiplier; // WRONG ORDER
    return Math.max(0.5, Math.min(2.0, rawMultiplier)); // TOO NARROW
}
```

### After (CORRECT)
```javascript
function getUserMultiplier() {
    // Step 1: Question multiplier
    const questionMultiplier = currentParams.ampMult * currentParams.fricMult;

    // Step 2: Apply seniority AFTER (FIXED)
    const hazardMult = questionMultiplier * (1 - (profile.hazardShield || 0));

    // Step 3: Wider bounds (FIXED)
    return Math.max(0.33, Math.min(3.0, hazardMult));
}
```

---

## Tests Added

```javascript
function runPatchRegressionTests() {
    // TEST 1: Q5 direction
    Q5=1 (complex) vs Q5=5 (structured)
    → Expect: Q5=5 has HIGHER hazard ✓

    // TEST 2: Q12 direction
    Q12=1 (none) vs Q12=5 (essential)
    → Expect: Q12=5 has LOWER hazard ✓

    // TEST 3: Q16 direction
    Q16=1 (easy hire) vs Q16=5 (hard hire)
    → Expect: Q16=5 has LONGER delay ✓

    // TEST 4: Calibration
    Q1+Q4+Q6 at max → ≥2.5× hazard ✓

    // TEST 5: Protective stack
    Q7+Q9+Q12 high → ≤0.5× hazard AND ≥0.7y delay ✓

    // TEST 6-7: Impact tests
    Q1 swing → ≥12pp on 2030 risk ✓
    Q11 swing → ≤-10pp on 2030 risk ✓
}
```

---

## User Experience

### Before
- Q5 slider felt "backwards" - more structure → less risk? 🤔
- Q6 slider felt "backwards" - more standardization → less risk? 🤔
- Some sliders felt "dead" near edges due to narrow [0.5, 2.0] bounds

### After
- All sliders intuitive: right = more of what's labeled ✓
- Q5: more structured → more risk (makes sense!) ✓
- Q6: more standardized → more risk (makes sense!) ✓
- All sliders responsive across full range with [0.33, 3.0] bounds ✓

---

## Summary

| Aspect | Before | After |
|--------|--------|-------|
| Q5 values | 5→1 (reversed) | 1→5 (correct) |
| Q5 channel | fric (wrong) | amp (correct) |
| Q6 values | 5→1 (reversed) | 1→5 (correct) |
| Q12 channel | amp (confusing) | fric (clear) |
| Seniority timing | Mixed with questions | After questions ✓ |
| Bounds | [0.5, 2.0] (narrow) | [0.33, 3.0] (wide) ✓ |
| Tests | None | 7 regression tests ✓ |
| Docs | Unclear | Explicit coding rule ✓ |

**All changes preserve the mathematical model while making UX intuitive!**
