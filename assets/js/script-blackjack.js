/*
@author : Loan BOROWSKI
@update : 16/05/26

JS for the BlackJack

Assistance by AI : Generation of the documentation (Claude Sonnet 4.6)
*/

const settings_page = document.getElementById("settings-page");
const nb_decks = document.getElementById("nb-decks");
const nb_decks_slider = document.getElementById("nb-decks-selector");
const start_button = document.getElementById("start-button");
const dealer_hand_displayed = document.getElementById("dealer-hand");
const dealer_score_displayed = document.getElementById("dealer-score");
const player_hand_container = document.getElementById("player-hand-container");
const player_hand_displayed = document.getElementById("player-hand");
const player_score_displayed = document.getElementById("player-score");
const split_player_hand_container = document.getElementById("split-player-hand-container");
const split_player_hand_displayed = document.getElementById("split-player-hand");
const split_player_score_displayed = document.getElementById("split-player-score");
const player_hand_bet_displayed = document.getElementById("player-hand-bet");
const split_player_hand_bet_displayed = document.getElementById("split-player-hand-bet");
const bet_buttons = document.querySelectorAll(".bet-button");
const play_buttons = document.querySelectorAll(".play-button");
const play_button = document.getElementById("play");
const split_button = document.getElementById("split");
const double_button = document.getElementById("double");
const game_time_displayed = document.getElementById("game-time");
const result_displayed = document.getElementById("result");
const result_displayed_wrapper = document.getElementById("result-wrapper");
const bankroll_displayed = document.getElementById("bankroll");
const insurance_wrapper = document.getElementById("insurance-wrapper");
const mtd_wrapper = document.getElementById("mtd-wrapper");
const mtd_bet_display = document.getElementById("mtd-bet-display");
const mtd_button = document.getElementById("mtd-button");
const bet_buttons_mtd = document.querySelectorAll(".bet-button-mtd");
const hi_lo_counter_displayed = document.getElementById("hi-lo-counter");

const draw_card_sound = new Audio("assets/wav/draw-card.wav");
const chip_sound = new Audio("assets/wav/chip-sound.wav");
const win_sound = new Audio("assets/wav/win-sound.wav");
const lose_sound = new Audio("assets/wav/lose-sound.wav");
const push_sound = new Audio("assets/wav/push-sound.wav");
const blackjack_sound = new Audio("assets/wav/blackjack-sound.wav");

const signs = ["S", "H", "D", "C"];
const default_deck = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
const cards_value = {"2" : 2, "3" : 3, "4" : 4, "5" : 5, "6" : 6, "7" : 7, "8" : 8, "9" : 9, "10" : 10, "J" : 10, "Q" : 10, "K" : 10, "A" : 11};
const hi_lo_value = {"2" : 1, "3" : 1, "4" : 1, "5" : 1, "6" : 1, "7" : 0, "8" : 0, "9" : 0, "10" : -1, "J" : -1, "Q" : -1, "K" : -1, "A" : -1};
let deck = [];
let dealer_hand = [];
let dealer_score = 0;
let player_hand = [];
let split_player_hand = [];
let is_spliting = false;
let has_splited = false;
let player_score = 0;
let split_player_score = 0;
let player_bet = 0;
let split_player_bet = 0;
let insurance_bet = 0;
let win_insurance = false;
let mtd_bet = 0;
let is_dealer_first_round = false;
let bankroll = parseInt(bankroll_displayed.innerText.slice(11, -2), 10);
let old_bankroll = bankroll;
let discard = [];
let is_first_round = false;
let win_state = -1;
let is_running = false;
let game_time = {"h" : 0, "m" : 0, "s" : 0};
let hi_lo_counter = 0;
let true_count = 0;

settings_page.style.display = "flex";
split_player_hand_container.style.display = "none";
mtd_wrapper.style.display = "none";

nb_decks_slider.addEventListener('input', function() {
    nb_decks.innerText = this.value;
});

// Automatically saves the bankroll every second if it has changed
setInterval(() => {
    if(bankroll !== old_bankroll){
        const form_data = new FormData();
        form_data.append("bankroll", bankroll);

        fetch("index.php?action=update-bankroll", {
            method: "POST",
            body: form_data
        });
        old_bankroll = bankroll;
    }
}, 1000);

/**
 * Creates a promise that resolves after a given delay.
 * Used to introduce asynchronous pauses in the game.
 * @param {number} ms - Duration of the pause in milliseconds.
 * @returns {Promise<void>} A promise resolved after `ms` milliseconds.
*/
function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Shows or hides the settings page.
 * Toggles visibility between "flex" and "none".
