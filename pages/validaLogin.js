$(document).ready(function () {
    if (!localStorage.getItem("usuario")) {
        window.location.href = "../login/index.html";
    }
})