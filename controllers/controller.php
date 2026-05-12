<!--
@author : Loan BOROWSKI
@update : 27/04/26

Call DB when needed and display views
-->
<?php

function Display404()
{
    //? Display 404 page
    require "views/404.php";
}

function DisplayLoginPage()
{
    //? Display login page
    require "views/login.php";
}

function DisplayAccount()
{
    //? Display account page
    require "views/account.php";
}

function DisplayAdminPanel()
{
    //? Display admin panel page after fetch the DB to have all the users
    require_once "models/model.php";
    GetUsers();
    require "views/admin-panel.php";
}

function CheckConnect()
{
    //? Check if user exists then display home if user exists or else return to login
    require "models/model.php";
    if(Connect()){
        header("Location: home");
        exit();
    }
    else{
        header("Location: login");
        exit();
    }
}

function DisplayHome()
{
    //? Display home page
    require "views/home.php";
}

function DisplayCreate()
{
    //? Display create account
    require "views/create-account.php";
}

function CheckCreate()
{
    //? If creating the account works, go home else return to create
    require_once "models/model.php";
    if(Create()){
        header("location: home");
        exit();
    }
    else{
        header("Location: create");
        exit();
    }
}

function UpdateBankroll()
{
    //? Update bankroll via DB
    require_once "models/model.php";
    UpdateBankrollDB();
}

function ChangePassword()
{
    //? Update password via DB and return to account page
    require_once "models/model.php";
    UpdatePasswd();
    header("Location: account");
    exit();
}

function DeleteAccount()
{
    //? Delete current account and go to login page
    require_once "models/model.php";
    unset($_SESSION["username"]);
    Delete(htmlspecialchars($_SESSION["username"]));
    setcookie("token", "", time() - 3600);
    unset($_COOKIE["token"]);
    header("Location: login");
    exit();
}

function DeleteAccountByAdmin($username)
{
    //? For admin panel, delete account by the username and return to admin panel
    require_once "models/model.php";
    Delete($username);
    header("Location: adminpanel");
    exit();
}

function UpdateAdmin($username, $admin_access)
{
    //? For admin panel, update if a user has admin access or not and then return to admin panel
    require_once "models/model.php";
    UpdateAdminDB($username, $admin_access);
    header("Location: adminpanel");
    exit();
}

function LogOut()
{
    //? Logout of the session by destroying the session, remove cookie and go to login page
    unset($_SESSION['username']);
    session_destroy();
    setcookie("token", "", time() - 3600);
    unset($_COOKIE["token"]);
    header("location: /login");
    exit();
}

function AutoLogin()
{
    //? Get the credentials and datas of the account and go to home
    //? If the account was deleted by an admin, the account is loged out
    require_once "models/model.php";
    if(GetAutoLogin()){
        header("Location: /home");
        exit();
    }
    else{
        LogOut();
    }
}