*/
function displaySettings() 
{
    settings_page.style.display = settings_page.style.display == "none" ? "flex" : "none";
}

/**
 * Shows or hides the insurance panel.
 * Toggles visibility between "flex" and "none".
*/
function displayInsurance()
{
    insurance_wrapper.style.display = insurance_wrapper.style.display == "flex" ? "none" : "flex";
}

/**
 * Shows or hides the Match The Dealer (MTD) bet panel.
 * Toggles visibility between "block" and "none".
*/
function displayMTD()
{
    mtd_wrapper.style.display = mtd_wrapper.style.display == "block" ? "none" : "block";
}

// Updates the display of the Match The Dealer (MTD) bet amount.
function displayMTDBet()
{
    mtd_bet_display.innerHTML = "Bet : " + mtd_bet;
}

/**
 * Displays the last card added to the player's hand and updates their score.
 * Also plays the card drawing sound.
*/
function displayPlayerCards()
{
    draw_card_sound.play();
    player_hand_displayed.innerHTML += "<img src='assets/img/cards/" + player_hand[player_hand.length - 1][0] +  player_hand[player_hand.length - 1][1]  + ".png' class='cards'>";
    player_score_displayed.innerHTML = scoreCalculation(player_hand);
}

// Updates the display of the player's current bet.
function displayPlayerBet()
{
    player_hand_bet_displayed.innerText = player_bet;
}

// Updates the display of the player's split hand bet.
function displaySplitPlayerBet()
{
    split_player_hand_bet_displayed.innerText = split_player_bet;
}

/**
 * Displays the last card added to the player's split hand and updates their score.
 * Also plays the card drawing sound.
*/
function displaySplitPlayerCards()
{
    draw_card_sound.play();
    split_player_hand_displayed.innerHTML += "<img src='assets/img/cards/" + split_player_hand[split_player_hand.length - 1][0] +  split_player_hand[split_player_hand.length - 1][1]  + ".png' class='cards'>";
    split_player_score_displayed.innerHTML = scoreCalculation(split_player_hand);
}

/**
 * Displays the dealer's last card.
 * If `nb` equals 1, displays a face-down card (hole card); otherwise shows the real card.
 * Also plays the card drawing sound.
 * @param {number} [nb=0] - If 1, displays the dealer's hidden card; otherwise shows the actual card.
*/
function displayDealerCards(nb = 0)
{
    draw_card_sound.play();
    if(nb != 1){
        dealer_hand_displayed.innerHTML += "<img src='assets/img/cards/" + dealer_hand[dealer_hand.length - 1][0] + dealer_hand[dealer_hand.length - 1][1] + ".png' class='cards'>";
        dealer_score_displayed.innerHTML = scoreCalculation(dealer_hand);
    }
    else{
        dealer_hand_displayed.innerHTML += "<img src='assets/img/cards/hide.png' class='cards'>";
    }
}

// Updates the player's bankroll display in the interface.
function displayBankroll()
{
    bankroll_displayed.innerHTML = "Bankroll : " + bankroll + " €";
}

// Updates the Hi-Lo True Count display in the interface.
function displayTrueCount()
{
    hi_lo_counter_displayed.innerText = "True Count : " + true_count;
}

/**
 * Creates a shoe made up of `nb` standard 52-card decks.
 * Each card is represented as an array [value, suit].
 * @param {number} nb - Number of 52-card decks to include in the shoe.
 * @returns {Array<Array<string>>} The created shoe of cards.
*/
function createDeck(nb)
{
    let i, j, k, deck_created = [];
    for(i = 0 ; i < nb ; i++){
        for(j = 0 ; j < signs.length ; j++){
            for(k = 0 ; k < default_deck.length ; k++){
                deck_created.push([default_deck[k], signs[j]]);
            }
        }
    }
    return deck_created;
}

/**
 * Shuffles a deck of cards in place using the Fisher-Yates algorithm.
 * @param {Array<Array<string>>} deck - The deck of cards to shuffle.
*/
function shuffle(deck) 
{
    var j, x, i;
    for (i = deck.length - 1 ; i > 0 ; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = deck[i];
        deck[i] = deck[j];
        deck[j] = x;
    }
}

