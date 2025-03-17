const Notification = ({ message, error }) => {

  if (message === null && error === null) {
    return null
  }



  return (

    <div className={message && 'note' || error && 'error'}>
      {message}{error}
    </div>

  )

}

export default Notification