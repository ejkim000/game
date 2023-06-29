class User {
    constructor(user_name) {
        this.user = {
            'user_name': '',
            'solved_quiz': [],
            'skipped_quiz': [],
            'clear_time': 60,
            'rank': 0
        };

        // new user
        if (user_name) {
            this.user.user_name = user_name;
        } else {
            this.user.user_name = User.getCookie('user_name');
            this.user.solved_quiz = (User.getCookie('solved_quiz')) ? User.getCookie('solved_quiz').split(',') : [];
            this.user.skipped_quiz = (User.getCookie('skipped_quiz')) ? User.getCookie('skipped_quiz').split(',') : [];
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

    updateUser(user, idx) {
        localStorage.setItem('user', JSON.stringify(user[idx]));
    }

    // get user's info from cookie
    static getCookie(str) {
        return document.cookie.split("; ").find((row) => row.startsWith(str)).split('=')[1];
    }

    // set user's info to cookie
    static setCookie(user) {
        document.cookie = `user_name=${user.user_name}`;
        document.cookie = `solved_quiz=${user.solved_quiz.join(',')}`;
        document.cookie = `skipped_quiz=${user.skipped_quiz.join(',')}`;
        document.cookie = `clear_time=${user.clear_time}`;
        document.cookie = `rank=${user.rank}`;

    }
}

class Quiz {
    constructor(user) {
        this.idx = this.getQuizIdx();
        // no more left over questions
        if (!this.idx) {
            this.showGameOver();
            return false;
        } else {
            this.quiz = QUIZZES[this.idx].q;
            this.answer = QUIZZES[this.idx].a;
            this.user = user;
            this.sec = (user.clear_time) ? user.clear_time : 60;
            this.skipped_quiz = this.getSkippedQuiz();
        }
    }

    // get random quiz index
    getQuizIdx() {
        // check it's solved quiz or not
        let total_quiz = QUIZZES.length;
        let solved_quiz_idxs = this.getSolvedQuiz();
        let skipped_quiz_idxs = this.getSkippedQuiz();
        let rnd_quiz_idx;
        let i = 0;

        while (i < total_quiz) {
            rnd_quiz_idx = Math.floor(Math.random() * total_quiz);

            if (!solved_quiz_idxs.includes(rnd_quiz_idx) && !skipped_quiz_idxs.includes(rnd_quiz_idx)) {
                return rnd_quiz_idx;
            }
            i++;
        }

        if (i == total_quiz) {
            return null;
        }
    }

    // get solved quiz from cookie and return as array
    getSolvedQuiz() {
        if (!User.getCookie('solved_quiz')) {
            return [];
        } else {
            return User.getCookie('solved_quiz').split(',').map(Number);
        }
    }

    // get skipped quiz from cookie and return as array
    getSkippedQuiz() {
        if (!User.getCookie('skipped_quiz')) {
            return [];
        } else {
            return User.getCookie('skipped_quiz').split(',').map(Number);
        }
    }

    // create answer bubbles
    createAnswerBubble() {
        const bubble_body = document.getElementById('bubble_body');
        const user_answer = document.getElementById('a');
        const bubbles = [];
        const audio = new Audio('./sound/bubble-pop.wav');
        let answer_arr = this.answer.split('');
        let answer_length = answer_arr.length;

        // add some random letters
        if (answer_length < 10) {
            // push random alphabets to make answer_arr.length 10
            for (let i = 0; i < 10 - answer_length; i++) {
                answer_arr.push(ALPHABET[Math.floor(Math.random() * 26)]);
            }
        }

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
                e.preventDefault();
                // pop the bubble : have to add the pop pciture
                bubbles[i].classList.add('pop');
                // after pop, let ithe bubble disappear in 0.1 sec
                setTimeout(function () { bubbles[i].classList.add('hide'); }, 100);
                //audio.play(); // make 404 error : check this issue

                // add the popped alphabet in the answer area
                user_answer.innerText += answer_arr[i];


                // check the answer
                if (user_answer.innerText == this.answer) {
                    // save the answer to solved quiz : cookie
                    this.user.solved_quiz.push(this.idx);
                    this.user.clear_time = document.getElementById('timer').innerText;

                    // update cookies
                    User.setCookie(this.user);

                    if (this.user.solved_quiz.length >= 5) {
                        //success
                        this.showGameOver('You Won!');

                    } else {
                        // move on to the next question
                        location.reload();
                    }

                }
            });
        }
    }

    skip() {
        // add this quiz to skipped quiz
        this.skipped_quiz.push(this.idx);
        this.user.skipped_quiz = this.skipped_quiz;
        this.user.clear_time = document.getElementById('timer').innerText;
        // save user's cookie
        User.setCookie(this.user);
        location.reload();
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
        this.myTimer = setInterval(() => {
            timer.innerText = --sec;
            if (sec <= 0) {
                clearInterval(this.myTimer);
                // show Game Over blovk when time over
                this.showGameOver();
            }
        }, 1000);
    }

    showGameOver(str) {
        // stop timer
        clearInterval(this.myTimer);
        // update localstorage user
        let all_users = JSON.parse(localStorage.getItem('users'));
        console.log(all_users);

        //this.rank();


        if (str) document.getElementById('game_over_title').innerText = str;
        let game_over = document.getElementById('game_over');
        let start_over = document.getElementById('start_over');
        game_over.classList.remove('hide');
        game_over.classList.add('show');

        start_over.addEventListener('click', e => {
            e.preventDefault();
            // reset solved_quiz and clear_time before start over
            this.user.solved_quiz = [];
            this.user.clear_time = 60;
            // update cookies
            User.setCookie(this.user);

            location.reload();
        });

    }

    rank() {
        let users = JSON.parse(localStorage.getItem('users'));
        console.log(users);
        // nested array DESC order
        users.sort((a,b) => {return b.clear_time - a.clear_time});

        console.log(users);
    }
}

/* game page */
if (document.getElementById('q')) {
    let u = new User();
    console.log(u.user);

    let q = new Quiz(u.user);
    console.log(q);

    q.rank();

    if (q.idx) {
        // set timer
        q.timer(document.getElementById('timer'), u.user.clear_time);

        // show the quiz
        document.getElementById('q').innerText = q.quiz;
        q.createAnswerBubble(u);

        // skip
        document.getElementById('skip').addEventListener('click', e => {
            e.preventDefault();
            q.skip();
        });

        
    }
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
