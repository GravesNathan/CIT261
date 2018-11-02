/*
var products = new Array(
  {"itemNumber":0,"prodname":"Sega Genesis","cost":30,
  "getItemnum":function(){return this.itemNumber;},
  "getProdname":function(){return this.prodname;},
  "getCost":function(){return this.cost;}},

  {"itemNumber":1,"prodname":"Super Nintendo","cost":30,
  "getItemnum":function(){return this.itemNumber;},
  "getProdname":function(){return this.prodname;},
  "getCost":function(){return this.cost;}},

  {"itemNumber":2,"prodname":"Game Boy","cost":20,
  "getItemnum":function(){return this.itemNumber;},
  "getProdname":function(){return this.prodname;},
  "getCost":function(){return this.cost;}});
*/

  var products = new Array(
    {"itemNumber":0,"prodname":"Sega Genesis","cost":30,},
    {"itemNumber":1,"prodname":"Super Nintendo","cost":30,},
    {"itemNumber":2,"prodname":"Game Boy","cost":20,}
  );

//Later, Add the function to automatically create the table based
//on the number of products available for sale.
//If possible have it dynamically create the labels to use with
//the getElementById functions.

var myCart = new Array();
var cartLength = 0;
var i;
var data;
var jsonString = '';
var numOfProducts = 0;


function addToCart(itemNum){//Add items to cart and increase cart length
  myCart[cartLength] = products[itemNum];
  cartLength +=1;
  viewCart();
  storeCart();
  //Create or update cart in API

}

//clear cart of all contents
function clearCart(){
  myCart = [];
  cartLength = 0;
  localStorage.clear();//Clear all local storage for page.
  //Could also use function to only clear the cart storage if mulitple things are stored
  document.getElementById("viewCart").innerHTML = "";
  document.getElementById("total").innerHTML = "0"
  document.getElementById("jsonCart").innerHTML = "";
  document.getElementById("importCart").innerHTML = "";
  document.getElementById("total2").innerHTML = "0";
  document.getElementById("storageNotice").innerHTML = "Local Storage Cleared.";
  //Clear cart in API
}

function viewCart(){
  var tempCart = "";
  var total = 0;
  for (i in myCart){
    tempCart += myCart[i].prodname +" "+  myCart[i].cost+ "<br />";
    total += myCart[i].cost;
  }
  document.getElementById("viewCart").innerHTML = tempCart;
  document.getElementById("total").innerHTML = total;
  //View cart from API
}

//Interesting, I got a JSON string with brackets on the outside using stringfy...perhaps because I have an array object.
//It looked like this: [{"itemNumber":2,"prodname":"Game Boy","cost":20}]
function exportCart(){
  var jsonCart = JSON.stringify(myCart);
  document.getElementById("jsonCart").innerHTML = jsonCart;
  //Download file (eventually)
}

function importCart(){
  var tempCart = "";
  var total = 0;
  var jsonCart = JSON.stringify(myCart);
  var importCart = JSON.parse(jsonCart);
  cartLength = 0;
  //No functions are in the imported cart.  Need to reference values directly.
  for (i in importCart){
    tempCart += importCart[i].prodname +" "+  importCart[i].cost+ "<br />";
    //Imported 20 is now a string.  Need to convert it to a number.
    //parseInt, parseFloat, and Number are 3 methods I quickly found.  May be others.
    //Should really add a lot more try methods and test if NaN schenarios at some point.
    total += importCart[i].cost;
    //Correction, I needed total to be declared as a 0 value to make it a number first.
    //From there javascript automatically interpretted the import as a number for me.  May be safe to use parsing for safety.
    //I wonder whether that's recommended or not?
    cartLength += 1;
  }
  document.getElementById("importCart").innerHTML = tempCart;
  document.getElementById("total2").innerHTML = total;
  //upload file (eventually)
  //Also update API with new cart
}

