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
var i;
for(i in products){//Populate table
  document.getElementById("row"+i+"num").innerHTML = products[i].getItemnum();
  document.getElementById("row"+i+"name").innerHTML = products[i].getProdname();
  document.getElementById("row"+i+"cost").innerHTML = products[i].getCost();
}

var myCart = new Array();
var cartLength = 0;
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
  var cart = "";
  var total = 0;
  for (i in myCart){
    cart += myCart[i].getProdname() +" "+  myCart[i].getCost() + "<br />";
    total += myCart[i].cost;
  }
  document.getElementById("viewCart").innerHTML = cart;
  document.getElementById("total").innerHTML = total;
}

//Calculate cart existing total
