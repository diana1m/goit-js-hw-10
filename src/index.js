import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';


const DEBOUNCE_DELAY = 300;
const input = document.querySelector("#search-box");
const list = document.querySelector(".country-list");
const infoBox = document.querySelector(".country-info");

input.addEventListener("input", debounce(inputText, DEBOUNCE_DELAY));

function inputText (evn){
    if (!evn.target.value.trim()) {
        list.innerHTML = "";
        infoBox.innerHTML = "";
        return;
    }

    if (evn.target.value.trim()){
        fetchCountries(evn.target.value.trim())
        .then(data => {
            if(data.length > 10){
                Notiflix.Notify.info("Too many matches found. Please enter a more specific name.")
            } 
            if(data.length >= 2 && data.length < 10){
                infoBox.innerHTML = "";
                list.innerHTML = createMarkupList(data)
            } 
            if (data.length === 1){
                list.innerHTML = "";
                infoBox.innerHTML = createMarkupInfo(data);
            }
        
        })
        .catch(err => Notiflix.Notify.failure(err))
    }
}

function createMarkupList(arr) {
    return arr.map(({name, flags: {svg : flag}}) =>
        `<li style="display: flex; justify-content: flex-start; margin-bottom: 30px"> 
        <img src="${flag}" alt="${name}" width="45px" style="margin-right: 15px; height: auto;"> 
        <p style="margin: 0">${name}</p>
        </li>`
    ).join('')
}

function createMarkupInfo(arr){
    const {name,capital,population,flags: {svg : flag}, languages} = arr[0];
    const getLangues = languages.map(language => Object.values(language.name).join(''));
    const markup =
        `<div style="display: flex; justify-content: flex-start; margin-bottom: 30px">
        <img src="${flag}" alt="${name}" width="120px" style="margin-right: 20px; height: auto;"> 
        <p style="margin: 0; font-size: 64px;">${name}</p>
        </div>
        <p>Capital: ${capital}</p>
        <p>Population: ${population}</p>
        <p>Languages: ${getLangues}</p>`

    return markup;
}

