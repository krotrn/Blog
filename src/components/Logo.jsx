import React from 'react'

function Logo({width = '100px', ...props}) {
  return (
    <img src="https://create-react-app.dev/img/logo.svg" alt="React Project" {...props} />
  )
}

export default Logo