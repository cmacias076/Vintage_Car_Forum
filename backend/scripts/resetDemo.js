require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

(async () => {
  try {
    console.log('Connecting to Mongo…');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected.');

    const email = 'demo@example.com';
    const username = 'demo';
    const password = 'Passw0rd!';

    await User.deleteOne({ email });
    console.log('Removed old demo user (if existed).');

    const demo = new User({ username, email, passwordHash: password });
    await demo.save();
    console.log('Recreated demo user:', email);

    await mongoose.disconnect();
    console.log('Done.');
  } catch (err) {
    console.error('Reset failed:', err);
    process.exit(1);
  }
})();
