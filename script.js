let movieGenre = "popular";
let loadedMovie = [];
let likedMovie = [];
let pageNumber = 1;
let totalPageNumber = 10;
let movieDetail = {};

const movieGenreSelector = document.querySelector("#moviesGenre");
const pagePrev = document.querySelector(".page-button-prev");
const pageNext = document.querySelector(".page-button-next");
const homeTab = document.querySelector("#home");
const likedListTab = document.querySelector("#liked-list");
const selectorContainer = document.querySelector(".selectorContainer");

const createCard = (movie) => {
    const div = document.createElement('div');
    div.className = "movie";
    div.innerHTML = `
    <img class="movie_img" src="https://image.tmdb.org/t/p/w300/${movie.poster_path}" alt = "movie poster"/>
    <div class="movie_data">
        <h3 name = "${movie.id}" class="movie_title" >${movie.title} </h3>
      <div class="flex-container">
        <div class="rating">
         <i class="ion-star"></i>
         <h3 class="movie_rating">${movie.vote_average}</h3>
        </div>
        <i id = "${movie.id}"  class="heartIcon ion-ios-heart-outline" onclick = "heartIconOnClick(this)"></i>
      </div>
    </div>
      `;
    return div;
};

const createModal = (detail) => {
    const div = document.createElement('div');
    div.className = "modal-container";
    div.innerHTML = `
    
        <div class = "close-modal">x</div>
        <div class = "modal-content">
            <div class = "modal-img">
                <img src="https://image.tmdb.org/t/p/w300/${detail.poster_path}" alt="movie poster">
            </div>
            <div class = "modal-info">
                <h3 class = "modal-movietitle">${detail.title}</h3>
                <h4 class = "modal-overview">Overview</h4>
                <p class = "overview">${detail.overview}</p>
                <h4 class = "genre">Genre</h4>
                <div>
                <span class = "genre-span">${detail.genres[0].name}</span>
                <span class = "genre-span">${detail.genres[1].name}</span>
                </div>
                <h4 class = "rating">Rating</h4>
                <p>${detail.vote_average}</p>
                <h4 >Production companies</h4>
                <div>
                <img class = "company-img" src="https://image.tmdb.org/t/p/w300/${detail.production_companies[0].logo_path}" alt="company logo">
                </div>
            </div>
        </div>
    `;
    return div;
}

const renderDetailModal = () => {
    const modal = createModal(movieDetail);
    const modalDiv = document.querySelector("#modal");
    modalDiv.style.display = "flex";
    modalDiv.append(modal);
    document.querySelector(".close-modal").addEventListener('click', (e) => {
        modalDiv.innerHTML = '';
        modalDiv.style.display = "none";
    })
}

const renderView = () => {
    if (likedListTab.className === "tab-view active") {
        selectorContainer.style.visibility = "hidden";
    } else {
        selectorContainer.style.visibility = "visible";
    };
    const movieContainer = document.querySelector(".movie-container");
    movieContainer.innerHTML = "";
    if (likedListTab.className === "tab-view active") {
        likedMovie.forEach((movie) => {
            const card = createCard(movie);
            movieContainer.append(card);
            likedMovie.forEach((liked) => {
                if (liked.id === movie.id) {
                    document.querySelector(`[id='${movie.id}']`).className = "heartIcon ion-ios-heart";
                }
            })
        });
    } else {
        loadedMovie.forEach((movie) => {
            const card = createCard(movie);
            movieContainer.append(card);
            likedMovie.forEach((liked) => {
                if (liked.id === movie.id) {
                    document.querySelector(`[id='${movie.id}']`).className = "heartIcon ion-ios-heart";
                }
            })
        });
    }
};

const loadMovie = (movieGenre, pageNumber) => {

    return fetch(`https://api.themoviedb.org/3/movie/${movieGenre}?api_key=6d573a7f79e65234b90fc1260ddfecfb&language=en-US&page=${pageNumber}`)
        .then(
            (resp) => {
                return resp.json();
            })
        .then((data) => {
            loadedMovie = data.results;
            totalPageNumber = data.total_pages;
            document.querySelector(".total-page-number").innerHTML = totalPageNumber;

            renderView();
            document.querySelector(".movie-container").addEventListener('click',(e)=>{
                const movieTitle = e.target.closest('.movie_title');
                movieId=movieTitle.getAttribute("name");
                loadMovieDetail(movieId);
            })
        });
}

const loadMovieDetail = (id) => {
    return fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=6d573a7f79e65234b90fc1260ddfecfb&language=en-US`)
        .then(
            (resp) => {
                return resp.json();
            })
        .then((data) => {
            movieDetail = data;
            console.log(movieDetail)
            renderDetailModal();
        });
}

const loadEvents = () => {
    loadMovie(movieGenre, pageNumber)
}

likedListTab.addEventListener('click', () => {
    likedListTab.className = "tab-view active";
    homeTab.className = "tab-view";
    renderView();
})

homeTab.addEventListener('click', () => {
    likedListTab.className = "tab-view";
    homeTab.className = "tab-view active";
    renderView();
})

pagePrev.addEventListener('click', () => {
    if (pageNumber > 1) {
        pageNumber--;
    } else {
        return
    }
    document.querySelector(".page-number").innerHTML = pageNumber;
    loadMovie(movieGenre, pageNumber);
});

pageNext.addEventListener('click', () => {
    if (pageNumber < totalPageNumber) {
        pageNumber++;
    } else {
        return
    }
    document.querySelector(".page-number").innerHTML = pageNumber;
    loadMovie(movieGenre, pageNumber);
})


movieGenreSelector.addEventListener('change', () => {
    movieGenre = movieGenreSelector.value;
    pageNumber = 1;
    document.querySelector(".page-number").innerHTML = pageNumber;
    loadMovie(movieGenre);
})


function heartIconOnClick(element) {
    if (element.className === "heartIcon ion-ios-heart-outline") {
        loadedMovie.map((movie) => {
            if (movie.id.toString() === element.id) {
                movie.isLike = true;
                likedMovie.push(movie);
                return movie
            }
        })
        renderView();
    } else {
        loadedMovie.map((movie) => {
            if (movie.id.toString() === element.id) {
                movie.isLike = false;
                return movie
            }
        });
        likedMovie = likedMovie.filter((movie) => {
            return (movie.id.toString() != element.id)
        });
        renderView();
    }
}


loadEvents();