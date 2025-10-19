"use client";
import { useEffect, useState } from "react";
import { getIssue } from "../lib/api";

export default function InspectorDrawer({ issueKey, onClose }:{ issueKey: string; onClose: ()=>void }){
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(()=>{
    let mounted = true;
    setLoading(true); setError(null);
    getIssue(issueKey).then((d)=>{ if(mounted){ setData(d); setLoading(false);} })
    .catch((e)=>{ if(mounted){ setError(e?.message||"Failed to load issue"); setLoading(false);} });
    return ()=>{ mounted=false; };
  },[issueKey]);

  return (
    <div className="fixed inset-0 z-50" aria-modal="true" role="dialog">
      <div className="absolute inset-0" style={{ background: 'rgba(8,12,18,0.60)' }} onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-[460px]" style={{ background: '#1B2232', borderLeft: '1px solid rgba(255,255,255,0.12)' }}>
        <header className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
          <h2 className="text-base" style={{ color: 'rgba(255,255,255,0.92)' }}>Inspector</h2>
          <button onClick={onClose} className="text-sm" style={{ color: 'rgba(255,255,255,0.72)' }}>Close</button>
        </header>
        <div className="p-4 space-y-3 overflow-auto h-[calc(100%-48px)]">
          {loading && <div style={{ color: 'rgba(255,255,255,0.72)' }}>Loading…</div>}
          {error && <div style={{ color: '#fecaca' }}>{error}</div>}
          {data && (
            <div className="space-y-4">
              <div>
                <div className="text-xs" style={{ color: '#22d3ee', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas' }}>{data.key}</div>
                <h3 className="text-lg" style={{ color: 'rgba(255,255,255,0.92)' }}>{data.title}</h3>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.56)' }}>{data.status} • {data.category} • {data.priority ?? 'P1'}</div>
              </div>
              <section>
                <h4 className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.92)' }}>Notes for Agents</h4>
                <div className="text-sm" style={{ color: 'rgba(255,255,255,0.72)' }}>{data.details || '—'}</div>
                {data.test_strategy && (
                  <div className="mt-2 text-xs" style={{ color: 'rgba(255,255,255,0.56)' }}>Test: {data.test_strategy}</div>
                )}
              </section>
              <section>
                <h4 className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.92)' }}>Dependencies</h4>
                {Array.isArray(data.dependencies) && data.dependencies.length ? (
                  <ul className="list-disc pl-5 text-sm" style={{ color: 'rgba(255,255,255,0.72)' }}>
                    {data.dependencies.map((d:string)=> <li key={d}>{d}</li>)}
                  </ul>
                ) : (
                  <div className="text-sm" style={{ color: 'rgba(255,255,255,0.56)' }}>None</div>
                )}
              </section>
              <section>
                <h4 className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.92)' }}>Labels</h4>
                <div className="flex gap-1 flex-wrap">
                  {(data.labels || []).map((l:string)=> (
                    <span key={l} className="text-[10px] px-2 py-0.5 rounded" style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.72)' }}>{l}</span>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

