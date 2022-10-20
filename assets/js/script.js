//Declare and initialize variables
var idButton;
var City = "";
var storedCities = [];
var array = ["No local Storage"];
var today = moment().format("(M/D/YYYY)"); //Get today's date with correct format
var out = "";

out = ""; //Initialize variable
renderCities(); //Render the cities list stored in the localStorage

//Function used to render the Cities list stored in the localStorage
function renderCities(){
    storedCities = JSON.parse(localStorage.getItem("Cities")); //Get the list of cities stored in localStorage
    if (storedCities !== null) { //If there is something in the localStorage
        array = storedCities; //Move the stored array
        for (var j = 0; j < array.length; j++){ //Loop for all the elements of the array
            City = array[j]; //Assign the element to the City variable
            var newButton = $("<button>"); //Create a new button
            newButton.addClass("CityButton"); //Add class CityButton to the new button
            newButton.text(City); //Place the City as the text for the button
            $("#List").append(newButton); //Append the button to the list
        }
    }
}

//Function to get the City from the input and display the weather
function getCity(event){
    idButton = $(event.target).attr("id"); //Get the id of the pressed button
    if (idButton == "SearchButton"){ //Validate that the button with id SearchButton was pressed
        City = $("#CityInput").val(); //Get the City from the input
        $("#CityInput").val(""); //Clean the input for the City
        if (!array.includes(City)){ //Verify if the City is not contained in the localStorage
            var newButton = $("<button>"); //Create a new button for the new City
            newButton.addClass("CityButton"); //Add class CityButton to the new button
            newButton.text(City); //Place the City ad the text for the button
            $("#List").append(newButton); //Append the button to the list
            if (array[0] == "No local Storage"){ //If there wasn't any localStorage
                array.splice(0,1); //Retrieve placeholder in the array
            }
            array.push(City); //Add the city to the array
            var almacenar = JSON.stringify(array); //Stringify the modified array
            localStorage.setItem("Cities", almacenar); //Store the stringified array in localStorage
        }
        getweather(City); //Get the actual weather and the forecast
    }
    
}

//Function to get the City based on the list button pressed and display the weather
function ListCities(event){
    City = $(event.target).text(); //Get the City of the button pressed
    getweather(City); //Get the actual weather and the forecast
}

//Function to get the data using Open Weather API
function getweather(City){
    out = ""; //Clean variable
    var requestUrl1 = "https://api.openweathermap.org/data/2.5/forecast?q=" + City + "&appid=eb91e77d6629b99cd66827732381e9bd&units=imperial"; //Build URL to get the 5-day forecast using imperial units
    var requestUrl2 = "https://api.openweathermap.org/data/2.5/weather?q=" + City + "&appid=eb91e77d6629b99cd66827732381e9bd&units=imperial"; //Build URL to get the actual weather using imperial units

    fetch(requestUrl1) //Fetch for the 5-day forecast
    .then(function (response1) {
        if (response1.status === 404){ //Verify if response status is 404
            if (out === ""){ //Verify there wasn't any other issue before for a request related to this city
                alert("You have introduced and invalid city name"); //Tell the user that city name is invalid
            }
            out = "X"; //Set the variable to X
          } else if ((response1.status === 401) || (response1.status === 429)){ //Verify if response status is 401 or 429
            if (out === ""){  //Verify there wasn't any other issue before for a request related to this city
                alert("There is a problem with the API subscription, it is not possible to extract data"); //Tell the user that there is a problem with the API subscription
            }
            out = "X"; //Set the variable to X
          } else{
            return response1.json(); //Return response
          }
    })
    .then(function (data1) {
        if (out === ""){ //Validate there wasn't any issue
            placeforecast(data1); //Call function to place the forecast in the application
        }
    });
    
    fetch(requestUrl2)
    .then(function (response2) {
        if (response2.status === 404){ //Verify if response status is 404
            if (out === ""){ //Verify there wasn't any other issue before for a request related to this city
                alert("You have introduced and invalid city name"); //Tell the user that city name is invalid
            }
            out = "X"; //Set the variable to X
        } else if ((response2.status === 401) || (response2.status === 429)){ //Verify if response status is 401 or 429
            if (out === ""){ //Verify there wasn't any other issue before for a request related to this city
                alert("There is a problem with the API subscription, it is not possible to extract data"); //Tell the user that there is a problem with the API subscription
            }
            out = "X"; //Set the variable to X
        } else{
            return response2.json(); //Return response
        }
    })
    .then(function (data2) {
        if (out === ""){ //Validate there wasn't any issue
            placetodaysweather(data2); //Call function to place the actual weather in the application
        }
    });
        
}

