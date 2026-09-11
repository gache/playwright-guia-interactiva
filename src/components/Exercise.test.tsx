import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Exercise } from './Exercise';

describe('Exercise', () => {
  it('shows the task and reveals the solution on demand', () => {
    render(
      <Exercise
        title="Ejercicio 1 (Acciones) — Formulario de registro"
        taskHtml="Completa el formulario con <strong>Nombre completo</strong>."
        solution={{ label: 'Solución', langClass: 'ts', code: "await page.getByLabel('Nombre').fill('Ana');" }}
      />,
    );
    expect(screen.getByText('Ejercicio 1 (Acciones) — Formulario de registro')).toBeInTheDocument();
    expect(screen.queryByText(/getByLabel/)).not.toBeVisible();
    fireEvent.click(screen.getByText('Ver solución'));
    expect(screen.getByText(/getByLabel/)).toBeVisible();
  });
});
