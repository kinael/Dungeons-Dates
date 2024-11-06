
const users = JSON.parse(localStorage.getItem('users')) || [];


const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const errorMessage = document.getElementById('error-message');
const clientLoginScreen = document.getElementById('clientLoginScreen');
const registerScreen = document.getElementById('registerScreen');
const goToRegisterBtn = document.getElementById('goToRegisterBtn');
const backToLoginBtn = document.getElementById('backToLoginBtn');


function showScreen(screenToShow, screenToHide) {
    screenToHide.classList.add('hidden');
    screenToShow.classList.remove('hidden');
}


loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;


    const user = users.find(user => user.username === username && user.password === password);

    if (user) {

        localStorage.setItem('loggedInUser', username);
        alert('Login realizado com sucesso!');

        window.location.href = 'principal.html'; 
    } else {
        errorMessage.textContent = 'Usuário ou senha incorretos!';
    }
});


registerForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;

    if (users.find(user => user.username === newUsername)) {
        alert('Usuário já existe!');
        return;
    }

    users.push({ username: newUsername, password: newPassword });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Usuário cadastrado com sucesso!');

    showScreen(clientLoginScreen, registerScreen);
});

goToRegisterBtn.addEventListener('click', () => {
    showScreen(registerScreen, clientLoginScreen);
});

backToLoginBtn.addEventListener('click', () => {
    showScreen(clientLoginScreen, registerScreen);
});

<script>
    function showInfo() {
        var infoText = document.getElementById("infoText");
        infoText.classList.toggle("show");
    }
</script>


function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();


window.addEventListener('resize', resizeCanvas);
