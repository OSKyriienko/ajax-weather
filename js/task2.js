const image = document.querySelector('.class-image');
var init = {
	method: 'GET',
	mode: 'no-cors',
	cache: 'default' };
}

function getWeather(url,param) {
  fetch(url)
    .then (function(response) {
      if (!response.ok) return new Error(response);
      return response.blob();
    })
    .then (function(myBlob) {
    	image.src = URL.createObjectURL(myBlob);
    })
    .catch(function(err) { console.log(err); });
}


getWeather("flower.jpg",init);