/**
 * Calculates the score of a blackjack hand.
 * Aces are worth 11 by default but are reduced to 1 if the score exceeds 21.
 * @param {Array<Array<string>>} deck_to_calculate - The hand of cards to evaluate.
 * @returns {number} The calculated score of the hand.
*/
function scoreCalculation(deck_to_calculate)
{
    let i, score = 0, nb_A = 0;
    for(i = 0 ; i < deck_to_calculate.length ; i++){
        if(deck_to_calculate[i][0] == "A"){
            nb_A++;
        }
        score += cards_value[deck_to_calculate[i][0]];
    }
    for(i = 0 ; i < nb_A ; i++){
        if(score > 21){
            score -= 10;
        }
    }
    return score;
}

/**
 * Draws the first card from the shoe and adds it to the specified hand.
 * The card is also added to the discard pile and the Hi-Lo counter is updated.
 * @param {Array<Array<string>>} hand - The hand to add the drawn card to.
*/
function drawCardTo(hand)
{
    hand.push(deck[0]);
    discard.push(deck[0]);
    deck = deck.slice(1);
    countHiLo();
    displayTrueCount();
}

/**
 * Handles the player's main bet.
 * If `val` equals -1, cancels the bet and refunds the player.
 * Otherwise, adds `val` to the bet and deducts the amount from the bankroll.
 * Updates the display and enables/disables buttons based on the remaining bankroll.
 * @param {number} val - Amount to bet, or -1 to cancel the bet.
*/
function bet(val)
{
    chip_sound.play();
    if(val == -1){
        bankroll += player_bet;
        player_bet = 0;
        play_button.disabled = true;
        displayBankroll();
        displayPlayerBet();
        bet_buttons.forEach(element => {
        if(bankroll - parseInt(element.value, 10) > 0){
            element.style.display = "flex";
        }
        });
        return;
    }
    player_bet += val;
    bankroll -= val;
    displayBankroll();
    displayPlayerBet();
    play_button.disabled = false;
    bet_buttons.forEach(element => {
        if(bankroll - parseInt(element.value, 10) < 0){
            element.style.display = "none";
        }
    });
}

/**
 * Handles the secondary Match The Dealer (MTD) side bet.
 * If `val` equals -1, cancels the MTD bet and refunds the player.
 * Otherwise, adds `val` to the MTD bet and deducts it from the bankroll.
 * Disables the MTD button while a bet is in progress.
 * @param {number} val - Amount to bet, or -1 to cancel the MTD bet.
*/
function betMTD(val)
{
    chip_sound.play();
    if(val == -1){
        bankroll += mtd_bet;
        mtd_bet = 0;
        mtd_button.disabled = false;
        displayBankroll();
        displayMTDBet();
        bet_buttons.forEach(element => {
            if(bankroll - parseInt(element.value, 10) > 0){
                element.style.display = "flex";
        }
        });
        return;
    }
    mtd_bet += val;
    bankroll -= val;
    displayBankroll();
    displayMTDBet();
    mtd_button.disabled = true;
    bet_buttons.forEach(element => {
        if(bankroll - parseInt(element.value, 10) < 0){
            element.style.display = "none";
        }
    });
}

/**
 * Visually sets which hand is active during a split.
 * Applies the CSS classes "active-hand" and "inactive-hand" according to the parameter.
 * @param {string} who - "player" to activate the main hand, "split" for the split hand.
*/
function setActiveHand(who)
{
    
    player_hand_container.classList.remove("active-hand", "inactive-hand");
    split_player_hand_container.classList.remove("active-hand", "inactive-hand");
    if(who == "player"){
        player_hand_container.classList.add("active-hand");
        split_player_hand_container.classList.add("inactive-hand");
    }
    else if(who == "split"){
        split_player_hand_container.classList.add("active-hand");
        player_hand_container.classList.add("inactive-hand");
    }
}

/**
 * Calculates and updates the True Count from the Hi-Lo Running Count.
 * The True Count is the Running Count divided by the number of remaining decks,
 * rounded to two decimal places.
*/
function countTrueCount()
{
    true_count = hi_lo_counter / (deck.length / 52);
    true_count = Math.round(true_count * 100) / 100;
}

/**
 * Recalculates the Hi-Lo Running Count from the cards in the discard pile.
 * If `nb` equals 1 or if it is the dealer's first round, the dealer's hole card
 * is excluded from the count (as it is not yet visible).
 * Also updates the True Count.
 * @param {number} [nb=0] - If 1, excludes the dealer's hole card from the count.
*/
function countHiLo(nb = 0)
{
    let i;
    hi_lo_counter = 0;
    for(i = 0 ; i < discard.length ; i++){
        hi_lo_counter += hi_lo_value[discard[i][0]];
    }
    if(nb == 1 || is_dealer_first_round){
        hi_lo_counter -= hi_lo_value[dealer_hand[1][0]];
    }
    countTrueCount();
}

