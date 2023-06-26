const start_btn = document.getElementById("start_btn");
const users = JSON.parse(localStorage.getItem('users'));
const names = [];

// when click Start button
start_btn.addEventListener('click', e =>{
    e.preventDefault();

    // check user input the name
    // get names in the local storage
    if (users.length > 0) {
        users.forEach(user => names.push(user.name));
    }
    // check the name is already taken

    
    // save name in the local storage
    
    // redirect to the game page

});