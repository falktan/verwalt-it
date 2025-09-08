# Verwalt-It - German Administrative Forms System

Verwalt-It is a Node.js web application for providing forms and workflows for German administrations. It uses Express.js with ES modules, MongoDB Memory Server for development, and a simple HTML/CSS/JavaScript frontend with Pico CSS framework.

**Always reference these instructions first** and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Prerequisites and Setup
- Ensure Node.js v20.19.4+ and npm v10.8.2+ are available
- Run setup commands with appropriate timeouts:
  ```bash
  npm install  # Takes ~7-11 seconds. Set timeout to 30+ seconds.
  ```

### Building and Running
- **No build process required** - this is a pure Node.js application with static frontend files
- Start the application:
  ```bash
  npm start  # Starts server on port 3000. NEVER CANCEL. Set timeout to 120+ seconds due to MongoDB setup.
  ```
- **CRITICAL MongoDB Memory Server Limitation**: The application uses MongoDB Memory Server which requires downloading MongoDB binaries from `fastdl.mongodb.org`. In network-restricted environments, this will fail with `ENOTFOUND fastdl.mongodb.org` error.

### Network Restrictions Workaround
When MongoDB Memory Server cannot download binaries, create a mock database for testing:
1. Backup the original: `cp api/dbConnect.js api/dbConnect.js.original`  
2. Replace `api/dbConnect.js` with mock implementation that logs operations to console
3. Application will start successfully and be fully functional for testing
4. Restore original after testing: `cp api/dbConnect.js.original api/dbConnect.js`

### Application Structure
- `app.js` - Main Express server entry point
- `api/` - Backend API routes and database logic
- `public/` - Static frontend files (HTML, CSS, JS)
- `package.json` - Dependencies and npm scripts

## Validation and Testing

### Manual Validation Required
Always test these complete user scenarios after making changes:

1. **Health Check Validation**:
   ```bash
   curl http://localhost:3000/api/health
   # Expected: {"status":"ok","timestamp":"..."}
   ```

2. **Homepage Access**:
   ```bash
   curl http://localhost:3000/
   # Expected: HTML page with "Willkommen in der digitalisierten Verwaltung"
   ```

3. **Form Page Access**:
   ```bash
   curl http://localhost:3000/form/
   # Expected: HTML form with "Anmeldung der Abschlussarbeit"
   ```

4. **Complete Form Submission Flow**:
   ```bash
   curl -X POST -H "Content-Type: application/json" \
     -d '{"vorname":"Test","nachname":"User","email":"supervisor@university.edu","privacy":"on"}' \
     http://localhost:3000/api/submit-form
   # Expected: JSON response with success message and email details
   ```

### Security and Dependencies
- **CRITICAL**: The project has 12 critical security vulnerabilities in dependencies
- Run `npm audit` to see all vulnerabilities 
- DO NOT run `npm audit fix --force` as it will install breaking changes
- Document security vulnerabilities - they are not blocking for development/testing

## Key Endpoints and Functionality

### API Endpoints
- `GET /api/health` - Health check endpoint
- `POST /api/submit-form` - Form submission endpoint  
- `POST /api/get-form-data` - Retrieve form data by token

### Web Pages
- `/` - Homepage with navigation to form
- `/form/` - Main thesis registration form
- `/form/confirm` - Confirmation page (with token parameter)
- `/form/datenschutzerklaertung/` - Privacy policy page

### Form Fields
The thesis registration form includes:
- `vorname` - First name (text)
- `nachname` - Last name (text) 
- `email` - Supervisor email (email)
- `privacy` - Privacy policy acceptance (required checkbox)

## Development Commands and Timing

### Standard Operations
```bash
# Install dependencies (7-11 seconds)
npm install  # Set timeout: 30+ seconds

# Start development server (with MongoDB setup: up to 2 minutes)  
npm start  # Set timeout: 120+ seconds, NEVER CANCEL

# Check security vulnerabilities (instant)
npm audit

# Check current directory contents
ls -la
```

### File Locations
- Main server: `./app.js`
- API routes: `./api/index.js`
- Database connection: `./api/dbConnect.js` 
- Email templates: `./api/renderEmail.js`
- Data storage: `./api/dataStore.js`
- Frontend entry: `./public/index.html`
- Form page: `./public/form/index.html`
- Styles: `./public/style.css`

## Common Issues and Solutions

### Application Won't Start
- **Error**: `ENOTFOUND fastdl.mongodb.org`
- **Solution**: Use mock database workaround (see Network Restrictions section)
- **Do NOT**: Try to bypass with different MongoDB configurations

### Dependency Vulnerabilities  
- **Warning**: 12 critical vulnerabilities exist
- **Action**: Document but do not fix (breaking changes)
- **Monitor**: Check `npm audit` output for new vulnerabilities

### Environment Variables
- `PORT` - Server port (defaults to 3000)
- `BASE_URL` - Base URL for email links (undefined causes "undefined" in links)

## Testing Checklist

When making changes, always validate:
- [ ] `npm install` completes successfully
- [ ] `npm start` starts the server without errors  
- [ ] Health check endpoint returns proper JSON
- [ ] Homepage loads with correct German content
- [ ] Form page displays all required fields
- [ ] Form submission creates database entry and returns success
- [ ] Server logs show proper request handling
- [ ] No new console errors in browser (if testing UI)

## Repository Structure Quick Reference

```
.
├── README.md (basic German description)
├── package.json (dependencies and npm start script)
├── app.js (main Express server)
├── api/
│   ├── index.js (API routes)
│   ├── dataStore.js (database operations)
│   ├── dbConnect.js (MongoDB Memory Server setup) 
│   └── renderEmail.js (email template generation)
└── public/ (static files served by Express)
    ├── index.html (homepage)
    ├── style.css (custom styles)
    ├── main.js (homepage JavaScript)
    ├── assets/ (logos and images)
    └── form/ (form-related pages)
        ├── index.html (thesis registration form)
        ├── main.js (form JavaScript)
        ├── confirm.html (confirmation page)
        └── datenschutzerklaertung/ (privacy policy)
```

**Remember**: This is a German administrative application - content and user interfaces are in German. Form submissions are for thesis ("Abschlussarbeit") registration with supervisor email confirmation workflow.