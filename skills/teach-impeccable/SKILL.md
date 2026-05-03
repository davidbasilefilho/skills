---
name: teach-impeccable
description: One-time setup that gathers design context for your project and saves it to your AI config file. Run once to establish persistent design guidelines.
user-invocable: true
---

Gather design context for this project, then persist it for all future sessions.

## Step 1: Explore the Codebase

Before asking questions, thoroughly scan project to discover what.

- **README and docs**: Project purpose, target audience, any stated goals
- **Package.json or config files**: Tech stack, dependencies, existing design libraries
- **Existing components**: Current design patterns, spacing, typography in use
- **Brand assets**: Logos, favicons, color values already defined
- **Design tokens or CSS variables**: Existing color palettes, font stacks, spacing scales
- **Any style guides or brand documentation**

Note what you have learned and what remains unclear.

## Step 2: Ask UX-Focused Questions

{{ask_instruction}} Focus only on what not infer from codebase.

### Users and Purpose
- Who uses this? What is their context when using it?
- What job are they trying to get done?
- What emotions should interface evoke? (confidence, delight, calm, urgency, etc.)

### Brand and Personality
- How would you describe brand personality in 3 words?
- Any reference sites or apps that capture right feel? What specifically about them?
- What should this explicitly NOT look like? Any anti-references?

### Aesthetic Preferences
- Any strong preferences for visual direction? (minimal, bold, elegant, playful, technical, organic, etc.)
- Light mode, dark mode, or both?
- Any colors that must be used or avoided?

### Accessibility and Inclusion
- Specific accessibility requirements? (WCAG level, known user needs)
- Considerations for reduced motion, color blindness, or other accommodations?

Skip questions where answer is already clear from codebase exploration.

## Step 3: Write Design Context

Synthesize your findings and user answers into Design Context section.

```markdown
## Design Context

### Users
[Who they are, their context, the job to be done]

### Brand Personality
[Voice, tone, 3-word personality, emotional goals]

### Aesthetic Direction
[Visual tone, references, anti-references, theme]

### Design Principles
[3-5 principles derived from the conversation that should guide all design decisions]
```

Write this section to `.impeccable.md` in project root. If file already exists, update Design Context section in place.

Then {{ask_instruction}} whether they would also like Design Context appended to {{config_file}}. If yes, append or update section there as well.

Confirm completion and summarize key design principles that will now guide all future work.
