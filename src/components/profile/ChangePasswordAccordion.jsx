import { useState } from 'react'
import FormField from '../auth/FormField.jsx'
import PasswordEye from '../auth/PasswordEye.jsx'
import PasswordRequirements from '../auth/PasswordRequirements.jsx'
import Button from '../ui/Button.jsx'
import Card from '../ui/Card.jsx'
import FieldError from '../ui/FieldError.jsx'

const passwordInputClass =
  'h-[48px] w-full rounded-[9px] border-2 border-[#dedede] bg-white px-[16px] pr-14 text-[#111827] outline-none transition-[border-color,box-shadow] duration-[250ms] focus:border-[#3a7be0] focus:shadow-[0_0_0_4px_rgba(58,123,224,0.16)]'

function PasswordToggle({ showPassword, onToggle, label }) {
  return (
    <button
      className="absolute right-[14px] top-[42px] grid size-[28px] cursor-pointer place-items-center rounded-full border-0 bg-transparent p-0 text-[#d6d6d6] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[rgba(58,123,224,0.25)]"
      type="button"
      aria-label={showPassword ? `Hide ${label}` : `Show ${label}`}
      aria-pressed={showPassword}
      onClick={onToggle}
    >
      <PasswordEye showPassword={showPassword} />
    </button>
  )
}

function ChangePasswordAccordion({
  isOpen,
  onToggle,
  form,
  errors,
  successMessage,
  passwordRequirements,
  canSubmit,
  isSubmitting,
  onFieldChange,
  onSubmit,
}) {
  const [visibleFields, setVisibleFields] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  })

  const toggleVisibility = (field) => {
    setVisibleFields((currentValue) => ({
      ...currentValue,
      [field]: !currentValue[field],
    }))
  }

  return (
    <Card className="rounded-[24px] border border-[#e5e7eb] bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <div>
          <h2 className="text-[20px] font-black text-[#111827]">Change Password</h2>
          <p className="mt-1 text-[14px] font-medium text-[#6b7280]">
            Update your account password without ending your current session.
          </p>
        </div>
        <span className={`grid size-9 place-items-center rounded-full bg-[#eef6ff] text-[22px] font-black text-[#3b82f6] transition ${isOpen ? 'rotate-180' : ''}`}>
          v
        </span>
      </button>

      {successMessage && (
        <div className="mx-6 mb-5 rounded-[12px] border border-[#d1fae5] bg-[#ecfdf5] px-4 py-3 text-[14px] font-semibold text-[#166534]">
          {successMessage}
        </div>
      )}

      {isOpen && (
        <form className="border-t border-[#f3f4f6] px-6 py-6" onSubmit={onSubmit}>
          {errors.form && (
            <div className="mb-5 rounded-[12px] border border-[#f8d7da] bg-[#fdf2f2] px-4 py-3 text-[14px] font-semibold text-[#842029]">
              {errors.form}
            </div>
          )}

          <div className="grid gap-5 lg:grid-cols-3">
            <div>
              <FormField
                label="Current Password"
                id="currentPassword"
                type={visibleFields.currentPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={form.currentPassword}
                onChange={(event) => onFieldChange('currentPassword', event.target.value)}
                className={passwordInputClass}
                rightElement={
                  <PasswordToggle
                    label="current password"
                    showPassword={visibleFields.currentPassword}
                    onToggle={() => toggleVisibility('currentPassword')}
                  />
                }
              />
              <FieldError>{errors.currentPassword}</FieldError>
            </div>

            <div>
              <FormField
                label="New Password"
                id="newPassword"
                type={visibleFields.newPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={form.newPassword}
                onChange={(event) => onFieldChange('newPassword', event.target.value)}
                className={passwordInputClass}
                rightElement={
                  <PasswordToggle
                    label="new password"
                    showPassword={visibleFields.newPassword}
                    onToggle={() => toggleVisibility('newPassword')}
                  />
                }
              />
              <FieldError>{errors.newPassword}</FieldError>
            </div>

            <div>
              <FormField
                label="Confirm Password"
                id="confirmPassword"
                type={visibleFields.confirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={form.confirmPassword}
                onChange={(event) => onFieldChange('confirmPassword', event.target.value)}
                className={passwordInputClass}
                rightElement={
                  <PasswordToggle
                    label="confirm password"
                    showPassword={visibleFields.confirmPassword}
                    onToggle={() => toggleVisibility('confirmPassword')}
                  />
                }
              />
              <FieldError>{errors.confirmPassword}</FieldError>
            </div>
          </div>

          <div className="mt-2 max-w-[480px]">
            <PasswordRequirements
              password={form.newPassword}
              confirmPassword={form.confirmPassword}
              passwordRequirements={passwordRequirements}
            />
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="rounded-full bg-[#3b82f6] px-6 py-3 text-[14px] font-extrabold text-white transition-all hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Updating Password...' : 'Update Password'}
            </Button>
          </div>
        </form>
      )}
    </Card>
  )
}

export default ChangePasswordAccordion
