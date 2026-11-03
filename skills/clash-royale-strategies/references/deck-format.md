# Deck format

## Special slots

Default deck layout:

| Slot | Type |
|---|---|
| 1 | Evolution |
| 2 | Hero |
| 3 | Wild (evolution or hero) |
| 4 to 8 | Regular |

Use this layout unless a screenshot or the player shows a different one; then follow theirs. Do not guess slot types from card icons (an earlier mistake).

When assigning slots:

1. Put an owned evolution in slot 1, an owned hero in slot 2, and the next best evolution or hero in slot 3.
2. Place every evolution or hero the player owns in a slot that activates it. A card in a regular slot plays as its base form, so an owned evolution there is wasted.
3. A card cannot be both its evolution and its hero form in the same deck. Put a card that has both forms in the wild slot so the player can pick per deck.
4. Take evolution and hero status from a screenshot or the player (see [Data sources](data-sources.md)).

## Card names

- Use the official localized names in the player's language: the language they write in or their game locale. It is not necessarily Portuguese.
- Never invent a translation. Example error: the agent called Firecracker "Lançadora" when the pt-BR name is "Pirotécnica", and confused it with Royal Delivery ("Encomenda Real").
- When unsure of a localized name, add the official English name in parentheses or ask the player.

## Deck output

Number the cards 1 to 8 in exact in-game order: special slots first in their slot order, then the remaining cards. Take the order from a screenshot of the deck screen (or `currentDeck[]` in pasted JSON); if you have neither, ask the player for it. Do not reorder cards by role or elixir.

One line per card, the same form for every card:

`<n>. <localized name> | <slot type> | <rarity> | level <in-game level>`

`<slot type>` is `evo` for slot 1, `hero` for slot 2, `wild: evo` or `wild: hero` for slot 3, and `regular` for slots 4 to 8 (adapt if the player's layout differs). In-game level is defined in [SKILL.md](../SKILL.md) step 2. After the list give the average elixir of the 8 cards.

Shape:

```
1. <Name> | evo | <Rarity> | level <L>
2. <Name> | hero | <Rarity> | level <L>
3. <Name> | wild: <evo or hero> | <Rarity> | level <L>
4. <Name> | regular | <Rarity> | level <L>
...
8. <Name> | regular | <Rarity> | level <L>
Average elixir: <x.x>
```
