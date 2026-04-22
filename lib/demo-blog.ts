import { stock } from "@/lib/remote-images";

export const DEMO_BLOG_SLUGS = [
  "accelerate-with-unified-platforms",
  "compliance-ready-from-day-one",
  "digitize-forms-and-workflows",
] as const;

export type DemoBlogSlug = (typeof DEMO_BLOG_SLUGS)[number];

type Msg =
  | "blog_post1_title"
  | "blog_post1_excerpt"
  | "blog_post1_date"
  | "blog_post2_title"
  | "blog_post2_excerpt"
  | "blog_post2_date"
  | "blog_post3_title"
  | "blog_post3_excerpt"
  | "blog_post3_date";

export type DemoBlogListEntry = {
  slug: DemoBlogSlug;
  iso: string;
  titleKey: Msg;
  excerptKey: Msg;
  dateKey: Msg;
  cover: (typeof stock.blog)[keyof typeof stock.blog];
};

export const DEMO_BLOG_LIST: DemoBlogListEntry[] = [
  {
    slug: "accelerate-with-unified-platforms",
    iso: "2026-04-01",
    titleKey: "blog_post1_title",
    excerptKey: "blog_post1_excerpt",
    dateKey: "blog_post1_date",
    cover: stock.blog.speed,
  },
  {
    slug: "compliance-ready-from-day-one",
    iso: "2026-03-15",
    titleKey: "blog_post2_title",
    excerptKey: "blog_post2_excerpt",
    dateKey: "blog_post2_date",
    cover: stock.blog.local,
  },
  {
    slug: "digitize-forms-and-workflows",
    iso: "2026-03-01",
    titleKey: "blog_post3_title",
    excerptKey: "blog_post3_excerpt",
    dateKey: "blog_post3_date",
    cover: stock.blog.forms,
  },
];

type DetailMsg =
  | "blog_post1_title"
  | "blog_post1_date"
  | "blog_post2_title"
  | "blog_post2_date"
  | "blog_post3_title"
  | "blog_post3_date"
  | "blog_post_accelerate_body_1"
  | "blog_post_accelerate_body_2"
  | "blog_post_compliance_body_1"
  | "blog_post_compliance_body_2"
  | "blog_post_digitize_body_1"
  | "blog_post_digitize_body_2";

export type DemoBlogDetail = {
  slug: DemoBlogSlug;
  titleKey: DetailMsg;
  dateKey: DetailMsg;
  iso: string;
  cover: (typeof stock.blog)[keyof typeof stock.blog];
  bodyKeys: readonly [DetailMsg, DetailMsg];
};

export const DEMO_BLOG_DETAIL_BY_SLUG: Record<DemoBlogSlug, DemoBlogDetail> = {
  "accelerate-with-unified-platforms": {
    slug: "accelerate-with-unified-platforms",
    titleKey: "blog_post1_title",
    dateKey: "blog_post1_date",
    iso: "2026-04-01",
    cover: stock.blog.speed,
    bodyKeys: ["blog_post_accelerate_body_1", "blog_post_accelerate_body_2"],
  },
  "compliance-ready-from-day-one": {
    slug: "compliance-ready-from-day-one",
    titleKey: "blog_post2_title",
    dateKey: "blog_post2_date",
    iso: "2026-03-15",
    cover: stock.blog.local,
    bodyKeys: ["blog_post_compliance_body_1", "blog_post_compliance_body_2"],
  },
  "digitize-forms-and-workflows": {
    slug: "digitize-forms-and-workflows",
    titleKey: "blog_post3_title",
    dateKey: "blog_post3_date",
    iso: "2026-03-01",
    cover: stock.blog.forms,
    bodyKeys: ["blog_post_digitize_body_1", "blog_post_digitize_body_2"],
  },
};
