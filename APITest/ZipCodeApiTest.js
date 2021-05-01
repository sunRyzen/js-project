const axios = require('axios');
const { response } = require('express');
const btoa = require('btoa');

const API_URL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const API_KEY = '116b498b620ae1272a3f6b1d7c177f21';

//class location {
  //  constructor(latitude, longitude)
//}

let zipcode = '400607';
let country = 'in';

const ENTIRE_API_URL = `${API_URL}${zipcode},${country}&appid=${API_KEY}`;
let coordinates = {};
axios.get(ENTIRE_API_URL)
.then(response => {
    coordinates.latitude = response.data.coord.lat;
    coordinates.longitude = response.data.coord.lon;
    const weather = response.data.clouds.all;
    
    const display = (`The coordinates of ${zipcode} are: \n
    Latitude: ${latitude} \n
    Longitude: ${longitude} \n
    Current cloud cover at ${zipcode}, ${response.data.name} is ${weather} %! `);
    console.log(display);
    //this.location = new location(latitude, longitude);
})
.catch(error => console.log('Error', error));


const SKY_API_URL = 'https://api.astronomyapi.com/api/v2';
const SKY_API_KEY = '3206e5f7-04e2-4b0d-84d4-cb769bdb785a';
const SKY_SECRET_KEY = '6ac5b2276b28bfab8f45b6f5f24612f52103960d443b52769a5e711b0c744e6955e51231842a4027c3828b4ecaca169a38e174e11a74c4bb3cbc77667b4aa5c06d6eaf33185d1aadc6f8d5c104a90516675b72224f1ceffa848172e696cd9f90b670e131a0ddb59058b233574f3d8ae3';

const hash = btoa(`${SKY_API_KEY}:${SKY_SECRET_KEY}`);

axios.get(`${SKY_API_URL}/bodies`, {
    headers: {
    Authorization: `Basic ${hash}`
},
})
.then(response=>{
    console.log(response.data);
})
.catch(error => console.log('Error', error));


axios.post(`${SKY_API_URL}/studio/star-chart`,
    {
        "style": "inverted",
        "observer": {
            "latitude": this.latitude,
            "longitude": this.longitude,
            "date": "2021-4-13"
        },
        "view": {
            "type": "constellation",
            "parameters": {
                "constellation": "ori" // 3 letter constellation id
            },
        },
    },
    {
        headers:{
            Authorization: `Basic ${hash}`
        }

    })
    .then(response=>{
        console.log(response.data);
    })
    .catch(error => console.log('Error', error));


    