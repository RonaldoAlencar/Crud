<?php
include "../conection/index.php";
header("Content-Type: application/json");
$method = $_SERVER["REQUEST_METHOD"];

####################################### POST ####################################### 
//cadastro de novo cliente
if ($_POST["funcao"] == "cadastrarCliente") {
    try {
        $nome = $_POST["nome"];
        $cpf = $_POST["cpf"];
        $rg = $_POST["rg"];
        $email = $_POST["email"];
        $telefone1 = $_POST["telefone1"];
        $telefone2 = $_POST["telefone2"];
        $data_nasc = $_POST["data_nascimento"];
        $enderecos = $_POST["enderecos"];
        $emailUsuario = $_POST["emailUsuario"];

        //INSERE CLIENTE
        $query = "INSERT INTO clientes (nome,cpf,rg,email,data_nascimento,telefone1,telefone2,idvendedor) VALUES (?,?,?,?,?,?,?,(SELECT id FROM usuario WHERE email = ?))";
        $statement = $conn->prepare($query);
        $statement->bindParam(1, $nome);
        $statement->bindParam(2, $cpf);
        $statement->bindParam(3, $rg);
        $statement->bindParam(4, $email);
        $statement->bindParam(5, $data_nasc);
        $statement->bindParam(6, $telefone1);
        $statement->bindParam(7, $telefone2);
        $statement->bindParam(8, $emailUsuario);
        $statement->execute();
        $lastInsertId = $conn->lastInsertId();

        //INSERE ENDEREÇOS
        for ($count = 0; $count <= (count($enderecos) - 1); $count++) {
            $stmt = $conn->prepare("INSERT INTO cliente_endereco (idcliente,logradouro,localidade,uf,bairro,complemento,cep,numero,principal) VALUES (?,?,?,?,?,?,?,?,?)");
            $stmt->execute(array($lastInsertId, $enderecos[$count]["logradouro"], $enderecos[$count]["localidade"], $enderecos[$count]["uf"], $enderecos[$count]["bairro"], $enderecos[$count]["complemento"], $enderecos[$count]["cep"], $enderecos[$count]["numero"], $enderecos[$count]["principal"]));
        }
        echo json_encode(["cadastrado" => true, "mensagem" => "Cadastro realizado com sucesso!", "erro" => null]);
    } catch (PDOException $e) {
        $e->getMessage();
        echo json_encode(["cadastrado" => false, "mensagem" => "Erro ao realizar cadastro!", "erro" => $e]);
    }
}
####################################### GET ####################################### 
//busca cliente por id
if ($_GET["funcao"] == "clientePorId") {

    $id = $_GET["id"];

    try {
        //seleciona cliente
        $sql = "SELECT 
                    id, nome,
                    INSERT(INSERT(INSERT(cpf,10,0,'-'),7,0,'.'),4, 0,'.') cpf, 
                    INSERT(INSERT(INSERT(rg,9,0,'-'),6,0,'.'),3, 0,'.') rg, email, data_nascimento, 
                    INSERT(INSERT(INSERT(telefone1,8,0,'-'),3, 0,')'),1,0,'(') telefone1, 
                    INSERT(INSERT(INSERT(telefone2,9,0,'-'),3, 0,')'),1,0,'(') telefone2, 
                    ativo, idvendedor 
                FROM clientes WHERE id = '$id';"
        ;

        $dados = $conn->query($sql);
        $cliente = $dados->fetchAll();

        //seleciona endereços do cliente
        $sql = "SELECT * FROM cliente_endereco WHERE idcliente = '$id' AND ativo=1 ORDER BY principal DESC";
        $dados = $conn->query($sql);
        $enderecos = $dados->fetchAll();

        //junta endereco no cliente, pega posição 1 pois posição zero é o cliente
        $cliente[1] = $enderecos;

        echo json_encode($cliente);
    } catch (PDOException $erro) {
        echo "Erro: " . $erro->getMessage();
    }
}
//busca quantidade de endereços ativos do cliente por id cliente
if ($_GET["funcao"] == "qtdEndAtivo") {

    $id = $_GET["id"];

    $sql = "SELECT count(id) qtd FROM cliente_endereco WHERE idcliente = '$id' AND ativo=1";
    $dados = $conn->query($sql);
    $qtdEnd = $dados->fetchAll();

    echo json_encode($qtdEnd);
}
//lista todos os clientes ativos no sistema
if ($_GET["funcao"] === "listaClientes") {

    $emailUsuario = $_GET["emailUsuario"];

    try {
        //Select dinâmico para exibir clientes do vendedor, ou se for ADM mostra todos os clientes
        $sql = "SELECT 
	                c.id, c.nome,
                    INSERT(INSERT(INSERT(c.cpf,10,0,'-'),7,0,'.'),4, 0,'.') cpf, 
                    INSERT(INSERT(INSERT(c.rg,9,0,'-'),6,0,'.'),3, 0,'.') rg, email, data_nascimento, 
                    INSERT(INSERT(INSERT(c.telefone1,8,0,'-'),3, 0,')'),1,0,'(') telefone1, 
                    INSERT(INSERT(INSERT(c.telefone2,9,0,'-'),3, 0,')'),1,0,'(') telefone2, 
                    c.ativo, c.idvendedor,
                    (SELECT count(id) FROM cliente_endereco ce WHERE ce.ativo=1 AND ce.idcliente=c.id) AS qtd_endereco,
                    (SELECT nome FROM usuario u WHERE u.id = c.idvendedor) as vendedor
    
                FROM clientes c 

                WHERE 
                    c.ativo='1' 
                    AND 
                    if((SELECT adm FROM usuario WHERE email = '$emailUsuario') > 0, 1, 
                    c.idvendedor IN (SELECT id FROM usuario WHERE email = '$emailUsuario'))
                    ORDER BY c.id DESC    
        ";

        $dados = $conn->query($sql);
        $rows = $dados->fetchAll();

        echo json_encode(["sucesso" => true, "clientes" => $rows, "erro" => null]);
    } catch (PDOException $e) {
        $e->getMessage();
        echo json_encode(["sucesso" => false, "clientes" => null, "erro" => $e]);
    }
}

