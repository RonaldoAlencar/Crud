var enderecos = []
var posicaoArray = 0;
const parametrosURL = new URLSearchParams(window.location.search);

//################################## funções ajax#################################
$(document).ready(async function () {
    let email = localStorage.getItem("usuario");
    if (parametrosURL.get("saudacao")) toastPersonalizado("Bem vindo", "sucesso");

    const { permissao } = await $.ajax({
        url: `../../api/usuario/index.php?funcao=verificaPermissao&email=${email}`,
        method: "get",
        dataType: "JSON"
    });

    if (permissao.cadastrar) {
        document.getElementById("cadastrar").style = "display: true";
        document.getElementById("novo-endereco").style = "display: true";
    }

    //libera acessos a usuarios se usuario conectado for adm
    if (permissao.adm) {
        $("#navbar-nav").append(`
            <a href="../list_usuarios/index.html" class="nav-item nav-link">Usuarios do sistema</a>
        `);
    }
    return
});

//validação dos dados preenchidos no form de cadastro de clientes
$("#form-cadastro-cliente").bootstrapValidator({
    fields: {
        nome: {
            validators: {
                notEmpty: {
                    message: "<small style='color: red;'>O nome é obrigatório!</small>"
                },
                stringLength: {
                    min: 3,
                    message: "<small style='color: red;'>A quantidade mínima de caracteres é 3!</small>"
                }
            },
        },
        cpf: {
            validators: {
                stringLength: {
                    min: 14,
                    message: "<small style='color: red;'>CPF inválido!</small>"
                },
                notEmpty: {
                    message: "<small style='color: red;'>O CPF é obrigatório!</small>"
                },
            }
        },
        email: {
            validators: {
                notEmpty: {
                    message: "<small style='color: red;'>O email é obrigatório!</small>"
                },
                emailAddress: {
                    message: "<small style='color: red;'>O email inserido não é válido</small>"
                }
            }
        },
        rg: {
            validators: {
                stringLength: {
                    min: 11,
                    message: "<small style='color: red;'>RG inválido!</small>"
                },
                notEmpty: {
                    message: "<small style='color: red;'>O RG é obrigatório!</small>"
                },
            }
        },
        telefone1: {
            validators: {
                stringLength: {
                    min: 14,
                    message: "<small style='color: red;'>Telefone inválido!</small>"
                },
                notEmpty: {
                    message: "<small style='color: red;'>O telefone1 é obrigatório!</small>"
                }
            }
        },
        'data-nasc': {
            validators: {
                stringLength: {
                    min: 10,
                    message: "<small style='color: red;'>Data de nascimento inválida</small>"
                },
                notEmpty: {
                    message: "<small style='color: red;'>A data de nascimento é obrigatória!</small>"
                },
            }
        },
    }
}).on('success.form.bv', async function (e) {
    //caso form esteja valido, valida prenchimento de endereço
    if (validaEnderecoPreenchido()) {
        const response = await $.ajax({
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
            }
        });
        console.log(response)
        if (response.erro && response.erro['errorInfo'][2].includes("Duplicate entry")) {
            toastPersonalizado("CPF inserido já possui cadastro no sistema!", "erro")
            return
        }

        //se cadastrado insere informação na tela
        if (response.cadastrado) {
            $('#mensagem-retorno').append(`
                 <div class="alert alert-success" id="info" role="alert">
                     Cadastrado com sucesso!
                 </div>  
             `);
             
            //Removendo a div de endereços
            var node = document.getElementById("endereco-cliente");
            if (node.parentNode) node.parentNode.removeChild(node);

            //limpa campos do formulário
            document.getElementById("form-cadastro-cliente").reset();
        } else {
            $('#mensagem-retorno').append(`
                 <div class="alert alert-danger" id="info" role="alert">
                     Erro ao realizar cadastro!
                 </div>  
             `);
        }

        //remove informação de sucesso/erro depois de 5 segundos
        setTimeout(() => {
            $("div").remove("#info");
        }, 5000);
    }
})

//validação dos dados preenchidos no modal de endereço
$("#form-endereco-cliente").bootstrapValidator({
    fields: {
        cep: {
            validators: {
                notEmpty: {
                    message: "<small style='color: red;'>O cep é obrigatório!</small>"
                },
                stringLength: {
                    min: 9,
                    message: "<small style='color: red;'>Cep inválido!</small>"
                }
            }
        },
        logradouro: {
            validators: {
                notEmpty: {
                    message: "<small style='color: red;'>O logradouro é obrigatório!</small>"
                },
                stringLength: {
                    min: 3,
                    message: "<small style='color: red;'>A quantidade mínima de caracteres é 3!</small>"
                }
            },
        },
        bairro: {
            validators: {
                notEmpty: {
                    message: "<small style='color: red;'>O bairro é obrigatório!</small>"
                },
                stringLength: {
                    min: 3,
                    message: "<small style='color: red;'>A quantidade mínima de caracteres é 3!</small>"
                }
            },
        },
        numero: {
            validators: {
                notEmpty: {
                    message: "<small style='color: red;'>Obrigatório!</small>"
                },
            },
        },
        cidade: {
            validators: {
                notEmpty: {
                    message: "<small style='color: red;'>A cidade é obrigatória!</small>"
                },
                stringLength: {
                    min: 3,
                    message: "<small style='color: red;'>A quantidade mínima de caracteres é 3!</small>"
                }
            },
        },
        uf: {
            validators: {
                notEmpty: {
                    message: "<small style='color: red;'>A uf é obrigatória!</small>"
                }
            },
        },
    }
}).on('success.form.bv', async function (e) {
    $('#modalEndereco').modal('hide');

    //salva endereço no array
    let logradouro = document.getElementById('logradouro').value;
    let localidade = document.getElementById('cidade').value;
    let uf = document.getElementById('uf').value;
    let bairro = document.getElementById('bairro').value;
    let numero = document.getElementById('numero').value;
    let complemento = document.getElementById('complemento')?.value;
    let cep = document.getElementById('cep').value;
    document.getElementById("form-endereco-cliente").reset();

    //adiciona no array para enviar osteriormente ao banco de dados
    enderecos.push({ id: posicaoArray, logradouro, localidade, uf, bairro, numero, complemento, cep, principal: posicaoArray == 0 ? 1 : 0 })
    //atualiza na tela com os dados
    atualizaEnderecoClienteTela({ id: posicaoArray, logradouro, localidade, uf, bairro, numero, complemento, cep, principal: posicaoArray == 0 ? 1 : 0 })
    posicaoArray++;
    //limpa campos do formulário
    return
})

//################################## funções js #################################
const validaEnderecoPreenchido = () => {
    if (enderecos.length <= 0) {
        toastPersonalizado("É obrigatório o preenchimento do endereço!", "erro")
        return false
    }
    return true
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

const atualizaEnderecoClienteTela = async (endereco) => {
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

    $("#endereco-cliente").append(tr_str);
}

const escondeModal = () => {
    $('#modalEndereco').modal('hide');
}