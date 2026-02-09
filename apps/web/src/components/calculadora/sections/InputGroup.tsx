import { UseFormRegisterReturn } from "react-hook-form";

interface InputGroupProps {
    label: string;
    error?: string;
    type?: "number" | "text" | "checkbox";
    prefix?: string;
    registration: UseFormRegisterReturn;
}

export function InputGroup({
    label,
    error,
    type = "number",
    prefix,
    registration,
}: InputGroupProps) {
    return(
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-300 tracking-widest">{label}</label>
            <div className="relative">
                {
                    prefix && (
                        <div className="absolute inset-y-0 right-3 pl-2 flex items-center pointer-events-none">
                            <span className="text-slate-500 text-sm font-medium">{prefix}</span>
                        </div>
                    )
                }

                <input
                    type={type}
                    {...registration}
                    className={`
                        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                        block w-full rounded-xl bg-slate-800/50 text-white shadow-sm p-3 border border-slate-700
                        focus:border-violet-500 focus:ring-1 focus:ring-violet-500 sm:text-sm
                        placeholder-slate-500 transition-colors
                        ${prefix ? "pl-3" : ""} 
                        ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "hover:border-slate-600"}`} />
            </div>
            {
                error && (
                    <p className="text-red-400 text-xs mt-1 animate-pulse font-medium">{error}</p>
                )
            }
        </div>
    )
}