import React from 'react';
import { Header } from '../Header'
import './index.css';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Grid } from '@mui/material';
import { useNavigate } from "react-router-dom";

export const Disclaimer = () => {
  const navigate = useNavigate();

  const navigateToURL = (url) => {
    navigate(url);
  }

  const bull = (
    <Box
      component="span"
      sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)', margin: '2px' }}
    >
      •
    </Box>
  );

  const card = (
    <React.Fragment>
      <Card>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent>
            <Typography sx={{ fontSize: 18, fontWeight: 'bold', color: '#fdcd3b' }} gutterBottom>
              Disclaimer
            </Typography>
          </CardContent>
        </Box>

      </Card>
    </React.Fragment>
  );

  const basicGrid = (
    <Grid container spacing={1} sx={{padding: '0% 5%'}}>
      <Grid item xs={12} md={12}>
        <h1>Disclaimer for Bitveen</h1>

        <p>If you require any more information or have any questions about our site's disclaimer, please feel free to contact us by email at bitveenblog@gmail.com</p>

        <h2>Disclaimers for Bitveen.com</h2>

        <p>All the information on this website - https://bitveen.com - is published in good faith and for general information purpose only. Bitveen.com does not make any warranties about the completeness, reliability and accuracy of this information. Any action you take upon the information you find on this website (Bitveen.com), is strictly at your own risk. Bitveen.com will not be liable for any losses and/or damages in connection with the use of our website.</p>

        <p>From our website, you can visit other websites by following hyperlinks to such external sites. While we strive to provide only quality links to useful and ethical websites, we have no control over the content and nature of these sites. These links to other websites do not imply a recommendation for all the content found on these sites. Site owners and content may change without notice and may occur before we have the opportunity to remove a link which may have gone 'bad'.</p>

        <p>Please be also aware that when you leave our website, other sites may have different privacy policies and terms which are beyond our control. Please be sure to check the Privacy Policies of these sites as well as their "Terms of Service" before engaging in any business or uploading any information.</p>

        <h2>Consent</h2>

        <p>By using our website, you hereby consent to our disclaimer and agree to its terms.</p>

        <h2>Update</h2>

        <p>Should we update, amend or make any changes to this document, those changes will be prominently posted here.</p>
      </Grid>
    </Grid>
  );

  return (
    <div className="home-page">
        <Header/>
        <Box sx={{ m: {xs: 4, md: 4} }}>
          <Card variant="none" sx={{ width: 'fit-content', margin: '0 auto' }}>{card}</Card>
        </Box>

        <Box sx={{ flexGrow: 1, m: {xs: 0, md: 2} }}>
          {basicGrid}
        </Box>
    </div>
  )
}
