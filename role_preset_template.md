# Role Preset Mapping Template

## Instructions for Google Sheets Setup

Create a Google Sheet with the following tabs/sheets:

---

## Sheet 1: Role Baseline Profiles

### Columns:
- Role (text)
- Q1-Q19 (numbers 1-5)
- Doubling_Period (number, months)
- Reliability_Requirement (decimal 0.80-0.99)
- Compute_Growth (text: "Baseline", "Conservative", "Aggressive")
- Industry_Drag (text: "Low", "Moderate", "High")
- Description (text)

### Rows (Role Categories):

**Role** | **Q1** | **Q2** | **Q3** | **Q4** | **Q5** | **Q6** | **Q7** | **Q8** | **Q9** | **Q10** | **Q11** | **Q12** | **Q13** | **Q14** | **Q15** | **Q16** | **Q17** | **Q18** | **Q19** | **Doubling_Period** | **Reliability_Requirement** | **Compute_Growth** | **Industry_Drag** | **Description**
---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---
Software/Tech | 5 | 5 | 4 | 5 | 4 | 4 | 2 | 5 | 2 | 2 | 1 | 2 | 4 | 3 | 3 | 4 | 4 | 3 | 7 | 0.95 | Baseline | Low | High AI capability alignment. Digital-first work with clear benchmarks, rapid feedback loops, and extensive training data.
Administrative | 3 | 4 | 3 | 4 | 4 | 4 | 2 | 4 | 2 | 3 | 2 | 3 | 3 | 4 | 3 | 3 | 3 | 3 | 7 | 0.95 | Baseline | Moderate | Structured, repeatable tasks with clear workflows. Mix of routine processing and judgment calls.
Customer Service | 3 | 3 | 3 | 4 | 3 | 3 | 3 | 4 | 3 | 4 | 3 | 3 | 3 | 4 | 3 | 3 | 3 | 3 | 7 | 0.95 | Baseline | Moderate | Mix of scripted responses and relationship management. Moderate human judgment requirements.
Data Analysis | 5 | 5 | 4 | 5 | 4 | 4 | 2 | 4 | 2 | 2 | 1 | 2 | 3 | 3 | 3 | 4 | 4 | 3 | 7 | 0.95 | Baseline | Low | Highly structured analytical work with clear metrics. Strong AI training data availability.
Finance/Accounting | 4 | 4 | 4 | 5 | 4 | 4 | 2 | 4 | 2 | 2 | 1 | 4 | 3 | 4 | 3 | 3 | 3 | 3 | 7 | 0.98 | Baseline | High | Structured numerical work with high accuracy requirements. Regulatory complexity adds friction.
Sales/Marketing | 3 | 3 | 2 | 3 | 3 | 2 | 4 | 3 | 4 | 4 | 3 | 3 | 3 | 3 | 3 | 3 | 4 | 4 | 3 | 7 | 0.92 | Baseline | Moderate | Mix of data-driven targeting and relationship building. Creative and interpersonal elements.
Creative/Design | 4 | 3 | 3 | 4 | 3 | 2 | 3 | 3 | 3 | 3 | 2 | 2 | 3 | 3 | 3 | 3 | 3 | 3 | 7 | 0.90 | Baseline | Moderate | Creative work with emerging AI tools. Subjective quality assessment. Mix of technical and aesthetic judgment.
Legal/Compliance | 3 | 3 | 3 | 4 | 3 | 3 | 4 | 2 | 4 | 4 | 2 | 5 | 2 | 3 | 4 | 3 | 3 | 3 | 7 | 0.98 | Baseline | High | High accuracy and trust requirements. Context-heavy work. Strong regulatory friction and liability concerns.
Product Management | 3 | 3 | 2 | 4 | 3 | 3 | 4 | 3 | 4 | 4 | 2 | 3 | 3 | 3 | 3 | 3 | 4 | 4 | 3 | 7 | 0.95 | Baseline | Moderate | Cross-functional coordination with mixed task types. Strategic thinking + stakeholder management.
Consulting/Strategy | 3 | 3 | 2 | 4 | 3 | 2 | 4 | 3 | 4 | 5 | 3 | 4 | 3 | 3 | 3 | 3 | 4 | 4 | 3 | 7 | 0.95 | Baseline | Moderate | Pattern recognition (vulnerable) balanced by client relationships (protective). Bespoke problem-solving.
HR/People Ops | 3 | 3 | 3 | 4 | 3 | 3 | 3 | 3 | 3 | 4 | 3 | 4 | 3 | 3 | 3 | 3 | 3 | 3 | 7 | 0.95 | Baseline | Moderate | Mix of process automation (recruiting, payroll) and high-trust interpersonal work (coaching, conflict).
Content Writing | 4 | 4 | 3 | 5 | 4 | 3 | 2 | 4 | 2 | 2 | 1 | 2 | 3 | 4 | 3 | 3 | 3 | 3 | 3 | 7 | 0.90 | Baseline | Low | Highly automatable with current LLMs. Clear evaluation criteria for most content types.
Journalism | 4 | 3 | 3 | 4 | 3 | 3 | 3 | 3 | 3 | 3 | 2 | 3 | 2 | 4 | 3 | 3 | 3 | 3 | 3 | 7 | 0.92 | Baseline | Moderate | Strong AI capability for basic reporting. Investigation and source relationships provide some protection.
Engineering (Non-Software) | 4 | 4 | 4 | 4 | 3 | 3 | 3 | 3 | 4 | 3 | 3 | 4 | 3 | 3 | 3 | 3 | 3 | 3 | 7 | 0.98 | Baseline | High | Technical work with physical constraints. CAD/simulation automation balanced by real-world validation needs.
Operations Management | 3 | 3 | 3 | 4 | 4 | 4 | 3 | 4 | 3 | 3 | 2 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 7 | 0.95 | Baseline | Moderate | Process optimization and coordination. Mix of data-driven decision making and stakeholder management.

