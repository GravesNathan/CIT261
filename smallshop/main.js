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
    {"itemNumber":0,"prodname":"Sega Genesis","cost":30,'info':"<div class='media'><video controls><source src='media/videos/sega.mp4' type='video/mp4' /><source src='media/videos/sega.ogv' type='video/ogg' /><source src='media/videos/sega.webm' type='video/webm' /><p>Your browser does not support HTML5.  You can download the video <a href='media/videos/sega.mp4'>here</a>.</p></video></div>"},
    {"itemNumber":1,"prodname":"Super Nintendo","cost":30,'info':"<div class='media'><div class = 'images' id='scrollImages'><img src='media/images/sNintendo1.JPG' alt='Super Nintendo Picts' /><img src='media/images/sNintendo2.JPG' alt='Super Nintendo Picts' /><img src='media/images/sNintendo3.JPG' alt='Super Nintendo Picts' /><img src='media/images/sNintendo4.JPG' alt='Super Nintendo Picts' /><img src='media/images/sNintendo5.JPG' alt='Super Nintendo Picts' /><img src='media/images/sNintendo6.JPG' alt='Super Nintendo Picts' /></div></div><div class='centerAll'><button class='imageScrollBtn' id='pauseResume' onclick='scrollImage(this.id)'>Pause/Resume</button></div>"},
    {"itemNumber":2,"prodname":"Game Boy Color","cost":20,'info':"<div class='media'><audio controls><source src='media/audio/GameBoyColor.m4a' type='audio/m4a' /><source src='media/audio/GameBoyColor.mp3' type='audio/mpeg' /><source src='media/audio/GameBoyColor.ogg' type='audio/ogg' /><source src='media/audio/GameBoyColor.wav' type='audio/wav' /><p>The audio content is not supported or has been blocked.  You can download a file <a href='media/audio/gameBoyColor'>here</a>.</p></audio></div>"}
  );


//Later, Add the function to automatically create the table based
//on the number of products available for sale.
//If possible have it dynamically create the labels to use with
//the getElementById functions.
var originalProducts = new Array(
  {"itemNumber":0,"prodname":"Sega Genesis","cost":30,'info':"<div class='media'><video controls><source src='media/videos/sega.mp4' type='video/mp4' /><source src='media/videos/sega.ogv' type='video/ogg' /><source src='media/videos/sega.webm' type='video/webm' /><p>Your browser does not support HTML5.  You can download the video <a href='media/videos/sega.mp4'>here</a>.</p></video></div>"},
  {"itemNumber":1,"prodname":"Super Nintendo","cost":30,'info':"<div class='media'><div class = 'images' id='scrollImages'><img src='media/images/sNintendo1.JPG' alt='Super Nintendo Picts' /><img src='media/images/sNintendo2.JPG' alt='Super Nintendo Picts' /><img src='media/images/sNintendo3.JPG' alt='Super Nintendo Picts' /><img src='media/images/sNintendo4.JPG' alt='Super Nintendo Picts' /><img src='media/images/sNintendo5.JPG' alt='Super Nintendo Picts' /><img src='media/images/sNintendo6.JPG' alt='Super Nintendo Picts' /></div></div><div class='centerAll'><button class='imageScrollBtn' id='pauseResume' onclick='scrollImage(this.id)'>Pause/Resume</button></div>"},
  {"itemNumber":2,"prodname":"Game Boy Color","cost":20,'info':"<div class='media'><audio controls><source src='media/audio/GameBoyColor.m4a' type='audio/m4a' /><source src='media/audio/GameBoyColor.mp3' type='audio/mpeg' /><source src='media/audio/GameBoyColor.ogg' type='audio/ogg' /><source src='media/audio/GameBoyColor.wav' type='audio/wav' /><p>The audio content is not supported or has been blocked.  You can download a file <a href='media/audio/gameBoyColor'>here</a>.</p></audio></div>"}
);
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
  //localStorage.clear();//Clear all local storage for page.
  //clear just the cart items
  localStorage.removeItem('localCart');
  localStorage.removeItem('localCartLength');
  //Could also use function to only clear the cart storage if mulitple things are stored
  document.getElementById("viewCart").innerHTML = "";
  document.getElementById("total").innerHTML = "0"
  //document.getElementById("jsonCart").innerHTML = "";
  //document.getElementById("importCart").innerHTML = "";
  //document.getElementById("total2").innerHTML = "0";
  document.getElementById("storageNotice").innerHTML = "Local Storage Cleared.";
  //Clear cart in API
}

