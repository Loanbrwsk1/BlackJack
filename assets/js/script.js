/*
@author : Loan BOROWSKI
@update : 27/04/26

JS for showing password and display the delete pop up confirmation
*/

const password_input = document.getElementById("password");
const confirm_password_input = document.getElementById("confirm-password");
const current_password_input = document.getElementById("current-passwd-input");
const confirm_delete = document.getElementById("confirm-delete");


function showPassword()
{
    password_input.type = password_input.type == "password" ? "text" : "password";
}

function showConfirmPassword()
{
    confirm_password_input.type = confirm_password_input.type == "password" ? "text" : "password";
}

function showCurrentPassword()
{
    current_password_input.type = current_password_input.type == "password" ? "text" : "password";
}

function DisplayDelete()
{
    confirm_delete.style.display = confirm_delete.style.display == "flex" ? "none" : "flex";
}