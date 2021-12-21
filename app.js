$(document).on('DOMContentLoaded', function () {
    const $loginForm = $('#login');
    const $registrationForm = $('#registration');

    var bouncingBall = anime({
        targets: '.ball',
        translateY: '50vh',
        duration: 300,
        loop: true,
        direction: 'alternate',
        easing: 'easeInCubic',
        scaleX: {
            value: 1.05,
            duration: 150,
            delay: 268
        }
    });

    UI.linkToLogin($loginForm, $registrationForm);

    UI.linkToRegistration($loginForm, $registrationForm);


    $registrationForm.on('submit', function (e) {

        if ($registrationForm.valid() && !userExist(e)) {
            Store.createUser()
            alert('Registration is sucessfull!!')
        }

        // $loginForm.removeClass('form--hidden');
        // $registrationForm.toggleClass('form--hidden');

    });

    $("#login").on("submit", function (e) {
        e.preventDefault();

        const username_email = $("input[name='login_username']").val()
        const password = $("input[name='login_password']").val()

        console.log(password)

        const users = Store.getUsers();

        const bool = compareUserData(users, username_email, password);

        if (bool) {
            $loginForm.toggleClass('form--hidden')
            Store.checkAdmin(username_email)
            $('.animated-snl').toggleClass('hide')
            $('.map-container').removeClass('hide')
            $('.ball').removeClass('hide')
        }



        //!!!
        return bool ? alert("Login is succesfully!") : alert("Please sign up!!!");
    });

    $('#newUser').on('submit', function (e) {
        e.preventDefault();

        if ($('#newUser').valid() && !userExist(e)) {

            const email = $('#newEmail').val();
            const username = $('#newUsername').val();
            const password = $('#newPassword').val();

            const id = Store.userCounts() + 1;

            const user = new User(id, username, email, password);

            UI.addUserToList(user)
            Store.newUser(user)

            $('#newEmail').val('')
            $('#newUsername').val('')
            $('#newPassword').val('')

            alert('User is successfully addded!!')
        }
    })

    function compareUserData(users, username, password) {
        return users.some(user => (user.email === username || user.username === username) && user.password === password);
    }

});


const $email = $('#signupEmail');
const $username = $('#signupUsername');

$email.on('input', userExist);
$username.on('input', userExist);

const $newEmail = $('#newEmail');
const $newUsername = $('#newUsername')

$newEmail.on('input', userExist);
$newUsername.on('input', userExist);

function userExist(e) {
    const users = Store.getUsers();
    let val = e.target.value;

    if (e.target.name === "email" && users.some(user => (user.email === val))) {
        alert("User's with this email exists")
        e.target.value = '';
    }
}

class UI {

    static linkToRegistration($loginForm, $registrationForm) {
        $('#linkCreateAccount').on('click', function (e) {
            e.preventDefault();
            $loginForm.toggleClass('form--hidden');
            $registrationForm.removeClass('form--hidden');
            
        });
    }

    static linkToLogin($loginForm, $registrationForm) {
        $('#linkLogin').on('click', function (e) {
            e.preventDefault();
            $loginForm.removeClass('form--hidden');
            $registrationForm.toggleClass('form--hidden');
        });
    }

    static displayUsers() {
        const users = Store.getUsers()

        users.forEach((user) => UI.addUserToList(user))
    }

    static addUserToList(user) {
        const tbody = document.querySelector('#tbody');

        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.username}</tvd>
        <td>${user.email}</td>
        <td>${user.password}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>`;

        tbody.appendChild(row);
    }

    static deleteUser(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }
}

class User {
    constructor(id, username, email, password) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
    }
}


class Store {
    static createUser() {
        const email = $('#signupEmail').val();
        const username = $('#signupUsername').val();
        const password = $('#password').val();


        const id = Store.userCounts() + 1;
        const user = new User(id, username, email, password);

        const users = Store.getUsers();
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
    }

    static newUser(user) {
        const users = Store.getUsers();
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
    }

    static checkAdmin(username__email) {
        if (username__email === "Admin007" || username__email === "admin@admin007.com") {
            alert("You're Admin")
            $('#newUser').removeClass('form--hidden')
            $('.list').removeClass('hide')

            UI.displayUsers()
        }
    }

    static createCurrentUser() {

    }

    static editUser() {

    }

    static deleteUser() {

    }

    static logOut() {

    }

    static removeUser(email) {
        const users = Store.getUsers();

        users.forEach((user, index) => {
            if (user.email === email) {
                users.splice(index, index + 1)
            }
        });

        localStorage.setItem('users', JSON.stringify(users));
    }

    static getUsers() {
        let users;
        if (localStorage.getItem("users") !== null) {
            users = JSON.parse(localStorage.getItem('users'));
        } else {
            users = [];
        }

        return users;
    }

    static userCounts() {
        if (localStorage.length === 0 || localStorage.getItem('users') === null) return 0;
        return JSON.parse(localStorage.getItem('users')).length;
    }
}

// Validation
$(function () {

    $.validator.addMethod("pwcheck",
        function (value, element) {
            return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(value);
        }, 'Your password must be at least 8 characters long and contain at least one number and one special character\'.'
    );


    $.validator.addMethod("check_user",
        function (value, element) {
            return /^[A-Za-z0-9]{4,}$/.test(value);
        }, "Don't use special characters and your username must be at least 4 characters"
    )

    // ^               // start of input 
    // (?=.*?[A-Z])    // Lookahead to make sure there is at least one upper case letter
    // (?=.*?[a-z])    // Lookahead to make sure there is at least one lower case letter
    // (?=.*?[0-9])    // Lookahead to make sure there is at least one number
    // [A-Za-z0-9]{6,} // Make sure there are at least 6 characters of [A-Za-z0-9] 
    // $               // end of input


    $('#registration').validate({
        rules: {
            username: {
                required: true,
                check_user: true
            },
            email: {
                required: true
            },
            password: {
                required: true,
                pwcheck: true,
                minlength: 8
            },
            password2: {
                required: true,
                equalTo: "#password"
            }
        },
        messages: {
            username: {
                required: 'Username is mandatory'
            },
            password: {
                required: 'Password is mandatory'
            },
            email: {
                required: 'Email is mandatory',
                email: 'Please enter a <em>valid</em> email address.'
            },
            password2: {
                required: "Please confirm your password"
            }
        }
    })

    $('#newUser').validate({
        rules: {
            username: {
                required: true,
                check_user: true
            },
            email: {
                required: true
            },
            password: {
                required: true,
                pwcheck: true,
                minlength: 8
            }
        },
        messages: {
            username: {
                required: 'Username is mandatory'
            },
            password: {
                required: 'Password is mandatory'
            },
            email: {
                required: 'Email is mandatory',
                email: 'Please enter a <em>valid</em> email address.'
            }
        }
    });

})

// Remove User
document.querySelector('#tbody').addEventListener('click', (e) => {
    // Remove user from UI
    UI.deleteUser(e.target);

    let res = e.target.parentElement.previousElementSibling.previousElementSibling.textContent;
    Store.removeUser(res)

    console.log(res);

    alert("User deleted")
});

$(document).ready(function () {
    $(".animated-snl__container").animate({
        transform: "rotate(360deg)"
    }, 5000, function() {
        $('.animated-snl__container img').animate({
            transform: "rotate(-360deg)"
        })
    })
});


