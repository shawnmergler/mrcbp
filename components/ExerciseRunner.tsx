"use client";
import { useCallback, useMemo, useState } from "react";
import { haptic } from "@/lib/haptics";

type Exercise = { id: number; type: "MCQ" | "IMAGE_ID" | "ORDERING" | "CALC"; prompt: string; data: any; answer: any; };

export default function ExerciseRunner({ exercises, lessonSlug, userId }:{ exercises: Exercise[]; lessonSlug: string; userId: string; }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [order, setOrder] = useState<string[] | null>(null);
  const [calcValue, setCalcValue] = useState<string>("");

  const ex = exercises[index];
  const progress = useMemo(
    () => (exercises.length > 1 ? Math.round((index / (exercises.length - 1)) * 100) : 100),
    [index, exercises.length],
  );

  const submit = useCallback(async () => {
    if (!ex) return;
    let correct = false;
    let response: any = {};
    if (ex.type === "MCQ" || ex.type === "IMAGE_ID") {
      if (selected === null) return;
      correct = selected === ex.answer.correctIndex;
      response = { selected };
    } else if (ex.type === "ORDERING") {
      const current = order ?? ex.data.items.slice();
      correct = JSON.stringify(current) === JSON.stringify(ex.data.correctOrder);
      response = { order: current };
    } else if (ex.type === "CALC") {
      const val = parseFloat(calcValue);
      const tol = ex.data.tolerance ?? 0;
      correct = Math.abs(val - ex.data.correct) <= tol;
      response = { value: val };
    }
    await fetch("/api/attempt", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, exerciseId: ex.id, correct, response }) });
    haptic(correct ? "success" : "error");
    setSelected(null); setOrder(null); setCalcValue(""); setIndex((i)=>Math.min(i+1, exercises.length-1));
  }, [ex, selected, order, calcValue, exercises.length, userId]);

  if (!ex) return <div className="card">No exercises.</div>;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-500">Lesson: <span style={{ viewTransitionName: `lesson-${lessonSlug}` }}>{lessonSlug}</span></div>
        <div className="text-sm text-gray-500">Progress: {progress}%</div>
      </div>
      <h3 className="text-lg font-semibold mb-3">{ex.prompt}</h3>

      {ex.type === "MCQ" && (
        <div className="space-y-2">
          {ex.data.choices.map((c: string, i: number) => (
            <label key={i} className={`flex items-center gap-2 border rounded-xl p-3 cursor-pointer ${selected===i?'border-gray-900':'border-gray-200'}`}>
              <input type="radio" checked={selected===i} onChange={()=>setSelected(i)} />
              <span>{c}</span>
            </label>
          ))}
        </div>
      )}

      {ex.type === "IMAGE_ID" && (
        <div className="space-y-3">
          <img src={ex.data.imageUrl} alt="question image" loading="lazy" className="w-full rounded-xl border" />
          <div className="space-y-2">
            {ex.data.choices.map((c: string, i: number) => (
              <label key={i} className={`flex items-center gap-2 border rounded-xl p-3 cursor-pointer ${selected===i?'border-gray-900':'border-gray-200'}`}>
                <input type="radio" checked={selected===i} onChange={()=>setSelected(i)} />
                <span>{c}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {ex.type === "ORDERING" && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Arrange the steps into the correct sequence (use ↑ / ↓).</p>
          <ul className="space-y-2">
            {(order ?? ex.data.items).map((item: string, i: number) => (
              <li key={i} className="flex items-center justify-between border rounded-xl p-2">
                <span>{item}</span>
                <div className="flex gap-2">
                  <button className="btn btn-ghost" onClick={()=>{ const arr=(order ?? ex.data.items).slice(); if(i>0){ [arr[i-1],arr[i]]=[arr[i],arr[i-1]]; setOrder(arr);} }}>↑</button>
                  <button className="btn btn-ghost" onClick={()=>{ const arr=(order ?? ex.data.items).slice(); if(i<arr.length-1){ [arr[i+1],arr[i]]=[arr[i],arr[i+1]]; setOrder(arr);} }}>↓</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {ex.type === "CALC" && (
        <div className="space-y-2">
          <input className="input" type="number" inputMode="decimal" value={calcValue} onChange={(e)=>setCalcValue(e.target.value)} placeholder={`Enter value${ex.data.unit?` (${ex.data.unit})`:''}`} />
          {ex.data.unit && <div className="text-xs text-gray-500">Unit: {ex.data.unit} {ex.data.tolerance ? `(±${ex.data.tolerance})` : ""}</div>}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <button className="btn btn-primary w-full sm:w-auto" onClick={submit}>Submit</button>
        <button className="btn btn-ghost w-full sm:w-auto" onClick={()=>{ setSelected(null); setOrder(null); setCalcValue(""); haptic('light'); }}>Clear</button>
      </div>
      <p className="mt-4 text-sm text-gray-500">SM-2 SRS schedules reviews. XP & streaks reward consistency.</p>
    </div>
  );
}
