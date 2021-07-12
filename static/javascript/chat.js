const chatBody = $('.ChatWindow');
var itr = 0;
var flag = false;
var exec = 0;

var lat;
var lon;

var selectedFromTemplate = [];

const bringUpForm = document.getElementById('bringUpForm');

$(document).ready(function() {

    initWatsonAssistant();

    if (flag == true)
        setTimeout(function() { run(); }, 5000);

    $("#myform").on("submit", function(event) {
        event.preventDefault();
        watson();
    });

});


(function() {
    var $ChatInput;
    $ChatInput = $('.ChatInput-input');
    $ChatInput.keyup(function(e) {
        var $this;
        if (e.shiftKey && e.which === 13) {
            e.preventDefault();
            return false;
        }
        $this = $(this);
        if (e.which === 13) {
            watson();
        }
    });

}).call(this);

function addToDB() {
    //respcognome = "provacognome";
	respmodello = "";
	respmatricolamotore = "";
	respcopoflotte = "";
	respdescrizione1 = "";
	respdescrizione2 = "";
	respdescrizione3 = "";
	respcampolibero = "";
	respnote = "";
	respstato = "";
    respfoto=linkupload;

	
    msgas = chatBody.find('div.ChatItem--customer').find('div.ChatItem-chatContent').find('div.ChatItem-chatText').last().html();

    responseList = msgas.split(',');
    respdata = msgas.split('Data ')[1].split('.')[0];
    respcognome = msgas.split(', ')[1].split('!')[0];
    respprogetto = msgas.split('Progetto ')[1].split('.')[0];
    respvin = msgas.split('VIN ')[1].split('.')[0];
    respkmtotali = msgas.split('totali ')[1].split(' km')[0];
    resptipodistrada = msgas.split('strada ')[1].split('.')[0];
    respluogo = msgas.split('Luogo ')[1].split('.')[0];
    resplitri =  msgas.split('Litri ')[1].split(' l')[0];
    respsegnalazione = msgas.split('Segnalazione ')[1].split('.')[0]

    addDatabaseContents(respdata, respcognome, respprogetto, respmodello, respvin, respmatricolamotore, respcopoflotte, respkmtotali, resptipodistrada, respluogo, resplitri, respsegnalazione, respdescrizione1, respdescrizione2, respdescrizione3, respcampolibero, respstato, respnote,respfoto);
    //addDatabaseContents(respdata, respmodello, respvin, respkmtotali, resptipodistrada, resprifornimento, respluogo, resplitri, respsegnalazione);

}


