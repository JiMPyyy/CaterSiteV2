# CaterLV Frontend

This is the Next.js frontend application for CaterLV.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Features

- **Homepage**: Hero section with company branding
- **Order System**: Food ordering interface
- **Scheduling**: Calendar-based event planning
- **Authentication**: Login/Signup modals
- **Responsive Design**: Mobile-first approach

## Tech Stack

- Next.js 15.3.3 with App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion for animations
- FullCalendar for scheduling
- Radix UI components
- Lucide React icons

## Project Structure

```
src/
├── app/
│   ├── page.tsx         # Homepage
│   ├── layout.tsx       # Root layout
│   ├── globals.css      # Global styles
│   ├── login/           # Login page
│   ├── order/           # Order page
│   └── schedule/        # Schedule page
├── components/
│   └── ui/              # Reusable UI components
└── lib/
    └── utils.ts         # Utility functions
```
