/**
 * Curated Unsplash URLs (royalty-free). Tune or replace IDs anytime.
 * https://unsplash.com/license
 */
function unsplash(path: string, w: number) {
  return `https://images.unsplash.com/${path}?auto=format&fit=crop&w=${w}&q=80`;
}

export const stock = {
  heroSide: {
    src: unsplash("photo-1460925895917-afdab827c52f", 1200),
    alt: "Analytics dashboard and growth charts on a laptop",
  },
  discover: {
    src: unsplash("photo-1553877522-43269d4ea984", 800),
    alt: "Team reviewing data and strategy on a whiteboard",
  },
  connect: {
    src: unsplash("photo-1522071820081-009f0129c71c", 800),
    alt: "Collaboration and teamwork in a modern office",
  },
  grow: {
    src: unsplash("photo-1551288049-bebda4e38f71", 800),
    alt: "Business metrics trending upward on screen",
  },
  aboutTeam: {
    src: unsplash("photo-1552664730-d307ca884978", 1200),
    alt: "Marketing team planning campaigns together",
  },
  pricingHeader: {
    src: unsplash("photo-1454165804606-c3d57bc86b40", 1400),
    alt: "Desk with notebook, coffee, and planning notes",
  },
  contactSide: {
    src: unsplash("photo-1512941937669-90a1b58e7e9c", 900),
    alt: "Phone and messaging for quick client contact",
  },
  services: {
    audit: {
      src: unsplash("photo-1551434678-e076c223a692", 800),
      alt: "Developer reviewing website performance",
    },
    onPage: {
      // Replaced: old ID started returning 404 upstream from Unsplash.
      src: unsplash("photo-1553877522-43269d4ea984", 800),
      alt: "Laptop showing search and browsing",
    },
    local: {
      src: unsplash("photo-1486406146926-c627a92ad1ab", 800),
      alt: "Urban skyline representing local business reach",
    },
    webDev: {
      src: unsplash("photo-1498050108023-c5249f4df085", 800),
      alt: "Code on screen for web development",
    },
    analytics: {
      src: unsplash("photo-1551288049-bebda4e38f71", 800),
      alt: "Analytics dashboard with charts",
    },
    retainer: {
      src: unsplash("photo-1600880292203-757bb62b4baf", 800),
      alt: "Business meeting for ongoing partnership",
    },
  },
  blog: {
    speed: {
      src: unsplash("photo-1451187580459-43490279c0fa", 900),
      alt: "Technology network representing fast digital experiences",
    },
    local: {
      src: unsplash("photo-1449824913935-59a10b8d2000", 900),
      alt: "City map and navigation concept",
    },
    forms: {
      src: unsplash("photo-1516321318423-f06f85e504b3", 900),
      alt: "Laptop with email and messaging interface",
    },
  },
} as const;
