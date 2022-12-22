//wait for DOM to Load (not sure I really need this one this time)
document.addEventListener("DOMContentLoaded", () => {

    const url = 'http://localhost:3000/movies'
    let movieArray                              // *** Super Important to have this in global scope ***
    let currentMovie                           // *** Super Important to have this in global scope ***

    //Gather our minions
    const movieList = document.querySelector('#movie-list')
    const mainMovieImage = document.querySelector('#detail-image')
    const mainMovieTitle = document.querySelector('#title')
    const mainMovieYear = document.querySelector('#year-released')
    const mainMovieDescription = document.querySelector('#description')
    const watchStatusButton = document.querySelector('#watched')
    const mainMovieBlood = document.querySelector('#amount')
    const bloodForm = document.querySelector('#blood-form')
    const myInput = document.querySelector('#blood-amount');

    //Fetch all data from server
    function getAllData() {
        fetch(url)
        .then((response) => response.json())
        .then((data) => {
            movieArray = data;
            movieArray.map((movie) => {
                addImageToNav(movie)
            })       
            setUpMainDisplay(movieArray[0]) //sets up original display
        })
    }
    getAllData();

    //Adds images to top nav bar
    const addImageToNav = (movie) => {
        const movieImage = document.createElement('img');
        movieImage.src = movie.image;
        movieImage.alt = movie.title;
        movieImage.addEventListener('click', () => posterClicked(movie)) //This is Key - It passes in the movie object that it recieved from getAllData()
        movieList.append(movieImage)
    }
    //When movie poster is clicked
    function posterClicked(movie) {
        setUpMainDisplay(movie)
    }

    //Sets up main display for use
    function setUpMainDisplay(movie) {
        mainMovieImage.src = movie.image;
        mainMovieTitle.innerHTML = movie.title
        mainMovieYear.innerHTML = movie.year
        mainMovieDescription.innerHTML = movie.description
        mainMovieBlood.innerHTML = movie.blood_amount
        
        watchStatusButton.innerHTML = (movie.watched ? "Watched" : "Unwatched")
        currentMovie = movie;
    }
    
    // Adds event listener to my watch/unwatch button
    watchStatusButton.addEventListener('click', () => {
        clickedWatchButton(currentMovie)
    })
    // Adds function to my watch/unwatch button
    function clickedWatchButton(movie) {
        movie.watched = !movie.watched //This changes it from true to false and vice versa
        watchStatusButton.innerHTML = (movie.watched ? "Watched" : "Unwatched") //This changes the Dom
        //need Fetch to PATCH
        fetch(`${url}/${movie.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(movie)
        })
        // .then(response => response.json()) //These are just to check my work
        // .then(movie => console.log(movie))
    }

    // Time to deal with the Blood amount
    bloodForm.addEventListener('submit', (e) => {
        e.preventDefault();
        bloodFormClicked(currentMovie);
    })
    function bloodFormClicked(movie) {
        let myFinalNumber = parseInt(myInput.value) + parseInt(mainMovieBlood.innerHTML); // Adds numbers together
        mainMovieBlood.innerHTML = myFinalNumber;
        movie.blood_amount = myFinalNumber; 
        fetch(`${url}/${movie.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({blood_amount: myFinalNumber})
        })
        .then(response => response.json())
        .then(movie => console.log("after ", movie.blood_amount))
    }
});