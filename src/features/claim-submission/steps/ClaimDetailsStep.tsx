import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '../../../shared/ui/Button'
import { Input } from '../../../shared/ui/Input'
import { FormField } from '../../../shared/ui/FormField'
import { FormSection } from '../../../shared/ui/FormSection'
import type { ClaimFormDetails, DamageLine } from '../../../shared/api/contracts/claim.contract'

interface Props {
  initial: ClaimFormDetails
  onNext: (data: ClaimFormDetails) => void
  onBack: () => void
}

const selectClass = 'w-full rounded-lg bg-input-bg text-input-ink px-3 py-2 text-sm outline-none'
const textareaClass = 'w-full rounded-lg bg-input-bg text-input-ink px-3 py-2 text-sm outline-none resize-none'

function YesNoSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={selectClass}>
      <option value="">Select</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </select>
  )
}

export function ClaimDetailsStep({ initial, onNext, onBack }: Props) {
  const [form, setForm] = useState<ClaimFormDetails>(initial)

  const set = <K extends keyof ClaimFormDetails>(key: K, value: ClaimFormDetails[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const updateDamageLine = (index: number, field: keyof DamageLine, value: string) => {
    setForm((f) => {
      const lines = [...f.damageLines]
      lines[index] = { ...lines[index], [field]: value }
      return { ...f, damageLines: lines }
    })
  }
  const addDamageLine = () =>
    setForm((f) => ({ ...f, damageLines: [...f.damageLines, { partPanel: '', natureOfDamage: '', estimatedCost: '' }] }))
  const removeDamageLine = (index: number) =>
    setForm((f) => ({ ...f, damageLines: f.damageLines.filter((_, i) => i !== index) }))

  const requiredOk =
    form.fullName.trim() && form.registrationNumber.trim() && form.accidentDate.trim() && form.accidentDescription.trim()

  return (
    <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
      <h2 className="font-semibold text-card-ink text-center">Claim Form</h2>

      <FormSection title="Section 1 — Policy & Claimant Details">
        <FormField label="Policy Number"><Input value={form.policyNumber} onChange={(e) => set('policyNumber', e.target.value)} /></FormField>
        <FormField label="Date of Policy Inception"><Input type="date" value={form.policyInceptionDate} onChange={(e) => set('policyInceptionDate', e.target.value)} /></FormField>
        <FormField label="Full Name *"><Input value={form.fullName} onChange={(e) => set('fullName', e.target.value)} required /></FormField>
        <FormField label="ID / Passport / Company Reg. No."><Input value={form.idNumber} onChange={(e) => set('idNumber', e.target.value)} /></FormField>
        <FormField label="Physical Address"><Input value={form.physicalAddress} onChange={(e) => set('physicalAddress', e.target.value)} /></FormField>
        <FormField label="Email Address"><Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} /></FormField>
        <FormField label="Phone (Mobile)"><Input value={form.phoneMobile} onChange={(e) => set('phoneMobile', e.target.value)} /></FormField>
        <FormField label="Phone (Office)"><Input value={form.phoneOffice} onChange={(e) => set('phoneOffice', e.target.value)} /></FormField>
        <FormField label="Intermediary / Broker Name"><Input value={form.intermediaryName} onChange={(e) => set('intermediaryName', e.target.value)} /></FormField>
        <FormField label="Claim Date"><Input type="date" value={form.claimDate} onChange={(e) => set('claimDate', e.target.value)} /></FormField>
      </FormSection>

      <FormSection title="Section 2 — Accident Details">
        <FormField label="Date of Accident *"><Input type="date" value={form.accidentDate} onChange={(e) => set('accidentDate', e.target.value)} required /></FormField>
        <FormField label="Time of Accident"><Input type="time" value={form.accidentTime} onChange={(e) => set('accidentTime', e.target.value)} /></FormField>
        <FormField label="Location / Road of Accident"><Input value={form.accidentLocation} onChange={(e) => set('accidentLocation', e.target.value)} /></FormField>
        <FormField label="Weather Conditions"><Input value={form.weatherConditions} onChange={(e) => set('weatherConditions', e.target.value)} /></FormField>
        <FormField label="Date Reported to Insurer"><Input type="date" value={form.dateReportedToInsurer} onChange={(e) => set('dateReportedToInsurer', e.target.value)} /></FormField>
        <FormField label="Usage of Vehicle at Time"><Input value={form.vehicleUsageAtTime} onChange={(e) => set('vehicleUsageAtTime', e.target.value)} /></FormField>
        <FormField label="Speed at Time of Impact"><Input value={form.speedAtImpact} onChange={(e) => set('speedAtImpact', e.target.value)} /></FormField>
        <FormField label="Road Conditions"><Input value={form.roadConditions} onChange={(e) => set('roadConditions', e.target.value)} /></FormField>

        <div className="sm:col-span-2">
          <FormField label="Describe how the accident occurred *">
            <textarea
              rows={4}
              value={form.accidentDescription}
              onChange={(e) => set('accidentDescription', e.target.value)}
              className={textareaClass}
            />
          </FormField>
        </div>

        <FormField label="Reported to Police (ZRP)?"><YesNoSelect value={form.reportedToPolice} onChange={(v) => set('reportedToPolice', v as ClaimFormDetails['reportedToPolice'])} /></FormField>
        <FormField label="RRB Number"><Input value={form.rrbNumber} onChange={(e) => set('rrbNumber', e.target.value)} /></FormField>
        <FormField label="Police Station Name"><Input value={form.policeStationName} onChange={(e) => set('policeStationName', e.target.value)} /></FormField>
        <FormField label="Investigating Officer"><Input value={form.investigatingOfficer} onChange={(e) => set('investigatingOfficer', e.target.value)} /></FormField>
        <FormField label="Date Reported to Police"><Input type="date" value={form.dateReportedToPolice} onChange={(e) => set('dateReportedToPolice', e.target.value)} /></FormField>
        <FormField label="Who Was Charged"><Input value={form.personCharged} onChange={(e) => set('personCharged', e.target.value)} /></FormField>
        <FormField label="Fine Paid / Convicted?"><Input value={form.finePaidOrConvicted} onChange={(e) => set('finePaidOrConvicted', e.target.value)} /></FormField>
      </FormSection>

      <FormSection title="Section 3 — Vehicle Details">
        <FormField label="Vehicle Make & Model"><Input value={form.vehicleMakeModel} onChange={(e) => set('vehicleMakeModel', e.target.value)} /></FormField>
        <FormField label="Registration Number *"><Input value={form.registrationNumber} onChange={(e) => set('registrationNumber', e.target.value)} required /></FormField>
        <FormField label="Year of Manufacture"><Input value={form.yearOfManufacture} onChange={(e) => set('yearOfManufacture', e.target.value)} /></FormField>
        <FormField label="Colour"><Input value={form.colour} onChange={(e) => set('colour', e.target.value)} /></FormField>
        <FormField label="Chassis / VIN Number"><Input value={form.chassisNumber} onChange={(e) => set('chassisNumber', e.target.value)} /></FormField>
        <FormField label="Engine Number"><Input value={form.engineNumber} onChange={(e) => set('engineNumber', e.target.value)} /></FormField>
        <FormField label="Sum Insured (USD)"><Input value={form.sumInsured} onChange={(e) => set('sumInsured', e.target.value)} /></FormField>
        <FormField label="Cover Type"><Input value={form.coverType} onChange={(e) => set('coverType', e.target.value)} /></FormField>
        <FormField label="Is Vehicle Financed?"><YesNoSelect value={form.isFinanced} onChange={(v) => set('isFinanced', v as ClaimFormDetails['isFinanced'])} /></FormField>
        <FormField label="Finance House Name"><Input value={form.financeHouseName} onChange={(e) => set('financeHouseName', e.target.value)} /></FormField>
      </FormSection>

      <FormSection title="Section 4 — Driver at Time of Accident">
        <FormField label="Full Name of Driver"><Input value={form.driverFullName} onChange={(e) => set('driverFullName', e.target.value)} /></FormField>
        <FormField label="Driver's Licence Number"><Input value={form.driverLicenceNumber} onChange={(e) => set('driverLicenceNumber', e.target.value)} /></FormField>
        <FormField label="Licence Class & Category"><Input value={form.licenceClassCategory} onChange={(e) => set('licenceClassCategory', e.target.value)} /></FormField>
        <FormField label="Licence Expiry Date"><Input type="date" value={form.licenceExpiryDate} onChange={(e) => set('licenceExpiryDate', e.target.value)} /></FormField>
        <FormField label="Date of Birth"><Input type="date" value={form.driverDob} onChange={(e) => set('driverDob', e.target.value)} /></FormField>
        <FormField label="Is Licence Endorsed?"><YesNoSelect value={form.licenceEndorsed} onChange={(v) => set('licenceEndorsed', v as ClaimFormDetails['licenceEndorsed'])} /></FormField>
        <FormField label="Relationship to Insured"><Input value={form.relationshipToInsured} onChange={(e) => set('relationshipToInsured', e.target.value)} /></FormField>
        <FormField label="Was Driver Authorized?"><YesNoSelect value={form.driverAuthorized} onChange={(v) => set('driverAuthorized', v as ClaimFormDetails['driverAuthorized'])} /></FormField>
        <FormField label="Previous Accidents?"><YesNoSelect value={form.hadPreviousAccidents} onChange={(v) => set('hadPreviousAccidents', v as ClaimFormDetails['hadPreviousAccidents'])} /></FormField>
        <FormField label="Details of Previous Accidents"><Input value={form.previousAccidentDetails} onChange={(e) => set('previousAccidentDetails', e.target.value)} /></FormField>
        <FormField label="Under Influence of Alcohol/Drugs?">
          <select value={form.underInfluence} onChange={(e) => set('underInfluence', e.target.value as ClaimFormDetails['underInfluence'])} className={selectClass}>
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="unknown">Unknown</option>
          </select>
        </FormField>
      </FormSection>

      <FormSection title="Section 6 — Damage to Insured Vehicle">
        <FormField label="Where Can Vehicle Be Seen for Assessment"><Input value={form.whereVehicleCanBeSeen} onChange={(e) => set('whereVehicleCanBeSeen', e.target.value)} /></FormField>
        <FormField label="Contact Name for Assessment"><Input value={form.assessmentContactName} onChange={(e) => set('assessmentContactName', e.target.value)} /></FormField>
        <FormField label="Contact Number for Assessment"><Input value={form.assessmentContactNumber} onChange={(e) => set('assessmentContactNumber', e.target.value)} /></FormField>
        <FormField label="Is Vehicle Driveable?"><YesNoSelect value={form.vehicleDriveable} onChange={(v) => set('vehicleDriveable', v as ClaimFormDetails['vehicleDriveable'])} /></FormField>
      </FormSection>

      <div className="text-left">
        <h3 className="text-sm font-semibold text-card-ink mb-3">Part / Panel Damaged</h3>
        <div className="space-y-2">
          {form.damageLines.map((line, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_100px_auto] gap-2 items-end">
              <FormField label="Part / Panel"><Input value={line.partPanel} onChange={(e) => updateDamageLine(i, 'partPanel', e.target.value)} /></FormField>
              <FormField label="Nature of Damage"><Input value={line.natureOfDamage} onChange={(e) => updateDamageLine(i, 'natureOfDamage', e.target.value)} /></FormField>
              <FormField label="Est. Cost (USD)"><Input value={line.estimatedCost} onChange={(e) => updateDamageLine(i, 'estimatedCost', e.target.value)} /></FormField>
              <button
                type="button"
                onClick={() => removeDamageLine(i)}
                disabled={form.damageLines.length === 1}
                className="text-card-ink opacity-60 hover:opacity-100 disabled:opacity-20 p-2"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addDamageLine}
          className="mt-2 flex items-center gap-1.5 text-xs text-card-ink underline opacity-80"
        >
          <Plus size={14} /> Add another line
        </button>
      </div>

      <div className="flex justify-center gap-3 pt-2">
        <Button variant="secondary" onClick={onBack}>Back</Button>
        <Button disabled={!requiredOk} onClick={() => onNext(form)}>Continue</Button>
      </div>
    </div>
  )
}