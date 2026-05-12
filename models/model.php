<!--
@author : Loan BOROWSKI
@update : 8/05/26

Functions related to the DB
-->
<?php

require "db-config.php";

function Connect()
{
    //? Gets username and password entered by the user
    //? Gets infos from DB from the user
    //? If all is good (username and password match) create session variables and return 1 for OK
    //? If there is an error, the error is reported to the session variable error and return 0 for not OK
    global $DB;
    $username = htmlspecialchars($_POST['username']);
    $password = htmlspecialchars($_POST['password']);
    $stay_connected = htmlspecialchars($_POST['stay-connected']);

    $SQL = 'SELECT username, password, bankroll, admin_access FROM users WHERE username = ?';
    $result = $DB->prepare($SQL);
    $result->bindValue(1, $username, PDO::PARAM_STR);
    $result->execute();
    $datas = $result->fetch();

    $username_db = htmlspecialchars($datas['username']);
    $password_db = htmlspecialchars($datas['password']);
    $bankroll = htmlspecialchars($datas['bankroll']);
    $admin_access = htmlspecialchars($datas['admin_access']);
    $result->closeCursor();

    if($username == $username_db && password_verify($password, $password_db)){
        $_SESSION['username'] = $username_db;
        $_SESSION['bankroll'] = $bankroll;
        $_SESSION['admin_access'] = $admin_access;
        UpdateToken();
        if($stay_connected != "on"){
            setcookie("token", "", time() - 3600);
            unset($_COOKIE["token"]);
        }
        return 1;
    }
    else if($username != $username_db){
        $_SESSION['error'] = 'username incorrect !';
        return 0;
    }
    else if(!password_verify($password, $password_db)){
        $_SESSION['error'] = 'Mot de passe incorrect !';
        return 0;
    }
}

function Create()
{
    //? Gets username and passwords entered by the user
    //? Gets infos from DB from the user
    //? If all is good (username not already used) create session variables and return 1 for OK
    //? If there is an error, the error is reported to the session variable error and return 0 for not OK
    global $DB;
    $username = htmlspecialchars($_POST['username']);
    $password = htmlspecialchars($_POST['password']);
    $confirm_password = htmlspecialchars($_POST['confirm-password']);
    $stay_connected = htmlspecialchars($_POST["stay-connected"]);

    $SQL = 'SELECT username FROM users WHERE username = ?';
    $result = $DB->prepare($SQL);
    $result->bindValue(1, $username);
    $result->execute();
    $datas = $result->fetch();
    
    $username_db = htmlspecialchars($datas['username']);
    $result->closeCursor();
    
    if(empty($username_db) && $password == $confirm_password){
        $SQL = 'INSERT INTO users(username, password, bankroll, admin_access, token) VALUES (?, ?, 2000, "false", "")';
        $result = $DB->prepare($SQL);
        $result->bindValue(1, $username);
        $result->bindValue(2, password_hash($password, PASSWORD_BCRYPT));
        $result->execute();
        $result->CloseCursor();
        
        $_SESSION['username'] = $username;
        $_SESSION['bankroll'] = 2000;
        $_SESSION['admin_access'] = "false";

        UpdateToken();
        if($stay_connected != "on"){
            setcookie("token", "", time() - 3600);
            unset($_COOKIE["token"]);
        }
        return 1;
    }
    else if(!empty($username_db)){
        $_SESSION['error'] = "username déjà utilisé !";
        return 0;
    }
    else if($password != $confirm_password){
        $_SESSION['error'] = "Les mots de passe ne correspondent pas !";
        return 0;
    }
}

function UpdateBankrollDB()
{
    //? Gets current bankroll value and update DB with the username of the session
    global $DB;
    $bankroll = htmlspecialchars($_POST["bankroll"]);

    $SQL = 'UPDATE users SET bankroll = ? WHERE username = ?';
    $result = $DB->prepare($SQL);
    $result->bindValue(1, $bankroll);
    $result->bindValue(2, htmlspecialchars($_SESSION["username"]));
    $result->execute();
    $result->closeCursor();
    $_SESSION["bankroll"] = $bankroll;
}

