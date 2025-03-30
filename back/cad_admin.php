<?php
require_once('conection.php');

$conn = mysqli_connect($servername, $username, $password, $database);

if (!$conn) {
    die("Falha na conexão: " . mysqli_connect_error());
}

$nome = $_POST['user'];
$email = $_POST['email'];
$senha = password_hash($_POST['password'], PASSWORD_BCRYPT);

$insert = "INSERT INTO users (nome, email, senha) VALUES ('$nome', '$email', '$senha')";

if (mysqli_query($conn, $insert)) {
    echo "Cadastro realizado com sucesso!";
} else {
    echo "Erro: " . $insert . "<br>" . mysqli_error($conn);
}

mysqli_close($conn);
?>
