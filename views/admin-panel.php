<!--
@author : Loan BOROWSKI
@update : 27/04/26

Admin Panel page
-->

<?php 
session_start();
if($_SESSION['admin_access'] == "false"){
    header("Location: home");
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="/assets/img/icons/admin.png">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="/assets/css/style.css">
    <title>BlackJack - Admin Panel</title>
</head>
<body>
    <a href="home"><button>Retour au home</button></a>
    <table>
        <th>Username</th>
        <th>Bankroll</th>
        <th>Admin Access</th>
        <th>Actions</th>
    <?php 
    foreach($_SESSION["users_db"] as $user){
        $username = $user['username'];
        echo "<tr>";
        echo "<td>";
        echo $user['username'];
        echo "</td>";
        echo "<td>";
        echo $user["bankroll"];
        echo "</td>";
        echo "<td>";
        echo $user["admin_access"];
        echo "</td>";
        echo "<td>";
        if($user["admin_access"] == "false"){
            echo "<a href='index.php?action=delete-account-by-admin&username=$username'><button class='delete-account-button'>Delete the account</button></a>";
            echo "<a href='index.php?action=update-admin&username=$username&admin-access=true'><button class='add-admin-button'>Add Admin</button></a>";
        }
        if($user["admin_access"] == "true" && $_SESSION["username"] != $user["username"] && $user["username"] != "admin"){
            echo "<a href='index.php?action=update-admin&username=$username&admin-access=false'><button class='remove-admin-button'>Remove Admin</button></a>";
        }
        echo "</td>";
        echo "</tr>";
        }
    ?>
    </table>
</body>
</html>