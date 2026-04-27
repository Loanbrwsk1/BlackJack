<!--
@author : Loan BOROWSKI
@update : 27/04/26

Configuration of the DB
-->
<?php
$DB_NAME = 'mysql:host=localhost;dbname=BlackJack;charset=utf8';
$DB_USER = 'root';
$DB_PWD = 'root';
$OPTIONS =
    [
        PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8',
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_EMULATE_PREPARES => false
    ];

global $DB;

try {
    $DB = new PDO($DB_NAME, $DB_USER, $DB_PWD, $OPTIONS);
}
catch(Exception $e){
    echo "Erreur de connexion à la BDD !";
}