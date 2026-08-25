"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils/cn";

/* Light Excel-like chrome, deliberately independent of the site theme. */

const COLUMNS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
const ROW_COUNT = 42;

const HEADERS = ["제품", "1월", "2월", "3월", "분기 합계", "성장률", "사용자", "전환율"];

const ROWS: Array<[string, number, number, number, number, string, number, string]> = [
  ["Enterprise Plan", 184_200_000, 191_400_000, 206_800_000, 582_400_000, "+12.3%", 1_284, "8.4%"],
  ["Professional Plan", 96_400_000, 101_200_000, 108_700_000, 306_300_000, "+9.8%", 4_920, "6.9%"],
  ["Starter Plan", 42_800_000, 44_100_000, 45_900_000, 132_800_000, "+4.1%", 12_480, "5.2%"],
  ["Add-on : Storage", 18_600_000, 19_900_000, 22_400_000, 60_900_000, "+15.7%", 3_140, "11.3%"],
  ["Add-on : Analytics", 12_300_000, 13_800_000, 15_100_000, 41_200_000, "+18.2%", 2_060, "9.7%"],
  ["Professional Services", 31_500_000, 28_900_000, 34_600_000, 95_000_000, "-2.4%", 184, "22.6%"],
  ["Education License", 8_900_000, 9_400_000, 9_100_000, 27_400_000, "+1.9%", 6_310, "3.8%"],
  ["Partner Reseller", 24_700_000, 26_300_000, 29_800_000, 80_800_000, "+13.4%", 742, "14.2%"],
  ["APAC Direct", 52_100_000, 55_600_000, 61_200_000, 168_900_000, "+11.1%", 2_890, "7.5%"],
  ["EMEA Direct", 39_800_000, 41_200_000, 40_100_000, 121_100_000, "+0.6%", 2_140, "6.1%"],
  ["Legacy Contracts", 14_200_000, 12_800_000, 11_400_000, 38_400_000, "-9.8%", 96, "4.4%"],
  ["기타 매출", 6_400_000, 7_100_000, 8_200_000, 21_700_000, "+6.3%", 512, "5.9%"],
];

const TOTALS_ROW = ROWS.length + 3;

function cellId(row: number, col: number): string {
  return `${COLUMNS[col]}${row + 1}`;
}

function formatValue(value: number | string): string {
  return typeof value === "number" ? value.toLocaleString("ko-KR") : value;
}

/** Base sheet contents, keyed by cell id. */
function buildSheet(): Record<string, string> {
  const sheet: Record<string, string> = {
    A1: "2026 회계연도 · 3분기 매출 실적",
    A2: "단위: 원 (VAT 별도) · 최종 수정 03/31",
  };

  HEADERS.forEach((header, index) => {
    sheet[cellId(3, index)] = header;
  });

  ROWS.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      sheet[cellId(4 + rowIndex, colIndex)] = formatValue(value);
    });
  });

  const sum = (index: number) => ROWS.reduce((total, row) => total + (row[index] as number), 0);
  sheet[cellId(TOTALS_ROW, 0)] = "합계";
  sheet[cellId(TOTALS_ROW, 1)] = sum(1).toLocaleString("ko-KR");
  sheet[cellId(TOTALS_ROW, 2)] = sum(2).toLocaleString("ko-KR");
  sheet[cellId(TOTALS_ROW, 3)] = sum(3).toLocaleString("ko-KR");
  sheet[cellId(TOTALS_ROW, 4)] = sum(4).toLocaleString("ko-KR");
  sheet[cellId(TOTALS_ROW, 5)] = "+8.9%";
  sheet[cellId(TOTALS_ROW, 6)] = ROWS.reduce((t, row) => t + (row[6] as number), 0).toLocaleString("ko-KR");

  return sheet;
}

const RIBBON = ["파일", "홈", "삽입", "페이지 레이아웃", "수식", "데이터", "검토", "보기", "도움말"];

