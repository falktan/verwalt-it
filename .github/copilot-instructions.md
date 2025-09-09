# verwalt-it - German Administrative Web Application

Verwalt-it is a German Node.js/Express web application for administrative form submissions, specifically designed for thesis registration ("Anmeldung zur Abschlussarbeit"). The application provides a form submission workflow with email notifications and supervisor confirmation.

**ALWAYS follow these instructions first and only use search or additional commands when encountering unexpected behavior that conflicts with the documented procedures.**

## Working Effectively

### Bootstrap and Install Dependencies
```bash
npm install --omit=dev
```
- Takes under 5 seconds. NEVER CANCEL.
- The `--omit=dev` flag is REQUIRED to avoid MongoDB installation issues in restricted environments
- Installing with just `npm install` works but takes ~10 seconds and includes dev dependencies

### Start the Application
**ALWAYS use the mock database configuration for development and testing:**
```bash
USE_MOCK_DB=true npm start
```
- Starts instantly (under 2 seconds). NEVER CANCEL.
- Application runs on port 3000 by default (or PORT environment variable)
- Shows "Using Mock MongoDB" message when started correctly
- Application serves static frontend files from `public/` directory

### Verify Application is Working
Test the health endpoint:
```bash
curl -s http://localhost:3000/api/health | jq .
```
Should return: `{"status": "ok", "timestamp": "..."}`

### Manual Validation - CRITICAL
**ALWAYS manually test the complete user workflow after making changes:**

1. **Homepage Test**: Navigate to `http://localhost:3000`
   - Should show "Willkommen in der digitalisierten Verwaltung" 
   - Should have logo and navigation to form

2. **Form Submission Test**: Navigate to `http://localhost:3000/form/`
   - Fill in form fields: Vorname, Nachname, Email des Betreuers
   - Check privacy checkbox ("Datenschutzerklärung")
   - Click "Absenden" button
   - Should show JSON response with success message and generated token

3. **Confirmation Test**: Use the token from step 2
   - Navigate to `http://localhost:3000/form/confirm?token=<TOKEN>`
   - Should display submitted form data for review
   - Click "Bestätigen" button
   - Should show success alert message

## Database Configuration Options

The application supports three database modes:

### Mock Database (RECOMMENDED)
```bash
USE_MOCK_DB=true npm start
```
- Works in all environments including restricted networks
- Data stored in memory only (lost on restart)
- Use this for development and testing

### In-Memory MongoDB (FAILS in restricted environments)
```bash
USE_IN_MEMORY_DB=true npm start
```
- **DOES NOT WORK** in GitHub Copilot environments or restricted networks
- Fails with: `getaddrinfo ENOTFOUND fastdl.mongodb.org`
- Requires internet access to download MongoDB binaries

### Real MongoDB (Requires configuration)
```bash
MONGODB_URL="mongodb://localhost:27017/verwalt" npm start
```
- Fails without proper MONGODB_URL environment variable
- Error: `Cannot read properties of undefined (reading 'startsWith')`

## Key API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/submit-form` - Submit thesis registration form
- `POST /api/get-form-data` - Retrieve form data by token (for confirmation page)

## Repository Structure

```
├── app.js              # Main Express server entry point
├── package.json        # Dependencies and scripts
├── api/                # Backend API modules
│   ├── index.js        # Express routes
│   ├── dataStore.js    # Database operations
│   ├── dbConnect.js    # Database connection logic
│   ├── mockDatabase.js # In-memory mock database
│   └── renderEmail.js  # Email template rendering
└── public/             # Static frontend files
    ├── index.html      # Homepage
    ├── main.js         # Homepage JavaScript
    ├── style.css       # Global styles
    ├── assets/         # Images and assets
    │   └── logo.png    # Application logo
    └── form/           # Thesis registration form
        ├── index.html  # Form page
        ├── main.js     # Form submission logic
        ├── confirm.html# Confirmation page
        ├── confirm.js  # Confirmation page logic
        └── datenschutzerklaertung/
            └── index.html # Privacy policy
```

## Environment Variables

- `USE_MOCK_DB=true` - Enable mock database (recommended)
- `USE_IN_MEMORY_DB=true` - Enable in-memory MongoDB (fails in restricted environments)
- `MONGODB_URL` - Real MongoDB connection string
- `BASE_URL` - Base URL for email links (optional, used in email templates)
- `PORT` - Server port (defaults to 3000)

## Common Commands and Timings

| Command | Expected Time | Timeout | Notes |
|---------|---------------|---------|-------|
| `npm install --omit=dev` | < 5 seconds | 60 seconds | REQUIRED flag for restricted environments |
| `npm install` | ~10 seconds | 120 seconds | Includes dev dependencies |
| `USE_MOCK_DB=true npm start` | < 2 seconds | 30 seconds | Recommended startup method |
| `curl http://localhost:3000/api/health` | < 1 second | 10 seconds | Health check |

## Troubleshooting

### Application Won't Start
- **Error: "Cannot find package 'mongodb-memory-server'"**
  - Use `npm install --omit=dev` instead of `npm install`
  - Always use `USE_MOCK_DB=true` for development

- **Error: "Cannot read properties of undefined (reading 'startsWith')"**
  - Missing MONGODB_URL environment variable
  - Use `USE_MOCK_DB=true npm start` instead

### Network/Download Errors
- **Error: "getaddrinfo ENOTFOUND fastdl.mongodb.org"**
  - In-memory MongoDB cannot download binaries
  - Use mock database: `USE_MOCK_DB=true npm start`

### Testing Failures
- Always test the complete workflow: homepage → form → submission → confirmation
- Form requires all fields filled and privacy checkbox checked
- Confirmation requires valid token from previous submission

## Development Guidelines

- Frontend uses vanilla JavaScript (no build process required)
- Backend uses ES modules (`"type": "module"` in package.json)
- No linting, testing, or build tools configured
- Static files served directly from `public/` directory
- Uses Pico CSS framework via CDN for styling
- Form submission via fetch API with JSON payloads
- Database abstraction allows swapping between mock, in-memory, and real MongoDB

## Critical Reminders

- **ALWAYS use `USE_MOCK_DB=true npm start`** for development
- **NEVER attempt to use in-memory or real MongoDB** without proper setup
- **ALWAYS test complete user workflows** after making changes
- **Form validation happens client-side** - server accepts any JSON payload
- **Email functionality is simulated** - emails are returned as JSON responses
- **No authentication or authorization** is implemented