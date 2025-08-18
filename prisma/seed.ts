/* eslint-disable */
import { PrismaClient, ExerciseType, TrainingSystem } from "@prisma/client";
const prisma = new PrismaClient();
const DEMO_USER_ID = "demo-user";
const DEMO_EMAIL = "demo@example.com";

type SeedLesson = {
  title: string;
  slug: string;
  description?: string;
  exercises: any[];
  system: TrainingSystem;
  roleLevel?: number | null;
  divisionCode: number;
};

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,""); }

const divisions: [number,string][] = [[1, "General Requirements"], [2, "Existing Conditions"], [3, "Concrete"], [4, "Masonry"], [5, "Metals"], [6, "Wood, Plastics, and Composites"], [7, "Thermal and Moisture Protection"], [8, "Openings"], [9, "Finishes"], [10, "Specialties"], [11, "Equipment"], [12, "Furnishings"], [13, "Special Construction"], [14, "Conveying Equipment"], [21, "Fire Suppression"], [22, "Plumbing"], [97, "Project Management Training"], [98, "Site Supervision Training"]];
const siteLessons: Omit<SeedLesson,"slug">[] = [{"title": "Best Practices (Luxury Residential)", "description": "Best Practices (Luxury Residential)", "exercises": [{"type": "MCQ", "prompt": "What is the #1 driver of luxury-quality outcomes on site?", "choices": ["Aggressive schedule compression", "Clear acceptance criteria and mockups", "Lowest-cost subcontractors", "Skipping precon meetings"], "correctIndex": 1}, {"type": "ORDERING", "prompt": "Sequence for high-end veneer stone install (simplified)", "items": ["Substrate prep", "Waterproofing & lath", "Dry layout & approvals", "Set stone with proper bond", "Tool joints & clean"], "correctOrder": ["Substrate prep", "Waterproofing & lath", "Dry layout & approvals", "Set stone with proper bond", "Tool joints & clean"]}, {"type": "IMAGE_ID", "prompt": "Identify the protection shown (used before cabinet install).", "imageUrl": "https://via.placeholder.com/800x450?text=Ram+Board+Floor+Protection", "choices": ["Poly sheeting", "Ram Board", "Red rosin paper", "Foam underlayment"], "correctIndex": 1}], "system": "SITE_SUPERVISION", "roleLevel": null, "divisionCode": 98}];
const pmLessons: Omit<SeedLesson,"slug">[] = [{"title": "Construction Budgets & Development", "description": "Construction Budgets & Development", "exercises": [{"type": "MCQ", "prompt": "Best tool for budget transparency with clients:", "choices": ["Single lump sum line", "Detailed WBS with contingencies & allowances", "Only GC fee", "No alternates"], "correctIndex": 1}, {"type": "CALC", "prompt": "If a $2.5M budget includes 5% contingency, how many dollars is contingency?", "unit": "$", "correct": 125000, "tolerance": 1}], "system": "PROJECT_MANAGEMENT", "roleLevel": null, "divisionCode": 97}];

async function ensureBadges() {
  const defs = [
    { code:"FIRST_STEPS", name:"First Steps", description:"Completed your first exercise." },
    { code:"HUNDRED_XP", name:"Century Club", description:"Reached 100 XP." },
    { code:"SEVEN_DAY_STREAK", name:"On a Roll", description:"7-day streak." },
  ];
  for (const b of defs) {
    await prisma.badge.upsert({ where: { code: b.code }, update: b, create: b });
  }
}

async function ensureRoles() {
  const pm = [[1,"Project Engineer"],[2,"Assistant Project Manager"],[3,"Project Manager"],[4,"Senior Project Manager"],[5,"Construction Director"]];
  const ss = [[1,"Carpenter"],[2,"Layout Foreman"],[3,"Assistant Superintendent"],[4,"Superintendent"],[5,"Senior Superintendent"],[6,"Regional Superintendent"]];
  for (const [level, name] of pm) {
    await prisma.role.upsert({ where: { system_level: { system: "PROJECT_MANAGEMENT", level } }, update: { name }, create: { system: "PROJECT_MANAGEMENT", level, name } });
  }
  for (const [level, name] of ss) {
    await prisma.role.upsert({ where: { system_level: { system: "SITE_SUPERVISION", level } }, update: { name }, create: { system: "SITE_SUPERVISION", level, name } });
  }
}

async function ensureDivisions() {
  for (const [code, name] of divisions) {
    await prisma.division.upsert({ where: { csiCode: code }, update: { name }, create: { csiCode: code, name } });
  }
}

async function createLessonSeed(entry: Omit<SeedLesson,"slug">) {
  const slug = slugify(entry.title);
  const division = await prisma.division.findUnique({ where: { csiCode: entry.divisionCode } });
  if (!division) throw new Error("Division missing: " + entry.divisionCode);
  const lesson = await prisma.lesson.upsert({
    where: { slug },
    update: { title: entry.title, description: entry.description ?? null, divisionId: division.id, system: entry.system },
    create: { title: entry.title, slug, description: entry.description ?? null, divisionId: division.id, system: entry.system },
  });
  const existing = await prisma.exercise.findFirst({ where: { lessonId: lesson.id } });
  if (!existing) {
    for (const e of entry.exercises) {
      const type = e.type as ExerciseType;
      let answer: any = {};
      if (type === "MCQ" || type === "IMAGE_ID") answer = { correctIndex: e.correctIndex };
      if (type === "ORDERING") answer = { correctOrder: e.correctOrder };
      if (type === "CALC") answer = { correct: e.correct, tolerance: e.tolerance ?? 0 };
      await prisma.exercise.create({ data: { lessonId: lesson.id, type, prompt: e.prompt, data: e as any, answer } });
    }
  }
}

async function main() {
  await ensureBadges();
  await ensureRoles();
  await ensureDivisions();
  await prisma.user.upsert({ where: { id: DEMO_USER_ID }, update: {}, create: { id: DEMO_USER_ID, email: DEMO_EMAIL, displayName: "Demo User" } });

  for (const l of siteLessons) await createLessonSeed(l as any);
  for (const l of pmLessons) await createLessonSeed(l as any);
  console.log("Seed complete.");
}

main().then(()=>prisma.$disconnect()).catch(e=>{ console.error(e); return prisma.$disconnect().finally(()=>process.exit(1)); });
