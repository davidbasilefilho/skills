---
name: overdrive
description: "Pushes interfaces past conventional limits with technically ambitious implementations — shaders, spring physics, scroll-driven reveals, 60fps animations. Use when user wants to wow, impress, go all-out, or make something that feels extraordinary."
argument-hint: "[target]"
user-invocable: true
---

Start your response with:

```
───────────── ⚡ OVERDRIVE ─────────────
》》》 Entering overdrive mode...
```

Push interface past conventional limits. This is not about visual effects. it's about using full power of browser to make any part of interface feel extraordinary: table that handles million rows, dialog that morphs from its trigger, form that validates in real-time with streaming feedback, page transition that feels cinematic.

## MANDATORY PREPARATION

Invoke {{command_prefix}}frontend-design. It contains design principles, anti-patterns, and Context Gathering Protocol. Follow protocol before proceeding. If no design context exists yet, you MUST run {{command_prefix}}teach-impeccable first.

**EXTRA IMPORTANT FOR THIS SKILL**: Context determines what "extraordinary" means. particle system on creative portfolio is impressive. same particle system on settings page is embarrassing. But settings page with instant optimistic saves and animated state transitions? That is extraordinary too. Understand project personality and goals before deciding what is appropriate.

### Propose Before Building

This skill has highest potential to misfire. Do NOT jump straight into implementation. You MUST:

1. **Think through 2-3 different directions**. Consider different techniques, levels of ambition, and aesthetic approaches. For each direction, briefly describe what result would look and feel like.
2. **{{ask_instruction}}** to present these directions and get user pick before writing any code. Explain trade-offs (browser support, performance cost, complexity).
3. Only proceed with direction user confirms.

Skipping this step risks building something embarrassing that needs to be thrown away.

### Iterate with Browser Automation

Technically ambitious effects almost never work on first try. You MUST actively use browser automation tools to preview your work, visually verify result, and iterate. Do not assume effect looks right. Check it. Expect multiple rounds of refinement. gap between "technically works" and "looks extraordinary" is closed through visual iteration, not code alone.

---

## Assess What "Extraordinary" Means Here

 right kind of technical ambition depends entirely on what you are working with. Before choosing technique, ask: **what would make user of THIS specific interface say "wow, that is nice"?**

### For visual or marketing surfaces
Pages, hero sections, landing pages, portfolios. "wow" is often sensory: scroll-driven reveal, shader background, cinematic page transition, generative art that responds to cursor.

### For functional UI
Tables, forms, dialogs, navigation. "wow" is in how it FEELS: dialog that morphs from button that triggered it via View Transitions, data table that renders 100k rows at 60fps via virtual scrolling, form with streaming validation that feels instant, drag-and-drop with spring physics.

### For performance-critical UI
 "wow" is invisible but felt: search that filters 50k items without flicker, complex form that never blocks main thread, image editor that processes in near-real-time. interface never hesitates.

### For data-heavy interfaces
Charts and dashboards. "wow" is in fluidity: GPU-accelerated rendering via Canvas or WebGL for massive datasets, animated transitions between data states, force-directed graph layouts that settle naturally.

** common thread**: something about implementation goes beyond what users expect from web interface. technique serves experience, not other way around.

## The Toolkit

Organized by what you are trying to achieve, not by technology name.

### Make transitions feel cinematic
- **View Transitions API** (same-document: all browsers; cross-document: no Firefox). Shared element morphing between states. list item expanding into detail page. button morphing into dialog. This is closest thing to native FLIP animations.
- **@starting-style** (all browsers). Animate elements from display: none to visible with CSS only, including entry keyframes.
- **Spring physics**. Natural motion with mass, tension, and damping instead of cubic-bezier. Libraries: motion (formerly Framer Motion), GSAP, or roll your own spring solver.

### Tie animation to scroll position
- **Scroll-driven animations** (animation-timeline: scroll()). CSS-only, no JS. Parallax, progress bars, reveal sequences all driven by scroll position. (Chrome, Edge, Safari; Firefox: flag only. Always provide static fallback)

