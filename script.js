document.addEventListener('DOMContentLoaded', function () {

    // Exibir o nome do usuário logado
    const usernameDisplay = document.getElementById('usernameDisplay');
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        usernameDisplay.textContent = loggedInUser;
    } else {
        console.error("Usuário não está logado.");
    }

    // Função de logout
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', function () {
        localStorage.removeItem('loggedInUser'); // Remover o usuário logado do localStorage
        window.location.href = 'index.html'; // Redirecionar para a página de login
    });

    // Alterar a imagem de perfil ao clicar
    const profileImage = document.getElementById('profileImage');
    const imageOptions = [
        "https://store-images.s-microsoft.com/image/apps.12468.13510798887966465.7d1db64d-e502-4431-8f30-dcf821216451.5df34879-cef6-4c4f-bd38-e5f0f453d57a", 
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR62C0hNMP5MebR6qVKrGZmWCay5HbjwdBE-w&s", 
        "https://png.pngtree.com/png-clipart/20200224/original/pngtree-battle-axe-icon-cartoon-style-png-image_5227522.jpg"
    ];

    let currentImageIndex = 0;

    const storedProfileImage = localStorage.getItem('profileImage');
    if (storedProfileImage) {
        profileImage.src = storedProfileImage;
    }

    profileImage.addEventListener('click', function () {
        currentImageIndex = (currentImageIndex + 1) % imageOptions.length;
        const newImage = imageOptions[currentImageIndex];
        profileImage.src = newImage;
        localStorage.setItem('profileImage', newImage); // Salvar a nova imagem no localStorage
    });

    // Formulário de criação de eventos
    const eventForm = document.getElementById('eventForm');
    const eventList = document.getElementById('eventList');
    const eventDate = document.getElementById('eventDate');

    // Definir data mínima e máxima para eventos
    const today = new Date().toISOString().split('T')[0];
    eventDate.setAttribute('min', today);
    eventDate.setAttribute('max', '2100-12-31');

    // Recuperar eventos armazenados no localStorage
    const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
    storedEvents.forEach(event => renderEvent(event));

    // Submissão do formulário de eventos
    eventForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const eventName = document.getElementById('eventName').value;
        const eventTime = document.getElementById('eventTime').value;
        const eventCategory = document.getElementById('eventCategory').value;

        const event = {
            id: Date.now(),
            name: eventName,
            date: eventDate.value,
            time: eventTime,
            category: eventCategory,
            createdBy: loggedInUser,
            agrees: 0,
            joinedUser: []
        };

        // Adicionar evento ao localStorage
        storedEvents.push(event);
        localStorage.setItem('events', JSON.stringify(storedEvents));

        // Renderizar o evento na página
        renderEvent(event);
        eventForm.reset(); // Resetar o formulário
    });

    // Função para renderizar eventos na página
    function renderEvent(event) {
        const eventElement = document.createElement('div');
        eventElement.className = 'event';
        eventElement.dataset.id = event.id;

        // Exibir mensagem dependendo se há um mestre no evento
        const message = event.agrees > 0
            ? `${event.joinedUser.join(', ')} se juntou à sessão.`
            : 'Nenhum mestre se juntou a essa sessão.';

        eventElement.innerHTML = `
            <h3>${event.name}</h3>
            <p>Data: ${event.date}</p>
            <p>Hora: ${event.time}</p>
            <p>Categoria: ${event.category}</p>
            <p>Criado por: ${event.createdBy}</p>
            <p>${message}</p>
        `;

        eventList.appendChild(eventElement);
    }
});
