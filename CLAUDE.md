# CLAUDE.md

## Stack
- Backend: TBD
- Frontend: React + TypeScript + Vite
- Forms/Validation: react-hook-form + zod
- Database: TBD
- Testing: Vitest + @testing-library/react

## Conventions
- Commit format: Conventional Commits (feat, fix, docs, chore, etc.)
- Code style: TBD
- Branching: main + feature branches

## Commands
- `npm run dev` — start dev server
- `npm test` — run tests

## Project Rules
(Learned from the vague-vs-precise prompting drill — see WORKFLOW.md for the full comparison.)

1. **Forms use `react-hook-form` + `zod` schemas — never raw `useState` with manual `if` checks for validation.** Keep the zod schema in its own file (e.g. `settingsSchema.ts`), not inline in the component.
2. **Every input with a validation error must set `aria-invalid="true"` and `aria-describedby` pointing to that field's error message id.** Errors should trigger on blur or submit, not on every keystroke.
3. **Any async action (save, submit, fetch) must show three explicit states — idle, loading (disabled button + changed label, e.g. "Saving..."), and error/success — never a silent `try/catch` with no visible feedback.**
4. **Every new feature must ship with at least one automated test covering its core validation/error paths before being considered done.** Vague prompts without a "write tests and run them" instruction have produced incomplete or entirely missing implementations — always include an explicit verification step in prompts.