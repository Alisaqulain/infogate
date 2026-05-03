"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import { cn } from "@/lib/utils";

type TabKey = "core" | "growth";

export function WhyInfoGateTabs() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<TabKey>("core");

  const items = useMemo(() => {
    if (tab === "core") {
      return [
        {
          title: t("home_steps_discover_title"),
          body: t("home_steps_discover_body"),
        },
        {
          title: t("home_steps_connect_title"),
          body: t("home_steps_connect_body"),
        },
        {
          title: t("home_steps_grow_title"),
          body: t("home_steps_grow_body"),
        },
        {
          title: t("home_why_core_4_title"),
          body: t("home_why_core_4_body"),
        },
      ] as const;
    }
    return [
      {
        title: t("home_why_growth_1_title"),
        body: t("home_why_growth_1_body"),
      },
      {
        title: t("home_why_growth_2_title"),
        body: t("home_why_growth_2_body"),
      },
      {
        title: t("home_why_growth_3_title"),
        body: t("home_why_growth_3_body"),
      },
    ] as const;
  }, [tab, t]);

  const panelLabel =
    tab === "core" ? t("home_why_tab_core") : t("home_why_tab_growth");

  return (
    <div className="mt-8">
      <div
        className="inline-flex w-full flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm sm:w-auto"
        role="tablist"
        aria-label={t("home_why_title")}
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "core"}
          className={cn(
            "rounded-xl px-4 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300",
            tab === "core"
              ? "bg-white text-slate-950 shadow-sm"
              : "text-slate-200 hover:bg-white/10 hover:text-white",
          )}
          onClick={() => setTab("core")}
        >
          {t("home_why_tab_core")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "growth"}
          className={cn(
            "rounded-xl px-4 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300",
            tab === "growth"
              ? "bg-white text-slate-950 shadow-sm"
              : "text-slate-200 hover:bg-white/10 hover:text-white",
          )}
          onClick={() => setTab("growth")}
        >
          {t("home_why_tab_growth")}
        </button>
      </div>

      <div
        className={cn(
          "mt-6 grid gap-4 sm:grid-cols-2",
          tab === "core" ? "lg:grid-cols-2" : "lg:grid-cols-3",
        )}
        role="tabpanel"
        aria-label={panelLabel}
      >
        {items.map((it) => (
          <div
            key={it.title}
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-200/30 hover:bg-white/7 hover:shadow-[0_28px_90px_-22px_rgba(34,211,238,0.45)]"
          >
            <h3 className="text-lg font-extrabold text-white">{it.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {it.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
