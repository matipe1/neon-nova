import { z } from 'zod';

export const budgetSchema = z.object({
  filamentGrams: z.number("Ingresar un número").min(1, "Ingresa al menos 1g"),
  costKgFilament: z.number("Ingresar un número").min(1, "El precio debe ser mayor a 0"),
  supplies: z.number("Ingresar un número").min(0),
  
  printHours: z.number("Ingresar un número").min(0),
  printMinutes: z.number("Ingresar un número").min(0).max(59, "Minutos entre 0 y 59"),
  kwhPrice: z.number("Ingresar un número").min(0, "Precio KWh inválido"),
  
  machineAveragePrice: z.number("Ingresar un número").min(1, "Precio de máquina requerido"),
  machineLifeSpan: z.number("Ingresar un número").min(1, "Vida útil requerida"),

  isLedFrame: z.boolean(), // Campos = opcionales || cero
  ledMtsPrice: z.number("Ingresar un número"),
  ledMtsAmount: z.number("Ingresar un número"),
  powerSupplyUnitPrice: z.number(),
  
  profitMargin: z.number("Ingresar un número").min(1, "El margen debe ser al menos 1 (Costo)"),
});

export type CostBudget = z.infer<typeof budgetSchema>;