function addToDB2() {
    //respcognome = "provacognome";
	resptipodistrada = "";
	respluogo = "";
	respdescrizione1 = "";
	respdescrizione2 = "";
	respdescrizione3 = "";
	resplitri = "";
	respsegnalazione = "";
    respfoto=linkupload;


	
    msgas = chatBody.find('div.ChatItem--customer').find('div.ChatItem-chatContent').find('div.ChatItem-chatText').last().html();

    responseList = msgas.split(',');
    respdata = msgas.split('Data ')[1].split('.')[0];
    respcognome = msgas.split(', ')[1].split('!')[0];
    respprogetto = msgas.split('Progetto ')[1].split('.')[0];
	respmodello = msgas.split('Modello ')[1].split('.')[0];
    respvin = msgas.split('VIN ')[1].split('.')[0];
	respmatricolamotore = msgas.split('motore ')[1].split('.')[0];
	respcopoflotte = msgas.split('Tipologia ')[1].split('.')[0];
    respkmtotali = msgas.split('totali ')[1].split(' km')[0];
    respdescrizione1 = msgas.split('Descrizione1 ')[1].split('.')[0];
    respdescrizione2 = msgas.split('Descrizione2 ')[1].split('.')[0];
    respdescrizione3 = msgas.split('Descrizione3 ')[1].split('.')[0];
    respcampolibero =  msgas.split('libero ')[1].split('.')[0];
	respstato =  msgas.split('attività ')[1].split('.')[0];
    respnote = msgas.split('Note ')[1].split('.')[0]

    addDatabaseContents(respdata, respcognome, respprogetto, respmodello, respvin, respmatricolamotore, respcopoflotte, respkmtotali, resptipodistrada, respluogo, resplitri, respsegnalazione, respdescrizione1, respdescrizione2, respdescrizione3, respcampolibero, respstato, respnote,respfoto);
    //addDatabaseContents(respdata, respmodello, respvin, respkmtotali, resptipodistrada, resprifornimento, respluogo, resplitri, respsegnalazione);

}
function addToDB3() {
    //SOLO SEGNALAZIONE
    //respcognome = "provacognome";
	respmodello = "";
	respmatricolamotore = "";
	respcopoflotte = "";
	respdescrizione1 = "";
	respdescrizione2 = "";
	respdescrizione3 = "";
	respcampolibero = "";
	respnote = "";
	respstato = "";
    respluogo= "";
    resplitri= "";
    respfoto=linkupload;

	
    msgas = chatBody.find('div.ChatItem--customer').find('div.ChatItem-chatContent').find('div.ChatItem-chatText').last().html();

    responseList = msgas.split(',');
    respdata = msgas.split('Data ')[1].split('.')[0];
    respcognome = msgas.split(', ')[1].split('!')[0];
    respprogetto = msgas.split('Progetto ')[1].split('.')[0];
    respvin = msgas.split('VIN ')[1].split('.')[0];
    respkmtotali = msgas.split('totali ')[1].split(' km')[0];
    resptipodistrada = msgas.split('strada ')[1].split('.')[0];
    //resprifornimento = msgas.split('Rifornimento ')[1].split('.')[0];
    //respluogo = msgas.split('Luogo ')[1].split('.')[0];
    //resplitri =  msgas.split('Litri ')[1].split(' l')[0];
    respsegnalazione = msgas.split('Segnalazione ')[1].split('.')[0]

    addDatabaseContents(respdata, respcognome, respprogetto, respmodello, respvin, respmatricolamotore, respcopoflotte, respkmtotali, resptipodistrada, respluogo, resplitri, respsegnalazione, respdescrizione1, respdescrizione2, respdescrizione3, respcampolibero, respstato, respnote,respfoto);
    //addDatabaseContents(respdata, respmodello, respvin, respkmtotali, resptipodistrada, resprifornimento, respluogo, resplitri, respsegnalazione);

}
function addToDB4() {
    //SOLO RIFORNIMENTO
    //respcognome = "provacognome";
	respmodello = "";
	respmatricolamotore = "";
	respcopoflotte = "";
	respdescrizione1 = "";
	respdescrizione2 = "";
	respdescrizione3 = "";
	respcampolibero = "";
	respnote = "";
	respstato = "";
    respsegnalazione="";
    respfoto=linkupload;

	
    msgas = chatBody.find('div.ChatItem--customer').find('div.ChatItem-chatContent').find('div.ChatItem-chatText').last().html();

    responseList = msgas.split(',');
    respdata = msgas.split('Data ')[1].split('.')[0];
    respcognome = msgas.split(', ')[1].split('!')[0];
    respprogetto = msgas.split('Progetto ')[1].split('.')[0];
    respvin = msgas.split('VIN ')[1].split('.')[0];
    respkmtotali = msgas.split('totali ')[1].split(' km')[0];
    resptipodistrada = msgas.split('strada ')[1].split('.')[0];
    respluogo = msgas.split('Luogo ')[1].split('.')[0];
    resplitri =  msgas.split('Litri ')[1].split(' l')[0];
    //respsegnalazione = msgas.split('Segnalazione ')[1].split('.')[0]

    addDatabaseContents(respdata, respcognome, respprogetto, respmodello, respvin, respmatricolamotore, respcopoflotte, respkmtotali, resptipodistrada, respluogo, resplitri, respsegnalazione, respdescrizione1, respdescrizione2, respdescrizione3, respcampolibero, respstato, respnote,respfoto);
    //addDatabaseContents(respdata, respmodello, respvin, respkmtotali, resptipodistrada, resprifornimento, respluogo, resplitri, respsegnalazione);

}



