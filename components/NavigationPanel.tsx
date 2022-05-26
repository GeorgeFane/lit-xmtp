import { LinkIcon } from '@heroicons/react/outline'
import { ChatIcon } from '@heroicons/react/outline'
import { ArrowSmRightIcon } from '@heroicons/react/solid'
import useXmtp from '../hooks/useXmtp'
import ConversationsList from './ConversationsList'
import Loader from './Loader'

import { useEffect, useState } from 'react'
import LitJsSdk from 'lit-js-sdk'

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
  const [ verifiedArray, setVerifiedArray ] = useState<any[][]>([])

  const chain = 'rinkeby'
  const baseUrl = 'http://localhost:3000'

  const peers = conversations.map(conversation => conversation.peerAddress)

  const getAccessControlConditions = (address: string) => ([
    {
      contractAddress: '0x5B8B635c2665791cf62fe429cB149EaB42A3cEd8',
      standardContractType: 'ERC20',
      chain,
      method: 'balanceOf',
      parameters: [
        address
      ],
      returnValueTest: {
        comparator: '>',
        value: '0'
      }
    }
  ])

  const getResourceId = (address: string) => ({
    baseUrl,
    path: '/dm/' + address, // this would normally be your url path, like "/webpage.html" for example
    orgId: "",
    role: "",
    extraData: ""
  })

  async function connect() {
    setFilterMode(!filterMode)
    if (filterMode) {
      return
    }

    const client = new LitJsSdk.LitNodeClient({ alertWhenUnauthorized: false })
    await client.connect()
    const authSig = await LitJsSdk.checkAndSignAuthMessage({chain})

    async function getVerified(address: string) {
      const accessControlConditions = getAccessControlConditions(address)
      const resourceId = getResourceId(address)
  
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
    console.log('map', rtn)
    setVerifiedArray(rtn)
  }

  console.log('verifiedArray', verifiedArray)
  let verifiedObject: any = {}
  if (verifiedArray.length) {
    verifiedArray.forEach( ([ address, isVerified ]) => {
      verifiedObject[address] = isVerified
    })
  }
  console.log('verifiedObject', verifiedObject)

  if (!client) {
    return (
      <Loader
        headingText="Awaiting signatures..."
        subHeadingText="Use your wallet to sign"
        isLoading
      />
    )
  }
  if (loadingConversations) {
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

  return filtered && filtered.length > 0 ? (
    <nav className="flex-1 pb-4 space-y-1">
      <button onClick={connect}>
        {filterMode ? 'See All Messages' : 'Filter Messages'}
      </button>
      <ConversationsList conversations={filtered} />
    </nav>
  ) : (
    <NoConversationsMessage />
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
