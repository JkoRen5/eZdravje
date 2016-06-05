
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


function izpisiPodatke(){
    ehrId = document.getElementById("izbranEHR").value;
    $.ajax({
    url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
    type: 'GET',
    headers: {
        "Authorization": authorization
    },
    success: function (data) {
        var party = data.party;
        document.getElementById("pName").value = party.firstNames+" "+party.lastNames;
        document.getElementById("pBDay").value = party.dateOfBirth;
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

function odstraniPredpis(elem){
    elem.parentNode.remove();
}
