var express = require("express");
var request = require("request");
var mongoose = require("mongoose");
var bodyParser = require('body-parser');

var app = express();
app.use(express.static('public'));
app.set("view engine", "ejs");

mongoose.connect("mongodb://rkramer:password11@ds121603.mlab.com:21603/express_weather")
app.use(bodyParser.urlencoded({ extended : true}));

app.get("/", function(req, res){
    var city = 'Atlanta';
    var apiKey = '7180a9b02b3303314d68adbb6c4a1df2';
    var url = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&apikey=' + apiKey;
    request(url, function(error, response, body){
        var weather_json = JSON.parse(body);
       
        var weather = {
            temp : Math.round(weather_json.main.temp),
            icon : weather_json.weather[0].icon,
            description : weather_json.weather[0].description ,
            humidity : weather_json.main.humidity ,
            tempMax : weather_json.main.temp_max,
            city: city
        };
        
        var weather_data = {weather : weather}
        res.render("weather", weather_data);
    });
    
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("sever has started");
});