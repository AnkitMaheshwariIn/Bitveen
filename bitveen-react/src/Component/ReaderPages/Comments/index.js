import React from 'react'
import './index.css';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import { TextareaAutosize } from '@mui/base';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { red } from '@mui/material/colors';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';

export const Comments = () => {
  return (
    <>
      <div className="article-wrapper">
        {/* top input box of comment */}
        <Box sx={{ width: '100%' }}>
          <Typography gutterBottom variant="h5" component="span" sx={{ fontWeight: 'bold' }}>
            Top Responses (37)
            <Tooltip title="More">
              <IconButton 
                size="small">
                <UnfoldMoreIcon color='primary'/>
              </IconButton>
            </Tooltip>
          </Typography>
          <Box sx={{ float: 'right' }}>
            <Button
              variant='outlined'
              size="small">
                Subscribe
            </Button>
          </Box>
        </Box>

        {/* displaying comments here */}
        <Card sx={{ marginTop: 2 }}>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                R
              </Avatar>
            }
            title="Shrimp and Chorizo Paella"
            // subheader="September 14, 2016"
          />
          <CardContent sx={{ paddingTop: 0, paddingBottom: 0 }}>
            <Typography variant="body2" color="text.secondary">
              <TextareaAutosize 
                label="Multiline"
                multiline
                rows={4}
                maxRows={10}
                style={{ 
                  background: '#fcfdfe',
                  width: 'calc(100% - 45px)',
                  height: '100px',
                  border: 0,
                  resize: 'none',
                  padding: '20px',
                  borderRadius: '5px'
                }}
                placeholder = 'Write your response here...'
              />
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton aria-label="Bold">
              <FormatBoldIcon />
            </IconButton>
            <IconButton aria-label="Italic">
              <FormatItalicIcon />
            </IconButton>
          </CardActions>
        </Card>
      </div>
    </>
  )
}
