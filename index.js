// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!

async function 
FetchWeatherAlerts(state) {
    const url = `https://api.weather.gov/alerts/active?area=${state.toUpperCase()}`;


    //clear UI before new fetch

    clearUI ();

    try{
        const response = await fetch (url);
        if (!response.ok) {
            throw new Error('failed to fetch weather data. Please ensure the state code is valid.');

        }
        const data = await response.json();

        //displaying the results
        displayAlerts(data);

} catch (error) {

    //implementing errors
    displayErrorMessage(error.message);
}

    
}

//diplaying the alerts on the page

function displayAlerts(data) {
    const container = document.getElementById('weather-container');
    const title = data.title; 
    const alertCount = data.features.length;

    //creating summary message
    const summary = document.createElement('h2');
    summary.textContent = `${title}: $ {alertcount} alerts found. `;
    container.appendChild(summary);

    //looping through features to display headlines

    const alertList = document.createElement('ul');
    data.features.forEach(features => {
        const li = document.createElement('li');
        li.textContent = features.properties.headline;
        alertList.appendChild(li);
    });

    container.appendChild(alerrList);
}
//clearing and reseting the UI
function clearUI () {
    const container = document.getElementById('weather-container');
    const errorDiv = document.getElementById('error-message');
    const input = document.getElementById('state-input');

    container.innerHTML = ''; //this reset the input feild
}

//diplaying error message
function displayErrorMessage(message) {
    const errorDiv = document.getElementById('error-message');
    if(errorDiv){
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
    console.log(`error: ${message}`);

    
}

//adding event listener fro the subn,it button 
document.getElementById('submit-btn').addEventListener('click', () => { 
    const stateInput = document.getElementById('state-input').ariaValueMax.trim();

    if(stateInput.length === 2) {
        FetchWeatherAlerts(stateInput);

    } else {
        displayErrorMessage('please enter a valid 2-letter state abbreviation (e.g., NY, CA)');
    }
});

