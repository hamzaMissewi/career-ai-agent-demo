import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const DEMO_CLERK_USER_ID = "user_demo_candidate";

const DAY_MS = 24 * 60 * 60 * 1000;

type SeedJob = {
  title: string;
  company: string;
  location: string;
  remote: boolean;
  employmentType: "full_time" | "part_time" | "contract";
  seniority: "junior" | "mid" | "senior" | "staff";
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  requirements: string[];
  skills: string[];
  status: "open" | "closed";
  postedDaysAgo: number;
};

const JOBS: SeedJob[] = [
  {
    title: "Full-Stack Engineer",
    company: "Lumen Labs",
    location: "London, UK",
    remote: true,
    employmentType: "full_time",
    seniority: "mid",
    salaryMin: 70000,
    salaryMax: 95000,
    description:
      "Build and ship product features across the stack using React, TypeScript, and Node.js. You will own features end to end, from Postgres data models and REST/GraphQL APIs to polished React UIs. We value fast iteration, testing, and clean code reviews.",
    requirements: [
      "3+ years building web applications",
      "Strong React and TypeScript experience",
      "Experience designing and consuming APIs",
    ],
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "GraphQL"],
    status: "open",
    postedDaysAgo: 3,
  },
  {
    title: "Senior Full-Stack Developer",
    company: "Brightpath",
    location: "Remote (Europe)",
    remote: true,
    employmentType: "full_time",
    seniority: "senior",
    salaryMin: 90000,
    salaryMax: 120000,
    description:
      "Lead development of our customer-facing SaaS platform built with Next.js, TypeScript, and Node.js microservices. Mentor mid-level engineers, drive architecture decisions, and improve performance of our React front end and API layer.",
    requirements: [
      "5+ years full-stack experience",
      "Production Next.js experience",
      "Comfort leading projects and mentoring",
    ],
    skills: ["Next.js", "React", "TypeScript", "Node.js", "AWS"],
    status: "open",
    postedDaysAgo: 5,
  },
  {
    title: "Frontend Engineer (React)",
    company: "Nova Metrics",
    location: "Manchester, UK",
    remote: true,
    employmentType: "full_time",
    seniority: "mid",
    salaryMin: 60000,
    salaryMax: 80000,
    description:
      "Craft delightful, accessible dashboards and data visualisations in React and TypeScript. You will work closely with designers, build reusable component libraries with Tailwind CSS, and keep our bundle fast.",
    requirements: [
      "Deep knowledge of modern React (hooks, suspense)",
      "Strong CSS and accessibility fundamentals",
      "Experience with charting or data-heavy UIs",
    ],
    skills: ["React", "TypeScript", "Tailwind CSS", "Vite", "Testing Library"],
    status: "open",
    postedDaysAgo: 2,
  },
  {
    title: "Frontend Developer",
    company: "Storefront.io",
    location: "Remote (UK)",
    remote: true,
    employmentType: "full_time",
    seniority: "junior",
    salaryMin: 40000,
    salaryMax: 55000,
    description:
      "Join our e-commerce platform team building storefront experiences with React, Next.js, and TypeScript. Great role for an engineer early in their career who wants strong mentorship and modern tooling.",
    requirements: [
      "1+ years professional frontend experience",
      "Familiarity with React and TypeScript",
    ],
    skills: ["React", "Next.js", "TypeScript", "CSS"],
    status: "open",
    postedDaysAgo: 7,
  },
  {
    title: "Backend Engineer (Node.js)",
    company: "Ledgerly",
    location: "London, UK",
    remote: false,
    employmentType: "full_time",
    seniority: "mid",
    salaryMin: 65000,
    salaryMax: 85000,
    description:
      "Design and build the APIs powering our fintech ledger product. Node.js and TypeScript services, event-driven architecture with Kafka, and PostgreSQL. Strong focus on correctness, idempotency, and observability.",
    requirements: [
      "Solid Node.js and TypeScript backend experience",
      "SQL schema design skills",
      "Experience with message queues a plus",
    ],
    skills: ["Node.js", "TypeScript", "PostgreSQL", "Kafka", "Docker"],
    status: "open",
    postedDaysAgo: 4,
  },
  {
    title: "Senior Backend Engineer (Go)",
    company: "Meshgrid",
    location: "Remote (Global)",
    remote: true,
    employmentType: "full_time",
    seniority: "senior",
    salaryMin: 110000,
    salaryMax: 140000,
    description:
      "Build high-throughput distributed systems in Go for our real-time infrastructure product. You will design gRPC services, optimise hot paths, and operate services running on Kubernetes.",
    requirements: [
      "5+ years backend experience, 2+ in Go",
      "Distributed systems knowledge",
      "Kubernetes in production",
    ],
    skills: ["Go", "gRPC", "Kubernetes", "Redis", "Terraform"],
    status: "open",
    postedDaysAgo: 10,
  },
  {
    title: "AI Product Engineer",
    company: "Careerly AI",
    location: "Remote (US/EU)",
    remote: true,
    employmentType: "full_time",
    seniority: "mid",
    salaryMin: 85000,
    salaryMax: 115000,
    description:
      "Build AI-powered career tools: agents, retrieval pipelines, and LLM-driven features in a TypeScript/Next.js stack. You will design prompts and tools, integrate embeddings and vector search, and ship user-facing AI features with React.",
    requirements: [
      "Full-stack TypeScript experience",
      "Hands-on with LLM APIs and embeddings",
      "Product mindset and fast shipping",
    ],
    skills: ["TypeScript", "Next.js", "React", "LLMs", "Vector Search"],
    status: "open",
    postedDaysAgo: 1,
  },
  {
    title: "Machine Learning Engineer",
    company: "Signalworks",
    location: "Cambridge, UK",
    remote: false,
    employmentType: "full_time",
    seniority: "senior",
    salaryMin: 95000,
    salaryMax: 130000,
    description:
      "Train, evaluate, and deploy ML models for our speech analytics platform. Python, PyTorch, and large-scale data pipelines. You will own the model lifecycle from experimentation to production serving.",
    requirements: [
      "Strong Python and PyTorch",
      "Experience deploying models to production",
      "Solid maths/statistics background",
    ],
    skills: ["Python", "PyTorch", "MLOps", "AWS SageMaker", "Airflow"],
    status: "open",
    postedDaysAgo: 12,
  },
  {
    title: "DevOps Engineer",
    company: "Cloudhaven",
    location: "Remote (UK)",
    remote: true,
    employmentType: "full_time",
    seniority: "mid",
    salaryMin: 70000,
    salaryMax: 90000,
    description:
      "Own our AWS infrastructure, CI/CD pipelines, and Kubernetes clusters. Automate everything with Terraform, improve deployment velocity, and build out monitoring and alerting with Prometheus and Grafana.",
    requirements: [
      "AWS and Kubernetes in production",
      "Infrastructure-as-code experience",
      "Scripting in Bash/Python",
    ],
    skills: ["AWS", "Kubernetes", "Terraform", "CI/CD", "Prometheus"],
    status: "open",
    postedDaysAgo: 6,
  },
  {
    title: "Platform Engineer (SRE)",
    company: "Uptimely",
    location: "Amsterdam, NL",
    remote: true,
    employmentType: "full_time",
    seniority: "senior",
    salaryMin: 95000,
    salaryMax: 125000,
    description:
      "Keep our multi-region platform reliable and fast. Define SLOs, run incident response, and build internal tooling in Go and Python. Deep Kubernetes, networking, and observability work.",
    requirements: [
      "SRE or platform experience at scale",
      "Strong Linux and networking fundamentals",
      "On-call experience",
    ],
    skills: ["Kubernetes", "Go", "Python", "Observability", "GCP"],
    status: "open",
    postedDaysAgo: 9,
  },
  {
    title: "Product Engineer (Full-Stack)",
    company: "Loopwork",
    location: "Remote (Global)",
    remote: true,
    employmentType: "full_time",
    seniority: "mid",
    salaryMin: 75000,
    salaryMax: 100000,
    description:
      "Small team, big ownership. Ship features weekly across a React + TypeScript front end and a Node.js + PostgreSQL backend. Talk to customers, design solutions, and build them yourself end to end.",
    requirements: [
      "3+ years shipping full-stack product features",
      "Strong TypeScript across the stack",
      "Comfort with ambiguity and customer contact",
    ],
    skills: [
      "React",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Product Thinking",
    ],
    status: "open",
    postedDaysAgo: 2,
  },
  {
    title: "Software Engineer, Growth",
    company: "Fanbase",
    location: "London, UK",
    remote: true,
    employmentType: "full_time",
    seniority: "mid",
    salaryMin: 68000,
    salaryMax: 92000,
    description:
      "Run experiments across signup, onboarding, and referral flows in a Next.js and Node.js codebase. You will build A/B testing infrastructure, analyse funnel data, and ship UI experiments in React.",
    requirements: [
      "Full-stack JavaScript/TypeScript experience",
      "Data-informed product mindset",
      "Experience with experimentation tooling a plus",
    ],
    skills: ["Next.js", "React", "TypeScript", "Node.js", "SQL"],
    status: "open",
    postedDaysAgo: 8,
  },
  {
    title: "Staff Software Engineer, Platform",
    company: "Brightpath",
    location: "Remote (Europe)",
    remote: true,
    employmentType: "full_time",
    seniority: "staff",
    salaryMin: 130000,
    salaryMax: 165000,
    description:
      "Set technical direction for our core platform: service architecture, developer experience, and scaling our TypeScript/Node.js monorepo. Partner with product engineering teams and level up engineering standards company-wide.",
    requirements: [
      "8+ years engineering experience",
      "Track record of technical leadership",
      "Monorepo and build tooling expertise",
    ],
    skills: ["TypeScript", "Node.js", "Architecture", "Turborepo", "AWS"],
    status: "open",
    postedDaysAgo: 14,
  },
  {
    title: "Contract React Developer (6 months)",
    company: "Medialane",
    location: "Remote (UK)",
    remote: true,
    employmentType: "contract",
    seniority: "senior",
    salaryMin: 90000,
    salaryMax: 110000,
    description:
      "Six-month contract to rebuild our publishing CMS front end in React and TypeScript. You will migrate legacy jQuery views to a modern component architecture and hand over to the in-house team.",
    requirements: [
      "Expert-level React and TypeScript",
      "Experience with incremental migrations",
      "Available to start within 4 weeks",
    ],
    skills: ["React", "TypeScript", "Redux", "Webpack"],
    status: "open",
    postedDaysAgo: 5,
  },
  {
    title: "Backend Engineer (Python/Django)",
    company: "Healthbridge",
    location: "Bristol, UK",
    remote: false,
    employmentType: "full_time",
    seniority: "mid",
    salaryMin: 55000,
    salaryMax: 75000,
    description:
      "Build patient-facing healthcare APIs with Django and Django REST Framework. Work on integrations with NHS systems, background jobs with Celery, and a PostgreSQL data layer with strict privacy requirements.",
    requirements: [
      "Solid Python and Django experience",
      "REST API design",
      "Care for data privacy and security",
    ],
    skills: ["Python", "Django", "PostgreSQL", "Celery", "REST"],
    status: "open",
    postedDaysAgo: 11,
  },
  {
    title: "iOS Engineer",
    company: "Snapcart",
    location: "Berlin, DE",
    remote: false,
    employmentType: "full_time",
    seniority: "senior",
    salaryMin: 85000,
    salaryMax: 110000,
    description:
      "Build our flagship shopping app in Swift and SwiftUI. You will own features from concept to App Store release, work with Core Data and StoreKit, and push the limits of smooth native UI on iOS.",
    requirements: [
      "5+ years native iOS development",
      "Expert Swift and SwiftUI",
      "Shipped apps on the App Store",
    ],
    skills: ["Swift", "SwiftUI", "Core Data", "StoreKit", "Xcode"],
    status: "open",
    postedDaysAgo: 4,
  },
  {
    title: "Embedded Firmware Engineer",
    company: "Voltaic Systems",
    location: "Munich, DE",
    remote: false,
    employmentType: "full_time",
    seniority: "senior",
    salaryMin: 80000,
    salaryMax: 105000,
    description:
      "Write bare-metal C and C++ firmware for battery management systems in electric vehicles. Work with RTOS, CAN bus, and hardware bring-up on custom ARM Cortex-M boards in our Munich lab.",
    requirements: [
      "Embedded C/C++ expertise",
      "RTOS and low-level debugging experience",
      "Familiarity with automotive protocols (CAN, LIN)",
    ],
    skills: ["C", "C++", "RTOS", "ARM Cortex-M", "CAN bus"],
    status: "open",
    postedDaysAgo: 15,
  },
  {
    title: "Android Developer (Kotlin)",
    company: "Transitly",
    location: "Warsaw, PL",
    remote: false,
    employmentType: "full_time",
    seniority: "mid",
    salaryMin: 50000,
    salaryMax: 70000,
    description:
      "Develop our public transport ticketing app in Kotlin with Jetpack Compose. Integrate NFC ticketing, offline-first storage with Room, and real-time vehicle tracking on Android.",
    requirements: [
      "3+ years Android development",
      "Kotlin and Jetpack Compose",
      "Play Store release experience",
    ],
    skills: ["Kotlin", "Jetpack Compose", "Android SDK", "Room", "NFC"],
    status: "open",
    postedDaysAgo: 6,
  },
  {
    title: "Full-Stack Engineer (TypeScript)",
    company: "Archive HQ",
    location: "Remote (US)",
    remote: true,
    employmentType: "full_time",
    seniority: "mid",
    salaryMin: 100000,
    salaryMax: 130000,
    description:
      "Help us build collaborative knowledge tools with React, TypeScript, Node.js, and real-time sync. You will work on rich text editing, presence features, and a fast search experience.",
    requirements: [
      "Strong TypeScript across front and back end",
      "Experience with real-time or collaborative apps a plus",
    ],
    skills: ["React", "TypeScript", "Node.js", "WebSockets", "Search"],
    status: "closed",
    postedDaysAgo: 30,
  },
  {
    title: "React Native Developer",
    company: "Fitloop",
    location: "Remote (EU)",
    remote: true,
    employmentType: "full_time",
    seniority: "mid",
    salaryMin: 60000,
    salaryMax: 85000,
    description:
      "Build our fitness tracking app in React Native and TypeScript. Integrate HealthKit/Google Fit, build smooth animations with Reanimated, and ship to both app stores weekly.",
    requirements: [
      "2+ years React Native experience",
      "TypeScript proficiency",
      "Native module experience a plus",
    ],
    skills: ["React Native", "TypeScript", "Reanimated", "Expo"],
    status: "closed",
    postedDaysAgo: 45,
  },
  {
    title: "Data Engineer",
    company: "Nova Metrics",
    location: "Manchester, UK",
    remote: true,
    employmentType: "full_time",
    seniority: "senior",
    salaryMin: 80000,
    salaryMax: 105000,
    description:
      "Design and operate our analytics data platform: ELT pipelines with dbt and Airflow, a Snowflake warehouse, and streaming ingestion. Partner with analysts to model clean, trustworthy datasets.",
    requirements: [
      "Strong SQL and Python",
      "dbt and orchestration experience",
      "Warehouse modelling expertise",
    ],
    skills: ["SQL", "Python", "dbt", "Airflow", "Snowflake"],
    status: "closed",
    postedDaysAgo: 40,
  },
];

