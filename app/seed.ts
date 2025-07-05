import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { FrequentFlyerProgram } from "@/app/_models/frequent-flyer-program.model";
import { CreditCard } from "@/app/_models/credit-card.model";
import { TransferRatio } from "@/app/_models/transfer-ratio.model";

export async function seed() {
  await connectDB();
  console.log("🌱 Connected to DB");

  await FrequentFlyerProgram.deleteMany({});
  await CreditCard.deleteMany({});
  await TransferRatio.deleteMany({});
  console.log("🧹 Cleared existing data");

  // Seed Credit Cards
  const creditCards = await CreditCard.insertMany([
    { name: "Air India Signature", bankName: "SBI", archived: false },
    { name: "Rewards", bankName: "AXIS", archived: false },
    { name: "Centurion", bankName: "AMEX", archived: false },
    { name: "Indulge", bankName: "IndusInd", archived: false },
    { name: "First Preferred", bankName: "YES", archived: false },
    { name: "ThankYou Preferred", bankName: "Citibank", archived: false },
    { name: "Pride Platinum", bankName: "AXIS", archived: false },
    { name: "Platinum Plus", bankName: "HDFC", archived: false },
    { name: "Ink Business Cash", bankName: "Chase", archived: false },
    { name: "Platinum Card", bankName: "AMEX", archived: false },
    { name: "Membership Rewards", bankName: "AMEX", archived: false },
    { name: "Etihad Guest Premier", bankName: "SBI", archived: false },
    { name: "Ink Plus", bankName: "Chase", archived: false },
    { name: "Propel AmEx", bankName: "Wells Fargo", archived: false },
    { name: "Diners Club Rewardz", bankName: "HDFC", archived: false },
    { name: "PRIVATE Credit Card", bankName: "YES", archived: false },
    { name: "Air India Platinum", bankName: "SBI", archived: false },
    { name: "Venture X Rewards", bankName: "Capital One", archived: false },
    { name: "Iconia", bankName: "IndusInd", archived: false },
    { name: "Business Gold", bankName: "AMEX", archived: false },
  ]);
  console.log("💳 Inserted Credit Cards");

  // Seed Frequent Flyer Programs
  const ffps = await FrequentFlyerProgram.insertMany([
    {
      name: "Royal Orchid Plus",
      assetName: "royal-orchid-plus.svg",
      enabled: true,
      archived: false,
    },
    {
      name: "KrisFlyer",
      assetName: "krisflyer.svg",
      enabled: true,
      archived: false,
    },
    {
      name: "Asiana Club",
      assetName: "asiana-club.svg",
      enabled: true,
      archived: false,
    },
    {
      name: "AAdvantage",
      assetName: "aadvantage.svg",
      enabled: true,
      archived: false,
    },
    {
      name: "Flying Blue",
      assetName: "flying-blue.svg",
      enabled: true,
      archived: false,
    },
    {
      name: "SkyMiles",
      assetName: "skymiles.svg",
      enabled: true,
      archived: false,
    },
    { name: "Enrich", assetName: "enrich.svg", enabled: true, archived: false },
    {
      name: "Privilege Club",
      assetName: "privilege-club.svg",
      enabled: true,
      archived: false,
    },
    {
      name: "Miles&Smiles",
      assetName: "miles-and-smiles.svg",
      enabled: true,
      archived: false,
    },
    {
      name: "Skywards",
      assetName: "skywards.svg",
      enabled: true,
      archived: false,
    },
    {
      name: "Asia Miles",
      assetName: "asia-miles.svg",
      enabled: true,
      archived: false,
    },
    {
      name: "Airpoints",
      assetName: "airpoints.svg",
      enabled: true,
      archived: false,
    },
    {
      name: "Maharaja Club",
      assetName: "maharaja-club.svg",
      enabled: true,
      archived: false,
    },
    {
      name: "TrueBlue",
      assetName: "trueblue.svg",
      enabled: true,
      archived: false,
    },
    {
      name: "LifeMiles",
      assetName: "lifemiles.svg",
      enabled: true,
      archived: false,
    },
    {
      name: "Aeroplan",
      assetName: "aeroplan.svg",
      enabled: true,
      archived: false,
    },
    {
      name: "Executive Club",
      assetName: "executive-club.svg",
      enabled: true,
      archived: false,
    },
    {
      name: "Frequent Flyer",
      assetName: "qantas-frequent-flyer.svg",
      enabled: true,
      archived: false,
    },
    {
      name: "TAP Miles&Go",
      assetName: "miles-and-go.svg",
      enabled: true,
      archived: false,
    },
    {
      name: "AeroMexico Rewards",
      assetName: "aeromexico-rewards.svg",
      enabled: true,
      archived: false,
    },
  ]);
  console.log("✈️ Inserted Frequent Flyer Programs");

  // Seed Transfer Ratios
  const ratios = [];
  for (const ffp of ffps) {
    const cards = creditCards
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 1);
    for (const card of cards) {
      ratios.push({
        programId: ffp._id,
        creditCardId: card._id,
        ratio: Number((Math.random() * 1.5 + 0.5).toFixed(2)), // 0.5 – 2.0
        archived: false,
      });
    }
  }

  await TransferRatio.insertMany(ratios);
  console.log(`🔗 Inserted ${ratios.length} transfer ratios`);

  // await mongoose.disconnect();
  // console.log("✅ Seeding complete. DB disconnected.");
}

// seed().catch((err) => {
//   console.error("❌ Error during seeding:", err);
//   process.exit(1);
// });
