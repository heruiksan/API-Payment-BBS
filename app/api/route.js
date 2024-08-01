console.log('Route API executed');

import Midtrans from "midtrans-client";
import { NextResponse } from "next/server";

let snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.SECRET,
  clientKey: process.env.NEXT_PUBLIC_CLIENT,
});

export async function POST(request) {
  try {
    const { orderId, productName, totalPayment } = await request.json();

    console.log('Received payload:', { orderId, productName, totalPayment });

    let parameter = {
      item_details: [
        {
          id: orderId,
          name: productName,
          price: totalPayment,
          quantity: 1,
        },
      ],
      transaction_details: {
        order_id: orderId,
        gross_amount: totalPayment,
      },
    };

    const token = await snap.createTransactionToken(parameter);
    console.log('Generated token:', token);

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error creating transaction token:', error);
    return NextResponse.json({ message: 'Failed to create transaction token' }, { status: 500 });
  }
}