### Render beyond CSS
- **WebGL** (all browsers). Shader effects, post-processing, particle systems. Libraries: Three.js, OGL (lightweight), regl. Use for effects CSS cannot express.
- **WebGPU** (Chrome, Edge; Safari partial; Firefox: flag only). Next-gen GPU compute. More powerful than WebGL but limited browser support. Always fall back to WebGL2.
- **Canvas 2D or OffscreenCanvas**. Custom rendering, pixel manipulation, or moving heavy rendering off main thread entirely via Web Workers and OffscreenCanvas.
- **SVG filter chains**. Displacement maps, turbulence, morphology for organic distortion effects. CSS-animatable.

### Make data feel alive
- **Virtual scrolling**. Render only visible rows for tables or lists with tens of thousands of items. No library required for simple cases. TanStack Virtual for complex ones.
- **GPU-accelerated charts**. Canvas or WebGL-rendered data visualization for datasets too large for SVG or DOM. Libraries: deck.gl, regl-based custom renderers.
- **Animated data transitions**. Morph between chart states rather than replacing. D3 transition() or View Transitions for DOM-based charts.

### Animate complex properties
- **@property** (all browsers). Register custom CSS properties with types, enabling animation of gradients, colors, and complex values that CSS cannot normally interpolate.
- **Web Animations API** (all browsers). JavaScript-driven animations with performance of CSS. Composable, cancellable, reversible. foundation for complex choreography.

### Push performance boundaries
- **Web Workers**. Move computation off main thread. Heavy data processing, image manipulation, search indexing. Anything that would cause jank.
- **OffscreenCanvas**. Render in Worker thread. main thread stays free while complex visuals render in background.
- **WASM**. Near-native performance for computation-heavy features. Image processing, physics simulations, codecs.

### Interact with the device
- **Web Audio API**. Spatial audio, audio-reactive visualizations, sonic feedback. Requires user gesture to start.
- **Device APIs**. Orientation, ambient light, geolocation. Use sparingly and always with user permission.

**NOTE**: This skill is about enhancing how interface FEELS, not changing what product DOES. Adding real-time collaboration, offline support, or new backend capabilities are product decisions, not UI enhancements. Focus on making existing features feel extraordinary.

## Implement with Discipline

### Progressive enhancement is non-negotiable

Every technique must degrade gracefully. experience without enhancement must still be good.

```css
@supports (animation-timeline: scroll()) {
  .hero { animation-timeline: scroll(); }
}
```

```javascript
if ('gpu' in navigator) { /* WebGPU */ }
else if (canvas.getContext('webgl2')) { /* WebGL2 fallback */ }
/* CSS-only fallback must still look good */
```

### Performance rules

- Target 60fps. If dropping below 50, simplify.
- Respect prefers-reduced-motion. Always. Provide beautiful static alternative.
- Lazy-initialize heavy resources (WebGL contexts, WASM modules) only when near viewport.
- Pause off-screen rendering. Kill what you cannot see.
- Test on real mid-range devices, not your development machine.

### Polish is the difference

 gap between "cool" and "extraordinary" is in last 20% of refinement: easing curve on spring animation, timing offset in staggered reveal, subtle secondary motion that makes transition feel physical. Do not ship first version that works. Ship version that feels inevitable.

**NEVER**:
- Ignore prefers-reduced-motion. This is accessibility requirement, not suggestion
- Ship effects that cause jank on mid-range devices
- Use bleeding-edge APIs without functional fallback
- Add sound without explicit user opt-in
- Use technical ambition to mask weak design fundamentals. Fix those first with other skills.
- Layer multiple competing extraordinary moments. Focus creates impact, excess creates noise.

## Verify the Result

- ** wow test**: Show it to someone who has not seen it. Do they react?
- ** removal test**: Take it away. Does experience feel diminished, or does nobody notice?
- ** device test**: Run it on phone, tablet, Chromebook. Still smooth?
- ** accessibility test**: Enable reduced motion. Still beautiful?
- ** context test**: Does this make sense for THIS brand and audience?

Remember: "Technically extraordinary" is not about using newest API. it's about making interface do something users did not think website could do.
