"use client";
import { useState } from "react";
import InspectorDrawer from "../../../components/InspectorDrawer";
import { useRouter, useSearchParams } from "next/navigation";

type Issue = { id:string; key:string; title:string; status:string; category:string; assignee?:string|null; updated_at:string };

export default function IssuesClient({ initialItems, total }:{ initialItems: Issue[]; total?: number }){
  const [items] = useState<Issue[]>(initialItems);
  const sp = useSearchParams();
  const router = useRouter();
  const selected = sp.get("key");

  const onRowClick = (key: string) => {
    const qs = new URLSearchParams(sp as any);
    qs.set("key", key);
    router.replace(`/issues?${qs.toString()}` as any, { scroll: false });
  };
  const close = () => {
    const qs = new URLSearchParams(sp as any);
    qs.delete("key");
    const s = qs.toString();
    router.replace(s ? `/issues?${s}` : `/issues`, { scroll: false });
  };

  return (
    <main className="p-6 space-y-4">
      <header className="flex items-center gap-3">
        <h1 className="text-xl font-semibold">Issues</h1>
        <div className="ml-auto text-sm" style={{ color: '#9ca3af' }}>
          {total != null ? `Showing ${items.length} of ${total}` : `Showing ${items.length}`}
        </div>
      </header>
      <table className="w-full text-sm">
        <thead style={{ color: '#9ca3af' }}>
          <tr>
            <th className="text-left p-2">Key</th>
            <th className="text-left p-2">Title</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Category</th>
            <th className="text-left p-2">Assignee</th>
            <th className="text-left p-2">Updated</th>
          </tr>
        </thead>
        <tbody>
          {items.map(i=> (
            <tr key={i.id} className="border-b cursor-pointer hover:bg-white/5" style={{ borderColor: 'rgba(255,255,255,0.1)' }} onClick={()=>onRowClick(i.key)}>
              <td className="p-2" style={{ color: '#22d3ee', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas' }}>{i.key}</td>
              <td className="p-2">{i.title}</td>
              <td className="p-2">{i.status}</td>
              <td className="p-2">{i.category}</td>
              <td className="p-2">{i.assignee ?? '—'}</td>
              <td className="p-2">{new Date(i.updated_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <InspectorDrawer issueKey={selected} onClose={close} />
      )}
    </main>
  );
}
