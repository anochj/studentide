# StudentIDE
An online workspace for everyone.

## What is StudentIDE?
StudentIDE is an online workspace for educators and students. Educators can create projects and students can complete these projects in a locked-down virtual environment.

StudentIDE tries replicate a natural coding environment for students, whilst giving educators the tools they need to manage their students and projects. StudentIDE is currently in early development, but you can [try it out here](https://studentide.com).

## Why did I build StudentIDE?
I built StudentIDE to solve a problem I faced as a student and educator. Teachers would assign projects, and it would often require the student to download the starter files manually, configure my IDE, switch back and forth between the project instructions and my code, renaming my submission to match what they expect. It was all so cumbersome.
I wanted to build a tool that both benefited the educator and the student. All the educator has to do is create a simple project definition, and share it with their students. Student's can begin their project with a simple click. No hassle.

Educators are not limited however, they can:
- Choose the environment students work in (Python, Java, Node, etc.)
- Provide starter files for students to begin with.
- Set project instructions that students can easily access while working.
- Block extensions in the student's IDE, to prevent distractions and cheating. (Like Cursor, or Github Copilot)
- See submissions from students in a single place.

## Technologies Used
### General
- **Turborepo** - A monorepo tool, used to manage the multiple packages and applications in this repository.
- **TypeScript** - A typed superset of JavaScript, used for all applications and packages in this repository.
- **Docker** - A containerization platform, used to run the applications in this repository in production.
- **Bun** - A JavaScript runtime, often used as a faster alternative to Node.js, used to run the applications in this repository in development.

### Frontend
- **Next.js** - A fullstack react framework, I chose this for the simplicity to develop and deploy applications.
- **Tailwind CSS** - A styling framework, also chosen for simplicity.
- **Better Auth** - An authentication library, used to handle user authentication and management.
- **Vercel** - A cloud platform, used to deploy the frontend application. Chosen for it's simplicity and seamless integration with Next.js.

### Backend
- **AWS** - A cloud platform, used to deploy the backend application. Chosen for it's wide range of services and scalability.
- **AWS Lambda** - Used for serverless functions invoked by ECS tasks.
- **AWS ECS Tasks** - This is where the student workspaces are run, chosen for the scalability, ease of use, and separation it provides.
- **AWS EFS** - Ties in with ECS to provide persistent storage for student workspaces, used to store the files that students are actively working on.
- **AWS ECR** - Used to store the Docker images for the ECS tasks, like the student's IDE environment, and others.
- **AWS S3** - Used for storing project files, like starter files, submissions, etc.
- **Supabase** - Used the PostgreSQL database for the backend, chosen for its simplicity and ease of use.
- **Cloudflare DNS** - Used for DNS management, ECS tasks are registered here to allow for subdomains for student workspaces.

I also integrated Google and Github OAuth providers for authentication, using Better Auth's built in support for these providers.

## How does it work?
1. Project definitions are created by the educator, and stored in the database. 
2. Educators can share the link to the project, and the students can visit the project.
3. Students 'Launch Workspace', which creates a new ECS task for the student, and registers a subdomain for the task in Cloudflare.
4. The student can then access their workspace through the subdomain, and work on the project.
5. When the student is done, they can submit their work, which saves the files to S3, and the educator can view the submission.

## Future Plans
[x] Add support for more environment types, like PyGame, Machine Learning, Rust, etc.
[x] Add word-level tracking changes, so educators can see how students are progressing through the project.
[x] Add support for educators to create their own custom environment types, by providing a Dockerfile or entrypoint.sh.
[x] Add support for educators to view the live workspace of their students, to provide better support and feedback.
[x] Add support for educators to set up automated tests for their projects, and run these tests