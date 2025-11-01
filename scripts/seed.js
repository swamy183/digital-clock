require('dotenv').config();
const mongoose = require('mongoose');
const ClockSettings = require('../models/ClockSettings');

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ MongoDB connected successfully');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Seed initial clock settings
const seedClockSettings = async () => {
  try {
    console.log('\nChecking for existing clock settings...');
    
    // Check if settings already exist
    const existingSettings = await ClockSettings.findOne();
    
    if (existingSettings) {
      console.log('✓ Clock settings already exist. Skipping seed.');
      console.log('Current settings:', {
        timeFormat: existingSettings.timeFormat,
        timezone: existingSettings.timezone
      });
      return;
    }
    
    // Create default settings
    console.log('Creating default clock settings...');
    const defaultSettings = new ClockSettings({
      timeFormat: '24h',
      timezone: 'UTC'
    });
    
    await defaultSettings.save();
    
    console.log('✓ Default clock settings created successfully!');
    console.log('Settings:', {
      timeFormat: defaultSettings.timeFormat,
      timezone: defaultSettings.timezone,
      createdAt: defaultSettings.createdAt
    });
    
  } catch (error) {
    console.error('✗ Error seeding clock settings:', error.message);
    throw error;
  }
};

// Main seed function
const seed = async () => {
  try {
    console.log('=== Starting Database Seed ===\n');
    
    await connectDB();
    await seedClockSettings();
    
    console.log('\n=== Seed Completed Successfully ===');
    
  } catch (error) {
    console.error('\n=== Seed Failed ===');
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    // Disconnect from MongoDB
    try {
      await mongoose.disconnect();
      console.log('\n✓ Disconnected from MongoDB');
    } catch (error) {
      console.error('✗ Error disconnecting from MongoDB:', error.message);
    }
    process.exit(0);
  }
};

// Run the seed function
seed();
