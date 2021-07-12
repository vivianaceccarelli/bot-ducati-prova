const table = document.getElementById("table");
const tableRef = table.getElementsByTagName('tbody')[0];

$(document).ready(function() {
    getDatabaseContents();
});

var addSerialNumber = function() {
    $('table tr').each(function(index) {
        $(this).find('td:nth-child(1)').html(index);
    });
};

async function getDatabaseContents() {
    await fetch('/getDatabaseContents').then(async(response) => {
        $("table").find("tr:gt(0)").remove();
        data = await response.json();

        data.forEach(element => {
            var row = table.insertRow(1);

            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            var cell5 = row.insertCell(4);
            var cell6 = row.insertCell(5);
            var cell7 = row.insertCell(6);
            var cell8 = row.insertCell(7);
            var cell9 = row.insertCell(8);
            var cell10 = row.insertCell(9);
            var cell11 = row.insertCell(10);
			var cell12 = row.insertCell(11);
            var cell13 = row.insertCell(12);
            var cell14 = row.insertCell(13);
            var cell15 = row.insertCell(14);
            var cell16 = row.insertCell(15);
            var cell17 = row.insertCell(16);
            var cell18 = row.insertCell(17);
            var cell19 = row.insertCell(18);
            var cell20 = row.insertCell(19);
           
            cell1.innerHTML = "";
            cell2.innerHTML = element.DATA;
            cell3.innerHTML = element.COGNOME;
            cell4.innerHTML = element.PROGETTO;
			cell5.innerHTML = element.MODELLO;
            cell6.innerHTML = element.VIN;
			cell7.innerHTML = element.MATRICOLAMOTORE;
			cell8.innerHTML = element.COPOFLOTTE;
            cell9.innerHTML = element.KMTOTALI;
            cell10.innerHTML = element.TIPODISTRADA;
            cell11.innerHTML = element.LUOGO;
            cell12.innerHTML = element.LITRI;
            cell13.innerHTML = element.SEGNALAZIONE;
			cell14.innerHTML = element.DESCRIZIONE1;
			cell15.innerHTML = element.DESCRIZIONE2;
			cell16.innerHTML = element.DESCRIZIONE3;
			cell17.innerHTML = element.CAMPOLIBERO;
			cell18.innerHTML = element.STATO;
            cell19.innerHTML = element.NOTE;
            cell20.innerHTML = element.FOTO;

            addSerialNumber();
        });
    });
}
