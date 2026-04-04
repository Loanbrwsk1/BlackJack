const settings_page = document.getElementById("settings-page");
const nb_decks = document.getElementById("nb-decks");
const nb_decks_slider = document.getElementById("nb-decks-selector");
const start_button = document.getElementById("start-button");
const dealer_hand_displayed = document.getElementById("dealer-hand");
const dealer_score_displayed = document.getElementById("dealer-score");
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
const player_hand_container = document.getElementById("player-hand-container");

const signs = ["S", "H", "D", "C"];
const default_deck = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
const cards_value = {"2" : 2, "3" : 3, "4" : 4, "5" : 5, "6" : 6, "7" : 7, "8" : 8, "9" : 9, "10" : 10, "J" : 10, "Q" : 10, "K" : 10, "A" : 11};
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
let total_bet = 0;
let split_player_bet = 0;
let insurance_bet = 0;
let win_insurance = false;
let bankroll = 2000;
let discard = [];
let game_state = "";
let win_state = -1;
let game_time = {"h" : 0, "m" : 0, "s" : 0};

settings_page.style.display = "flex";
split_player_hand_container.style.display = "none";

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

function displayPlayerCards()
{
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
    split_player_hand_displayed.innerHTML += "<img src='assets/img/cards/" + split_player_hand[split_player_hand.length - 1][0] +  split_player_hand[split_player_hand.length - 1][1]  + ".png' class='cards'>";
    split_player_score_displayed.innerHTML = scoreCalculation(split_player_hand);
}

function displayDealerCards(nb = 0)
{
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
    bankroll_displayed.innerHTML = "Bankroll : " + bankroll + " €<br>Bet : " + total_bet + " €";
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
}

