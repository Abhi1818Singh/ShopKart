import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_ShopKartMockId";
const keySecret = process.env.RAZORPAY_KEY_SECRET || "ShopKartMockSecretKey123";

let razorpayInstance = null;

try {
    razorpayInstance = new Razorpay({
        key_id: keyId,
        key_secret: keySecret
    });
} catch (error) {
    console.error("Razorpay initialization error:", error);
}

export const getRazorpayInstance = () => razorpayInstance;
export { keyId, keySecret };
