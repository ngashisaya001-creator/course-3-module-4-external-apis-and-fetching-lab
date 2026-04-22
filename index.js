// index.js
// Task 2, Step 1: fetchWeatherAlerts function
// Accepts a state abbreviation and fetches alerts from the NWS API
// Returns the fetch promise so Jest can await it in tests
function fetchWeatherAlerts(state) {

  // Use a template literal to build the URL with the given state abbreviation
  return fetch(`https://api.weather.gov/alerts/active?area=${state}`)
    .then(function(response) {

      // If response is not OK (e.g. 404, 500), throw an error to trigger .catch()
      if (!response.ok) {
        throw new Error(`Unable to fetch alerts for "${state}". Please check the state abbreviation.`);
      }

      // Parse the JSON body and pass it to the next .then()
      return response.json();
    })
    .then(function(data) {

      // Log data to console for debugging
      console.log(data);

      // Task 2, Step 2: Display the alerts on the page
      displayAlerts(data);

      // Task 2, Step 3: Clear the input field after a successful fetch
      var input = document.getElementById('state-input');
      if (input) {
        input.value = '';
      }

      // Task 2, Step 3: Hide and clear any existing error message
      var errorDiv = document.getElementById('error-message');
      if (errorDiv) {
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
      }

      // Return data so Jest tests can inspect the result
      return data;
    })
    .catch(function(errorObject) {

      // Task 2, Step 4: Show the error message in the error div
      console.log(errorObject.message);

      var errorDiv = document.getElementById('error-message');
      if (errorDiv) {
        errorDiv.textContent = errorObject.message;
        errorDiv.style.display = 'block';
      }
    });
}

// Task 2, Step 2: displayAlerts function
// Dynamically updates the DOM with alert data from the API response
function displayAlerts(data) {

  var alertsContainer = document.getElementById('alerts-container');
  if (!alertsContainer) return;

  // Clear previous alerts before inserting new ones (Step 3: Reset UI)
  alertsContainer.innerHTML = '';

  // Get the array of alert features from the response
  var alerts = data.features;

  // Show a summary: title + count of alerts
  // Format: "Current watches, warnings, and advisories for New York: 7"
  var summary = document.createElement('p');
  summary.textContent = data.title + ': ' + alerts.length;
  alertsContainer.appendChild(summary);

  // Loop through each alert and display its headline as a list item
  alerts.forEach(function(alert) {
    var alertItem = document.createElement('li');

    // The headline is nested at alert.properties.headline
    alertItem.textContent = alert.properties.headline;
    alertsContainer.appendChild(alertItem);
  });
}

// Attach the button click event only when the DOM is fully loaded
// Wrapping in typeof check prevents crash when running in Jest (no real DOM)
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function() {

    var btn = document.getElementById('fetch-btn');
    if (!btn) return;

    // When "Get Weather Alerts" is clicked, read the input and call fetchWeatherAlerts
    btn.addEventListener('click', function() {

      var input = document.getElementById('state-input');
      var state = input ? input.value.trim() : '';

      // Validate: if empty, show error and stop
      if (!state) {
        var errorDiv = document.getElementById('error-message');
        if (errorDiv) {
          errorDiv.textContent = 'Please enter a valid US state abbreviation (e.g., NY).';
          errorDiv.style.display = 'block';
        }
        return;
      }

      // Call the fetch function with the state value
      fetchWeatherAlerts(state);
    });
  });
}

// Export functions so Jest can import and test them
module.exports = { fetchWeatherAlerts, displayAlerts };