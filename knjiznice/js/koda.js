
var baseUrl = 'https://rest.ehrscape.com/rest/v1';
var queryUrl = baseUrl + '/query';

var username = "ois.seminar";
var password = "ois4fri";

var authorization = "Basic " + btoa(username + ":" + password);
var ehrId;

/**
 * Prijava v sistem z privzetim uporabnikom za predmet OIS in pridobitev
 * enolične ID številke za dostop do funkcionalnosti
 * @return enolični identifikator seje za dostop do funkcionalnosti
 */
function getSessionId() {
    var response = $.ajax({
        type: "POST",
        url: baseUrl + "/session?username=" + encodeURIComponent(username) +
                "&password=" + encodeURIComponent(password),
        async: false
    });
    return response.responseJSON.sessionId;
}

// Tabele, kamor se bodo shranile meritve pacienta
var Mteza;
var Mvisina;
var Mtemp;
var MStlak;
var MDtlak;
var Mkisik;


/**
 * Generator podatkov za novega pacienta, ki bo uporabljal aplikacijo. Pri
 * generiranju podatkov je potrebno najprej kreirati novega pacienta z
 * določenimi osebnimi podatki (ime, priimek in datum rojstva) ter za njega
 * shraniti nekaj podatkov o vitalnih znakih.
 * @param stPacienta zaporedna številka pacienta (1, 2 ali 3)
 * @return ehrId generiranega pacienta
 */
function generirajPodatke(stPacienta) {
  ehrId = "";
  $.ajaxSetup({
      
    headers: {
        "Authorization": authorization
    }
    });
  // TODO: Potrebno implementirati
    $.ajax({
        url: baseUrl + "/ehr",
        type: 'POST',
        success: function (data) {
            var ehrId = data.ehrId;
            var partyData;
            var compositionData;
            if (stPacienta === 1) {
                partyData = {
                    firstNames: "Saxton",
                    lastNames: "Hale",
                    dateOfBirth: "1962-4-22T00:01",
                    partyAdditionalInfo: [
                        {
                            key: "ehrId",
                            value: ehrId
                        }
                    ]
                };
                compositionData = {
                    "ctx/time": "2015-3-19T14:00Z",
                    "ctx/language": "en",
                    "ctx/territory": "SI",
                    "vital_signs/body_temperature/any_event/temperature|magnitude": 37.1,
                    "vital_signs/body_temperature/any_event/temperature|unit": "°C",
                    "vital_signs/blood_pressure/any_event/systolic": 130,
                    "vital_signs/blood_pressure/any_event/diastolic": 80,
                    "vital_signs/height_length/any_event/body_height_length": 191,
                    "vital_signs/body_weight/any_event/body_weight": 92.2
                };
            } else if (stPacienta === 2) {
                partyData = {
                    firstNames: "Pink",
                    lastNames: "Guy",
                    dateOfBirth: "1-1-01T00:01",
                    partyAdditionalInfo: [
                        {
                            key: "ehrId",
                            value: ehrId
                        }
                    ]
                };
                compositionData = {
                    "ctx/time": "2010-5-1T10:00Z",
                    "ctx/language": "en",
                    "ctx/territory": "SI",
                    "vital_signs/body_temperature/any_event/temperature|magnitude": 36.6,
                    "vital_signs/body_temperature/any_event/temperature|unit": "°C",
                    "vital_signs/blood_pressure/any_event/systolic": 420,
                    "vital_signs/blood_pressure/any_event/diastolic": 69,
                    "vital_signs/height_length/any_event/body_height_length": 178,
                    "vital_signs/body_weight/any_event/body_weight": 75.4
                };
            } else if (stPacienta === 3) {
                partyData = {
                    firstNames: "Keith",
                    lastNames: "Sanders",
                    dateOfBirth: "1992-11-12T09:40",
                    partyAdditionalInfo: [
                        {
                            key: "ehrId",
                            value: ehrId
                        }
                    ]
                };
                compositionData = {
                    "ctx/time": "2015-3-19T14:00Z",
                    "ctx/language": "en",
                    "ctx/territory": "SI",
                    "vital_signs/body_temperature/any_event/temperature|magnitude": 69,
                    "vital_signs/body_temperature/any_event/temperature|unit": "°C",
                    "vital_signs/blood_pressure/any_event/systolic": 120,
                    "vital_signs/blood_pressure/any_event/diastolic": 60,
                    "vital_signs/height_length/any_event/body_height_length": 182,
                    "vital_signs/body_weight/any_event/body_weight": 80.2
                };
            }
            
            
            console.log("Ustvarjam...");
            $.ajax({
                url: baseUrl + "/demographics/party",
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(partyData),
                success: function (party) {
                    if (party.action == 'CREATE') {
                        console.log("Pacient "+stPacienta+" je uspesno ustvarjen.");
                    }
                }
            });
             var queryParametri = {
                "ehrId": ehrId,
                templateId: 'Vital Signs',
                format: 'FLAT',
                committer: 'Dr. Me'
            };
            console.log("Vnasam meritve...");
            $.ajax({
                url: baseUrl + "/composition?" + $.param(queryParametri),
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(compositionData),
                success: function (res) {
                    console.log("Pacient "+stPacienta+" je bil pregledan.");
                    document.getElementById("SporocilaONapakah").value = "Pacient je uspesno ustvarjen.";
                    var x = document.getElementById("izbranPacient");
                    var option = document.createElement("option");
                    option.text = partyData.firstNames+" "+partyData.lastNames + " ("+ehrId+")";
                    x.add(option);
                },
                
                error: function (res) {
                    console.log("Pacienta "+stPacienta+" nismo pregledali.");
                    document.getElementById("SporocilaONapakah").value = "Pacient ni bil uspesno ustvarjen.";
                }
            });
        }
    });
    
  return ehrId;
}

