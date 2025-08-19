import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Ensure a default Section exists
  const defaultSection = await prisma.section.upsert({
    where: { slug: 'general' },
    update: {},
    create: { title: 'General', slug: 'general', order: 0 }
  });

  // Attach any legacy lessons without a section
  await prisma.lesson.updateMany({
    where: { sectionId: null },
    data:  { sectionId: defaultSection.id }
  });

async function main() {
  // Roles
  const pm: [number, string][] = [
    [1, "Project Engineer"],
    [2, "Assistant Project Manager"],
    [3, "Project Manager"],
    [4, "Senior Project Manager"],
    [5, "Construction Director"],
  ];
  const ss: [number, string][] = [
    [1, "Carpenter"],
    [2, "Layout Foreman"],
    [3, "Assistant Superintendent"],
    [4, "Superintendent"],
    [5, "Senior Superintendent"],
    [6, "Regional Superintendent"],
  ];
  for (const [level, name] of pm) {
    await prisma.role.upsert({
      where: { system_level: { system: 'PROJECT_MANAGEMENT', level } },
      update: { name },
      create: { system: 'PROJECT_MANAGEMENT', level, name }
    });
  }
  for (const [level, name] of ss) {
    await prisma.role.upsert({
      where: { system_level: { system: 'SITE_SUPERVISION', level } },
      update: { name },
      create: { system: 'SITE_SUPERVISION', level, name }
    });
  }

  // Divisions + Lessons (minimal demo)
  const divs = [
    { csiCode: 1, name: 'General Requirements' },
    { csiCode: 3, name: 'Concrete' },
    { csiCode: 6, name: 'Wood & Plastics' },
  ];
  for (const d of divs) {
    const div = await prisma.division.upsert({
      where: { csiCode: d.csiCode },
      update: { name: d.name },
      create: d
    });
    await prisma.lesson.upsert({
      where: { slug: `lesson-${div.csiCode}-1` },
      update: {},
      create: {
        divisionId: div.id,
        system: 'SITE_SUPERVISION',
        title: `${div.name} Basics`,
        slug: `lesson-${div.csiCode}-1`,
        description: `Intro to ${div.name}.`
      }
    });
  }

  // Badges
  await prisma.badge.upsert({
    where: { code: '3_IN_A_ROW' },
    update: {},
    create: { code: '3_IN_A_ROW', name: '3 In a Row!', description: 'Answer 3 questions correctly in a row.' }
  });

  // Sample Standard
  await prisma.standard.upsert({
    where: { id: 1 },
    update: {},
    create: { title: 'Sample Jobsite Safety Plan', description: 'Template document', url: 'https://example.com/safety.pdf', mime: 'application/pdf' }
  });

  // Ensure a demo user
  await prisma.user.upsert({
    where: { id: 'demo' },
    update: {},
    create: { id: 'demo', displayName: 'Demo User', xp: 50, streak: 2 }
  });
}

  main().finally(() => prisma.$disconnect());

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
