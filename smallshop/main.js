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

  {"itemNumber":2,"prodname":"Game Boy Color","cost":20,
  "getItemnum":function(){return this.itemNumber;},
  "getProdname":function(){return this.prodname;},
  "getCost":function(){return this.cost;}});
*/

  var products = new Array(
    {"itemNumber":0,"prodname":"Sega Genesis","cost":30,'info':'This is a Sega Genesis.'},
    {"itemNumber":1,"prodname":"Super Nintendo","cost":30,'info':'This is a Super Nintendo.'},
    {"itemNumber":2,"prodname":"Game Boy Color","cost":20,'info':'This is a Game Boy Color.'}
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
//It looked like this: [{"itemNumber":2,"prodname":"Game Boy Color","cost":20}]
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
    document.getElementById("row"+i+"name").innerHTML = products[i].prodname + '<span onmouseout="displayInfo(this)" onmouseover="displayInfo(this)">&#9432</span>';
    document.getElementById("row"+i+"cost").innerHTML = products[i].cost;
    //document.getElementById('ajaxButton').addEventListener('click', getRequest);
    numOfProducts += 1;
  }
    document.getElementById('ajaxButton').addEventListener('click', getRequest);
    document.getElementById('apiTest').addEventListener('click', getRequest);
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

function getGameInfo(){
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200) {
      gameIds = JSON.parse(xmlhttp.responseText);
      //i=0;
      //for (i in gameIds){
      //  jsonString += '<b>Name: </b>' + gameIds[i].localized_name + ' <b>Primary Attribute:</b> ' + gameIds[i].primary_attr + ' <b>Roles:</b> ' + gameIds[i].roles + '<br />';
      //}
      //document.getElementById('gameStats').innerHTML = (jsonString);
    } else {
      document.getElementById('adsError').innerHTML = ('An error occured with the request.');
    }
  }//End of "do stuff" function
  //open and send the reqeust.  Above function executes upon completion.
  xmlhttp.open('GET', 'https://api.opendota.com/api/heroStats', true);
  xmlhttp.send();
}

//****Note to Self.  Heros have images I can use.

//*****Form to dynamically create users shop*****
//*****Once it works I should use local storage to store their custom shop*****

function addItem(newProduct,newCost,info){
  if( (newProduct == '') || (isNaN(newCost)) || (info == '') ){
    document.getElementById('customizeResult').innerHTML = 'Product name and Price cannot be blank to Add an item to shop.  Cost must also be a valid number';
  } else {
    //numOfProducts is always equal to the next array index in this example
    products[numOfProducts] =  {"itemNumber":numOfProducts,"prodname":newProduct,"cost":newCost,"info":info};
    var productsTable = document.getElementById('productsTable');
    var row = productsTable.insertRow(numOfProducts+1);
    row.setAttribute('id',numOfProducts);//may need to change to string if not int
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    cell2.classList.add('itemName');
    cell1.innerHTML = numOfProducts;
    cell2.innerHTML = newProduct + '<span onmouseout="displayInfo(this)" onmouseover="displayInfo(this)">&#9432</span>';
    cell3.innerHTML = newCost;
    cell4.innerHTML = '<button id="'+ numOfProducts +'" type="button" onClick="addToCart(this.id);">Add to Cart</button>';
    cell5.innerHTML = 'no additional info at this time.';
    numOfProducts +=1;
    document.getElementById('customizeResult').innerHTML = 'Your item has been added.';
  }

}

//When I removed item 2 but item 3 was avaialble with it's new index, I got an error trying to add to cart.
//The error indicates that the product name is undefined from view cart.
//When I remove an item that item needs to be removed from the users cart.
//The items beyond that number need to be updated with their new numbers too.
function removeItem(newItemNumber){
  if( (isNaN(newItemNumber)) || (newItemNumber >= numOfProducts) ){
    document.getElementById('customizeResult').innerHTML = 'Item Number cannot be blank and must be a valid item number to remove an item.';
  } else {
    document.getElementById('productsTable').deleteRow(newItemNumber+1);
    var row = '';
    numOfProducts -= 1
    i=newItemNumber;
    while( i < (numOfProducts) ) {
      products[i] =  products[i+1];
      //if (newItemNumber )
      document.getElementById('productsTable').rows[i+1].cells[0].innerHTML = i;
      i++;
    }
    products.length -= 1;
    /* ********Need to work on removing items from cart eventually.
    Note when trying to add an item that is after the index of the one that was removed,
    It throws an error Need to fix
    var toRemove = 0;
    for (i in myCart){//if cart length is 5 then indexes are 0-4, so stop at the 5, hence < and not <=
      if (myCart[i].itemNumber == newItemNumber){
        console.log('mycart.ItemNumber = ' + myCart[i].itemNumber +' newItemNumber = '+ newItemNumber);
        var j=i;
        for (j; j<cartLength; j++){
          console.log('myCart[j] = ' + myCart[j] +' myCart[j+1] = '+ myCart[j+1]);
          myCart[j] = myCart[j+1];//brings next items in list down an index
        }
        toRemove =+ 1;
        i--; //Repeat current i index to avoid skipping an item
      } else if (myCart[i].itemNumber > newItemNumber){
        myCart[i].itemNumber--; //Correct item number of indexes that were beyond existing one
        cartLength--;//decrease cart length.
      }
      myCart.length -= toRemove; //remove items from end of list
    }
    //In reality I'd probably just store item numbers in the cart so the cart requires to update
    //by pulling all other info from the database.  Previous item numbers could be archived and
    //listed as not available, but the number can never be used again.
    viewCart();
    //also need to store new cart in local storage
    */
    document.getElementById('customizeResult').innerHTML = 'The selected item has been removed.';
  }
}