function resetShop(){
  for (i=0;i<products.length;i++){
    productsTable.deleteRow(1);//Clear Shop before re-creating shop table
  }
  //set products and numOfProducts to original on page load, then re-create table
  products = originalProducts;
  numOfProducts = 0;
  localStorage.removeItem('localProducts');
  localStorage.removeItem('localNumOfProducts');
  for (i=0;i<products.length;i++){
    addItem(products[i].prodname, products[i].cost, products[i].info);
  }
  document.getElementById('storageNotice').innerHTML = 'The default products have been restored.'
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
/*
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
*/

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
      document.getElementById('storageNotice').innerHTML = ("Cart and/or Shop from previous visit has been loaded.");
      viewCart();
    }
  } else{
    //Browser or privacy setting doesn't support local storage.
    document.getElementById('storageNotice').innerHTML = ("local storage API is not suppported in your browser or your storage capacity is full.  Please enable localStorage in your browser to receive full benefits from this shop.");
  }

}

/*******Store Changes to Shop**********/
function storeShop(){
  if (storageAvailable('localStorage')) {
    //Convert cart to Json and store.  Retreiving a stored [object, object] was giving me undefined.
    localStorage.setItem('localProducts',JSON.stringify(products));
    //localStorage.setItem('localNumOfProducts',numOfProducts);//numOfProducts doesn't need to be
    // stored.  It's re-created via addItem function during retreiveShop
    document.getElementById('storageNotice').innerHTML =("Shop Changes have been saved to your browser");
  }
  else{
    document.getElementById('storageNotice').innerHTML = ("local storage API is not suppported in your browser or your storage capacity is full.  Please enable localStorage in your browser to receive full benefits from this shop.");
  }
}

//********Retreive from localAPI to show on page or store if desired in variable.
function retreiveShop(){
  if (storageAvailable('localStorage')) {
    //We now know we can use storage.  Test if cart exists
    if (localStorage.getItem('localProducts') === null){
      //No changes to shop were found in storage so do nothing
    } else {
      //localCart exists, so load it into page.
      products = JSON.parse(localStorage.getItem('localProducts'));
      numOfProducts = 0;//start at zero so addItem works
      for (i=0;i<3;i++){
        productsTable.deleteRow(1);//Clear original Shop before re-creating shop table
      }
      //Create Shop Table from Local Storage Data
      for (i=0;i<products.length;i++){
        addItem(products[i].prodname, products[i].cost, products[i].info);
      }
    }
    document.getElementById('storageNotice').innerHTML = ("Shop and/or Cart from previous visit has been loaded.");
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
  loadingStarts();
  for(i in products){//Populate table
    document.getElementById("row"+i+"num").innerHTML = products[i].itemNumber;
    document.getElementById("row"+i+"name").innerHTML = products[i].prodname + '<span onmouseout="displayInfo(this)" onmouseover="displayInfo(this)">&#9432</span>';
    document.getElementById("row"+i+"cost").innerHTML = products[i].cost;
    //document.getElementById('ajaxButton').addEventListener('click', getRequest);
    numOfProducts += 1;
  }
    document.getElementById('ajaxButton').addEventListener('click', getRequest);
    //document.getElementById('apiTest').addEventListener('click', getRequest);
  retreiveCart();
  retreiveShop();
  var menuButton = document.getElementById('menuToggle');
  menuToggle(menuButton);
  shopEditorLoad();
}

/*Setup Timer for the loading function.  The onclicks will need to trigger a function to
add the loading class, then have a timer function called that removes it about 2 seconds later.
Initial loading of webpage will need that same timer function called in prepPage to remove the class
*/
function loadingStarts(){
  document.getElementById('loading').classList.remove('displayNone');
  var timer = setInterval(stopLoading, 2000);
}

function stopLoading(){
  document.getElementById('loading').classList.add('displayNone');
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

/*
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
*/

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
    //This button id is not being corrected whenever an item is removed.  Because I rely on this id
    //When adding to cart this is a problem!  I must either correct the Id when removing,
    //or else reply on some other number.
    cell5.innerHTML = info;
    cell5.classList.add('hideOnSmall');
    numOfProducts +=1;
    document.getElementById('customizeResult').innerHTML = 'Your item has been added.';
    storeShop();
  }

}

