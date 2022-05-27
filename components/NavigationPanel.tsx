import { LinkIcon } from '@heroicons/react/outline'
import { ChatIcon } from '@heroicons/react/outline'
import { ArrowSmRightIcon } from '@heroicons/react/solid'
import useXmtp from '../hooks/useXmtp'
import ConversationsList from './ConversationsList'
import Loader from './Loader'

import { useEffect, useState } from 'react'
import LitJsSdk from 'lit-js-sdk'

import LitShareModal from './LitShareModal'
// import ExampleModal from './ExampleModal/src/App'
// import ExampleModal from './ExampleModal'
// import ShareModal from './ShareModal'

type NavigationPanelProps = {
  onConnect: () => Promise<void>
}

type ConnectButtonProps = {
  onConnect: () => Promise<void>
}

const NavigationPanel = ({ onConnect }: NavigationPanelProps): JSX.Element => {
  const { walletAddress } = useXmtp()

  return (
    <div className="flex-grow flex flex-col">
      {walletAddress ? (
        <ConversationsPanel />
      ) : (
        <NoWalletConnectedMessage>
          <ConnectButton onConnect={onConnect} />
        </NoWalletConnectedMessage>
      )}
    </div>
  )
}

const NoWalletConnectedMessage: React.FC = ({ children }) => {
  return (
    <div className="flex flex-col flex-grow justify-center">
      <div className="flex flex-col items-center px-4 text-center">
        <LinkIcon
          className="h-8 w-8 mb-1 stroke-n-200 md:stroke-n-300"
          aria-hidden="true"
        />
        <p className="text-xl md:text-lg text-n-200 md:text-n-300 font-bold">
          No wallet connected
        </p>
        <p className="text-lx md:text-md text-n-200 font-normal">
          Please connect a wallet to begin
        </p>
      </div>
      {children}
    </div>
  )
}

const ConnectButton = ({ onConnect }: ConnectButtonProps): JSX.Element => {
  return (
    <button
      onClick={onConnect}
      className="rounded border border-l-300 mx-auto my-4 text-l-300 hover:text-white hover:bg-l-400 hover:border-l-400 hover:fill-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-n-100 focus-visible:outline-none active:bg-l-500 active:border-l-500 active:text-l-100 active:ring-0"
    >
      <div className="flex items-center justify-center text-xs font-semibold px-4 py-1">
        Connect your wallet
        <ArrowSmRightIcon className="h-4" />
      </div>
    </button>
  )
}

const ConversationsPanel = (): JSX.Element => {
  const { conversations, loadingConversations, client } = useXmtp()
  const [ filterMode, setFilterMode ] = useState(false)
  const [ loading, setLoading ] = useState(false)
  const [ verifiedArray, setVerifiedArray ] = useState<any[][]>([])
  const [ modalOutput, setModalOutput ] = useState()

  const chain = 'rinkeby'
  const baseUrl = 'http://localhost:3000'
  const peers = conversations.map(conversation => conversation.peerAddress)

  async function connect() {
    setFilterMode(!filterMode)
    if (filterMode) {
      return
    }

    setLoading(true)

    const client = new LitJsSdk.LitNodeClient({ alertWhenUnauthorized: false })
    await client.connect()
    const authSig = await LitJsSdk.checkAndSignAuthMessage({chain})

    async function getVerified(address: string) {

      const getAccessControlConditions = (address: string) => {
        let rtn = structuredClone(modalOutput.accessControlConditions)
        rtn[0].parameters[0] = address

        console.log('getAccessControlConditions', rtn)
        return rtn
      }
    
      const getResourceId = () => {
        const rtn = {
          baseUrl,
          path: '/' + Math.random(), // this would normally be your url path, like "/webpage.html" for example
          orgId: "",
          role: "",
          extraData: ""
        }

        // console.log(rtn)
        return rtn
      }
      
      const accessControlConditions = getAccessControlConditions(address)
      const resourceId = getResourceId()
  
      try {
        await client.saveSigningCondition({ accessControlConditions, chain, authSig, resourceId })
      } catch (err) {
        console.log('error: ', err)
      }

      try {
        const jwt = await client.getSignedToken({
          accessControlConditions, chain, authSig, resourceId
        })
    
        const { verified } = LitJsSdk.verifyJwt({ jwt })
        return [address, verified]
      }
      catch (err) {
        return [address, false]
      }
    }

    const promises = peers.map(peer => getVerified(peer))
    const rtn = await Promise.all(promises)

    setVerifiedArray(rtn)
    setLoading(false)
  }

  let verifiedObject: any = {}
  if (verifiedArray.length) {
    verifiedArray.forEach( ([ address, isVerified ]) => {
      verifiedObject[address] = isVerified
    })
  }

  if (!client) {
    return (
      <Loader
        headingText="Awaiting signatures..."
        subHeadingText="Use your wallet to sign"
        isLoading
      />
    )
  }
  if (loadingConversations || loading) {
    return (
      <Loader
        headingText="Loading conversations..."
        subHeadingText="Please wait a moment"
        isLoading
      />
    )
  }

  let filtered = conversations
  if (filterMode) {
    filtered = conversations.filter(
      conversation => verifiedObject[conversation.peerAddress]
    )
  }

  const rtn = filtered && filtered.length > 0 ? (
    <nav className="flex-1 pb-4 space-y-1">
      <LitShareModal
        setModalOutput={setModalOutput}
      />

      {/* <ExampleModal /> */}

      <ConversationsList conversations={filtered} />
    </nav>
  ) : (
    <NoConversationsMessage />
  )

  return (
    <div>
      <button
        onClick={connect}
        disabled={modalOutput === undefined}
        title={JSON.stringify(modalOutput)}
      >
        {filterMode ? 'See All Messages' : 'Filter Messages'}
      </button>

      {rtn}
    </div>
  )
}

const NoConversationsMessage = (): JSX.Element => {
  return (
    <div className="flex flex-col flex-grow justify-center">
      <div className="flex flex-col items-center px-4 text-center">
        <ChatIcon
          className="h-8 w-8 mb-1 stroke-n-200 md:stroke-n-300"
          aria-hidden="true"
        />
        <p className="text-xl md:text-lg text-n-200 md:text-n-300 font-bold">
          Your message list is empty
        </p>
        <p className="text-lx md:text-md text-n-200 font-normal">
          There are no messages in this wallet
        </p>
      </div>
    </div>
  )
}

export default NavigationPanel
