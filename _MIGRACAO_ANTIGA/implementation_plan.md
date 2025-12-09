# Implementation Plan - SAVe Frontend Migration

## Goal
Complete the migration of the SAVe frontend to Svelte, implementing all missing screens and the dynamic navigation logic (Brief vs Complete version).

## User Review Required
- [ ] Confirm the exact list of screens for "Brief" vs "Complete" versions. (I will assume a standard set for now based on the report).

## Proposed Changes

### Frontend Structure
- Create a `components/sections` directory to hold individual form sections.
- Refactor `CaseDetail.svelte` to use these components and handle navigation.

### Navigation Logic
- Implement a `Navigation` component that takes the `formType` (Brief/Complete) as a prop.
- "Brief" version will show a subset of screens.
- "Complete" version will show all screens.

### New Components (Sections)
#### [NEW] `src/components/sections/`
- `DadosEntrada.svelte`
- `Identificacao.svelte`
- `SituacaoJuridica.svelte`
- `Saude.svelte`
- `Territorio.svelte`
- `Assistencia.svelte`
- `EnsinoTrabRenda.svelte`
- `Vinculos.svelte`
- `ProtecaoSeguranca.svelte`
- `Agressor.svelte`
# Implementation Plan - SAVe Frontend Migration

## Goal
Complete the migration of the SAVe frontend to Svelte, implementing all missing screens and the dynamic navigation logic (Brief vs Complete version).

## User Review Required
- [ ] Confirm the exact list of screens for "Brief" vs "Complete" versions. (I will assume a standard set for now based on the report).

## Proposed Changes

### Frontend Structure
- Create a `components/sections` directory to hold individual form sections.
- Refactor `CaseDetail.svelte` to use these components and handle navigation.

### Navigation Logic
- Implement a `Navigation` component that takes the `formType` (Brief/Complete) as a prop.
- "Brief" version will show a subset of screens.
- "Complete" version will show all screens.

### New Components (Sections)
#### [NEW] `src/components/sections/`
- `DadosEntrada.svelte`
- `Identificacao.svelte`
- `SituacaoJuridica.svelte`
- `Saude.svelte`
- `Territorio.svelte`
- `Assistencia.svelte`
- `EnsinoTrabRenda.svelte`
- `Vinculos.svelte`
- `ProtecaoSeguranca.svelte`
- `Agressor.svelte`
- `Vitimizacao.svelte`
- `SinteseAnalitica.svelte`
- `Acompanhamento.svelte`
- `Encerramento.svelte`

## Case Management Features

### Backend Changes
#### [MODIFY] [cases.go](file:///c:/Users/User/Desktop/SAVe_Svelt%20e%20GoLang/Tabelas%20SAVe/SAVe_New/backend/internal/handlers/cases.go)
- Implement `DeleteCase` function.
- Implement `ArchiveCase` function (Update Encerrado='Sim' and save Encerramento data).
- Ensure `CreateCase` returns the correct ID and handles errors gracefully.
- Add admin role check in `DeleteCase`.

#### [MODIFY] [main.go](file:///c:/Users/User/Desktop/SAVe_Svelt%20e%20GoLang/Tabelas%20SAVe/SAVe_New/backend/cmd/server/main.go)
- Register `DELETE /cases/:id` route.
- Register `POST /cases/:id/archive` route.

3. **Delete Case (User):** Log in as User, verify "Delete" button is NOT visible.

### Backend Updates (If needed)
- Ensure API endpoints exist for saving data for each section. (Currently using a generic `updateCase` or specific section endpoints? I'll need to check `cases.go`).

## Verification Plan
### Automated Tests
- None planned for this phase.

### Manual Verification
- Open a case.
- Toggle between Brief and Complete modes.
- Verify correct tabs are shown.
- Navigate to each new tab and verify fields are present.
- Save data in each tab and verify persistence (using Mock Mode if backend unavailable).
