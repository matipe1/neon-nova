import { UseFormRegister, FieldErrors } from "react-hook-form";
import { CostBudget } from "@/src/lib/schemas";
import { InputGroup } from "./InputGroup";

interface Props {
  register: UseFormRegister<CostBudget>;
  errors: FieldErrors<CostBudget>;
}

export function MaterialSection({ register, errors }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold border-b text-foreground/90 border-foreground/30 pb-2">Materiales</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputGroup
          label="Gramos de Filamento"
          registration={register("filamentGrams", { valueAsNumber: true })}
          error={errors.filamentGrams?.message}
          prefix="gr"
        />
        <InputGroup
          label="Costo por Kg"
          registration={register("costKgFilament", { valueAsNumber: true })}
          error={errors.costKgFilament?.message}
          prefix="$"
        />
        <InputGroup
          label="Insumos Extra"
          registration={register("supplies", { valueAsNumber: true })}
          error={errors.supplies?.message}
          prefix="$"
        />
      </div>
    </div>
  );
}