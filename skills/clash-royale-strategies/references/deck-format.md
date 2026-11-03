# Deck slots, names and output format

## Special slots

Do not assume a slot layout; it differs by account and game version. Observed on one account: slot 1 evolution only, slot 2 hero only, slot 3 mix (evolution or hero). The agent first got this wrong by guessing from icons.

Before assigning slots:

1. Confirm the layout with the player or a screenshot of the deck screen.
2. Place every evolution or hero the player owns in a slot that activates it. A card in a regular slot plays as its base form, so an owned evolution there is wasted.
3. A card cannot be both its evolution and its hero form in the same deck. Put a card that has both forms in a mix slot so the player can pick per deck.
4. Take evolution and hero status from the official API or a screenshot (see `data-sources.md`).

## Card names

- Use the official localized names in the player's language: the language they write in or their game locale. It is not necessarily Portuguese.
- Never invent a translation. Example error: the agent called Firecracker "Lançadora" when the pt-BR name is "Pirotécnica", and confused it with Royal Delivery ("Encomenda Real").
- When unsure of a localized name, add the official English name in parentheses or ask the player.

## Deck output

Number the cards 1 to 8 in exact in-game order: special slots first in their slot order, then the remaining cards. Take the order from the API `currentDeck[]` order or from a screenshot of the deck screen; if you have neither, ask the player for it. Do not reorder cards by role or elixir.

One line per card, the same form for every card:

`<n>. <localized name> | <slot type> | <rarity> | level <in-game level>`

`<slot type>` is `slot <n>: <type>` for a special slot (type as confirmed with the player, for example evolution only, hero only or mix) and `regular` otherwise. For a mix slot append the form used (`evo` or `hero`). In-game level is defined in SKILL.md step 2. After the list give the average elixir of the 8 cards.

Shape only; the slot types are placeholders for the confirmed layout:

```
1. <Name> | slot 1: <type> | <Rarity> | level <L>
2. <Name> | slot 2: <type> | <Rarity> | level <L>
3. <Name> | slot 3: <type>, <evo or hero> | <Rarity> | level <L>
4. <Name> | regular | <Rarity> | level <L>
...
8. <Name> | regular | <Rarity> | level <L>
Average elixir: <x.x>
```
