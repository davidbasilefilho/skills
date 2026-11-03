# Deck slots, names and output format

## Special slots

Do not assume a slot layout; it differs by account and game version. Observed on one account: slot 1 evolution only, slot 2 hero only, slot 3 mix (evolution or hero). The agent first got this wrong by guessing from icons.

Before assigning slots:

1. Confirm the layout with the player or a screenshot of the deck screen.
2. Place every evolution or hero the player owns in a slot that activates it. A card in a regular slot plays as its base form, so an owned evolution there is wasted.
3. A card cannot be both its evolution and its hero form in the same deck. Put a card that has both forms in a mix slot so the player can pick per deck.
4. Evolution or hero status comes from the official API or a screenshot, not from third-party sites (see `data-sources.md`).

## Card names

- Use the official localized names in the player's language: the language they write in or their game locale. It is not necessarily Portuguese.
- Never invent a translation. Example error: the agent called Firecracker "Lançadora" when the pt-BR name is "Pirotécnica", and confused it with Royal Delivery ("Encomenda Real").
- When unsure of a localized name, add the official English name in parentheses or ask the player.

## Deck output

Number the cards 1 to 8 in exact in-game order: special slots first in their slot order (state each slot's type), then the remaining cards. One line per card:

`<n>. <localized name> [evo | hero | mix] | <rarity> | level <in-game level>`

Use the in-game level (real level, see SKILL.md). Omit the tag for regular cards. After the list give the average elixir of the 8 cards.

Illustration of the shape (not a recommendation):

```
1. <Name> (evo, slot 1: evolution only) | Common | level 15
2. <Name> (hero, slot 2: hero only) | Champion | level 14
3. <Name> (mix, slot 3: evo or hero) | Epic | level 13
4. <Name> | Rare | level 15
...
8. <Name> | Common | level 16
Average elixir: 3.4
```

Alternatives: at most 2 or 3, each with a one-line rationale. When the player asks you to choose, name one recommendation.

## Building rules that worked

- Include a real win condition. A deck of only support cards has no way to take towers.
- Build around the player's highest-level cards and the evolutions and heroes they own.
- Keep average elixir roughly 3.0 to 3.8 unless the player sets another target.
- Compare the proposal with the player's current deck: cards that left, cards that entered, elixir change, what is gained and what is lost.
- State real weak matchups; do not oversell.
