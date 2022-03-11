//ao abrir a página executa o select e traz tudo na tela
var idUsuario = 0;

$(document).ready(async function () {

  const parametrosURL = new URLSearchParams(window.location.search);
  exibeToast(parametrosURL.get('sucesso'));

  //cria lista de usuarios na tela
  const response = await $.ajax({
    url: `../../api/cliente/index.php?funcao=listaUsuarios`,
    method: "get",
    dataType: 'JSON',
  });

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
        <td>
          <div class="form-check" >
            <input class="form-check-input" ${excluir && 'checked'} type="checkbox" id="checkbox-excluir">
          </div>
        </td>
        <td>
          <div class="form-check" >
            <input class="form-check-input" ${editar && 'checked'} type="checkbox" id="checkbox-editar">
          </div>
        </td>
        <td>
          <div class="form-check" >
            <input class="form-check-input" ${cadastrar && 'checked'} type="checkbox" id="checkbox-cadastrar">
          </div>
        </td>
        <td>
          <div class="form-check" >
            <input class="form-check-input" ${adm && 'checked'} type="checkbox" id="checkbox-adm">
          </div>
        </td>
        <td>
          <button class='btn btn-success' onclick='alimentaCampos(${JSON.stringify(response[i])})'>Editar</button>
        </td>
      </tr> 
      `;
    $("#body-table").append(tr_str);
  }
});

$("#salvar-permissoes").on("click", async (e) => {
  let excluir = document.getElementById("modal-checkbox-excluir").checked ? 1 : 0;
  let editar = document.getElementById("modal-checkbox-editar").checked ? 1 : 0;
  let cadastrar = document.getElementById("modal-checkbox-cadastrar").checked ? 1 : 0;
  let adm = document.getElementById("modal-checkbox-adm").checked ? 1 : 0;

  const response = await $.ajax({
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
    }
  });

  if (response.atualizado) {
    window.location = "?sucesso=true";
  } else {
    window.location = "?sucesso=false";
  }
})

const alimentaCampos = (dados) => {
  idUsuario = dados.id;

  document.getElementById("modal-checkbox-excluir").checked = dados.excluir;
  document.getElementById("modal-checkbox-editar").checked = dados.editar;
  document.getElementById("modal-checkbox-cadastrar").checked = dados.cadastrar;
  document.getElementById("modal-checkbox-adm").checked = dados.adm;

  $('#modalUsuario').modal('show');
}

const exibeToast = (exibe) => {
  if (exibe) toastPersonalizado("Permissões atualizadas com sucesso!", "sucesso")
}