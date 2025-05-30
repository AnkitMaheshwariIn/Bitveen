import React, { useState, useEffect } from 'react';
import './index.css';
// import EditorJS from '@editorjs/editorjs';
// import Configuration from './configuration';
import IconButton from '@mui/material/IconButton';
import { deleteArticleForLater, getArticleByLinkAPI, getSavedForLaterAPI, putFollowedAPI, saveArticleForLater, saveHeart } from '../../../Service/api.service';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import useUserToken from '../../App/useUserToken';
import { Header } from '../../SitePages/Header';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CreateIcon from '@mui/icons-material/Create';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import { Heart } from '../../Common/Providers/HeartProvider';
import Stack from '@mui/material/Stack';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import DoneIcon from '@mui/icons-material/Done';
import TwitterIcon from '@mui/icons-material/Twitter';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import Divider from '@mui/material/Divider';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, WhatsappShareButton } from "react-share";

import CardHeader from '@mui/material/CardHeader';
import { SnackbarProvider } from '../../Common/Providers/SnackbarProvider';
import { ConfirmDialog } from '../../Common/Providers/DialogProvider';
import { SaveForLater } from '../SaveForLater';
import { Skeleton } from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { createReactEditorJS } from 'react-editor-js'
import { EDITOR_JS_TOOLS } from './tools'
import { seo } from '../../Common/Helpers/seo';
import Chip from '@mui/material/Chip';

