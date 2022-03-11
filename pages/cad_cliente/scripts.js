//array de endereços do cliente
var enderecos = []
var posicaoArrayInicial = 0;
var auxiliar = posicaoArrayInicial;

//################################## funções ajax#################################
//cadastra novo cliente
$("#btn-send").on("click", (e) => {
    e.preventDefault();

    //valida campos preenchidos e valida se tem endereço preenchido
    if (validaCampos() && validaEnderecoPreenchido()) {
        $.ajax({
            method: "post",
            url: '../../api/cliente/index.php',
            data: {
                funcao: 'cadastrarCliente',
                nome: document.getElementById('nome').value.replace(/[`]/gi, ''),
                cpf: document.getElementById('cpf').value.replace(/[-.]/gi, ''),
                rg: document.getElementById('rg').value.replace(/[-.]/gi, ''),
                email: document.getElementById('email').value.replace(/[`]/gi, ''),
                telefone1: document.getElementById('telefone1').value.replace(/[()-]/gi, ''),
                telefone2: document.getElementById('telefone2').value.replace(/[()-]/gi, ''),
                data_nascimento: document.getElementById('data_nascimento').value,
                enderecos: enderecos,
                emailUsuario: localStorage.getItem('usuario')
            },
            success: (data) => {
                console.log(data)
                if (data.cadastrado) {
                    $('#return-params').append(`
                            <div class="alert alert-success" id="info" role="alert">
                                Cadastrado com sucesso!
                            </div>  
                            `);
                    //limpa campos do formulário
                    document.getElementById("form-cadastro-cliente").reset();
                    //Removendo a div de endereços
                    var node = document.getElementById("address-client");
                    if (node.parentNode) {
                        node.parentNode.removeChild(node);
                    }
                }

                if (!data.cadastrado) {
                    $('#return-params').append(`
                            <div class="alert alert-danger" id="info" role="alert">
                                Erro ao realizar cadastro!
                            </div>  
                            `);
                }

            },
            error: (data) => {
                console.log(data)
            }
        });

        //remove informação depois de 5 segundos
        setTimeout(() => {
            $("div").remove("#info");
            location.reload()
        }, 5000);
    }
})

//salva informações em array de endereços
$("#save-address-client").on("click", async (e) => {

    let logradouro = document.getElementById('logradouro').value;
    let localidade = document.getElementById('cidade').value;
    let uf = document.getElementById('uf').value;
    let bairro = document.getElementById('bairro').value;
    let numero = document.getElementById('numero').value;
    let complemento = document.getElementById('complemento')?.value;
    let cep = document.getElementById('cep').value;

    //adiciona no array para enviar osteriormente ao banco de dados
    enderecos.push({ id: auxiliar, logradouro, localidade, uf, bairro, numero, complemento, cep, principal: auxiliar == 0 ? 1 : 0 })
    //atualiza na tela com os dados
    atualizaDadosTela({ logradouro, localidade, uf, bairro, numero, complemento, cep, principal: auxiliar == 0 ? 1 : 0 })

    return
})

$(document).ready(function () {
    let email = localStorage.getItem("usuario");

    $.ajax({
        url: `../../api/cliente/index.php?funcao=verificaPermissao&email=${email}`,
        method: "get",
        dataType: "JSON",
        success: function (data) {
            console.log(data);
            if (data.cadastrar) {
                document.getElementById("btn-send").style = "display: true";
                document.getElementById("novo-endereco").style = "display: true";
            }
            //libera acessos a usuarios se usuario conectado for adm
            if (data.adm) {
                $("#nav-tabs").append(`
                <li class="nav-item">
                    <a class="nav-link text-dark" href="../list_usuarios/index.html">Usuarios do sistema</a>
                </li>
                `);
            }
        },
        error: function (data) {
            console.log("erro");
            console.log(data);
        }
    });
    return
});

//################################## funções js #################################
//masks
//phone 

var tel1 = new Cleave('#telefone1', {
    delimiters: ['(', ')', '-'],
    blocks: [0, 2, 4, 4]
});

//cpf
var cpf = new Cleave('#cpf', {
    delimiters: ['.', '.', '-'],
    blocks: [3, 3, 3, 2]
});

//RG
var rg = new Cleave('#rg', {
    delimiters: ['.', '.', '-'],
    blocks: [2, 3, 3, 1]
});

