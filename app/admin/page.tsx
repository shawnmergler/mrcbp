import StandardsManager from '@/components/admin/StandardsManager';
import DivisionsEditor from '@/components/admin/DivisionsEditor';
import LeaderboardEditor from '@/components/admin/LeaderboardEditor';
import QuestionBuilder from '@/components/admin/QuestionBuilder';
import QuestionDB from '@/components/admin/QuestionDB';

export default function AdminPage(){
  return (
    <div className="container" style={{display:'grid', gap:12}}>
      <QuestionBuilder />
      <QuestionDB />
      <DivisionsEditor />
      <StandardsManager />
      <LeaderboardEditor />
    </div>
  );
}
