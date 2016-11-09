$.ajaxSetup({
    async: false
});

var headMap = L.map('mapwin').setView([67, 100], 3);
var regions;
var tto = L.popup({
    closeButton: false,
    data: '',
    maxWidth: 190
});
var iTime, actualTime;

function getNumMasDT(datet) {
    $.getJSON('regions/Moskva.json', function(json){
        for (var j=0; j<40; j++) {
            if (datet < json.list[j].dt){
                iTime = j;
                actualTime = json.list[j].dt;
                break;
            }
        }
    });
}

var ia = new Date();
getNumMasDT(ia.getTime()/1000);

function pusk(){
    $.getJSON('regionsRF.geojson', function(json){
        regions = L.geoJson(json, {
            style: style,
            onEachFeature: newJson
        }).addTo(headMap);
    });
}
pusk();



function newJson(a, layer) {
    layer.on({
        mousemove: tt,
        mouseout: endtt,
        click: tt
    });
}



function tt(e) {
    let region = e.target.feature.properties.NAME.toString();
        tto
            .setLatLng(e.latlng)
            .setContent('<table class="tableg"><caption><i>' + region + '</i>' + getWeatherTable(e) + '</table>')
            .openOn(headMap);
}

function endtt() {
    headMap.closePopup();
}

function style(feature) {
    var a = feature.properties.NAME_LAT.toString();
    $.getJSON('regions/'+a+'.json', function(json){
        b = json.list[iTime].main.temp;
    });
    return {
        fillColor: getColor(+b),
        weight: 2,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
    };
}

var legend = L.control({position: 'topright'});
legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = ['+30', '+20', '+15', '+10', '+5', '0', '-5', '-10', '-15', '-20', '-30'],
        labels = [];

    for (var i = 0; i < grades.length; i++) {
        if (i===0){
            div.innerHTML +=
                '<b>Температура воздуха</b><br><i style="background:' + getColor(+grades[i]+1) + '"></i> Теплее ' + grades[i] + '&#176;C<br>';
        }
        if (grades[i] === 0){
            console.log(0);
            div.innerHTML +=
                '<i style="background:' + getColor(0.1) + '"></i> 0&#176;C<br>';
        }
        div.innerHTML +=
            '<i style="background:' + getColor(+grades[i]) + '"></i> ' +
            (grades[i + 1] ? grades[i + 1] +'&#176;C ... ' + grades[i] + '&#176;C<br>' : grades[i] + '&#176;C и холоднее');
    }
    return div;
};



function getColor(d) {
    return d > 30 ? 'rgb(255,50,11)' :
        d > 20 ? 'rgb(255,96,16)' :
            d > 15 ? 'rgb(255,143,22)' :
                d > 10 ? 'rgb(247,186,36)' :
                    d > 5 ? 'rgb(239,228,51)' :
                        d > 1 ? 'rgb(247,242,122)' :
                            d > 0 ? 'rgb(255,252,198)' :
        d > -5 ? 'rgb(168,247,214)' :
            d > -10 ? 'rgb(101,221,226)' :
                d > -15 ? 'rgb(79,151,230)' :
                    d > -20 ? 'rgb(57,81,233)' :
                        d > -30 ? 'rgb(36,58,176)' :
                            'rgb(17,40,114)';
}

function getWeatherTable(e) {
    var a = e.target.feature.properties.NAME_LAT.toString();
    $.getJSON('regions/'+a+'.json', function(json){
        b = json.list[iTime].main.temp.toFixed(1);
        c = json.list[iTime].weather[0].icon;
        d = json.list[iTime].main.humidity;
        g = json.list[iTime].main.pressure;
        h = json.list[iTime].clouds.all;
        k = json.list[iTime].wind.speed;
        m = json.list[iTime].wind.deg;
    });
    return '<br><img src="//openweathermap.org/img/w/' + c + '.png"></caption>' +
        '<tbody>' +
            '<tr>' +
                '<td>Температура</td>' +
                '<td>' + b +' &#176;C</td>' +
            '</tr>' +
            '<tr>' +
                '<td>Влажность</td>' +
                '<td>'+d+' %</td>' +
            '</tr>' +
            '<tr>' +
                '<td>Давление</td>' +
                '<td>'+(g*0.75).toFixed(0)+' мм рт.ст.</td>' +
            '</tr>' +
            '<tr>' +
                '<td>Облачность</td>' +
                '<td>'+h+' %</td>' +
            '</tr>' +
            '<tr>' +
                '<td>Ветер</td>' +
                '<td>'+k+' м/c ('+ getWindDeg(m) +')</td>' +
            '</tr>' +
        '</tbody>'
}

function getWindDeg(deg) {
    let vector = deg > 90 && deg < 180 ? 'ю' : 'c';
    vector += deg > 45 && deg < 135 ? '-в' :
        deg < 225 && deg > 315 ? '-з' : '';
    return vector;
}

legend.addTo(headMap);

var delem = document.createElement('div');
delem.id = 'delem';
document.body.appendChild(delem);

var t = document.createElement('table');
var tabtr1 = document.createElement('tr');
tabtr1.className = 'tabtr1';
var tabtr2 = document.createElement('tr');
var tabtr3 = document.createElement('tr');
t.className = "tabtime";
delem.appendChild(t);
    for (let i=0, j=39-iTime ; i < j ; i++) {
        let a = new Date((actualTime + 10800 * i) * 1000);
        var b,c,d;
        if (b != a.getMonth()){
            b = a.getMonth();
            var tdMonth = document.createElement('td');
            tdMonth.innerHTML = a.toLocaleString('ru', {month:'long'});
            tabtr1.appendChild(tdMonth);
            tdMonth.colSpan = 1;
        } else {
            tdMonth.colSpan += 1;
        }
        if (c != a.getDate()){
            c = a.getDate();
            var tdDate = document.createElement('td');
            tdDate.innerHTML = c;
            tabtr2.appendChild(tdDate);
            tdDate.colSpan = 1;
        } else {
            tdDate.colSpan += 1;
        }

        let tdHourse = document.createElement('td');
        tdHourse.innerHTML = a.getHours().toString().length == 1 ? '0' + a.getHours(): a.getHours();
        tabtr3.appendChild(tdHourse);
    }
t.appendChild(tabtr1);
t.appendChild(tabtr2);
t.appendChild(tabtr3);

$('<input/>', {
    type: 'range',
    min: actualTime,
    max: actualTime+10800*(38-iTime),
    step: 10800,
    value: actualTime,
    oninput: 'getCurrentTimeMap(value)'
}).appendTo('#delem');

function getCurrentTimeMap(val) {
    headMap.removeLayer(regions);
    getNumMasDT(val);
    pusk();
}
