---
name: arrange
description: "Improve layout, spacing, and visual rhythm. Fixes monotonous grids, inconsistent spacing, and weak visual hierarchy. Use when user mentions layout feeling off, spacing issues, visual hierarchy, crowded UI, alignment problems, or wanting better composition."
argument-hint: "[target]"
user-invocable: true
---

Assess and improve layout and spacing that feels monotonous, crowded, or structurally weak. Turn generic arrangements into intentional, rhythmic compositions.

## MANDATORY PREPARATION

Invoke {{command_prefix}}frontend-design. It contains design principles, anti-patterns, and Context Gathering Protocol. Follow protocol before proceeding. If no design context exists yet, you MUST run {{command_prefix}}teach-impeccable first.

---

## Assess Current Layout

Analyze what is weak about current spatial design.

### 1. Spacing
- Is spacing consistent or arbitrary? (Random padding or margin values)
- Is all spacing same? (Equal padding everywhere equals no rhythm)
- Are related elements grouped tightly, with generous space between groups?

### 2. Visual hierarchy
- Apply squint test: blur your (metaphorical) eyes. Can you still identify most important element, second most important, and clear groupings?
- Is hierarchy achieved effectively? (Space and weight alone can be enough. But is current approach working?)
- Does whitespace guide eye to what matters?

### 3. Grid and structure
- Is there clear underlying structure, or does layout feel random?
- Are identical card grids used everywhere? (Icon plus heading plus text, repeated endlessly)
- Is everything centered? (Left-aligned with asymmetric layouts feels more designed, but not hard and fast rule)

### 4. Rhythm and variety
- Does layout have visual rhythm? (Alternating tight or generous spacing)
- Is every section structured same way? (Monotonous repetition)
- Are there intentional moments of surprise or emphasis?

### 5. Density
- Is layout too cramped? (Not enough breathing room)
- Is layout too sparse? (Excessive whitespace without purpose)
- Does density match content type? (Data-dense UIs need tighter spacing; marketing pages need more air)

**CRITICAL**: Layout problems are often root cause of interfaces feeling "off" even when colors and fonts are fine. Space is design material. Use it with intention.

## Plan Layout Improvements

Consult [spatial design reference](reference/spatial-design.md) from frontend-design skill for detailed guidance on grids, rhythm, and container queries.

Create systematic plan.

- **Spacing system**: Use consistent scale. Whether that is framework built-in scale (e.g., Tailwind), rem-based tokens, or custom system. specific values matter less than consistency.
- **Hierarchy strategy**: How will space communicate importance?
- **Layout approach**: What structure fits content? Flex for 1D, Grid for 2D, named areas for complex page layouts.
- **Rhythm**: Where should spacing be tight vs generous?

## Improve Layout Systematically

### Establish a Spacing System

- Use consistent spacing scale. Framework scales (Tailwind, etc.), rem-based tokens, or custom scale all work. What matters is that values come from defined set, not arbitrary numbers.
- Name tokens semantically if using custom properties: --space-xs through --space-xl, not --spacing-8
- Use gap for sibling spacing instead of margins. Eliminates margin collapse hacks.
- Apply clamp() for fluid spacing that breathes on larger screens.

### Create Visual Rhythm

- **Tight grouping** for related elements (8-12px between siblings)
- **Generous separation** between distinct sections (48-96px)
- **Varied spacing** within sections. Not every row needs same gap.
- **Asymmetric compositions**. Break predictable centered-content pattern when it makes sense.

### Choose the Right Layout Tool

- **Use Flexbox for 1D layouts**: Rows of items, nav bars, button groups, card contents, most component internals. Flex is simpler and more appropriate for majority of layout tasks.
- **Use Grid for 2D layouts**: Page-level structure, dashboards, data-dense interfaces, anything where rows AND columns need coordinated control.
- **Do not default to Grid** when Flexbox with flex-wrap would be simpler and more flexible.
- Use repeat(auto-fit, minmax(280px, 1fr)) for responsive grids without breakpoints.
- Use named grid areas (grid-template-areas) for complex page layouts. Redefine at breakpoints.

### Break Card Grid Monotony

- Do not default to card grids for everything. Spacing and alignment create visual grouping naturally.
- Use cards only when content is truly distinct and actionable. Never nest cards inside cards.
- Vary card sizes, span columns, or mix cards with non-card content to break repetition.

### Strengthen Visual Hierarchy

- Use fewest dimensions needed for clear hierarchy. Space alone can be enough. Generous whitespace around element draws eye. Some of most sophisticated designs achieve rhythm with space and weight. Add color or size contrast only when simpler means are not sufficient.
- Be aware of reading flow. In LTR languages, eye naturally scans top-left to bottom-right, but primary action placement depends on context (e.g., bottom-right in dialogs, top in navigation).
- Create clear content groupings through proximity and separation.

### Manage Depth and Elevation

- Create semantic z-index scale (dropdown, sticky, modal-backdrop, modal, toast, tooltip)
- Build consistent shadow scale (sm, md, lg, xl). Shadows should be subtle.
- Use elevation to reinforce hierarchy, not as decoration.

### Optical Adjustments

- If icon looks visually off-center despite being geometrically centered, nudge it. But only if you are confident it looks wrong. Do not adjust speculatively.

**NEVER**:
- Use arbitrary spacing values outside your scale
- Make all spacing equal. Variety creates hierarchy.
- Wrap everything in cards. Not everything needs container.
- Nest cards inside cards. Use spacing and dividers for hierarchy within.
- Use identical card grids everywhere (icon plus heading plus text, repeated)
- Center everything. Left-aligned with asymmetry feels more designed.
- Default to hero metric layout (big number, small label, stats, gradient) as template. If showing real user data, prominent metric can work. But it should display actual data, not decorative numbers.
- Default to CSS Grid when Flexbox would be simpler. Use simplest tool for job.
- Use arbitrary z-index values (999, 9999). Build semantic scale.

## Verify Layout Improvements

- **Squint test**: Can you identify primary, secondary, and groupings with blurred vision?
- **Rhythm**: Does page have satisfying beat of tight and generous spacing?
- **Hierarchy**: Is most important content obvious within 2 seconds?
- **Breathing room**: Does layout feel comfortable, not cramped or wasteful?
- **Consistency**: Is spacing system applied uniformly?
- **Responsiveness**: Does layout adapt gracefully across screen sizes?

Remember: Space is most underused design tool. layout with right rhythm and hierarchy can make even simple content feel polished and intentional.
