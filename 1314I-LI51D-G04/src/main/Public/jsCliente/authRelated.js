$(document).ready(function () {
    $('#loginForm, #navbarLoginForm').each(function() {
        $(this).validate({
                rules:{
                    username:{
                        required:true
                    },
                    password:{
                        required:true
                    }
                },
                messages:{
                    username:{
                        required:"Username is required"
                    },
                    password:{
                        required:"Password is required"
                    }
                }
            });
    });

    $('#navbarRegisterButton').on('click', function() {
        $('#navbarLoginForm').attr('action','/account/register');
    })

    $('#navbarLoginButton').on('click', function() {
        $('#navbarLoginForm').attr('action','/account/login');
    })

    $('#registerSubmitButton').on('click', function() {
        console.log("asd");
        $('#loginForm').attr('action','/account/register');
    })

    $('#loginSubmitButton').on('click', function() {
        $('#loginForm').attr('action','/account/login');
    })
});