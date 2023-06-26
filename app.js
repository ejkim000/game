class User {
    constructor(user_name) {
        this.user = {
            'user_name': '',
            'solved_quiz': [],
            'clear_time': 0,
            'rank': 0
        };

        if (user_name) {
            this.user.user_name = user_name;
        } else {
            this.user.user_name = User.getCookies('user_name');
            this.user.solved_quiz = User.getCookies('solved_quiz');
            this.user.clear_time = User.getCookies('clear_time');
            this.user.rank = User.getCookies('rank');
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

            // save user's name as cookie
            document.cookie = `user_name=${this.user.user_name}; `;
        }
        // redirect to the game page
        location.href = 'game.html';
    }

    updateUser() {



    }

    static getCookies(str) {
        return document.cookie.split("; ").find((row) => row.startsWith(str));
    }

    static setCookies(user) {
        document.cookie = `user_name=${user.user_name}; solved_quiz=${join(user.solved_quiz, ',')}; clear_time=${user.clear_time}; rank=${user.rank}`;
    }
}

class Quiz {
    constructor(idx, user) {
        this.idx = (idx) ? idx : this.getQuizIdx();
        this.q = quizzes[this.idx].q;
        this.a = quizzes[this.idx].a;
        console.log(this);
    }

    // get random quiz
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
        console.log(rnd_quiz_idx);

        return rnd_quiz_idx;
    }

    // get solved quiz from cookie and return as array
    getSolvedQuiz() {
        if (!User.getCookies('solved_quiz')) {
            return [];
        } else {
            return User.getCookies('solved_quiz').split(',');
        }        
    }
}

if (document.getElementById('q')) {
    let user = new User();

    user.solved_quiz;
    user.clear_time;
    user.rank;
    let q = new Quiz();
    document.getElementById('q').innerText = q.q;


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
