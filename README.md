# 06 Server-Side APIs: Weather Dashboard
https://github.com/iNanzo/NMH_BCHW6

https://inanzo.github.io/NMH_BCHW6/

## Acceptance Criteria

```
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
```

## My Task

I first set up a base HTML page using bootstrap, then added some styling. From there I started working on the js file, setting up basic variables like the DOM selectors and Globals. Also the variable apiKey to plug into urls. I made a function for the search button, taking the value of the text field.

It took a while to learn the ins and outs of the OpenWeatherAPI, it was confusing at first but i realized how simple it was once i got the data array and url formatting down. Taking the aforementioned value of the textfield, the function plugs it into a string that makes it a proper url and plugs it into the fetchCity function. This function takes the inputted city's latitude and longitude values and plugs them into the mainUrl variable, and puts this variable into two seperate functions; one for today's weather, and one for future forecasts. These functions are called the fetchTodaysWeather and fetchFutureWeather respectively, they operate similarly in taking values from their data arrays, aside from the fact that one uses a for loop for it's multiple cards.

Quickly explaining the rest of the code, it takes the values and puts it into an object, and operates similarly to homework weeks 4 and 5; use of moment.js, appending things to specific div classes, and using localStorage to load and save. As side notes, I used bootstrap's modal for error messages.