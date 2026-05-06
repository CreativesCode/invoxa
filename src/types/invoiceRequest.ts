export type InvoiceRequestStatus = 'pending' | 'completed' | 'expired'

export type InvoiceRequest = {
  id: string
  requested_by: string
  user_id: string
  period_start: string
  period_end: string
  status: InvoiceRequestStatus
  sent_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export type InvoiceRequestWithUser = InvoiceRequest & {
  user: {
    id: string
    full_name: string | null
    email: string
    user_code: string | null
  }
  requester: {
    id: string
    full_name: string | null
    email: string
  }
}
