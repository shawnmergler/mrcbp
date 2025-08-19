// app/admin/page.tsx
import StandardsManager from '@/components/admin/StandardsManager';
import DivisionsEditor from '@/components/admin/DivisionsEditor';
import SectionLessonManager from '@/components/admin/SectionLessonManager';
import QuestionBuilder from '@/components/admin/QuestionBuilder';
import QuestionDB from '@/components/admin/QuestionDB';
import LeaderboardEditor from '@/components/admin/LeaderboardEditor';

export default async function AdminPage(){
  return (
    <div className="space-y-6 pb-24">
      <SectionLessonManager />
      <QuestionBuilder />
      <QuestionDB />
      <DivisionsEditor />
      <StandardsManager />
      <div className="pt-2 border-t">
        <LeaderboardEditor />
      </div>
    </div>
  );
}
