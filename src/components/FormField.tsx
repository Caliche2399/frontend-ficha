import { Form } from 'react-bootstrap'

interface FormFieldProps {
    id: string
    label: string
    value: string
    error: string | null
    hint?: string
    type?: string
    inputMode?: 'text' | 'numeric' | 'email'
    autoComplete?: string
    placeholder?: string
    disabled?: boolean
    onChange: (value: string) => void
    onBlur: () => void
}

export const FormField = ({
    id,
    label,
    value,
    error,
    hint,
    type = 'text',
    inputMode,
    autoComplete,
    placeholder,
    disabled,
    onChange,
    onBlur,
}: FormFieldProps) => {
    const errorId = `${id}-error`
    const hintId = `${id}-hint`
    const describedBy = [error && errorId, hint && hintId].filter(Boolean).join(' ')

    return (
        <Form.Group controlId={id} className="mb-3">
            <Form.Label>{label}</Form.Label>
            <Form.Control
                type={type}
                inputMode={inputMode}
                autoComplete={autoComplete}
                placeholder={placeholder}
                disabled={disabled}
                value={value}
                isInvalid={!!error}
                aria-invalid={!!error}
                aria-describedby={describedBy || undefined}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
            />
            {hint && <Form.Text id={hintId}>{hint}</Form.Text>}
            {error && (
                <Form.Control.Feedback type="invalid" id={errorId} role="alert">
                    {error}
                </Form.Control.Feedback>
            )}
        </Form.Group>
    )
}
