import { UseFormRegister, FieldErrors } from "react-hook-form";
import { CostBudget } from "@/src/lib/schemas";
import { InputGroup } from "./InputGroup";

interface Props {
  register: UseFormRegister<CostBudget>;
  errors: FieldErrors<CostBudget>;
}

export function ProfitSection({ register, errors }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-300 border-slate-600 border-b pb-2">
        Margen de Ganancia
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputGroup
          label="Multiplicador"
          registration={register("profitMargin", { valueAsNumber: true })}
          error={errors.profitMargin?.message}
          prefix="units"
        />
        <div className="space-y-2 sm:col-span-2 border bg-slate-800/50 border-violet-500/50 p-4 rounded">
          <p className="text-sm font-semibold text-violet-400">Referencias:</p>
          <p className="text-sm text-slate-300/90">Precio mayorista → 2</p>
          <p className="text-sm text-slate-300/90">Precio minorista → 3</p>
          <p className="text-sm text-slate-300/90">Precio llavero → 5</p>
        </div>
      </div>
    </div>
  );
}
