class User {
    constructor(user_name) {
        this.user = {
            'user_name': '',
            'solved_quiz': [],
            'clear_time': 0,
            'rank': 0
        };
        
        // new user
        if (user_name) {
            this.user.user_name = user_name;
        } else {
            this.user.user_name = User.getCookie('user_name');
            this.user.solved_quiz = (User.getCookie('solved_quiz'))? User.getCookie('solved_quiz') : [] ;
            this.user.clear_time = User.getCookie('clear_time');
            this.user.rank = User.getCookie('rank');
        }

        this.users = (localStorage.getItem('users')) ? JSON.parse(localStorage.getItem('users')) : [];
    }

    // Check user's name before game start
    checkUser = () => {
        // get users' name
        let names = [];
        if (this.users) {
            this.users.forEach(u => {
                names.push(u.user_name);
            });
        }

        // check user name is already taken or not
        if (names.length > 0 && names.includes(this.user.user_name)) {
            document.getElementById('msg').innerText = `"${this.user.user_name}" is already taken. Please enter other name.`;
            return;
        } else {
            // add user to local storage
            this.users.push(this.user);
            localStorage.setItem('users', JSON.stringify(this.users));

            // save user's info in the cookie
            User.setCookie(this.user);
        }
        // redirect to the game page
        location.href = './game.html';
    }

    updateUser() {



    }

    // get user's info from cookie
    static getCookie(str) {
        return document.cookie.split("; ").find((row) => row.startsWith(str)).split('=')[1];
    }

    // set user's info to cookie
    static setCookie(user) {
        document.cookie = `user_name=${user.user_name}`;
        document.cookie = `solved_quiz=${user.solved_quiz.join(',')}`; 
        document.cookie = `clear_time=${user.clear_time}`;
        document.cookie = `rank=${user.rank}`;

    }
}

class Quiz {
    constructor(idx, user) {
        this.idx = (idx) ? idx : this.getQuizIdx();
        this.quiz = quizzes[this.idx].q;
        this.answer = quizzes[this.idx].a;
    }

    // get random quiz index
    getQuizIdx() {

        // check it's solved quiz or not
        let total_quiz = quizzes.length;
        let solved_quiz_idxs = this.getSolvedQuiz();
        let rnd_quiz_idx;

        while (true) {
            rnd_quiz_idx = Math.floor(Math.random() * total_quiz);
            if (!solved_quiz_idxs.includes(rnd_quiz_idx)) {
                break;
            }
        }

        return rnd_quiz_idx;
    }

    // get solved quiz from cookie and return as array
    getSolvedQuiz() {
        if (!User.getCookie('solved_quiz')) {
            return [];
        } else {
            return User.getCookie('solved_quiz').split(',');
        }        
    }
}

/* game page */
if (document.getElementById('q')) {
    let u = new User();
    console.log(u.user);
    let q = new Quiz();
    document.getElementById('q').innerText = q.quiz;
}


/* index page */
if (document.getElementById("start_btn")) {

    // Check user's name before start the game
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
