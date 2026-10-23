import { Alert } from "react-bootstrap"
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa"

interface AlertComponentProps {
    variant: string
    message: string
}

export const AlertComponent = ({ variant, message }: AlertComponentProps) => {
    return (
        <Alert variant={variant} className="d-flex align-items-center">
            {variant === "success" && <FaCheckCircle className="me-2 flex-shrink-0" aria-hidden="true" />}
            {variant === "danger" && <FaExclamationCircle className="me-2 flex-shrink-0" aria-hidden="true" />}
            {message}
        </Alert>
    )
}
