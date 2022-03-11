var idCliente = 0;
var email = localStorage.getItem('usuario')
var permissoes;

//ao abrir a página executa o select e traz tudo na tela
$(document).ready(function () {

  //busca permissões do usuario
  $.ajax({
    url: `../../api/usuario/index.php?funcao=verificaPermissao&email=${email}`,
    method: "get",
    dataType: 'JSON',
    success: function (data) {
      permissoes = data;

      //libera acessos a usuarios se usuario conectado for adm
      if (data.adm) {
        $("#nav-tabs").append(`
          <li class="nav-item">
            <a class="nav-link text-dark" href="../list_usuarios/index.html">Usuarios do sistema</a>
          </li>
      `)
      }

    },
    error: function (data) {
    }
  });

  //cria lista de usuarios na tela
  $.ajax({
    url: `../../api/cliente/index.php?funcao=listaClientes&emailUsuario=${localStorage.getItem('usuario')}`,
    method: "get",
    dataType: 'JSON',
    success: function (response) {

      console.log(permissoes.excluir)

      for (var i = 0; i < response.length; i++) {
        var id = response[i].id;
        var nome = response[i].nome;
        var email = response[i].email;
        var cpf = response[i].cpf;
        var rg = response[i].rg;
        var qtd_endereco = response[i].qtd_endereco;

        var tr_str = `<tr>
        <th scope='row' id="id">${id}</th>
          <td>${nome}</td>
          <td>${email}</td>
          <td>${cpf}</td>
          <td>${rg}</td>
          <td>${qtd_endereco}</td>
          <td>
            <a href='../cad_edit_cliente/index.html?id=${id}' class='btn btn-success'>Visualizar</a>
            <a type='button' class='btn btn-danger' id="btn-desativar" ${permissoes.excluir ? 'style="display: true"' : 'style="display: none"'} onclick="selecionaIdCliente(event.target)" data-bs-toggle='modal' data-bs-target='#exampleModal'>
                Desativar
            </a>
          </td>
        </tr>
    `;

        $("#body-table").append(tr_str);
      }
    },
    error: function (xhr) {

    }
  });
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