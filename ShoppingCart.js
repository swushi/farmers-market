/*
[x] create shopping cart class
[x] implement products into static object (include discounts in here with negative price)
[x] create menu to add items to cart (Type product code to add item to cart, get user input)
[x] determine subtotal (w/o discounts)
[x] create cart to hold cart items (product code and discount code if applies, CAN BE NULL)
    determining total will just add all code prices up (products and discounts)
[ ] implement a function to check for each discount to see if it is available
    this will most likely be a part of the checkout function
    each discount will have it's own respective function
[x] BOGO discount - on every other coffee, add BOGO discount (price of coffee)
[X] APPL discount - if there are at least 3 apples, every single one recevies a 1.50 discount
[x] CHMK discount - purchase chai and add milk at the end and milk discount CAUSED SOME ISSUES (DON'T NEED TO ADD MILK)
*/

const prompt = require('prompt-sync')({ sigint: true });

class ShoppingCart {
  static products = {
    CH1: {
      name: "Chai",
      price: "3.11",
    },
    AP1: {
      name: "Apples",
      price: "6.00",
    },
    CF1: {
      name: "Coffee",
      price: "11.23",
    },
    MK1: {
      name: "Milk",
      price: "4.75",
    },
    OM1: {
      name: "Oatmeal",
      price: "3.69",
    },
    BOGO: {
      name: "Buy-One-Get-One-Free Special on Coffee. (Unlimited)",
      price: "-11.23",
    },
    APPL: {
      name: "If you buy 3 or more bags of Apples, the price drops to $4.50.",
      price: "-1.50",
    },
    CHMK: {
      name: "Purchase a box of Chai and get milk free. (Limit 1)",
      price: "-4.75",
    },
    APOM: {
      name: "Purchase a bag of Oatmeal and get 50% off a bag of Apples",
      price: "-3.00",
    }
  }

  cartItems = []; // all codes in cart, discounts added when calculating total

  clearCart() {
    this.cartItems = [];
  }

  showMenu() {
    console.clear();
    console.log('');
    console.log('SHOPPING CART');
    console.log('');
    console.log('+--------------|--------------|---------+');
    console.log('| Product Code |     Name     |  Price  |');
    console.log('+--------------|--------------|---------+');
    console.log('|     CH1      |   Chai       |  $3.11  |');
    console.log('|     AP1      |   Apples     |  $6.00  |');
    console.log('|     CF1      |   Coffee     | $11.23  |');
    console.log('|     MK1      |   Milk       |  $4.75  |');
    console.log('|     OM1      |   Oatmeal    |  $3.69  |');
    console.log('+--------------|--------------|---------+');
    console.log(' ');
  }

  prompt() {
    console.clear();
    console.log("");
    console.log("MAIN MENU");
    console.log("");
    console.log("a - Add item to my cart");
    console.log("p - Show my cart");
    console.log("c - Clear Cart");
    console.log("q - Quit");
    console.log("")

    const choice = prompt('Enter your selection: ').toLowerCase();
    return choice;
  }

  total() {
    let sum = 0;
    this.cartItems.forEach(item => {
      const itemPrice = parseFloat(ShoppingCart.products[item].price);
      sum += itemPrice;
    })

    return sum;
  }

  addItem() {
    this.showMenu();
    const item = prompt('Enter a product code: ').toUpperCase();

    if (!(item in ShoppingCart.products)) {
      prompt("\nThat item does not exist\nPress enter to continue..")
      return;
    }

    this.cartItems.push(item);

    prompt(`\n${ShoppingCart.products[item].name} successfully added to cart. Press enter to continue...`);
  }

  printCart() { //35 Width
    const subTotal = this.total().toFixed(2).toString();

    console.clear();
    console.log('');
    console.log('Item                          Price');
    console.log('----                          -----');

    this.cartItems.forEach(item => {
      const itemPrice = ShoppingCart.products[item].price;

      if (parseInt(itemPrice) > 0) {
        const numSpaces = 35 - item.length - itemPrice.length;
        console.log(`${item}${' '.repeat(numSpaces)}${itemPrice}`);
      } else {
        const numSpaces = 35 - 10 - item.length - itemPrice.length;
        console.log(`${' '.repeat(10)}${item}${' '.repeat(numSpaces)}${itemPrice}`);
      }
    })

    console.log('-----------------------------------');

    const numSpaces = 35 - subTotal.length;
    console.log(`${' '.repeat(numSpaces)}${subTotal}`);

    console.log('')
    prompt("Press enter to continue..");
  }

  bogoCoffeeDiscount() { // on every other coffee insert discount
    let seenCoffee = false;
    for (let i = 0; i < this.cartItems.length; i++) {
      if (this.cartItems[i] === "CF1") {
        if (seenCoffee) {
          this.cartItems.splice(i + 1, 0, "BOGO");
        }
        seenCoffee = !seenCoffee;
      }
    }
  }

  appleDiscount() {
    const numApples = this.cartItems.filter(item => item === "AP1").length;

    if (numApples >= 3) {
      for (let i = 0; i < this.cartItems.length; i++) {
        if (this.cartItems[i] === "AP1") {
          this.cartItems.splice(i + 1, 0, "APPL");
        }
      }
    }
  }

  chaiMilkDiscount() {
    const hasChai = this.cartItems.includes("CH1");

    if (hasChai) {
      for (let i = 0; i < this.cartItems.length; i++) {
        if (this.cartItems[i] === "MK1") {
          this.cartItems.splice(i + 1, 0, "CHMK");
          return; // only applies to one milk
        }
      }
    }
  }

  oatmealAppleDiscount() {
    // if there is a discount already on apples, this should take priority
    // remove discount on last apple and replace with this discount
    if (!this.cartItems.includes("OM1")) return;

    const numApples = this.cartItems.filter(item => item === "AP1").length;

    if (numApples >= 3) {
      for (let i = this.cartItems.length - 1; i >= 0; i--) { // find last apple
        const item = this.cartItems[i];
        if (item === "APPL") { // apple discount
          this.cartItems[i] = "APOM";
          return;
        }
      }
    }
  }

  removeDiscounts() {
    for (let i = 0; i < this.cartItems.length; i++) {
      const item = this.cartItems[i];
      const price = parseFloat(ShoppingCart.products[item].price);

      // remove all negatively priced items
      if (price < 0) {
        this.cartItems.splice(i, 1);
      }
    }
  }

  checkout() {
    this.removeDiscounts();
    this.bogoCoffeeDiscount();
    this.appleDiscount();
    this.chaiMilkDiscount();
    this.oatmealAppleDiscount();

    this.printCart();
  }
}

module.exports = ShoppingCart;