function removeItem(newItemNumber){
  if( (isNaN(newItemNumber)) || (newItemNumber >= numOfProducts) ){
    document.getElementById('customizeResult').innerHTML = 'Item Number cannot be blank and must be a valid item number to remove an item.';
  } else {
/*What if I
1. Remove every entry in the products table on the display

2. Instead of replacing item numbers, replace the prodname, cost, and info of products[i] with
Those variables of products[i+1]
3. Call add item function using the product[i] entry currently being worked on.
Item 1 would need to be done first.
Item 2 and 3 can be called within the while loop.  This could start at item 0 and work it's way up to products.length
or numOfProducts.
*/
      var productsTable = document.getElementById('productsTable');
      for (i=0;i<products.length;i++){
        productsTable.deleteRow(1);//Clear entire table except headers, repeatedly delete row 1.
        numOfProducts -= 1;//decrease this count so addItem can use it accurately. to re-create table button id's
        //In theory  numOfProducts should be at 0 when we start to add table back in
      }
      for (i=newItemNumber;i<products.length-1;i++){//stopping 1 entry before end of products (Test)
        //keeping same itemNumbers in each index.  Start with item to be replaced and work up to end
        products[i].prodname = products[i+1].prodname;
        products[i].cost = products[i+1].cost;
        products[i].info = products[i+1].info;
      }
      products.length -= 1;//remove last entry of products.
      //Add row visually for each product.
      for (i=0;i<products.length;i++){
        addItem(products[i].prodname, products[i].cost, products[i].info);
      }
    }
    document.getElementById('customizeResult').innerHTML = 'The selected item has been removed.';
    storeShop();
  }
//}

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
    cell5.innerHTML = info;
    document.getElementById('customizeResult').innerHTML = 'The selected item has been updated.';
    storeShop();
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
  var newItemNumber = parseInt(myForm.elements[1].value);
  var newProduct = myForm.elements[2].value;
  var newCost = parseInt(myForm.elements[3].value);
  var info = myForm.elements[4].value;
  //var bgColor  = myForm.elements[5].value;
  //var fontColor = myForm.elements[6].value;
  //var productsBgColor = myForm.elements[7].value;
  //var productsFontColor = myForm.elements[8].value;
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
    //case 'updateStyles':
    //  updateStyles(bgColor,fontColor,productsBgColor);
      //document.getElementById('customizeResult').innerHTML = 'Action build in progress';
    //  break;
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
//document.getElementById('pauseResume').addEventListener('click', scrollImage);

