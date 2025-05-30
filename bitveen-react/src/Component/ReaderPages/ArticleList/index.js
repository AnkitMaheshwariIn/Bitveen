import React, { useState, useEffect } from 'react';
import './index.css';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { getArticlesByUsername } from '../../../Service/api.service';
import useUserToken from '../../App/useUserToken';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { ConfirmDialog } from '../../Common/Providers/DialogProvider';
import { useNavigate, useParams } from "react-router-dom";
import { MenuProvider } from '../../Common/Providers/MenuProvider';
import { SnackbarProvider } from '../../Common/Providers/SnackbarProvider';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Button, CardActions } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export const ArticleList = () => {
  const navigate = useNavigate();

  // import userToken
  const { userToken } = useUserToken();
  const [articles, setArticles] = useState();
  const [dialogOptions, setDialogOptions] = useState();
  const [menuOptions, setMenuOptions] = useState();
  const [snackbarOptions, setSnackbarOptions] = useState();
  const [displayName, setDisplayName] = useState()
   /*
  useEffect(() => {
    // Runs on the first render
    // And any time any dependency value changes
  }, [prop, state]);
  */

  /*
  useEffect(() => {
    // Runs on every render
  });
  */

  const { linkPath } = useParams();

  useEffect(() => {
    if (linkPath && linkPath.startsWith('@')) {
      getArticles(linkPath.substring(1)) // using .substring(1) to remove @ from linkPath
    }
  }, []);

  const getArticles = async (userName) => {
    try {
      const res = await getArticlesByUsername(userName)
      const data = res.data.data ? res.data.data : {}
      // console.log("articles", res.data)
      if (data && data.articleList) {
        setArticles(data.articleList)
        setDisplayName(data.displayName)
      }
    } catch (error) {
      console.log('Saving failed: ', error)
    }
  };

  const getParsedDate = date => {
    if (date !== null && date !== '') {
      return new Date(date).toLocaleDateString('en-IN', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      })
    } else {
      return 'N/A'
    }
  }

  const navigateToURL = (url) => {
    navigate(url);
  }

  return (
    <>
      <Typography variant="overline" display="block" gutterBottom className='app-title-arp'>
        {displayName ? displayName : <Skeleton width="200px" />}
      </Typography>
      { (articles && articles.length == 0) &&
        <Typography variant="caption" display="block" gutterBottom className='app-title-arp'>
          No Article Found
        </Typography>
      }
      <ConfirmDialog options={dialogOptions} />
      <MenuProvider options={menuOptions} />
      <SnackbarProvider options={snackbarOptions} />

      {/* show skeleton, when articles loading/not loaded yet */}
      { (!articles || articles.length == 0) &&
        <Box className="article-box">
          {Array.from(new Array(9)).map((item, index) => {
            return (
              <span key={index} className="article-card shadow-none">
                <Card variant="outlined">
                  <CardContent sx={{ paddingBottom: '2px' }}>
                    <Box sx={{ pt: 0.5 }}>
                      <Skeleton width="60%" />
                    </Box>
                  </CardContent>
                  <CardContent sx={{ paddingTop: '0px', paddingBottom: '0px' }}>
                    <Box sx={{ pt: 0.5 }}>
                      <Skeleton variant="rectangular" sx={{ height: '110px' }} />
                    </Box>
                  </CardContent>
                  <CardContent sx={{ paddingTop: '2px' }}>
                    <Box sx={{ pt: 0.5 }}>
                      <Skeleton />
                    </Box>
                  </CardContent>
                </Card>
              </span>
            )
          })}
        </Box>
      }

      { articles && articles.length > 0 &&
        <Box className="article-box">
          {articles && articles.map((article, index) => {
            const ARTICLE_URL = 'https://bitveen.com/' + article.articleLink;

            return (
              <span key={index} className="article-card">
                <Card variant="outlined">
                  <CardHeader
                    sx={{ zoom: 0.8 }}
                    subheader={ getParsedDate(article.createdAt) }
                  />
                  <Divider />
                  {article.headerImage &&
                    <CardMedia
                      component="img"
                      height="140"
                      image={article.headerImage}
                    />
                  }
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                      <span dangerouslySetInnerHTML={{ __html: article.title }} />
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <span dangerouslySetInnerHTML={{ __html: article.subTitle }} />
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Box sx={{ width: '100%' }}>
                      <Button
                        size="small"
                        endIcon={<KeyboardArrowRightIcon />} 
                        onClick={() => navigateToURL(`/${article.articleLink}`)}>
                          Read more
                      </Button>
                      <Box sx={{ float: 'right' }}>
                      <CopyToClipboard text={ARTICLE_URL}
                            onCopy={() => {
                              // show snackbar that article is saved
                              setSnackbarOptions({
                                isOpen: true,
                                message: 'Link copied',
                                severity: 'success', // error, warning, info, success
                                vertical: 'bottom',
                                horizontal: 'left',
                                duration: 3000,
                                handleClose: () => {
                                    setSnackbarOptions({ isOpen: false })
                                }
                              })
                            }}
                          >
                          <Tooltip title="Copy link">
                            <IconButton
                              size="small"
                              sx={{ ml: 2, background: '#f2f3f3' }}
                            >
                              <ContentCopyIcon sx={{ color: '#80868a' }} />
                            </IconButton>
                          </Tooltip>
                      </CopyToClipboard>
                      </Box>
                    </Box>
                  </CardActions>
                </Card>
              </span>
            )
          })}
        </Box>
      }
    </>
  );
}