/**
 * 30-Day Inactivity Sync Helper
 */

const User = require('../models/User');
const Alumni = require('../models/Alumni');
const Student = require('../models/Student');

let isRunning = false;
let lastRunTime = 0;
const COOLDOWN_MS = 10 * 60 * 1000; // Run at most once every 10 minutes

async function applyInactivityCheck(force = false) {
  const now = Date.now();
  if (isRunning) return;
  if (!force && now - lastRunTime < COOLDOWN_MS) return;

  const mongoose = require('mongoose');
  if (mongoose.connection.readyState !== 1) return;

  isRunning = true;
  try {
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

    // Flag as INACTIVE if last_login was 30+ days ago
    await Promise.allSettled([
      User.updateMany(
        { role: { $in: ['alumni', 'student'] }, last_login: { $lt: thirtyDaysAgo }, status: 'ACTIVE' },
        { status: 'INACTIVE' }
      ),
      Alumni.updateMany(
        { last_login: { $lt: thirtyDaysAgo }, status: { $in: ['ACTIVE', 'Active', 'Verified'] } },
        { status: 'INACTIVE' }
      ),
      Student.updateMany(
        { last_login: { $lt: thirtyDaysAgo }, status: { $in: ['ACTIVE', 'Active', 'Enrolled'] } },
        { status: 'INACTIVE' }
      ),
      User.updateMany(
        { role: { $in: ['alumni', 'student'] }, last_login: { $gte: thirtyDaysAgo }, status: 'INACTIVE' },
        { status: 'ACTIVE' }
      ),
      Alumni.updateMany(
        { last_login: { $gte: thirtyDaysAgo }, status: 'INACTIVE' },
        { status: 'ACTIVE' }
      ),
      Student.updateMany(
        { last_login: { $gte: thirtyDaysAgo }, status: 'INACTIVE' },
        { status: 'ACTIVE' }
      )
    ]);

    lastRunTime = Date.now();
  } catch (err) {
    console.error('Inactivity check warning:', err.message);
  } finally {
    isRunning = false;
  }
}

module.exports = {
  applyInactivityCheck
};
