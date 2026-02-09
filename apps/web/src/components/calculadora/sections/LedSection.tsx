import { UseFormRegister, FieldErrors } from "react-hook-form";
import { CostBudget } from "@/src/lib/schemas";
import { InputGroup } from "./InputGroup";

interface Props {
  register: UseFormRegister<CostBudget>;
  errors: FieldErrors<CostBudget>;
  isLedFrame?: boolean;
}

export function LedSection({ register, errors, isLedFrame }: Props) {
  return (
    <div className={`space-y-4 p-4 rounded-xl border transition-all ${isLedFrame ? 'bg-slate-800/50 border-violet-500/50' : 'bg-slate-800/30 border-slate-700'}`}>
      <div className="flex items-center justify-between">
        <h3 className={`text-sm font-bold tracking-widest ${isLedFrame ? 'text-violet-400' : 'text-slate-400'}`}>Cartel LED</h3>
        <InputGroup label="" type="checkbox" registration={register("isLedFrame")} />
      </div>

      {isLedFrame && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2">
          <InputGroup
            label="Metros LED"
            registration={register("ledMtsAmount", { valueAsNumber: true })}
            error={errors.ledMtsAmount?.message}
            prefix="mts"
          />
          <InputGroup
            label="Costo Metro"
            registration={register("ledMtsPrice", { valueAsNumber: true })}
            error={errors.ledMtsPrice?.message}
            prefix="$"
          />
          <InputGroup
            label="Costo Fuente"
            registration={register("powerSupplyUnitPrice", { valueAsNumber: true })}
            error={errors.powerSupplyUnitPrice?.message}
            prefix="$"
          />
        </div>
      )}
    </div>
  );
}