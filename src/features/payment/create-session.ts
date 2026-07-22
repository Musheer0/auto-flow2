import { client } from "./client";

export const create_session = (email:string ,name:string)=>{
    return client.checkoutSessions.create({
  product_cart: [{ product_id: process.env.PRODUCT_ID!, quantity: 1 }],
  customer: { email, name},
  return_url: `${process.env.APP}/checkout/success`,
});
}