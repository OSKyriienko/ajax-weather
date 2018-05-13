function scriptRequest(url, onSuccess, onError) {
  var scriptOk = false; // флаг, что вызов прошел успешно
  var callbackName = 'cb' + String(Math.random()).slice(-6);

  url += ~url.indexOf('?') ? '&' : '?';
  url += 'callback=CallbackRegistry.' + callbackName;
  //console.log(url);
  CallbackRegistry[callbackName] = function(data) {
    scriptOk = true; 
    delete CallbackRegistry[callbackName]; 
    onSuccess(data); 
  };

  function checkCallback() {
    if (scriptOk) return; // сработал обработчик?
    delete CallbackRegistry[callbackName];
    onError(url); // нет - вызвать onError
  }

  var script = document.createElement('script');
  script.onreadystatechange = function() {
    if (this.readyState == 'complete' || this.readyState == 'loaded') {
      this.onreadystatechange = null;
      setTimeout(checkCallback, 0); // Вызвать checkCallback - после скрипта
    }
  }
  script.onload = script.onerror = checkCallback;
  script.src = url;
  document.body.appendChild(script);
}

function renderIcon(icon,summary) {
  switch(summary) {
  	case 'clear-night':
  	  icon.classList.remove('night-clear','clear','cloudy-clear','night-cloudy-clear','cloudy','rain');
  	  icon.classList.add('night-clear');
  	  break;
  	case 'clear-day':
  	  icon.classList.remove('night-clear','clear','cloudy-clear','night-cloudy-clear','cloudy','rain');
  	  icon.classList.add('clear');
  	  break;
  	case 'partly-cloudy-day':
  	  icon.classList.remove('night-clear','clear','cloudy-clear','night-cloudy-clear','cloudy','rain');
  	  icon.classList.add('cloudy-clear');
  	  break;
  	case 'partly-cloudy-night':
  	  icon.classList.remove('night-clear','clear','cloudy-clear','night-cloudy-clear','cloudy','rain');
  	  icon.classList.add('night-cloudy-clear');
  	  break;
  	case 'cloudy':
  	  icon.classList.remove('night-clear','clear','cloudy-clear','night-cloudy-clear','cloudy','rain');
  	  icon.classList.add('cloudy');
  	  break;
  	case 'wind':
  	  icon.classList.remove('night-clear','clear','cloudy-clear','night-cloudy-clear','cloudy','rain');
  	  icon.classList.add('cloudy');
  	  break;
    case 'rain':
      icon.classList.remove('night-clear','clear','cloudy-clear','night-cloudy-clear','cloudy','rain');
  	  icon.classList.add('rain');
  	  break;
  }
}

function renderDefault(data) {
  var $temperature = document.getElementById('temperature');
  $temperature.textContent = getCelsiusTemperature(data.currently.apparentTemperature);
  var $icon = document.querySelector('.icon');
  var summary = data.currently.icon;
  //console.log(data);
  renderIcon($icon,summary);
  var dateForSky = new Date();
  var $sky = document.querySelector('#wrapper');
  var hour = dateForSky.getHours()+'';
  switch(hour) {
  	case '0':
  	case '1':
  	case '2':
  	case '3':
  	case '4':
  	case '5':
  	case '22':
  	case '23':
  	  $sky.className = 'sky-night';
  	  break;
  	case '6':
  	case '7':
  	case '8':
  	case '9':
  	case '10':
  	case '11':
  	  $sky.className = 'sky-morning';
  	  break;
  	case '12':
  	case '13':
  	case '14':
  	case '15':
  	case '16':
  	case '17':
  	  $sky.className = 'sky-afternoon';
  	  break;  
  	case '18':
  	case '19':
  	case '20':
  	case '21':
  	  $sky.className = 'sky-evening';
  	  break;   
  }	  
}

