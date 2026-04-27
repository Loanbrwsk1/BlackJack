<!--
@author : Loan BOROWSKI
@update : 27/04/26

Login page
-->

<?php session_start() ?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="/assets/img/icons/logo.png">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="/assets/css/style.css">
    <title>BlackJack - Login</title>
</head>

<body>

    <div class="login-wrapper">

        <div class="login-header">
            <div class="logo-diamond">&#9830;</div>
            <h1 class="logo-title">Blackjack</h1>
            <p class="logo-sub">Members Club</p>
            <div class="divider"></div>
        </div>

        <form action="index.php?action=login" method="post" class="login-form">

            <div class="field-group">
                <label>Username</label>
                <div class="input-wrapper">
                    <input type="text" name="username" placeholder="Username" spellcheck="false" required>
                    <span class="input-border"></span>
                </div>
            </div>

            <br>

            <div class="field-group">
                <label>Password</label>
                <div class="input-wrapper">
                    <input type="password" id="password" name="password" placeholder="Password" required>
                    <button type="button" class="toggle-password" onclick="showPassword()">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                    <span class="input-border"></span>
                </div>
            </div>
            
            <div class="stay-connected-container">
                <label><input type="checkbox" name="stay-connected">Stay connected</label>
            </div>
            
            <button type="submit" class="submit-btn">
                <span class="btn-text">Sign In</span>
            </button>

        </form>

        <div class="login-footer">
            <div class="divider"></div>
            <p>No account? <a href="index.php?page=create">Create an account</a></p>
        </div>

    </div>

    <?php
    if (!empty($_SESSION['error'])) {
        echo "<script>
        window.onload = function() {
            alert('" . $_SESSION['error'] . "');
        } </script>";
        unset($_SESSION['error']);
    }
    ?>
    <script src="/assets/js/script.js"></script>
</body>

</html>