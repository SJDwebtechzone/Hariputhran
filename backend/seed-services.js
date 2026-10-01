require("dotenv").config();
const pool = require("./src/db");
const { DEFAULT_SERVICES } = require("./src/constants/defaultServices");

async function seedServices() {
  try {
    console.log("Checking services table...");

    const check = await pool.query("SELECT COUNT(*) FROM services");
    const count = parseInt(check.rows[0].count, 10);

    if (count > 0) {
      console.log(`Services table already has ${count} records. Skipping seed.`);
      process.exit(0);
    }

    console.log("Seeding default services...");

    let inserted = 0;
    for (const s of DEFAULT_SERVICES) {
      await pool.query(
        `INSERT INTO services (
          title, description, features, button_label, button_link, icon_key, sort_order, is_active, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
        [
          s.title,
          s.description,
          JSON.stringify(s.features),
          s.button_label,
          s.button_link,
          s.icon_key,
          s.sort_order,
          s.is_active,
        ]
      );
      inserted++;
    }

    console.log(`Successfully seeded ${inserted} default services!`);
    process.exit(0);
  } catch (err) {
    console.error("Error seeding services:", err);
    process.exit(1);
  }
}

seedServices();
