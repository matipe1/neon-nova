'use client';

import { costCalculator } from "../lib/calculator-logic";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { budgetSchema, CostBudget } from "../lib/schemas";

export const useCalculator = () => {
    const { register, control, formState: { errors } } = useForm({
        resolver: zodResolver(budgetSchema),
        defaultValues: {
            costKgFilament: 18000,
            filamentGrams: 0,
            supplies: 0,
            printHours: 0,
            printMinutes: 0,
            kwhPrice: 150,
            machineAveragePrice: 1300000,
            machineLifeSpan: 5000,
            isLedFrame: false,
            ledMtsPrice: 0,
            ledMtsAmount: 0,
            powerSupplyUnitPrice: 0,
            profitMargin: 3,
        },
        mode: 'onChange',
    });

    const formData = useWatch({ control });
    const results = costCalculator(formData as CostBudget);

    return {
        register,
        results,
        errors,
        formData
    }
}