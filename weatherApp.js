import { LightningElement } from 'lwc';
import WEATHER_ICONS from '@salesforce/resourceUrl/weatherAppIcon';
import getWeatherDetails from '@salesforce/apex/WeatherAppController.getWeatherDetails';

//const API_KEY = '97c9cd38d9c616c4677df3193ab398b3';

export default class WeatherApp extends LightningElement {

    clearIcon = WEATHER_ICONS + '/weatherAppIcons/clear.svg';
    cloudIcon = WEATHER_ICONS + '/weatherAppIcons/cloud.svg';
    dropletIcon = WEATHER_ICONS + '/weatherAppIcons/droplet.svg';
    hazeIcon = WEATHER_ICONS + '/weatherAppIcons/haze.svg';
    mapIcon = WEATHER_ICONS + '/weatherAppIcons/map.svg';
    rainIcon = WEATHER_ICONS + '/weatherAppIcons/rain.svg';
    snowIcon = WEATHER_ICONS + '/weatherAppIcons/snow.png';
    stormIcon = WEATHER_ICONS + '/weatherAppIcons/storm.svg';
    thermometerIcon = WEATHER_ICONS + '/weatherAppIcons/thermometer.svg';
    arrowBackIcon = WEATHER_ICONS + '/weatherAppIcons/arrow-back.svg';

    cityName = ''
    loadingText = '';
    isError = false;
    response ;

    get loadingClass(){
        return this.isError ? 'error-message' : 'success-message';
    }

    searchHandler(event){
        this.cityName = event.target.value;

    }
    submitHandler(event){
        event.preventDefault();
        this.fetchData();
    }
    fetchData(){
        this.loadingText = 'Featching Weather Details...';
        this.isError = false;
        console.log( "City Name :", this.cityName);
        //Server Side API Call
        getWeatherDetails({ input : this.cityName }).then(result=>{
            console.log("result : ", JSON.stringify(result));
            this.weatherDetails(JSON.parse(result));
        }).catch(error => {
            console.error("Error fetching data: ", error);
            this.response = null;
            this.isError = true;
            this.loadingText = 'Error fetching weather details. Please try again.';
        });
        
        /*
        //Client Side API Call
        const URL = `https://api.openweathermap.org/data/2.5/weather?q=${this.cityName}&appid=${API_KEY}&units=metric`;
        fetch(URL).then(res=> res.json()).then(result=>{
            console.log("result : ", JSON.stringify(result));
            this.weatherDetails(result);
        }).catch(error => {
            console.error("Error fetching data: ", error);
            this.isError = true;
            this.loadingText = 'Error fetching weather details. Please try again.';
        }); 
        */
        
    }
    weatherDetails(info){
        if(info.cod === "404"){
            this.isError = true;
            this.loadingText = `${this.cityName} not found. Please enter a valid city name.`;
        }
        else{
            this.loadingText = '';
            this.isError = false;
            const city = info.name;
            const country = info.sys.country;
            const {description, id} = info.weather[0];
            const {temp,feels_like, humidity} = info.main

            if(id === 800){
                this.weatherIcon = this.clearIcon
            }else if( (id >= 200 && id <= 232) || (id >= 600 && id <= 622) ){
                this.weatherIcon = this.stormIcon
            }else if(id >= 701 && id <= 781){
                this.weatherIcon = this.hazeIcon
            }else if(id >= 801 && id <= 804){
                this.weatherIcon = this.cloudIcon
            }else if( (id >= 500 && id <= 531) || (id >= 300 && id <= 321) ){
                this.weatherIcon = this.rainIcon
            } else{}
            
            this.response = {
                city : city,
                temperature : Math.floor(temp),
                description : description,
                location : `${city}, ${country}`,
                feels_like : Math.floor(feels_like),
                humidity : `${humidity}%`,
            }
        }
    }

    backHandler(){
        this.response = null;
        this.cityName = '';
        this.loadingText = '';
        this.isError = false;
        this.weatherIcon = '';
    }
}