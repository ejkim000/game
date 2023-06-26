class User {
    constructor(user_name) {
        this.user_name = user_name;


    }

    getUsers = () => {
        return JSON.parse(localStorage.getItem('users'));
    }

    static startGame = () => {

        const users = JSON.parse(localStorage.getItem('users'));
        let names = {};
        let user = {};

        // check user input the name
        const user_name = document.getElementById('user_name').value;

        if (!user_name) {
            alert('Please enter your name');
            return;
        }
        // get names in the local storage
        if (users && users.length > 0) {
            users.forEach(user => {
                names.push(user.name);
            });
        }
        // check the name is already taken 
        if (names.length > 0 && names.includes(user_name)) {
            alert('You name is already taken. Please enter other name');
            user_name = '';
            document.getElementById('name').focus;
            return;
        } else {
            // save user in the local storage
            user = {
                'name': user_name,
                'questions': [],
                'clear_time': 0,
                'rank': 0
            };

            localStorage.setItem('users', JSON.stringify(user));
        }

        // redirect to the game page
        location.href = 'game.html';
    }
}



if (document.getElementById("start_btn")) {
    const start_btn = document.getElementById("start_btn");

    // when click Start button
    start_btn.addEventListener('click', e => {
        e.preventDefault();

        User.startGame();
    });
}

