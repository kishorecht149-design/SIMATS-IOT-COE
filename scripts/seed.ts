import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { DEFAULT_SETTINGS } from "../src/lib/default-settings";
import { DEFAULT_PAGES } from "../src/lib/cms/default-pages";
import { hashPassword } from "../src/lib/auth/password";

async function runSeed() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/simats_iot_coe";
  console.log("Connecting to database for seeding:", uri.replace(/:([^:@]{3,})@/, ":****@"));

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB successfully.");

    // Dynamic import of models
    const { Settings } = await import("../src/models/Settings");
    const { Page } = await import("../src/models/Page");
    const { User } = await import("../src/models/User");

    // 1. Seed Global Settings
    const existingSettings = await Settings.findOne();
    if (!existingSettings) {
      await Settings.create(DEFAULT_SETTINGS);
      console.log("✓ Seeded Global Institutional Settings.");
    } else {
      console.log("• Global Settings already present, skipping.");
    }

    // 2. Seed Super Admin Account
    const email = process.env.ADMIN_INITIAL_EMAIL || "admin@saveetha.simats.edu";
    const password = process.env.ADMIN_INITIAL_PASSWORD || "SaveethaIoTCoE2026!";
    const existingAdmin = await User.findOne({ email: email.toLowerCase() });

    if (!existingAdmin) {
      const passwordHash = await hashPassword(password);
      await User.create({
        name: "CoE Super Administrator",
        email: email.toLowerCase(),
        passwordHash,
        role: "SUPER_ADMIN",
        isActive: true,
      });
      console.log(`✓ Seeded Super Admin account: ${email}`);
    } else {
      console.log(`• Super Admin account (${email}) already exists.`);
    }

    // 3. Seed Default CMS Pages
    for (const [slug, pageConfig] of Object.entries(DEFAULT_PAGES)) {
      const existingPage = await Page.findOne({ slug });
      if (!existingPage) {
        await Page.create({
          slug,
          title: pageConfig.title,
          metaDescription: pageConfig.metaDescription,
          sections: pageConfig.sections,
          status: "published",
          version: 1,
        });
        console.log(`✓ Seeded CMS Page: /${slug === "home" ? "" : slug}`);
      } else {
        console.log(`• CMS Page /${slug} already present.`);
      }
    }

    console.log("\n==========================================");
    console.log("Database Seeding Completed Successfully!");
    console.log("Portal Admin: " + email);
    console.log("Initial Pass: " + password);
    console.log("==========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

runSeed();
