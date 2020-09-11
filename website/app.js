// couldnt find a way to include an error when the zip-code was false so searched for an alert
var alerted = localStorage.getItem('alerted') || '';
if (alerted != 'yes') {
    alert("insert a valid zip-code in order to get the weather data(temperature,date)");
    localStorage.setItem('alerted', 'yes');
}

// Cliente SIDE
// GET Request to the weather info API


let baseURL = "http://api.openweathermap.org/data/2.5/weather";
const apiKey = "605ecf55e91fde13f9baa6c72a0a30eb";

// We need to add +1 into month since january = 0
let d = new Date();
let currentDate = d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear();

document.getElementById("generate").addEventListener("click", performAction);

function performAction(e) {
    // Select the actual value of an HTML input to include in POST
    const zipCode = document.getElementById("zip").value;
    const feelings = document.getElementById("feelings").value;


    //API call
    getWeather(baseURL, zipCode, apiKey).then(function(data) {
        console.log(data)

        // Post 
        postData("http://localhost:8000/add", {
            date: currentDate,
            temp: data.main.temp,
            content: feelings
        })

        updateUI();
    })
};

// Function to GET Web API 
const getWeather = async(baseURL, zip, api) => {

    const response = await fetch(baseURL + "?zip=" + zip + "&units=metric" + "&appid=" + api);

    try {
        const data = await response.json();
        return (data);

    } catch (error) {

        console.log("error", error);
    }
}

// POST Request client-side 
const postData = async(url = "", data = {}) => {
    const response = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        // we need to put the data into json
        body: JSON.stringify(data),
    });

    try {
        const newData = await response.json();
        console.log(newData);
        return newData

    } catch (error) {

        console.log("error", error);
    }
}

// Dynamic UI
const updateUI = async() => {
    const request = await fetch("http://localhost:8000/all");

    try {
        const allData = await request.json();

        document.getElementById("date").innerHTML = `Date: ${allData.date}`;
        document.getElementById("temp").innerHTML = `Temperature: ${allData.temp}`;
        document.getElementById("content").innerHTML = `Fellings: ${allData.content}`;

    } catch (error) {

        console.log("error", error);
    }
}