import React from 'react'
import {Link} from 'react-router-dom'

export type Props = {
  isAuthenticated: boolean,
}

const Welcome = ({isAuthenticated}: Props) => (
  <div>
    {isAuthenticated
      ? <>
        <p>Willkommen zurück!</p>
        <Link to={'/dashboard'}>Zum Dashboard</Link>
      </>
      : <>
        <h2>Willkommen!</h2>
        <p>Falls sie bereits Kunde sind, können Sie sich hier anmelden:</p>
        <Link to={'/login'}>Zum Login</Link>
        <br/>
        <p>Noch kein Mitglied? Nicht verzagen!<br/>Hier können sie sich sofort registieren und loslegen:</p>
        <Link to={'/signup'}>Zur Registrierung</Link>
      </>
    }
  </div>
)

export default Welcome
