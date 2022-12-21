document.addEventListener("DOMContentLoaded", () => {
    //get our stuff
    let movieList = document.querySelector("#movie-list")
    let movieTitle = document.querySelector("#title")
    let movieYear = document.querySelector("#year-released")
    let movieDescription = document.querySelector("#description")
    let movieWatched = document.querySelector("#watched") 
    let movieBloodAmount = document.querySelector("#amount")
    let movieDetailImage = document.querySelector("#detail-image")
    let currentWatched = false;
    let myCurrentID = 0;

    fetch(`http://localhost:3000/movies`)
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            let myImage = document.createElement('img')
            myImage.setAttribute('src', element.image)
            
            myImage.addEventListener('click', (myEvent) => {
                myCurrentID = element.id;
                movieDetailImage.setAttribute('src', element.image)
                movieTitle.innerHTML = element.title;
                movieYear.innerHTML = element.release_year;
                movieDescription.innerHTML = element.description;
                movieBloodAmount.innerHTML = element.blood_amount;
                currentWatched = element.watched;
                fetch(`http://localhost:3000/movies/${element.id}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data.watched);
                })
            });
            movieList.append(myImage)
        })
        //processes first movie
        myCurrentID = 1;
        movieDetailImage.setAttribute('src', data[0].image)
        movieTitle.innerHTML = data[0].title;
        movieYear.innerHTML = data[0].release_year;
        movieDescription.innerHTML = data[0].description;
        movieBloodAmount.innerHTML = data[0].blood_amount;
        if (data[0].watched == false){
            movieWatched.innerHTML = 'Unwatched';
            currentWatched = data[0].watched;
        }else {
            movieWatched.innerHTML = 'Watched';
            currentWatched = data[0].watched;
        }
    })

    movieWatched.addEventListener('click', (e) => {
        //Change watched status and change watched button text
        if (currentWatched == true) {
            currentWatched = false;
            movieWatched.innerHTML = 'UNWATCHED'
        }else if (currentWatched == false) {
            currentWatched = true;
            movieWatched.innerHTML = 'WATCHED'
        }
        
        //tell server what watched status is
        fetch(`http://localhost:3000/movies/${myCurrentID}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                watched: currentWatched
            })
        })
    })

});