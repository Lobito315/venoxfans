import dotenv from 'dotenv';
dotenv.config();

const { PAYPAL_CLIENT_ID, PAYPAL_SECRET } = process.env;
const BASE_URL = 'https://api-m.sandbox.paypal.com'; // Use sandbox for now

/**
 * Generates an OAuth 2.0 access token from PayPal.
 * @see https://developer.paypal.com/docs/api/reference/get-an-access-token/
 */
export async function generateAccessToken() {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
        console.error('[paypalService] Missing PAYPAL_CLIENT_ID or PAYPAL_SECRET in environment variables');
        throw new Error('Missing PayPal credentials');
    }

    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
    const response = await fetch(`${BASE_URL}/v1/oauth2/token`, {
        method: 'POST',
        body: 'grant_type=client_credentials',
        headers: {
            Authorization: `Basic ${auth}`,
        },
    });

    const data = await response.json() as any;
    return data.access_token;
}

/**
 * Creates a PayPal order.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
export async function createPayPalOrder(amount: string, currency: string = 'USD') {
    const accessToken = await generateAccessToken();
    const response = await fetch(`${BASE_URL}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: currency,
                        value: amount,
                    },
                },
            ],
        }),
    });

    return handleResponse(response);
}

/**
 * Captures a PayPal order.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 */
export async function capturePayPalOrder(orderID: string) {
    const accessToken = await generateAccessToken();
    const response = await fetch(`${BASE_URL}/v2/checkout/orders/${orderID}/capture`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return handleResponse(response);
}

async function handleResponse(response: Response) {
    if (response.status === 200 || response.status === 201) {
        return response.json();
    }

    const errorMessage = await response.text();
    throw new Error(`PayPal Error: ${response.status} - ${errorMessage}`);
}
