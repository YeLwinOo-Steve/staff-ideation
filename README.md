# Staff Ideation Website

![CI Workflow](https://github.com/YeLwinOo-Steve/staff-ideation/actions/workflows/ci.yml/badge.svg)
![Coverage Statements](./coverage/badge-statements.svg)
![Coverage Branches](./coverage/badge-branches.svg)
![Coverage Functions](./coverage/badge-functions.svg)
![Coverage Lines](./coverage/badge-lines.svg)

> Staff Ideation Website: https://staff-ideate.vercel.app

# User Manual - Staff Ideation Platform

## Introduction
The Staff Ideation Platform is a web application that allows staff members to share, discuss, and collaborate on ideas within an organization. This manual will guide you through using the platform effectively.

## Getting Started

### Accessing the Platform
1. Open your web browser
2. Navigate to the platform URL
3. Log in using your credentials (email and password)

### Main Features

#### 1. Viewing Ideas
- Browse all ideas on the main dashboard
- Filter ideas by department, category, or date
- Sort ideas by popularity, date, or status
- View detailed information about each idea

#### 2. Submitting Ideas
1. Click the "New Idea" button
2. Fill in the required fields:
   - Title
   - Description
   - Category
   - Department
3. Add any attachments if needed
4. Click "Submit"

#### 3. Interacting with Ideas
- Like/Vote on ideas
- Add comments to discuss ideas
- Report inappropriate content
- Follow ideas to receive updates

#### 4. Managing Your Profile
- Update your personal information
- Change your password
- View your submitted ideas
- Track your activity history

#### 5. Notifications
- Receive notifications when:
  - Someone comments on your idea
  - Your idea is published 

### Role-Specific Features

#### For QA Coordinators
- Review submitted ideas
- Manage department-specific content
- Generate department reports
- Monitor staff participation

#### For QA Managers
- System-wide moderation
- Manage categories
- View analytics and reports
- Configure system settings

## Troubleshooting
Common issues and solutions:
1. Can't log in?
   - Check your credentials
   - Clear browser cache
   - Contact IT support
2. Can't submit ideas?
   - Check your permissions
   - Ensure all required fields are filled
   - Try again later
3. Missing notifications?
   - Verify email address
   - Check spam folder 

___

# Technical Manual - Staff Ideation Platform

## Technology Stack
- Frontend: Next.js 15 (React)
- State Management: Zustand
- Styling: Tailwind CSS
- Testing: Jest & React Testing Library
- API Client: Axios

## Project Structure
```
staff-ideation/
├── app/                    # Next.js app directory
│   ├── components/         # Shared components
|   ├── reports/           # Reports feature 
│   ├── ideas/             # Ideas feature
|           ├── create/            # Idea create feature
|           ├── categories/        # Categories feature
|           ├── dashboard/         # Dashboard feature
|           ├── departments/       # Departments feature
|           ├── settings/          # Settings feature
|           └── users/             # User management
├── api/                    # API client and models
├── store/                  # Zustand store
├── test/                   # Test files
└── public/                 # Static assets
```

## Setup Instructions

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher
- Git

### Installation Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/YeLwinOo-Steve/staff-ideation.git
   cd staff-ideation
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:

>  Copy all credential data from `environment_vars.txt` file into `.env` file   
> Edit `.env` with your configuration:
 
   ```
   NEXT_PUBLIC_API_URL=your_api_url
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

1. Run development server:
   ```bash
   npm run dev
   ```
2. Run linting:
    ```bash
    npm run lint
    ```
3. Run prettier formatter:
   ```bash
   npm run pretty
   ```
4. Run tests:
   ```bash
   npm run test
   ```
5. Run code coverage:
   ```bash
   npm run test:coverage
   ```

## Architecture

### Frontend Architecture
- Pages and Routing
  - App Router (Next.js 15)
  - Server and Client Components
  - Dynamic Routes

- State Management
  - Zustand Store
  - API Store for Backend Communication
  - Persistent Storage for Auth

- Components
  - Atomic Design Pattern
  - Shared Components
  - Feature-specific Components

- Styling
  - DaisyUI plugin
  - Tailwind CSS

### API Integration
- Axios Instance Configuration
- Request/Response Interceptors
- Error Handling
- Type-safe API Calls

### Authentication Flow
1. User Login
2. Reset password
3. Change password
5. Protected Routes

## Testing Strategy
- Unit Tests
- UI Tests
- API Mock Tests
- Coverage Reports