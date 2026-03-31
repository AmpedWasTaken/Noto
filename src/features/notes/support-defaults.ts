import type { SupportCallData } from '@shared/note-types'

export function emptySupportCall(): SupportCallData {
  return {
    contactName: '',
    companyName: '',
    website: '',
    phone: '',
    issue: ''
  }
}