//********Test for Storage Compatibility**********
function storageAvailable(type) {
  try {
    var storage = window[type],
    x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  }
  catch(e) {
    return e instanceof DOMException && (
      // everything except Firefox
      e.code === 22 ||
      // Firefox
      e.code === 1014 ||
      // test name field too, because code might not be present
      // everything except Firefox
      e.name === 'QuotaExceededError' ||
      // Firefox
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage.length !== 0;
    }
  }

//********Store in localAPI
function storeCart(){
  if (storageAvailable('localStorage')) {
    //Convert cart to Json and store.  Retreiving a stored [object, object] was giving me undefined.
    localStorage.setItem('localCart',JSON.stringify(myCart));
    localStorage.setItem('localCartLength',cartLength);
    document.getElementById('storageNotice').innerHTML =("Cart locally stored.");
  }
  else{
    document.getElementById('storageNotice').innerHTML = ("local storage API is not suppported in your browser or your storage capacity is full.  Please enable localStorage in your browser to receive full benefits from this shop.");
  }
}

//********Retreive from localAPI to show on page or store if desired in variable.
function retreiveCart(){
  if (storageAvailable('localStorage')) {
    //We now know we can use storage.  Test if cart exists
    if (localStorage.getItem('localCart') === null){
      //Cart is empty so do nothing.
    } else {
      //localCart exists, so load it into page.
      myCart = JSON.parse(localStorage.getItem('localCart'));
      cartLength = parseInt(localStorage.getItem('localCartLength'));
      document.getElementById('storageNotice').innerHTML = ("Cart from previous visit has been loaded.");
      viewCart();
    }
  } else{
    //Browser or privacy setting doesn't support local storage.
    document.getElementById('storageNotice').innerHTML = ("local storage API is not suppported in your browser or your storage capacity is full.  Please enable localStorage in your browser to receive full benefits from this shop.");
  }

}

// Usage example: https://api.opendota.com/api/matches/271145478?api_key=YOUR-API-KEY
//https://api.opendota.com/api/heroStats
//**First we'll just get some stats.  Maybe later we'll let users select a hero to check stats.

//Page On load, for Listeners and re-load of cart.
function prepPage(){
  for(i in products){//Populate table
    document.getElementById("row"+i+"num").innerHTML = products[i].itemNumber;
    document.getElementById("row"+i+"name").innerHTML = products[i].prodname;
    document.getElementById("row"+i+"cost").innerHTML = products[i].cost;
      document.getElementById('ajaxButton').addEventListener('click', getRequest);
    numOfProducts += 1;
  }
  retreiveCart();
}

function getRequest(){
  var xmlhttp = new XMLHttpRequest();
  //Script of what to do once the request is complete.  This may seem odd, but it is written
  //before the request is actually opened or sent.  Only when the request is complete will this
  //code execute.
  xmlhttp.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200) {
      data = JSON.parse(xmlhttp.responseText);
      i=0;
      for (i in data){
        jsonString += '<b>Name: </b>' + data[i].localized_name + ' <b>Primary Attribute:</b> ' + data[i].primary_attr + ' <b>Roles:</b> ' + data[i].roles + '<br />';
      }
      document.getElementById('gameStats').innerHTML = (jsonString);
    } else {
      document.getElementById('gameStats').innerHTML = ('An error occured with the request.');
    }
  }//End of "do stuff" function
  //open and send the reqeust.  Above function executes upon completion.
  xmlhttp.open('GET', 'https://api.opendota.com/api/heroStats', true);
  xmlhttp.send();
}

//****Note to Self.  Heros have images I can use.

//*****Form to dynamically create users shop*****
//*****Once it works I should use local storage to store their custom shop*****

function addItem(newProduct,newCost){
  if( (newProduct == '') || (isNaN(newCost)) ){
    document.getElementById('customizeResult').innerHTML = 'Product name and Price cannot be blank to Add an item to shop.  Cost must also be a valid number';
  } else {
    //numOfProducts is always equal to the next array index in this example
    products[numOfProducts] =  {"itemNumber":numOfProducts,"prodname":newProduct,"cost":newCost};
    var productsTable = document.getElementById('productsTable');
    var row = productsTable.insertRow(numOfProducts+1);
    row.setAttribute('id',numOfProducts);//may need to change to string if not int
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    cell1.innerHTML = numOfProducts;
    cell2.innerHTML = newProduct;
    cell3.innerHTML = newCost;
    cell4.innerHTML = '<button id="'+ numOfProducts +'" type="button" onClick="addToCart(this.id);">Add to Cart</button>';
    numOfProducts +=1;
    document.getElementById('customizeResult').innerHTML = 'Your item has been added.';
  }

}


function removeItem(newItemNumber){
  if( (isNaN(newItemNumber)) || (newItemNumber >= numOfProducts) ){
    document.getElementById('customizeResult').innerHTML = 'Item Number cannot be blank and must be a valid item number to remove an item.';
  } else {
    document.getElementById('productsTable').deleteRow(newItemNumber+1);
    var row = '';
    numOfProducts -= 1
    while( newItemNumber < (numOfProducts) ) {
      products[newItemNumber] =  products[newItemNumber+1];
      //if (newItemNumber )
      document.getElementById('productsTable').rows[newItemNumber+1].cells[0].innerHTML = newItemNumber;

      //row.deleteCell(0);
      //cell0 = row.insertCell(0);
      //cell0.innerHTML = row.
      newItemNumber += 1;
    }
    //numOfProducts -= 1;
    products.length -= 1;
    document.getElementById('customizeResult').innerHTML = 'The selected item has been removed.';
  }
}

