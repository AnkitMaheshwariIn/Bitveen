import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';

export const SaveForLater = ({
  options = {
    isOpen: false,
    handleClose: () => {}
  }
}) => {
  return (
    <>
      {options.isOpen &&
        <Dialog
          fullScreen
          open={options.isOpen}
          onClose={options.handleClose}
        >
          <AppBar sx={{ position: 'relative' }}
            style={{
              boxShadow: '0px 2px 2px -1px rgb(0 0 0 / 20%), 0px 2px 1px 0px rgb(0 0 0 / 5%), 0px 1px 2px 0px rgb(0 0 0 / 5%)'
            }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="Save for later"
              >
                <BookmarkAddedIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Your saved articles
              </Typography>
              <IconButton
                edge="end"
                color="inherit"
                onClick={options.handleClose}
              >
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <List>
            {/* <ListItem button>
              <ListItemText primary="Phone ringtone" secondary="Titania" />
            </ListItem>
            <Divider />
            <ListItem button>
              <ListItemText
                primary="Default notification ringtone"
                secondary="Tethys"
              />
            </ListItem> */}
          </List>
        </Dialog>
      }
    </>
  )
}
