import { Alert } from "react-bootstrap"

interface AlertComponentProps {
    variant: string
    message: string
}

export const AlertComponent = ({ variant, message }: AlertComponentProps) => {
    return (
        <Alert variant={variant}>{message}</Alert>
    )
}