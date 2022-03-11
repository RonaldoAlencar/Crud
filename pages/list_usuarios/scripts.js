//ao abrir a página executa o select e traz tudo na tela
var idUsuario = 0;

$(document).ready(function () {

  //cria lista de usuarios na tela
  $.ajax({
    url: `../../api/cliente/index.php?funcao=listaUsuarios`,
    method: "get",
    dataType: 'JSON',
    success: function (response) {

      for (var i = 0; i < response.length; i++) {
        var id = response[i].id;
        var email = response[i].email;
        var excluir = response[i].excluir;
        var editar = response[i].editar;
        var cadastrar = response[i].cadastrar;
        var adm = response[i].adm;

        var tr_str = `<tr>
        <th scope='row' id="id">${id}</th>
          <td>${email}</td>
          <td>${excluir}</td>
          <td>${editar}</td>
          <td>${cadastrar}</td>
          <td>${adm}</td>
          <td>
            <button class='btn btn-success' onclick='alimentaCampos(${JSON.stringify(response[i])})' data-bs-toggle='modal' data-bs-target='#modalUsuario'>Editar</button>
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

$("#salvar-permissoes").on("click", (e) => {
  let excluir = document.getElementById("checkbox-excluir").checked ? 1 : 0;
  let editar = document.getElementById("checkbox-editar").checked ? 1 : 0;
  let cadastrar = document.getElementById("checkbox-cadastrar").checked ? 1 : 0;
  let adm = document.getElementById("checkbox-adm").checked ? 1 : 0;

  $.ajax({
    url: '../../api/usuario/index.php',
    type: "PUT",
    dataType: 'JSON',
    data: {
      funcao: 'atualizarPermissoes',
      excluir: excluir,
      editar: editar,
      cadastrar: cadastrar,
      adm: adm,
      idUsuario: idUsuario
    },
    success: function (response) {
      if (response.atualizado) {
        location.reload();
      }
    },
    error: function (xhr) {

    }
  });

})

const alimentaCampos = (dados) => {
  idUsuario = dados.id;
  dados.excluir == '1' ? document.getElementById("checkbox-excluir").checked = true : document.getElementById("checkbox-excluir").checked = false;
  dados.editar == '1' ? document.getElementById("checkbox-editar").checked = true : document.getElementById("checkbox-editar").checked = false;
  dados.cadastrar == '1' ? document.getElementById("checkbox-cadastrar").checked = true : document.getElementById("checkbox-cadastrar").checked = false;
  dados.adm == '1' ? document.getElementById("checkbox-adm").checked = true : document.getElementById("checkbox-adm").checked = false;
}