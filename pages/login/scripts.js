const parametrosURL = new URLSearchParams(window.location.search);

$(document).ready(async function () {
    if (parametrosURL.get('desconectado')) toastPersonalizado("Desconectado com sucesso", "sucesso");
});

$("#valid-login").on('click', async (e) => {
    e.preventDefault()

    //adiociona animação de carregando no botão de entrar
    $("#valid-login").append("<span id='carregando' class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>");

    let email = document.getElementById("email").value
    let senha = document.getElementById("senha").value
    const response = await $.ajax({
        method: "GET",
        url: `../../api/usuario/index.php?funcao=logar&email=${email}&senha=${senha}`,
    });

    if (response.conectado) {
        //salvar em localStorage
        localStorage.setItem('usuario', response.usuario);
        window.location.href = "../cad_cliente/index.html?saudacao=true";

    } else {
        toastPersonalizado("Usuário e/ou senha incorreto", "erro")
        $("span").remove("#carregando");
    }
})

$("#salvar-novo-cadastro").on('click', async (e) => {
    e.preventDefault();

    let email = document.getElementById("novo-email").value;
    let senha1 = document.getElementById("novo-senha1").value;
    let senha2 = document.getElementById("novo-senha2").value;
    let nome = document.getElementById("novo-nome").value;

    if (validaSenha(senha1, senha2)) {

        const response = await $.ajax({
            method: "POST",
            url: "../../api/usuario/index.php",
            data: {
                funcao: "cadastrarUsuario",
                email: email,
                senha: senha1,
                nome: nome
            }
        });

        //cadastro com sucesso!
        if (response.cadastrado) {
            toastPersonalizado("Cadastro realizado com sucesso!", "sucesso")
            return
        }

        //caso email ja esteja cadastrado no banco de dados
        if (response.erro['errorInfo'][2].includes("Duplicate entry")) {
            toastPersonalizado("Email já cadastrado no sistema", "erro")
        }
    }
})

const validaSenha = (s1, s2) => {
    if (s1 != s2) {
        toastPersonalizado("As senhas não coincidem, por favor verifique!", "erro")

        document.getElementById("novo-senha1").value = '';
        document.getElementById("novo-senha2").value = '';
        document.getElementById("novo-senha1").focus();
        return false
    }
    return true
}
