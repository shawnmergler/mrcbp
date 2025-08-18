import LinkVT from './LinkVT';
import Icons, { IconKey } from './Icons';

export default function TrackCard({
  title, subtitle, href, gradient, icon, vtName='card'
}: { title:string; subtitle:string; href:string; gradient:string; icon:IconKey; vtName?:string }){
  const Icon = Icons[icon];
  return (
    <LinkVT href={href} vtName={vtName} className="card p-4" style={{ backgroundImage: gradient }}>
      <div className="flex items-center gap-3">
        <div className="iconwrap" style={{ background: 'rgba(255,255,255,.7)' }}>
          <Icon className="w-6 h-6 text-gray-900" aria-hidden="true" data-vt />
        </div>
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-xs" style={{color:'#4b5563'}}>{subtitle}</div>
        </div>
      </div>
    </LinkVT>
  );
}
