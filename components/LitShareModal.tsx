import ShareModal from 'lit-share-modal';
import { useState } from 'react';
import '/workspace/example-chat-react/node_modules/lit-share-modal/dist/style.css'

const App = ({ setModalOutput }) => {
  const [openShareModal, setOpenShareModal] = useState(false);

  const onAccessControlConditionsSelected = (shareModalOutput: object) => {
    // do things with share modal output
    try {
      setModalOutput(shareModalOutput)

    } catch (e) {
      console.log(e)
    }
    console.log('shareModalOutput', shareModalOutput)
  }

  return (
    <div className={'App'}>
      <button
        onClick={() => setOpenShareModal(true)}
      >
        Open Modal
      </button>

      <ShareModal
        onClose={() => setOpenShareModal(false)}
        showModal={openShareModal}
        onAccessControlConditionsSelected={onAccessControlConditionsSelected}
        injectCSS={false}
      />
    </div>

  );
}

export default App;
