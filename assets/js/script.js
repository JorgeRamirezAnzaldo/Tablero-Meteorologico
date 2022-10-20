
var idButton;
var City = "";
var storedCities = [];
var array = ["No local Storage"];
var today = moment().format("(M/D/YYYY)");
var out = "";

out = "";
renderCities();

function renderCities(){
    storedCities = JSON.parse(localStorage.getItem("Cities"));
    if (storedCities !== null) { //If there is something in the localStorage
        array = storedCities; //Move the stored array
        for (var j = 0; j < array.length; j++){ //Loop for all the elements of the array
            City = array[j];
            var newButton = $("<button>");
            newButton.addClass("CityButton");
            newButton.text(City);
            $("#List").append(newButton);
        }
    }
}

function getCity(event){
    idButton = $(event.target).attr("id");
    if (idButton == "SearchButton"){
        City = $("#CityInput").val();
        $("#CityInput").val("");
        if (!array.includes(City)){
            var newButton = $("<button>");
            newButton.addClass("CityButton");
            newButton.text(City);
            $("#List").append(newButton);
            if (array[0] == "No local Storage"){
                array.splice(0,1);
            }
            array.push(City);
            var almacenar = JSON.stringify(array); //Stringify the modified array
            localStorage.setItem("Cities", almacenar); //Store the stringified array
        }
        getweather(City);
    }
    
}

function ListCities(event){
    City = $(event.target).text();
    getweather(City);
}

function getweather(City){
    out = "";
    var requestUrl1 = "https://api.openweathermap.org/data/2.5/forecast?q=" + City + "&appid=eb91e77d6629b99cd66827732381e9bd&units=imperial";
    var requestUrl2 = "https://api.openweathermap.org/data/2.5/weather?q=" + City + "&appid=eb91e77d6629b99cd66827732381e9bd&units=imperial";

    fetch(requestUrl1)
    .then(function (response1) {
        if (response1.status === 404){
            if (out === ""){ 
                alert("You have introduced and invalid city name");
            }
            out = "X";
          } else if ((response1.status === 401) || (response1.status === 429)){
            if (out === ""){ 
                alert("There is a problem with the API subscription, it is not possible to extract data");
            }
            out = "X";
          } else{
            return response1.json();
          }
    })
    .then(function (data1) {
        if (out === ""){
            placeforecast(data1);
        }
    });
    
    fetch(requestUrl2)
    .then(function (response2) {
        if (response2.status === 404){
            if (out === ""){ 
                alert("You have introduced and invalid city name");
            }
            out = "X";
        } else if ((response2.status === 401) || (response2.status === 429)){
            if (out === ""){
                alert("There is a problem with the API subscription, it is not possible to extract data");
            }
            out = "X";
        } else{
            return response2.json();
        }
    })
    .then(function (data2) {
        if (out === ""){
            placetodaysweather(data2);
        }
    });
        
}


function placeforecast(data1){
    var time = data1.list[0].dt_txt;
    var time2 = time.slice(13);
    var timeh = time.slice(11, 13);
    var timenum = Number(timeh);
    var timenew = timenum - 3;
    var time3 = timenew + time2;
    for (var k = 1; k < 6; k++){
        var futureday = moment().add(k, "days").format("M/D/YYYY");
        var futuredaycomp = moment().add(k, "days").format("YYYY-MM-DD");
        for (var m = 0; m < data1.list.length; m++){
            var element = data1.list[m].dt_txt;
            if (element.search(futuredaycomp) !== -1 ){
                if (data1.list[m].dt_txt.search(time3) !== -1 ){
                    break;
                }
            }
        }
        var idSection = "#S" + k;
        $(idSection).html("");
        console.log(data1.list[m]);
        var fline1 = $("<h3>");
        fline1.text(futureday);
        var fline2 = $("<img>");
        fline2.addClass("Icon");
        var iconflink =  "http://openweathermap.org/img/wn/" + data1.list[m].weather[0].icon + ".png";
        fline2.attr("src", iconflink);
        var fline3 = $("<p>");
        var ftemp = data1.list[m].main.temp;
        fline3.text("Temp: " + ftemp + " °F");
        var fline4 = $("<p>");
        var fwind = data1.list[m].wind.speed;
        fline4.text("Wind: " + fwind + " MPH");
        var fline5 = $("<p>");
        var fhumidity = data1.list[m].main.humidity;
        fline5.text("Humidity: " + fhumidity + " %");
        fline1.attr("style", "margin-left: 20px;");
        fline2.attr("style", "margin-left: 20px;");
        fline3.attr("style", "margin-left: 20px;");
        fline4.attr("style", "margin-left: 20px;");
        fline5.attr("style", "margin-left: 20px;");
        $(idSection).append(fline1);
        $(idSection).append(fline2);
        $(idSection).append(fline3);
        $(idSection).append(fline4);
        $(idSection).append(fline5);

    }
    

}

function placetodaysweather(data2){
    console.log(data2);
    $("#Today").html("");
    var line1 = $("<h1>");
    line1.attr("vertical-align", "middle");
    line1.attr("style", "margin-left: 20px;");
    line1.text(City + " " + today + " ");
    var lineicon = $("<img>");
    lineicon.addClass("Icon");
    var iconlink =  "http://openweathermap.org/img/wn/" + data2.weather[0].icon + ".png";
    lineicon.attr("src", iconlink);
    lineicon.attr("style", "position:relative; top:6px;");
    var line2 = $("<p>");
    var temp = data2.main.temp;
    line2.attr("style", "margin-left: 20px;");
    line2.text("Temp: " + temp + " °F");
    var line3 = $("<p>");
    var wind = data2.wind.speed;
    line3.attr("style", "margin-left: 20px;");
    line3.text("Wind: " + wind + " MPH");
    var line4 = $("<p>");
    line4.attr("style", "margin-left: 20px;");
    var humidity = data2.main.humidity;
    line4.text("Humidity: " + humidity + " %");
    $("#Today").append(line1);
    line1.append(lineicon);
    $("#Today").append(line2);
    $("#Today").append(line3);
    $("#Today").append(line4);
}

$("button").on("click", getCity);
$("#List").on("click", "button.CityButton", ListCities);