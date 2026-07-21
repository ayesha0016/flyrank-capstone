import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  saveSettings,
  settingsSchema,
  type SettingsFormValues,
} from './settingsSchema'
import './SettingsForm.css'

type SubmitStatus = 'idle' | 'success' | 'error'

const defaultValues: SettingsFormValues = {
  fullName: '',
  email: '',
  bio: '',
  emailNotifications: false,
}

export default function SettingsForm() {
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    mode: 'onBlur',
    defaultValues,
  })

  const onSubmit = async (values: SettingsFormValues) => {
    setSubmitStatus('idle')

    try {
      await saveSettings(values)
      setSubmitStatus('success')
    } catch {
      setSubmitStatus('error')
    }
  }

  return (
    <section className="settings" aria-labelledby="settings-heading">
      <h1 id="settings-heading" className="settings__title">
        Settings
      </h1>

      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        aria-label="User settings form"
      >
        <div className="settings__field">
          <label className="settings__label" htmlFor="fullName">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            className="settings__input"
            autoComplete="name"
            aria-invalid={errors.fullName ? 'true' : undefined}
            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            {...register('fullName')}
          />
          {errors.fullName ? (
            <p id="fullName-error" className="settings__error" role="alert">
              {errors.fullName.message}
            </p>
          ) : null}
        </div>

        <div className="settings__field">
          <label className="settings__label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="settings__input"
            autoComplete="email"
            aria-invalid={errors.email ? 'true' : undefined}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
          />
          {errors.email ? (
            <p id="email-error" className="settings__error" role="alert">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="settings__field">
          <label className="settings__label" htmlFor="bio">
            Bio
          </label>
          <textarea
            id="bio"
            className="settings__textarea"
            rows={4}
            aria-invalid={errors.bio ? 'true' : undefined}
            aria-describedby={errors.bio ? 'bio-error' : undefined}
            {...register('bio')}
          />
          {errors.bio ? (
            <p id="bio-error" className="settings__error" role="alert">
              {errors.bio.message}
            </p>
          ) : null}
        </div>

        <div className="settings__field">
          <div className="settings__checkbox-row">
            <input
              id="emailNotifications"
              type="checkbox"
              {...register('emailNotifications')}
            />
            <label className="settings__label" htmlFor="emailNotifications">
              Enable email notifications
            </label>
          </div>
        </div>

        <div className="settings__actions">
          <button
            type="submit"
            className="settings__submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        {submitStatus === 'success' ? (
          <p
            className="settings__message settings__message--success"
            role="status"
          >
            Settings saved successfully.
          </p>
        ) : null}

        {submitStatus === 'error' ? (
          <p
            className="settings__message settings__message--error"
            role="alert"
          >
            Failed to save settings. Please try again.
          </p>
        ) : null}
      </form>
    </section>
  )
}
