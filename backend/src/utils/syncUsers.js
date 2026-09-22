const bcrypt = require('bcrypt');
const User = require('../models/User');
const Alumni = require('../models/Alumni');
const Student = require('../models/Student');

/**
 * Synchronizes all Alumni and Student records in MongoDB:
 * 1. Ensures every record has a `password: '1234'` column.
 * 2. Ensures every record has an active User account with email as userid and password '1234'.
 * 3. Links userId on the Alumni/Student document.
 */
async function syncUsersAndPasswords() {
  try {
    const defaultPasswordHash = await bcrypt.hash('1234', 10);
    let syncedAlumni = 0;
    let syncedStudents = 0;

    // ─── 1. Sync Alumni Records ──────────────────────────────────────────────
    const allAlumni = await Alumni.find({});
    for (const alm of allAlumni) {
      if (!alm.email) continue;
      const cleanEmail = alm.email.toLowerCase().trim();

      // Ensure password field is set
      if (!alm.password || alm.password !== '1234') {
        alm.password = '1234';
      }

      // Check / Create User account
      let user = await User.findOne({ email: cleanEmail });
      if (!user) {
        user = await User.create({
          name: alm.name || cleanEmail.split('@')[0],
          email: cleanEmail,
          phone: alm.phone || '',
          passwordHash: defaultPasswordHash,
          role: 'alumni',
          status: 'ACTIVE',
          department: alm.department || alm.branch || 'AID',
          company: alm.company || '',
          designation: alm.designation || alm.role || 'Software Engineer',
          batch: alm.batch || '2023',
          location: alm.location || '',
          avatar: alm.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(alm.name || 'User')}&background=4f46e5&color=fff&size=150`
        });
      }

      alm.userId = user._id;
      await alm.save();
      syncedAlumni++;
    }

    // ─── 2. Sync Student Records ─────────────────────────────────────────────
    const allStudents = await Student.find({});
    for (const stu of allStudents) {
      if (!stu.email) continue;
      const cleanEmail = stu.email.toLowerCase().trim();

      // Ensure password field is set
      if (!stu.password || stu.password !== '1234') {
        stu.password = '1234';
      }

      // Check / Create User account
      let user = await User.findOne({ email: cleanEmail });
      if (!user) {
        user = await User.create({
          name: stu.name || cleanEmail.split('@')[0],
          email: cleanEmail,
          phone: stu.phone || '',
          passwordHash: defaultPasswordHash,
          role: 'student',
          status: 'ACTIVE',
          department: stu.department || 'AID',
          batch: stu.batch || '2025',
          avatar: stu.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(stu.name || 'Student')}&background=10b981&color=fff&size=150`
        });
      }

      stu.userId = user._id;
      await stu.save();
      syncedStudents++;
    }

    // ─── 3. Ensure Primary Student Accounts ──────────────────────────────────
    const primaryAccounts = [
      { name: 'Sunny Velaga', email: 'sunnyvelaga219@gmail.com', role: 'student', phone: '9876543210' },
      { name: 'Aditya Nadipalli', email: 'nadipalliaditya7@gmail.com', role: 'student', phone: '9876543212' }
    ];

    for (const acc of primaryAccounts) {
      let user = await User.findOne({ email: acc.email });
      if (!user) {
        user = await User.create({
          name: acc.name,
          email: acc.email,
          phone: acc.phone,
          passwordHash: defaultPasswordHash,
          role: acc.role,
          status: 'ACTIVE',
          department: 'AID',
          batch: '2025',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(acc.name)}&background=10b981&color=fff&size=150`
        });
      } else {
        user.passwordHash = defaultPasswordHash;
        await user.save();
      }

      let stuDoc = await Student.findOne({ email: acc.email });
      if (!stuDoc) {
        await Student.create({
          userId: user._id,
          name: acc.name,
          email: acc.email,
          phone: acc.phone,
          password: '1234',
          department: 'AID',
          batch: '2025',
          status: 'ACTIVE'
        });
      } else {
        stuDoc.password = '1234';
        stuDoc.userId = user._id;
        await stuDoc.save();
      }
    }

    console.log(`✅  Synced ${syncedAlumni} Alumni and ${syncedStudents} Students with password '1234' and active User logins.`);
  } catch (err) {
    console.error('⚠️  Error syncing users and passwords:', err.message);
  }
}

module.exports = syncUsersAndPasswords;
