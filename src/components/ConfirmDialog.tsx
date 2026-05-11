type Props = {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
  onCancel
}: Props) {
  if (!open) return null

  return (
    <div
      data-noto-interactive
      className="pointer-events-auto fixed inset-0 z-[2000] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <div
        className="w-full max-w-sm rounded-xl border border-white/10 bg-[#1e222c] p-5 shadow-noto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-title" className="text-base font-semibold text-noto-text">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-noto-muted">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            className="rounded-lg bg-white/[0.08] px-3 py-1.5 text-sm text-noto-text hover:bg-white/[0.12]"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              danger
                ? 'bg-red-500/85 text-white hover:bg-red-500'
                : 'bg-emerald-500/80 text-white hover:bg-emerald-500'
            }`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
