const { neon } = require("@neondatabase/serverless");
const { config } = require("dotenv");
const path = require("path");

// Try loading from different locations
config({ path: ".env.local" });
config({ path: ".env" });

// If still not found, use the direct URL from your previous successful script
const DATABASE_URL = "postgresql://library_owner:LsatFQo1TJX2@ep-tight-mud-a2no7dyl.eu-central-1.aws.neon.tech/library?sslmode=require";

console.log("🔧 Connecting to database...");

const sql = neon(DATABASE_URL);
const placeholderUrl = "https://placehold.co/400x600/1e293b/ffffff?text=Book+Cover";

async function fixMissingCovers() {
  console.log("🔍 Fixing missing book covers...\n");
  
  try {
    // First, check which books have the problematic URLs
    const problemBooks = await sql`
      SELECT id, title, cover_url 
      FROM books 
      WHERE cover_url LIKE '%Activate Upstash%' 
      OR cover_url LIKE '%Clipped_image%'
    `;
    
    console.log(`Found ${problemBooks.length} books with missing covers:\n`);
    problemBooks.forEach(book => {
      console.log(`  - ${book.title}`);
      console.log(`    Current: ${book.cover_url}\n`);
    });
    
    if (problemBooks.length === 0) {
      console.log("✅ No missing covers found!");
      return;
    }
    
    // Update to placeholder
    const result = await sql`
      UPDATE books 
      SET cover_url = ${placeholderUrl}
      WHERE cover_url LIKE '%Activate Upstash%' 
      OR cover_url LIKE '%Clipped_image%'
      RETURNING id, title
    `;
    
    console.log(`\n✅ Updated ${result.length} books to use placeholder image:`);
    result.forEach(book => {
      console.log(`  - ${book.title}`);
    });
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

fixMissingCovers();