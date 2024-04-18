# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2024-04-15
### Added
- Initial project scaffolding with Vite and React SPA setup for a streamlined development experience.
- Basic documentation, including `README.md` and `CHANGELOG.md`, to guide contributors and users.
- Semantic Versioning initiated at 0.1.0 to follow changes systematically.
- Routing configuration using React Router and React Query in `main.tsx` for SPA behavior and server state caching.
- Global styling and color scheme established using TailwindCSS in `globals.css` for a uniform look and feel.
- AWS Amplify configuration in `amplify.config.ts` to support authentication and API interactions securely.
- Global state management using Zustand with persistence in `store/globalstore.ts`, enhancing UX with consistent state.
- Unit and accessibility testing for `NotFound`, `Footer`, and `Header` components, ensuring compliance with WCAG standards and correct component rendering.


## [0.2.0] - 2024-04-17
### Added
- Comprehensive suite of authentication forms, including login, signup, and OTP verification, enhancing user onboarding and security.
- Account management page, allowing users to view their account details and delete their account, improving user control over personal data.
- New UI components such as Alerts, Buttons, and Dialogs with variant styling, broadening the toolkit for building intuitive user interfaces.
- Extended input components, introducing OTP and select functionality, for a more versatile form handling experience.
- Enhanced layout structure including an authentication-specific layout, refined RootLayout and MaxWidthWrapper, and dedicated Header and Footer components for improved navigation and site structure.
- Public and Protected route components to manage access control, ensuring a secure and user-specific navigation experience.
- Authentication slice in the store for managing user sessions and authentication state, centralizing user data management.
- Utility function for class name combination, facilitating more flexible styling approaches.
- Tailored tests for new features and components, ensuring reliability and maintainability of the growing codebase.
- Dependency updates and import refactorings to optimize the project's performance and development workflow.

### Changed
- Updated global CSS variables and Tailwind configuration to incorporate autofill styles, enhancing the visual coherence of form elements.

### Fixed
- Refactored import statements and route imports for clarity and consistency across the project.
