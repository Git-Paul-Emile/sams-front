import { useRef } from "react";
import { Paperclip, Upload } from "lucide-react";

export function DropZone({ label, value, onChange }: { label: string; value: string | null; onChange: (n: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div onClick={() => ref.current?.click()} className="border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer hover:border-primary/60 hover:bg-blue-50/30 transition-all">
      <input
        ref={ref}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onChange(f.name); }}
      />
      {value ? (
        <div className="flex items-center justify-center gap-2 text-primary">
          <Paperclip className="w-4 h-4" />
          <span className="text-sm font-medium">{value}</span>
        </div>
      ) : (
        <>
          <Upload className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-xs text-muted-foreground/60 mt-1">PDF · JPG · PNG</p>
        </>
      )}
    </div>
  );
}
