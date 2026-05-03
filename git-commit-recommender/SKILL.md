---
name: git-commit-recommender
description: Recommends concise, hyphenated git commit messages with category prefixes (e.g., feat/, fix/, refactor/) based on project-specific conventions.
---

# Git Commit Recommender

Use this skill to generate or recommend git commit messages that align with the established project style.

## Style Guidelines

The project uses a specific hyphenated-case style with category prefixes:

- **Format**: `<category>/<hyphenated-description>`
- **Casing**: All lowercase.
- **Hyphenation**: Use hyphens (`-`) to separate words in the description.
- **Prefixes**:
  - `feat/`: New features.
  - `fix/`: Bug fixes.
  - `refactor/`: Code improvements without behavior changes.
  - `enhancement/`: Improvements to existing features.
  - `sec/`: Security-related fixes or hardening.
  - `doc/`: Documentation updates.

## Workflow

1. **Analyze Changes**: Run `git status` and `git diff HEAD` to understand the impact of the changes.
2. **Determine Category**: Choose the most appropriate prefix from the list above.
3. **Draft Description**: Summarize the core change in a concise, hyphenated string.
4. **Final Recommendation**: Combine the category and description.

## Examples

- `feat/uptime-kuma-global-status`
- `fix/vite-env-vars-at-runtime`
- `refactor/monitor-lookup-optimization-and-log-noise-reduction`
- `sec/addressed-sec-and-type-safety-concerns`
- `enhancement/added-logging-for-uptime-kuma-initialization`
- `feat/add-ability-to-click-pill-to-go-to-status-page`
