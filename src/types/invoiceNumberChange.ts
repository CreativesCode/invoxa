import type { UserRole } from './profile'

export type InvoiceNumberChangeStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'applied'

export type InvoiceNumberChangeRequest = {
  id: string
  invoice_id: string
  requested_by: string
  requested_by_role: UserRole
  current_invoice_number: string
  requested_invoice_number: string
  reason: string | null
  status: InvoiceNumberChangeStatus
  reviewed_by: string | null
  reviewed_at: string | null
  review_notes: string | null
  created_at: string
  updated_at: string
}

export type InvoiceNumberChangeRequestWithContext =
  InvoiceNumberChangeRequest & {
    invoice: {
      id: string
      invoice_number: string
      user_id: string
      total: number
      currency: string
    }
    requester: {
      id: string
      full_name: string | null
      email: string
    }
  }

export type InvoiceNumberHistoryEntry = {
  id: string
  invoice_id: string
  previous_invoice_number: string
  new_invoice_number: string
  change_request_id: string | null
  changed_by: string
  changed_at: string
  reason: string | null
}