function updateItem(newItemNumber,newProduct,newCost){//Need to prohibit updating behond current num products "adding" is okay
  if( (newProduct == '') || (newItemNumber >= numOfProducts) || (isNaN(newCost)) || (isNaN(newItemNumber))){
    document.getElementById('customizeResult').innerHTML = 'Item Number, Product name and Price cannot be blank to Update an item in the shop.  You can not update items without a valid item number and cost.';
  } else {
    products[newItemNumber] =  {"itemNumber":parseInt(newItemNumber),"prodname":newProduct,"cost":newCost};
    var productsTable = document.getElementById('productsTable');
    var row = productsTable.rows[newItemNumber+1];//item number is 1 less then row index
    //row.setAttribute('id',numOfProducts);//may need to change to string if not int
    //var cell1 = row.insertCell(0);
    row.deleteCell(1);//After cell 1 is deleted the new cell one was cell 2.
    row.deleteCell(1);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    //var cell4 = row.insertCell(3);
    //cell1.innerHTML = numOfProducts;
    cell2.innerHTML = newProduct;
    cell3.innerHTML = newCost;
    //cell4.innerHTML = '<button id="'+ numOfProducts +'" type="button" onClick="addToCart(this.id);">Add to Cart</button>';
    document.getElementById('customizeResult').innerHTML = 'The selected item has been updated.';
  }
}

//Allow Customized background color, font color, and table properties.
//    document.body.style.backgroundColor = "red";
function updateStyles(bgColor,fontColor,productsBgColor,productsFontColor){
  //run through each update option.  If something was blank skip it, otherwise update it.
  //actually I'll just not give them a blank option.  If I implement local storage I may want a reset button.
//  alert(bgColor +','+fontColor+','+productsBgColor+','+productsFontColor);
  document.body.style.backgroundColor = bgColor;
  document.body.style.color = fontColor;
  document.getElementsByClassName('shopTable')[0].style.backgroundColor = productsBgColor;
  document.getElementsByClassName('shopTable')[0].style.Color = productsFontColor;
}

function customizeShop(action){
  var myForm = document.getElementById('customize');
  var newItemNumber = parseInt(myForm.elements[0].value);
  var newProduct = myForm.elements[1].value;
  var newCost = parseInt(myForm.elements[2].value);
  var bgColor  = myForm.elements[3].value;
  var fontColor = myForm.elements[4].value;
  var productsBgColor = myForm.elements[5].value;
  var productsFontColor = myForm.elements[6].value;
  switch (action) {
    case 'addItem':
      addItem(newProduct,newCost);
      break;
    case 'removeItem':
      removeItem(newItemNumber);
      break;
    case 'updateItem':
      updateItem(newItemNumber,newProduct,newCost);
      break;
    case 'updateStyles':
      updateStyles(bgColor,fontColor,productsBgColor,productsFontColor);
      //document.getElementById('customizeResult').innerHTML = 'Action build in progress';
      break;
    default:
      document.getElementById('customizeResult').innerHTML = 'Something went wrong with your request';
      break;
  }
/*
  if (action === 'addItem')
    addItem(newProduct,newCost);
  else if (action === 'removeItem')
    removeItem(newItemNumber);
  else if (action === 'updateItem')
    updateItem(newItemNumber,newProduct,newCost);
  else
    document.getElementById('customizeResult').innerHTML = 'Something went wrong with your request';
*/
}

//Taken from w3schools - https://www.w3schools.com/howto/howto_html_include.asp
//<div w3-include-html="content.html"></div>  have this on webpage and use function listed below.

/* Include multiple snipits in page by referencing multiple snipits separetely.  function remains the same.
<div w3-include-html="h1.html"></div>
<div w3-include-html="content.html"></div>
*/

function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /*loop through a collection of all HTML elements:*/
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /*make an HTTP request using the attribute value as the file name:*/
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          /*remove the attribute, and call this function once more:*/
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      /*exit the function:*/
      return;
    }
  }
}

includeHTML();
/*Lastly call the code in webpage with this at end of webpage which I essentially did above.
<script>
includeHTML();
</script>
*/
