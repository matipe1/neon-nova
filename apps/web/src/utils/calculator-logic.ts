import type { CalculatorFormData, CalculationResult } from '../types/calculator';

export const calculateCost = (data: CalculatorFormData): CalculationResult => {
  // 1. Costo de Impresión 3D (sumando todas las piezas)
  const printingCost = (data.pieces || []).reduce((acc, piece) => {
    const costPerGram = (piece.costKgFilament || 0) / 1000;
    const grams = piece.grams || 0;
    return acc + (grams * costPerGram);
  }, 0);

  // 2. Costo de Insumos (sumando todos los insumos)
  const suppliesCost = (data.supplies || []).reduce((acc, item) => {
    const unitCost = item.unitCost || 0;
    const quantity = item.quantity || 0;
    return acc + (unitCost * quantity);
  }, 0);

  const totalMaterialCost = printingCost + suppliesCost;

  // 3. Tiempo total de impresión en horas
  const totalPrintHours = (data.pieces || []).reduce((acc, piece) => {
    const hours = piece.printHours || 0;
    const minutes = piece.printMinutes || 0;
    return acc + hours + (minutes / 60);
  }, 0);

  // 4. Costo de Energía
  const kwhPrice = data.kwhPrice || 0;
  const energyCost = totalPrintHours * kwhPrice;

  // 5. Costo Operacional / Desgaste de Impresora
  const machinePrice = data.machineAveragePrice || 0;
  const lifeSpan = data.machineLifeSpan || 1; // Evitar división por cero
  const hourlyWearCost = lifeSpan > 0 ? machinePrice / lifeSpan : 0;
  const operationalCost = totalPrintHours * hourlyWearCost;

  // 6. Costo de Marco Neón LED
  const ledCost = data.isLedFrame
    ? ((data.ledMtsAmount || 0) * (data.ledMtsPrice || 0)) + (data.powerSupplyUnitPrice || 0)
    : 0;

  // 7. Totales y Precios finales
  const productionSubtotal = totalMaterialCost + energyCost + operationalCost + ledCost;
  const margin = data.profitMargin > 0 ? data.profitMargin : 1;
  const recommendedPrice = productionSubtotal * margin;
  const netProfit = recommendedPrice - productionSubtotal;

  // MercadoLibre con ~16% de comisión (o la fórmula total / (1 - 0.16))
  const mlCommissionRate = 0.16;
  const mercadoLibrePrice = recommendedPrice / (1 - mlCommissionRate);

  return {
    printingCost,
    suppliesCost,
    totalMaterialCost,
    totalPrintHours,
    energyCost,
    operationalCost,
    ledCost,
    productionSubtotal,
    recommendedPrice,
    netProfit,
    mercadoLibrePrice,
  };
};
