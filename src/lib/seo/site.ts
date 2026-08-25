export const SITE = {
  name: "OFFICE SURVIVAL",
  tagline: "직장인 생존도구",
  description:
    "일하는 척부터 진짜 업무까지. 퇴근 카운트다운, 계산기, 날짜·시간 계산, 글자수 세기, 그리고 멀리서 보면 완벽한 업무 화면까지 모아둔 직장인 생존도구.",
  locale: "ko_KR",
  /** Override in production with NEXT_PUBLIC_SITE_URL. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://office-survival.vercel.app").replace(/\/$/, ""),
  ogImage: "/opengraph-image",
  twitter: "@officesurvival",
} as const;
