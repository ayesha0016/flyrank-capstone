import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import SettingsForm from './SettingsForm'
import * as settingsModule from './settingsSchema'

describe('SettingsForm', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows required errors when submitting an empty form', async () => {
    const user = userEvent.setup()
    render(<SettingsForm />)

    await user.click(screen.getByRole('button', { name: /save settings/i }))

    expect(await screen.findByText('Full name is required')).toBeInTheDocument()
    expect(screen.getByText('Email is required')).toBeInTheDocument()
  })

  it('shows an email format error for an invalid email', async () => {
    const user = userEvent.setup()
    render(<SettingsForm />)

    await user.type(screen.getByLabelText(/full name/i), 'Jane Doe')
    await user.type(screen.getByLabelText(/^email$/i), 'not-an-email')
    await user.tab()

    expect(
      await screen.findByText('Please enter a valid email address'),
    ).toBeInTheDocument()
  })

  it('shows a success message after a valid submission', async () => {
    const user = userEvent.setup()
    const saveSpy = vi.spyOn(settingsModule, 'saveSettings').mockResolvedValue()

    render(<SettingsForm />)

    await user.type(screen.getByLabelText(/full name/i), 'Jane Doe')
    await user.type(screen.getByLabelText(/^email$/i), 'jane@example.com')
    await user.click(screen.getByRole('button', { name: /save settings/i }))

    expect(saveSpy).toHaveBeenCalledWith({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      bio: '',
      emailNotifications: false,
    })

    expect(
      await screen.findByText('Settings saved successfully.'),
    ).toBeInTheDocument()
  })

  it('disables the submit button while saving', async () => {
    const user = userEvent.setup()
    let resolveSave: () => void = () => {}
    const pendingSave = new Promise<void>((resolve) => {
      resolveSave = resolve
    })

    vi.spyOn(settingsModule, 'saveSettings').mockReturnValue(pendingSave)

    render(<SettingsForm />)

    await user.type(screen.getByLabelText(/full name/i), 'Jane Doe')
    await user.type(screen.getByLabelText(/^email$/i), 'jane@example.com')

    const submitButton = screen.getByRole('button', { name: /save settings/i })
    await user.click(submitButton)

    expect(submitButton).toBeDisabled()
    expect(submitButton).toHaveTextContent('Saving...')

    resolveSave()

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
    })
    expect(submitButton).toHaveTextContent('Save Settings')
  })
})