function updateItem(newItemNumber,newProduct,newCost,info){//Need to prohibit updating behond current num products "adding" is okay
  if( (newProduct == '') || (newItemNumber >= numOfProducts) || (isNaN(newCost)) || (isNaN(newItemNumber)) || (info == '') ){
    document.getElementById('customizeResult').innerHTML = 'Item Number, Product name, Price, and info cannot be blank to Update an item in the shop.  You can not update items without a valid item number and cost.';
  } else {
    products[newItemNumber] =  {"itemNumber":parseInt(newItemNumber),"prodname":newProduct,"cost":newCost, "info":info};
    var productsTable = document.getElementById('productsTable');
    var row = productsTable.rows[newItemNumber+1];//item number is 1 less then row index
    //row.setAttribute('id',numOfProducts);//may need to change to string if not int
    //var cell1 = row.insertCell(0);
    row.deleteCell(1);//After cell 1 is deleted the new cell one was cell 2.
    row.deleteCell(1);
    row.deleteCell(2);//Delete additional info piece
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    //var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    //cell1.innerHTML = numOfProducts;
    cell2.innerHTML = newProduct;
    cell3.innerHTML = newCost;
    //cell4.innerHTML = '<button id="'+ numOfProducts +'" type="button" onClick="addToCart(this.id);">Add to Cart</button>';
    cell5.innerHTML = 'no additional media is available.';
    document.getElementById('customizeResult').innerHTML = 'The selected item has been updated.';
  }
}

//Allow Customized background color, font color, and table properties.
//    document.body.style.backgroundColor = "red";
function updateStyles(bgColor,fontColor,productsBgColor){
  //run through each update option.  If something was blank skip it, otherwise update it.
  //actually I'll just not give them a blank option.  If I implement local storage I may want a reset button.
//  alert(bgColor +','+fontColor+','+productsBgColor+','+productsFontColor);
  document.body.style.backgroundColor = bgColor;
  document.body.style.color = fontColor;
  document.body.style.backgroundImage = 'none';
  document.getElementsByClassName('shopTable')[0].style.backgroundColor = productsBgColor;
  //document.getElementsByClassName('shopTable')[0].style.Color = productsFontColor;
}

function customizeShop(action){
  var myForm = document.getElementById('customize');
  var newItemNumber = parseInt(myForm.elements[0].value);
  var newProduct = myForm.elements[1].value;
  var newCost = parseInt(myForm.elements[2].value);
  var info = myForm.elements[3].value;
  var bgColor  = myForm.elements[4].value;
  var fontColor = myForm.elements[5].value;
  var productsBgColor = myForm.elements[6].value;
  var productsFontColor = myForm.elements[7].value;
  switch (action) {
    case 'addItem':
      addItem(newProduct,newCost,info);
      break;
    case 'removeItem':
      removeItem(newItemNumber);
      break;
    case 'updateItem':
      updateItem(newItemNumber,newProduct,newCost,info);
      break;
    case 'updateStyles':
      updateStyles(bgColor,fontColor,productsBgColor);
      //document.getElementById('customizeResult').innerHTML = 'Action build in progress';
      break;
    default:
      document.getElementById('customizeResult').innerHTML = 'Something went wrong with your request';
      break;
  }
}

//Taken from w3schools - https://www.w3schools.com/howto/howto_html_include.asp
//<div w3-include-html="content.html"></div>  have this on webpage and use function listed below.

/* Include multiple snipits in page by referencing multiple snipits separetely.  function remains the same.
<div w3-include-html="h1.html"></div>
<div w3-include-html="content.html"></div>
*/

/*****************Menu Toggle***************/
function menuToggle(menuToggle){
  menuToggle.classList.toggle('open');//Adds open class to CSS of menuToggle
  var menuBox = document.getElementById('menuBox');
  menuBox.classList.toggle('open');//Add's open class to menuBox

}

/*********************Images Scroll buttons**************/
//Consider adding a scroll left and right button at some point
/*
document.getElementById('btn1').addEventListener('click', scrollImage);
document.getElementById('btn2').addEventListener('click', scrollImage);
document.getElementById('btn3').addEventListener('click', scrollImage);
*/
document.getElementById('pauseResume').addEventListener('click', scrollImage);

function scrollImage(){
  switch (this.id){
    case 'pauseResume':
      document.getElementById('scrollImages').classList.toggle('paused');
      break;
    case 'btn1':
      break;
    case 'btn2':
      break;
    case 'btn3':
      break;
    default:
      break;
  }
}


//************Hover Info display******/
function displayInfo(product){
  product.classList.toggle('infoHover');
}


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


//********Canvas JS*********
/**
var myCanvas = document.getElementById('smallCanvas');
var ctx=myCanvas.getContext('2d');
//Create Gradient
var gradient = ctx.createRadialGradient(50,50,0,50,50,90);
gradient.addColorStop(0, "white");
gradient.addColorStop(.3, "yellow");
gradient.addColorStop(.5, "orange");
gradient.addColorStop(.6, "green");
gradient.addColorStop(.8, "blue");
gradient.addColorStop(.9, "purple");
gradient.addColorStop(1, 'red');
//Assign Fill
ctx.fillStyle = gradient;
ctx.fillRect(0,0,200,200);
**/