/**
 * Handles the dealer's turn after the player has finished their actions.
 * Reveals the dealer's hole card, then draws cards until reaching 17 or more.
 * Then triggers the result calculation (standard or split).
 * @async
 */
async function dealerRound()
{
    is_dealer_first_round = false;
    countHiLo();
    displayTrueCount();
    play_buttons.forEach(element => {
        element.disabled = true;
    });
    dealer_hand_displayed.innerHTML = "<img src='assets/img/cards/" + dealer_hand[0][0] + dealer_hand[0][1] + ".png' class='cards'>";
    displayDealerCards();
    if((player_score <= 21 && checkWin() != "blackjack") || (has_splited && (player_score <= 21 || split_player_score <= 21))){
        while(dealer_score < 17){
            await sleep(500);
            drawCardTo(dealer_hand);
            countHiLo();
            displayTrueCount();
            dealer_score = scoreCalculation(dealer_hand);
            displayDealerCards();
        }
    }
    if(has_splited){
        splitResult();
    }
    else{
        result();
    }
}

/**
 * Resets the interface and variables for a new round.
 * Clears all hands, resets bets to zero, re-enables bet buttons,
 * and reloads the shoe if the remaining card count is too low (≤ 20).
 */
function newRound()
{
    player_hand_displayed.innerHTML = "";
    player_score_displayed.innerHTML = "";
    player_score_displayed.style.display = "none";
    split_player_hand_displayed.innerHTML = "";
    split_player_score_displayed.innerHTML = "";
    split_player_hand_container.style.display = "none";
    dealer_hand_displayed.innerHTML = "";
    dealer_score_displayed.innerHTML = "";
    dealer_score_displayed.style.display = "none";
    bet_buttons.forEach(element => {
        element.style.display = "block";
        if(bankroll - parseInt(element.value, 10) < 0){
            element.style.display = "none";
        }
    });
    play_buttons.forEach(element => {
        element.style.display = "none";
        element.disabled = false;
    });
    bet_buttons_mtd.forEach(element => {
        element.disabled = false;
    });
    player_bet = 0;
    player_score = 0;
    dealer_score = 0;
    split_player_score = 0;
    mtd_bet = 0;
    double_button.disabled = false;
    split_button.disabled = false;
    play_button.disabled = true;
    mtd_button.disabled = false;
    win_insurance = false;
    has_splited = false;
    player_hand = [];
    dealer_hand = [];
    split_player_hand = [];
    win_state = -1;
    is_first_round = true;
    displayPlayerBet();
    displaySplitPlayerBet();
    displayBankroll();
    displayMTDBet();
    setActiveHand("player");
    if(deck.length <= 20){ //? If there are few cards left for a turn, we attach the discard at the end of the deck and mix everything together, and reset Hi-Lo
        deck.push(discard);
        discard = [];
        shuffle(deck);
        hi_lo_counter = 0;
        displayTrueCount();
    }
}

/**
 * Deals the initial cards for a blackjack round.
 * Deals two cards to the player and two to the dealer (the dealer's second card is face down).
 * Checks if a blackjack or 21 is reached and triggers insurance if needed.
 * Also handles the MTD side bet and disables split if the player's two cards differ.
 * @async
 */
async function start()
{
    bet_buttons.forEach(element => {
        element.style.display = "none";
    });
    play_buttons.forEach(element => {
        element.style.display = "block";
        element.disabled = true;
    });
    bet_buttons_mtd.forEach(element => {
        element.disabled = true;
    });
    mtd_button.disabled = true;
    drawCardTo(player_hand);
    player_score_displayed.style.display = "block";
    setActiveHand("player");
    displayPlayerCards();
    await sleep(500);
    drawCardTo(dealer_hand);
    dealer_score_displayed.style.display = "block";
    displayDealerCards();
    await sleep(500);
    drawCardTo(player_hand);
    displayPlayerCards();
    await sleep(500);
    drawCardTo(dealer_hand);
    displayDealerCards(1);
    countHiLo(1);
    displayTrueCount();
    is_dealer_first_round = true;
    play_buttons.forEach(element => {
        element.disabled = false;
    });
    player_score = scoreCalculation(player_hand);
    dealer_score = scoreCalculation(dealer_hand);
    if(cards_value[player_hand[0][0]] != cards_value[player_hand[1][0]]){
        split_button.disabled = true;
    }
    resultMTD();
    if(dealer_hand[0][0] == "A"){
        displayInsurance();
        return;
    }
    if(player_score == 21 || dealer_score == 21){
        await sleep(500);
        dealerRound();
    }
}

