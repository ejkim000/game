# Bubble Pop Quiz
- EJ Kim

## Description
- Simple quiz game with fun of popping bubbles 
- Using HTML, CSS & JavaScript

## Game Rules
1. Answer 5 Questions in 1 Minute
2. To answer, have to pop the bubbles in the correct order of alphabet
3. Wong answer doesn't count
4. Click "Skip" button for the next question

## Classes
1. User
    - Save user's information in Cookie and localStorage
    - Check user name to prevent duplicated user name

2. Quiz
    - Questions are saved in data.js file 
    - Create total 10 alphabet bubbles inclue random alphabet bubble each question
    - When click a bubble, the bubble pops and come down to the answer area
    - If the answer matches, move on to the next question
    - rank only for the users who cleared the game
    - Game Over : didn't solve 5 questions in 1 minute
    - You Won! : did solve 5 questions in 1 minute

## Store Data
1. localStorage (All Users)
    - user_name: string
    - solved_quiz: array
    - skipped_quiz: array
    - clear_time: number, second of clear the game
    - clear_game: number, 0: didn't clear game / 1: cleared game

2. Cookie (Each User)
    - user_name: string
    - solved_quiz: array
    - skipped_quiz: array
    - clear_time: number, second of clear the game
    - clear_game: number, 0: didn't clear game / 1: cleared game


## Resources
1. CSS
    - Random movement
    https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timing-function
    - animation
    https://www.w3schools.com/css/tryit.asp?filename=trycss3_animation_speed
    - gradient
    https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/radial-gradient
    - animation examples
    https://blog.hubspot.com/website/css-animation-examples
    https://animate.style/
    - bubble style
    https://codepen.io/Mark_Bowley/pen/PozwyP
    

2. js
    - cookie
    https://www.w3schools.com/js/js_cookies.asp
    - suffle array
    https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    - double sort
    https://levelup.gitconnected.com/sort-array-of-objects-by-two-properties-in-javascript-69234fa6f474

3. Sound effect
    - sound
    https://mixkit.co/free-sound-effects/