function bet(val)
{
    if(val == -1){
        bankroll += total_bet;
        total_bet = 0;
        player_bet = 0;
        play_button.disabled = true;
        displayBankroll();
        bet_buttons.forEach(element => {
        if(bankroll - parseInt(element.value, 10) < 0){
            element.style.display = "flex";
        }
        });
        return;
    }
    total_bet += val;
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

async function dealerRound()
{
    play_buttons.forEach(element => {
        element.disabled = true;
    });
    dealer_hand_displayed.innerHTML = "<img src='assets/img/cards/" + dealer_hand[0][0] + dealer_hand[0][1] + ".png' class='cards'>";
    displayDealerCards();
    if(player_score < 21){
        while(dealer_score < 17){
            await sleep(500);
            dealCardTo(dealer_hand);
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
    player_bet = 0;
    player_score = 0;
    dealer_score = 0;
    total_bet = 0;
    double_button.disabled = false;
    split_button.disabled = false;
    play_button.disabled = true;
    win_insurance = false;
    has_splited = false;
    player_hand = [];
    dealer_hand = [];
    win_state = -1;
    game_state = "first_round";
    displayPlayerBet();
    displaySplitPlayerBet();
    displayBankroll();
    setActiveHand("player");
    if(deck.length <= 20){ //? Si il reste peu de cartes pour un tour, on rattache la défausse à la fin de deck et on mélange le tout
        deck.push(discard);
        discard = [];
        shuffle(deck);
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
    play_buttons.forEach(element => {
        element.disabled = false;
    });
    player_score = scoreCalculation(player_hand);
    dealer_score = scoreCalculation(dealer_hand);
    if(cards_value[player_hand[0][0]] != cards_value[player_hand[1][0]]){
        split_button.disabled = true;
    }
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
        bankroll += insurance_bet + insurance_bet * 2;
        displayBankroll();
        result_displayed.innerHTML = "Insurance :<br>+" + insurance_bet * 2 + " €";
    }
    else{
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
        game_state = "";
        dealCardTo(split_player_hand);
        split_player_score = scoreCalculation(split_player_hand);
        displaySplitPlayerCards();
        if(split_player_score >= 21){
            is_spliting = false;
            game_state = "first_round";
            double_button.disabled = false;
            setActiveHand("player");
            return;
        }
    }
    else if(act == "double"){
        bankroll -= split_player_bet;
        total_bet += split_player_bet;
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
    if(game_state != "first_round"){
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
        game_state = "";
        dealCardTo(player_hand);
        player_score = scoreCalculation(player_hand);
        displayPlayerCards();
        if(player_score >= 21){
            dealerRound();
        }
    }
    else if(act == "split"){
        is_spliting = true;
        has_splited = true;
        total_bet += player_bet;
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
        game_state = "";
        total_bet += player_bet;
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
    }
    else if(act == "dont_insure"){
        displayInsurance();
        if(dealer_score == 21){
            dealerRound();
        }
    }
    if(game_state != "first_round"){
        double_button.disabled = true;
        split_button.disabled = true;
    }
}

function splitCheckWin()
{
    if(split_player_hand.length == 2 && split_player_score == 21){
        if(dealer_score == 21){
            return "push";
        }
    }
    else if(game_state == "first_round" && dealer_score == 21 && split_player_score < 21){
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
    else if(game_state == "first_round" && dealer_score == 21 && player_score < 21){
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
        result_displayed_wrapper.style.display = "flex";
        result_displayed.innerHTML = "<u>Split</u><br>Lose !<br>-" + split_player_bet + " €";
        await sleep(2000);
        result_displayed_wrapper.style.display = "none";
        await sleep(500);
        displayBankroll();
    }
    else if(win_state == "bust"){
        result_displayed_wrapper.style.display = "flex";
        result_displayed.innerHTML = "<u>Split</u><br>Bust !<br>-" + split_player_bet + " €";
        await sleep(2000);
        result_displayed_wrapper.style.display = "none";
        await sleep(500);
        displayBankroll();
    }
    else if(win_state == "win"){
        result_displayed_wrapper.style.display = "flex";
        result_displayed.innerHTML = "<u>Split</u><br>Win !<br>+" + split_player_bet + " €";
        await sleep(2000);
        result_displayed_wrapper.style.display = "none";
        bankroll += split_player_bet + split_player_bet;
        await sleep(500);
        displayBankroll();
    }
    else if(win_state == "push"){
        result_displayed_wrapper.style.display = "flex";
        result_displayed.innerText = "<u>Split</u><br>Push !";
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
        result_displayed_wrapper.style.display = "flex";
        result_displayed.innerHTML = "Lose !<br>-" + player_bet + " €";
        await sleep(2000);
        result_displayed_wrapper.style.display = "none";
        await sleep(500);
        displayBankroll();
    }
    else if(win_state == "bust"){
        result_displayed_wrapper.style.display = "flex";
        result_displayed.innerHTML = "Bust !<br>-" + player_bet + " €";
        await sleep(2000);
        result_displayed_wrapper.style.display = "none";
        await sleep(500);
        displayBankroll();
    }
    else if(win_state == "blackjack"){
        result_displayed_wrapper.style.display = "flex";
        result_displayed.innerHTML = "BlackJack !<br>+" + player_bet * 1.5 + " €";
        await sleep(2000);
        result_displayed_wrapper.style.display = "none";
        bankroll += player_bet + player_bet * 1.5;
        await sleep(500);
        displayBankroll();
    }
    else if(win_state == "win"){
        result_displayed_wrapper.style.display = "flex";
        result_displayed.innerHTML = "Win !<br>+" + player_bet + " €";
        await sleep(2000);
        result_displayed_wrapper.style.display = "none";
        bankroll += player_bet + player_bet;
        await sleep(500);
        displayBankroll();
    }
    else if(win_state == "push"){
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

function gameTime()
{
    setTimeout(() => {
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
        gameTime();
    }, 1000);
}

function startGame() 
{
    deck = [];
    dealer_hand = [];
    dealer_score = 0;
    player_hand = [];
    split_player_hand = [];
    player_score = 0;
    player_bet = 0;
    total_bet = 0;
    split_player_bet = 0;
    insurance_bet = 0;
    win_insurance = false;
    bankroll = 2000;
    discard = [];
    game_state = "";
    win_state = -1;
    game_time = {"h" : 0, "m" : 0, "s" : 0};
    displayBankroll();
    bet_buttons.forEach(element => {
        element.disabled = false;
    });
    start_button.innerHTML = "Restart a game";
    displaySettings();
    deck = createDeck(nb_decks_slider.value);
    shuffle(deck);
    gameTime();
    newRound();
}