export const Article = () => {
  const navigate = useNavigate();
  const ReactEditorJS = createReactEditorJS()

  useEffect(() => {
    // wrap async call here: to avoid, useEffect must not return anything besides a function
    initEditor();
  }, []);

  // import userToken
  const { userToken } = useUserToken();
  let { linkPath } = useParams();
  const [articleObj, setArticleObj] = useState();
  const [editLink, setEditLink] = useState();
  const [commentCount, setCommentCount] = useState(0);
  const [heartCount, setHeartCount] = useState(0);
  const [isFollowed, setIsFollowed] = useState(null);
  const [isArticleSaved, setIsArticleSaved] = useState();
  const [snackbarOptions, setSnackbarOptions] = useState();
  const [dialogOptions, setDialogOptions] = useState();
  const [saveForLaterOptions, setSaveForLaterOptions] = useState(false);
  const [displayName, setDisplayName] = useState('')
  /**
   * use useRef only when live validation and single value like Number only need to use.
   * the useRef Hook allows you to persist values between renders.
   * it can be used to store a mutable value that does not cause a re-render when updated.
   * cons: value will not be render in template, so have to use useState too.
   */
  const heartCountRef = React.useRef(0);
  const [ARTICLE_URL, setARTICLE_URL] = useState('')

  const initEditor = async () => {
    // need linkPath to call an API, linkPath is an articleLink for API call.
    // console.log(linkPath);
    if (linkPath) {
      linkPath = linkPath.replace(/\//g, '');
      // call an API to get article, if linkPath is found
      getArticleByLink(linkPath);
      setARTICLE_URL('https://bitveen.com/' + linkPath);
    }
  }

  const getArticleByLink = async (articleLink) => {
    try {
      // console.log('articleLink', articleLink)
      const userUUID = (userToken && userToken.userUUID) ? userToken.userUUID : '';
      const res = await getArticleByLinkAPI(articleLink, userUUID)
      // console.log("article", res.data)
      // res.data is an articleObj
      if (res.data && res.data[0]) {

        if (res.data[0].userInfo && res.data[0].userInfo.firstName && res.data[0].userInfo.firstName) {
          setDisplayName(`${res.data[0].userInfo.firstName} ${res.data[0].userInfo.lastName}`);
        }
        setIsFollowed(res.data[0].userInfo.isFollowedByLoggedinUser)
        setHeartCount((res.data[0].heartCount && res.data[0].heartCount[0]) ? res.data[0].heartCount[0] : 0)
        setCommentCount(res.data[0].commentCount)

        setArticleObj(res.data[0])

        /** get save for later value */
        getSavedForLater(res.data[0].uuid)

        /**
         * call an EditorJS to initialize editor in read mode
         */
        setEditLink(`/a/edit/${res.data[0].uuid}`)
        // await new EditorJS(Configuration(res.data[0]));

        seo({
          title: res.data[0].title,
          metaDescription: res.data[0].subTitle,
          metaImage: res.data[0].headerImage
        });
      }
    } catch (error) {
      console.log('Saving failed: ', error)
    }
  };

  const signInIsRequired = () => {
    setSnackbarOptions({
      isOpen: true,
      message: 'Sign in is required!',
      severity: 'info', // error, warning, info, success
      vertical: 'bottom',
      horizontal: 'left',
      // action: (
      //   <Button color="inherit" size="small" onClick={openSaveForLater}>
      //     For later
      //   </Button>
      // ),
      duration: 6000,
      handleClose: () => {
        setSnackbarOptions({ isOpen: false })
      }
    })
  }

  const onHeartClicked = () => {
    if (!userToken || !userToken.userUUID) { signInIsRequired(); return; }
    // console.log('onHeartClicked')
    // update in ref to be used in click compl function
    heartCountRef.current = Number(heartCount) + 1;
    // set to be display in template
    setHeartCount(heartCountRef.current)
  }

  const onHeartClickComplete = async () => {
    // console.log('onHeartClickComplete')
    if (!userToken || !userToken.userUUID) { signInIsRequired(); return; }
    // call an API here to save heart count in db
    try {
      const heart = {
        userUUID: userToken.userUUID,
        articleUUID: articleObj.uuid,
        heartCount: heartCountRef.current
      }
      const res = await saveHeart(heart)
      // console.log("heart", res.data)
      if (res.data) {
        // res.data is an heartObj
      }
    } catch (error) {
      console.log('Saving failed: ', error)
    }
  }

  const onCommentClicked = () => {
    if (!userToken || !userToken.userUUID) { signInIsRequired(); return; }
    // console.log('onCommentClicked')
    setCommentCount(current => current + 1)
  }

  const openSaveForLater = () => {
    if (!userToken || !userToken.userUUID) { signInIsRequired(); return; }
    setSnackbarOptions({ isOpen: false })
    setSaveForLaterOptions({
      isOpen: true,
      handleClose: () => {
        setSaveForLaterOptions({ isOpen: false })
      }
    })
  }

  const handleSaveClick = async () => {
    if (!userToken || !userToken.userUUID) { signInIsRequired(); return; }
    if (!isArticleSaved) {
      // call an API to save article for later
      setIsArticleSaved(true)

      const resp = await saveArticleForLater({
        userUUID: userToken.userUUID,
        articleUUID: articleObj.uuid,
        articleUserUUID: articleObj.userUUID
      })

      if (resp.data.status === 'success') {
        // show snackbar that article is saved
        setSnackbarOptions({
          isOpen: true,
          message: 'Article Saved',
          severity: 'success', // error, warning, info, success
          vertical: 'bottom',
          horizontal: 'left',
          action: (
            <Button color="inherit" size="small" onClick={openSaveForLater}>
              For later
            </Button>
          ),
          duration: 6000,
          handleClose: () => {
            setSnackbarOptions({ isOpen: false })
          }
        })
      }

    } else {
      // remove article from saved for later
      // open dialog to ask for confirmation to remove
      setDialogOptions({
        isOpen: true,
        message: (
          <>
            Do you really want to remove this article from
            <Button color="inherit" size="small" onClick={openSaveForLater}>
              Save for later
            </Button>
            list?
          </>
        ),
        handleClose: () => {
          setDialogOptions({ isOpen: false }) // close dialog
        },
        handleSubmit: async () => {
          // call an API to remove from save for later
          setIsArticleSaved(false)

          const resp = await deleteArticleForLater({
            userUUID: userToken.userUUID,
            articleUUID: articleObj.uuid
          })

          if (resp.data.status === 'success') {
            // show snackbar that article is removed
            setSnackbarOptions({
              isOpen: true,
              message: 'Removed from Save for later',
              severity: 'info', // error, warning, info, success
              vertical: 'bottom',
              horizontal: 'left',
              duration: 3000,
              handleClose: () => {
                setSnackbarOptions({ isOpen: false })
              }
            })
          }
        }
      })
    }
  }

  const getSavedForLater = async (articleUUID) => {
    if (!userToken || !userToken.userUUID) { return; }
    try {
      // console.log('articleUUID', articleUUID)
      const res = await getSavedForLaterAPI(articleUUID, userToken.userUUID)
      // console.log("response", res.data)

      // res.data will show saved or not
      if (res.data && res.data.status === 'success') {
        setIsArticleSaved(true)
      }

    } catch (error) {
      console.log('get failed: ', error.response.data.message)
      /* setSnackbarOptions({
        isOpen: true,
        message: (error.response && error.response.data && error.response.data.message) ? error.response.data.message : error.message,
        severity: 'error', // error, warning, info, success
        vertical: 'bottom',
        horizontal: 'left',
        duration: 3000,
        handleClose: () => {
            setSnackbarOptions({ isOpen: false })
        }
      })*/
    }
  };

  const handleFollowClick = async () => {
    if (!userToken || !userToken.userUUID) { signInIsRequired(); return; }
    if (!isFollowed) {
      // call an API to follow user 
      setIsFollowed(true)

      const resp = await putFollowedAPI({
        isFollow: true,
        loggedInUserUUID: userToken.userUUID,
        followUUID: articleObj.userUUID
      })

      if (resp.data.status === 'success') {
        // show snackbar that user is followed
        setSnackbarOptions({
          isOpen: true,
          message: 'User Followed',
          severity: 'success', // error, warning, info, success
          vertical: 'bottom',
          horizontal: 'left',
          action: (
            <Button color="inherit" size="small" onClick={openSaveForLater}>
              Followed list
            </Button>
          ),
          duration: 6000,
          handleClose: () => {
            setSnackbarOptions({ isOpen: false })
          }
        })
      }

    } else {
      // remove user followed
      // open dialog to ask for confirmation to remove
      setDialogOptions({
        isOpen: true,
        message: (
          <>
            Do you really want to unfollow?
          </>
        ),
        handleClose: () => {
          setDialogOptions({ isOpen: false }) // close dialog
        },
        handleSubmit: async () => {
          // call an API to unfollow
          setIsFollowed(false)

          const resp = await putFollowedAPI({
            isFollow: false,
            loggedInUserUUID: userToken.userUUID,
            followUUID: articleObj.userUUID
          })

          if (resp.data.status === 'success') {
            // show snackbar that user is unfollowed
            setSnackbarOptions({
              isOpen: true,
              message: 'Unfollowed successfully',
              severity: 'info', // error, warning, info, success
              vertical: 'bottom',
              horizontal: 'left',
              duration: 3000,
              handleClose: () => {
                setSnackbarOptions({ isOpen: false })
              }
            })
          }
        }
      })
    }
  }

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

  const stringAvatar = (name) => {
    if (!name) return '';
    return {
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`
    };
  }

  const navigateToURL = (url) => {
    navigate(url, { replace: true });
  }

  return (
    <>
      {/* 
        <title>{`${articleObj ? articleObj.title : ''} | Bitveen.com`}</title>
        <link rel="canonical" href="https://www.bitveen.com/" />
        <meta name="title" content={`${articleObj ? articleObj.title : ''} | Bitveen.com`} />
        <meta name="description" content={`${articleObj ? articleObj.subTitle : ''} | by ${displayName}`} />
        <meta property="og:title" content={`${articleObj ? articleObj.title : ''} | Bitveen.com`} />
        <meta property="og:description" content={`${articleObj ? articleObj.subTitle : ''} | by ${displayName}`} />
        <meta property="og:image" content={articleObj ? articleObj.headerImage : ''} />
        <meta property="og:url" content={ARTICLE_URL} />
      */}
    
      <Header />
      {userToken && articleObj && (userToken.userUUID == articleObj.userUUID) && (
        <h1 className='App-title' style={{ marginBottom: '0px' }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
          >
            <div style={{ display: 'inline-block', float: 'right', marginRight: '20px' }}>
              {editLink &&
                <Button sx={{ ml: 1, mb: 1 }} size="small" variant="outlined" color="error"
                  startIcon={<CreateIcon />} component={Link} to={editLink}>
                  Edit
                </Button>
              }
            </div>
          </Typography>
        </h1>
      )}

      <div className="article-wrapper">
        {/* article hear user details and share options */}
        {articleObj && (
          <>
            <SnackbarProvider options={snackbarOptions} />
            <ConfirmDialog options={dialogOptions} />
            <SaveForLater options={saveForLaterOptions} />
            <div className="ce-block">
              <div className="ce-block__content">
                {/* box to be displayed below the header and above the actual article content */}
                <Box sx={{ display: 'inline-block', alignItems: 'right', width: '100%' }}>
                  <Box className="user-info-box" sx={{ float: 'left' }}>
                    <CardHeader
                      sx={{ p: 0 }}
                      avatar={
                          <Avatar
                            className='cursor-pointer'
                            sx={{ color: '#173B53', background: 'linear-gradient(110deg, rgb(253, 205, 59) 60%, rgb(255, 237, 75) 60%)' }}
                            alt={displayName}
                            {...stringAvatar(displayName)}
                            onClick={() => navigateToURL(`/@${articleObj.userInfo.username}`)}
                          ></Avatar>
                      }
                      title={(
                        <>
                          {displayName ?
                            <span className='cursor-pointer' onClick={() => navigateToURL(`/@${articleObj.userInfo.username}`)}>
                              {displayName}</span>
                            : <Skeleton />
                          }
                          {(isFollowed == true || isFollowed == false) &&
                            <Button variant={isFollowed ? 'outlined' : 'contained'} size="small" color="success"
                              style={{
                                bottom: '6px',
                                left: '12px',
                                zoom: '0.7'
                              }}
                              onClick={handleFollowClick}
                            >
                              {isFollowed ?
                                (
                                  <>
                                    <DoneIcon />
                                    Following
                                  </>
                                ) : 'Follow'
                              }
                            </Button>
                          }
                        </>
                      )}
                      subheader={(
                        <Stack
                          direction="row"
                          divider={<Divider orientation="vertical" flexItem />}
                          spacing={0.5}
                        >
                          {articleObj.userInfo.followersCount > 0 && <span>{articleObj.userInfo.followersCount} followers</span>}
                          <span>{getParsedDate(articleObj.createdAt)}</span>
                        </Stack>
                      )}
                    />
                  </Box>
                  <Box sx={{ float: 'right' }}>
                    <Stack direction="row" spacing={0.5}>

                      <WhatsappShareButton url={ARTICLE_URL} title={articleObj.title + ' - ' + articleObj.subTitle}>
                        <Tooltip title="Share on WhatsApp">
                          <WhatsAppIcon sx={{ color: '#00d95e' }} />
                        </Tooltip>
                      </WhatsappShareButton>

                      <FacebookShareButton url={ARTICLE_URL} title={articleObj.title + ' - ' + articleObj.subTitle}>
                        <Tooltip title="Share on Facebook">
                          <FacebookRoundedIcon sx={{ color: '#347eff' }} />
                        </Tooltip>
                      </FacebookShareButton>

                      <TwitterShareButton url={ARTICLE_URL} title={articleObj.title + ' - ' + articleObj.subTitle}>
                        <Tooltip title="Share on Twitter">
                          <TwitterIcon sx={{ color: '#34ccff' }} />
                        </Tooltip>
                      </TwitterShareButton>

                      <LinkedinShareButton url={ARTICLE_URL} title={articleObj.title + ' - ' + articleObj.subTitle}>
                        <Tooltip title="Share on LinkedIn">
                          <LinkedInIcon sx={{ color: '#1368bf' }} />
                        </Tooltip>
                      </LinkedinShareButton>

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
                      }}>
                        <Tooltip title="Copy link">
                          <IconButton
                            size="small"
                            type="text"
                            sx={{ ml: 2, background: '#f2f3f3' }}
                          >
                            <ContentCopyIcon sx={{ color: '#80868a' }} />
                          </IconButton>
                        </Tooltip>
                      </CopyToClipboard>

                      <Tooltip title={isArticleSaved ? 'Saved for later' : 'Save for later'}>
                        <IconButton
                          size="small"
                          sx={{ ml: 2, background: '#e9f0f9' }}
                          style={{ margin: '0 16px 0 28px' }}
                          onClick={() => {
                            handleSaveClick()
                          }}
                        >
                          {isArticleSaved ?
                            <BookmarkAddedIcon color='primary' />
                            :
                            <BookmarkAddIcon color='primary' />
                          }
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="More">
                        <IconButton
                          size="small"
                          sx={{ ml: 2, background: '#e9f0f9' }}
                        // onClick={handleClick}
                        >
                          <MoreHorizRoundedIcon color='primary' />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Box>
                </Box>
              </div>
            </div>
          </>
        )}
         {articleObj && (            
            <div className="ce-block" style={{marginTop:'20px'}}>
                  <div className="ce-block__content">
                    {articleObj.topics.map((topic) => {
                      return (
                        <Chip label={topic} sx={{ mr:'4px' }} />
                      )
                    })}
                  </div>
            </div>             
         )}
        {/* this div with id editorjs is a wrapper, loads the actual article content */}
        {/* <div id="editorjs" /> */}
        {articleObj && 
          <div style={{marginTop:'-15px'}}>
            <ReactEditorJS defaultValue={articleObj} tools={EDITOR_JS_TOOLS} readOnly='true' />
          </div>
        }
      </div>

      {articleObj &&
        <Box direction="column" sx={{
          '& > :not(style)': { m: 1 }, position: 'fixed', bottom: 16, right: 16,
          zIndex: 1, zoom: '0.8', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'end'
        }}>
          <Fab aria-label="Heart" sx={{ paddingRight: '0', background: 'linear-gradient(110deg, rgb(253, 205, 59) 60%, rgb(255, 237, 75) 60%)' }}
            variant={heartCount ? 'extended' : ''}>
            {heartCount != 0 &&
              (<Typography gutterBottom sx={{ fontWeight: 'bold' }}>
                {heartCount}
              </Typography>
              )
            }
            <Heart onClick={() => onHeartClicked()} onClickComplete={() => onHeartClickComplete()}/>
          </Fab>
          {/* <Fab aria-label="comment" variant={commentCount ? 'extended' : ''}
            onClick={() => onCommentClicked()}>
            {commentCount != 0 &&
              (<Typography gutterBottom sx={{ fontWeight: 'bold' }}>
                {commentCount}
              </Typography>
              )
            }
            <ChatRoundedIcon sx={{ ml: (commentCount != 0 ? 1.8 : 0) }} color='primary' />
          </Fab> */}
          {/* <Fab aria-label="share">
                <ShareIcon color='error' />
              </Fab> */}
        </Box>
      }
    </>
  );
};