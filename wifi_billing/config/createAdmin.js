const bcrypt = require("bcryptjs");
const prisma = require("./prismaClient"); // adjust path if needed

// ✅ Replace these with the actual credentials
const email = "mwakidenice.md@gmail.com";
const password = "73641483";

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) {
      console.log("❌ Admin with this email already exists.");
      process.exit(1);
    }

    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    console.log("✅ Admin created:", admin);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();