function GenerirajTriPaciente() {
    var ehrId1 = generirajPodatke(1);
    var ehrId2 = generirajPodatke(2);
    var ehrId3 = generirajPodatke(3);
    if (ehrId1 && ehrId2 && ehrId3){
        document.getElementById("SporocilaONapakah").value = "Ustvarjeni so pacienti: /n"+ehrId1+"/n"+ehrId2+"/n"+ehrId3+"/n";
    } else {
        
        document.getElementById("SporocilaONapakah").value = "Something went wrong!";
    }
}


// TODO: Tukaj implementirate funkcionalnost, ki jo podpira vaša aplikacija

function nastaviID(index){
    var list = document.getElementById("izbranPacient");
    var pacient = list.options[list.selectedIndex].value;
    var res = pacient.split(" ");
    // Zadnji element je (ehrId)
    var id = res[res.length-1];
    id = id.replace(/[()]/g, '');
    document.getElementById("EHRizbran").value = id;
}

function izpisiPodatke(){
    ehrId = document.getElementById("EHRizbran").value;
    console.log("Izpisujem podatke "+ehrId);
    $.ajax({
    url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
    type: 'GET',
    headers: {
        "Authorization": authorization
    },
    success: function (data) {
        var party = data.party;
        console.log("Nasel podatke. Vpisujem ...")
        // Vpisi osebne podatke, podatke o zadnji meritvi in o zdravilih
        document.getElementById('addDataName').value = party.firstNames+" "+party.lastNames;
        document.getElementById('addDataBday').value = party.dateOfBirth;
        document.getElementById('addDataEHR').value = ehrId;
        zadnjaMeritev();
        vstaviPredpise();
    },
    error: function(data) {
         $('addDataName').value = "Prislo je do napake pri iskanju pacienta.";
        
    }
});
}

function zadnjaMeritev(){
    // Vzemi podatke o meritvah vitalnih znakov pacienta
    console.log("Iscem meritve...")
    $.ajax({
        url: baseUrl + "/view/" + ehrId + "/weight",
        type: 'GET',
        headers: {
            "Authorization": authorization
        },
        success: function (res) {
            
            for (var i in res) {
                var opt = document.createElement('option');
                opt.value = res[i].time;
                opt.innerHTML = res[i].time;
                document.getElementById("MeritveEHR").appendChild(opt);
            }
            
            Mteza = res;
            console.log("Nasel tezo-");
        }
    });
    $.ajax({
        url: baseUrl + "/view/" + ehrId + "/height",
        type: 'GET',
        headers: {
            "Authorization": authorization
        },
        success: function (res) {
            Mvisina = res;
            console.log("Nasel visino-");
        }
    });
    $.ajax({
        url: baseUrl + "/view/" + ehrId + "/blood_pressure",
        type: 'GET',
        headers: {
            "Authorization": authorization
        },
        success: function (res) {
            for (var i in res) {
                MDtlak[i] = res[i].diastolic;
                MStlak[i] = res[i].systolic;
            }
            console.log("Nasel tlak-");
        }
    });
    $.ajax({
        url: baseUrl + "/view/" + ehrId + "/body_temperature",
        type: 'GET',
        headers: {
            "Authorization": authorization
        },
        success: function (res) {
            Mtemp = res;
            console.log("Nasel temperaturo-");
        }
    });
    $.ajax({
        url: baseUrl + "/view/" + ehrId + "/spO2",
        type: 'GET',
        headers: {
            "Authorization": authorization
        },
        success: function (res) {
            Mkisik = res;
            console.log("Nasel kisik-");
        }
    });
    
    
}

