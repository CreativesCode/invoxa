import { AlertTriangle, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../../components/ui/Button'
import type { Profile } from '../../../types/profile'
import { useDeleteUser } from './queries'

// Confirmation modal for permanently deleting a user. The deletion runs through
// the `delete-user` Edge Function, which blocks users that have financial
// records — that error is shown inline so the admin can fall back to
// deactivating instead.
export function DeleteUserModal({
  open,
  user,
  onClose,
  onDeleted,
}: {
  open: boolean
  user: Pick<Profile, 'id' | 'full_name' | 'email'>
  onClose: () => void
  onDeleted: () => void
}) {
  const deleteUser = useDeleteUser()
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  const isPending = deleteUser.isPending
  const label = user.full_name || user.email

  const handleClose = () => {
    if (isPending) return
    setError(null)
    onClose()
  }

  const handleConfirm = async () => {
    setError(null)
    try {
      await deleteUser.mutateAsync(user.id)
      onDeleted()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo eliminar el usuario.',
      )
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-text/40 px-4"
      onClick={handleClose}
    >
      <div
        className="flex w-full max-w-md flex-col rounded-card border border-border bg-surface shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="font-display text-base font-bold text-text">
              Eliminar usuario
            </h3>
            <p className="mt-1 text-xs text-muted">
              Esta acción es permanente y no se puede deshacer.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-subtle hover:text-text"
            aria-label="Cerrar"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">
          <div className="flex gap-3 rounded-card bg-red-soft px-3 py-3">
            <AlertTriangle size={18} className="mt-0.5 flex-shrink-0 text-red" />
            <p className="text-xs text-red">
              Se eliminará la cuenta de{' '}
              <span className="font-semibold">{label}</span> junto con sus
              asignaciones de proyecto, compensaciones y tareas no facturadas. Si
              el usuario tiene facturas u otros registros financieros, la
              eliminación se bloqueará: desactívalo en su lugar.
            </p>
          </div>

          {error && (
            <p className="rounded-card bg-red-soft px-3 py-2 text-xs text-red">
              {error}
            </p>
          )}
        </div>

        <div className="flex gap-2 border-t border-border px-5 py-4">
          <Button
            fullWidth
            size="md"
            variant="danger"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? 'Eliminando…' : 'Eliminar usuario'}
          </Button>
          <Button
            fullWidth
            variant="ghost"
            size="md"
            onClick={handleClose}
            disabled={isPending}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}