function UpdatePasswd()
{
    //? Gets passwords entered by the user
    //? Gets user's password from DB
    //? If passwords match update password into the DB else update session variable error
    global $DB;
    $actual_pwd = htmlspecialchars($_POST['current-passwd']);
    $password = htmlspecialchars($_POST['new-passwd']);
    $confirm_password = htmlspecialchars($_POST['confirm-passwd']);

    $SQL = 'SELECT password FROM users WHERE username = ?';
    $result = $DB->prepare($SQL);
    $result->bindValue(1, $_SESSION['username']);
    $result->execute();
    $datas = $result->fetch();
    $actual_pwd_db = htmlspecialchars($datas['password']);
    $result->closeCursor();

    if(password_verify($actual_pwd, $actual_pwd_db) && $password == $confirm_password){
        $SQL = 'UPDATE users SET password = ? WHERE username = ?';
        $result = $DB->prepare($SQL);
        $result->bindValue(1, password_hash($password, PASSWORD_BCRYPT));
        $result->bindValue(2, $_SESSION['username']);
        $result->execute();
        $_SESSION['error'] = "Mot de passe changé avec succès !";
    }
    else if(!password_verify($actual_pwd, $actual_pwd_db)){
        $_SESSION['error'] = "Le mot de passe actuel n'est pas vérifié !";
    }
    else if($password != $confirm_password){
        $_SESSION['error'] = "Les mots de passe ne correspondent pas !";
    }
}

function Delete($user)
{
    //? Delete the user placed in parameter of the DB
    global $DB;

    $SQL = 'DELETE FROM users WHERE username = ?';
    $result = $DB->prepare($SQL);
    $result->bindValue(1, $user);
    $result->execute();
    $result->closeCursor();
}

function GetUsers()
{
    //? Get users for the admin panel
    global $DB;

    $SQL = 'SELECT username, bankroll, admin_access FROM users';
    $result = $DB->prepare($SQL);
    $result->execute();
    $datas = $result->fetchAll();
    $_SESSION["users_db"] = $datas;
    $result->closeCursor();
}

function UpdateAdminDB($username, $admin_access)
{
    //? Update the user's admin access
    global $DB;

    $SQL = 'UPDATE users SET admin_access = ? WHERE username = ?';
    $result = $DB->prepare($SQL);
    $result->bindValue(1, $admin_access);
    $result->bindValue(2, $username);
    $result->execute();
    $result->closeCursor();
}

function UpdateToken()
{
    //? Generate a new token and put it in th DB
    global $DB;
    $_SESSION["token"] = bin2hex(random_bytes(32));

    $SQL = 'UPDATE users SET token = ? WHERE username = ?';
    $result = $DB->prepare($SQL);
    $result->bindValue(1, htmlspecialchars($_SESSION["token"]));
    $result->bindValue(2, htmlspecialchars($_SESSION["username"]));
    $result->execute();
    $result->closeCursor();
    $expire = time() + 365 * 24 * 60 * 60;
    $options = [
        'expires'  => $expire,
        'path'     => '/',
        'secure'   => false
    ];
    setcookie("token", $_SESSION["token"], $options);
}

function GetAutoLogin()
{
    //? Auto log when the cookie is set, update the token and change it in the session and returns 1
    //? If and admin deleted the account, the username will be empty and so returns 0
    global $DB;

    $SQL = 'SELECT username, bankroll, admin_access FROM users WHERE token = ?';
    $result = $DB->prepare($SQL);
    $result->bindValue(1, htmlspecialchars($_COOKIE["token"]));
    $result->execute();
    $datas = $result->fetch();
    
    $_SESSION["username"] = htmlspecialchars($datas["username"]);
    $_SESSION["bankroll"] = htmlspecialchars($datas["bankroll"]);
    $_SESSION["admin_access"] = htmlspecialchars($datas["admin_access"]);
    $result->closeCursor();

    if(empty($_SESSION["username"])){
        return 0;
    }

    UpdateToken();
    return 1;
}