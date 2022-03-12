const parametrosURL = new URLSearchParams(window.location.search);
const idCliente = parametrosURL.get('id');
const email = localStorage.getItem('usuario')
var idEnderecoClicado;

//no carregar da tela, alimenta os input com os dados do banco de dados
$(document).ready(async function () {

    if (parametrosURL.get('sucesso')) toastPersonalizado("Cadastro atualizado com sucesso", "sucesso");
    if (parametrosURL.get('sucessoAtualizaEndereco')) toastPersonalizado("Endereço atualizado com sucesso", "sucesso");
    if (parametrosURL.get('sucessoRemoveEndereco')) toastPersonalizado("Endereço removido com sucesso", "sucesso");

    const response = await $.ajax({
        url: `../../api/cliente/index.php?funcao=clientePorId&id=${idCliente}`,
        method: "GET", //
        dataType: "JSON"
    });

    //alimenta campos do frontEnd
    document.getElementById("nome").value = response[0]['nome'];
    document.getElementById("cpf").value = response[0]['cpf'];
    document.getElementById("rg").value = response[0]['rg'];
    document.getElementById("email").value = response[0]['email'];
    document.getElementById("telefone1").value = response[0]['telefone1'];
    document.getElementById("telefone2").value = response[0]['telefone2'];
    document.getElementById("cpf").value = response[0]['cpf'];
    document.getElementById("data_nascimento").value = response[0]['data_nascimento'];

    //alimenta endereços do cliente
    updateFrontEndEndereco(response)
});

//atualiza ativo do endereço do cliente do banco de dados
$("#remove-address-client").on("click", async (e) => {

    const response = await $.ajax({
        url: '../../api/endereco/index.php',
        type: "PUT",
        dataType: 'JSON',
        data: {
            funcao: 'atualizarAtivoEnderecoCliente',
            idEndCli: idEnderecoClicado
        }
    });

    if (response.atualizado) {
        window.location = `?sucessoRemoveEndereco=true&id=${idCliente}`;
    } else {
        window.location = `?sucessoRemoveEndereco=false&id=${idCliente}`;
    }
})

//atualiza dados do cliente
$("#btn-update-client").on("click", async (e) => {
    //pega o id do cliente pela url
    e.preventDefault();

    const response = await $.ajax({
        url: '../../api/cliente/index.php',
        type: "PUT",
        dataType: 'JSON',
        data: {
            funcao: 'atualizaCliente',
            nome: document.getElementById('nome').value.replace(/[`]/gi, ''),
            cpf: document.getElementById('cpf').value.replace(/[-.]/gi, ''),
            rg: document.getElementById('rg').value.replace(/[-.]/gi, ''),
            email: document.getElementById('email').value.replace(/[`]/gi, ''),
            telefone1: document.getElementById('telefone1').value.replace(/[()-]/gi, ''),
            telefone2: document.getElementById('telefone2').value.replace(/[()-]/gi, ''),
            data_nascimento: document.getElementById('data_nascimento').value,
            idCliente: idCliente
        }
    });

    if (response.atualizado) {
        window.location = `?sucesso=true&id=${idCliente}`;
    } else {
        window.location = `?sucesso=false&id=${idCliente}`;
    }
});

//atualiza endereço do cliente
$("#alter-address-client").on('click', async (e) => {
    const response = await $.ajax({
        url: '../../api/endereco/index.php',
        type: "PUT",
        dataType: 'JSON',
        data: {
            funcao: 'atualizaEndereco',
            cep: document.getElementById("cep_alterar").value,
            logradouro: document.getElementById("logradouro_alterar").value,
            bairro: document.getElementById("bairro_alterar").value,
            numero: document.getElementById("numero_alterar").value,
            cidade: document.getElementById("cidade_alterar").value,
            uf: document.getElementById("uf_alterar").value,
            complemento: document.getElementById("complemento_alterar").value,
            idEndereco: idEnderecoClicado,
            principal: document.getElementById("checkbox-endereco-principal").checked ? 1 : 0
        }
    });

    if (response.atualizado) {
        window.location = `?sucessoAtualizaEndereco=true&id=${idCliente}`;
    } else {
        window.location = `?sucessoAtualizaEndereco=false&id=${idCliente}`;
    }
})

