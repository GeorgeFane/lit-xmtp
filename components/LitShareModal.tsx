import ShareModal from 'lit-share-modal';
import { useState } from 'react';

type AppProps = {
  setModalOutput: (x: object) => void
}

const App = ({ setModalOutput }: AppProps) => {
  const [openShareModal, setOpenShareModal] = useState(false);

  const onAccessControlConditionsSelected = (shareModalOutput: object) => {
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
      />
    </div>

  );
}

export default App;