/**
 * Upsert a real candidate (user + profile + primary resume) by Clerk user id
 * without touching job listings or other users. Re-running replaces the
 * profile and resume. Run embeddings:backfill afterwards.
 *
 * `npx convex run seed:seedUser '{"clerkUserId": "user_..."}'`
 */
export const seedUser = internalMutation({
  args: { clerkUserId: v.string() },
  returns: v.object({ userId: v.id("users") }),
  handler: async (ctx, args) => {
    const now = Date.now();

    let user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .unique();
    const name = "Sonny Sangha";
    const email = "sonny@papareact.com";
    let userId;
    if (user) {
      userId = user._id;
      await ctx.db.patch(userId, { name, email });
    } else {
      userId = await ctx.db.insert("users", {
        clerkUserId: args.clerkUserId,
        name,
        email,
      });
    }

    // Replace any existing profile, resume, and stale matches for this user.
    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    if (existingProfile) {
      await ctx.db.delete(existingProfile._id);
    }
    const existingResumes = await ctx.db
      .query("resumes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const resume of existingResumes) {
      await ctx.db.delete(resume._id);
    }
    const existingMatches = await ctx.db
      .query("matches")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const match of existingMatches) {
      await ctx.db.delete(match._id);
    }

    await ctx.db.insert("profiles", {
      userId,
      headline:
        "Senior Full-Stack Engineer & Developer Educator — React, Next.js, TypeScript, AI",
      summary:
        "Senior full-stack engineer with 10+ years of experience shipping production web apps and teaching modern development to millions of developers. Deep expertise in React, Next.js, TypeScript, and Node.js, with extensive recent work building AI-powered products: LLM agents, RAG pipelines, embeddings, and vector search. Founder-level ownership: has built and launched dozens of full products end to end, from data model and auth to polished UI and deployment. Strong communicator who leads teams, mentors engineers, and explains complex systems clearly.",
      skills: [
        "React",
        "Next.js",
        "TypeScript",
        "Node.js",
        "Tailwind CSS",
        "PostgreSQL",
        "Convex",
        "GraphQL",
        "AWS",
        "Vercel",
        "LLMs",
        "Vector Search",
        "React Native",
        "Docker",
        "Stripe",
      ],
      yearsOfExperience: 10,
      location: "London, UK",
      desiredRoles: [
        "Senior Full-Stack Engineer",
        "Staff Software Engineer",
        "AI Product Engineer",
        "Developer Advocate",
        "Engineering Lead",
      ],
      openToRemote: true,
      experience: [
        {
          company: "PAPA Technologies",
          role: "Founder & Lead Engineer",
          startYear: 2020,
          description:
            "Founded and run a developer education company teaching modern full-stack development (React, Next.js, TypeScript, AI) to a community of 1M+ developers. Designed and shipped dozens of production-grade apps and SaaS products end to end, including AI agents, RAG systems, and real-time collaborative tools.",
        },
        {
          company: "UBS",
          role: "Software Engineer",
          startYear: 2017,
          endYear: 2020,
          description:
            "Built internal trading and risk tooling on a large-scale JavaScript/TypeScript stack within a global investment bank. Worked across front-end platforms and API services with strict reliability and compliance requirements.",
        },
        {
          company: "Freelance",
          role: "Full-Stack Developer",
          startYear: 2014,
          endYear: 2017,
          description:
            "Delivered web applications for agencies and startups across e-commerce, media, and fintech.",
        },
      ],
      education: [
        {
          school: "University of London",
          degree: "BSc Computer Science",
          year: 2014,
        },
      ],
    });

    await ctx.db.insert("resumes", {
      userId,
      title: "Sonny Sangha — Senior Full-Stack Engineer",
      isPrimary: true,
      updatedAt: now,
      content: `# Sonny Sangha
**Senior Full-Stack Engineer & Developer Educator** · London, UK · sonny@papareact.com

## Summary
Senior full-stack engineer (10+ YOE) and developer educator with an audience of 1M+ developers. Expert in React, Next.js, TypeScript, and Node.js; extensive recent work shipping AI products with LLM agents, embeddings, and vector search. Comfortable owning products end to end — architecture, backend, UI, auth, payments, and deployment.

## Skills
React · Next.js · TypeScript · Node.js · Tailwind CSS · PostgreSQL · Convex · GraphQL · AWS · Vercel · LLMs · Vector Search · React Native · Docker · Stripe

## Experience
### Founder & Lead Engineer — PAPA Technologies (2020–present)
- Built and launched dozens of production full-stack apps and SaaS products end to end
- Shipped AI-powered products: LLM agents, RAG pipelines, vector search, and realtime tools
- Teach modern full-stack and AI development to a community of 1M+ developers
- Led cohorts and mentored hundreds of engineers into professional roles

### Software Engineer — UBS (2017–2020)
- Built trading and risk tooling on a large-scale TypeScript stack in a global bank
- Delivered high-reliability front-end platforms and API services under strict compliance

### Full-Stack Developer — Freelance (2014–2017)
- Delivered web apps for agencies and startups across e-commerce, media, and fintech

## Education
BSc Computer Science, University of London (2014)`,
    });

    return { userId };
  },
});

