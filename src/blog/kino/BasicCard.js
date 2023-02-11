import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export default function BasicCard({ value }) {
  const days_mapping = {
    Week: 7,
    Month: 30,
    Year: 365
  }
  const days = days_mapping[value]
  
  const weeks_mapping = {
    Week: 1,
    Month: 4,
    Year: 52
  }
  const weeks = weeks_mapping[value]

  const rate = 10 ** 18 / 7 / 24 / 60 / 60;
  // 1 dollar per week, with 18 decimals, divided by 7 days, 24 hours, 60 minutes, and 60 seconds

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {days} days
        </Typography>
        <Typography variant="h5" component="div">
          {value}ly Subscription
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          ${weeks}.00
        </Typography>
        <Typography variant="body2">
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button>Subscribe</Button>
      </CardActions>
    </Card>
  );
}
