import { UseFormRegister, FieldErrors } from "react-hook-form";
import { CostBudget } from "@/src/lib/schemas";
import { InputGroup } from "./InputGroup";

interface Props {
  register: UseFormRegister<CostBudget>;
  errors: FieldErrors<CostBudget>;
}

export function OperationalSection({ register, errors }: Props) {
    return (
    <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-300 border-slate-600 border-b pb-2">
        Costo Operacional
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputGroup
            label="Costo de Impresora"
            registration={register("machineAveragePrice", { valueAsNumber: true })}
            error={errors.machineAveragePrice?.message}
            prefix="$"
        />
        <InputGroup
            label="Vida útil de Impresora"
            registration={register("machineLifeSpan", { valueAsNumber: true })}
            error={errors.machineLifeSpan?.message}
            prefix="hs"
        />
        </div>
    </div>
    );
}