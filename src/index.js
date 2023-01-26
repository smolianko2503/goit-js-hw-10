import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

searchBox.addEventListener('input', debounce(onSearchCuontry, DEBOUNCE_DELAY));

function onSearchCuontry() {
  const inputCountry = searchBox.value.trim();
  if (inputCountry === '') {
    resetCountry();
    resetInfo();
    Notiflix.Notify.info('Enter the name of the country');
  } else {
     fetchCountries(inputCountry)
    .then(response => {
      if (!response.ok) {
        resetCountry();
        resetInfo();
        Notiflix.Notify.failure('Oops, there is no country with that name');
      }
      return response.json();
    })
    .then(countries => createMarkup(countries))
    .catch(error => console.log(error));
  }
};

function resetCountry() {
  countryList.innerHTML = '';
};

function resetInfo() {
  countryInfo.innerHTML = '';
};

function createMarkup(countries) {
  if (countries.length > 10) {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (countries.length >= 2 && countries.length < 10) {
    resetCountry();
    resetInfo();

    countryList.innerHTML = countries
      .map(
        ({ flags, name }) =>
      `<li class="item"><img class="img"
      src="${flags.svg}"
      alt="${name.official}">
      <p>${name.official}</p>
      </li>`
      )
      .join('');
  } else if (countries.length === 1) {
    resetCountry();
    resetInfo();
    countryInfo.innerHTML = countries
      .map(
        ({ flags, name, capital, population, languages }) =>
          `
        <img src="${flags.svg}" alt="${
            name.official
          }" width="60">
        <h1>${name.official}</h1>
        <p>Capital: ${capital}</p>
        <p>Population: ${population} humans</p>
        <p>Languages: ${Object.values(languages)}</p>`
      )
      .join('');
    console.log(countries);
  }
};
