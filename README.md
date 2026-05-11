# StudentIDE
*A scalable, cloud-based IDE and project management platform for computer science education.*

[Live Demo](https://studentide.com)

## Overview
StudentIDE is a full-stack virtual coding environment designed to eliminate local setup bottlenecks. It provides educators with robust project management tools and gives students instant access to pre-configured, locked-down virtual workspaces. 

## The Problem & The Solution
**The Problem:** Traditional coding assignments require students to manually download starter files, configure their local IDEs, manage dependencies, and adhere to strict file-naming conventions. This leads to "environment fatigue" and wastes valuable instructional time.

**The Solution:** I built StudentIDE to abstract away environment configuration. Educators create a single project definition, and students launch a fully configured, containerized development environment with a single click.

**Key Features for Educators:**
- **Custom Environments:** Provision workspaces in Python, Java, Node.js, and more.
- **Seamless Distribution:** Distribute starter files and project instructions directly within the workspace.
- **Integrity Controls:** Restrict IDE extensions (e.g., GitHub Copilot, Cursor) to prevent unauthorized assistance.
- **Centralized Dashboard:** Collect and review all student submissions in one place.

## Technical Stack & Architecture

### Core & Infrastructure
- **AWS ECS (Elastic Container Service):** Orchestrates isolated, scalable student workspaces.
- **AWS ECR & EFS:** ECR manages the custom Docker images for the IDE environments, while EFS provides persistent, attached storage for active student sessions.
- **AWS S3:** Handles secure cloud storage for starter files and final project submissions.
- **AWS Lambda:** Executes event-driven, serverless backend functions.
- **Cloudflare DNS:** Dynamically registers and manages subdomains for active ECS tasks, routing students to their specific workspaces.
- **Docker:** Containerizes the core applications and student environments.

### Frontend
- **Next.js & React:** Powers a fast, server-side rendered user interface.
- **Tailwind CSS:** Delivers a responsive, highly customizable styling system.
- **Vercel:** Manages the CI/CD pipeline and global edge deployment for the frontend.

### Backend & Tooling
- **Supabase (PostgreSQL):** Relational database managing users, project metadata, and session state.
- **Better Auth:** Handles secure authentication, including Google and GitHub OAuth integrations.
- **Turborepo:** Optimizes the monorepo structure, managing dependencies and build pipelines across multiple packages.
- **TypeScript & Bun:** Ensures end-to-end type safety across the stack, utilizing Bun for rapid local development execution.
- **Github Actions:** For CI/CD pipeline automation, including production deployments.

## System Workflow
1. **Provisioning:** An educator creates a project definition, which is serialized and stored in Supabase.
2. **Distribution:** The platform generates a unique project link to share with students.
3. **Execution:** Upon clicking "Launch Workspace," the backend triggers an AWS ECS task. Cloudflare dynamically registers a unique subdomain routed to this specific container.
4. **Development:** The student accesses their isolated, browser-based IDE via the generated subdomain.
5. **Submission:** Upon completion, the workspace state and files are securely packaged and uploaded to AWS S3 for educator review.

## Product Roadmap
- [ ] **Expanded Runtimes:** Add support for PyGame, Rust, and Machine Learning environments.
- [ ] **Custom Dockerfiles:** Allow educators to define bespoke environments via custom `Dockerfile` or `entrypoint.sh` uploads.
- [ ] **Real-Time Auditing:** Implement word-level keystroke tracking to help educators visualize student progress and verify academic integrity.
- [ ] **Live Collaboration:** Enable educators to drop into active student workspaces for real-time support and feedback.
- [ ] **Automated CI/CD Grading:** Allow educators to define automated test suites that run against student submissions upon completion.