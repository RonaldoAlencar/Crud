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