/**
 * Checks the insurance bet result and displays the gain or loss.
 * If the player took insurance and the dealer has a blackjack,
 * the player receives 2:1 on their insurance bet.
 * @async
 */
async function checkInsurance()
{
    result_displayed_wrapper.style.display = "flex";
    if(win_insurance){
        win_sound.play();
        bankroll += insurance_bet + insurance_bet * 2;
        displayBankroll();
        result_displayed.innerHTML = "Insurance :<br>+" + insurance_bet * 2 + " €";
    }
    else{
        lose_sound.play();
        result_displayed.innerHTML = "Insurance :<br>-" + insurance_bet + " €";
    }
    await sleep(2000);
    result_displayed_wrapper.style.display = "none";
    win_insurance = false;
}

/**
 * Handles the player's actions on the split hand.
 * - "stand": the player moves to the main hand.
 * - "hit": draws an extra card for the split hand.
 * - "double": doubles the bet, draws one card and moves back to the main hand.
 * Disables the "double" button after the first turn.
 * @async
 * @param {string} act - The chosen action: "stand", "hit" or "double".
 */
async function splitAction(act)
{
    if(act == "stand"){
        is_spliting = false;
        double_button.disabled = false;
        setActiveHand("player");
        await sleep(500);
        drawCardTo(player_hand);
        displayPlayerCards();
        return;
    }
    else if(act == "hit" && split_player_score <= 20){
        is_first_round = false;
        drawCardTo(split_player_hand);
        split_player_score = scoreCalculation(split_player_hand);
        displaySplitPlayerCards();
        if(split_player_score >= 21){
            is_spliting = false;
            is_first_round = true;
            double_button.disabled = false;
            setActiveHand("player");
            await sleep(500);
            drawCardTo(player_hand);
            displayPlayerCards();
            return;
        }
    }
    else if(act == "double"){
        bankroll -= split_player_bet;
        split_player_bet *= 2;
        displayBankroll();
        displaySplitPlayerBet();
        drawCardTo(split_player_hand);
        split_player_score = scoreCalculation(split_player_hand);
        displaySplitPlayerCards();
        await sleep(500);
        is_spliting = false;
        double_button.disabled = false;
        setActiveHand("player");
        await sleep(500);
        drawCardTo(player_hand);
        displayPlayerCards();
        return;
    }
    if(!is_first_round){
        double_button.disabled = true;
    }
}

/**
 * Handles the player's actions on their main hand.
 * Redirects to splitAction() if a split is in progress.
 * Available actions:
 * - "stand": triggers the dealer's turn.
 * - "hit": draws an extra card.
 * - "split": splits the hand in two if both cards have the same value.
 * - "double": doubles the bet, draws one card, then moves to the dealer's turn.
 * - "insure": places an insurance bet (50% of the main bet).
 * - "dont_insure": declines insurance and continues normally.
 * Disables "double" and "split" after the first turn.
 * @async
 * @param {string} act - The chosen action: "stand", "hit", "split", "double", "insure", "dont_insure".
 */
async function action(act)
{
    if(is_spliting){
        splitAction(act);
        return;
    }
    if(act == "stand"){
        dealerRound();
    }
    else if(act == "hit" && player_score <= 20){
        is_first_round = false;
        drawCardTo(player_hand);
        player_score = scoreCalculation(player_hand);
        displayPlayerCards();
        if(player_score >= 21){
            await sleep(500);
            dealerRound();
        }
    }
    else if(act == "split"){
        is_spliting = true;
        has_splited = true;
        split_player_bet = player_bet;
        bankroll -= split_player_bet;
        setActiveHand("split");
        displayBankroll();
        displaySplitPlayerBet();
        split_button.disabled = true;
        split_player_hand.push(player_hand[1]);
        player_hand = player_hand.splice(0, 1);
        player_score = scoreCalculation(player_hand);
        split_player_score = scoreCalculation(split_player_hand);
        split_player_hand_container.style.display = "flex";
        player_hand_displayed.innerHTML = "";
        displayPlayerCards();
        displaySplitPlayerCards();
        await sleep(500);
        drawCardTo(split_player_hand);
        displaySplitPlayerCards();
    }
    else if(act == "double"){
        is_first_round = false;
        bankroll -= player_bet;
        player_bet *= 2;
        displayBankroll();
        displayPlayerBet();
        drawCardTo(player_hand);
        player_score = scoreCalculation(player_hand);
        displayPlayerCards();
        await sleep(500);
        dealerRound();
    }
    else if(act == "insure"){
        displayInsurance();
        insurance_bet = player_bet / 2;
        bankroll -= insurance_bet;
        displayBankroll();
        if(dealer_score == 21){
            win_insurance = true;
        }
        checkInsurance();
        if(player_score == 21 || dealer_score == 21){
            await sleep(500);
            dealerRound();
        }
    }
    else if(act == "dont_insure"){
        displayInsurance();
        if(dealer_score == 21){
            await sleep(500);
            dealerRound();
        }
        if(player_score == 21 || dealer_score == 21){
            await sleep(500);
            dealerRound();
        }
    }
    if(!is_first_round){
        double_button.disabled = true;
        split_button.disabled = true;
    }
}

