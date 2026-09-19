'use client'
import { useAccount } from 'wagmi'
import { useMounted } from '../use-mounted'

export function SucceedForm({
  action,
  defaultIncoming,
  currentPublisher,
  denied,
}: {
  action: (formData: FormData) => void
  defaultIncoming: string
  currentPublisher: string
  denied: { address: string; label: string }[]
}) {
  const { address } = useAccount()
  const mounted = useMounted()
  const hit = (a?: string) =>
    mounted && !!a && denied.some((d) => d.address && a.toLowerCase() === d.address.toLowerCase())
  const blocked = hit(address)
  const blocker = address ? denied.find((d) => d.address && address.toLowerCase() === d.address.toLowerCase()) : undefined

  return (
    <form action={action} className="sans mt-6 grid gap-3 text-sm max-w-xl">
      <input type="hidden" name="connected" value={mounted ? (address ?? '') : ''} />
      {blocked && (
        <p
          className="px-4 py-3 rounded-sm border text-sm"
          style={{ borderColor: '#c46a1b', background: '#faf1e0', color: '#7c2d12' }}
          role="alert"
        >
          Connected wallet <span className="mono">{address}</span> is {blocker?.label}. Only a
          committee wallet may propose succession — owners past and present are refused here.
        </p>
      )}
      <label className="grid gap-1">
        New catalogue owner (required — never hardcoded)
        <input
          name="incoming"
          defaultValue={defaultIncoming}
          placeholder="0x…"
          required
          disabled={blocked}
          className="mono border ledger-rule rounded-sm px-3 py-2 text-sm"
          style={{ background: '#faf1e0', opacity: blocked ? 0.5 : 1 }}
        />
      </label>
      <label className="grid gap-1">
        Old catalogue owner (fixed — the current publisher)
        <input
          name="outgoing"
          defaultValue={currentPublisher}
          readOnly
          tabIndex={-1}
          className="mono border ledger-rule rounded-sm px-3 py-2 text-sm"
          style={{ background: '#e7d5b8', opacity: blocked ? 0.5 : 1 }}
        />
      </label>
      <button
        className="px-4 py-2 rounded-sm text-white text-sm w-fit"
        style={{ background: '#1b3a2f', opacity: blocked ? 0.5 : 1 }}
        type="submit"
        disabled={blocked}
        title={blocked ? 'Refused: owners cannot propose succession' : 'Propose succession'}
      >
        {blocked ? 'Refused — committee only' : 'Propose succession'}
      </button>
    </form>
  )
}