export const run = internalMutation({
  args: {},
  returns: v.object({
    users: v.number(),
    profiles: v.number(),
    resumes: v.number(),
    jobListings: v.number(),
  }),
  handler: async (ctx) => {
    // Idempotent: wipe all seeded tables so re-running resets the dummy DB.
    const tables = [
      "applications",
      "coverLetters",
      "resumes",
      "matches",
      "profiles",
      "jobListings",
      "users",
    ] as const;
    for (const table of tables) {
      const rows = await ctx.db.query(table).collect();
      for (const row of rows) {
        await ctx.db.delete(row._id);
      }
    }

    const now = Date.now();

    const userId = await ctx.db.insert("users", {
      clerkUserId: DEMO_CLERK_USER_ID,
      name: "Alex Rivera",
      email: "alex.rivera@example.com",
    });

    await ctx.db.insert("profiles", {
      userId,
      headline: "Full-Stack Engineer — React, TypeScript, Node.js",
      summary:
        "Mid-level full-stack engineer with 4 years of experience building SaaS products end to end. Strong in React, TypeScript, and Node.js with PostgreSQL, plus recent hands-on work integrating LLM APIs and vector search into product features. Enjoys owning features from data model to polished UI, and thrives in small, fast-moving product teams.",
      skills: [
        "React",
        "TypeScript",
        "Node.js",
        "Next.js",
        "PostgreSQL",
        "GraphQL",
        "Tailwind CSS",
        "Docker",
        "LLMs",
      ],
      yearsOfExperience: 4,
      location: "London, UK",
      desiredRoles: [
        "Full-Stack Engineer",
        "Frontend Engineer",
        "Product Engineer",
        "AI Product Engineer",
      ],
      openToRemote: true,
      experience: [
        {
          company: "Orbit CRM",
          role: "Full-Stack Engineer",
          startYear: 2023,
          description:
            "Built customer-facing features across a Next.js + Node.js stack; led migration to TypeScript and shipped an AI email-drafting feature using LLM APIs.",
        },
        {
          company: "Pixelworks Agency",
          role: "Frontend Developer",
          startYear: 2021,
          endYear: 2023,
          description:
            "Delivered React web apps for clients across e-commerce and media; built a shared component library used across 6 projects.",
        },
      ],
      education: [
        {
          school: "University of Manchester",
          degree: "BSc Computer Science",
          year: 2021,
        },
      ],
    });

    await ctx.db.insert("resumes", {
      userId,
      title: "Alex Rivera — Full-Stack Engineer",
      isPrimary: true,
      updatedAt: now,
      content: `# Alex Rivera
**Full-Stack Engineer** · London, UK · alex.rivera@example.com

## Summary
Mid-level full-stack engineer (4 YOE) specialising in React, TypeScript, and Node.js. Recently shipped LLM-powered product features. Looking for a product-focused full-stack or AI product engineering role, remote-friendly.

## Skills
React · TypeScript · Node.js · Next.js · PostgreSQL · GraphQL · Tailwind CSS · Docker · LLM APIs

## Experience
### Full-Stack Engineer — Orbit CRM (2023–present)
- Shipped customer-facing features across a Next.js + Node.js + PostgreSQL stack
- Led incremental migration of a 120k-LOC codebase to TypeScript
- Built an AI email-drafting feature (LLM APIs + embeddings) used by 30% of active users

### Frontend Developer — Pixelworks Agency (2021–2023)
- Delivered React apps for e-commerce and media clients
- Created a shared component library adopted across 6 client projects

## Education
BSc Computer Science, University of Manchester (2021)`,
    });

    for (const job of JOBS) {
      const { postedDaysAgo, ...fields } = job;
      await ctx.db.insert("jobListings", {
        ...fields,
        postedAt: now - postedDaysAgo * DAY_MS,
      });
    }

    return {
      users: 1,
      profiles: 1,
      resumes: 1,
      jobListings: JOBS.length,
    };
  },
});
