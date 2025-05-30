import React, { useState, useEffect } from 'react';
import './index.css';
import { Header } from '../../SitePages/Header'
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { deleteArticle, getArticlesByUser } from '../../../Service/api.service';
import useUserToken from '../../App/useUserToken';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CreateIcon from '@mui/icons-material/Create';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { ConfirmDialog } from '../../Common/Providers/DialogProvider';
import { useNavigate } from "react-router-dom";
import { MenuProvider } from '../../Common/Providers/MenuProvider';
import { SnackbarProvider } from '../../Common/Providers/SnackbarProvider';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Button, CardActionArea, CardActions } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import CardHeader from '@mui/material/CardHeader';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export const Articles = () => {
  const navigate = useNavigate();

  // import userToken
  const { userToken } = useUserToken();
  const [articles, setArticles] = useState();
  const [dialogOptions, setDialogOptions] = useState();
  const [menuOptions, setMenuOptions] = useState();
  const [snackbarOptions, setSnackbarOptions] = useState();

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

  useEffect(() => {
    // Runs only on the first render
    if (!userToken) {
      window.location.href = '/';
    } else {
      getArticles(userToken.userUUID)
    }
  }, []);

  const getArticles = async (userUUID) => {
    try {
      // console.log('userUUID', userUUID)
      const res = await getArticlesByUser(userUUID)
      // console.log("articles", res.data)
      if (res.data) {
        setArticles(res.data)
      }
    } catch (error) {
        console.log('Fetch failed: ', error)
        setSnackbarOptions({
          isOpen: true,
          message: (error.response && error.response.data && error.response.data.message) ? error.response.data.message : error.message,
          severity: 'error', // error, warning, info, success
          vertical: 'bottom',
          horizontal: 'left',
          duration: 3000,
          handleClose: () => {
              setSnackbarOptions({ isOpen: false })
          }
        })
    }
  };

  const deleteArticleByArticleUUID = async (articleUUID) => {
    try {
      // console.log('deleteArticleByArticleUUID')
      const res = await deleteArticle(articleUUID)
      // console.log("articles", res.data)
      if (res.data && res.data.acknowledged && res.data.deletedCount == 1 &&
          articles && articles.length > 0) {
        // show snackbar that article is deleted
        setSnackbarOptions({
          isOpen: true,
          message: 'Article deleted successfully!',
          severity: 'success', // error, warning, info, success
          handleClose: () => {
            setSnackbarOptions({ isOpen: false })
          }
        })
        /**
         * article deleted from db, filter articles list by removing
         * article with articleUUID so that this article will not be
         * visible in list.
         */
        setArticles([...articles.filter(x => x.uuid != articleUUID)])
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
      <Header/>
      <Typography variant="overline" display="block" gutterBottom className='app-title-arp'>
        My Articles
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
      { !articles &&
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

      { articles && articles.length === 0 &&
        <Box className="article-box" sx={{ position: 'relative', top: '25px' }}>
          <span className="article-card">
            <Card variant="none">
              <CardContent sx={{ paddingLeft: '0px', paddingTop: '0px', paddingBottom: '0px' }}>
                <Box sx={{ pt: 0.5 }}>
                  <Button
                    variant="outlined"
                    startIcon={<CreateIcon />} 
                    onClick={() => navigateToURL(`/new-article`)}>
                      Write an Article
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </span>
        </Box>
      }

      {/* show articles, when articles loaded */}
      { articles && articles.length > 0 &&
        <Box className="article-box">
          {articles && articles.map((article, index) => {
            const ARTICLE_URL = 'https://bitveen.com/' + article.articleLink;
            
            return (
              <span key={index} className="article-card">
                <Card variant="outlined">
                  <CardHeader
                    sx={{ zoom: 0.8, paddingBottom: 0, float: 'right' }}
                    subheader={ getParsedDate(article.createdAt) }
                  />
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

                        <Tooltip title="More">
                          <IconButton 
                            size="small"
                            onClick={(e) => setMenuOptions({
                              eventCurrentTarget: e.currentTarget,
                              isOpen: true,
                              menuItems: [
                                {
                                  label: 'View',
                                  icon: () => {
                                    return (
                                      <VisibilityIcon fontSize="small" />
                                    )
                                  },
                                  handleItemClose: () => { navigateToURL(`/${article.articleLink}`) }  
                                },
                                {
                                  label: 'Edit',
                                  icon: () => {
                                    return (
                                      <CreateIcon fontSize="small" />
                                    )
                                  },
                                  handleItemClose: () => { navigateToURL(`/a/edit/${article.uuid}`) }  
                                },
                                {
                                  label: 'Delete',
                                  color: 'error',
                                  icon: () => {
                                    return (
                                      <DeleteIcon color="error" fontSize="small" />
                                    )
                                  },
                                  handleItemClose: () => {
                                    // close menu
                                    setMenuOptions({ isOpen: false });
                                    // open dialog to ask for confirmation to delete
                                    setDialogOptions({
                                      isOpen: true,
                                      message: `Do you really want to delete this article?`,
                                      message2: ``,
                                      handleClose: () => {
                                        setDialogOptions({ isOpen: false })
                                      },
                                      handleSubmit: () => {
                                        deleteArticleByArticleUUID(article.uuid)
                                      }
                                    })
                                  }  
                                }
                              ],
                              handleClose: () => {
                                console.log('handleClose')
                                setMenuOptions({ isOpen: false })
                              }
                            })}>
                            <MoreVertIcon color='primary'/>
                          </IconButton>
                        </Tooltip>
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