<!--
@author : Loan BOROWSKI
@update : 27/04/26

Account page
-->

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="/assets/img/icons/logo.png">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="/assets/css/style.css">
    <title>BlackJack - Account</title>
</head>

<body>

    <a href="home"><button>&#8592; Back to game</button></a>

    <div class="account-wrapper">



        <form action="index.php?action=update-password" method="post" class="login-form">

            <div class="field-group">
                <label>Curent Password</label>
                <div class="input-wrapper">
                    <input type="password" id="current-passwd-input" name="curent-passwd" placeholder="Current Password" required>
                    <button type="button" class="toggle-password" onclick="showCurrentPassword()">
                        <i class="fa-solid fa-eye"></i>
                    </button>
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

            <br>

            <div class="field-group">
                <label>Confirm Password</label>
                <div class="input-wrapper">
                    <input type="password" id="confirm-password" name="confirm-password" placeholder="Confirm Password" required>
                    <button type="button" class="toggle-password" onclick="showConfirmPassword()">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                    <span class="input-border"></span>
                </div>
            </div>

            <br>

            <button type="submit" class="submit-btn">
                <span class="btn-text">Change Your Password</span>
            </button>
        </form>

        <div id="confirm-delete">
            <div id="confirm-delete-box">
                <p>Are you sure you want to delete your account?</p>
                <p>All data will be permanently removed.</p>
                <div id="confirm-delete-actions">
                    <button onclick="DisplayDelete()">No, keep it</button>
                    <a href="index.php?action=delete-account"><button>Yes, delete</button></a>
                </div>
            </div>
        </div>

        <div id="logout">
            <a href="index.php?action=logout"><button id="logout-btn">Logout</button></a>
        </div>

        <?php
        if ($_SESSION["username"] != "admin") {
            echo "<div id='delete-account'>
            <p class='account-section-title'>Danger Zone</p>
            <button id='delete-account-btn' onclick='DisplayDelete()'>Delete Account</button>
        </div>";
        }
        ?>
    </div>

    <?php
    if (!empty($_SESSION['error'])) {
        echo "<script>
        window.onload = function() {
            alert('" . addslashes($_SESSION['error']) . "');
        } </script>";
        unset($_SESSION['error']);
    }
    ?>
    <script src="assets/js/script.js"></script>
</body>

</html>