if ($_GET["funcao"] == "pesquisaCliente") {
    $emailUsuario = $_GET["emailUsuario"];
    $clientePesquisado = $_GET["clientePesquisado"];

    try {
        //Select de pesquisa de cliente, se usuario ADM busca todos clientes, se usuario comum, busca somente os clientes do usuario.
        $sql = "SELECT 
            c.*, 
            (select count(id) FROM cliente_endereco ce WHERE ce.ativo=1 AND ce.idcliente=c.id) AS qtd_endereco,
            (SELECT nome FROM usuario u WHERE u.id = c.idvendedor) as vendedor

            FROM clientes c 

            WHERE 
            c.ativo='1' 
            AND 
            if((SELECT adm FROM usuario WHERE email = '$emailUsuario') > 0, 1, 
            c.idvendedor IN (SELECT id FROM usuario WHERE email = '$emailUsuario'))
            AND
            c.nome like '%$clientePesquisado%'
            ORDER BY c.id DESC";

        $dados = $conn->query($sql);
        $rows = $dados->fetchAll();

        echo json_encode(["sucesso" => true, "clientes" => $rows, "erro" => null]);
    } catch (PDOException $e) {
        $e->getMessage();
        echo json_encode(["sucesso" => false, "clientes" => null, "erro" => $e]);
    }
}

####################################### PUT ####################################### 

if ($method === 'PUT') {

    //obtem os dados recebidos pelo metodo
    parse_str(file_get_contents("php://input"), $sent_vars);

    //atualiza clientes para inativo
    if ($sent_vars["funcao"] == "atualizarAtivoCliente") {

        $idCliente = $sent_vars["idCliente"];

        try {
            $query = "UPDATE clientes SET ativo=0 WHERE id=?";
            $statement = $conn->prepare($query);
            $statement->bindParam(1, $idCliente);
            $statement->execute();

            echo json_encode(["atualizado" => true, "mensagem" => "Atualizado com sucesso!", "erro" => null]);
        } catch (PDOException $e) {
            $e->getMessage();
            echo json_encode(["atualizado" => false, "mensagem" => "Erro ao atualizar!", "erro" => $e]);
        }
    }

    //atualiza dados do cliente
    if ($sent_vars["funcao"] == "atualizaCliente") {

        try {
            $nome = $sent_vars["nome"];
            $cpf = $sent_vars["cpf"];
            $rg = $sent_vars["rg"];
            $email = $sent_vars["email"];
            $telefone1 = $sent_vars["telefone1"];
            $telefone2 = $sent_vars["telefone2"];
            $data_nasc = $sent_vars["data_nascimento"];
            $enderecos = $sent_vars["enderecos"];
            $id = $sent_vars["idCliente"];

            //ATUALIZAÇÃO CLIENTE
            $query = "UPDATE clientes SET nome=?,cpf=?,rg=?,email=?,data_nascimento=?,telefone1=?,telefone2=? WHERE id = ?";

            $statement = $conn->prepare($query);
            $statement->bindParam(1, $nome);
            $statement->bindParam(2, $cpf);
            $statement->bindParam(3, $rg);
            $statement->bindParam(4, $email);
            $statement->bindParam(5, $data_nasc);
            $statement->bindParam(6, $telefone1);
            $statement->bindParam(7, $telefone2);
            $statement->bindParam(8, $id);
            $statement->execute();

            echo json_encode(["atualizado" => true, "mensagem" => "Atualizado com sucesso!", "erro" => null]);
        } catch (PDOException $e) {
            echo $e->getMessage();
            echo json_encode(["atualizado" => false, "mensagem" => "Erro ao atualizar!", "erro" => $e]);
        }
    }
}
