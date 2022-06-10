import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(event) {
  const searchQuery = event.target.value.trim();

  if (searchQuery === '') {
    clearResult();
    return;
  }
  fetchCountries(searchQuery)
    .then(array => {
      if (array.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.',
          { timeout: 1500 }
        );
        return;
      }
      if (array.length > 1) {
        renderCountryList(array);
        return;
      }
      renderCountryCard(array);
    })
    .catch(error => console.log(error));
}

function renderCountryList(array) {
  const markup = array
    .map(country => {
      return `
        <li class='country-list-item'>
            <div class="thumb"><img class='country-list-img' src='${country.flags.svg}' alt='A flag of ${country.name.common}'/></div>
            <p>${country.name.common}</p>
        </li>`;
    })
    .join('');
  clearResult();
  refs.countryList.innerHTML = markup;
}

function renderCountryCard(array) {
  const markup = array.map(country => {
    const languages = Object.values(country.languages).join(', ');
    return `
        <div class='country-card-title'>
            <div class="thumb"><img class='country-list-img' src='${country.flags.svg}' alt='A flag of ${country.name.common}'/></div>
            <p lass='country-card-name'>${country.name.common}</p>
        </div>
        <p><b>Capital: </b>${country.capital}</p>
        <p><b>Population: </b>${country.population}</p>
        <p><b>Languages: </b>${languages}</p>

        `;
  });

  clearResult();
  refs.countryInfo.innerHTML = markup;
}

function clearResult() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