---

## Sheet 2: Question Reference

Quick lookup for what each question measures:

**Question** | **Short Label** | **Low (1)** | **Neutral (3)** | **High (5)** | **Category**
---|---|---|---|---|---
Q1 | Current AI Performance | No AI tools exist | Some AI, limited capability | Top-tier AI excels at this | AI Readiness
Q2 | Data Availability | Little to no data | Some proprietary data | Abundant training data | AI Readiness
Q3 | Benchmark Clarity | Subjective quality only | Mixed metrics | Clear, measurable outcomes | AI Readiness
Q4 | Task Digitization | Mostly physical/analog | Partially digital | Fully digital workflow | AI Readiness
Q5 | Task Decomposability | Holistic, integrated work | Mixed | Clear sub-tasks, modular | Task Structure
Q6 | Task Standardization | Unique, bespoke every time | Some patterns | Highly repeatable | Task Structure
Q7 | Context Dependency | Self-contained tasks | Some context needed | Deep history/context crucial | Task Structure
Q8 | Feedback Loop Speed | Months/years for feedback | Weeks | Instant/daily feedback | Task Structure
Q9 | Tacit Knowledge | Explicit, documented | Mix | Intuition, "you know it when you see it" | Task Structure
Q10 | Human Judgment & Relationships | Algorithmic, objective | Balanced | Requires empathy, relationships | Human Moat
Q11 | Physical Presence | Fully remote capable | Hybrid | Must be physically present | Human Moat
Q12 | Trust Requirements | Low stakes, easily reversible | Moderate | High liability, regulation, ethics | Human Moat
Q13 | Company AI Adoption | Resistant, slow adopter | Cautious follower | Leading edge, aggressive | Firm Context
Q14 | Labor Cost Pressure | Not cost-sensitive | Moderate pressure | Extremely cost-sensitive | Firm Context
Q15 | Labor Market Tightness | Very easy to hire | Moderate | Very difficult to find talent | Firm Context
Q16 | IT Infrastructure | Very outdated systems | Moderate | Cutting-edge, AI-ready | Firm Context
Q17 | Skill Transferability | Highly specific to role | Some overlap | Highly transferable | Personal Context
Q18 | Adaptability/Learning Speed | Very slow to learn new tools | Moderate | Very fast learner | Personal Context
Q19 | Job Performance | Below average | Average | Top 10% performer | Personal Context

---

## Sheet 3: Seniority Adjustments

These are **additive modifiers** applied to the role baseline. Final values are clamped to [1, 5].

