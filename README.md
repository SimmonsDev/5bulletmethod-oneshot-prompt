# 5BulletMethod

A weekly productivity journaling app where users log 5 bullet-point accomplishments each week.

## Features

- **Weekly Entries**: Create one entry per week with up to 5 bullet items
- **Rich Content**: Each bullet includes emoji, description, and optional category
- **History View**: Browse previous weekly entries
- **Streak Tracker**: Track consecutive weeks with completed entries
- **AI Insights**: Get motivational feedback after each entry
- **Local Development**: Runs entirely locally without external dependencies

## Tech Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Azure Functions (Node.js + TypeScript)
- **Database**: SQLite with better-sqlite3
- **Auth**: Simulated (userId = "test-user")

## Project Structure

```
/
├── api/                 # Azure Functions backend
│   ├── src/
│   │   └── database.ts  # SQLite database operations
│   ├── entries/         # CRUD operations for entries
│   ├── streak/          # Streak calculation endpoint
│   ├── insight/         # AI insight endpoint
│   └── ...
├── web/                 # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   └── ...
│   └── ...
└── db/                  # Database files
    ├── schema.sql       # Database schema
    └── seed.sql         # Sample data
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd 5bulletmethod
   ```

2. **Install backend dependencies**:
   ```bash
   cd api
   npm install
   cd ..
   ```

3. **Install frontend dependencies**:
   ```bash
   cd web
   npm install
   cd ..
   ```

4. **Set up the database**:
   ```bash
   cd db
   # The database will be created automatically when the API starts
   ```

### Running the Application

1. **Start the backend** (in terminal 1):
   ```bash
   cd api
   npm start
   ```
   The API will run on http://localhost:7071

2. **Start the frontend** (in terminal 2):
   ```bash
   cd web
   npm run dev
   ```
   The app will open at http://localhost:5173

### Seeding Sample Data

To add sample data for testing:

1. Run the API server
2. The database and tables will be created automatically
3. You can manually run the seed.sql file using a SQLite client, or add entries through the UI

## API Endpoints

- `POST /entries` - Create new weekly entry
- `GET /entries` - Get all entries
- `GET /entries/:id` - Get single entry
- `PUT /entries/:id` - Update entry
- `DELETE /entries/:id` - Delete entry
- `GET /streak` - Get current streak
- `GET /entries/:id/insight` - Get AI insight for entry

## Data Model

### BulletEntry
```typescript
{
  id: number
  user_id: string
  week_start_date: string
  created_at: string
  items: BulletItem[]
}
```

### BulletItem
```typescript
{
  id: number
  bullet_entry_id: number
  item_order: number
  emoji: string
  text: string
  category?: string
  created_at: string
}
```

## Development

### Adding New Features

1. Update the database schema in `db/schema.sql`
2. Add new API endpoints in the `api/` directory
3. Create corresponding frontend components
4. Update the main App component to include new features

### Building for Production

```bash
# Build frontend
cd web
npm run build

# The backend can be deployed to Azure Functions
cd api
npm run build
```

## Example Usage

1. Open the app in your browser
2. Select a week start date
3. Add 5 bullet items with emojis and descriptions
4. Optionally add categories to organize your accomplishments
5. Save the entry
6. View your streak and previous entries
7. Get AI insights for motivation

Example entry:
```
⚖️ Lost 5 pounds [health]
🚗 Got oil change [car]
💅 Nails done [health]
☎️ Called mom [relationships]
🎶 Went to Karaoke [social]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## License

MIT License - feel free to use this project for learning and building your own productivity apps!
