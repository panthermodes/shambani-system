// Simple test to check if we can import and use Prisma
try {
  const { PrismaClient } = require('@prisma/client');
  console.log('✅ Prisma client imported successfully');
  
  const prisma = new PrismaClient();
  
  console.log('✅ Prisma client instantiated');
  
  // Test connection
  prisma.$connect()
    .then(() => {
      console.log('✅ Database connected successfully via Prisma!');
      return prisma.$disconnect();
    })
    .catch((error) => {
      console.error('❌ Database connection failed:', error.message);
      process.exit(1);
    });
    
} catch (error) {
  console.error('❌ Prisma client error:', error.message);
  process.exit(1);
}