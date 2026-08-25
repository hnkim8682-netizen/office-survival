import { cn } from "@/lib/utils/cn";

/** Abstract, CSS-only mockups used on pretend-mode cards. No images to load. */
export function PretendPreview({ id, className }: { id: string; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none h-28 w-full overflow-hidden rounded-xl border border-border bg-[#0b0d11] p-2",
        className,
      )}
    >
      {id === "vscode" ? <VSCodePreview /> : null}
      {id === "excel" ? <ExcelPreview /> : null}
      {id === "terminal" ? <TerminalPreview /> : null}
      {id === "dashboard" ? <DashboardPreview /> : null}
      {!["vscode", "excel", "terminal", "dashboard"].includes(id) ? <GenericPreview /> : null}
    </div>
  );
}

function VSCodePreview() {
  const widths = [70, 45, 85, 60, 35, 75];
  return (
    <div className="flex h-full gap-2">
      <div className="flex w-1/4 flex-col gap-1.5 rounded-md bg-[#12151a] p-1.5">
        {[60, 80, 50, 70].map((width, index) => (
          <span key={index} className="h-1.5 rounded-full bg-[#2a2f39]" style={{ width: `${width}%` }} />
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 pt-1">
        {widths.map((width, index) => (
          <span
            key={index}
            className="h-1.5 rounded-full"
            style={{
              width: `${width}%`,
              background: index % 3 === 0 ? "#5b6bf5" : index % 3 === 1 ? "#3f8f6d" : "#2a2f39",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ExcelPreview() {
  return (
    <div className="grid h-full grid-cols-5 grid-rows-5 gap-px overflow-hidden rounded-md bg-[#1b1f26]">
      {Array.from({ length: 25 }).map((_, index) => (
        <span
          key={index}
          className={cn(
            "bg-[#0f1216]",
            index < 5 && "bg-[#16302a]",
            index === 12 && "outline outline-1 outline-[#3f8f6d]",
          )}
        />
      ))}
    </div>
  );
}

function TerminalPreview() {
  const widths = [55, 80, 40, 65, 30];
  return (
    <div className="flex h-full flex-col justify-center gap-1.5 px-1">
      {widths.map((width, index) => (
        <span
          key={index}
          className="h-1.5 rounded-full bg-[#2f6b4f]"
          style={{ width: `${width}%`, opacity: 1 - index * 0.14 }}
        />
      ))}
    </div>
  );
}

function DashboardPreview() {
  const bars = [40, 70, 55, 90, 65, 80];
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="grid grid-cols-3 gap-1.5">
        {[0, 1, 2].map((index) => (
          <span key={index} className="h-4 rounded bg-[#161a20]" />
        ))}
      </div>
      <div className="flex flex-1 items-end gap-1.5">
        {bars.map((height, index) => (
          <span
            key={index}
            className="flex-1 rounded-sm bg-[#5b6bf5]"
            style={{ height: `${height}%`, opacity: 0.35 + index * 0.1 }}
          />
        ))}
      </div>
    </div>
  );
}

function GenericPreview() {
  return (
    <div className="flex h-full flex-col justify-center gap-1.5 px-2">
      {[70, 45, 85].map((width, index) => (
        <span key={index} className="h-1.5 rounded-full bg-[#2a2f39]" style={{ width: `${width}%` }} />
      ))}
    </div>
  );
}
