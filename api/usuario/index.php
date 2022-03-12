<?php
include "../conection/index.php";
header("Content-Type: application/json");
$method = $_SERVER["REQUEST_METHOD"];

####################################### GET ####################################### 
if ($_GET["funcao"] == "verificaPermissao") {

    $email = $_GET["email"];

    try {
        $sql = "SELECT excluir, editar, cadastrar, adm FROM usuario WHERE email = '$email'";
        $dados = $conn->query($sql);
        $permissao = $dados->fetchAll();

        echo json_encode(["sucesso" => true, "permissao" => $permissao[0], "erro" => $email]);
    } catch (PDOException $e) {
        $e->getMessage();
        echo json_encode(["sucesso" => false, "permissao" => null, "erro" => $e]);
    }
}

####################################### POST ####################################### 
if ($_POST["funcao"] == "logar") {

    $email = $_POST["email"];
    $senha = $_POST["senha"];

    $sql = "SELECT * FROM usuario WHERE email = '$email'";
    $dados = $conn->query($sql);
    $usuario = $dados->fetchAll();

    if (password_verify($senha, $usuario[0]["senha"])) {
        echo json_encode(["conectado" => true, "mensagem" => "Conectado com sucesso!", "usuario" => $usuario[0]["email"]]);
    } else {
        echo json_encode(["conectado" => false, "mensagem" => "Erro ao realizar login", "usuario" => null]);
    }
}

if ($_POST["funcao"] == "cadastrarUsuario") {
    try {
        $email = $_POST["email"];
        $senha = password_hash($_POST["senha"], PASSWORD_DEFAULT);
        $nome = $_POST["nome"];

        $query = "INSERT INTO usuario (email,senha,nome) VALUES (?,?,?)";

        $statement = $conn->prepare($query);
        $statement->bindParam(1, $email);
        $statement->bindParam(2, $senha);
        $statement->bindParam(3, $nome);
        $statement->execute();

        echo json_encode(["cadastrado" => true, "mensagem" => "Cadastro realizado com sucesso!", "erro" => null]);
    } catch (PDOException $e) {
        $e->getMessage();
        echo json_encode(["cadastrado" => false, "mensagem" => "Erro ao realizar cadastro!", "erro" => $e]);
    }
}

####################################### PUT ####################################### 
if ($method === "PUT") {
    parse_str(file_get_contents("php://input"), $sent_vars);

    if ($sent_vars["funcao"] == "atualizarPermissoes") {

        try {
            $excluir = $sent_vars["excluir"];
            $editar = $sent_vars["editar"];
            $cadastrar = $sent_vars["cadastrar"];
            $adm = $sent_vars["adm"];
            $idUsuario = $sent_vars["idUsuario"];

            $query = "UPDATE usuario SET excluir=?, editar=?, cadastrar=?, adm=? WHERE id=?";

            $statement = $conn->prepare($query);
            $statement->bindParam(1, $excluir);
            $statement->bindParam(2, $editar);
            $statement->bindParam(3, $cadastrar);
            $statement->bindParam(4, $adm);
            $statement->bindParam(5, $idUsuario);
            $statement->execute();

            echo json_encode(["atualizado" => true, "mensagem" => "Atualizado com sucesso!", "erro" => null]);
        } catch (PDOException $e) {
            $e->getMessage();
            echo json_encode(["atualizado" => false, "mensagem" => "Erro ao atualizar permissões", "erro" => $e]);
        }
    }
}