function izpisiMeritev(index){
    // Izpisi meritev vitalnih znakov glede na indeks
    var list = document.getElementById("MeritveEHR");
    document.getElementById("addDataMDate").value = list.options[index].value;
    document.getElementById("addDataMHeight").value = Mvisina[index].height;
    document.getElementById("addDataMWeight").value = Mteza[index].weight;
    document.getElementById("addDataMTemp").value = Mtemp[index].temperature;
    document.getElementById("addDataMSP").value = MStlak[index];
    document.getElementById("addDataMDP").value = MDtlak[index];
    document.getElementById("addDataMOxy").value = Mkisik[index].spO2;
    console.log("Prikazal podatke meritve.");
}

function dodajMeritev(){
    // Pacientu z ehrId dodaj novo meritev vitalnih znakov
    $.ajaxSetup({
        headers: {
            "Authorization": authorization
        }
    });
    var compositionData = {
        
        "ctx/time": document.getElementById("insertDataMDate").value,
        "ctx/language": "en",
        "ctx/territory": "SI",
        "vital_signs/body_temperature/any_event/temperature|magnitude": document.getElementById("insertDataMTemp").value,
        "vital_signs/body_temperature/any_event/temperature|unit": "°C",
        "vital_signs/blood_pressure/any_event/systolic": document.getElementById("insertDataMSP").value,
        "vital_signs/blood_pressure/any_event/diastolic": document.getElementById("insertDataMDP").value,
        "vital_signs/height_length/any_event/body_height_length": document.getElementById("insertDataMHeight").value,
        "vital_signs/body_weight/any_event/body_weight": document.getElementById("insertDataMWeight").value
    };
    var queryParams = {
        "ehrId": ehrId,
        templateId: 'Vital Signs',
        format: 'FLAT',
        committer: 'Dr. Me'
    };
    $.ajax({
        url: baseUrl + "/composition?" + $.param(queryParams),
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(compositionData),
        success: function (res) {
            $("#header").html("Store composition");
            $("#result").html(res.meta.href);
        }
    });
}



function ustvariNovEHR() {
    // Ustvari nov EHR zapis iz podatkov v besedilnih poljih
    ehrId = "";
    var Ime = document.getElementById("createNames").value;
    var Priimek = document.getElementById("createLastNames").value;
    var RojDan = document.getElementById("createBDay").value;
    
  $.ajaxSetup({
      
    headers: {
        "Authorization": authorization
    }
    });
  // TODO: Potrebno implementirati
    $.ajax({
        url: baseUrl + "/ehr",
        type: 'POST',
        success: function (data) {
            var ehrId = data.ehrId;
            var partyData;
            var compositionData;
            
            partyData = {
                firstNames: "Saxton",
                lastNames: "Hale",
                dateOfBirth: "1962-4-22T00:01",
                partyAdditionalInfo: [
                    {
                        key: "ehrId",
                        value: ehrId
                    }
                ]
            };
               
            
            
            console.log("Ustvarjam...");
            $.ajax({
                url: baseUrl + "/demographics/party",
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(partyData),
                success: function (party) {
                    if (party.action == 'CREATE') {
                        console.log("Nov pacient je uspesno ustvarjen.");
                    }
                }
            });
            
        }
    });
    
  return ehrId;
}

function vstaviPredpise(){
    console.log("Iscem predpisana zdravila...");
    $.ajax({
        url: baseUrl + "/view/" + ehrId + "/medication",
        type: 'GET',
        headers: {
            "Authorization": authorization
        },
        success: function (res) {
            document.getElementById("medicationsList").innerHTML = "";
            for (var i = 0; i < res.length; i++) {
                // Za vsako zdravilo dodaj okvir
                document.getElementById("medicationsList").append("<div class='row' style='border: 1px gray; padding: 2px;'><span>" +res[i].medicine+ "</span><span> Doza: "+ res[i].quantity_amount +" "+res[i].quantity_unit+"</span><span> Od: "+res[i].start_date+"</span><span> Do: "+res[i].stop_date+"</span><button type='button' value='Remove' onclick='odstraniPredpis(this);'>Odstrani</button></div>");
            }
        },
        error: function(res) {
            document.getElementById("medicationsList").innerHTML = "Napaka pri izpisu predpisanih zdravil";
        }
    });
}

function dodajPredpis(){
    // Glede na podatke na obrazcu doda novo predpisano zdravilo
    
}

function odstraniPredpis(elem){
    elem.parentNode.remove(); //Odstrani prikaz na spletni strani
    
    // Treba je odstraniti se zapis iz ehr
    
    
}