/**
 * Checks the result of the Match The Dealer (MTD) side bet.
 * Compares the value and suit of the dealer's first card
 * against each of the player's two initial cards.
 * @returns {string|number} The MTD result:
 *   - "1 non suited": one card matches in value (different suit)
 *   - "2 non suited": both cards match in value (different suits)
 *   - "1 suited": one card matches in value AND suit
 *   - "1 non suited & 1 suited": one card matches (non suited) and another (suited)
 *   - "2 suited": both cards match in value AND suit
 *   - "lose": no card matches
 *   - -1: no MTD bet was placed
 */
function checkMTD()
{
    if(mtd_bet != 0){
        let dealer_nb_card = dealer_hand[0][0];
        let dealer_sign_card = dealer_hand[0][1];
        let player_nb_card1 = player_hand[0][0];
        let player_sign_card1 = player_hand[0][1];
        let player_nb_card2 = player_hand[1][0];
        let player_sign_card2 = player_hand[0][1];
        if(player_nb_card1 == dealer_nb_card && player_sign_card1 != dealer_sign_card && player_nb_card2 != dealer_nb_card && player_sign_card2 != dealer_sign_card){
            return "1 non suited";
        }
        else if(player_nb_card2 == dealer_nb_card && player_sign_card2 != dealer_sign_card && player_nb_card1 != dealer_nb_card && player_sign_card1 != dealer_sign_card){
            return "1 non suited";
        }
        else if(player_nb_card1 == dealer_nb_card && player_sign_card1 != dealer_sign_card && player_nb_card2 == dealer_nb_card && player_sign_card2 != dealer_sign_card){
            return "2 non suited";
        }
        else if(player_nb_card1 == dealer_nb_card && player_sign_card1 == dealer_sign_card && player_nb_card2 != dealer_nb_card && player_sign_card2 != dealer_sign_card){
            return "1 suited";
        }
        else if(player_nb_card2 == dealer_nb_card && player_sign_card2 == dealer_sign_card && player_nb_card1 != dealer_nb_card && player_sign_card1 != dealer_sign_card){
            return "1 suited";
        }
        else if(player_nb_card1 == dealer_nb_card && player_sign_card1 == dealer_sign_card && player_nb_card2 == dealer_nb_card && player_sign_card2 != dealer_sign_card){
            return "1 non suited & 1 suited";
        }
        else if(player_nb_card2 == dealer_nb_card && player_sign_card2 == dealer_sign_card && player_nb_card1 == dealer_nb_card && player_sign_card1 != dealer_sign_card){
            return "1 non suited & 1 suited";
        }
        else if(player_nb_card1 == dealer_nb_card && player_sign_card1 == dealer_sign_card && player_nb_card2 == dealer_nb_card && player_sign_card2 == dealer_sign_card){
            return "2 suited";
        }
        return "lose";
    }
    return -1;
}

/**
 * Calculates and displays the Match The Dealer (MTD) bet result.
 * Applies win multipliers based on the match type:
 * - "1 non suited": x4
 * - "2 non suited": x8
 * - "1 suited": x10
 * - "1 non suited & 1 suited": x14
 * - "2 suited": x20
 * - "lose": the MTD bet is lost
 * Updates the bankroll if the player wins.
 * @async
 */
