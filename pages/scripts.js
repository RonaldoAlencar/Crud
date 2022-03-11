$(document).ready(function () {
    if (!localStorage.getItem("usuario")) {
        window.location.href = "../login/index.html";
    }
})

const toastPersonalizado = (mensagem, tipo) => {
    let cor
    if(tipo == "sucesso") cor = "#00CC66"; //cor verde
    if(tipo == "erro")    cor = "#F44336"; //cor vermelha
    if(tipo == "aviso")   cor = "#E8DB0B"; //cor amarela

    Toastify({
        text: mensagem,
        duration: 5000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        style: {
            background: cor,
        },
    }).showToast();
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

                toastPersonalizado("Dados do endereço preenchidos!", "sucesso");
            })
            .catch(function (error) {
                toastPersonalizado("Erro ao consultar CEP!", "erro");
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

                toastPersonalizado("Dados do endereço preenchidos!", "sucesso");
            })
            .catch(function (error) {
                toastPersonalizado("Erro ao consultar CEP!", "erro");
            });
    }

}
