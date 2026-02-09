'use client';

import { useCalculator } from "@/src/hooks/useCalculator";
import { MaterialSection } from "./sections/MaterialSection";
import { TimeEnergySection } from "./sections/TimeEnergySection";
import { OperationalSection } from "./sections/OperationalSection";
import { LedSection } from "./sections/LedSection";
import { ProfitSection } from "./sections/ProfitSection";
import { ResultsPanel } from "./ResultsPanel";

export function CalculatorForm() {
    const { register, results, errors, formData } = useCalculator();

    return (
        <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Inputs */}
            <div className="lg:col-span-2 space-y-8 bg-slate-900 text-white p-6 rounded-xl shadow-2xl border border-slate-800">
                <h2 className="text-2xl font-black text-white mb-6">
                    Nueva Cotización
                </h2>
                
                <MaterialSection register={register} errors={errors} />
                <LedSection register={register} errors={errors} isLedFrame={formData.isLedFrame} />
                <TimeEnergySection register={register} errors={errors} />
                <OperationalSection register={register} errors={errors} />
                <ProfitSection register={register} errors={errors} />
            </div>

            {/* Resumen */}
            <div className="lg:col-span-1">
                <ResultsPanel results={results} profitMargin={formData.profitMargin} />
            </div>
        </div>
    );
}