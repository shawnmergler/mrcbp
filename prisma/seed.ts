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

  await prisma.user.upsert({
    where: { id: 'demo-user' },
    update: {},
    create: { id: 'demo-user', displayName: 'Demo User' },
  });
}

main()
  .then(async () => {
    c