async function resultMTD()
{
    let win_mtd = checkMTD();
    let win_mtd_bet = 0;
    if(win_mtd != -1){
        if(win_mtd == "1 non suited"){
            win_mtd_bet = mtd_bet * 4;
        }
        else if(win_mtd == "2 non suited"){
            win_mtd_bet = mtd_bet * 8;
        }
        else if(win_mtd == "1 suited"){
            win_mtd_bet = mtd_bet * 10;
        }
        else if(win_mtd == "1 non suited & 1 suited"){
            win_mtd_bet = mtd_bet * 14;
        }
        else if(win_mtd == "2 suited"){
            win_mtd_bet = mtd_bet * 20;
        }
        else if(win_mtd == "lose"){
            lose_sound.play();
            result_displayed_wrapper.style.display = "flex";
            result_displayed.innerHTML = "<u>Match The Dealer</u><br>Lose !<br>-" + mtd_bet + " €";
            await sleep(1000);
            result_displayed_wrapper.style.display = "none";
            await sleep(500);
            mtd_bet = 0;
            displayMTDBet();
            return;
        }
        win_sound.play();
        result_displayed_wrapper.style.display = "flex";
        result_displayed.innerHTML = "<u>Match The Dealer</u><br>" + win_mtd + "<br>+" + win_mtd_bet + " €";
        await sleep(2000);
        result_displayed_wrapper.style.display = "none";
        await sleep(500);
        bankroll += mtd_bet + win_mtd_bet;
        mtd_bet = 0;
        displayBankroll();
        displayMTDBet();
        await sleep(500);
    }
}

/**
 * Determines the result of the player's split hand against the dealer.
 * @returns {string|number} The result, one of:
 *   - "push": tie
 *   - "lose": the player loses
 *   - "bust": the player exceeds 21
 *   - "win": the player wins
 *   - -1: undetermined result
 */
function splitCheckWin()
{
    if(split_player_hand.length == 2 && split_player_score == 21){
        if(dealer_score == 21){
            return "push";
        }
    }
    else if(is_first_round && dealer_score == 21 && split_player_score < 21){
        return "lose";
    }
    else if(dealer_score == split_player_score && split_player_score <= 21 && dealer_score <= 21){
        return "push";
    }
    else if(split_player_score > 21){
        return "bust";
    }
    else if(dealer_score > split_player_score && dealer_score <= 21){
        return "lose";
    }
    else if(dealer_score < split_player_score){
        return "win";
    }
    else if(dealer_score > 21){
        return "win";
    }
    return -1;
}

/**
 * Determines the result of the player's main hand against the dealer.
 * Takes into account a natural blackjack (only outside of a split).
 * @returns {string|number} The result, one of:
 *   - "push": tie
 *   - "blackjack": natural blackjack (pays 3:2)
 *   - "lose": the player loses
 *   - "bust": the player exceeds 21
 *   - "win": the player wins
 *   - -1: undetermined result
 */
function checkWin()
{
    if(player_hand.length == 2 && player_score == 21){
        if(dealer_score == 21){
            return "push";
        }
        if(!has_splited){
            return "blackjack";
        }
    }
    else if(is_first_round && dealer_score == 21 && player_score < 21){
        return "lose";
    }
    else if(dealer_score == player_score && player_score <= 21 && dealer_score <= 21){
        return "push";
    }
    else if(player_score > 21){
        return "bust";
    }
    else if(dealer_score > player_score && dealer_score <= 21){
        return "lose";
    }
    else if(dealer_score < player_score){
        return "win";
    }
    else if(dealer_score > 21){
        return "win";
    }
    return -1;
}

/**
 * Displays the result of the player's split hand and updates the bankroll accordingly.
 * Handles the cases: lose, bust, win, push.
 * If the bankroll reaches 0, displays a message and returns to the settings page.
 * Then chains into result() for the main hand.
 * @async
 */
async function splitResult(){
    await sleep(1000);
    win_state = splitCheckWin();
    if(win_state == "lose"){
        lose_sound.play();
        result_displayed_wrapper.style.display = "flex";
        result_displayed.innerHTML = "<u>Split</u><br>Lose !<br>-" + split_player_bet + " €";
        await sleep(2000);
        result_displayed_wrapper.style.display = "none";
        await sleep(500);
        displayBankroll();
    }
    else if(win_state == "bust"){
        lose_sound.play();
        result_displayed_wrapper.style.display = "flex";
        result_displayed.innerHTML = "<u>Split</u><br>Bust !<br>-" + split_player_bet + " €";
        await sleep(2000);
        result_displayed_wrapper.style.display = "none";
        await sleep(500);
        displayBankroll();
    }
    else if(win_state == "win"){
        win_sound.play();
        result_displayed_wrapper.style.display = "flex";
        result_displayed.innerHTML = "<u>Split</u><br>Win !<br>+" + split_player_bet + " €";
        await sleep(2000);
        result_displayed_wrapper.style.display = "none";
        bankroll += split_player_bet + split_player_bet;
        await sleep(500);
        displayBankroll();
    }
    else if(win_state == "push"){
        push_sound.play();
        result_displayed_wrapper.style.display = "flex";
        result_displayed.innerHTML = "<u>Split</u><br>Push !";
        await sleep(2000);
        result_displayed_wrapper.style.display = "none";
        bankroll += split_player_bet;
        await sleep(500);
        displayBankroll();
    }
    if(bankroll <= 0){
        result_displayed_wrapper.style.display = "flex";
        result_displayed.innerText = "No more money !";
        await sleep(2000);
        result_displayed_wrapper.style.display = "none";
        displaySettings();
        return;
    }
    if(win_state != -1){
        result();
    }
}

