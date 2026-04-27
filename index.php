<!--
@author : Loan BOROWSKI
@update : 27/04/26

Redirects the input URLs to the corresponding functions from the controller
-->

<?php
session_start();

require "controllers/controller.php";

if(isset($_GET["page"]) && !empty($_GET["page"])){
    $page = htmlspecialchars($_GET["page"]);
}
else{
    $page = "login";
}

if(isset($_GET["action"]) && !empty($_GET["action"])){
    $action = htmlspecialchars($_GET["action"]);
    if($action == "login"){
        CheckConnect();
    }
    else if($action == "create"){
        CheckCreate();
    }
    else if($action == "delete-account"){
        DeleteAccount();
    }
    else if($action == "delete-account-by-admin"){
        if(isset($_GET["username"]) && !empty($_GET["username"])){
            DeleteAccountByAdmin(htmlspecialchars($_GET["username"]));
        }
        else {
            header("Location: adminpanel");
        }
    }
    else if($action == "update-admin"){
        if(isset($_GET["username"]) && !empty($_GET["username"]) && isset($_GET["admin-access"]) && !empty($_GET["admin-access"]) && (htmlspecialchars($_GET["admin-access"]) == "true" || htmlspecialchars($_GET["admin-access"]) == "false")){
            UpdateAdmin(htmlspecialchars($_GET["username"]), htmlspecialchars($_GET["admin-access"]));
        }
        else{
            header("Location: adminpanel");
        }
    }
    else if($action == "update-password"){
        ChangePassword();
    }
    else if($action == "logout"){
        LogOut();
    }
    else if($action == "update-bankroll"){
        UpdateBankroll();
    }
}

if($page == "login"){
    DisplayLoginPage();
}
else if($page == "home"){
    DisplayHome();
}
else if($page == "create"){
    DisplayCreate();
}
else if($page == "account"){
    DisplayAccount();
}
else if($page == "adminpanel"){
    DisplayAdminPanel();
}
else{
    Display404();
}

