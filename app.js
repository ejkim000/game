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
            this.user.solved_quiz = (User.getCookie('solved_quiz')) ? User.getCookie('solved_quiz') : [];
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

    // create answer bubbles
    createAnswerBubble() {
        const bubble_body = document.getElementById('bubble_body');
        const user_answer = document.getElementById('a');
        const bubbles = [];
        const audio = new Audio('./sound/bubble-pop.wav');

        let answer_arr = this.answer.split('');

        // add some random letters : have to work on it
        
        answer_arr.push('Z');
        // answer_arr.push('T');
        // answer_arr.push('p');

        // shuffle array
        answer_arr = this.shuffleArray(answer_arr);

        for (let i = 0; i < answer_arr.length; i++) {
            // create bubbles
            bubbles[i] = document.createElement('div');
            bubbles[i].innerText = answer_arr[i];
            bubbles[i].classList.add('bubble', `b${i + 1}`);
            bubble_body.appendChild(bubbles[i]);

            // pop bubble on click event
            bubbles[i].addEventListener('click', e => {
                // pop the bubble : have to add the pop pciture
                bubbles[i].classList.add('pop');
                // after pop, let ithe bubble disappear in 0.1 sec
                setTimeout(function() { bubbles[i].classList.add('hide'); }, 100);
                audio.play(); // make 404 error : check this issue

                // add the popped alphabet in the answer area
                user_answer.innerText += answer_arr[i];

                // check the answer
                this.checkAnswer(user_answer.innerText);

            });
        }
    }

    checkAnswer(ans) {
        if (ans == "answer") {
            // save the answer to solved quiz : local storage

            // move on to the next question
        }
    }


    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    timer(timer, sec) {
        let myTimer = setInterval( ()=> {
                timer.innerText = --sec;
                if(sec <= 0) {
                    clearInterval(myTimer);
                    alert('Time Over');
                }
        }, 1000);
    }
}

/* game page */
if (document.getElementById('q')) {
    let u = new User();
    console.log(u.user);

    let q = new Quiz();
    console.log(q);

    // set timer
    q.timer(document.getElementById('timer'), 60);

    // show the quiz
    document.getElementById('q').innerText = q.quiz;
    q.createAnswerBubble();



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
