//document.write('<script src="app.js"></script>');

function handleClick() {

    console.log('Get data button clicked!');
  
    fetch('http://localhost:3000/getstats')
    .then(async (value) => {
    const res = await value.json();
    console.log(res);
    firstParagraph(res);
    secondParagraph(res);
    })
}   

function firstParagraph(res) {

    var recordArray = res.airtable_records;
    const table = document.getElementById("Body");

    for (let i = 0; i < recordArray.length; i++) {

      let row = table.insertRow();

      let Id = row.insertCell(0);
      Id.innerHTML = recordArray[i].airtable_id;

      let Name = row.insertCell(1);
      Name.innerHTML = recordArray[i].Name;

      let Major = row.insertCell(2);
      Major.innerHTML = recordArray[i].Major;

      let Sex = row.insertCell(3);
      Sex.innerHTML = recordArray[i].Sex;

      let Classification = row.insertCell(4);
      Classification.innerHTML = recordArray[i].Classification;

      let City = row.insertCell(5);
      City.innerHTML = recordArray[i].City;

      let State = row.insertCell(6);
      State.innerHTML = recordArray[i].State;

      let Country = row.insertCell(7);
      Country.innerHTML = recordArray[i].Country;
      
    }

}

function secondParagraph(res) {

    var updatedRecords = res.recordsUpdated;
    console.log(document.getElementById('no-of-records-updated').innerHTML = updatedRecords + ' documents were updated.')
    

}
