import Stripe from "stripe";

const createDormantProxy = (name: string): any => {
    const proxy: any = new Proxy(() => { }, {
        get: (_, prop) => {
            if (typeof prop === 'symbol') return undefined;
            return createDormantProxy(`${name}.${String(prop)}`);
        },
        apply: (target, thisArg, args) => {
            console.warn(`STRIPE_DORMANT: Attempted to call '${name}' with args:`, args);
            return Promise.resolve({ url: null, id: 'dormant_id' });
        }
    });
    return proxy;
};

const dormantStripeProxy = createDormantProxy('stripe');

export const stripe = process.env.STRIPE_API_KEY
    ? new Stripe(process.env.STRIPE_API_KEY, {
        apiVersion: "2025-02-24.acacia",
        typescript: true,
    })
    : (dormantStripeProxy as unknown as Stripe);

if (!process.env.STRIPE_API_KEY) {
    console.warn("STRIPE_DORMANT: Financial backbone is currently offline.");
}
