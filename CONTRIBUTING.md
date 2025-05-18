# Contributing to DigitalOcean AI Agent Discord Bot

Thank you for considering contributing to this project! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How Can I Contribute?

### Reporting Bugs

Before submitting a bug report:

- Check the issue tracker to see if the bug has already been reported
- If not, create a new issue with a clear title and description
- Include steps to reproduce the bug
- Include any relevant logs or screenshots
- Specify your environment (Node.js version, operating system, etc.)

### Suggesting Enhancements

Enhancement suggestions are always welcome! To suggest an enhancement:

- Check if the enhancement has already been suggested
- Create a new issue with a clear title and description
- Explain why this enhancement would be useful
- Consider including mock-ups or examples of how the enhancement would work

### Pull Requests

1. Fork the repository
2. Create a new branch from `main` or `master`
3. Make your changes
4. Run tests and linting to ensure code quality
5. Submit a pull request with a clear description of the changes

#### Pull Request Process

1. Update the README.md or documentation with details of changes if necessary
2. Ensure all tests pass and linting standards are met
3. The pull request will be reviewed by the maintainers
4. Once approved, it will be merged into the main branch

## Development Setup

1. Clone your fork of the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on the template
4. For local development:
   ```bash
   npm run dev
   ```
5. For Docker development:
   ```bash
   docker-compose up
   ```

## Style Guide

This project uses ESLint to enforce a consistent code style. Please ensure your code follows these standards by running:

```bash
npm run lint
```

### TypeScript Guidelines

- Use proper type annotations whenever possible
- Avoid using `any` type
- Document public methods and functions with JSDoc comments
- Use meaningful variable and function names

## Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests after the first line

## Questions?

If you have any questions about contributing, please open an issue or contact the maintainers.

Thank you for contributing to the project!
