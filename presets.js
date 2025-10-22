// Role and seniority presets for domain friction and reliability
// These are conservative priors grounded in domain tacit/physical/relational load
// and typical corporate QA requirements. They do not change METR doubling.

;(function(){
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  // Base per-role recommendations
  const ROLE_PRESETS = {
    'software':              { friction: 1.05, reliabilityBase: 0.92 },
    'admin':                 { friction: 1.10, reliabilityBase: 0.90 },
    'customer-service':      { friction: 1.15, reliabilityBase: 0.88 },
    'data-analysis':         { friction: 1.10, reliabilityBase: 0.93 },
    'finance':               { friction: 1.35, reliabilityBase: 0.97 },
    'sales':                 { friction: 1.25, reliabilityBase: 0.90 },
    'creative':              { friction: 1.20, reliabilityBase: 0.88 },
    'legal':                 { friction: 1.45, reliabilityBase: 0.98 },
    'product-management':    { friction: 1.30, reliabilityBase: 0.95 },
    'consulting':            { friction: 1.35, reliabilityBase: 0.96 },
    'hr':                    { friction: 1.30, reliabilityBase: 0.94 },
    'content-writing':       { friction: 1.10, reliabilityBase: 0.88 },
    'journalism':            { friction: 1.20, reliabilityBase: 0.90 },
    'engineering':           { friction: 1.50, reliabilityBase: 0.98 },
    'operations':            { friction: 1.25, reliabilityBase: 0.94 },
    'custom':                { friction: 1.20, reliabilityBase: 0.92 },
  };

  // Additive reliability adjustments by seniority index (1..5 -> 0..4)
  // Entry −0.05, Mid 0.00, Senior +0.03, Lead +0.04, Exec +0.05
  const SENIORITY_R_DELTAS = [-0.05, 0.00, 0.03, 0.04, 0.05];

  // Helper: compute recommended reliability for a role + seniority (clamped 0.80..0.99)
  function recommendReliability(roleKey, seniorityLevel){
    const base = (ROLE_PRESETS[roleKey] && ROLE_PRESETS[roleKey].reliabilityBase) || 0.92;
    const idx = Math.max(0, Math.min(4, (Number(seniorityLevel) || 1) - 1));
    const adj = SENIORITY_R_DELTAS[idx] || 0;
    return clamp(base + adj, 0.80, 0.99);
  }

  window.WWILMJ_PRESETS = {
    ROLE_PRESETS,
    SENIORITY_R_DELTAS,
    recommendReliability,
  };
})();

