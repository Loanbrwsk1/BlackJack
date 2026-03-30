const settings_page = document.getElementById("settings-page");
const nb_decks = document.getElementById("nb-decks");
const nb_decks_slider = document.getElementById("nb-decks-selector");
const dealer_deck_displayed = document.getElementById("dealer-deck");
let dealer_score_displayed = document.getElementById("dealer-score");
const player_deck_displayed = document.getElementById("player-deck");
let player_score_displayed = document.getElementById("player-score");
const bet_buttons = document.querySelectorAll(".bet-button");
const play_buttons = document.querySelectorAll(".play-button");
const start_button = document.getElementById("start");
const split_button = document.getElementById("split");
const double_button = document.getElementById("double");
const game_time_displayed = document.getElementById("game-time");
const result_displayed = document.getElementById("result");
const result_displayed_wrapper = document.getElementById("result-wrapper");
const bankroll_displayed = document.getElementById("bankroll");
const insurance_wrapper = document.getElementById("insurance-wrapper");
const score_displayed = document.querySelectorAll(".score"); //? Juste pour cacher le background tant qu'il n'y a pas de contenu

const signs = ["S", "H", "D", "C"];
const default_deck = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
const cards_value = {"2" : 2, "3" : 3, "4" : 4, "5" : 5, "6" : 6, "7" : 7, "8" : 8, "9" : 9, "10" : 10, "J" : 10, "Q" : 10, "K" : 10, "A" : 11};
let deck = [];
let dealer_deck = [];
let dealer_score = 0;
let player_deck = [];
let split_split_deck = [];
let player_score = 0;
let player_bet = 0;
let insurance_bet = 0;
let is_insuring = false;
let win_insurance = false;
let bankroll = 5000;
let discard = [];
let game_state = "";
let win_state = -1;
let game_time = {"h" : 0, "m" : 0, "s" : 0};


nb_decks_slider.addEventListener('input', function() {
    nb_decks.innerText = this.value;
});

function displaySettings() 
{
    settings_page.style.display = settings_page.style.display == "none" ? "flex" : "none";
}

