// Initially enable the first field
//document.getElementById('charField').disabled = false;

const charField = document.getElementById('charField');
const numField = document.getElementById('numField');
const submitButton = document.getElementById('submitButton');
const exportButton = document.getElementById('exportButton');
const clearButton = document.getElementById('clearButton');
var set = "";
var id = "";

var card = new Map();
var quantity = new Map();

charField.focus();

//charField.addEventListener('input', function() {
//  if (this.value.length === 3) {
//    numField.disabled = false;  // Enable the number field when 3 characters are typed
//    numField.focus();           // Automatically focus on the number field
//    console.log("got set " + this.value);
//    set = this.value;
//  }
//});
//
//numField.addEventListener('input', function() {
//  if (this.value.length > 0 && isNaN(this.value)) {
//    this.value = '';  // Clear input if non-numeric value is entered
//  }
//  if (this.value.length === 3) {
//    console.log("got ID " + this.value);
//    id = this.value;
//    numField.disabled = true;
//    charField.disabled = true;
//    scryfall(set, id);
//
//  }
//});
//
//charField.addEventListener('keydown', function(event) {
//  // Prevent entering anything other than letters
//  if (!/[a-zA-Z]/.test(event.key) && event.key !== 'Backspace') {
//    //event.preventDefault();
//  }
//});
//
//numField.addEventListener('keydown', function(event) {
//  // Allow only numeric input and backspace
//  if (!/[0-9]/.test(event.key) && event.key !== 'Backspace') {
//    //event.preventDefault();
//  }
//});

// Function to generate and append the list to the container
function displayList() {
  const listContainer = document.getElementById('listContainer');
  listContainer.innerHTML = '';
  // Create an unordered list element
  const ul = document.createElement('ul');

  // Loop through each item and create list items
  quantity.forEach((value, key) => {
    let name = card.get(key).name;
    const li = document.createElement('li');  // Create a list item (li)
    li.textContent = value + " " + name;  // Set the text of the list item
    ul.appendChild(li);  // Append the list item to the unordered list
  });

  // Append the unordered list to the container
  listContainer.appendChild(ul);
}

// Handle Submit button click
submitButton.addEventListener('click', function () {
    const c = charField.value;
    const n = numField.value;
    document.getElementById('output').textContent = `You entered: ${c} and ${n}`;
    scryfall(c, n);
    charField.value = null
    numField.value = null
    charField.focus();
});

// Handle Export button click
exportButton.addEventListener('click', function () {
    console.log('here in export');
    var uls = document.getElementsByTagName('ul');
    var text = "";
    for(var i=0;i<uls.length;i++){
        var lis=uls[i].getElementsByTagName('li');
        for(var j=0;j<lis.length;j++){
            console.log(lis[j].innerHTML);
            text += lis[j].innerHTML + "\n";
        }
    }
    console.log(text);
    navigator.clipboard.writeText(text);
});

// Handle Clear button click
clearButton.addEventListener('click', function () {
    var confirmed = confirm("Clear Current List?");
    if (confirmed) {
        const listContainer = document.getElementById('listContainer');
        listContainer.innerHTML = '';
        card.clear;
        quantity.clear;
    }
});

function scryfall(set, id) {

    //https://api.scryfall.com/cards/
    let url = 'https://api.scryfall.com/cards/' + set + '/' + id;
    console.log("searching scryfall for set:" + set + " id:" + id);

    fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // or response.text() for non-JSON responses
        })
        .then(data => {
            console.log('Data received:', data);
            console.log('name of card:', data.name);

            card.set(data.id, data);

            if (quantity.has(data.id)) {
                //current quantity
                let q = quantity.get(data.id);
                quantity.set(data.id, q+1);
            } else {
                quantity.set(data.id, 1);
            }

            displayList();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}
