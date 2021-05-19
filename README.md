To compile and run this project:
```
npm install
npm start
```

For a SQL solution, and to reflect the model that I represented I would go with the following:

PRODUCTS
  id -> product code or discount code Prim Key
  price
  description

DISCOUNTS
  id -> discount code Prim Key
  price
  description

CART
  product_id nullable
  discount_id nullable

Different functions would have to be handled depending discount id's present in cart.

