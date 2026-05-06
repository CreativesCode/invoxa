import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../../lib/supabase/client'
import { extractFunctionError } from '../../../lib/supabase/functionError'
import type { InviteUserFormValues } from './userSchema'

type InviteResponse = {
  success: boolean
  user_id: string | null
  initial_assignment_failed?: boolean
}

export function useInviteUser() {
  const qc = useQueryClient()
  return useMutation<InviteResponse, Error, InviteUserFormValues>({
    mutationFn: async (values) => {
      const projectId = values.project_id?.trim()
      const initialAssignment =
        projectId && values.payment_type && values.currency
          ? {
              project_id: projectId,
              payment_type: values.payment_type,
              hourly_rate:
                values.payment_type === 'hourly'
                  ? (values.hourly_rate ?? null)
                  : null,
              monthly_rate:
                values.payment_type === 'fixed'
                  ? (values.monthly_rate ?? null)
                  : null,
              currency: values.currency,
            }
          : undefined

      const payload = {
        email: values.email,
        full_name: values.full_name,
        role: values.role,
        user_code: values.user_code?.trim()
          ? values.user_code.trim().toUpperCase()
          : undefined,
        initial_assignment: initialAssignment,
      }

      const { data, error } = await supabase.functions.invoke<InviteResponse>(
        'invite-user',
        { body: payload },
      )

      if (error) {
        throw new Error(await extractFunctionError(error))
      }
      if (!data) throw new Error('Sin respuesta del servidor')
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      qc.invalidateQueries({ queryKey: ['projects'] })
      qc.invalidateQueries({ queryKey: ['project-members'] })
    },
  })
}