/**
 * Displays the final result of the player's main hand and updates the bankroll.
 * Handles the cases: lose, bust, blackjack (pays 3:2), win, push.
 * If the bankroll reaches 0, displays a message and returns to the settings page.
 * Then chains into newRound() to start a new round.
 * @async
 */
async function result(){
    await sleep(1000);
    win_state = checkWin();
    if(win_state == "lose"){
        lose_sound.play();
        result_displayed_wrapper.style.display = "flex";
        result_displayed.innerHTML = "Lose !<br>-" + player_bet + " €";
        await sleep(2000);
        result_displayed_wrapper.style.display = "none";
        await sleep(500);
        displayBankroll();
    }
    else if(win_state == "bust"){
        lose_sound.play();
        result_displayed_wrapper.style.display = "flex";
        result_displayed.innerHTML = "Bust !<br>-" + player_bet + " €";
        await sleep(2000);
        result_displayed_wrapper.style.display = "none";
        await sleep(500);
        displayBankroll();
    }
    else if(win_state == "blackjack"){
        blackjack_sound.play();
        result_displayed_wrapper.style.display = "flex";
        result_displayed.innerHTML = "BlackJack !<br>+" + player_bet * 1.5 + " €";
        await sleep(2000);
        result_displayed_wrapper.style.display = "none";
        bankroll += player_bet + player_bet * 1.5;
        await sleep(500);
        displayBankroll();
    }
    else if(win_state == "win"){
        win_sound.play();
        result_displayed_wrapper.style.display = "flex";
        result_displayed.innerHTML = "Win !<br>+" + player_bet + " €";
        await sleep(2000);
        result_displayed_wrapper.style.display = "none";
        bankroll += player_bet + player_bet;
        await sleep(500);
        displayBankroll();
    }
    else if(win_state == "push"){
        push_sound.play();
        result_displayed_wrapper.style.display = "flex";
        result_displayed.innerText = "Push !";
        await sleep(2000);
        result_displayed_wrapper.style.display = "none";
        bankroll += player_bet;
        await sleep(500);
        displayBankroll();
    }
    if(bankroll <= 0){
        result_displayed_wrapper.style.display = "flex";
        result_displayed.innerText = "No more money !";
        await sleep(2000);
        result_displayed_wrapper.style.display = "none";
        displaySettings();
        return;
    }
    if(win_state != -1){
        newRound();
    }
}

/**
 * Initializes and starts a new blackjack game.
 * Resets all game variables, creates and shuffles a new shoe
 * based on the selected number of decks, starts the game timer
 * and launches the first round via newRound().
 */
function startGame() 
{
    let id_timer = setInterval(() => {
        game_time["s"]++;
        if(game_time["s"] == 60){
            game_time["s"] = 0;
            game_time["m"]++;
        }
        if(game_time["m"] == 60){
            game_time["m"] = 0;
            game_time["h"]++;
        }
        game_time_displayed.innerText = game_time["h"] + "h " + game_time["m"] + "m " + game_time["s"] + "s";
    }, 1000);
    if(is_running){
        clearInterval(id_timer);
    }
    deck = [];
    dealer_hand = [];
    dealer_score = 0;
    player_hand = [];
    split_player_hand = [];
    player_score = 0;
    player_bet = 0;
    split_player_bet = 0;
    insurance_bet = 0;
    win_insurance = false;
    discard = [];
    is_first_round = false;
    win_state = -1;
    is_running = true;
    game_time = {"h" : 0, "m" : 0, "s" : 0};
    displayBankroll();
    bet_buttons.forEach(element => {
        element.disabled = false;
    });
    start_button.innerHTML = "Restart a game";
    displaySettings();
    deck = createDeck(nb_decks_slider.value);
    shuffle(deck);
    newRound();
}