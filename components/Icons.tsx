import {
  AcademicCapIcon,
  Cog6ToothIcon,
  TrophyIcon,
  BuildingOffice2Icon,
  WrenchScrewdriverIcon,
  ClipboardDocumentCheckIcon,
  BookOpenIcon,
  UserGroupIcon,
  ChartBarIcon,
  BoltIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

export const Icons = {
  admin: Cog6ToothIcon,
  leaderboard: TrophyIcon,
  site: WrenchScrewdriverIcon,
  pm: ClipboardDocumentCheckIcon,
  division: BuildingOffice2Icon,
  lesson: BookOpenIcon,
  users: UserGroupIcon,
  chart: ChartBarIcon,
  bolt: BoltIcon,
  shield: ShieldCheckIcon,
  cap: AcademicCapIcon,
};

export type IconKey = keyof typeof Icons;
