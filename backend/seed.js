require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Category = require("./models/Category");
const Question = require("./models/Question");
const Answer = require("./models/Answer");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Mongo connected");

  // 1) Ensure demo user
  const email = "demo@example.com";
  const username = "demo";
  const password = "Passw0rd!";
  const passwordHash = await bcrypt.hash(password, 10);

  let demoUser = await User.findOne({ email });
  if (!demoUser) {
    demoUser = await User.create({ username, email, passwordHash });
    console.log("Created demo user:", email);
  } else {
    console.log("Demo user already exists:", email);
  }

  // 2) Seed categories (idempotent)
  const cats = [
    { name: "Classic American Cars", description: "Ford, Chevrolet, Mopar, etc." },
    { name: "European Classics", description: "Jaguar, Mercedes, Alfa Romeo, etc." },
    { name: "Restoration Tips", description: "Bodywork, paint, chassis, rust repair" },
    { name: "Car Shows & Events", description: "Shows, meets, local events" },
    { name: "Parts & Accessories", description: "Finding parts, suppliers, fitment" },
  ];

  const upsertedCats = [];
  for (const c of cats) {
    const found = await Category.findOne({ name: c.name });
    if (found) upsertedCats.push(found);
    else {
      const created = await Category.create(c);
      upsertedCats.push(created);
    }
  }

  // 3) Seed one question per category (only if none exist)
  const countQ = await Question.countDocuments();
  if (countQ === 0) {
    const q1 = await Question.create({
      title: "What year was the Ford Mustang first released?",
      content: "Was it 1964 or 1965?",
      category: upsertedCats.find(c => c.name === "Classic American Cars")._id,
      user: demoUser._id,
    });
    const q2 = await Question.create({
      title: "Best rust treatment for an E-Type Jaguar?",
      content: "Should I media blast or treat chemically?",
      category: upsertedCats.find(c => c.name === "European Classics")._id,
      user: demoUser._id,
    });
    const q3 = await Question.create({
      title: "Paint first or mechanical first on a frame-off?",
      content: "What's the smartest order of operations?",
      category: upsertedCats.find(c => c.name === "Restoration Tips")._id,
      user: demoUser._id,
    });

    // answers (sample)
    await Answer.create({
      questionId: q1._id,
      authorId: demoUser._id,
      content: "1964½ models were released mid-1964; commonly referred to as 1965.",
    });
    await Answer.create({
      questionId: q2._id,
      authorId: demoUser._id,
      content: "Blast only if panels are solid; otherwise phosphoric acid is safer.",
    });
  }

  console.log("Seed complete.");
  await mongoose.disconnect();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
