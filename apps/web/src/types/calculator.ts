export interface PrintPieceInput {
    id: string;
    name: string;             // ej: "Base", "Tapa / Difusor"
    costKgFilament: number;   // Precio $/kg del filamento
    grams: number;            // Gramos de filamento
    printHours: number;       // Horas de impresión
    printMinutes: number;     // Minutos de impresión
}

export interface SupplyItemInput {
    id: string;
    name: string;             // ej: "Tornillos M3", "Imán 5x2"
    unitCost: number;         // Costo unitario ($)
    quantity: number;         // Cantidad (default 1)
}

export interface CalculatorFormData {
    // Piezas de Impresión 3D
    pieces: PrintPieceInput[];

    // Insumos Varios
    supplies: SupplyItemInput[];

    // Energía y Desgaste Máquina
    kwhPrice: number;
    machineAveragePrice: number;
    machineLifeSpan: number;

    // Cartel LED Neón
    isLedFrame: boolean;
    ledMtsAmount?: number;
    ledMtsPrice?: number;
    powerSupplyUnitPrice?: number;

    // Margen Comercial
    profitMargin: number; // Multiplicador (ej: 3 para margen x3)
}

export interface CalculationResult {
    printingCost: number;        // Costo de filamentos
    suppliesCost: number;        // Costo de insumos
    totalMaterialCost: number;   // filamentos + insumos
    totalPrintHours: number;     // Tiempo total en horas
    energyCost: number;          // Costo de energía
    operationalCost: number;     // Costo de desgaste de máquina
    ledCost: number;             // Costo de LED (tira + fuente)
    productionSubtotal: number;  // Costo total de producción (base)
    recommendedPrice: number;    // Precio sugerido (Subtotal * profitMargin)
    netProfit: number;           // Ganancia neta (recommendedPrice - productionSubtotal)
    mercadoLibrePrice: number;   // Precio en MercadoLibre (con ~16% de comisión)
}
