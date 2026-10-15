//запис дати
const todayData = document.getElementById("todayData");

const today = new Date();
const month = today.toLocaleDateString('en-US', { month: 'short' }) ;
const day = today.getDate();
const year = today.getFullYear();
const dayName = today.toLocaleDateString('en-US', { weekday: 'short' })

todayData.innerHTML = `${month} ${day}-${year} - ${dayName}`;

//api

const containerImgLoupe = document.getElementById('containerImgLoupe');
const inputEnterCity = document.getElementById('inputEnterCity');
const apiKey = 'd9bca0e9f7380a382d29c048f1a12091';
let clockInterval = null;
const temperature = document.getElementById('temperature');
const feelsLikeToday = document.getElementById('feelsLikeToday');
const humidityToday = document.getElementById('humidityToday');
const windToday  = document.getElementById('windToday');
const higherTodayTemp = document.getElementById('higherTodayTemp');
const lowerTodayTemp = document.getElementById('lowerTodayTemp');
const descr = document.getElementById('description');
const weatherImg = document.getElementById('weatherImg');


function cityTime(timezone) {
    const localDate = new Date();
    const localOffsetMinutes = localDate.getTimezoneOffset();

    const apiOffsetMinutes = timezone / 60;
    const diffMinutes = apiOffsetMinutes + localOffsetMinutes;
    const cityTime = new Date(localDate.getTime() + (diffMinutes * 60000));

    const hours = cityTime.getHours();
    const minutes = cityTime.getMinutes();

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');

    const timeContainer = document.querySelector('.time');
    timeContainer.innerHTML = `${formattedHours} : ${formattedMinutes}`;


    const body = document.body;
    body.classList.remove('from4', 'from6', 'from10', 'from17','from19', 'from20', 'from22');
    if (hours >=4 && hours < 6) {
        body.classList.add('from4');
    }else if (hours >=6 && hours < 10) {
        body.classList.add('from6');
    }else if (hours >=10 && hours < 17) {
        body.classList.add('from10');
    }else if (hours >=17 && hours < 19) {
        body.classList.add('from17');
    }else if (hours >=19 && hours < 20) {
        body.classList.add('from19');
    }else if (hours >=20 && hours < 22) {
        body.classList.add('from20');
    }else  {
        body.classList.add('from22');
    }


}



function getWeather() {
        let cityName = inputEnterCity.value;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`


        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                cityTime(data.timezone)

                if (clockInterval) {
                    clearInterval(clockInterval);
                }

                clockInterval =  setInterval(() => {
                    cityTime(data.timezone);
                }, 1000);

                temperature.innerHTML = `${Math.round(data.main.temp)} `
                feelsLikeToday.innerHTML = `${Math.round(data.main.feels_like)}°`
                humidityToday.innerHTML = `${Math.round(data.main.humidity)}%`
                windToday.innerHTML =`${Math.round(data.wind.speed)} km/h`

                higherTodayTemp.innerHTML =`  ${Math.round(data.main.temp_max)}°`
                lowerTodayTemp.innerHTML =`  ${Math.round(data.main.temp_min)}°`

                const desc = data.weather[0].description;
                descr.innerHTML = desc.charAt(0).toUpperCase() + desc.slice(1);

                const weatherCondition = data.weather[0].main;

                if (weatherCondition === 'Clear') {
                    weatherImg.src = 'photos/weather/sun.gif';
                } else if (weatherCondition === 'Clouds') {
                    weatherImg.src = 'photos/weather/cloud.gif';
                } else if (weatherCondition === 'Rain' || weatherCondition === 'Drizzle') {
                    weatherImg.src = 'photos/weather/rain.gif'; // Дощ
                } else {
                    weatherImg.src = 'photos/weather/sunRain.png';
                }


            })
            .catch(err => console.log('Помилка при завантаженні даних з сервера: ', err));


    fetch(forecastUrl)
        .then(res => res.json())
        .then(forecastData => {
            console.log("Дані прогнозу:", forecastData);

            const forecastCards = document.querySelectorAll('.ForecastContainer');
            forecastCards.forEach((card, index) =>{
                const dayElement = card.querySelector('.Day');

                const forecastItem = forecastData.list[index * 8];
                if (forecastItem) {
                    const date = new Date(forecastItem.dt * 1000);
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                    dayElement.innerHTML = dayName;
                }


                const highTempElement = card.querySelector('.highTempDay');
                const lowTempElement = card.querySelector('.lowTempDay');
                const iconElement = card.querySelector('.iconDay');
                dayElement.innerHTML = `${dayElement.innerText}`;

                highTempElement.innerHTML = `Hi ${Math.round(forecastItem.main.temp_max)}°`;
                lowTempElement.innerHTML = `Lo ${Math.round(forecastItem.main.temp_min)}°`;

                const iconCode = forecastItem.weather[0].icon;
                console.log(forecastItem.weather[0].icon)
                iconElement.src = `https://openweathermap.org/img/wn/${iconCode}.png`;

            })






        })
        .catch(err => console.log('Помилка завантаження прогнозу: ', err));


}


containerImgLoupe.addEventListener('click', () => {
    getWeather();
})

inputEnterCity.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        getWeather();
    }
})










