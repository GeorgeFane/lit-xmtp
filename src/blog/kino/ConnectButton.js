import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import { Web3ReactProvider } from '@web3-react/core'
import Web3 from 'web3'

import Index from './index'

function getLibrary(provider) {
  return new Web3(provider)
}

function MyApp() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Index />
    </Web3ReactProvider>
  )
}

export default MyApp