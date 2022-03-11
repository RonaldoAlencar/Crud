<?php
    $server="localhost";
    $user="root";
    $pass="";
    $bd="crud";

    try{
        $conn = new PDO("mysql:host=$server;dbname=$bd", $user, $pass);
        $conn->setAttribute(PDO::ATTR_ERRMODE, $conn::ERRMODE_EXCEPTION);
    }catch(PDOException $e){
        echo "Conexão falhou =(" . $e->getMessage();
    }
?>