//Function to place the 5-day forecast in the application
function placeforecast(data1){
    var time = data1.list[0].dt_txt; //Get the time of the first element in the list returned by response
    var time2 = time.slice(13); //Extract the minutes and the seconds
    var timeh = time.slice(11, 13); //Extract the hours
    var timenum = Number(timeh); //Convert the hours to number
    if (timenum === 0){ //If it is midnight
        timenum = 24; //Set hours to 24
    }
    var timenew = timenum - 3; //Substract three hours
    var time3 = timenew + time2; //Create a new time with format HH:MM:SS
    for (var k = 1; k < 6; k++){ //Loop for the 5 forecast days
        var futureday = moment().add(k, "days").format("M/D/YYYY"); //Add k days to the actual date and format it
        var futuredaycomp = moment().add(k, "days").format("YYYY-MM-DD"); //Add k days to the actual date and format it as in the response
        for (var m = 0; m < data1.list.length; m++){ //Loop over the list returned by response
            var element = data1.list[m].dt_txt; //Extract the time of each element list
            if (element.search(futuredaycomp) !== -1 ){ //Validate if the desired date in the future matches
                if (data1.list[m].dt_txt.search(time3) !== -1 ){ //Validate if the new time matches
                    break; //When found, break the loop
                }
            }
        }
        var idSection = "#S" + k; //Dynamically build the section id based on index k
        $(idSection).html(""); //Clean the section
        console.log(data1.list[m]);
        var fline1 = $("<h3>"); //Create element <h3>
        fline1.text(futureday); //Asign date to the <h3> element
        var fline2 = $("<img>"); //Create element <img>
        fline2.addClass("Icon"); //Assign class Icon to the <img> element
        var iconflink =  "http://openweathermap.org/img/wn/" + data1.list[m].weather[0].icon + ".png"; //Create URL for the icon based on the icon returned by the response
        fline2.attr("src", iconflink); //Set the URL to the <img> element
        var fline3 = $("<p>"); //Create element <p>
        var ftemp = data1.list[m].main.temp; //Extract the temperature from the response data
        fline3.text("Temp: " + ftemp + " °F"); //Create temperature text and assign it to the <p> element
        var fline4 = $("<p>"); //Create element <p>
        var fwind = data1.list[m].wind.speed; //Extract the wind speed from the response data
        fline4.text("Wind: " + fwind + " MPH"); //Create wind speed text and assign it to the <p> element
        var fline5 = $("<p>"); //Create element <p>
        var fhumidity = data1.list[m].main.humidity; //Extract the humidity from the response data
        fline5.text("Humidity: " + fhumidity + " %"); //Create humidity text and assign it to the <p> element
        fline1.attr("style", "margin-left: 20px;"); //Set style for line 1
        fline2.attr("style", "margin-left: 20px;"); //Set style for line 2
        fline3.attr("style", "margin-left: 20px;"); //Set style for line 3
        fline4.attr("style", "margin-left: 20px;"); //Set style for line 4
        fline5.attr("style", "margin-left: 20px;"); //Set style for line 5
        $(idSection).append(fline1); //Append line 1 to the section with id = idSection
        $(idSection).append(fline2); //Append line 2 to the section with id = idSection
        $(idSection).append(fline3); //Append line 3 to the section with id = idSection
        $(idSection).append(fline4); //Append line 4 to the section with id = idSection
        $(idSection).append(fline5); //Append line 5 to the section with id = idSection

    }
    

}

//Function to place actual weather in the application
function placetodaysweather(data2){
    console.log(data2);
    $("#Today").html(""); //Clean the section
    var line1 = $("<h1>"); //Create element <h1>
    line1.attr("vertical-align", "middle"); //Set style for line 1
    line1.attr("style", "margin-left: 20px;"); //Set style for line 1
    line1.text(City + " " + today + " "); //Create text for heading and assign it to element <h3>
    var lineicon = $("<img>"); //Create element <img>
    lineicon.addClass("Icon"); //Assign class Icon to the <img> element
    var iconlink =  "http://openweathermap.org/img/wn/" + data2.weather[0].icon + ".png"; //Create URL for the icon based on the icon returned by the response
    lineicon.attr("src", iconlink); //Set the URL to the <img> element
    lineicon.attr("style", "position:relative; top:6px;"); //Set position for icon
    var line2 = $("<p>"); //Create element <p>
    var temp = data2.main.temp; //Extract the temperature from the response data
    line2.attr("style", "margin-left: 20px;"); //Set style for line 2
    line2.text("Temp: " + temp + " °F"); //Create temperature text and assign it to the <p> element
    var line3 = $("<p>"); //Create element <p>
    var wind = data2.wind.speed; //Extract the wind speed from the response data
    line3.attr("style", "margin-left: 20px;"); //Set style for line 3
    line3.text("Wind: " + wind + " MPH"); //Create wind speed text and assign it to the <p> element
    var line4 = $("<p>"); //Create element <p>
    line4.attr("style", "margin-left: 20px;"); //Set style for line 4
    var humidity = data2.main.humidity; //Extract the humidity from the response data
    line4.text("Humidity: " + humidity + " %"); //Create humidity text and assign it to the <p> element
    $("#Today").append(line1); //Append line 1 to the section with id = Today
    line1.append(lineicon); //Append icon to the line1 wich is the heading
    $("#Today").append(line2); //Append line 2 to the section with id = Today
    $("#Today").append(line3); //Append line 3 to the section with id = Today
    $("#Today").append(line4); //Append line 4 to the section with id = Today
}

//Catch the clicks over the Search button and the dynamically created buttons
$("button").on("click", getCity);
$("#List").on("click", "button.CityButton", ListCities);