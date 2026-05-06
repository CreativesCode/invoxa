import type { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form'
import { Field } from '../../../components/ui/Field'
import { Select } from '../../../components/ui/Select'
import { CURRENCIES } from './memberSchema'

type AnyValues = {
  payment_type?: 'hourly' | 'fixed'
  hourly_rate?: number
  monthly_rate?: number
  currency?: string
}

function numberOrUndefined(v: unknown): number | undefined {
  if (v === '' || v == null) return undefined
  const n = Number(v)
  return Number.isNaN(n) ? undefined : n
}

export function CompensationFields<T extends AnyValues>({
  register,
  setValue,
  watch,
  errors,
}: {
  register: UseFormRegister<T>
  setValue: UseFormSetValue<T>
  watch: UseFormWatch<T>
  errors: FieldErrors<T>
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paymentType = watch('payment_type' as any) as 'hourly' | 'fixed'

  return (
    <>
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-text-sec">
          Modalidad de pago
        </label>
        <div className="flex gap-2">
          {(['hourly', 'fixed'] as const).map((t) => {
            const isSelected = paymentType === t
            return (
              <button
                key={t}
                type="button"
                onClick={() =>
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  setValue('payment_type' as any, t as any, {
                    shouldDirty: true,
                  })
                }
                className={`flex-1 rounded-xl border px-4 py-3 text-left transition ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-subtle hover:border-border-strong'
                }`}
              >
                <div className="text-sm font-semibold text-text">
                  {t === 'hourly' ? 'Por hora' : 'Fijo mensual'}
                </div>
                <p className="mt-1 text-xs text-muted">
                  {t === 'hourly'
                    ? 'Se factura según horas registradas en tareas.'
                    : 'Tarifa fija al mes, sin registro de tareas.'}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {paymentType === 'hourly' ? (
          <Field
            label="Tarifa por hora"
            type="number"
            step="0.01"
            min={0}
            placeholder="20"
            error={
              (errors.hourly_rate as { message?: string } | undefined)?.message
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {...register('hourly_rate' as any, { setValueAs: numberOrUndefined })}
          />
        ) : (
          <Field
            label="Tarifa fija mensual"
            type="number"
            step="0.01"
            min={0}
            placeholder="2000"
            error={
              (errors.monthly_rate as { message?: string } | undefined)?.message
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {...register('monthly_rate' as any, { setValueAs: numberOrUndefined })}
          />
        )}

        <Select
          label="Moneda"
          options={CURRENCIES}
          error={(errors.currency as { message?: string } | undefined)?.message}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...register('currency' as any)}
        />
      </div>
    </>
  )
}