function displayInsurance()
{
    insurance_wrapper.style.display = insurance_wrapper.style.display == "none" ? "flex" : "none";
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
    return deck;
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

function dealCardTo(player)
{
    player == "player" ? player_deck.push(deck[0]) : dealer_deck.push(deck[0]);
    discard.push(deck[0]);
    deck = deck.slice(1);
}

function displayPlayerCards()
{
    player_deck_displayed.innerHTML = "";
    let i;
    for(i = 0 ; i < player_deck.length ; i++){
        player_deck_displayed.innerHTML += "<img src='assets/img/cards/" + player_deck[i][0] +  player_deck[i][1]  + ".png' class='cards'>";
    }
    player_score_displayed.innerHTML = player_score;
}

function displayDealerCards(nb = 0)
{
    dealer_deck_displayed.innerHTML = "";
    if(nb != 1){
        let i;
        for(i = 0 ; i < dealer_deck.length ; i++){
            dealer_deck_displayed.innerHTML += "<img src='assets/img/cards/" + dealer_deck[i][0] +  dealer_deck[i][1]  + ".png' class='cards'>";
        }
        dealer_score_displayed.innerHTML = dealer_score;
    }
    else{
        dealer_deck_displayed.innerHTML += "<img src='assets/img/cards/" + dealer_deck[0][0] + dealer_deck[0][1] + ".png' class='cards'>";
        dealer_deck_displayed.innerHTML += "<img src='assets/img/cards/hide.png' class='cards'>";
        dealer_score_displayed.innerHTML = scoreCalculation(dealer_deck.slice(0, 1));
    }
}

function bet(val)
{
    if(val == -1){
        bankroll += player_bet;
        player_bet = 0;
        start_button.disabled = true;
        bankroll_displayed.innerHTML = "Bankroll : " + bankroll + " €<br>Bet : " + player_bet + " €";
        bet_buttons.forEach(element => {
        if(bankroll - parseInt(element.value, 10) < 0){
            element.style.display = "flex";
        }
        });
        return;
    }
    player_bet += val;
    bankroll -= val;
    bankroll_displayed.innerHTML = "Bankroll : " + bankroll + " €<br>Bet : " + player_bet + " €";
    start_button.disabled = false;
    bet_buttons.forEach(element => {
        if(bankroll - parseInt(element.value, 10) < 0){
            element.style.display = "none";
        }
    });
}

function checkWin()
{
    if(player_deck.length == 2 && player_score == 21){
        if(dealer_score == 21){
            return "push";
        }
        return "blackjack";
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

function dealerRound()
{
    play_buttons.forEach(element => {
        element.disabled = true;
    });
    displayDealerCards();
    if(player_score <= 21){
        while(dealer_score < 17){
            dealCardTo("dealer");
            dealer_score = scoreCalculation(dealer_deck);
            displayDealerCards();
        }
    }
    win_state = checkWin();
    result();
}

function newRound()
{
    player_deck_displayed.innerHTML = "";
    player_score_displayed.innerHTML = "";
    dealer_deck_displayed.innerHTML = "";
    dealer_score_displayed.innerHTML = "";
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
    score_displayed.forEach(element => {
        element.style.display = "none";
    });
    player_bet = 0;
    player_score = 0;
    dealer_score = 0;
    double_button.disabled = false;
    split_button.disabled = false;
    start_button.disabled = true;
    player_deck = [];
    dealer_deck = [];
    win_state = -1;
    game_state = "first_round";
    if(deck.length <= 20){ //? Si il reste peu de cartes pour un tour, on rattache la défausse à la fin de deck et on mélange le tout
        deck.push(discard);
        discard = [];
        deck = shuffle(deck);
    }
}

function start()
{
    bet_buttons.forEach(element => {
        element.style.display = "none";
    });
    play_buttons.forEach(element => {
        element.style.display = "block";
    });
    score_displayed.forEach(element => {
        element.style.display = "block";
    });
    dealCardTo("player");
    dealCardTo("dealer");
    dealCardTo("player");
    dealCardTo("dealer");
    player_score = scoreCalculation(player_deck);
    dealer_score = scoreCalculation(dealer_deck);
    displayPlayerCards();
    displayDealerCards(1);
    if(cards_value[player_deck[0][0]] != cards_value[player_deck[1][0]]){
        split_button.disabled = true;
    }
    if(dealer_deck[0][0] == "A"){
        displayInsurance();
        return;
    }
    if(player_score == 21 || dealer_score == 21){
        displayDealerCards();
        win_state = checkWin();
        result();
    }
}

function action(act)
{
    game_state = "";
    if(act == "stand"){
        bankroll_displayed.innerHTML = "Bankroll : " + bankroll + " €<br>Bet : " + player_bet + " €";
        dealerRound();
        win_state = checkWin();
    }
    else if(act == "hit" && player_score <= 20){
        dealCardTo("player");
        player_score = scoreCalculation(player_deck);
        displayPlayerCards();
        if(player_score >= 21){
            dealerRound();
            win_state = checkWin();
        }
    }
    else if(act == "double"){
        bankroll -= player_bet;
        player_bet *= 2;
        console.log(player_bet);
        bankroll_displayed.innerHTML = "Bankroll : " + bankroll + " €<br>Bet : " + player_bet + " €";
        dealCardTo("player");
        player_score = scoreCalculation(player_deck);
        displayPlayerCards();
        dealerRound();
        win_state = checkWin();
    }
    else if(act == "split"){
        pass;
    }
    else if(act == "insure"){
        displayInsurance();
        game_state = "first_round";
        is_insuring = true;
        insurance_bet = player_bet / 2;
        bankroll -= insurance_bet;
        bankroll_displayed.innerHTML = "Bankroll : " + bankroll + " €<br>Bet : " + player_bet + " €";
        if(dealer_score == 21){
            win_insurance = true;
            win_state = checkWin();
        }
    }
    else if(act == "dont_insure"){
        displayInsurance();
        game_state = "first_round";
        if(dealer_score == 21){
            displayDealerCards();
            win_state = checkWin();
        }
    }
    if(game_state != "first_round"){
        double_button.disabled = true;
    }
    result();
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

//? Début aide par IA pour les fonctions, mais contenu fait manuellement
function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function result(){
    if(is_insuring){
        result_displayed_wrapper.style.display = "flex";
        if(win_insurance){
            bankroll += insurance_bet + insurance_bet * 2;
            bankroll_displayed.innerHTML = "Bankroll : " + bankroll + " €<br>Bet : " + player_bet + " €";
            result_displayed.innerHTML = "Insurance :<br>+" + insurance_bet * 2 + " €";
        }
        else{
            result_displayed.innerHTML = "Insurance :<br>-" + insurance_bet + " €";
        }
        await sleep(2000);
        result_displayed_wrapper.style.display = "none";
        is_insuring = false;
        win_insurance = false;
    }
    await sleep(1000);
    if(win_state == "lose"){
        displayDealerCards();
        result_displayed_wrapper.style.display = "flex";
        result_displayed.innerHTML = "Lose !<br>-" + player_bet + " €";
        await sleep(2000);
        result_displayed_wrapper.style.display = "none";
        bankroll_displayed.innerHTML = "Bankroll : " + bankroll + " €<br>Bet : " + player_bet + " €";
        newRound();
    }
    else if(win_state == "bust"){
        displayDealerCards();
        result_displayed_wrapper.style.display = "flex";
        result_displayed.innerHTML = "Bust !<br>-" + player_bet + " €";
        await sleep(2000);
        result_displayed_wrapper.style.display = "none";
        bankroll_displayed.innerHTML = "Bankroll : " + bankroll + " €<br>Bet : " + player_bet + " €";
        newRound();
    }
    else if(win_state == "blackjack"){
        displayDealerCards();
        result_displayed_wrapper.style.display = "flex";
        result_displayed.innerHTML = "BlackJack !<br>+" + player_bet * 1.5 + " €";
        await sleep(2000);
        result_displayed_wrapper.style.display = "none";
        bankroll += player_bet + player_bet * 1.5;
        bankroll_displayed.innerHTML = "Bankroll : " + bankroll + " €<br>Bet : " + player_bet + " €";
        newRound();
    }
    else if(win_state == "win"){
        displayDealerCards();
        result_displayed_wrapper.style.display = "flex";
        result_displayed.innerHTML = "Win !<br>+" + player_bet + " €";
        await sleep(2000);
        result_displayed_wrapper.style.display = "none";
        bankroll += player_bet + player_bet;
        bankroll_displayed.innerHTML = "Bankroll : " + bankroll + " €<br>Bet : " + player_bet + " €";
        newRound();
    }
    else if(win_state == "push"){
        displayDealerCards();
        result_displayed_wrapper.style.display = "flex";
        result_displayed.innerText = "Push !";
        await sleep(2000);
        bankroll += player_bet;
        bankroll_displayed.innerHTML = "Bankroll : " + bankroll + " €<br>Bet : " + player_bet + " €";
        result_displayed_wrapper.style.display = "none";
        newRound();
    }
    if(bankroll <= 0){
        result_displayed_wrapper.style.display = "flex";
        result_displayed.innerText = "No more money !";
        await sleep(2000);
        result_displayed_wrapper.style.display = "none";
        displaySettings();
    }
}
//? Fin aide par IA

function startGame() 
{
    insurance_wrapper.style.display = "none";
    deck = createDeck(nb_decks_slider.value);
    deck = shuffle(deck);
    gameTime();
    newRound();
}