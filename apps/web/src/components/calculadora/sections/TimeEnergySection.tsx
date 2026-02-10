import { UseFormRegister, FieldErrors } from "react-hook-form";
import { CostBudget } from "@/src/lib/schemas";
import { InputGroup } from "./InputGroup";

interface Props {
  register: UseFormRegister<CostBudget>;
  errors: FieldErrors<CostBudget>;
}

export function TimeEnergySection({ register, errors }: Props) {
  return (
  <div className="space-y-4">
    <h3 className="text-lg font-bold text-foreground/90 border-foreground/30 border-b pb-2">
      Energía
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <InputGroup
        label="Horas de Impresión"
        registration={register("printHours", { valueAsNumber: true })}
        error={errors.printHours?.message}
        prefix="hs"
      />
      <InputGroup
        label="Minutos de Impresión"
        registration={register("printMinutes", { valueAsNumber: true })}
        error={errors.printMinutes?.message}
        prefix="min"
      />
      <InputGroup
        label="Costo del KWh"
        registration={register("kwhPrice", { valueAsNumber: true })}
        error={errors.kwhPrice?.message}
        prefix="$"
      />
    </div>
  </div>
  );
}