function renderDate(data) {
  var $morning = document.querySelector('.morning');
  $morning.textContent = getCelsiusTemperature(data.hourly.data[8].apparentTemperature) + String.fromCharCode(176);
  var $morningIcon = document.querySelector('.icon-morning');
  var summary = data.hourly.data[8].icon;
  renderIcon($morningIcon,summary);
  var $afternoon = document.querySelector('.afternoon');
  $afternoon.textContent = getCelsiusTemperature(data.hourly.data[12].apparentTemperature) + String.fromCharCode(176);
  var $afternoonIcon = document.querySelector('.icon-afternoon');
  summary = data.hourly.data[12].icon;
  renderIcon($afternoonIcon,summary);
  var $evening = document.querySelector('.evening');
  $evening.textContent = getCelsiusTemperature(data.hourly.data[18].apparentTemperature) + String.fromCharCode(176);
  var $eveningIcon = document.querySelector('.icon-evening');
  summary = data.hourly.data[18].icon;
  renderIcon($eveningIcon,summary);
  var $night = document.querySelector('.night');
  $night.textContent = getCelsiusTemperature(data.hourly.data[8].apparentTemperature) + String.fromCharCode(176);
  var $nightIcon = document.querySelector('.icon-night');
  summary = data.hourly.data[23].icon;
  renderIcon($nightIcon,summary);
  var $day = document.querySelector('.currentDay');
  var currDate = new Date(time*1000);
  var currDateDay = currDate.getDate();
  var currDateMonth = currDate.getMonth();
  var monthArray = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  $day.textContent = `${currDateDay} ${monthArray[currDateMonth]}`;
  //console.log(data);
}

function fail(url) {
  alert( 'Ошибка при запросе ' + url );
}

function getCelsiusTemperature(degreeFahr) {
	return Math.round(((degreeFahr - 32)*5)/9);
}

function myGetDate() {
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth();
	var year = date.getFullYear(); 
  var mounthArray = ['January','February','March','April','May','June','July','August','September','October','November','December'];
	var $date = document.getElementById('pDate');
	$date.textContent = `${day} ${mounthArray[month]} ${year}`;

}

function myGetTime() {
	var date = new Date();
	var $time = document.getElementById('pTime');
	var hours = date.getHours();
	var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    if (minutes < 10) {
    	minutes = '0' + minutes;
    }
    if (seconds < 10) {
    	seconds = '0' + seconds;
    }	
	$time.textContent = `${hours}:${minutes}:${seconds}`;
}

function myGetWeekDay() {
	var date = new Date();
	var weekDay = date.getDay();
    var weekArray = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var $dayweek = document.getElementById('pDayWeek');
    $dayweek.textContent = `${weekArray[weekDay]}`;
}

function getPlace() {
	fetch(urlPlace)
	.then(function(response) {
		return response.json();
	})
	.then(function(data) {
		var $place = document.getElementById('location');
		$place.textContent = data.results[0].address_components[3].short_name;
	})
	.catch(function(err) {
		console.log(err);
	})
}

var urlPlace = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=49.839683,24.029717&key=AIzaSyBI_Y8mUQxzo4sBrPh6VH9b8fHsFMbtXsI';
getPlace();

var urlTemperature = 'https://api.darksky.net/forecast/636a0bde02cbc1f76dd89fb50ebd30bf/49.839683,24.029717';
var CallbackRegistry = {}; 
scriptRequest(urlTemperature, renderDefault, fail); 
// render Info about Date. Info updates every second
var timerId = setInterval(function() {
	myGetDate();
	myGetTime();
	myGetWeekDay();
},1000);

var timerIdDegree = setInterval(function() {   //autoupdating once at 6 min
	scriptRequest(urlTemperature, renderDefault, fail); 
},360000);

var date = new Date();
var year = date.getFullYear();
var month = date.getMonth();
var day = date.getDate();
var currentDay = new Date(year,month,day);
var time = Math.floor(Date.parse(currentDay)/1000);  //current day in Seconds
scriptRequest(`${urlTemperature},${time}`, renderDate, fail); 

var $btnNext = document.querySelector('.next');
$btnNext.addEventListener('click',function() {
	time = time + 24*60*60;
	scriptRequest(`${urlTemperature},${time}`, renderDate, fail);
});

var $btnPrev = document.querySelector('.prev');
$btnPrev.addEventListener('click',function() {
	time = time - 24*60*60;
	scriptRequest(`${urlTemperature},${time}`, renderDate, fail);
});