export function ExcelScreen() {
  const [sheet, setSheet] = useState<Record<string, string>>(buildSheet);
  const [selected, setSelected] = useState({ row: 4, col: 1 });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLInputElement>(null);

  const activeId = cellId(selected.row, selected.col);
  const activeValue = sheet[activeId] ?? "";

  useEffect(() => {
    if (editing) editorRef.current?.focus();
  }, [editing]);

  const commit = (value: string, move: "down" | "right" | "none" = "none") => {
    setSheet((current) => ({ ...current, [activeId]: value }));
    setEditing(false);
    setSelected((cell) => ({
      row: move === "down" ? Math.min(cell.row + 1, ROW_COUNT - 1) : cell.row,
      col: move === "right" ? Math.min(cell.col + 1, COLUMNS.length - 1) : cell.col,
    }));
    gridRef.current?.focus();
  };

  const onGridKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (editing) return;

    const moves: Record<string, [number, number]> = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
      Enter: [1, 0],
      Tab: [0, 1],
    };

    if (event.key in moves && !(event.key === "Enter" && event.shiftKey)) {
      const [dr, dc] = moves[event.key];
      event.preventDefault();
      setSelected((cell) => ({
        row: Math.min(Math.max(cell.row + dr, 0), ROW_COUNT - 1),
        col: Math.min(Math.max(cell.col + dc, 0), COLUMNS.length - 1),
      }));
      return;
    }

    if (event.key === "F2") {
      event.preventDefault();
      setDraft(activeValue);
      setEditing(true);
      return;
    }

    if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      setSheet((current) => ({ ...current, [activeId]: "" }));
      return;
    }

    // Typing a printable character starts an edit, like the real thing.
    if (event.key.length === 1 && !event.metaKey && !event.ctrlKey) {
      setDraft(event.key);
      setEditing(true);
    }
  };

  const columnSum = useMemo(() => {
    let total = 0;
    let count = 0;
    for (let row = 0; row < ROW_COUNT; row += 1) {
      const raw = sheet[cellId(row, selected.col)];
      const numeric = Number(raw?.replace(/,/g, ""));
      if (raw && Number.isFinite(numeric)) {
        total += numeric;
        count += 1;
      }
    }
    return { total, count };
  }, [sheet, selected.col]);

  return (
    <div className="flex min-h-dvh flex-col bg-[#f3f2f1] text-[#212121]">
      {/* Ribbon */}
      <div className="shrink-0 bg-[#217346] text-white">
        <div className="flex h-9 items-center gap-3 px-3 text-[12.5px]">
          <span className="font-semibold">X</span>
          <span className="truncate">2026_3분기_매출실적_v7_최종_진짜최종.xlsx — Excel</span>
        </div>
        <div className="scrollbar-slim flex gap-1 overflow-x-auto bg-white px-2 pt-1.5 text-[12.5px] text-[#444]">
          {RIBBON.map((item, index) => (
            <span
              key={item}
              className={cn(
                "whitespace-nowrap rounded-t px-3 py-1.5",
                index === 1 ? "bg-[#f3f2f1] font-medium text-[#217346]" : "",
              )}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="flex h-11 shrink-0 items-center gap-2 border-b border-[#d0cfce] bg-[#f3f2f1] px-2 text-[12.5px]">
        <span className="flex h-7 w-20 items-center rounded border border-[#d0cfce] bg-white px-2 font-medium">
          {activeId}
        </span>
        <span className="px-1 italic text-[#666]">fx</span>
        <input
          value={editing ? draft : activeValue}
          onChange={(event) => {
            setDraft(event.target.value);
            setEditing(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") commit(draft, "down");
            if (event.key === "Escape") {
              setEditing(false);
              gridRef.current?.focus();
            }
          }}
          aria-label={`${activeId} 수식 입력줄`}
          className="h-7 flex-1 rounded border border-[#d0cfce] bg-white px-2 outline-none focus:border-[#217346]"
        />
      </div>

      {/* Grid */}
      <div
        ref={gridRef}
        tabIndex={0}
        onKeyDown={onGridKeyDown}
        role="grid"
        aria-label="스프레드시트"
        className="scrollbar-slim min-h-0 flex-1 overflow-auto bg-white outline-none"
      >
        <table className="border-collapse text-[12.5px]">
          <thead>
            <tr>
              <th className="sticky left-0 top-0 z-30 h-6 w-10 border border-[#d0cfce] bg-[#f3f2f1] text-[11px] font-normal text-[#666]" />
              {COLUMNS.map((column, index) => (
                <th
                  key={column}
                  className={cn(
                    "sticky top-0 z-20 h-6 border border-[#d0cfce] bg-[#f3f2f1] text-[11px] font-normal text-[#666]",
                    index === 0 ? "min-w-[190px]" : "min-w-[112px]",
                    selected.col === index && "bg-[#d8e8dd] text-[#217346]",
                  )}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: ROW_COUNT }).map((_, row) => (
              <tr key={row}>
                <th
                  scope="row"
                  className={cn(
                    "sticky left-0 z-10 h-[22px] w-10 border border-[#d0cfce] bg-[#f3f2f1] text-[11px] font-normal text-[#666]",
                    selected.row === row && "bg-[#d8e8dd] text-[#217346]",
                  )}
                >
                  {row + 1}
                </th>
                {COLUMNS.map((_column, col) => {
                  const id = cellId(row, col);
                  const value = sheet[id] ?? "";
                  const isSelected = selected.row === row && selected.col === col;
                  const inDataRange = col < HEADERS.length;
                  const isHeaderRow = row === 3 && inDataRange;
                  const isTotals = row === TOTALS_ROW && inDataRange;
                  const numeric = col > 0 && /^[\d,+-.%]+$/.test(value) && value !== "";

                  return (
                    <td
                      key={id}
                      onClick={() => {
                        setSelected({ row, col });
                        setEditing(false);
                        gridRef.current?.focus();
                      }}
                      onDoubleClick={() => {
                        setDraft(value);
                        setEditing(true);
                      }}
                      aria-selected={isSelected}
                      className={cn(
                        "relative h-[22px] cursor-cell border border-[#e1dfdd] px-1.5 align-middle",
                        numeric && "text-right tabular",
                        isHeaderRow && "bg-[#217346] font-semibold text-white",
                        isTotals && "bg-[#eef5f0] font-semibold",
                        row === 0 && col === 0 && "font-semibold",
                        value.startsWith("-") && "text-[#c0392b]",
                        isSelected && "outline outline-2 -outline-offset-1 outline-[#217346]",
                      )}
                    >
                      {isSelected && editing ? (
                        <input
                          ref={editorRef}
                          value={draft}
                          onChange={(event) => setDraft(event.target.value)}
                          onBlur={() => commit(draft)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") commit(draft, "down");
                            if (event.key === "Tab") {
                              event.preventDefault();
                              commit(draft, "right");
                            }
                            if (event.key === "Escape") {
                              event.stopPropagation();
                              setEditing(false);
                              gridRef.current?.focus();
                            }
                          }}
                          aria-label={`${id} 편집`}
                          className="absolute inset-0 w-full bg-white px-1.5 outline-none"
                        />
                      ) : (
                        <span className="block truncate">{value}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sheet tabs + status bar */}
      <div className="flex h-8 shrink-0 items-center gap-1 border-t border-[#d0cfce] bg-[#f3f2f1] px-2 text-[12px]">
        {["3분기 실적", "월별 추이", "제품별", "Sheet4"].map((name, index) => (
          <span
            key={name}
            className={cn(
              "rounded-t px-3 py-1",
              index === 0 ? "border border-b-0 border-[#d0cfce] bg-white font-medium text-[#217346]" : "text-[#666]",
            )}
          >
            {name}
          </span>
        ))}
      </div>
      <div className="flex h-6 shrink-0 items-center gap-4 border-t border-[#d0cfce] bg-[#f3f2f1] px-3 text-[11.5px] text-[#555]">
        <span>준비</span>
        <span className="ml-auto hidden sm:inline">개수: {columnSum.count}</span>
        <span className="hidden sm:inline">합계: {columnSum.total.toLocaleString("ko-KR")}</span>
        <span>100%</span>
      </div>
    </div>
  );
}
