const elSelectBg = document.querySelector(".site-bg");
const elCountryList = document.querySelector(".country-list");
const elSearchInp = document.querySelector(".search-name-inp");
const elFilterRegion = document.querySelector(".filter-region");
const loader = document.getElementById("loader");

const modal = document.querySelector(".modal");
const modalBody = document.querySelector(".modal-body");
const closeModal = document.querySelector(".close");

const BASE_URL = "https://restcountries.com/v3.1";

let allCountries = [];
let favorites = JSON.parse(localStorage.getItem("fav")) || [];

/* THEME */
elSelectBg.addEventListener("change", (e) => {
  if (e.target.value === "black") {
    document.body.classList.add("black-mode");
  } else {
    document.body.classList.remove("black-mode");
  }
});

/* FETCH */
async function getCountries() {
  loader.classList.remove("hidden");

  const res = await fetch(`${BASE_URL}/all?fields=name,flags,population,capital,region`);
  const data = await res.json();

  allCountries = data;
  render(data);

  loader.classList.add("hidden");
}
getCountries();

/* RENDER */
function render(data) {
  elCountryList.innerHTML = "";

  data.forEach(country => {
    const isFav = favorites.includes(country.name.common);

    elCountryList.innerHTML += `
      <li class="country" onclick="openModal('${country.name.common}')">
        <img src="${country.flags.png}">
        <h3>${country.name.common}</h3>
        <p>${country.region}</p>

        <span class="like" onclick="toggleFav(event,'${country.name.common}')">
          ${isFav ? "❤️" : "🤍"}
        </span>
      </li>
    `;
  });
}

/* SEARCH */
elSearchInp.addEventListener("input", () => {
  const value = elSearchInp.value.toLowerCase();

  const filtered = allCountries.filter(c =>
    c.name.common.toLowerCase().includes(value)
  );

  render(filtered);
});

/* FILTER */
elFilterRegion.addEventListener("change", () => {
  if (elFilterRegion.value === "all") return render(allCountries);

  const filtered = allCountries.filter(c =>
    c.region.toLowerCase() === elFilterRegion.value
  );

  render(filtered);
});

/* FAVORITES */
function toggleFav(e, name) {
  e.stopPropagation();

  if (favorites.includes(name)) {
    favorites = favorites.filter(f => f !== name);
  } else {
    favorites.push(name);
  }

  localStorage.setItem("fav", JSON.stringify(favorites));
  render(allCountries);
}

/* MODAL */
function openModal(name) {
  const country = allCountries.find(c => c.name.common === name);

  modalBody.innerHTML = `
    <h2>${country.name.common}</h2>
    <img src="${country.flags.png}" width="100%">
    <p>Population: ${country.population}</p>
    <p>Region: ${country.region}</p>
    <p>Capital: ${country.capital}</p>
  `;

  modal.classList.remove("hidden");
}

closeModal.onclick = () => modal.classList.add("hidden");