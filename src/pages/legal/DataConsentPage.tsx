export function DataConsentPage() {
  return (
    <div className="max-w-2xl mx-auto p-8 space-y-6 text-ink">
      <h1 className="text-2xl font-semibold">Data Consent Policy</h1>
      <p className="text-sm opacity-70">Version 1.0</p>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">What we collect</h2>
        <p className="text-sm">
          To process a motor claim, First Mutual collects: your driver's
          license, vehicle registration details, incident description, police
          report, photographs of vehicle damage, and repair quotations. Where
          a third party is involved, we also collect proof of the other
          party's insurance cover.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">How we use it</h2>
        <p className="text-sm">
          This data is used to assess and process your claim, including
          sharing relevant details with the assigned Vehicle Assessor and
          selected Service Providers so they can prepare an assessment and
          repair quotation. We do not sell your data to third parties.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Storage and retention</h2>
        <p className="text-sm">
          Photographs and documents are stored securely and retained for the
          duration of your claim and any period required by law or regulatory
          obligation afterward.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Your rights</h2>
        <p className="text-sm">
          You may request access to, correction of, or deletion of your
          personal data, subject to our regulatory retention obligations.
          Contact First Mutual's data protection point of contact to make a
          request.
        </p>
      </section>

      <p className="text-xs opacity-50">
        This page is a starting draft only — final wording should be
        reviewed by First Mutual's legal/compliance team before this goes
        live, particularly for alignment with Zimbabwe's Data Protection Act.
      </p>
    </div>
  )
}
