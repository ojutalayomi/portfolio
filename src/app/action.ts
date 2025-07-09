import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { Decoder } from "base32.js";

const key = process.env.SECRET_KEY || '';

const decoder = new Decoder(); // RFC 4648 standard
const secretBuffer = Buffer.from(decoder.write(key).finalize());

export function verifyOTP(otp: string) {
  if (!key) throw new Error("Secret key is not set. Please set the SECRET_KEY environment variable.");
  if (!/^[A-Z2-7]+=*$/.test(key)) throw new Error("SECRET_KEY is not a valid base32 string.");
  if (!otp) throw new Error("OTP is required for verification.");
  const verified = speakeasy.totp.verify({
    secret: secretBuffer as unknown as string,
    encoding: "base32",
    token: otp,
  });
  if (!verified) throw new Error("Invalid OTP. Please try again.");
  return verified;
}

// Function to generate a QR code URL for Google Authenticator
export async function generateQRCodeURL() {
  if (!key) throw new Error("Secret key is not set. Please set the SECRET_KEY environment variable.");
  const otpauthUrl = speakeasy.otpauthURL({
    secret: key,
    label: "Ayo:myuser",
    issuer: "Ayo",
    encoding: "base32",
  });
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(otpauthUrl, (err, dataURL) => {
      if (err) reject(err);
      else resolve({ dataURL, key });
    });
  });
}

export function generate_secret_key() {
  // Generate a secret key
  const secretKey = speakeasy.generateSecret();

  return secretKey;
}

export function generate_totp() {
  // Generate a TOTP token
  const token = speakeasy.totp({
    secret: secretBuffer as unknown as string,
    encoding: "base32",
  });

  return token;
}