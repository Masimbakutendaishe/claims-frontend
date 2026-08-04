import { useState } from 'react'
import { DashboardLayout } from '../../widgets/dashboard-layout/DashboardLayout'
import { Button } from '../../shared/ui/Button'
import { Card } from '../../shared/ui/Card'
import { NewClaimWizard } from '../../features/claim-submission/NewClaimWizard'

export function ClaimantDashboardPage() {
  const [showWizard, setShowWizard] = useState(false)

  return (
    <DashboardLayout>
      {showWizard ? (
        <NewClaimWizard onExit={() => setShowWizard(false)} onSubmitted={() => setShowWizard(false)} />
      ) : (
        <div className="p-4 sm:p-8">
          <Card variant="sheen" className="p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="font-semibold">No active claim</h2>
              <p className="text-sm opacity-80">Start a new claim after an accident to get the process moving.</p>
            </div>
            <Button className="sm:w-auto w-full" onClick={() => setShowWizard(true)}>
              Start New Claim
            </Button>
          </Card>
          <h2 className="text-card font-semibold mb-3">Your claims</h2>
          <div className="text-sm opacity-60">No claims yet.</div>
        </div>
      )}
    </DashboardLayout>
  )
}