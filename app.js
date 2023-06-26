class User {
    constructor(user_name) {
        this.user_name = user_name;
        this.users = (localStorage.getItem('users')) ? JSON.parse(localStorage.getItem('users')) : [];
        this.user = {
            'name': this.user_name,
            'questions': [],
            'clear_time': 0,
            'rank': 0
        };
    }

    // Check user's name before game start
    checkUser = () => {
        // get users' name
        let names = [];
        if (this.users) {
            this.users.forEach(u => {
                names.push(u.name);
            });
        }

        // check the user name is already taken or not
        if (names.length > 0 && names.includes(this.user_name)) {
            document.getElementById('msg').innerText = `"${this.user_name}" is already taken. Please enter other name.`;
            return;
        } else {
            // add this user to local storage
            this.users.push(this.user);
            localStorage.setItem('users', JSON.stringify(this.users));
        }
        // redirect to the game page
        location.href = 'game.html';
    }
}


// Check user's name before start the game
if (document.getElementById("start_btn")) {
    const start_btn = document.getElementById("start_btn");

    // when click Start button
    start_btn.addEventListener('click', e => {
        e.preventDefault();

        // check user input the name or not
        const user_name = document.getElementById('user_name').value;

        if (!user_name) {
            document.getElementById('msg').innerText = 'Please enter your name.';
            return;
        }

        // check existing user
        let user = new User(user_name);
        user.checkUser();
    });
}

