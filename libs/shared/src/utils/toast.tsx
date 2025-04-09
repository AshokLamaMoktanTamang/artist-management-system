import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ToastMessageFormat = ({ message, title }: { message: string; title: string }) => (
  <div>
    <h4>
      {title}
    </h4>
    <p>
      {message}
    </p>
  </div>
)

const toastError = (title: string, message: string = '') => {
  toast(<ToastMessageFormat title={title} message={message} />, { type: 'error' })
}

const toastInfo = (title: string, message: string = '') => {
  toast(<ToastMessageFormat title={title}  message={message} />, { type: 'info' })
}

const toastSuccess = (title: string, message: string = '') => {
  toast(<ToastMessageFormat title={title}  message={message} />, { type: 'success' })
}

const toastWarning = (title: string, message: string = '') => {
  toast(<ToastMessageFormat title={title}  message={message} />, { type: 'warning' })
}

export { toastError, toastInfo, toastSuccess, toastWarning }
