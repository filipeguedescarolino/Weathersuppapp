// Cliente SIDE
// GET Request to the weather info API
let baseURL = "http://api.openweathermap.org/data/2.5/weather";
const apiKey = "605ecf55e91fde13f9baa6c72a0a30eb";

// We need to add +1 into month since january = 0
let d = new Date();
let currentDate = d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear();

document.getElementById("generate").addEventListener("click", performAction);

function performAction(e) {
    // Select the actual value of an HTML input to include in POST, what the user enter themselfes
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

//We use the geolocation function to get the user coordinates. It will log the values into the lat and let var
if ("geolocation" in navigator) {
    console.log("geolocation is avaliable");
    navigator.geolocation.getCurrentPosition(position => {
        let lat = position.coords.latitude;
        let long = position.coords.longitude;
        document.getElementById("lat").textContent = lat;
        document.getElementById("long").textContent = long;
        console.log(position);



        const data = { lat, long };
        const options = {
            method: 'POST',
            credentials: "same-origin",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        };

        fetch("file:///C:/code/udacity/Weather-web-api/index.html/api", options);

    });

} else {
    console.log("geolocation is not avaliable");
}