async function watson() {
    var $ChatInput;
    $ChatInput = $('.ChatInput-input');
    newText = $ChatInput.html();
    formData = newText.split('<')[0];
    $ChatInput.html('');

    $('.ChatWindow').append(
        '<div class="ChatItem ChatItem--expert"> <div class="ChatItem-meta"> <div class="ChatItem-avatar"> <img class="ChatItem-avatarImage" src="static/user.png"> </div> </div> <div class="ChatItem-chatContent"> <div class="ChatItem-chatText">' + newText + '</div> <div class="ChatItem-timeStamp"><strong>Customer</strong></div> </div> </div>');

    $('.ChatWindow').append(
        '<div class="ChatItem ChatItem--customer"> <div class="ChatItem-meta"> <div class="ChatItem-avatar"> <img class="ChatItem-avatarImage" src="static/duc-logo.png"> </div> </div> <div class="ChatItem-chatContent"> <div class="ChatItem-chatText"><label class="bx--label bx--skeleton"></label></div> <div class="ChatItem-timeStamp"><strong>Watson Chatbot</strong></div> </div> </div>');

    await $.ajax({
        url: '/getWatsonAssistantResponse',
        method: 'get',
        data: { msg: formData },
        dataType: 'json',
        
        success: function(data) {
            if (data.response_type == "option") {
                chatBody.find('div.ChatItem--customer').last().remove();
                $('.ChatWindow').append(
                    '<div class="ChatItem ChatItem--customer"> <div class="ChatItem-meta"> <div class="ChatItem-avatar"> <img class="ChatItem-avatarImage" src="static/duc-logo.png"> </div> </div> <div class="ChatItem-chatContent"> <div class="ChatItem-chatText">' + data.message + '</div> <div class="ChatItem-chatText"><ul class="here"> </ul> </div> <div class="ChatItem-timeStamp"><strong>Watson Chatbot</strong></div> </div> </div>');

                data.options.forEach(element => {
                    chatBody.find('div.ChatItem--customer').find('div.ChatItem-chatContent').find('div.ChatItem-chatText').find('ul.here').last().append(

                        `<a class="bx--tag bx--tag--red" type="submit" id="submitbutton" onclick="optionsSelected('${element.label}');" > <strong class= "bx--tag__label" style="color:#ffffff">${element.label}</strong> </a>`
                    );
                });
                if (data.message.substring(0, 8) == "Entrambe") {
                    addToDB();
                }
                if (data.message.substring(0, 8) == "Officina") {
                    addToDB2();
                }
                if (data.message.substring(0, 12) == "Segnalazione") {
                    addToDB3();
                }
                
                if (data.message.substring(0, 12) == "Rifornimento") {
                    addToDB4();
                }

                itr = itr + 1;

            } else {

                chatBody.find('div.ChatItem--customer').last().remove();
                $('.ChatWindow').append(
                    '<div class="ChatItem ChatItem--customer"> <div class="ChatItem-meta"> <div class="ChatItem-avatar"> <img class="ChatItem-avatarImage" src="static/duc-logo.png"> </div> </div> <div class="ChatItem-chatContent"> <div class="ChatItem-chatText">' + data.message + '</div> <div class="ChatItem-timeStamp"><strong>Watson Chatbot</strong></div> </div> </div>');

                if (data.message.substring(0, 8) == "Entrambe") {
                    addToDB();
                }
                if (data.message.substring(0, 8) == "Officina") {
                    addToDB2();
                }
                if (data.message.substring(0, 12) == "Segnalazione") {
                    addToDB3();
                }
                
                if (data.message.substring(0, 12) == "Rifornimento") {
                    addToDB4();
                }
                //if (data.message.substring(0,17) =="Inserisci la data") {
                  //  chatBody.find('div.ChatItem--customer').find('div.ChatItem-chatContent').find('div.ChatItem-chatText').last().append(
                   //' <form action="https://s3.us-south.cloud-object-storage.appdomain.cloud/buck-prova/" method="post" id="aws_upload_form"  enctype="multipart/form-data"> <input type="file" name="file" /> <input type="submit" value="Upload File" /> </form>'
               
                 //   )
                if (data.message.substring(0,17) =="Inserisci la foto") {
                    chatBody.find('div.ChatItem--customer').find('div.ChatItem-chatContent').find('div.ChatItem-chatText').last().append(
                   ' <form action="" method="post" id="aws_upload_form"  enctype="multipart/form-data"> <input class="bx--tag bx--tag--red" type="file" name="file" strong class= "bx--tag__label" style="color:#ffffff" value="Scegli il file"/><input type="submit" class="bx--tag bx--tag--red" strong class= "bx--tag__label" style="color:#ffffff" "value="Carica il file" /> </form>'
               
                    )
                   // $("#inviafoto").click(function(e) {
                    //    e.preventDefault();
                        //var blobFile = $('#inviafoto').files[0];
                        //var formData = new FormData();
                        //formData.append("fileToUpload", blobFile);

                        //the_file = this.elements['file'].files[0];
	                    //var filename = Date.now() + '.' + the_file.name.split('.').pop();
                        //$(this).find("input[name=key]").val(filename);
                        //$(this).find("input[name=Content-Type]").val(the_file.type);
                        //var post_url = $(this).attr("action"); //get form action url
                        //var form_data = new FormData(this); //Creates new FormData object
                        
                        //the_file = this.elements['file'].files[0];
                        //var filename = Date.now() + '.' + the_file.name.split('.').pop();
                        //$(this).find("input[name=key]").val(filename);
                        //$(this).find("input[name=Content-Type]").val(the_file.type);

                        //var post_url = $(this).attr("action"); //get form action url
                        //var form_data = new FormData(this); //Creates new FormData object

                        $("#aws_upload_form").submit(function(e) {
                        e.preventDefault();
                        chatBody.find('div.ChatItem--customer').find('div.ChatItem-chatContent').find('div.ChatItem-chatText').last().append(
                       `<p>Caricamento in corso...</p>`
			       )
                        the_file = this.elements['file'].files[0];
                        var filename = Date.now() + '.' + the_file.name.split('.').pop();
                        $(this).find("input[name=key]").val(filename);
                        $(this).find("input[name=Content-Type]").val(the_file.type);
                        

                        var post_url = $(this).attr("action"); //get form action url
                        var form_data = new FormData(this); //Creates new FormData object
					  

$.ajax({
                        url : '/uploaddemo',
                        type: 'post',
                        data : form_data,
                        contentType : false,
                        processData: false,
		                success: function (response) {
                          console.log(response);
                          linkupload=response;
                         photo();

                       },
                         error: function (error) {
                          console.log(error);
         }
    });
				   })}
                if (data.message.substring(0,17) =="Inserisci la data") {
                	chatBody.find('div.ChatItem--customer').find('div.ChatItem-chatContent').find('div.ChatItem-chatText').last().append(
                       `<input type="date" class="bx--tag bx--tag--red" type="submit" name="date" id="date" strong class= "bx--tag__label" style="color:#ffffff" required> <button class="bx--tag bx--tag--red" type="submit" id="submit" onclick="data();"> <strong class= "bx--tag__label" style="color:#ffffff">Invia la data</strong> </button> <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>`
			       )
                        var date = new Date();

                        var day = date.getDate();
                        var month = date.getMonth() + 1;
                        var year = date.getFullYear();
                        linkupload = "";

                        if (month < 10) month = "0" + month;
                        if (day < 10) day = "0" + day;

                        var today = year + "-" + month + "-" + day;
                        document.getElementById('date').value = today;}  
                itr = itr + 1;
            }
        }
    });
    $('.ChatWindow').animate({
        scrollTop: $('.ChatWindow').prop("scrollHeight")

    }, 500);

    return 1;
}


