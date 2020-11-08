const profileForm = document.profileForm;
var userName = profileForm.name;
var userLastName = profileForm.lastName;
var userAge = profileForm.age;
var userEmail = profileForm.email;
var userTelephone = profileForm.telephone;

user = {
    "name": "",
    "lastName": "",
    "age": "",
    "email": localStorage.getItem('email'),
    "telephone": ""
};

function showProfile() {
    if (localStorage.getItem('user')) {
        user = JSON.parse(localStorage.getItem('user'));
        userName.value = user.name;
        userLastName.value = user.lastName;
        userAge.value = user.age;
        userEmail.value = user.email;
        userTelephone.value = user.telephone;

    } else {
        userName.value = user.name;
        userLastName.value = user.lastName;
        userAge.value = user.age;
        userEmail.value = user.email;
        userTelephone.value = user.telephone;
    }
};

function saveChanges(){
    user.name = userName.value;
    user.lastName = userLastName.value;
    user.age = userAge.value;
    user.email = userEmail.value;
    user.telephone = userTelephone.value;
    localStorage.setItem('email', user.email);
    localStorage.setItem('user', JSON.stringify(user));
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    showProfile();

});