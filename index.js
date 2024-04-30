const cardContainer = document.querySelector('[data-js="card-container"]');
const searchBarContainer = document.querySelector(
  '[data-js="search-bar-container"]'
);
import { createCharacterCard } from "./components/card/card.js";
const searchBar = document.querySelector('[data-js="search-bar"]');
const navigation = document.querySelector('[data-js="navigation"]');
const prevButton = document.querySelector('[data-js="button-prev"]');
const nextButton = document.querySelector('[data-js="button-next"]');
const pagination = document.querySelector('[data-js="pagination"]');

let maxPage = 1;
let page = 1;
let searchQuery = "";
let lastPage = false;
const url = "https://rickandmortyapi.com/api/character";
let firstPage = 1;

const fetchCharacters = async (url) => {
  console.log(url);
  try {
    const response = await fetch(url);
    console.log("response", response);
    if (response.ok) {
      const { results, info } = await response.json();
      maxPage = info.pages;
      lastPage = info.next === null;
      console.log(info);
      console.log(results);
      const cards = results.map((result) => {
        const { image, name, status, type, episode } = result;
        return createCharacterCard(image, name, status, type, episode.length);
      });
      cardContainer.innerHTML = cards;
      pagination.textContent = `${page} / ${maxPage}`;
    } else if (response.status === 404) {
      cardContainer.innerHTML = "Oooops! No users found.";
    }
  } catch (err) {
    console.error(err);
  }
};
fetchCharacters(url);

nextButton.addEventListener("click", () => {
  if (!lastPage) {
    page++;
    fetchCharacters(`${url}?page=${page}&name=${searchQuery}`);
  }
});

prevButton.addEventListener("click", () => {
  if (page > 1) {
    page--;
    fetchCharacters(`${url}?page=${page}`);
  }
});

searchBar.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(searchBar);
  searchQuery = formData.get("query");
  page = 1;

  await fetchCharacters(`${url}?name=${searchQuery}`);
});

// -----------------
/* ### The Search Bar

Now we want even more functionality in our app. 
\\ We want to find individual characters by typing their name into the search bar.

- Create a 'submit' event listener on the search bar.
- Update the state variable `searchQuery` with the current text inside the search bar every time
  this event is triggered.
- Modify the fetch URL again by adding another url encoded attribute `name`: append
  `&name=<searchQuery>` to the url. If the search query is an empty string, it will be ignored by
  the API, so don't worry about that.
- Now trigger the function `fetchCharacters` whenever a submit event happens.

> 💡 You might run into some bugs at this point. Think about how the page and max page index might
> have to change when you start searching for only subsets of all characters. */
// ------------------------------------
