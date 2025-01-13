import ImageKit from "imagekit";
import config from "@/lib/config";
import { NextResponse } from "next/server";

// Debugging: log the values of publicKey, privateKey, and urlEndpoint before initialization
const {
  env: {
    imagekit: { publicKey, privateKey, urlEndpoint },
  },
} = config;

console.log("Public Key from config:", publicKey); // Log publicKey to check its value
console.log("Private Key from config:", privateKey); // Log privateKey to check its value
console.log("URL Endpoint from config:", urlEndpoint); // Log URL Endpoint to check its value

if (!publicKey) {
  console.error("Error: publicKey is not defined.");
}

// Initialize ImageKit instance
const imagekit = new ImageKit({
  publicKey,
  privateKey,
  urlEndpoint,
});

export async function GET() {
  return NextResponse.json(imagekit.getAuthenticationParameters());
}
