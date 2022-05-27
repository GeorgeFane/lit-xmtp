# XMTP Chat with CyberConnect Filtering

[Deployed Site](https://lit-xmtp-georgefane.vercel.app/)

[Demo Video](https://youtu.be/QTd6Cz9Ak_U)

[Original Demo Video on Zoom](https://umich.zoom.us/rec/share/2RKIcsiemFo8PxLIjnwC7asRJ6LDi2JVVgD7gCk0hkKQWjE6Ta_RtaGQHp4SrNt1.j35E2Mb63c3e9lZT?startTime=1653631725000)

[Bounty Specs](https://gitcoin.co/issue/28892)

## Changes from original XMTP

[/components/LitShareModal.tsx](https://github.com/GeorgeFane/lit-xmtp/blob/main/components/LitShareModal.tsx) uses the sample code [here](https://github.com/LIT-Protocol/lit-share-modal-v2#usage), which Lit Protocol wrote

## Lit Protocol Details

[Relevant Lit Protocol Docs](https://developer.litprotocol.com/docs/littools/jssdk/dynamiccontent/#provisoning-access-to-a-resource)

### Normal Lit Protocol Steps

1. As mentioned in the video about Lit Protocol, accessControlConditions (like your address must have own least 1 NFT in this contract) are normally created to protect a specific resourceId (usually a URL)

2. Both are passed into saveSigningCondition(), which ensures that people must satisfy the accessControlConditions to access the resourceId

3. Passing accessControlConditions to getSignedToken() will give you a JSON web token (JWT), which says whether you are satisfactory/verified in encoded form. 

4. The JWT is normally stored in the browser as a cookie, and when you visit the resourceId, the page will decode the JWT (verifyJwt()) to see if you are verified.

### Lit Protocol and This Repo

In this repo, for each access condition specified by the Lit modal, I create an accessControlConditions, resourceId, JWT, and decoded JWT in quick succession.

A typical accessControlConditions looks like this:
```
const accessControlConditions = [
  {
    contractAddress: '0x319ba3aab86e04a37053e984bd411b2c63bf229e',
    standardContractType: 'ERC721',
    chain,
    method: 'balanceOf',
    parameters: [
      ':userAddress'
    ],
    returnValueTest: {
      comparator: '>',
      value: '0'
    }
  }
]
```

The important bit is the ':userAddress' in parameters, which checks if you, the user, have >0 NFTs from the specified contract. For each contact you have, I replace ':userAddress' with that contact's address and create a random URL for the resourceId. No joke, the URL is baseUrl followed by the string form of a Math.random() call.

I get a JWT for each contact, which I immediately decode/verify to see if each contact passes the accessControlConditions. From the decoded JWT I grab the 'verified' key, a boolean, and store it in a mapping of contact address => verified boolean, which I use as a mask to filter the conversations that show up in your list on the right.

## Alternatives to Lit Protocol

Lit Protocol is very well suited to protecting resources, but I feel it is an odd choice when the user themselves wants to control what they see. It was also complex to integrate, with XMTP being in Next.js and TypeScript while Lit Share Modal v2 is in React and JSX. With Lit there are many steps to see if an address has certain tokens, and because we don't really need to protect a resource, something like [Covalent API](https://www.covalenthq.com/docs/api/#/) is easier to integrate and faster to run.

I'm sure there are many APIs out there like Covalent that retrieve an address's token balances across contracts on a network. Sticking a GET request into a useEffect or a button's onClick can trigger contact filtering, with the same result as using Lit Protocol.

That being said, Lit Protocol is a fantastic product, and I had fun and learned a lot in doing this bounty.

## How to Deploy

Fork this repo and import into Vercel ([tutorial](https://vercel.com/guides/deploying-nextjs-with-vercel#vercel-for-git)).

# ORIGINAL README BELOW

# React Chat Example

![Test](https://github.com/xmtp/example-chat-react/actions/workflows/test.yml/badge.svg)
![Lint](https://github.com/xmtp/example-chat-react/actions/workflows/lint.yml/badge.svg)
![Build](https://github.com/xmtp/example-chat-react/actions/workflows/build.yml/badge.svg)

![x-red-sm](https://user-images.githubusercontent.com/510695/163488403-1fb37e86-c673-4b48-954e-8460ae4d4b05.png)

**This example chat application demonstrates the core concepts and capabilities of the XMTP Client SDK.** It is built with React, [Next.js](https://nextjs.org/), and the [`xmtp-js`](https://github.com/xmtp/xmtp-js) client library. The application is capable of sending and receiving messages via the [XMTP Labs](https://xmtp.com) development network, with no performance guarantees and [notable limitations](#limitations) to its functionality.

It is maintained by [XMTP Labs](https://xmtp.com) and distributed under [MIT License](./LICENSE) for learning about and developing applications that utilize the XMTP decentralized communication protocol.

**All wallets and messages are forcibly deleted from the development network on Mondays.**

## Disclaimer

The XMTP protocol is in the early stages of development. This software is being provided for evaluation, feedback, and community contribution. It has not undergone a formal security audit and is not intended for production applications. Significant breaking revisions should be expected.

## Getting Started

### Configure Infura

Add your Infura ID to `.env.local` in the project's root.

```
NEXT_PUBLIC_INFURA_ID={YOUR_INFURA_ID}
```

If you do not have an Infura ID, you can follow [these instructions](https://blog.infura.io/getting-started-with-infura-28e41844cc89/) to get one.

_This example comes preconfigured with an Infura ID provided for demonstration purposes. If you plan to fork or host it, you must use your own Infura ID as detailed above._

### Install the package

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Functionality

### Wallet Connections

[`Web3Modal`](https://github.com/Web3Modal/web3modal) is used to inject a Metamask, Coinbase Wallet, or WalletConnect provider through [`ethers`](https://docs.ethers.io/v5/). Methods for connecting and disconnecting are included in **WalletContext** alongside the provider, signer, wallet address, and ENS utilities.

In order to use the application's chat functionality, the connected wallet must provide two signatures:

1. A one-time signature that is used to generate the wallet's private XMTP identity
2. A signature that is used on application start-up to initialize the XMTP client with that identity

### Chat Conversations

The application utilizes the `xmtp-js` [Conversations](https://github.com/xmtp/xmtp-js#conversations) abstraction to list the available conversations for a connected wallet and to listen for or create new conversations. For each convesation, it gets existing messages and listens for or creates new messages. Conversations and messages are kept in a lightweight store and made available through **XmtpContext** alongside the client and its methods.

### Limitations

The application's functionality is limited by current work-in-progress on the `xmtp-js` client.

#### Messages cannot yet be directed to wallets that have not used XMTP

The client will throw an error when attempting to lookup an address that does not have an identity broadcast on the XMTP network.

This limitation will be mitigated very soon by the example application's UI, and resolved soon via improvements to the `xmtp-js` library that will allow messages to be created even if the intended recipient has not yet generated its keys.