function run() {
    $requestData = $('.ChatInput-input');
    $requestData.html('place an order');
    watson();
}

async function initWatsonAssistant() {
    $.ajax({
        url: '/getWatsonAssistantResponse',
        method: 'get',
        data: { msg: '' },
        dataType: 'json',
        success: function(data) {
            if (data.response_type == "option") {
                chatBody.find('div.ChatItem--customer').last().remove();
                $('.ChatWindow').append(
                    '<div class="ChatItem ChatItem--customer"> <div class="ChatItem-meta"> <div class="ChatItem-avatar"> <img class="ChatItem-avatarImage" src="static/duc-logo.png"> </div> </div> <div class="ChatItem-chatContent"> <div class="ChatItem-chatText">' + data.message + '</div> <div class="here"> </div> <div class="ChatItem-timeStamp"><strong>Watson Chatbot</strong></div> </div> </div>');

                data.options.forEach(element => {
                    chatBody.find('div.ChatItem--customer').find('div.ChatItem-chatContent').find('div.here').last().append(
                        `<a class="bx--tag bx--tag--red" onclick="optionsSelected('${element.label}')"> <strong class= "bx--tag__label" style="color:#ffffff">${element.label}</strong> </a>`
                    );
                });

            } else {

                chatBody.find('div.ChatItem--customer').last().remove();
                $('.ChatWindow').append(
                    '<div class="ChatItem ChatItem--customer"> <div class="ChatItem-meta"> <div class="ChatItem-avatar"> <img class="ChatItem-avatarImage" src="static/duc-logo.png"> </div> </div> <div class="ChatItem-chatContent"> <div class="ChatItem-chatText">' + data.message + '</div> <div class="ChatItem-timeStamp"><strong>Watson Chatbot</strong></div> </div> </div>');

            }
        }
    });
}
async function addDatabaseContents(respdata, respcognome, respprogetto, respmodello, respvin, respmatricolamotore, respcopoflotte, respkmtotali, resptipodistrada, respluogo, resplitri, respsegnalazione, respdescrizione1, respdescrizione2, respdescrizione3, respcampolibero, respstato, respnote,respfoto) {
//async function addDatabaseContents(respdata, respmodello, respvin, respkmtotali, resptipodistrada, resprifornimento, respluogo, resplitri, respsegnalazione) {

    let orderDetails = {
        data: respdata,
        cognome: respcognome,
        progetto: respprogetto,
		modello: respmodello,
        vin: respvin,
		matricolamotore: respmatricolamotore,
		copoflotte: respcopoflotte,
        kmtotali: respkmtotali,
        tipodistrada:resptipodistrada,
        luogo: respluogo,
        litri: resplitri,
        segnalazione: respsegnalazione,
		descrizione1: respdescrizione1,
		descrizione2: respdescrizione2,
		descrizione3: respdescrizione3,
		campolibero: respcampolibero,
		stato: respstato,
		note: respnote,
        foto:respfoto,

    };

    let formData = new FormData();
    formData.append("orderDetails", JSON.stringify(orderDetails));

    $.ajax({
        url: '/addDatabaseContents',
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(response) {

            var mydata = response;

            if (mydata.flag == 'success')
                console.log('added to db2!');
            else
                console.log('something went wrong...');
        }
    });
}
function data(insertdata) {
    
    var giorno = $('#date').val();
    $requestData = $('.ChatInput-input');
    $requestData.html(giorno.toString());
    exec = exec + watson();
    return exec
}



function optionsSelected(option) {
    $( ".here" ).find( "a" ).prop( "onclick", null );
    $requestData = $('.ChatInput-input');
    $requestData.html(option.toString());
    exec = exec + watson();
    return exec
}

function photo(){
    $requestData = $('.ChatInput-input');
    $requestData.html(linkupload.toString());
    exec = exec + watson();
    return exec
}
