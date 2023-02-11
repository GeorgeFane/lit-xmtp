import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'

import Metamask from './react-metamask-medium/src/Metamask'
import Radios from './Radios'
import BasicCard from './BasicCard'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [value, setValue] = React.useState('Week');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div>
      <Button onClick={handleOpen} variant='outlined'>
        Subscribe
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Metamask />
          <br />

          <Typography id="modal-modal-title" variant="h6" component="h2">
            Subscription Manager
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Read all the news that's fit to print, for just $1 per week
          </Typography>

          <Divider>
            <Chip label='OPTIONS' />
          </Divider>

          <Radios
            value={value}
            handleChange={handleChange}
          />
          <BasicCard
            value={value}
          />
        </Box>
      </Modal>
    </div>
  );
}
