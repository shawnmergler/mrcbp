import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const pm: [number, string][] = [
    [1, 'Project Engineer'],
    [2, 'Assistant Project Manager'],
    [3, 'Project Manager'],
    [4, 'Senior Project Manager'],
    [5, 'Construction Director'],
  ];
  const ss: [number, string][] = [
    [1, 'Carpenter'],
    [2, 'Layout Foreman'],
    [3, 'Assistant Superintendent'],
    [4, 'Superintendent'],
    [5, 'Senior Superintendent'],
    [6, 'Regional Superintendent'],
  ];
  for (const [level, name] of pm) {
    await prisma.role.upsert({
      where: { system_level: { system: 'PROJECT_MANAGEMENT', level } },
      update: { name },
      create: { system: 'PROJECT_MANAGEMENT', level, name },
    });
  }
  for (const [level, name] of ss) {
    await prisma.role.upsert({
      where: { system_level: { system: 'SITE_SUPERVISION', level } },
      update: { name },
      create: { system: 'SITE_SUPERVISION', level, name },
    });
  }
  // seed a couple divisions/lessons
  const div = await prisma.division.upsert({
    where: { csiCode: 1 },
    update: { name: 'General Requirements' },
    create: { csiCode: 1, name: 'General Requirements' },
  });
  await prisma.lesson.upsert({
    where: { slug: 'pm-budget-basics' },
    update: {},
    create: {
      divisionId: div.id, system: 'PROJECT_MANAGEMENT', title: 'Budget Basics', slug: 'pm-budget-basics',
      description: 'Foundations of luxury residential budgeting.'
    }
  });
  await prisma.lesson.upsert({
    where: { slug: 'site-quality-checks' },
    update: {},
    create: {
      divisionId: div.id, system: 'SITE_SUPERVISION', title: 'Quality Checks', slug: 'site-quality-checks',
      description: 'Daily quality walkthrough patterns.'
    }
  });

  await prisma.user.upsert({
    where: { id: 'demo-user' },
    update: {},
    create: { id: 'demo-user', displayName: 'Demo User' },
  });
}

main()
  .then(async () => {
    console.log('Seed complete.');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
