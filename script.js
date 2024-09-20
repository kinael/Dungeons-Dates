document.addEventListener('DOMContentLoaded', function () {

    const usernameDisplay = document.getElementById('usernameDisplay');
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        usernameDisplay.textContent = loggedInUser;
    } else {
        console.error("Usuário não está logado.");
    }


    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', function () {
        localStorage.removeItem('loggedInUser'); 
        window.location.href = 'index.html'; 
    });

    const eventForm = document.getElementById('eventForm');
    const eventList = document.getElementById('eventList');
    const eventDate = document.getElementById('eventDate');


    const today = new Date().toISOString().split('T')[0];
    eventDate.setAttribute('min', today);
    eventDate.setAttribute('max', '2100-12-31');


    const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
    storedEvents.forEach(event => renderEvent(event));


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

        storedEvents.push(event);
        localStorage.setItem('events', JSON.stringify(storedEvents));

        renderEvent(event);
        eventForm.reset();
    });

    function renderEvent(event) {
        const eventElement = document.createElement('div');
        eventElement.className = 'event';
        eventElement.dataset.id = event.id; 

        const message = event.agrees > 0 
            ? `${event.joinedUser.join(', ')} se juntou à sessão.` 
            : 'Nenhum mestre se juntou a essa sessão.';

        eventElement.innerHTML = `
            <h3>${event.name}</h3>
            <p>Data: ${event.date}</p>
            <p>Hora: ${event.time}</p>
            <p>Categoria: ${event.category}</p>
            <p>Criado por: ${event.createdBy}</p>
            <button class="agree-button">Juntar-se</button>
            <button class="disagree-button" disabled>Desjuntar-se</button>
            <span class="agree-count">${message}</span>
        `;

        const currentUser = localStorage.getItem('loggedInUser');
        const agreeButton = eventElement.querySelector('.agree-button');
        const disagreeButton = eventElement.querySelector('.disagree-button');
        const agreeCount = eventElement.querySelector('.agree-count');


        if (event.joinedUser.includes(currentUser)) {
            agreeButton.disabled = true; 
            disagreeButton.disabled = false; 
            eventElement.classList.add('agreed'); 
        }

        agreeButton.addEventListener('click', function () {
            if (event.agrees === 0) {
                event.agrees++;
                event.joinedUser.push(currentUser); 
                agreeCount.textContent = `${event.joinedUser.join(', ')} se juntou à sessão.`;
                eventElement.classList.add('agreed'); 
                agreeButton.disabled = true; 
                disagreeButton.disabled = false; 
                updateEvent(event);
            }
        });

        disagreeButton.addEventListener('click', function () {
            if (event.agrees > 0) {
                event.agrees--;
                event.joinedUser = event.joinedUser.filter(user => user !== currentUser);
                agreeCount.textContent = event.agrees > 0 
                    ? `${event.joinedUser.join(', ')} se juntou à sessão.` 
                    : 'Nenhum mestre se juntou a essa sessão.';
                
                if (event.agrees === 0) {
                    eventElement.classList.remove('agreed'); 
                    agreeButton.disabled = false; 
                }
                disagreeButton.disabled = true; 
                updateEvent(event);
            }
        });

        eventList.insertBefore(eventElement, eventList.firstChild);
    }

    function updateEvent(event) {
        const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
        const updatedEvents = storedEvents.map(e => e.id === event.id ? event : e);
        localStorage.setItem('events', JSON.stringify(updatedEvents));
    }
});
