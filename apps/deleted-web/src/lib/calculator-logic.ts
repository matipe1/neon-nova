import { CostBudget } from "./schemas";

export interface CalculationResult {
    subtotal: number;
    total: number;
    mercadoLibreTotal: number;
    breakdown: {
        printingCost: number;
        energyCost: number;
        operationalCost: number;
        ledCost: number;
    }
}

export const costCalculator = (data: CostBudget): CalculationResult => {
    const printingCost = ((data.costKgFilament / 1000) * data.filamentGrams) + data.supplies;

    const printTime = data.printHours + (data.printMinutes / 60);
    const energyCost = (printTime) * data.kwhPrice;

    const machineCost = (data.machineAveragePrice / data.machineLifeSpan);
    const operationalCost = machineCost * printTime;

    const ledCost = (data.ledMtsPrice! * data.ledMtsAmount!) + data.powerSupplyUnitPrice!;

    // Results
    const finalCost = printingCost + energyCost + operationalCost;
    const subtotal = (!data.isLedFrame) ? finalCost : finalCost + ledCost;
    const total = subtotal * data.profitMargin;
    const mercadoLibreTotal = total / (1 - 0.16); // ~16%

    return {
        subtotal,
        total,
        mercadoLibreTotal,
        breakdown: {
            printingCost,
            energyCost,
            operationalCost,
            ledCost
        }
    };
}