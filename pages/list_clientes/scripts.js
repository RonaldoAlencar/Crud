var idCliente = 0;
var email = localStorage.getItem('usuario')
var permissoes;

//ao abrir a página executa o select e traz tudo na tela
$(document).ready(async function () {
  let email_ = localStorage.getItem('usuario');

  //busca permissões do usuario
  const { permissao } = await $.ajax({
    url: `../../api/usuario/index.php?funcao=verificaPermissao&email=${email_}`,
    method: "GET",
    dataType: "JSON"
  });

  permissoes = permissao;
  //libera acessos a usuarios se usuario conectado for adm
  if (permissao.adm) {
    $("#nav-tabs").append(`
            <li class="nav-item">
              <a class="nav-link text-dark" href="../list_usuarios/index.html">Usuarios do sistema</a>
            </li>
        `)
  }

  //cria lista de usuarios na tela
  const { clientes } = await $.ajax({
    url: `../../api/cliente/index.php?funcao=listaClientes&emailUsuario=${localStorage.getItem('usuario')}`,
    method: "get",
    dataType: 'JSON'
  });

  constroiTabela(clientes, permissao);
});

//atualiza ativo do cliente do banco de dados
$("#remove-client").on("click", async (e) => {

  $.ajax({
    url: '../../api/cliente/index.php',
    type: "PUT",
    dataType: 'JSON',
    data: {
      funcao: 'atualizarAtivoCliente',
      idCliente: idCliente
    },
    success: function (response) {

    },
    error: function (xhr) {

    }
  });

  location.reload()
})

const selecionaIdCliente = (elementoClicado) => {
  //seleciona o elemento tr
  var el = elementoClicado.closest("tr")
  elementoCliente = elementoClicado.closest("tr")
  //seleciona o id da linha
  idCliente = (el.children[0].innerHTML);
}

const pesquisarCliente = async (e) => {
  let clientePesquisado = document.getElementById("input-pesquisa").value;

  //remove elementos da tabela
  $("td").remove();

  const { clientes } = await $.ajax({
    url: `../../api/cliente/index.php?funcao=pesquisaCliente&emailUsuario=${localStorage.getItem('usuario')}&clientePesquisado=${clientePesquisado}`,
    method: "get",
    dataType: 'JSON'
  })

  constroiTabela(clientes, permissoes)
}

const constroiTabela = (clientes, permissao) => {
  for (var i = 0; i < clientes.length; i++) {

    var id = clientes[i].id;
    var nome = clientes[i].nome;
    var email = clientes[i].email;
    var cpf = clientes[i].cpf;
    var rg = clientes[i].rg;
    var qtd_endereco = clientes[i].qtd_endereco;
    var vendedor = clientes[i].vendedor;

    var tr_str = `<tr>
      <td scope='row' id="id">${id}</td>
        <td>${nome}</td>
        <td>${email}</td>
        <td>${cpf}</td>
        <td>${rg}</td>
        <td>${qtd_endereco}</td>
        <td>${vendedor}</td>
        <td>
          <a href='../cad_edit_cliente/index.html?id=${id}' class='btn btn-success'>Visualizar</a>
          <a type='button' class='btn btn-danger' id="btn-desativar" ${permissao.excluir ? 'style="display: true"' : 'style="display: none"'} onclick="selecionaIdCliente(event.target)" data-bs-toggle='modal' data-bs-target='#exampleModal'>
              Desativar
          </a>
        </td>
      </tr>
  `;

    $("#body-table").append(tr_str);
  }
}