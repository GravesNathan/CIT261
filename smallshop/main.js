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

//Later, Add the function to automatically create the table based
//on the number of products available for sale.
//If possible have it dynamically create the labels to use with
//the getElementById functions.

var myCart = new Array();
var cartLength = 0;
var i;

for(i in products){//Populate table
  document.getElementById("row"+i+"num").innerHTML = products[i].getItemnum();
  document.getElementById("row"+i+"name").innerHTML = products[i].getProdname();
  document.getElementById("row"+i+"cost").innerHTML = products[i].getCost();
}




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
      document.getElementById('storageNotice').innerHTML = ("Cart from previous visit has been loaded.");
      viewCart();
    }
  } else{
    //Browser or privacy setting doesn't support local storage.
    document.getElementById('storageNotice').innerHTML = ("local storage API is not suppported in your browser or your storage capacity is full.  Please enable localStorage in your browser to receive full benefits from this shop.");
  }

}
