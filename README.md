
# 🧪 UselessTube - Where Things Become Useless

A parody video-sharing platform with blockchain authentication and cloud video storage. Designed to look useless, but built with serious tech!

---

## 🚀 Features

* 🔐 **Blockchain Authentication** – Connect with Phantom Wallet (Solana)
* 🎥 **Video Upload & Storage** – Powered by AWS S3 (or Cloudinary)
* 🗃️ **Database Persistence** – PostgreSQL with Prisma ORM
* ⚡ **Real-time Features** – Comments, likes, views tracking
* 📱 **Responsive Design** – Mobile-friendly, smooth on all devices
* 🌓 **Dark/Light Mode** – Seamless theme toggle
* 🔍 **Search Functionality** – Explore "useless" content
* 👤 **User Profiles** – Wallet-based identity with custom avatars

---

## 🛠️ Tech Stack

| Layer        | Technology                           |
| ------------ | ------------------------------------ |
| **Frontend** | Next.js 15, React 19, TypeScript     |
| **Styling**  | Tailwind CSS, Radix UI, Lucide Icons |
| **Backend**  | Prisma ORM with PostgreSQL           |
| **Storage**  | AWS S3 (or Cloudinary alternative)   |
| **Auth**     | Phantom Wallet (Solana)              |
| **State**    | React Hooks + Local Storage          |

---

## 📋 Prerequisites

* Node.js 18+
* PostgreSQL instance
* AWS S3 bucket **or** Cloudinary account
* Phantom Wallet browser extension

---

## ⚡ Quick Start

### 1. Clone the Repo

```bash
git clone <repository-url>
cd useless-tube
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Create a `.env.local` file using the provided `env.example`:

```env
# PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/useless_tube"

# AWS S3
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=useless-tube-videos

# OR Cloudinary (Alternative)
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### 4. Set Up the Database

```bash
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema to DB
pnpm db:seed          # Seed sample data
```

### 5. Start Development Server

```bash
pnpm dev
```

Go to: [http://localhost:3000](http://localhost:3000)

---

## 🧱 Database Schema Overview

### 🧑 Users

* Wallet-based auth
* Display name + avatar
* Timestamps

### 📼 Videos

* Title, description, length
* File URLs from S3/Cloudinary
* Engagement: likes, views
* Supports shorts/longs

### 💬 Comments

* Comment on videos

### 👍 Video Likes

* Like/dislike with user linkage

### 🔔 Subscriptions

* Follow other users

---

## 🗂 Project Structure

```
useless-tube/
├── app/             # Next.js App Router
│   ├── api/         # API routes
│   ├── upload/      # Video upload page
│   ├── watch/       # Video player page
│   ├── dashboard/   # User dashboard
├── components/      # UI components
│   └── ui/          # Radix UI elements
├── lib/             # Utility logic (auth, storage, db)
├── prisma/          # DB schema + migrations
└── public/          # Static files
```

---

## 🔧 Available Commands

| Command            | Description                |
| ------------------ | -------------------------- |
| `pnpm dev`         | Start development server   |
| `pnpm build`       | Build for production       |
| `pnpm start`       | Run production server      |
| `pnpm lint`        | Lint the codebase          |
| `pnpm db:generate` | Generate Prisma client     |
| `pnpm db:push`     | Sync DB schema             |
| `pnpm db:migrate`  | Run migrations             |
| `pnpm db:seed`     | Seed DB with sample data   |
| `pnpm db:studio`   | Open Prisma Studio (DB UI) |

---

## 🌐 Deployment

### 🔄 Vercel (Recommended)

1. Connect your GitHub repo to Vercel
2. Add environment variables in dashboard
3. Push to Git and auto-deploy

### 🧱 Manual Hosting

1. Build: `pnpm build`
2. Setup DB and env vars
3. Deploy on Render, Railway, or any Node-compatible host

---

## 🔐 Environment Variables

| Variable                | Required | Description                    |
| ----------------------- | -------- | ------------------------------ |
| `DATABASE_URL`          | ✅        | PostgreSQL connection URL      |
| `AWS_ACCESS_KEY_ID`     | ✅\*      | AWS S3 credentials             |
| `AWS_SECRET_ACCESS_KEY` | ✅\*      | AWS secret                     |
| `AWS_REGION`            | ✅\*      | AWS region (e.g., `us-east-1`) |
| `AWS_S3_BUCKET`         | ✅\*      | S3 bucket name                 |
| `CLOUDINARY_CLOUD_NAME` | Alt.     | Cloudinary config (optional)   |
| `CLOUDINARY_API_KEY`    | Alt.     |                                |
| `CLOUDINARY_API_SECRET` | Alt.     |                                |

\*Required if using AWS S3. Use Cloudinary instead by omitting AWS keys.

---

## 🧭 Roadmap

* [ ] Real Solana on-chain video publishing
* [ ] Video transcoding + compression
* [ ] Advanced filters + search
* [ ] Playlists
* [ ] Live stream support
* [ ] Mobile app (React Native)
* [ ] Admin analytics dashboard
* [ ] Moderation tools
* [ ] i18n (multi-language support)

---

## 🐞 Troubleshooting

### 🔌 DB Not Connecting?

* Ensure PostgreSQL is running
* Check `.env` format
* Database must exist before pushing

### 📤 Upload Not Working?

* Confirm S3 or Cloudinary keys
* Bucket must allow public read access
* Check file size limit (max 100MB recommended)

### 🦊 Wallet Issues?

* Install Phantom extension
* Approve popups
* Refresh if wallet fails to connect

---

## 🤝 Contributing

1. Fork this repo 🍴
2. Create a feature branch 🛠
3. Push your changes 🚀
4. Open a PR! 🧑‍💻

---

## 📝 License

Licensed under the **MIT License** – use it, break it, improve it, share it.

---

## 🎭 Disclaimer

This is a parody app. The UI may look silly – **because it is**. But under the hood, it's a legit dev playground. Use responsibly, and laugh a little. 😄



