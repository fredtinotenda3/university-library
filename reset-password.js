const { neon } = require("@neondatabase/serverless");
const { config } = require("dotenv");
const bcrypt = require("bcryptjs");

// Load environment variables from .env.local
config({ path: ".env.local" });

// Also try .env if .env.local doesn't work
if (!process.env.DATABASE_URL) {
  config({ path: ".env" });
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("❌ DATABASE_URL not found in environment variables");
  console.log("Please check your .env.local file");
  process.exit(1);
}

console.log("✅ Database URL found, connecting...");

const sql = neon(databaseUrl);

async function resetPassword() {
  const email = "fredtinotenda3@gmail.com";
  const newPassword = "admin123";
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  try {
    const result = await sql`
      UPDATE users 
      SET password = ${hashedPassword}
      WHERE email = ${email}
      RETURNING email, full_name
    `;
    
    if (result.length > 0) {
      console.log("✅ Password reset for:", result[0]);
      console.log("📝 Email:", email);
      console.log("📝 New Password:", newPassword);
      console.log("\n🔐 You can now sign in at http://localhost:3000/sign-in");
    } else {
      console.log("❌ User not found with email:", email);
      
      // List all users to help debug
      const allUsers = await sql`
        SELECT email, full_name FROM users LIMIT 5
      `;
      console.log("\n📋 Available users in database:");
      allUsers.forEach(user => {
        console.log(`   - ${user.email} (${user.full_name})`);
      });
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

resetPassword();