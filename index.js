const elSelectBg = document.querySelector(".site-bg");
const elCountryList = document.querySelector(".country-list");
const elSearchInp = document.querySelector(".search-name-inp");
const elFilterRegion = document.querySelector(".filter-region");

const changeSiteColor = (color) => {
    if(color){
        if(color == "black"){
            window.localStorage.setItem("siteColor", "black")
            document.body.classList.add("black-mode")
        }else{
            document.body.classList.remove("black-mode")
            window.localStorage.setItem("siteColor", "white")
        }
        document.body.style.backgroundColor = color
    }
}

elSelectBg.addEventListener("change", () => {
    const siteColor = elSelectBg.value;
    if(siteColor == "black") changeSiteColor("black")
    if(siteColor == "white") changeSiteColor("white")
})

const siteColor = localStorage.getItem("siteColor");

changeSiteColor(siteColor);

const BASE_URL = "https://restcountries.com/v3.1";

async function getCountries(){
    try{
        const req = await fetch(`${BASE_URL}/all?fields=name,capital,currencies,population,flags`);
        const res = await req.json();
        handleRenderCountries(res);
    }catch(err){
        console.log(err)
    }
}

getCountries();

function handleRenderCountries(arr){
    elCountryList.innerHTML = null;
    for(let country of arr){
        elCountryList.innerHTML += `
        <li class="country">
            <img width="300" height="200" src="${country.flags.png}" alt="${country.flags.alt}">
            <h3>Name: ${country.name.common}</h3>
            <h3>Population: ${country.population}</h3>
            <h3>Capital: ${country.capital[0]}</h3>
        </li>
        `
    }
}

elSearchInp.addEventListener("change", async () => {
    const searchValue = elSearchInp.value;
    if(!searchValue) return confirm('Search value is empty !');
    const req = await fetch(`${BASE_URL}/name/${searchValue}`);
    const res = await req.json();
    handleRenderCountries(res)
})

elFilterRegion.addEventListener("change", async () => {
    const regionVal = elFilterRegion.value;
    if(regionVal == "all") return getCountries()
    const req = await fetch(`${BASE_URL}/region/${regionVal}`);
    const res = await req.json();
    handleRenderCountries(res)
})