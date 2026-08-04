interface Props {
  secondsLeft: number
  onStayLoggedIn: () => void
  onLogoutNow: () => void
}

export function SessionTimeoutModal({ secondsLeft, onStayLoggedIn, onLogoutNow }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card text-card-ink rounded-lg shadow-xl max-w-sm w-full p-6 space-y-4 text-center">
        <h2 className="text-lg font-semibold">Still there?</h2>
        <p className="text-sm opacity-80">
          You'll be signed out in {secondsLeft} seconds due to inactivity.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onLogoutNow}
            className="flex-1 rounded-md border border-white/30 py-2 text-sm"
          >
            Log out
          </button>
          <button
            type="button"
            onClick={onStayLoggedIn}
            className="flex-1 bg-button-bg text-button-ink rounded-md py-2 text-sm font-medium"
          >
            Stay signed in
          </button>
        </div>
      </div>
    </div>
  )
}