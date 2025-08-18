'use client';
import Icons from './Icons';

export default function QuickAccess() {
  return (
    <div className="quick-wrap">
      <div className="quick-grid">
        <a className="tile" href="https://www.osha.gov/video" target="_blank" rel="noreferrer">
          <div className="iconwrap"><Icons.osha className="w-6 h-6 text-gray-900" /></div>
          <div className="text-xs font-medium text-gray-900 text-center">OSHA</div>
        </a>
        <a className="tile" href="https://codes.iccsafe.org/" target="_blank" rel="noreferrer">
          <div className="iconwrap"><Icons.codes className="w-6 h-6 text-gray-900" /></div>
          <div className="text-xs font-medium text-gray-900 text-center">Building Codes</div>
        </a>
        <a className="tile" href="/standards">
          <div className="iconwrap"><Icons.standards className="w-6 h-6 text-gray-900" /></div>
          <div className="text-xs font-medium text-gray-900 text-center">Standards</div>
        </a>
      </div>
    </div>
  );
}
