const parametrosURL = new URLSearchParams(window.location.search);
const idCliente = parametrosURL.get("id");
const email = localStorage.getItem("usuario")
var idEnderecoClicado;

//no carregar da tela, alimenta os input com os dados do banco de dados
$(document).ready(async function () {

    //exibições de toasts pelo redirecionamento da rota
    if (parametrosURL.get("sucesso")) toastPersonalizado("Cadastro atualizado com sucesso", "sucesso");
    if (parametrosURL.get("sucessoAtualizaEndereco")) toastPersonalizado("Endereço atualizado com sucesso", "sucesso");
    if (parametrosURL.get("sucessoRemoveEndereco")) toastPersonalizado("Endereço removido com sucesso", "sucesso");

    const response = await $.ajax({
        url: `../../api/cliente/index.php?funcao=clientePorId&id=${idCliente}`,
        method: "GET", //
        dataType: "JSON"
    });

    document.getElementById("nome").value = response[0]['nome'];
    document.getElementById("cpf").value = response[0]['cpf'];
    document.getElementById("rg").value = response[0]['rg'];
    document.getElementById("email").value = response[0]['email'];
    document.getElementById("telefone1").value = response[0]['telefone1'];
    document.getElementById("telefone2").value = response[0]['telefone2'];
    document.getElementById("cpf").value = response[0]['cpf'];
    document.getElementById("data_nascimento").value = response[0]['data_nascimento'];

    //alimenta endereços do cliente
    atualizaEnderecoTela(response)
});

//atualiza ativo do endereço do cliente do banco de dados
$("#removerEnderecoCliente").on("click", async (e) => {

    const response = await $.ajax({
        url: "../../api/endereco/index.php",
        type: "PUT",
        dataType: "JSON",
        data: {
            funcao: "atualizarAtivoEnderecoCliente",
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
$("#form-atualiza-edit-cliente").bootstrapValidator({
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
})

$("#form-novo-endereco-edit-cliente").bootstrapValidator({
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
    let logradouro = document.getElementById("logradouro").value;
    let localidade = document.getElementById("cidade").value;
    let uf = document.getElementById("uf").value;
    let bairro = document.getElementById("bairro").value;
    let numero = document.getElementById("numero").value;
    let complemento = document.getElementById("complemento")?.value;
    let cep = document.getElementById("cep").value;

    const response = await $.ajax({
        method: "POST",
        url: "../../api/endereco/index.php",
        data: {
            funcao: "cadastrarNovoEndereco",
            logradouro,
            localidade,
            uf,
            bairro,
            numero,
            complemento,
            cep,
            idCliente,
            principal: 0
        }
    })

    if (response.cadastrado) {
        window.location = `?sucesso=true&id=${idCliente}`;
    } else {
        window.location = `?sucesso=false&id=${idCliente}`;
    }
})

$("#form-altera-endereco-edit-cliente").bootstrapValidator({
    fields: {
        cep_alterar: {
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
        logradouro_alterar: {
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
        bairro_alterar: {
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
        numero_alterar: {
            validators: {
                notEmpty: {
                    message: "<small style='color: red;'>Obrigatório!</small>"
                },
            },
        },
        cidade_alterar: {
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
        uf_alterar: {
            validators: {
                notEmpty: {
                    message: "<small style='color: red;'>A uf é obrigatória!</small>"
                }
            },
        },
    }
}).on('success.form.bv', async function (e) {
    const response = await $.ajax({
        url: "../../api/endereco/index.php",
        type: "PUT",
        dataType: "JSON",
        data: {
            funcao: "atualizaEndereco",
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
const atualizaEnderecoTela = async (enderecos) => {
    //valida permissoes para exibição de botões
    const permissao = await verificaPermissao();

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
                <a ${permissao.excluir ? '' : 'hidden'} type='button' id='btn-delete' class='btn btn-danger btn-sm' onclick='removeEnderecoCliente(event.target, ${principal})'>
                    Remover
                </a>
                <a ${permissao.editar ? '' : 'hidden'} type='button' id='btn-edit' class='btn btn-info btn-sm' onclick='alteraEndCliente(${JSON.stringify(enderecos[1][i])})' data-bs-toggle='modal' data-bs-target='#alteraEnderecoModal'>
                    Editar
                </a>
            </div>
        </div>
        `;

        //adiciona no html
        $("#address-client").append(tr_str);
    }
}

//seleciona o id do endereço do cliente a ser apagado apos confirmação
const removeEnderecoCliente = async (elementoClicado, principal) => {
    if (principal) {
        toastPersonalizado("Não pode remover o endereço principal", "erro")
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
    const { permissao } = await $.ajax({
        url: `../../api/usuario/index.php?funcao=verificaPermissao&email=${email}`,
        method: "GET",
        dataType: "JSON"
    });

    return permissao;
}