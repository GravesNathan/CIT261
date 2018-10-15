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
}

//clear cart of all contents
function clearCart(){
  myCart = [];
  cartLength = 0;
  document.getElementById("viewCart").innerHTML = "";
  document.getElementById("total").innerHTML = "0"
}

function viewCart(){
  var tempCart = "";
  var total = 0;
  for (i in myCart){
    tempCart += myCart[i].getProdname() +" "+  myCart[i].getCost() + "<br />";
    total += myCart[i].cost;
  }
  document.getElementById("viewCart").innerHTML = tempCart;
  document.getElementById("total").innerHTML = total;
}

//Interesting, I got a JSON string with brackets on the outside using stringfy...perhaps because I have an array object.
//It looked like this: [{"itemNumber":2,"prodname":"Game Boy","cost":20}]
function exportCart(){
  var jsonCart = JSON.stringify(myCart);
  document.getElementById("jsonCart").innerHTML = jsonCart;
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
}
//Calculate cart existing total
