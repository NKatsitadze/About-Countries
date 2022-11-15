'use strict';

const btn = document.querySelector('.btn-country');
const myBtn = document.querySelector('.my-country')
const countriesContainer = document.querySelector('.countries');
const errBox = document.querySelector('.error');
const input = document.querySelector('.country-input')

////////////////////////////////////////////////////////////////
const renderError = function(msg) {
  errBox.innerText = msg;
  errBox.classList.remove('hidden');
  countriesContainer.style.opacity = 1;
}
////////////////////////////////////////////////////////////////

const renderCountry = function(data, className) {
  const html = `<article class="country ${className}">
  <img class="country__img" src="${data.flag}" />
  <div class="country__data">
  <h3 class="country__name">${data.name}</h3>
  <h4 class="country__region">${data.region}</h4>
  <p class="country__row"><span>👫</span>${Number(data.population / 1000000)}</p>
  <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
  <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
  </div>
  </article>
  `
  countriesContainer.insertAdjacentHTML('beforeend', html);
};


const getCountryData = function(country) {
  const request = fetch(`https://restcountries.com/v2/name/${country}`);
  request.then(response =>  {
    if(!response.ok) throw new Error(`Country not found ${response.status}`)
    return response.json()
  })
  .then(data => {
    renderCountry(data[0], 'main');
    const neighbour = data[0].borders?.[0];
    const allNeighbours = data[0].borders;
    if (!allNeighbours) throw new Error(`This country has no neighbours`)
    return allNeighbours;
  }) // adding neighbours 
      .then(allNeighbours => allNeighbours.forEach(nei =>  fetch(`https://restcountries.com/v2/alpha/${nei}`)
  .then(promise => {
    return promise.json();
  })
  .then(data => renderCountry(data, 'neighbour'))))
  .catch(err => {
    renderError(`${err.message}`)
} ).finally((arg) => {
  countriesContainer.style.opacity = 1;
})
};

const getPosition = function() {
  return new Promise(function(resolve, reject){
    navigator.geolocation.getCurrentPosition(resolve,reject)
  })
};

const whereAmI = function() {
  getPosition()
  .then(position => {
    const {latitude, longitude} = position.coords;
    return fetch(`https://geocode.xyz/${latitude},${longitude}?geoit=json`)
  })
  .then(promise => {
    if(!promise.ok) throw new Error(`Problem with Geolocation API, try again`);
    return promise.json()})
  .then(data => getCountryData(data.country))
  .catch(err => {
     renderError(`${err.message}`) })
};

myBtn.addEventListener('click', function() {
  const previousCountries = document.querySelectorAll('.country');
  previousCountries.forEach(el => el.remove());
  errBox.classList.add('hidden');
  whereAmI();
  
});

btn.addEventListener('click', function(arg) {
  let answer = window.prompt(`Choose Country`)
  arg = answer;
  errBox.classList.add('hidden');
  const previousCountries = document.querySelectorAll('.country');
  previousCountries.forEach(el => el.remove());
  getCountryData(arg)
} );



















