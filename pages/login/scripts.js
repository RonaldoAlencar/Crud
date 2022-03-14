const parametrosURL = new URLSearchParams(window.location.search);

$(document).ready(async function () {
    if (parametrosURL.get('desconectado')) toastPersonalizado("Desconectado com sucesso", "sucesso");
});

$("#valid-login").on('click', (e) => {
    e.preventDefault()

    $.ajax({
        method: 'post',
        url: '../../api/usuario/index.php',
        data: {
            funcao: 'logar',
            email: document.getElementById("email").value,
            senha: document.getElementById("senha").value
        },
        success: (data) => {
            if (data.conectado) {
                // Transformar o objeto em string e salvar em localStorage
                localStorage.setItem('usuario', data.usuario);

                toastPersonalizado("Bem vindo!", "sucesso")

                setTimeout(() => {
                    window.location.href = "../cad_cliente/index.html";
                }, 2000);
            } else {
                toastPersonalizado("Usuário e/ou senha incorreto", "erro")
            }
        },
        error: (data) => {
            console.log('erro');
            console.log(data)
        }
    });
})

$("#salvar-novo-cadastro").on('click', (e) => {
    e.preventDefault();

    let email = document.getElementById("novo-email").value;
    let senha1 = document.getElementById("novo-senha1").value;
    let senha2 = document.getElementById("novo-senha2").value;
    let nome = document.getElementById("novo-nome").value;

    if (validaSenha(senha1, senha2)) {

        $.ajax({
            method: 'post',
            url: '../../api/usuario/index.php',
            data: {
                funcao: 'cadastrarUsuario',
                email: email,
                senha: senha1,
                nome: nome
            },
            success: (data) => {
                console.log(data)

                //cadastro com sucesso!
                if (data.cadastrado) {
                    toastPersonalizado("Cadastro realizado com sucesso!", "sucesso")
                    return
                }

                //caso email ja esteja cadastrado no banco de dados
                if (data.erro['errorInfo'][2].includes("Duplicate entry")) {
                    toastPersonalizado("Email já cadastrado no sistema", "erro")
                }

            },
            error: (data) => {
                console.log(data)
            }
        });
    }
})

const validaSenha = (s1, s2) => {
    if (s1 != s2) {
        toastPersonalizado("As senhas não coincidem, por favor verifique!", "erro")

        document.getElementById("novo-senha1").value = '';
        document.getElementById("novo-senha1").focus();
        document.getElementById("novo-senha2").value = '';
        return false
    }
    return true
}
