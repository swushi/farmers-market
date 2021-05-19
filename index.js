const ShoppingCart = require('./ShoppingCart');

const shoppingCart = new ShoppingCart();

let choice;

do {
  choice = shoppingCart.prompt();

  switch (choice) {
    case "a":
      shoppingCart.addItem();
      break;
    case "p":
      shoppingCart.checkout();
      break;
    case "c":
      shoppingCart.clearCart();
      break;
  }

} while (choice !== "q") {

}