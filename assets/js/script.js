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
let bankroll = 2000;
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

function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

function displaySettings() 
{
    settings_page.style.display = settings_page.style.display == "none" ? "flex" : "none";
}

function displayInsurance()
{
    insurance_wrapper.style.display = insurance_wrapper.style.display == "flex" ? "none" : "flex";
}

function displayMTD()
{
    mtd_wrapper.style.display = mtd_wrapper.style.display == "block" ? "none" : "block";
}

function displayMTDBet()
{
    mtd_bet_display.innerHTML = "Bet : " + mtd_bet;
}

function displayPlayerCards()
{
    draw_card_sound.play();
    player_hand_displayed.innerHTML += "<img src='assets/img/cards/" + player_hand[player_hand.length - 1][0] +  player_hand[player_hand.length - 1][1]  + ".png' class='cards'>";
    player_score_displayed.innerHTML = scoreCalculation(player_hand);
}

function displayPlayerBet()
{
    player_hand_bet_displayed.innerText = player_bet;
}

function displaySplitPlayerBet()
{
    split_player_hand_bet_displayed.innerText = split_player_bet;
}

function displaySplitPlayerCards()
{
    draw_card_sound.play();
    split_player_hand_displayed.innerHTML += "<img src='assets/img/cards/" + split_player_hand[split_player_hand.length - 1][0] +  split_player_hand[split_player_hand.length - 1][1]  + ".png' class='cards'>";
    split_player_score_displayed.innerHTML = scoreCalculation(split_player_hand);
}

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

function displayBankroll()
{
    bankroll_displayed.innerHTML = "Bankroll : " + bankroll + " €";
}

function displayTrueCount()
{
    hi_lo_counter_displayed.innerText = "True Count : " + true_count;
}

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

function dealCardTo(hand)
{
    hand.push(deck[0]);
    discard.push(deck[0]);
    deck = deck.slice(1);
    countHiLo();
    displayTrueCount();
}

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

function betMTD(val)
{
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

function countTrueCount()
{
    true_count = hi_lo_counter / (deck.length / 52);
    true_count = Math.round(true_count * 100) / 100;
}

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
    if((player_score <= 21 && checkWin() != "blackjack") || (has_splited && player_score <= 21 && split_player_score <= 21)){
        while(dealer_score < 17){
            await sleep(500);
            dealCardTo(dealer_hand);
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
    dealCardTo(player_hand);
    player_score_displayed.style.display = "block";
    setActiveHand("player");
    displayPlayerCards();
    await sleep(500);
    dealCardTo(dealer_hand);
    dealer_score_displayed.style.display = "block";
    displayDealerCards();
    await sleep(500);
    dealCardTo(player_hand);
    displayPlayerCards();
    await sleep(500);
    dealCardTo(dealer_hand);
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

async function splitAction(act)
{
    if(act == "stand"){
        is_spliting = false;
        double_button.disabled = false;
        setActiveHand("player");
        return;
    }
    else if(act == "hit" && split_player_score <= 20){
        is_first_round = false;
        dealCardTo(split_player_hand);
        split_player_score = scoreCalculation(split_player_hand);
        displaySplitPlayerCards();
        if(split_player_score >= 21){
            is_spliting = false;
            is_first_round = true;
            double_button.disabled = false;
            setActiveHand("player");
            return;
        }
    }
    else if(act == "double"){
        bankroll -= split_player_bet;
        split_player_bet *= 2;
        displayBankroll();
        displaySplitPlayerBet();
        dealCardTo(split_player_hand);
        split_player_score = scoreCalculation(split_player_hand);
        displaySplitPlayerCards();
        await sleep(500);
        is_spliting = false;
        double_button.disabled = false;
        setActiveHand("player");
        return;
    }
    if(!is_first_round){
        double_button.disabled = true;
    }
}

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
        dealCardTo(player_hand);
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
        player_hand_displayed.innerHTML = "<img src='assets/img/cards/" + player_hand[0][0] +  player_hand[0][1]  + ".png' class='cards'>";
        player_score_displayed.innerText = player_score;
        split_player_hand_displayed.innerHTML = "<img src='assets/img/cards/" + split_player_hand[0][0] + split_player_hand[0][1] + ".png' class='cards'>";
        split_player_score_displayed.innerText = split_player_score;
    }
    else if(act == "double"){
        is_first_round = false;
        bankroll -= player_bet;
        player_bet *= 2;
        displayBankroll();
        displayPlayerBet();
        dealCardTo(player_hand);
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
    bankroll = 2000;
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