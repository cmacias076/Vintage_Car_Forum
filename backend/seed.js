require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Category = require('./models/Category');
const Question = require('./models/Question');
const Answer = require('./models/Answer');

async function run() {
  console.log('[seed] starting…');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('[seed] Mongo connected');

  // 1) Force-create demo user with a known password (avoid double-hash forever)
  const email = 'demo@example.com';
  const username = 'demo';
  const password = 'Passw0rd!';

  await User.deleteOne({ email });
  console.log('[seed] removed existing demo user (if any)');
  const demoUser = await new User({ username, email, passwordHash: password }).save();
  console.log('[seed] created demo user:', email);

  // 2) Categories (idempotent upsert)
  const cats = [
    { name: 'Classic American Cars', description: 'Ford, Chevrolet, Mopar, etc.' },
    { name: 'European Classics', description: 'Jaguar, Mercedes, Alfa Romeo, etc.' },
    { name: 'Restoration Tips', description: 'Bodywork, paint, chassis, rust repair' },
    { name: 'Car Shows & Events', description: 'Shows, meets, local events' },
    { name: 'Parts & Accessories', description: 'Finding parts, suppliers, fitment' },
  ];
  const upsertedCats = [];
  for (const c of cats) {
    const found = await Category.findOne({ name: c.name });
    upsertedCats.push(found || (await Category.create(c)));
  }
  console.log('[seed] categories ready:', upsertedCats.map((c) => c.name).join(', '));

  // 3) Only seed example questions/answers if none exist
  const countQ = await Question.countDocuments();
  if (countQ === 0) {
    const q1 = await Question.create({
      title: 'What year was the Ford Mustang first released?',
      content: 'Was it 1964 or 1965?',
      category: upsertedCats.find((c) => c.name === 'Classic American Cars')._id,
      user: demoUser._id,
    });
    const q2 = await Question.create({
      title: 'Best rust treatment for an E-Type Jaguar?',
      content: 'Should I media blast or treat chemically?',
      category: upsertedCats.find((c) => c.name === 'European Classics')._id,
      user: demoUser._id,
    });
    await Answer.create({
      questionId: q1._id,
      authorId: demoUser._id,
      content: '1964½ models launched mid-1964; commonly badged as 1965.',
    });
    await Answer.create({
      questionId: q2._id,
      authorId: demoUser._id,
      content: 'If panels are thin, use phosphoric acid instead of blasting.',
    });
    console.log('[seed] created sample questions/answers');
  } else {
    console.log('[seed] questions already exist; skipped creating samples');
  }

  console.log('[seed] complete.');
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('[seed] error:', err);
  process.exit(1);
});
