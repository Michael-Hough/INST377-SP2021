"use strict";

function mapInit() 
{
  // follow the Leaflet Getting Started tutorial here
  let map = L.map("mapid").setView([38.993309743079195, -76.93299939891435], 13);

  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken:
        "pk.eyJ1Ijoic2NvbmVzMTEiLCJhIjoiY2ttNmp6czJtMG93ajJ5bzRzdXZqN2k4YSJ9.feA5fOUJH2j6Bkb6O7Aqxw",
    }
  ).addTo(map);

  return map;
}

async function dataHandler(mapObjectFromFunction) 
{
  // use your assignment 1 data handling code here
  // and target mapObjectFromFunction to attach markers

  const endpoint = "/api";

  const request = await fetch(endpoint, { method: "get" });
  const cities = await request.json();

  function findMatches(wordToMatch, cities) {
    console.log(wordToMatch);
    return cities.filter((place) => {
      const regex = new RegExp(wordToMatch, "gi");
      return place.zip.match(regex) && place.geocoded_column_1;
    });
  }

  function displayMatches(event) 
  {
    // Workaround to prevent empty search bar from displaying the entire array
    if (searchInput.value === "") 
    {
      suggestions.innerHTML = "";
      return;
    }

    const matchArray = findMatches(searchInput.value, cities).slice(0,5);
    let html = "";

    matchArray.forEach((place) => 
      {
        const longLat = place.geocoded_column_1.coordinates;
        const marker = L.marker([longLat[1],longLat[0]]).addTo(mapObjectFromFunction);
        html += `
        <div class="block list-item"
          <ul>
            <li class="name">${place.name}</li>
            <li class="category">${place.category}</li>
            <li class="address">${place.address_line_1} ${place.zip}</li>
          </ul>
        </div>
        `;
      });

    // Pan to first search result
    mapObjectFromFunction.panTo([matchArray[0].geocoded_column_1.coordinates[1],matchArray[0].geocoded_column_1.coordinates[0]]);

    suggestions.innerHTML = html;
  }

  const searchInput = document.querySelector("#search");
  const form = document.querySelector("#search-form");
  const suggestions = document.querySelector("#suggestions");

  form.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    displayMatches(evt);
  });

  searchInput.addEventListener('input', async (evt) => {
    evt.preventDefault();
    if (evt.target.value === "")
    {
      suggestions.innerHTML = "";
    }
  });
}

async function windowActions() 
{
  const map = mapInit();
  await dataHandler(map);
}

window.onload = windowActions;
