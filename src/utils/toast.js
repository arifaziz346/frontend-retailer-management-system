import Swal from 'sweetalert2'

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end', // can change to 'bottom-end' or 'center'
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#fff',
  customClass: {
    popup: 'rounded-xl shadow-lg'
  },
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer
    toast.onmouseleave = Swal.resumeTimer
  }
})

export const toast = {
  success(message) {
    Toast.fire({
      icon: 'success',
      title: message || 'Success!'
    })
  },
  error(message) {
    Toast.fire({
      icon: 'error',
      title: message || 'Something went wrong!'
    })
  },
  info(message) {
    Toast.fire({
      icon: 'info',
      title: message || 'Information'
    })
  },
  warning(message) {
    Toast.fire({
      icon: 'warning',
      title: message || 'Warning!'
    })
  }
}
