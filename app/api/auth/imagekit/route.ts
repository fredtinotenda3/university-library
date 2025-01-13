import ImageKit from "imagekit";
import config from "@/lib/config";
import { NextResponse } from "next/server";

// Destructure imagekit credentials from config
const {
  env: {
    imagekit: { publicKey, privateKey, urlEndpoint },
  },
} = config;

// Debugging logs to check the environment variables
console.log("ImageKit publicKey:", publicKey);
console.log("ImageKit privateKey:", privateKey);
console.log("ImageKit urlEndpoint:", urlEndpoint);

// Initialize ImageKit instance
const imagekit = new ImageKit({
  publicKey,
  privateKey,
  urlEndpoint,
});

export async function GET() {
  return NextResponse.json(imagekit.getAuthenticationParameters());
}
