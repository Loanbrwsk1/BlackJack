<!--
@author : Loan BOROWSKI
@update : 27/04/26

Main page
-->

<? session_start() ?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="/assets/img//icons/logo.png">
    <link rel="stylesheet" href="/assets/css/style-blackjack.css">
    <title>BlackJack</title>
</head>

<body>
    <div id="game-time-container">
        <div id="game-time">
            0h 0m 0s
        </div>
    </div>

    <div id="settings-container">
        <button id="settings-button" onclick="displaySettings()"><img src="assets/img/icons/settings.png" alt="settings-icon" id="settings-icon"></button>
    </div>

    <div id="settings-page">
        <div id="user-account">
            <a href="account"><img src="assets/img/icons/user.png" alt="user-icon" id="user-icon"></a><?= $_SESSION["username"] ?>
        </div>
        <?php 
        if($_SESSION['admin_access'] == "true"){
            echo "<div id='user-account'>
            <a href='adminpanel'><img src='assets/img/icons/admin.png' alt='admin-icon' id='user-icon'></a>Admin Panel
        </div>";
        } ?>
        
        <p>Number of packs of cards</p>
        <input type="range" value="6" min="1" max="12" id="nb-decks-selector">
        <p id="nb-decks">6</p>
        <div id="buttons-container">
            <button id="start-button" onclick="startGame()">Start a game</button>
        </div>
    </div>

    <div id="game-rules-container">
        <div id="game-rules">
            <u>Rules</u> :<br>
            <p>Dealer must stand on soft 17</p>
            <p class="rules-style">BlackJack pays <span>3 to 2</span></p>
            <p class="rules-style">Insurance pays <span>2 to 1</span></p>
            <u>Match The Dealer</u> :<br>
            <p class="rules-style">1 non-suited match pays <span>4 to 1</span></p>
            <p class="rules-style">2 non-suited match pays <span>8 to 1</span></p>
            <p class="rules-style">1 suited match pays <span>10 to 1</span></p>
            <p class="rules-style">1 non-suited & 1 suited match pays <span>14 to 1</span></p>
            <p class="rules-style">2 suited match pays <span>20 to 1</span></p>
        </div>
    </div>

    <div id="bankroll-container">
        <p id="bankroll">Bankroll : <?= $_SESSION["bankroll"] ?> €</p>
    </div>

    <div id="dealer-wrapper">
        <div id="dealer-container">
            <p>Dealer</p>
            <br>
            <div class="cards-container" id="dealer-hand">
            </div>
            <br>
            <p class="score" id="dealer-score"></p>
        </div>
    </div>

    <div id="player-wrapper">
        <div id="player-container">
            <br>
            <div id="player-hand-container">
                <p class="you">You</p>
                <br>
                <div class="cards-container" id="player-hand">
                </div>
                <br>
                <p class="score" id="player-score"></p>
                <p class="hand-bet" id="player-hand-bet">0</p>
            </div>
            <div id="split-player-hand-container">
                <p class="you">Split</p>
                <br>
                <div class="cards-container" id="split-player-hand">
                </div>
                <br>
                <p class="score" id="split-player-score"></p>
                <p class="hand-bet" id="split-player-hand-bet"></p>
            </div>
        </div>
    </div>

    <div id="actions-wrapper">
        <div id="actions-container">
            <button class="action-button bet-button coins" id="ten" value="10" onclick="bet(10)" disabled>
                <img src="assets/img/coins/10.png" alt="10" class="bet-images" id="ten-coin">
            </button>
            <button class="action-button bet-button coins" id="fifty" value="50" onclick="bet(50)" disabled>
                <img src="assets/img/coins/50.png" alt="50" class="bet-images" id="fifty-coin">
            </button>
            <button class="action-button bet-button coins" id="hundred" value="100" onclick="bet(100)" disabled>
                <img src="assets/img/coins/100.png" alt="100" class="bet-images" id="hundred-coin">
            </button>
            <button class="action-button bet-button coins" id="five-hundred" value="500" onclick="bet(500)" disabled>
                <img src="assets/img/coins/500.png" alt="500" class="bet-images" id="five-hundred-coin">
            </button>
            <button class="action-button bet-button coins" id="thousand" value="1000" onclick="bet(1000)" disabled>
                <img src="assets/img/coins/1000.png" alt="1000" class="bet-images" id="thousand-coin">
            </button>
            <button class="action-button bet-button" id="clear-bet" onclick="bet(-1)" disabled>
                <img src="assets/img/icons/clear-bet.png" alt="clear-bet-button" class="bet-images">
            </button>
            <button class="action-button bet-button" id="play" onclick="start()" disabled>
                <img src="assets/img/icons/play-button.png" alt="play-button" class="bet-images">
            </button>
            <button class="action-button play-button" id="stand" onclick="action('stand')">Stand</button>
            <button class="action-button play-button" id="split" onclick="action('split')">Split</button>
            <button class="action-button play-button" id="double" onclick="action('double')">Double</button>
            <button class="action-button play-button" id="hit" onclick="action('hit')">Hit</button>
        </div>
    </div>

    <div id="insurance-wrapper">
        <div id="insurance-container">
            <p>Do you want to insure ?</p><br>
            <button id="insure" onclick="action('insure')">Yes</button>
            <button id="dont-insure" onclick="action('dont_insure')">No</button>
        </div>
    </div>

    <div id="result-wrapper">
        <div id="result-container">
            <p id="result"></p>
        </div>
    </div>

    <div id="mtd-button-wrapper">
        <div id="mtd-button-container">
            <button id="mtd-button" onclick="displayMTD()" disabled>Match The Dealer</button>
        </div>
    </div>

    <div id="mtd-wrapper">
        <div id="mtd-container">
            <p id="mtd-bet-display">Bet :</p>
            <div id="mtd-coins">
                <button class="action-button bet-button-mtd coins" id="ten" value="10" onclick="betMTD(10)">
                    <img src="assets/img/coins/10.png" alt="10" class="bet-images" id="ten-coin">
                </button>
                <button class="action-button bet-button-mtd coins" id="fifty" value="50" onclick="betMTD(50)">
                    <img src="assets/img/coins/50.png" alt="50" class="bet-images" id="fifty-coin">
                </button>
                <button class="action-button bet-button-mtd coins" id="hundred" value="100" onclick="betMTD(100)">
                    <img src="assets/img/coins/100.png" alt="100" class="bet-images" id="hundred-coin">
                </button>
                <button class="action-button bet-button-mtd coins" id="five-hundred" value="500" onclick="betMTD(500)">
                    <img src="assets/img/coins/500.png" alt="500" class="bet-images" id="five-hundred-coin">
                </button>
                <button class="action-button bet-button-mtd coins" id="thousand" value="1000" onclick="betMTD(1000)">
                    <img src="assets/img/coins/1000.png" alt="1000" class="bet-images" id="thousand-coin">
                </button>
                <button class="action-button bet-button-mtd" id="clear-bet-mtd" onclick="betMTD(-1)">
                    <img src="assets/img/icons/clear-bet.png" alt="clear-bet-mtd-button" class="bet-images">
                </button>
            </div>
        </div>
    </div>

    <div id="hi-lo-wrapper">
        <div id="hi-lo-container">
            <p id="hi-lo-counter">True Count : 0</p>
        </div>
    </div>

    <script src="/assets/js/script-blackjack.js"></script>
</body>

</html>