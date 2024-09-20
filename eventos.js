document.addEventListener('DOMContentLoaded', function () {
    const usernameDisplay = document.getElementById('usernameDisplay');
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        usernameDisplay.textContent = loggedInUser;
    }
    

    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', function () {
        localStorage.removeItem('loggedInUser');
        window.location.href = 'index.html';
    });

    


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
        localStorage.setItem('profileImage', newImage); 
    });

    const filterCategory = document.getElementById('filterCategory');
    const filterDate = document.getElementById('filterDate');
    const eventList = document.getElementById('eventList');

    const storedEvents = JSON.parse(localStorage.getItem('events')) || [];

    function renderEvents(events) {
        eventList.innerHTML = '';

        if (events.length === 0) {
            eventList.innerHTML = '<p>Nenhum evento encontrado.</p>';
            return;
        }

        events.forEach((event, index) => {
            const eventElement = document.createElement('div');
            eventElement.className = 'event';

            const isJoined = event.joinedUser.includes(loggedInUser);

            const isEventFull = event.joinedUser.length > 0;


            const message = event.joinedUser.length > 0
                ? `${event.joinedUser.join(', ')} se juntou à sessão.` 
                : 'Nenhum mestre se juntou a essa sessão.';


            if (isJoined) {
                eventElement.classList.add('agreed'); 
            }

            eventElement.innerHTML = `
                <h3>${event.name}</h3>
                <p>Data: ${event.date}</p>
                <p>Hora: ${event.time}</p>
                <p>Categoria: ${event.category}</p>
                <p>Criado por: ${event.createdBy}</p>
                <button class="agree-button" ${isJoined || isEventFull ? 'disabled' : ''}>Juntar-se</button>
                <button class="disagree-button" ${isJoined ? '' : 'disabled'}>Desjuntar-se</button>
                <span class="agree-count">${message}</span>
            `;

            const agreeButton = eventElement.querySelector('.agree-button');
            const disagreeButton = eventElement.querySelector('.disagree-button');
            const agreeCount = eventElement.querySelector('.agree-count');


            agreeButton.addEventListener('click', function () {
                if (!isJoined && !isEventFull) {  
                    event.agrees = 1;
                    event.joinedUser.push(loggedInUser);  
                    agreeCount.textContent = `${event.joinedUser.join(', ')} se juntou à sessão.`; 
                    eventElement.classList.add('agreed');  
                    agreeButton.disabled = true;
                    disagreeButton.disabled = false;

                    updateLocalStorage(event, index);  
                }
                renderEvents(storedEvents); 
            });


            disagreeButton.addEventListener('click', function () {
                if (isJoined) { 
                    event.agrees = 0;
                    event.joinedUser = event.joinedUser.filter(user => user !== loggedInUser); 
                    agreeCount.textContent = event.joinedUser.length > 0 
                        ? `${event.joinedUser.join(', ')} se juntou à sessão.`  
                        : 'Nenhum mestre se juntou a essa sessão.';
                    
                    if (event.joinedUser.length === 0) {
                        eventElement.classList.remove('agreed'); 
                        agreeButton.disabled = false;  
                    }
                    disagreeButton.disabled = true;

                    updateLocalStorage(event, index); 
                }
                renderEvents(storedEvents); 
            });

            eventList.appendChild(eventElement);
        });
    }

    
    function updateLocalStorage(event, index) {
        storedEvents[index] = event;
        localStorage.setItem('events', JSON.stringify(storedEvents));
    }

    renderEvents(storedEvents);

    filterCategory.addEventListener('change', function () {
        const category = filterCategory.value;
        const date = filterDate.value;

        const filteredEvents = storedEvents.filter(event => 
            (category === 'all' || event.category === category) &&
            (!date || event.date === date)
        );

        renderEvents(filteredEvents);
    });

    filterDate.addEventListener('change', function () {
        const category = filterCategory.value;
        const date = filterDate.value;

        const filteredEvents = storedEvents.filter(event => 
            (category === 'all' || event.category === category) &&
            (!date || event.date === date)
        );

        renderEvents(filteredEvents);
    });
});