function scrollImage(id){
  switch (id){
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


/**************Work on CSS class changes for different page loads here************/
function shopHomeLoad(){
  //show shopHomeContent id, hide editShopContent and selectCharacterContent
  //Note: Removing a class that does not exist, does NOT throw an error
  loadingStarts();
  document.getElementById('shopHomeContent').classList.remove('displayNone');
  document.getElementById('editShopContent').classList.add('displayNone');
  document.getElementById('selectCharacterContent').classList.add('displayNone');
  var menuButton = document.getElementById('menuToggle');
  menuToggle(menuButton);
  //document.getElementById('shopTotal').classList.remove('displayNone');
}

function shopEditorLoad(){
  loadingStarts();
  document.getElementById('editShopContent').classList.remove('displayNone');
  document.getElementById('shopHomeContent').classList.remove('displayNone');
  document.getElementById('selectCharacterContent').classList.add('displayNone');
  var menuButton = document.getElementById('menuToggle');
  menuToggle(menuButton);
  //View Shop Home content but hide the total line
  //document.getElementById('shopTotal').classList.add('displayNone');
}

function characterSelectLoad(){
  loadingStarts();
  document.getElementById('selectCharacterContent').classList.remove('displayNone');
  document.getElementById('shopHomeContent').classList.add('displayNone');
  document.getElementById('editShopContent').classList.add('displayNone');
  var menuButton = document.getElementById('menuToggle');
  menuToggle(menuButton);
  //document.getElementById('shopTotal').classList.add('displayNone');
}

/*********Make Shop Editor Pretty, and use Transitions YAY*********/
function NextView(){
  //switch that chooses which class to add to the form options,
  //Bring the correct options and button into view by removing the off view,
  // (or hidden) class.
  choice = document.getElementById('choiceId').value;
  var itemNumberLabel = document.getElementById('itemNumberLabel');
  var productNameLabel = document.getElementById('productNameLabel');
  var costLabel = document.getElementById('costLabel');
  var infoLabel = document.getElementById('infoLabel');
  //var bgColorLabel = document.getElementById('bgColorLabel');
  //var fontColorLabel = document.getElementById('fontColorLabel');
  //var shopBgColorLabel = document.getElementById('shopBgColorLabel');
  var addItem = document.getElementById('addItem');
  var removeItem = document.getElementById('removeItem');
  var updateItem = document.getElementById('updateItem');
  //var updateStyles = document.getElementById('updateStyles');
  var astrix = document.getElementById('astrix');
  switch (choice) {
    case 'Add an Item':
      itemNumberLabel.classList.remove('onScreen');
      //Need to add the offScreen which skips transition because of display none to block change
      //Then add onScreen.  When removing I need to remove both offScreen and onScreen
      //Well, that didn't work....maybe last idea here: https://www.impressivewebs.com/animate-display-block-none/
      productNameLabel.classList.add('onScreen');
      costLabel.classList.add('onScreen');
      infoLabel.classList.add('onScreen');
    //  bgColorLabel.classList.remove('onScreen');
    //  fontColorLabel.classList.remove('onScreen');
    //  shopBgColorLabel.classList.remove('onScreen');
      addItem.classList.add('onScreen');
      removeItem.classList.remove('onScreen');
      updateItem.classList.remove('onScreen');
    //  updateStyles.classList.remove('onScreen');
      astrix.classList.add('onScreen');
      break;
    case 'Remove an Item':
      itemNumberLabel.classList.add('onScreen');
      productNameLabel.classList.remove('onScreen');
      costLabel.classList.remove('onScreen');
      infoLabel.classList.remove('onScreen');
    //  bgColorLabel.classList.remove('onScreen');
    //  fontColorLabel.classList.remove('onScreen');
    //  shopBgColorLabel.classList.remove('onScreen');
      addItem.classList.remove('onScreen');
      removeItem.classList.add('onScreen');
      updateItem.classList.remove('onScreen');
    //  updateStyles.classList.remove('onScreen');
      astrix.classList.add('onScreen');
      break;
    case 'Update an Item':
      itemNumberLabel.classList.add('onScreen');
      productNameLabel.classList.add('onScreen');
      costLabel.classList.add('onScreen');
      infoLabel.classList.add('onScreen');
    //  bgColorLabel.classList.remove('onScreen');
    //  fontColorLabel.classList.remove('onScreen');
    //  shopBgColorLabel.classList.remove('onScreen');
      addItem.classList.remove('onScreen');
      removeItem.classList.remove('onScreen');
      updateItem.classList.add('onScreen');
    //  updateStyles.classList.remove('onScreen');
      astrix.classList.add('onScreen');
      break;
    case 'Update Shop Styles':
      itemNumberLabel.classList.remove('onScreen');
      productNameLabel.classList.remove('onScreen');
      costLabel.classList.remove('onScreen');
      infoLabel.classList.remove('onScreen');
    //  bgColorLabel.classList.add('onScreen');
    //  fontColorLabel.classList.add('onScreen');
    //  shopBgColorLabel.classList.add('onScreen');
      addItem.classList.remove('onScreen');
      removeItem.classList.remove('onScreen');
      updateItem.classList.remove('onScreen');
    //  updateStyles.classList.add('onScreen');
      astrix.classList.remove('onScreen');
      break;
    case '':
      itemNumberLabel.classList.remove('onScreen');
      productNameLabel.classList.remove('onScreen');
      costLabel.classList.remove('onScreen');
      infoLabel.classList.remove('onScreen');
    //  bgColorLabel.classList.remove('onScreen');
    //  fontColorLabel.classList.remove('onScreen');
    //  shopBgColorLabel.classList.remove('onScreen');
      addItem.classList.remove('onScreen');
      removeItem.classList.remove('onScreen');
      updateItem.classList.remove('onScreen');
    //  updateStyles.classList.remove('onScreen');
      astrix.classList.remove('onScreen');
      break;
    default:
      document.getElementById('customizeResult').innerHTML = 'Something went wrong with your request';
      break;
    }
}



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
