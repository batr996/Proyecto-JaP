//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {

    const loginform = document.getElementById("loginForm")

    loginform.onsubmit = function (e) {
        e.preventDefault();
        let userEmail = document.getElementById('inputEmail').value;
        localStorage.setItem('email', userEmail);
        window.location.href = './index.html';
    }
});