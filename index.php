<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <form method="POST" action="">
        <p>Usuário: <input type="text" name="user" id="user"></p>
        <p>Senha: <input type="password" name="password" id="password"></p>
        <input type="submit" value="Entrar">
    </form>

    <?php
    require_once('back/conection.php');

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $user = $_POST["user"];
        $userpassword = $_POST["password"];

        $conn = mysqli_connect($servername, $username, $password, $database);

        if (!$conn) {
            die("Erro na conexão: " . mysqli_connect_error());
        }

        $link = $conn->prepare("SELECT id, nome, senha FROM users WHERE nome = ?");
        $link->bind_param("s", $user); 
        $link->execute();
        $result = $link->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();

            if (password_verify($userpassword, $row['senha'])) {
                echo "Login bem-sucedido! Bem-vindo, " . htmlspecialchars($row['nome']);
                header("Location: home.html");
                exit();
            } else {
                echo "Senha incorreta!";
            }
        } else {
            echo "Usuário não encontrado!";
        }

        $link->close();
        $conn->close();
    }
    ?>
</body>
</html>