**Seniority Level** | **Label** | **Q7_adj** | **Q9_adj** | **Q10_adj** | **Q12_adj** | **Q17_adj** | **Q18_adj** | **Q19_adj** | **Reasoning**
---|---|---|---|---|---|---|---|---|---
Entry Level | 0-2 years | 0 | 0 | -1 | 0 | -1 | 0 | 1 | Less institutional knowledge, fewer relationships, still building expertise. Below average performance relative to role.
Mid-Level | 3-7 years | 0 | 0 | 0 | 0 | 0 | 0 | 3 | Baseline competence. Average performance for the role.
Senior | 8-15 years | +1 | +1 | +1 | +1 | +1 | 0 | 4 | Deep expertise, established relationships, more context-dependent work. Above average performance.
Lead/Principal | 15-25 years | +2 | +2 | +2 | +1 | +1 | 0 | 5 | Specialized tacit knowledge, key stakeholder relationships, high trust requirements. Top performer.
Executive | 25+ years | +2 | +2 | +3 | +2 | +1 | 0 | 5 | Strategic relationships, governance oversight, irreplaceable institutional memory. Top performer.

### Notes on Adjustments:
- **Q7 (Context)**: More experience = more context dependency
- **Q9 (Tacit Knowledge)**: More experience = more undocumented expertise
- **Q10 (Relationships)**: Senior people have deeper stakeholder networks
- **Q12 (Trust)**: Senior roles often have higher governance/liability
- **Q17 (Transferability)**: Senior specialists may be more niche
- **Q18 (Adaptability)**: No adjustment - adaptability is personal, not seniority-based
- **Q19 (Performance)**: Progression from below average → top performer

---

## Sheet 4: Slider Settings Reference

**Slider** | **Default** | **Range** | **Conservative** | **Moderate** | **Aggressive** | **Description**
---|---|---|---|---|---|---
Doubling Period | 7 months | 3-18 months | 12 months | 7 months | 4 months | How fast AI capability doubles (from METR baseline)
Reliability Requirement | 0.95 (95%) | 0.80-0.99 | 0.98 | 0.95 | 0.90 | Success rate needed before automation
Compute Growth | Baseline | Conservative/Baseline/Aggressive | Conservative | Baseline | Aggressive | Scaling of compute resources
Industry Drag | Low | Low/Moderate/High | High | Moderate | Low | Regulatory/adoption friction

### Role-Specific Slider Recommendations:
- **Finance/Accounting, Legal**: Higher reliability (0.98) due to regulatory requirements
- **Creative/Design, Content Writing**: Lower reliability (0.90-0.92) - "good enough" threshold
- **Most roles**: Default 0.95 reliability

---

## Sheet 5: Implementation Checklist

### Steps to use this template:

1. **Review & Adjust Role Baselines** (Sheet 1)
   - [ ] Validate Q1-Q20 values for each role
   - [ ] Check slider defaults make sense
   - [ ] Refine role descriptions

2. **Validate Seniority Logic** (Sheet 3)
   - [ ] Confirm adjustment logic makes sense
   - [ ] Test edge cases (Entry + High baseline values)

3. **Export to Code**
   - [ ] Convert Sheet 1 to JavaScript `ROLE_PRESETS` object
   - [ ] Convert Sheet 3 to JavaScript `SENIORITY_ADJUSTMENTS` object
   - [ ] Add preset application logic to index.html

4. **User Experience**
   - [ ] Add "Apply Preset" button after role/seniority selection
   - [ ] Show role description when preset is applied
   - [ ] Allow users to modify pre-filled answers
   - [ ] Add "Reset to Preset" option

---

## Notes on Scoring Philosophy

### High Scores (4-5) Indicate:
- **Q1-Q4**: Strong AI capability already exists
- **Q5-Q6**: Structured, repeatable work
- **Q7-Q12**: Protective factors (context, tacit knowledge, relationships)
- **Q13-Q16**: Conditions that accelerate adoption
- **Q17-Q20**: Factors improving job security/re-employment

### Calibration Targets:
- **Software/Tech**: Should show fastest displacement (many 5s in Q1-Q4, low in Q7-Q12)
- **Consulting/Strategy**: Should show moderate displacement (balanced scores)
- **Legal/Compliance**: Should show delayed displacement (high Q12, regulatory friction)
- **Content Writing**: Should show high technical feasibility but some implementation delay

### Cross-Validation:
After setting baselines, test a few combinations:
- Entry Software Engineer vs Senior Software Engineer
- Mid-Level Content Writer vs Executive Content Writer
- Compare against actual calculator results for reasonableness
