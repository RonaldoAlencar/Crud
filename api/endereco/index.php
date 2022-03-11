<?php
include "../conection/index.php";

header("Content-Type: application/json");
$method = $_SERVER["REQUEST_METHOD"];

####################################### PUT ####################################### 

//obtem os dados recebidos pelo metodo
parse_str(file_get_contents("php://input"), $sent_vars);

if ($method === 'PUT') {
    //atualiza endereço para inativo/excluido///
    if ($sent_vars['funcao'] == 'atualizarAtivoEnderecoCliente') {

        $idEnderecoClicado = $sent_vars['idEndCli'];

        try {
            $query = "UPDATE cliente_endereco SET ativo=0 WHERE id=?";
            //prepare sql
            $statement = $conn->prepare($query);
            $statement->bindParam(1, $idEnderecoClicado);
            $statement->execute();

            echo json_encode(['atualizado' => true, 'mensagem' => 'Atualizado com sucesso!', 'erro' => null]);
        } catch (PDOException $e) {
            echo $e->getMessage();
            echo json_encode(['atualizado' => false, 'mensagem' => 'Erro ao atualizar!', 'erro' => $e]);
        }
    }

    //atualiza os dados do endereco
    if ($sent_vars['funcao'] == 'atualizaEndereco') {
        $cep = $sent_vars['cep'];
        $logradouro = $sent_vars['logradouro'];
        $bairro = $sent_vars['bairro'];
        $numero = $sent_vars['numero'];
        $cidade = $sent_vars['cidade'];
        $uf = $sent_vars['uf'];
        $complemento = $sent_vars['complemento'];
        $idEndereco = $sent_vars['idEndereco'];

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
            echo json_encode(['atualizado' => true, 'mensagem' => 'Atualizado com sucesso!', 'erro' => null]);
        } catch (PDOException $e) {
            $e->getMessage();
            echo json_encode(['atualizado' => false, 'mensagem' => 'Erro ao atualizar!', 'erro' => $e]);
        }
    }
}
