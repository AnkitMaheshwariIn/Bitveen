import React, { useState } from 'react';
import './index.css';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import GoogleIcon from '@mui/icons-material/Google';
import LogoutIcon from '@mui/icons-material/Logout';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CreateIcon from '@mui/icons-material/Create';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Link, useNavigate } from 'react-router-dom';
import { login, loginWithGoogle } from '../../../Service/api.service';
import useUserToken from '../../App/useUserToken';
import Tooltip from '@mui/material/Tooltip';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export const Header = () => {
  // import userToken and setUserToken
  const { userToken, setUserToken } = useUserToken();

  const navigate = useNavigate();

  const [ user, setUser ] = useState([]);
  const [ profile, setProfile ] = useState([]);
  const [ loginError, setLoginError ] = useState(null);
  const [ showErrorAlert, setShowErrorAlert ] = useState(false);
  
  // Handle closing the error alert
  const handleCloseAlert = () => {
    setShowErrorAlert(false);
  };

  const refreshPage = () => {
      navigate(0);
  }

  const onLoginAPI = async (profile) => {
    try {
      const res = await login({
          username: "JAY SHREE GANESH",
          password: "123456"
      })
      // console.log("user", res.data)
      if (res.data) {
        setUserToken({
          accessToken: res.data.accessToken,
          userUUID: res.data.uuid,
          profile: profile
        });
        // reload after login
        refreshPage();
      }
    } catch (error) {
        console.log('Saving failed: ', error)
    }
    handleMenuClose();
  };

  const onLoginWithGoogleAPI = async (profile) => {
    try {
      console.log('Google profile data:', profile);
      setLoginError(null); // Clear any previous errors
      setShowErrorAlert(false); // Hide any visible error alerts
      
      const res = await loginWithGoogle(profile);
      console.log("Google login API response:", res.data);
      
      if (res.data && res.data.data) {
        setUserToken({
          accessToken: res.data.data.accessToken,
          userUUID: res.data.data.uuid,
          profile: res.data.data
        });
        // reload after login
        refreshPage();
      } else {
        // Handle case where response doesn't contain expected data
        console.error('Invalid response format from server:', res.data);
        const errorMsg = 'Server returned an invalid response format';
        setLoginError(errorMsg);
        setShowErrorAlert(true);
      }
    } catch (error) {
      console.error('Google login API error:', error);
      let errorMessage = 'Login failed';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        errorMessage = `Server error: ${error.response.status} - ${error.response.data.message || error.response.statusText}`;
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        errorMessage = 'No response received from server';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        errorMessage = error.message;
      }
      
      setLoginError(errorMessage);
      setShowErrorAlert(true);
    }
    handleMenuClose();
  };

  const onGoogleLogin = useGoogleLogin({
    nonce: 'bitveen',
    onSuccess: (codeResponse) => {
      // Clear any previous errors
      setLoginError(null);
      console.log('Google login success, token:', codeResponse.access_token);
      onLoginWithGoogleAPI({access_token: codeResponse.access_token});
    },
    onError: (error) => {
      console.error('Google Login Failed:', error);
      const errorMsg = 'Google login failed: ' + (error.message || 'Unknown error');
      setLoginError(errorMsg);
      setShowErrorAlert(true);
    }
  })

  /**
   * as soon as useGoogleLogin function will set User,
   * this useEffect function will execute to get user public info
   */
  {/** THIS GOOGLE VERIFICATION WILL BE DONE ON APP SIDE
    useEffect (() => {
      if (user && user.access_token) {
        axios
        .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
            headers: {
                Authorization: `Bearer ${user.access_token}`,
                Accept: 'application/json'
            }
        })
        .then((res) => {
          if (res.data) {
            res.data['access_token'] = user.access_token;
            setProfile(res.data);
            onLoginWithGoogleAPI({access_token: user.access_token})
          } else {
            console.log('Access token is not valid!')
          }
        })
        .catch((err) => console.log(err));
      }
    }, [user]);
  */}

  // log out function to log the user out of google and set the profile array to null
  const logOutFromGoogle = () => {
    googleLogout();
    // now logout from API too by calling onLogout
    onLogout();
  };

  const onLogout = async () => {
    try {
      setUser(undefined)
      setUserToken(undefined)
      setProfile(null);
      // const res = await login({
      //     username: "JAY SHREE GANESH",
      //     password: "123456"
      // })
      // console.log("user", res.data)
      // if (res.data) {
      //     setUserToken(null)
      // }

      // reload after login
      // refreshPage();
      window.location.href = '/';
    } catch (error) {
        console.log('Saving failed: ', error)
    }
    handleMenuClose();
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {userToken && (
        // user is logged in
        <MenuItem>
          <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
            >
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      )}
      {userToken && (
        <MenuItem onClick={logOutFromGoogle}>
          <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
            >
            <LogoutIcon />
          </IconButton>
          <p>Logout</p>
        </MenuItem>
      )}
      {!userToken && (
        // user is NOT logged in
        <MenuItem onClick={onGoogleLogin}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <GoogleIcon />
          </IconButton>
          <p>Sign in with Google 🚀</p>
        </MenuItem>
      )}
      {/* <MenuItem>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem> */}
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem component={Link} to="/new-article">
        <IconButton size="large" color="inherit" aria-label="write new article">
          <CreateIcon />
        </IconButton>
        <p>Write</p>
      </MenuItem>
      {userToken && (
        <MenuItem component={Link} to="/my/articles">
          <IconButton size="large" aria-label="My Articles" color="inherit">
            <ListAltIcon />
          </IconButton>
          <p>My Articles</p>
        </MenuItem>
      )}
      {/* {userToken && (
        <MenuItem>
          <IconButton
            size="large"
            aria-label="show 17 new notifications"
            color="inherit"
          >
            <Badge badgeContent={17} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
      )} */}
      {userToken && (
        // user is logged in
          <MenuItem>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <p>Profile</p>
          </MenuItem>
      )}
      {userToken && (
          <MenuItem onClick={logOutFromGoogle}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
            >
              <LogoutIcon />
            </IconButton>
            <p>Logout</p>
          </MenuItem>
      )}
    </Menu>
  );

  const [openGSignin, setOpenGSignin] = React.useState(false);

  const handleClickGSigninOpen = () => {
    setOpenGSignin(true);
  };

  const handleGSigninClose = () => {
    setOpenGSignin(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Error Alert */}
      <Snackbar open={showErrorAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
          {loginError}
        </Alert>
      </Snackbar>
      <AppBar position="static" color="transparent"
        style={{
          boxShadow: '0px 2px 2px -1px rgb(0 0 0 / 20%), 0px 2px 1px 0px rgb(0 0 0 / 5%), 0px 1px 2px 0px rgb(0 0 0 / 5%)',
          background: 'linear-gradient(110deg, #fdcd3b 60%, #ffed4b 60%)'
        }}
      >
        <Toolbar>
          <Tooltip title="Home Page">
            <IconButton
              size="medium"
              edge="start"
              color="inherit"
              aria-label="Bitveen"
              variant="outlined"
              sx={{ mr: 1, ml: 0.1, padding: 0 }}
              component={Link} to="/"
            >
              <img src="/logo192.png" style={{ width: '52px' }} />
            </IconButton>
          </Tooltip>
          <div>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              BITVEEN
            </Typography>
          </div>
          {/* <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search in Bitveen…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search> */}
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button component={Link} to="/new-article" size="small" color="inherit" className="header-btn"
              variant="outlined" startIcon={<CreateIcon />}>
              Write
            </Button>
            {userToken && (
              <Button component={Link} to="/my/articles" size="small" color="inherit" className="header-btn"
                variant="outlined" startIcon={<ListAltIcon />}>
                My Articles
              </Button>
            )}
            {/* {userToken && (
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
              >
                <Badge badgeContent={17} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            )} */}
          </Box>
          <Box>
            <Button
              size="small"
              edge="end"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              className="header-btn"
              variant="outlined" startIcon={<AccountCircle />}
            >
              {!userToken ? 'Sign in' : userToken.profile.firstName }
            </Button>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="small"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}