<?php
include "../conection/index.php";
header("Content-Type: application/json");
$method = $_SERVER["REQUEST_METHOD"];

####################################### POST ####################################### 
if ($_POST["funcao"] == "cadastrarNovoEndereco") {

    try {
        $logradouro = $_POST["logradouro"];
        $localidade = $_POST["localidade"];
        $uf = $_POST["uf"];
        $bairro = $_POST["bairro"];
        $numero = $_POST["numero"];
        $complemento = $_POST["complemento"];
        $cep = $_POST["cep"];
        $idCliente = $_POST["idCliente"];
        $principal = $_POST["principal"];

        $query = "INSERT INTO cliente_endereco (idcliente,logradouro,localidade,uf,bairro,complemento,cep,numero) VALUES (?,?,?,?,?,?,?,?)";
        //INSERE ENDEREÇO
        $statement = $conn->prepare($query);
        $statement->bindParam(1, $idCliente);
        $statement->bindParam(2, $logradouro);
        $statement->bindParam(3, $localidade);
        $statement->bindParam(4, $uf);
        $statement->bindParam(5, $bairro);
        $statement->bindParam(6, $complemento);
        $statement->bindParam(7, $cep);
        $statement->bindParam(8, $numero);
        $statement->execute();

        echo json_encode(["cadastrado" => true, "mensagem" => "Cadastro realizado com sucesso!", "erro" => null]);
    } catch (PDOException $e) {
        $e->getMessage();
        echo json_encode(["cadastrado" => false, "mensagem" => "Erro ao realizar cadastro!", "erro" => $e]);
    }
}

####################################### PUT ####################################### 
if ($method === "PUT") {

    //obtem os dados recebidos pelo metodo
    parse_str(file_get_contents("php://input"), $sent_vars);

    //atualiza endereço para inativo/excluido///
    if ($sent_vars["funcao"] == "atualizarAtivoEnderecoCliente") {

        $idEnderecoClicado = $sent_vars["idEndCli"];

        try {
            $query = "UPDATE cliente_endereco SET ativo=0 WHERE id=?";
            //prepare sql
            $statement = $conn->prepare($query);
            $statement->bindParam(1, $idEnderecoClicado);
            $statement->execute();

            echo json_encode(["atualizado" => true, "mensagem" => "Atualizado com sucesso!", "erro" => null]);
        } catch (PDOException $e) {
            echo $e->getMessage();
            echo json_encode(["atualizado" => false, "mensagem" => "Erro ao atualizar!", "erro" => $e]);
        }
    }

    //atualiza os dados do endereco
    if ($sent_vars["funcao"] == "atualizaEndereco") {
        $cep = $sent_vars["cep"];
        $logradouro = $sent_vars["logradouro"];
        $bairro = $sent_vars["bairro"];
        $numero = $sent_vars["numero"];
        $cidade = $sent_vars["cidade"];
        $uf = $sent_vars["uf"];
        $complemento = $sent_vars["complemento"];
        $idEndereco = $sent_vars["idEndereco"];
        $principal = $sent_vars["principal"];

        //rotina de atualização de endereço principal
        if ($principal) {
            //primeiro retira todos os endereços principais
            $query = "UPDATE cliente_endereco SET principal = 0 WHERE idcliente=(SELECT idcliente FROM cliente_endereco WHERE id=? LIMIT 1)";
            $statement = $conn->prepare($query);
            $statement->bindParam(1, $idEndereco);
            $statement->execute();

            //logo após insere o endereço principal correto
            $query = "UPDATE cliente_endereco SET principal = 1 WHERE id = ?";
            $statement = $conn->prepare($query);
            $statement->bindParam(1, $idEndereco);
            $statement->execute();
        }

        try {
            $query = "UPDATE cliente_endereco SET cep=?, logradouro=?, bairro=?, numero=?, localidade=?, uf=?, complemento=? WHERE id=?";
            $statement = $conn->prepare($query);
            $statement->bindParam(1, $cep);
            $statement->bindParam(2, $logradouro);
            $statement->bindParam(3, $bairro);
            $statement->bindParam(4, $numero);
            $statement->bindParam(5, $cidade);
            $statement->bindParam(6, $uf);
            $statement->bindParam(7, $complemento);
            $statement->bindParam(8, $idEndereco);

            $statement->execute();
            echo json_encode(["atualizado" => true, "mensagem" => "Atualizado com sucesso!", "erro" => null]);
        } catch (PDOException $e) {
            $e->getMessage();
            echo json_encode(["atualizado" => false, "mensagem" => "Erro ao atualizar!", "erro" => $e]);
        }
    }
}
