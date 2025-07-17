'use server';

import { userDetails } from "@/app/dashboard/pricing/page";
import { adminDb } from "@/firebaseAdmin";
import getBaseUrl from "@/lib/getBaseUrl";
import stripe from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";

export async function createCheckoutSession(userDetails: userDetails) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User Not Found");
  }

  const userRef = adminDb.collection("users").doc(userId);
  const userSnap = await userRef.get();
  let stripeCustomerId = userSnap.data()?.stripeCustomerId;

  // Create new Stripe customer if needed
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: userDetails.email,
      name: userDetails.name,
      metadata: { userId },
    });

    stripeCustomerId = customer.id;

    await userRef.set({ stripeCustomerId }, { merge: true });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: 'price_1RlSTQPIAQPe0RZX0mivIxvn', // your price ID
        quantity: 1,
      },
    ],
    mode: "subscription",
    customer: stripeCustomerId,
    success_url: `${getBaseUrl()}/dashboard?pricing=true`,
    cancel_url: `${getBaseUrl()}/pricing`,
  });

  return session.id;
}
