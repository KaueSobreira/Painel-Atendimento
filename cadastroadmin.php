<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro Admin</title>
</head>
<body>
        <form method="POST" action="back/cad_admin.php">
            <p>Nome:<input type="text" name="user" id="user"></p>
            <p>Email:<input type="text" name="email" id="email"></p>
            <p>Senha:<input type="password" name="password" id="password"></p>
            <p>Confirmação de Senha:<input type="password" name="password2" id="password2"></p>
            <input type="submit" value="Enviar">
        </form>
</body>
</html>
