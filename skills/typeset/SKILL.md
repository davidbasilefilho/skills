---
name: typeset
description: "Improves typography by fixing font choices, hierarchy, sizing, weight, and readability so text feels intentional. Use when user mentions fonts, type, readability, text hierarchy, sizing looks off, or wants more polished, intentional typography."
argument-hint: "[target]"
user-invocable: true
---

Assess and improve typography that feels generic, inconsistent, or poorly structured. Turn default-looking text into intentional, well-crafted type.

## MANDATORY PREPARATION

Invoke {{command_prefix}}frontend-design. It contains design principles, anti-patterns, and Context Gathering Protocol. Follow protocol before proceeding. If no design context exists yet, you MUST run {{command_prefix}}teach-impeccable first.

---

## Assess Current Typography

Analyze what's weak or generic about current type.

### 1. Font choices
- Using invisible defaults? (Inter, Roboto, Arial, Open Sans, system defaults)
- Does font match brand personality? ( playful brand should not use corporate typeface)
- Too many font families? (More than 2-3 is almost always mess)

### 2. Hierarchy
- Can you tell headings from body from captions at glance?
- Are font sizes too close together? (14px, 15px, 16px = muddy hierarchy)
- Are weight contrasts strong enough? (Medium vs Regular is barely visible)

### 3. Sizing and scale
- Is there consistent type scale, or are sizes arbitrary?
- Does body text meet minimum readability? (16px+)
- Is sizing strategy appropriate for context? (Fixed rem scales for app UIs; fluid clamp() for marketing page headings)

### 4. Readability
- Are line lengths comfortable? (45-75 characters ideal)
- Is line-height appropriate for font and context?
- Is there enough contrast between text and background?

### 5. Consistency
- Are same elements styled same way throughout?
- Are font weights used consistently? (Not bold in one section, semibold in another for same role)
- Is letter-spacing intentional or default everywhere?

**CRITICAL**: goal is not to make text "fancier". it's to make it clearer, more readable, and more intentional. Good typography is invisible. Bad typography is distracting.

## Plan Typography Improvements

Consult [typography reference](reference/typography.md) from frontend-design skill for detailed guidance on scales, pairing, and loading strategies.

Create systematic plan.

- **Font selection**: Do fonts need replacing? What fits brand and context?
- **Type scale**: Establish modular scale (1.25 ratio) with clear hierarchy
- **Weight strategy**: Which weights serve which roles? (Regular for body, Semibold for labels, Bold for headings)
- **Spacing**: Line-heights, letter-spacing, and margins between typographic elements

## Improve Typography Systematically

### Font Selection

If fonts need replacing:
- Choose fonts that reflect brand personality
- Pair with genuine contrast (serif + sans, geometric + humanist) or use single family in multiple weights
- Ensure web font loading does not cause layout shift (font-display: swap, metric-matched fallbacks)

### Establish Hierarchy

Build clear type scale.
- **5 sizes cover most needs**: caption, secondary, body, subheading, heading
- **Use consistent ratio** between levels (1.25, 1.333, or 1.5)
- **Combine dimensions**: Size + weight + color + space for strong hierarchy. Do not rely on size alone.
- **App UIs**: Use fixed rem-based type scale, optionally adjusted at 1-2 breakpoints. Fluid sizing undermines spatial predictability that dense, container-based layouts need.
- **Marketing and content pages**: Use fluid sizing via clamp(min, preferred, max) for headings and display text. Keep body text fixed.

### Fix Readability
- Set max-width on text containers using ch units (max-width: 65ch)
- Adjust line-height per context: tighter for headings (1.1-1.2), looser for body (1.5-1.7)
- Increase line-height slightly for light-on-dark text
- Ensure body text is at least 16px / 1rem

### Refine Details
- Use tabular-nums for data tables and numbers that should align
- Apply proper letter-spacing: slightly open for small caps and uppercase, default or tight for large display text
- Use semantic token names (--text-body, --text-heading), not value names (--font-16)
- Set font-kerning: normal and consider OpenType features where appropriate

### Weight Consistency
- Define clear roles for each weight and stick to them
- Do not use more than 3-4 weights (Regular, Medium, Semibold, Bold is plenty)
- Load only weights you use (each weight adds to page load)

**NEVER**:
- Use more than 2-3 font families
- Pick sizes arbitrarily. Commit to scale.
- Set body text below 16px
- Use decorative or display fonts for body text
- Disable browser zoom (user-scalable=no)
- Use px for font sizes. Use rem to respect user settings.
- Default to Inter/Roboto/Open Sans when personality matters
- Pair fonts that are similar but not identical (two geometric sans-serifs)

## Verify Typography Improvements
- **Hierarchy**: Can you identify heading vs body vs caption instantly?
- **Readability**: Is body text comfortable to read in long passages?
- **Consistency**: Are same-role elements styled identically throughout?
- **Personality**: Does typography reflect brand?
- **Performance**: Are web fonts loading efficiently without layout shift?
- **Accessibility**: Does text meet WCAG contrast ratios? Is it zoomable to 200%?

Remember: Typography is foundation of interface design. It carries majority of information. Getting it right is highest-leverage improvement make.
