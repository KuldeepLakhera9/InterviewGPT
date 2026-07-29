/* eslint-disable no-console */
import { PrismaClient, UserRole, PlanTier } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Create Default Workspace
  const workspace = await prisma.workspace.upsert({
    where: { slug: 'interviewgpt-demo' },
    update: {},
    create: {
      name: 'InterviewGPT Demo Workspace',
      slug: 'interviewgpt-demo',
      planTier: PlanTier.PRO,
    },
  });

  console.log(`✅ Workspace created: ${workspace.name} (${workspace.id})`);

  // 2. Create Default Owner User
  const user = await prisma.user.upsert({
    where: { email: 'admin@interviewgpt.com' },
    update: {},
    create: {
      email: 'admin@interviewgpt.com',
      passwordHash: '$2a$12$demoPasswordHashForLocalDevelopmentOnly',
      emailVerified: true,
      role: UserRole.OWNER,
      workspaceId: workspace.id,
      profile: {
        create: {
          fullName: 'Alex Chen',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          headline: 'Senior Full-Stack Software Engineer',
          bio: 'Preparing for Staff Engineer technical & system design interviews.',
        },
      },
    },
  });

  console.log(`✅ User created: ${user.email} (${user.id})`);

  // 3. Create Default Session
  const session = await prisma.session.upsert({
    where: { sessionToken: 'seed-demo-session-token-123' },
    update: {},
    create: {
      userId: user.id,
      sessionToken: 'seed-demo-session-token-123',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      ipAddress: '127.0.0.1',
    },
  });

  console.log(`✅ Session created: ${session.sessionToken}`);
  console.log('🎉 Database seeding completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
