# Win Jar Backend

## Setup
```bash
npm install express cors dotenv bcryptjs jsonwebtoken @prisma/client@6
npm install -D nodemon prisma@6
cp .env.example .env      # then edit JWT_SECRET
npx prisma migrate dev --name init
npm run dev
```

Open http://localhost:3000 - you should see the "running" message.
