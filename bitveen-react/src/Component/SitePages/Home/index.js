import React, { useState, useEffect } from 'react';
import { Header } from '../Header'
import './index.css';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { Grid } from '@mui/material';
import Paper from '@mui/material/Paper';
import { getAllByPaginationAPI } from '../../../Service/api.service';
import CardMedia from '@mui/material/CardMedia';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { SnackbarProvider } from '../../Common/Providers/SnackbarProvider';
import { useNavigate, useParams } from "react-router-dom";
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';

export const Home = () => {
  const navigate = useNavigate();

  const [limit, setLimit] = useState(10);
  const skipRef = React.useRef(0);
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [snackbarOptions, setSnackbarOptions] = useState();

  useEffect(() => {
      getArticles();
  }, []);

  const loadMoreArticles = () => {
    // Load more data here
    skipRef.current += limit;
    getArticles();
  };

  const getArticles = async () => {
    try {
      if (skipRef.current === 'Over') return;

      setLoadingArticles(true);
      const res = await getAllByPaginationAPI(limit, skipRef.current)
      // console.log("articles", res.data)
      if (res && res.data) {
        if (res.data.length > 0) {
          setArticles(prevData => [...prevData, ...res.data])
        } else {
          skipRef.current = 'Over';
        }
      }
      setLoadingArticles(false);
    } catch (error) {
      setLoadingArticles(false);
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
        <CardMedia
          component="video"
          sx={{ maxWidth: 650, borderRadius: '6px' }}
          className="intro-video"
          src="/Bitveen.mp4"
          autoPlay
          loop
          muted
        />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ maxWidth: '650px' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 'bold', color: '#fdcd3b' }} gutterBottom>
              START WRITING BLOGS
            </Typography>
            <Typography variant="h5" component="div" color="primary">
              Write{bull}Share{bull}Learn
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              Using Bitveen.com
            </Typography>
            <Typography variant="overline" sx={{ fontSize: '13px', color: '#888', letterSpacing: '0.04em', lineHeight: '2.1' }}>
              If you have content to write, knowledge to share, an information to spread, or 
              to tell about your business — use Bitveen.com Signin for free.
            </Typography>
          </CardContent>
          <CardActions>
            <Button sx={{ ml:1, mb:1 }} size="large" variant="outlined" color="primary"
              component={Link} to="/new-article" style={{ background: 'linear-gradient(110deg, #fdcd3b 60%, #ffed4b 60%)' }}>
              Start Writing</Button>
          </CardActions>
          <CardActions sx={{ ml:1, mb:1, fontSize: '12px' }}>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-conditions">Terms & Conditions</Link>
            <Link to="/disclaimer">Disclaimer</Link>
          </CardActions>
        </Box>
      </Card>
    </React.Fragment>
  );

  const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(3),
    boxShadow: 'none'
  }));

  const stringAvatar = (name) => {
    if (!name) return '';
    return {
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }

  const articlesDisplay = (
    <>
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
            const displayName = `${article.userInfo.firstName} ${article.userInfo.lastName}`

            return (
              <span key={index} className="article-card">
                <Card variant="outlined">
                  <CardHeader
                    sx={{ zoom: 0.8 }}
                    avatar={
                      <Avatar
                        className='cursor-pointer'
                        sx={{ color: '#173B53', background: 'linear-gradient(110deg, rgb(253, 205, 59) 60%, rgb(255, 237, 75) 60%)' }}
                        alt={displayName}
                        {...stringAvatar(displayName)}
                        onClick={() => navigateToURL(`/@${article.userInfo.username}`)}
                      />
                    }
                    title={(
                      <>
                        {displayName ?
                          <span className='cursor-pointer' onClick={() => navigateToURL(`/@${article.userInfo.username}`)}>
                            {displayName}</span>
                          : <Skeleton />
                        }
                      </>
                    )}
                    subheader={(
                      <Stack
                        direction="row"
                        divider={<Divider orientation="vertical" flexItem />}
                        spacing={0.5}
                      >
                        {article.followersCount > 0 && <span>{article.followersCount} followers</span>}
                        <span>{getParsedDate(article.createdAt)}</span>
                      </Stack>
                    )}
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

          <Box sx={{ textAlign: 'center', margin: '20px auto'}}>

            <Box sx={{ textAlign: 'center', margin: '20px auto'}}>
              Showing {articles.length} of 100
              <Box sx={{ width: '120px', margin: '10px auto'}}>
                <LinearProgress variant="determinate" value={30} />
              </Box>
            </Box>

            { loadingArticles ?
              <LoadingButton loading variant="outlined">
                Loading
              </LoadingButton>
              :
              <Button
                variant="contained"
                onClick={() => {
                  loadMoreArticles()
                }}
              >
                Load More
              </Button>
            }
          </Box>
        </Box>
      }

    </>
  )

  const articlesMostReadDisplay = (
    <>
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
          {articles && articles.reverse().map((article, index) => {
            const ARTICLE_URL = 'https://bitveen.com/' + article.articleLink;
            const displayName = `${article.userInfo.firstName} ${article.userInfo.lastName}`

            return (
              <span key={index} className="article-card">
                <Card variant="outlined">
                  <CardHeader
                    sx={{ zoom: 0.8 }}
                    avatar={
                      <Avatar
                        className='cursor-pointer'
                        sx={{ color: '#173B53', background: 'linear-gradient(110deg, rgb(253, 205, 59) 60%, rgb(255, 237, 75) 60%)' }}
                        alt={displayName}
                        {...stringAvatar(displayName)}
                        onClick={() => navigateToURL(`/@${article.userInfo.username}`)}
                      />
                    }
                    title={(
                      <>
                        {displayName ?
                          <span className='cursor-pointer' onClick={() => navigateToURL(`/@${article.userInfo.username}`)}>
                            {displayName}</span>
                          : <Skeleton />
                        }
                      </>
                    )}
                    subheader={(
                      <Stack
                        direction="row"
                        divider={<Divider orientation="vertical" flexItem />}
                        spacing={0.5}
                      >
                        {article.followersCount > 0 && <span>{article.followersCount} followers</span>}
                        <span>{getParsedDate(article.createdAt)}</span>
                      </Stack>
                    )}
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
  )

  const basicGrid = (
    <Grid container spacing={1}>
      <Grid item xs={12} md={8}>
        <Item sx={{ padding: 0 }}>
          {articlesDisplay}
        </Item>
      </Grid>
      <Grid item xs={12} md={4}>
        <Item sx={{ padding: 0 }}>
          {/* {articlesMostReadDisplay} */}
        </Item>
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
        
        <SnackbarProvider options={snackbarOptions} />
    </div>
  )
}