//insere endereços na tela
const updateFrontEndEndereco = (enderecos) => {

    //percorre enderecos, começa no array 1
    for (var i = 0; i <= enderecos[1].length - 1; i++) {

        var logradouro = enderecos[1][i]['logradouro'];
        var numero = enderecos[1][i]['numero'];
        var bairro = enderecos[1][i]['bairro'];
        var localidade = enderecos[1][i]['localidade'];
        var uf = enderecos[1][i]['uf'];
        var cep = enderecos[1][i]['cep'];
        var complemento = enderecos[1][i]['complemento'];
        var id = enderecos[1][i]['id'];
        var principal = enderecos[1][i]['principal'];

        //insere na tela endereço do cliente
        var tr_str = `
        <div id="address" name="address" class="p-2 mb-2" style="background-color: #fff" data-id=${id}>
            Rua: ${logradouro} N: ${numero}, Bairro: ${bairro}, Cidade: ${localidade} - ${uf}, CEP: ${cep}, Complemento: ${complemento}
            <br />${principal ? "<strong>Principal</strong>" : "Secundário"} 
            <div class="d-flex flex-row-reverse bd-highlight mt-0">
                <a type='button' id='btn-delete' class='btn btn-danger btn-sm' onclick='removeEnderecoCliente(event.target, ${principal})'>
                    Remover
                </a>

                <a type='button' id='btn-edit' class='btn btn-info btn-sm' onclick='alteraEndCliente(${JSON.stringify(enderecos[1][i])})' data-bs-toggle='modal' data-bs-target='#modalAlteraEndereco'>
                    Editar
                </a>
            </div>
        </div>
        `;

        //adiciona no html
        $("#address-client").append(tr_str);
    }
    //valida permissoes para exibição de botões
    verificaPermissao();
}

//seleciona o id do endereço do cliente a ser apagado apos confirmação
const removeEnderecoCliente = async (elementoClicado, principal) => {
    if (principal) {
        toastPersonalizado("Não pode remover o endereço principal", "aviso")
        return
    }

    $('#modalRemoveEndereco').modal('show');

    //seleciona o elemento vô para pegar o id a ser excluido
    var elementoPai = elementoClicado.parentNode;
    idEnderecoClicado = elementoPai.parentNode.getAttribute("data-id");
}

//obtem obj retornado do click no editar endereço e alimenta campos para serem editados!
const alteraEndCliente = (endereco) => {
    idEnderecoClicado = endereco.id
    document.getElementById("cep_alterar").value = endereco.cep;
    document.getElementById("logradouro_alterar").value = endereco.logradouro;
    document.getElementById("bairro_alterar").value = endereco.bairro;
    document.getElementById("numero_alterar").value = endereco.numero;
    document.getElementById("cidade_alterar").value = endereco.localidade;
    document.getElementById("uf_alterar").value = endereco.uf;
    document.getElementById("complemento_alterar").value = endereco.complemento;
    document.getElementById("checkbox-endereco-principal").checked = endereco.principal;
}

const verificaPermissao = async () => {
    let email = localStorage.getItem('usuario')
    const { permissao } = await $.ajax({
        url: `../../api/usuario/index.php?funcao=verificaPermissao&email=${email}`,
        method: "GET",
        dataType: "JSON"
    });

    //verifica permissão de editar, se não esconde botões
    if (!permissao.editar) {
        document.getElementById("btn-edit").setAttribute("hidden", "")
        document.getElementById("btn-update-client").setAttribute("hidden", "")
        document.getElementById("new-address").setAttribute("hidden", "")
    }
    if (!permissao.excluir) {
        document.getElementById("btn-delete").setAttribute("hidden", "")
    }
    if (permissao.adm) {
        $("#nav-tabs").append(`
        <li class="nav-item">
            <a class="nav-link text-dark" href="../list_usuarios/index.html">Usuarios do sistema</a>
        </li>
        `)
    }

}