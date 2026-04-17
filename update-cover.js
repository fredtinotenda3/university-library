const { neon } = require("@neondatabase/serverless");

const DATABASE_URL = "postgresql://library_owner:LsatFQo1TJX2@ep-tight-mud-a2no7dyl.eu-central-1.aws.neon.tech/library?sslmode=require";
const sql = neon(DATABASE_URL);

async function updateCover() {
  // Use a reliable working image URL
  const workingImageUrl = "https://picsum.photos/id/24/400/600";
  
  const result = await sql`
    UPDATE books 
    SET cover_url = ${workingImageUrl}
    WHERE title = 'Activate Upstash Database'
    RETURNING title, cover_url
  `;
  
  console.log("✅ Updated with working image!");
  console.log("📚 Book:", result[0].title);
  console.log("🖼️ New Cover URL:", result[0].cover_url);
}

updateCover();