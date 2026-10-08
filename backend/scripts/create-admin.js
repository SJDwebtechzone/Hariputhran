#!/usr/bin/env node
/**
 * Production Admin User Creation Utility
 * Usage: node scripts/create-admin.js
 * 
 * Prompts interactively for credentials. Never prints password or hash.
 */

require("dotenv").config();
const readline = require("readline");
const bcrypt = require("bcrypt");
const pool = require("../src/db");

function askQuestion(rl, query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

function askHiddenQuestion(query) {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    const stdout = process.stdout;

    stdout.write(query);
    stdin.resume();
    stdin.setRawMode(true);
    stdin.setEncoding("utf8");

    let password = "";

    const onData = (char) => {
      // Enter or Return
      if (char === "\n" || char === "\r" || char === "\u0004") {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener("data", onData);
        stdout.write("\n");
        resolve(password);
      } else if (char === "\u0003") {
        // Ctrl+C
        stdout.write("\nOperation cancelled.\n");
        process.exit(1);
      } else if (char === "\b" || char === "\u007f") {
        // Backspace
        if (password.length > 0) {
          password = password.slice(0, -1);
        }
      } else {
        password += char;
      }
    };

    stdin.on("data", onData);
  });
}

function validatePassword(password) {
  if (!password || password.length < 12) {
    return "Password must be at least 12 characters long.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number.";
  }
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=[\]\\\/]/.test(password)) {
    return "Password must contain at least one special character.";
  }
  return null;
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    console.log("=== Hariputhran Enterprises - Create / Update Admin User ===");

    const emailInput = await askQuestion(rl, "Admin Email: ");
    const email = emailInput.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.error("Error: A valid email address is required.");
      process.exit(1);
    }

    const usernameInput = await askQuestion(rl, "Admin Username: ");
    const username = usernameInput.trim();
    if (!username || username.length < 3) {
      console.error("Error: Username must be at least 3 characters long.");
      process.exit(1);
    }

    rl.close();

    const password = await askHiddenQuestion("Enter Password (min 12 chars, upper/lower/number/symbol): ");
    const validationError = validatePassword(password);
    if (validationError) {
      console.error(`Error: ${validationError}`);
      process.exit(1);
    }

    const confirmPassword = await askHiddenQuestion("Confirm Password: ");
    if (password !== confirmPassword) {
      console.error("Error: Passwords do not match.");
      process.exit(1);
    }

    console.log("Hashing password with bcrypt (12 rounds)...");
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const upsertQuery = `
      INSERT INTO admins (username, email, password_hash, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      ON CONFLICT (email)
      DO UPDATE SET
        username = EXCLUDED.username,
        password_hash = EXCLUDED.password_hash,
        updated_at = NOW()
      RETURNING id, username, email;
    `;

    const { rows } = await pool.query(upsertQuery, [username, email, passwordHash]);
    const admin = rows[0];

    console.log(`Success: Admin user [ID: ${admin.id}, Username: ${admin.username}, Email: ${admin.email}] created/updated successfully.`);
  } catch (err) {
    console.error("Failed to create admin:", err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  main();
}

