//array de endereços do cliente
var enderecos = []
var posicaoArray = 0;

//################################## funções ajax#################################
//cadastra novo cliente
$("#btn-send").on("click", (e) => {
    e.preventDefault();

    //valida campos preenchidos e valida se tem endereço preenchido
    if (validaCampos() && validaEnderecoPreenchido()) {
        $.ajax({
            method: "POST",
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
    enderecos.push({ id: posicaoArray, logradouro, localidade, uf, bairro, numero, complemento, cep, principal: posicaoArray == 0 ? 1 : 0 })
    //atualiza na tela com os dados
    atualizaDadosTela({ id: posicaoArray, logradouro, localidade, uf, bairro, numero, complemento, cep, principal: posicaoArray == 0 ? 1 : 0 })
    posicaoArray++;
    return
})

$(document).ready(async function () {
    let email = localStorage.getItem("usuario");

    const { permissao } = await $.ajax({
        url: `../../api/usuario/index.php?funcao=verificaPermissao&email=${email}`,
        method: "get",
        dataType: "JSON"
    });

    if (permissao.cadastrar) {
        document.getElementById("btn-send").style = "display: true";
        document.getElementById("novo-endereco").style = "display: true";
    }
    //libera acessos a usuarios se usuario conectado for adm
    if (permissao.adm) {
        $("#nav-tabs").append(`
        <li class="nav-item">
            <a class="nav-link text-dark" href="../list_usuarios/index.html">Usuarios do sistema</a>
        </li>
        `);
    }
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
    if (enderecos[id]?.principal) {
        toastPersonalizado("Não pode remover o endereço principal", "erro");
    } else {
        enderecos = enderecos.filter(function (item) {
            return item.id != id;
        });

        elementos = document.querySelectorAll(`[data-id='${id}']`)
        elementos[0].parentNode.removeChild(elementos[0]);
    }
}

const atualizaDadosTela = async (endereco) => {
    console.log(endereco)
    //insere na tela endereço do endereco
    var tr_str = `
    <div id="address" name="address" class="p-2 mb-2" style="background-color: #fff" data-id=${endereco.id}>
        Rua: ${endereco.logradouro} N: ${endereco.numero}, Bairro: ${endereco.bairro}, Cidade: ${endereco.localidade} - ${endereco.uf}, CEP: ${endereco.cep}, Complemento: ${endereco.complemento}
        <br />${endereco.principal ? "<strong>Principal</strong>" : "Secundário"} 
        <div class="d-flex flex-row-reverse bd-highlight mt-0">
            <a data-id=${endereco.id} type='button' class='btn btn-danger btn-sm' onclick="removeEnderecoClienteArray(event.target)" >
                Remover
            </a>
        </div>
    </div>
    `;

    $("#address-client").append(tr_str);
}