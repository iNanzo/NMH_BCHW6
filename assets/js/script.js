// DOM selector variables
var searchBtn = $("#searchBtn")
var searchValue = $("#searchInput")
var todaysWeatherDiv = $("#todaysWeather");
var searchHistDiv = $("#searchHistory");
var futureWeatherDiv = $("#futureWeatherCards");

// OpenWeather API key
var apiKey = "2494584923c2bb5f1628bc417e59d715"

// Variables
var todaysWeather = new Object();
var forecastWeather = [];
var searchHistory = [];
var dateFormat = "MM/DD/YYYY";

// Search Functions

    // Uses search bar input and plugs into standard search function on searchBtn click
function searchFrmButton(){
    search(searchValue.val());
}

    // Standard search function, used raw by saved searches
function search(cityName){
    var fetchURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=metric&appid=" + apiKey;
    futureWeatherDiv.html("");
    fetchFunction(fetchURL);
}

// API Fetch Functions

    //Use search input and search for two sets of data
function fetchFunction(fetchURL){
    fetch(fetchURL,{
    })
        .then(function(response){
            if(response.status === 200){
                return response.json();
            }else{
                $("#modal").modal("show");
                $("#modalTitle").text("Error " + response.status);
                $("#invalidValue").html("Invalid Search Value");
            }
        })
        .then(function(data){
                saveSearch(data.name)
                todaysWeather.name = data.name
                var latitude = data.coord.lat;
                var longitude = data.coord.lon;
                fetchcurrWeather(longitude, latitude);
                fetchForecast(longitude, latitude);
        })
};

    // Fetch Today's Weather Data
function fetchcurrWeather(lon, lat){
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=hourly,daily,minutely,alerts&appid=" + apiKey, {
    })
        .then(function(response){
            if (response.status === 200){
                return response.json();
            } else {
                $("#modal").modal("show");
                $("#modalTitle").text("Error " + response.status);
                $("#invalidValue").html("An Error Occurred While Fetching Today's Weather");
            }
        })
        .then(function(data){
            todaysWeather.date = moment.unix(data.current.dt).format(dateFormat);
            todaysWeather.temp = data.current.temp;
            todaysWeather.wind = data.current.wind_speed;
            todaysWeather.humidity = data.current.humidity;
            todaysWeather.uvi = data.current.uvi;
            todaysWeather.weatherIcon = data.current.weather[0].icon;

            // Always returns 0? after many tests seems to be an API side problem
            console.log(data.current.uvi);
            
            renderTodaysWeather(todaysWeather);
        })

}

    // Fetch Future Forecast Weather Data
function fetchForecast(lon, lat){
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&cnt=6&units=imperial&appid=" + apiKey, {
    })
        .then(function(response){
            if (response.status === 200){
                return response.json();
            }else{
                $("#modal").modal("show");
                $("#modalTitle").text("Error " + response.status);
                $("#invalidValue").html("An Error Occurred Fetching While Future Forecasts");
            }
        })
        .then(function(data){
            if(data){
                // For loop to get future forecast data, starts at one to begin from tomorrow's date
                for(i = 1; i < 6; i++){
                    var futureWeather = new Object();
                    futureWeather.date = moment.unix(data.daily[i].dt).format(dateFormat);
                    futureWeather.temp = data.daily[i].temp.day;
                    futureWeather.wind = data.daily[i].wind_speed;
                    futureWeather.humidity = data.daily[i].humidity;
                    futureWeather.weatherIcon = data.daily[i].weather[0].icon;
                    forecastWeather.push(futureWeather);
                }
                renderForecast(forecastWeather);
                forecastWeather = [];
            }
        })

}


// Search History Functions

    // Get Value of Searchbar
function historyBtnClick(){
    search(this.value);
}

    // Save Search History
function saveSearch(x){
    if(searchHistory.indexOf(x) == -1){
        searchHistory.unshift(x);
    }
    if(searchHistory.length > 5){
        searchHistory.pop();
    }
    localStorage.setItem("localSaveHist", JSON.stringify(searchHistory));
    $("#searchHistory").html("");
    renderSaved();
}

    // Render Search History
function renderSaved(){
    var storedHistory = JSON.parse(localStorage.getItem("localSaveHist"));
    if(storedHistory !== null){
        searchHistory = storedHistory
    }for(index = 0; index < searchHistory.length; index++){
        var button = $("<button>");
        button.addClass("btn btn-outline-secondary historyBtn");
        button.text(searchHistory[index]);
        button.attr("value", searchHistory[index]);
        searchHistDiv.append(button);
    }

    var historyBtnArr = $(".historyBtn");
    historyBtnArr.click(historyBtnClick);

}

// Render Today's Weather
function renderTodaysWeather(today){``
    //UVI modifiers
    var uviVal = $("#uviValue");

    if(today.uvi < 2){
        uviVal.css({ "background-color": "GreenYellow" });
    }else if (2 < today.uvi < 4){
        uviVal.css({ "background-color": "Yellow" });
    }else if (4 < today.uvi < 6){
        uviVal.css({ "background-color": "Orange" });
    }else{
        uviVal.css({ "background-color": "Tomato" });
    }

    uviVal.text(today.uvi);

    $("#todaysDate").text(today.name + " (" + today.date + ")");
    $("#todaysTemp").text("Temp: " + today.temp + "°F");
    $("#todaysWind").text("Wind: " + today.wind + " MPH");
    $("#todaysHum").text("Humidity: " + today.humidity + "%");
    $("#uviLabel").text("UV Index: ");
}


// Render Future Weather Forecasts
function renderForecast(forecast){
    futureWeatherDiv.html("");
    for(var index = 0; index < forecast.length; index++){
        // Create div and h3 (card data and date as title respectively)
        var div = $("<div>");
        div.addClass("col forecast");

        var h3 = $("<h3>");
        h3.addClass("fs-4");
        h3.text(moment(forecast[index].date, dateFormat).format(dateFormat));
        
        futureWeatherDiv.append(div);

        // Append Card Data Text
        div.append(h3);
        div.append($("<p>").text("Temp: " + forecast[index].temp + "°F"));
        div.append($("<p>").text("Wind: " + forecast[index].wind + " MPH"));
        div.append($("<p>").text("Humidity: " + forecast[index].humidity + "%"));
    }
}

renderSaved();
searchBtn.click(searchFrmButton);