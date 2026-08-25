"use client";

import { Input, Label, Select } from "@/components/ui/Field";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";
import type { Preferences } from "@/lib/storage/preferences";

interface CountdownSettingsProps {
  preferences: Preferences;
  onChange: (patch: Partial<Preferences>) => void;
}

const BREAK_OPTIONS = [0, 30, 45, 60, 90];

export function CountdownSettings({ preferences, onChange }: CountdownSettingsProps) {
  const update = (patch: Partial<Preferences>) => {
    onChange(patch);
    track(ANALYTICS_EVENTS.countdownSet, {
      quit_time: patch.quitTime ?? preferences.quitTime,
      start_time: patch.startTime ?? preferences.startTime,
    });
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <Label htmlFor="start-time">출근 시간</Label>
        <Input
          id="start-time"
          type="time"
          value={preferences.startTime}
          onChange={(event) => update({ startTime: event.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="quit-time">퇴근 시간</Label>
        <Input
          id="quit-time"
          type="time"
          value={preferences.quitTime}
          onChange={(event) => update({ quitTime: event.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="break-minutes">휴게 시간</Label>
        <Select
          id="break-minutes"
          value={String(preferences.breakMinutes)}
          onChange={(event) => update({ breakMinutes: Number(event.target.value) })}
        >
          {BREAK_OPTIONS.map((minutes) => (
            <option key={minutes} value={minutes}>
              {minutes === 0 ? "없음" : `${minutes}분`}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <span className="mb-1.5 block text-[13px] font-medium text-muted">주말</span>
        <label className="flex h-11 cursor-pointer items-center gap-2.5 rounded-xl border border-border bg-surface-2 px-3 text-sm transition-colors hover:border-border-strong">
          <input
            type="checkbox"
            checked={preferences.weekendOff}
            onChange={(event) => update({ weekendOff: event.target.checked })}
            className="size-4 accent-[var(--accent)]"
          />
          주말은 쉬는 날
        </label>
      </div>
    </div>
  );
}
