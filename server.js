var express = require("express");
var request = require("request-promise");
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
const apiKey = '7180a9b02b3303314d68adbb6c4a1df2';
var app = express();
app.use(express.static('public'));
app.set("view engine", "ejs");

mongoose.connect("mongodb://rkramer:password11@ds121603.mlab.com:21603/express_weather")
app.use(bodyParser.urlencoded({ extended : true}));

var citySchema = new mongoose.Schema({
    name : String 
});

var cityModel = mongoose.model('City', citySchema);



 async function getWeather (cities){
     var weather_data = [];
     
     for(var city_obj of cities) {
         var city = city_obj.name;
         var url = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&apikey=' + apiKey;
         
         
         var response_body = await request(url);
         
         var weather_json = JSON.parse(response_body);
         
         var weather = {
            temp : Math.round(weather_json.main.temp),
            icon : weather_json.weather[0].icon,
            description : weather_json.weather[0].description ,
            humidity : weather_json.main.humidity ,
            tempMax : weather_json.main.temp_max,
            city: city
        };
        weather_data.push(weather);
     }
     return weather_data;
     
 }


app.get("/", function(req, res){
   cityModel.find({}, function(err, cities){
       getWeather(cities).then(function(results){
           var weather_data = {weather_data : results};
           
            res.render('weather', weather_data);
       })
   })
});


app.post('/', function(req, res) {

    var newCity = new cityModel({name : req.body.city_name});
    newCity.save();

    res.redirect('/');

});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("sever has started");
});