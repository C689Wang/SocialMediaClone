# Reddit-Style Community Platform

A modern, feature-rich community platform built with Next.js, Firebase, and Chakra UI. This platform allows users to create communities, share posts, engage in discussions, and manage content in a Reddit-like environment.

## Features

### Authentication & User Management

- 🔐 Email/Password authentication
- 🔑 Google OAuth integration
- 🔄 Password reset functionality
- 👤 User profile management
- 📝 Custom user snippets and community membership tracking

### Community Features

- 🏠 Create and manage communities
- 🔒 Three privacy levels: Public, Restricted, and Private
- 👑 Basic moderation features:
  - Community image management
  - Member count tracking
  - Creator-only settings
- 🖼️ Custom community banners and avatars
- 📊 Community statistics

### Post Management

- 📝 Create, edit, and delete posts
- 🖼️ Image upload support
- ⬆️ Voting system
- 💬 Commenting system
- 🏷️ Post categorization

### UI/UX Features

- 📱 Responsive design for all devices
- 🎨 Custom theming with Chakra UI
- 🔍 Directory navigation system
- 🏃‍♂️ Fast page loads with Next.js
- 🎯 Real-time updates

## Tech Stack

### Frontend

- **Next.js**: React framework for production
- **TypeScript**: For type-safe code
- **Chakra UI**: Component library for modern design
- **Recoil**: State management
- **React Icons**: Icon library

### Backend & Services

- **Firebase Authentication**: User management and authentication
- **Cloud Firestore**: NoSQL database for storing communities, posts, and user data
- **Firebase Storage**: Image and media storage
- **Firebase Security Rules**: Data security and access control

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- Firebase account and project

## Getting Started

This is a [Next.js](https://nextjs.org/) project
bootstrapped with [`create-next-app`](https://github.com/
vercel/next.js/tree/canary/packages/create-next-app).

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
