import { Notify } from 'notiflix/build/notiflix-notify-aio';

const urlEndpoint = 'https://restcountries.com/v3.1/name/';

export async function fetchCountries(name) {
  const url = new URL(name, urlEndpoint);
  url.searchParams.set('fields', 'name,capital,population,flags,languages');

  const response = await fetch(url);

  if (!response.ok) {
    Notify.failure('Oops, there is no country with that name', {
      timeout: 1500,
    });
    return Promise.reject('Error 404(Not found)');
  }

  return await response.json();
}
