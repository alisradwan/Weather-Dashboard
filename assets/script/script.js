let $cityDate = moment().format("l");
$("#currentdate").text($cityDate);

let $clicked = $("#buttonsearchh");
$clicked.on("click", GetInfo);
$clicked.on("click", searchSave);
$("input").keyup(function () {
  if (event.key === "Enter") {
    $clicked.click();
  }
});

function GetInfo() {
  var newName = document.getElementById("cityinput");
  var city = document.getElementById("namecity");
  city.innerHTML = newName.value;

  fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      newName.value +
      "&appid=40f4c77388a057c0ac7ef4a8cf79af85&units=imperial"
  )
    .then((Response) => {
      console.log("resolved", Response);
      return Response.json();
    })
    .then((data) => {
      console.log(data);

      //for the current weather
      let newName = data.name;
      let currentTemp = data.main.temp;
      let currentWind = data.wind.speed;
      let currentHum = data.main.humidity;
      let currentIconURL =
        "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";

      $("#namecity").text(newName);
      $("#tempcity").text(currentTemp + "°F");
      $("#windspeed").text(currentWind + " mph");
      $("#humcity").text(currentHum + "%");
      $(".weathericon").attr("src", currentIconURL);
    });

  fetch(
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
      newName.value +
      "&appid=40f4c77388a057c0ac7ef4a8cf79af85&units=imperial"
  )
    .then((Response) => {
      console.log("resolved", Response);
      return Response.json();
    })
    .then((data) => {
      let dataCardInfo = [];

      for (i = 0; i < data.list.length; i++) {
        if (data.list[i].dt_txt.includes("12:00:00") === true) {
          dataCardInfo.push(data.list[i]);
        }
      }

      for (i = 0; i < dataCardInfo.length; i++) {
        $("#day" + (i + 1)).text(dataCardInfo[i].dt_txt.split(" ")[0]);
      }

      let icons = [];
      let iconsURL = [];
      for (i = 1; i < data.list.length; i++) {
        icons[i] = data.list[i].weather[0].icon;
      }
      icons = icons.filter((item) => item);
      for (i = 0; i < icons.length; i++) {
        iconsURL[i] = "http://openweathermap.org/img/w/" + icons[i] + ".png";
      }
      for (i = 0; i < iconsURL.length; i++) {
        $("#icon" + i).attr({ src: iconsURL[i], alt: "Daily Weather Icon" });
      }

      let Temps = [];

      for (i = 0; i < data.list.length; i++) {
        Temps[i] = data.list[i].main.temp + " °F";
      }
      Temps = Temps.filter((item) => item);
      // loop through and display
      for (i = 0; i < Temps.length; i++) {
        $("#Tempday" + (i + 1)).text("Temp: " + Temps[i]);
      }

      let winds = [];

      for (i = 0; i < data.list.length; i++) {
        winds[i] = data.list[i].wind.speed + " mph";
      }

      for (i = 0; i < winds.length; i++) {
        $("#windday" + (i + 1)).text("Wind: " + winds[i]);
      }

      let humiditys = [];

      for (i = 0; i < data.list.length; i++) {
        humiditys[i] = data.list[i].main.humidity + " %";
      }

      for (i = 0; i < humiditys.length; i++) {
        $("#humday" + (i + 1)).text("Humidity: " + humiditys[i]);
      }

      console.log(dataCardInfo);
      console.log(data);
    })
    .catch((err) => {
      console.log("rejected", err);
    });
}

let oldcities = [];

function searchSave() {
  var newName = document.getElementById("cityinput");
  let newcity = newName.value;
  oldcities.push(newcity);
  oldcities = [...new Set(oldcities)];
  // put in localStorage
  localStorage.setItem("cities", JSON.stringify(oldcities));
  // display in HTML
  for (i = 0; i <= oldcities.length - 1; i++) {
    // iterate through, displaying in HTML
    $("#search" + i).text(oldcities[i]);
    $("#search" + i).addClass("past");
  }
}

$("section").on("click", ".past", savedsearch);

function savedsearch() {
  // var for text of pastcityname
  let $oldCity = $(this).text();
  // put it in the input field
  $("#cityinput").val($oldCity);
  // this triggers the original click listener, above citysearch()
  $clicked.trigger("click");
}
