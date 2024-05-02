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
const searchError = document.querySelector('[data-js="search__error"]');

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
      pagination.textContent = "";
      cardContainer.innerHTML = "Oooops! No users found 🥱";
      // cardContainer.style.color = "white";
      // nextButton.remove();
      // prevButton.remove();
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
