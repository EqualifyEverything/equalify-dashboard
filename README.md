# Equalify

Equalify is an open-source project aimed at enhancing web accessibility, providing tools and features to make digital content accessible to individuals with disabilities.

## Features

- **A11Y-First Design**: Prioritizes accessibility to ensure that a wide range of users can navigate and interact with web content effectively.
- **Customizable Reporting**: Offers tools to monitor accessibility issues across digital properties, aiding in proactive management.
- **Property-Wide Scans**: Capable of scanning and analyzing web pages, PDFs, and other digital content for accessibility issues, facilitating compliance with accessibility standards.

## Getting Started

### Prerequisites

- Node.js (version 20.x or higher recommended)
- npm (version 10.x or higher) or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/EqualifyEverything/equalify-frontend.git
   ```
2. **Navigate to the project directory**:
   ```bash
   cd equalify-frontend
   ```
3. **Install dependencies**:
   ```bash
   npm install
   # or, using yarn
   yarn install
   ```
4. **Set up environment variables**:
   - Copy `.env.example` to `.env` and fill in your configuration details. This file contains necessary configurations for AWS Amplify and other services.
   ```bash
   cp .env.example .env
   ```
5. **Start the development server**:
   ```bash
    npm run start:staging
    # or, using yarn
    yarn start:staging
   ```
6. **Open the application in your browser**:

   - Navigate to `http://localhost:5173` to view the application.

 ## Contributing

We welcome contributions to Equalify! Whether it's submitting a bug report, proposing a feature, or contributing code, please read our [contributing guidelines](https://github.com/EqualifyEverything/equalify/blob/main/CONTRIBUTE.md) before submitting your work.