const validaCampos = () => {
    var flag = 0;

    if ($("#nome").val() == '') {
        $("#nome").css({ borderColor: "red" })
        flag = 1;
    } else {
        $("#nome").css({ borderColor: "#ccd4da" })
    }


    if ($("#cpf").val() == '') {
        $("#cpf").css({ borderColor: "red" })
        flag = 1;
    } else {
        $("#cpf").css({ borderColor: "#ccd4da" })
    }


    if ($("#rg").val() == '') {
        $("#rg").css({ borderColor: "red" })
        flag = 1;
    } else {
        $("#rg").css({ borderColor: "#ccd4da" })
    }


    if ($("#email").val() == '') {
        $("#email").css({ borderColor: "red" })
        flag = 1;
    } else {
        $("#email").css({ borderColor: "#ccd4da" })
    }


    if ($("#telefone1").val() == '') {
        $("#telefone1").css({ borderColor: "red" })
        flag = 1;
    } else {
        $("#telefone1").css({ borderColor: "#ccd4da" })
    }


    if ($("#telefone2").val() == '') {
        $("#telefone2").css({ borderColor: "red" })
        flag = 1;
    } else {
        $("#telefone2").css({ borderColor: "#ccd4da" })
    }


    if ($("#data_nascimento").val() == '') {
        $("#data_nascimento").css({ borderColor: "red" })
        flag = 1;
    } else {
        $("#data_nascimento").css({ borderColor: "#ccd4da" })
    }

    if (flag == 0) return true
    else return false
}

const buscarEndereco = (modo) => {

    //se modo alteração alimenta campos especificos, se não, alimenta outros campos
    if (modo == 'alteracao') {
        var cep = document.querySelector('#cep_alterar').value;

        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then((resp) => resp.json())
            .then(function (data) {

                //preenchimento dos inputs com a resposta do fetch
                document.querySelector("#logradouro_alterar").value = data.logradouro;
                document.querySelector("#cidade_alterar").value = data.localidade;
                document.querySelector("#uf_alterar").value = data.uf;
                document.querySelector("#bairro_alterar").value = data.bairro;

                //foca no input numero
                document.getElementById("numero").focus();

                Toastify({
                    text: "Campos atualizados com sucesso!",
                    duration: 5000,
                    newWindow: true,
                    close: true,
                    gravity: "top",
                    position: "center",
                    stopOnFocus: true
                }).showToast();
            })
            .catch(function (error) {
                console.log(error);
            });

    } else {
        var cep = document.querySelector('#cep').value;

        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then((resp) => resp.json())
            .then(function (data) {

                //preenchimento dos inputs com a resposta do fetch
                document.querySelector("#logradouro").value = data.logradouro;
                document.querySelector("#cidade").value = data.localidade;
                document.querySelector("#uf").value = data.uf;
                document.querySelector("#bairro").value = data.bairro;

                //foca no input numero
                document.getElementById("numero").focus();

                Toastify({
                    text: "Campos atualizados com sucesso!",
                    duration: 5000,
                    newWindow: true,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "center", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    onClick: function () { } // Callback after click
                }).showToast();
            })
            .catch(function (error) {
                console.log(error);
            });
    }

}

const atualizaDadosTela = async (endereco) => {
    //insere na tela endereço do endereco
    var tr_str = `
    <div id="address" name="address" class="p-2 mb-2" style="background-color: #fff" data-id=${auxiliar}>
        Rua: ${endereco.logradouro} N: ${endereco.numero}, Bairro: ${endereco.bairro}, Cidade: ${endereco.localidade} - ${endereco.uf}, CEP: ${endereco.cep}, Complemento: ${endereco.complemento}
        <br />${endereco.principal ? "<strong>Principal</strong>" : "Secundário"} 
        <div class="d-flex flex-row-reverse bd-highlight mt-0">
            <a data-id=${auxiliar} type='button' class='btn btn-danger btn-sm' onclick="removeEnderecoClienteArray(event.target)" >
                Remover
            </a>
        </div>
    </div>
    `;

    $("#address-client").append(tr_str);
    auxiliar++;
}

const validaEnderecoPreenchido = () => {
    if (enderecos.length <= 0) {
        Toastify({
            text: "É obrigatório o prenchimento do endereço!",
            duration: 5000,
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            onClick: function () { } // Callback after click
        }).showToast();
        return false
    } else {
        //endereço preenchido retorna true
        return true
    }
}

const removeEnderecoClienteArray = (elementoClicado) => {
    let id = elementoClicado.getAttribute("data-id")

    //valida se é o endereco principal
    if (enderecos[id].principal) {
        Toastify({
            text: "Não pode remover o endereco principal!",
            duration: 5000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "center",
            stopOnFocus: true,
            style: {
                background: "#F44336",
            },
        }).showToast();
        return
    }

    enderecos = enderecos.filter(function (item) {
        return item.id != id;
    });

    elementos = document.querySelectorAll(`[data-id='${id}']`)
    elementos[0].parentNode.removeChild(elementos[0]);
}