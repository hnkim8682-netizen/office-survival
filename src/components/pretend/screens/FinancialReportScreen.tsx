"use client";

import { cn } from "@/lib/utils/cn";

/* Boss Mode target: a printed-looking quarterly report. Nothing animates —
   a document on screen should look like a document. */

const INCOME_ROWS: Array<[string, string, string, string]> = [
  ["매출액", "1,842,600", "1,604,200", "+14.9%"],
  ["매출원가", "(742,180)", "(668,940)", "+10.9%"],
  ["매출총이익", "1,100,420", "935,260", "+17.7%"],
  ["판매비와관리비", "(684,310)", "(612,880)", "+11.7%"],
  ["영업이익", "416,110", "322,380", "+29.1%"],
  ["영업외수익", "18,420", "16,940", "+8.7%"],
  ["영업외비용", "(24,860)", "(31,220)", "-20.4%"],
  ["법인세비용차감전순이익", "409,670", "308,100", "+33.0%"],
  ["법인세비용", "(90,127)", "(67,782)", "+33.0%"],
  ["당기순이익", "319,543", "240,318", "+33.0%"],
];

const SEGMENTS: Array<[string, string, string, string]> = [
  ["Enterprise", "582,400", "31.6%", "+12.3%"],
  ["Professional", "306,300", "16.6%", "+9.8%"],
  ["Starter", "132,800", "7.2%", "+4.1%"],
  ["Services", "95,000", "5.2%", "-2.4%"],
  ["APAC / EMEA", "290,000", "15.7%", "+8.6%"],
  ["기타", "436,100", "23.7%", "+21.4%"],
];

export function FinancialReportScreen() {
  return (
    <div className="min-h-dvh bg-[#e9eaec] py-4 text-[#1a1c20] sm:py-8">
      <article className="mx-auto max-w-3xl bg-white px-6 py-10 shadow-[0_2px_16px_rgba(0,0,0,0.12)] sm:px-14 sm:py-14">
        <header className="border-b-2 border-[#1a1c20] pb-5">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#666]">
            Confidential · Internal use only
          </p>
          <h1 className="mt-3 text-[26px] font-semibold leading-tight tracking-tight sm:text-[30px]">
            2026 회계연도 3분기 재무실적 보고
          </h1>
          <p className="mt-2 text-[13px] text-[#555]">
            노스윈드 주식회사 · 재무기획팀 · 2026년 4월 3일
          </p>
        </header>

        <section className="mt-8">
          <h2 className="text-[15px] font-semibold">1. 요약</h2>
          <p className="mt-2.5 text-[13.5px] leading-[1.85] text-[#33363d]">
            3분기 연결 기준 매출액은 1,842억 6천만원으로 전년 동기 대비 14.9% 증가하였으며,
            영업이익은 416억 1천만원으로 29.1% 증가하였습니다. 엔터프라이즈 부문의 신규 계약
            확대와 APAC 지역 직판 채널의 성장이 실적 개선을 견인하였습니다. 판매비와관리비는
            인력 충원의 영향으로 11.7% 증가하였으나, 매출 증가율을 하회하며 영업이익률은 전년
            동기 20.1%에서 22.6%로 개선되었습니다.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-[15px] font-semibold">2. 요약 손익계산서</h2>
          <p className="mt-1.5 text-[11.5px] text-[#777]">(단위: 백만원)</p>
          <table className="mt-3 w-full border-collapse text-[12.5px]">
            <thead>
              <tr className="border-y border-[#1a1c20] text-left">
                <th className="py-2 font-medium">과목</th>
                <th className="py-2 text-right font-medium">당분기</th>
                <th className="py-2 text-right font-medium">전년 동기</th>
                <th className="py-2 text-right font-medium">증감률</th>
              </tr>
            </thead>
            <tbody>
              {INCOME_ROWS.map(([label, current, previous, delta], index) => {
                const emphasis = ["매출총이익", "영업이익", "당기순이익"].includes(label);
                return (
                  <tr
                    key={label}
                    className={cn(
                      "border-b border-[#e2e3e6]",
                      emphasis && "bg-[#f6f7f8] font-semibold",
                      index === INCOME_ROWS.length - 1 && "border-b-2 border-[#1a1c20]",
                    )}
                  >
                    <td className="py-2 pr-3">{label}</td>
                    <td className="py-2 text-right tabular">{current}</td>
                    <td className="py-2 text-right tabular text-[#555]">{previous}</td>
                    <td
                      className={cn(
                        "py-2 text-right tabular",
                        delta.startsWith("-") ? "text-[#b03030]" : "text-[#1a6b4a]",
                      )}
                    >
                      {delta}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className="mt-8">
          <h2 className="text-[15px] font-semibold">3. 사업부문별 매출</h2>
          <table className="mt-3 w-full border-collapse text-[12.5px]">
            <thead>
              <tr className="border-y border-[#1a1c20] text-left">
                <th className="py-2 font-medium">부문</th>
                <th className="py-2 text-right font-medium">매출</th>
                <th className="py-2 text-right font-medium">비중</th>
                <th className="py-2 text-right font-medium">전년 대비</th>
              </tr>
            </thead>
            <tbody>
              {SEGMENTS.map(([name, revenue, share, delta]) => (
                <tr key={name} className="border-b border-[#e2e3e6]">
                  <td className="py-2 pr-3">{name}</td>
                  <td className="py-2 text-right tabular">{revenue}</td>
                  <td className="py-2 text-right tabular text-[#555]">{share}</td>
                  <td
                    className={cn(
                      "py-2 text-right tabular",
                      delta.startsWith("-") ? "text-[#b03030]" : "text-[#1a6b4a]",
                    )}
                  >
                    {delta}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mt-8">
          <h2 className="text-[15px] font-semibold">4. 4분기 전망</h2>
          <ul className="mt-2.5 list-disc space-y-1.5 pl-5 text-[13.5px] leading-[1.8] text-[#33363d]">
            <li>연간 매출 가이던스를 기존 7,100억원에서 7,350억원으로 상향 조정합니다.</li>
            <li>APAC 직판 조직 확대에 따라 4분기 판관비는 전분기 대비 6~8% 증가할 전망입니다.</li>
            <li>레거시 계약 축소가 예정되어 있어 해당 부문 매출은 점진적으로 감소합니다.</li>
          </ul>
        </section>

        <footer className="mt-10 border-t border-[#d5d7db] pt-4 text-[11px] text-[#888]">
          본 문서는 내부 검토용이며 외부 공개 시 사전 승인이 필요합니다. · 페이지 1 / 4
        </footer>
      </article>
    </div>
  );
}
