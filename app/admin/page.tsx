import StandardsManager from '@/components/admin/StandardsManager';
import SectionLessonCreator from '@/components/admin/SectionLessonCreator';
import DivisionsEditor from '@/components/admin/DivisionsEditor';
import LeaderboardEditor from '@/components/admin/LeaderboardEditor';
import QuestionBuilder from '@/components/admin/QuestionBuilder';
import QuestionDB from '@/components/admin/QuestionDB';

export default function AdminPage(){
  return (
    <div className="container" style={{display:'grid', gap:12}}>
      <SectionLessonCreator />
        <QuestionBuilder />
      <QuestionDB />
      <DivisionsEditor />
      <StandardsManager />
      <LeaderboardEditor />
    </div>
  );
}
