$("#Submit").on("click", function(e) {
    event.preventDefault();
    var jsondata = { "Username" : $("#Username-Email").val(), "Password" :
        $("#Password").val() };
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://ngeeannpolyshop-1312.restdb.io/rest/customer?q=" + JSON.stringify(jsondata),
        "method": "GET",
        "headers": {
        "content-type": "application/json",
        "x-apikey": "61ef47c9b12f6e7084f734db",
        "cache-control": "no-cache"
        }
    }
      
    $.ajax(settings).done(function (response) {
        if (response.length) {
            console.log("success");
        }
    });
    delete jsondata.Username;
    jsondata.Email = $("#Username-Email").val();

    settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://ngeeannpolyshop-1312.restdb.io/rest/customer?q=" + JSON.stringify(jsondata),
        "method": "GET",
        "headers": {
        "content-type": "application/json",
        "x-apikey": "61ef47c9b12f6e7084f734db",
        "cache-control": "no-cache"
        }
    }

    $.ajax(settings).done(function (response) {
        if (response.length) {
            console.log("success");
        }
    });
});