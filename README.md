# Blackjack

A browser-based Blackjack game built with vanilla HTML, CSS and JavaScript. The game runs entirely client-side with no dependencies.

---

## Getting Started

Open `index.html` in any modern browser. Before the first round, a settings panel asks you to choose the number of card decks (1 to 12). Click "Start a game" to begin. The starting bankroll is 2000.

---

## Core Rules

- The dealer must stand on soft 17.
- Blackjack pays 3 to 2.
- Insurance pays 2 to 1 and costs half the initial bet.
- A blackjack on a split hand does not count as a natural blackjack and pays 1 to 1.

---

## Gameplay

### Betting

Before each round, place your bet using the chip buttons at the bottom of the screen. Available chip values are 10, 50, 100, 500 and 1000. The clear button returns the current bet to your bankroll. The play button starts the round once a bet has been placed. Chips that exceed your available bankroll are automatically hidden.

### Actions

During a round the following actions are available:

- **Hit** — draw an additional card.
- **Stand** — end your turn and let the dealer play.
- **Double** — double the bet, draw exactly one more card, then stand.
- **Split** — available when both initial cards share the same value. The hand is split into two independent hands, each receiving a second card. Both hands are then played separately with their own bets.

### Split

When a split is performed, the two hands are displayed side by side. A gold arrow indicator shows which hand is currently active. The split hand is played first (Hit, Stand, Double), then control returns to the main hand. Each hand has its own bet displayed directly on screen.

After completing the split hand, the player automatically receives a new card on the main hand before continuing play.

### Insurance

When the dealer's face-up card is an Ace, the player is offered insurance before the dealer checks for Blackjack. Insurance costs half the initial bet. If the dealer has Blackjack, insurance pays 2 to 1. The round then continues normally for the main bet.

### Dealer Round

Once the player has finished, the dealer reveals the hidden card and draws until reaching a score of 17 or higher. Cards are revealed one by one with a short animation. The dealer does not draw additional cards if the player has already busted or hit Blackjack on all active hands.

---

## Side Bet — Match The Dealer

Match The Dealer is an optional side bet placed before the round starts. Click the "Match The Dealer" button at the bottom right to open the betting panel. The bet is resolved at the end of the round based on whether either of the player's initial cards matches the dealer's face-up card in rank.

The Match The Dealer button is disabled during the round and re-enabled between rounds.

Payouts:

| Result                        | Payout  |
|-------------------------------|---------|
| 1 non-suited match            | 4 to 1  |
| 2 non-suited matches          | 8 to 1  |
| 1 suited match                | 10 to 1 |
| 1 non-suited and 1 suited     | 14 to 1 |
| 2 suited matches              | 20 to 1 |

---

## Hi-Lo Card Counting

A Hi-Lo count is displayed at the bottom left of the screen. It tracks the running count and the true count across all dealt cards and provides a recommendation based on the current value.

Card values used for the count:

| Cards           | Count value |
|-----------------|-------------|
| 2 through 6     | +1          |
| 7, 8, 9         | 0           |
| 10, J, Q, K, A  | -1          |

The true count is calculated by dividing the running count by the number of remaining decks, rounded to two decimal places. Both values are reset when the shoe is reshuffled.

The dealer's hidden card is excluded from the count until it is revealed.

---

## Sound Effects

The game plays audio feedback for the following events:

- Drawing a card
- Placing a chip
- Winning a hand
- Losing a hand
- Push
- Blackjack

---

## Settings

The settings panel is accessible at any time via the gear icon in the top right corner. It allows restarting the game and selecting a new number of decks. Restarting resets the bankroll to 2000, the game timer to zero, and the Hi-Lo count to zero.

---

## Game Timer

A timer in the top center of the screen tracks the total time elapsed since the current game was started. The timer is properly cleared and restarted when a new game begins.

---

## Deck Management

When fewer than 20 cards remain in the shoe, the discard pile is shuffled back in automatically before the next round begins. The Hi-Lo running count and true count are reset to zero at that point.
