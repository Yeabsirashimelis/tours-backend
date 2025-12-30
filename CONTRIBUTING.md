# Contributing to Natours API

Thank you for considering contributing to the Natours API! This document provides guidelines for contributing to the project.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
   ```bash
   git clone https://github.com/your-username/natours-api.git
   cd natours-api
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Set up environment variables**
   ```bash
   cp .env.example config.env
   # Edit config.env with your settings
   ```

## Development Workflow

### Creating a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests

### Making Changes

1. **Write clean, readable code** following the existing code style
2. **Add tests** for new features or bug fixes
3. **Update documentation** if you're changing functionality
4. **Keep commits atomic** - one logical change per commit
5. **Write meaningful commit messages**

### Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(tours): add filtering by location radius

fix(auth): resolve JWT token expiration issue

docs(readme): update installation instructions
```

### Running Tests

Before submitting your changes, make sure all tests pass:

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Check test coverage
npm run test:coverage
```

### Code Style

- Use **ES6+ features** where appropriate
- Follow **ESLint** rules (see `.eslintrc.json`)
- Use **meaningful variable names**
- Add **comments** for complex logic
- Keep functions **small and focused**

### Testing Guidelines

- Write tests for all new features
- Maintain test coverage above 80%
- Use descriptive test names
- Test both success and error cases
- Mock external dependencies

## Submitting Changes

### Pull Request Process

1. **Update your branch** with the latest changes from main:
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-branch
   git rebase main
   ```

2. **Push your changes** to your fork:
   ```bash
   git push origin your-branch
   ```

3. **Create a Pull Request** on GitHub:
   - Use a clear, descriptive title
   - Describe what changes you made and why
   - Reference any related issues
   - Include screenshots for UI changes

4. **Respond to feedback** from code reviewers

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- List specific changes
- Use bullet points

## Testing
Describe how you tested your changes

## Checklist
- [ ] My code follows the project's code style
- [ ] I have added tests that prove my fix/feature works
- [ ] All new and existing tests pass
- [ ] I have updated the documentation
- [ ] My commits have meaningful messages
```

## Reporting Bugs

### Before Submitting a Bug Report

- Check if the bug has already been reported
- Verify you're using the latest version
- Try to reproduce the bug with minimal steps

### Bug Report Template

```markdown
**Describe the bug**
Clear description of what the bug is

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen

**Screenshots**
If applicable, add screenshots

**Environment:**
- OS: [e.g., Windows 10]
- Node version: [e.g., 18.0.0]
- npm version: [e.g., 9.0.0]

**Additional context**
Any other relevant information
```

## Suggesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
Clear description of what you want to happen

**Describe alternatives you've considered**
Other solutions you've thought about

**Additional context**
Any other relevant information, mockups, etc.
```

## Code Review Process

1. At least one maintainer must approve your PR
2. All automated checks (tests, linting) must pass
3. Address all review comments
4. Once approved, a maintainer will merge your PR

## Community Guidelines

- Be respectful and welcoming
- Help others when you can
- Provide constructive feedback
- Follow the [Code of Conduct](CODE_OF_CONDUCT.md)

## Questions?

If you have questions about contributing, feel free to:
- Open an issue with the `question` label
- Reach out to maintainers
- Check existing documentation

## Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort! 🎉
