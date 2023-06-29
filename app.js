class User {
    constructor(user_name) {
        this.user = {
            'user_name': '',
            'solved_quiz': [],
            'skipped_quiz': [],
            'clear_time': 60,
            'clear_game': 0
        };

        // new user
        if (user_name) {
            this.user.user_name = user_name;
        } else {
            this.user.user_name = User.getCookie('user_name');
            this.user.solved_quiz = (User.getCookie('solved_quiz')) ? User.getCookie('solved_quiz').split(',') : [];
            this.user.skipped_quiz = (User.getCookie('skipped_quiz')) ? User.getCookie('skipped_quiz').split(',') : [];
            this.user.clear_time = User.getCookie('clear_time');
            this.user.clear_game = User.getCookie('clear_game');
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

    // get user's info from cookie
    static getCookie(str) {
        return document.cookie.split("; ").find((row) => row.startsWith(str)).split('=')[1];
    }

    // set user's info to cookie
    static setCookie(user) {
        document.cookie = `user_name=${user.user_name}`;
        document.cookie = `solved_quiz=${user.solved_quiz.join(',')}`;
        document.cookie = `skipped_quiz=${user.skipped_quiz.join(',')}`;
        document.cookie = `clear_time=${user.clear_time*1}`;
        document.cookie = `clear_game=${user.clear_game*1}`;

    }
}

class Quiz {
    constructor(user) {
        this.idx = this.getQuizIdx();

        /* when this.idx==0 (!this.idx) condition passes make sure not use this */
        // no more left over questions
        if (this.idx === null) {
            alert('no more quiz left');
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
        let total_quiz = QUIZZES.length;
        let solved_quiz_idxs = this.getSolvedQuiz();
        let skipped_quiz_idxs = this.getSkippedQuiz();
        let rnd_quiz_idx;
        let i = 0;


        // return quiz only when it's not solve or skipped quiz
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

    // get solved quiz from cookie and return as number array
    getSolvedQuiz() {
        if (!User.getCookie('solved_quiz')) {
            return [];
        } else {
            return User.getCookie('solved_quiz').split(',').map(Number);
        }
    }

    // get skipped quiz from cookie and return as number array
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
        const pop_audio = new Audio(window.location.origin + '/sound/bubble-pop.wav');
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

                // play pop sound
                pop_audio.play(); 

                // pop the bubble : have to add the pop pciture
                bubbles[i].classList.add('pop');

                // after pop, let ithe bubble disappear in 0.1 sec
                setTimeout(function () { bubbles[i].classList.add('hide'); }, 100);

                // add the popped alphabet in the answer area
                user_answer.innerText += answer_arr[i];

                // check the answer
                if (user_answer.innerText == this.answer) {
                    // save the answer to solved quiz : cookie
                    this.user.solved_quiz.push(this.idx);
                    this.user.clear_time = document.getElementById('timer').innerText;

                    if (this.user.solved_quiz.length >= 5) {
                        // clear game
                        this.user.clear_game = 1;
                        // update cookie
                        User.setCookie(this.user);
                        //show game over
                        this.showGameOver('You Won!');
                    } else {
                        // update cookie
                        User.setCookie(this.user);
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

    updateUserInfo(user_name) {
        // get all users saved in local storange
        let users = JSON.parse(localStorage.getItem('users'));

        users.forEach((u) => {
            // update current user's info
            if (u.user_name == user_name) {
                u.clear_time = User.getCookie('clear_time')*1;
                u.clear_game = User.getCookie('clear_game')*1;
                u.solved_quiz = (User.getCookie('solved_quiz')) ? User.getCookie('solved_quiz').split(',') : [];
                u.skipped_quiz = (User.getCookie('skipped_quiz')) ? User.getCookie('skipped_quiz').split(',') : [];
            }
        });

        // rank : desc clear_game, desc clear_time
        users.sort((a, b) => { 
            if (a.clear_game === b.clear_game){
                return b.clear_time * 1 - a.clear_time * 1 // desc
              } else {
                return b.clear_game * 1 - a.clear_game * 1 // desc
              }
        });

        // save updated users in the local storage
        localStorage.setItem('users', JSON.stringify(users));
    }

    showGameOver(str) {
        // stop timer
        clearInterval(this.myTimer);

        // update user info 
        this.updateUserInfo(this.user.user_name);

        // show user rank
        this.showUserRank();

        // make skip button non-clickable
        document.getElementById('skip').classList.add('no-click');
        
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

            // start over 
            location.reload();
        });
    }

    // show user rank who cleared the game upto rank 5
    showUserRank() {
        let users = JSON.parse(localStorage.getItem('users'));
        let user_rank_length = (users.length > 5) ? 5 : users.length;
        let li_element;

        // append each li element in the rank ul : for the clear game user
        for (let i = 0; i < user_rank_length; i++) {
            if (users[i].clear_game == 1) {
                li_element = document.createElement('li');
                li_element.innerHTML = `${i + 1}. ${users[i].user_name} <span>${users[i].clear_time}</span>`;
                document.getElementById('rank').appendChild(li_element);
            }
        }
    }
}

/* ***************************************************************** */

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


/* game page */
if (document.getElementById('q')) {

    async function createUser() {
        return new User();
    }
    createUser().then(
        (u) => {
            let q = new Quiz(u.user);

            // when there is a quiz index
            if (q.idx !== null) {
                // set timer
                q.timer(document.getElementById('timer'), u.user.clear_time);

                // show the quiz
                document.getElementById('q').innerText = q.quiz;
                q.createAnswerBubble(u);

                // skip onlick event
                document.getElementById('skip').addEventListener('click', e => {
                    e.preventDefault();
                    q.skip();
                });

            }
        }, () => { alert('Fail to load game') });

}