# Fylr

A modern, lightning-fast cloud file management application built with Next.js 15, featuring secure authentication, smart folder organization, and seamless media previews.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## Features

- **Smart Folder Organization** – Create nested folder structures to organize your files exactly how you like
- **Media Gallery** – Built-in previews for JPG, PNG, and WebP images directly in dashboard
- **Lightning Fast** – Optimized uploads with drag-and-drop support and instant syncing
- **Secure Storage** – Encrypted and private file storage with user-based access control
- **Dark/Light Theme** – Toggle between themes for comfortable viewing
- **Responsive Design** – Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | [Next.js 15](https://nextjs.org/) with Turbopack |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| **Authentication** | [Clerk](https://clerk.com/) |
| **Database** | [Neon PostgreSQL](https://neon.tech/) |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team/) |
| **File Storage** | [ImageKit](https://imagekit.io/) |
| **Icons** | [Lucide React](https://lucide.dev/) |

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A [Clerk](https://clerk.com/) account for authentication
- A [Neon](https://neon.tech/) database (or any PostgreSQL database)
- An [ImageKit](https://imagekit.io/) account for file storage

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/atulya-srivastava/fylr.git
   cd fylr
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Database
   DATABASE_URL=your_neon_database_url

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # ImageKit
   NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   ```

4. **Set up the database**

   ```bash
   # Generate migrations
   npm run db:generate

   # Push schema to database
   npm run db:push
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema changes to database |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Drizzle Studio for database management |

## Project Structure

```
fylr/
├── app/
│   ├── api/              # API routes
│   │   ├── files/        # File operations
│   │   ├── folders/      # Folder operations
│   │   ├── imagekit-auth/# ImageKit authentication
│   │   └── upload/       # File upload handling
│   ├── components/       # Page-specific components
│   ├── dashboard/        # Dashboard page
│   ├── sign-in/          # Sign in page
│   ├── sign-up/          # Sign up page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/           # Shared UI components
├── lib/
│   ├── db/               # Database configuration & schema
│   └── utils.ts          # Utility functions
├── drizzle/              # Database migrations
├── schemas/              # Validation schemas
├── public/               # Static assets
└── middleware.ts         # Clerk authentication middleware
```

## Database Schema

The application uses a single `files` table that supports both files and folders:

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `name` | Text | File/folder name |
| `path` | Text | Full path (e.g., documents/home/file.png) |
| `size` | Integer | File size in bytes |
| `type` | Text | MIME type or "folder" |
| `fileUrl` | Text | URL to access the file |
| `thumbnailUrl` | Text | URL for thumbnail (optional) |
| `userId` | Text | Owner's Clerk user ID |
| `parentId` | UUID | Parent folder ID (null for root) |
| `isFolder` | Boolean | Whether item is a folder |
| `isStarred` | Boolean | Starred status |
| `isTrash` | Boolean | Trash status |
| `createdAt` | Timestamp | Creation date |
| `updatedAt` | Timestamp | Last update date |

## Deployment

The application can be deployed to any platform that supports Next.js:

- [Vercel](https://vercel.com/) (recommended)
- [Netlify](https://www.netlify.com/)
- [Railway](https://railway.app/)

Make sure to configure all environment variables in your deployment platform.

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<p align="center">
  Built with Next.js and Tailwind CSS
</p>
