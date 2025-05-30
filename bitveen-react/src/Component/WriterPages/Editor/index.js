import React, { useState, useEffect } from 'react';
import './index.css';
import EditorJS from '@editorjs/editorjs';
import Configuration from './configuration';
import { deleteArticle, getArticlesByUUID, saveArticle, updateArticle } from '../../../Service/api.service';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import useUserToken from '../../App/useUserToken';
import { useParams, useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import MoreIcon from '@mui/icons-material/MoreVert';
import { MenuProvider } from '../../Common/Providers/MenuProvider';
import { ConfirmDialog } from '../../Common/Providers/DialogProvider';
import { SnackbarProvider } from '../../Common/Providers/SnackbarProvider';
import { AddTopics } from '../AddTopics';
import LoadingButton from '@mui/lab/LoadingButton';

const Editor = () => {
    const navigate = useNavigate();

    // import userToken
    const { userToken } = useUserToken();
    const { articleUUID } = useParams();

    const [editor, setEditor] = useState({});
    const [isReadOnly, setIsReadOnly] = useState();
    const [articleObj, setArticleObj] = useState();
    const [dialogOptions, setDialogOptions] = useState();
    const [menuOptions, setMenuOptions] = useState();
    const [snackbarOptions, setSnackbarOptions] = useState();

    const [selectedTopicsCategory, setSelectedTopicsCategory] = useState([]);
    const [topicsCategoryErr, setTopicsCategoryErr] = useState();

    const [selectedSubTopics, setSelectedSubTopics] = useState([]);
    const [subTopicsErr, setSubTopicsErr] = useState();

    const [selectedTopics, setSelectedTopics] = useState([]);
    const [topicsErr, setTopicsErr] = useState();

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        // console.log('articleUUID', articleUUID)
        // wrap async call here: to avoid, useEffect must not return anything besides a function
        const initEditor = async () => {

            if (!articleUUID) {
                /**
                 * if not articleUUID, means new article is creating
                 * initialize with empty editor 
                 */
                const editor = await new EditorJS(Configuration());
                setEditor(editor);

                // for new article set placeholders on header and sub-heading
                setTimeout(() => {
                    const head = document.getElementsByClassName('ce-header')
                    if (head && head.length > 0) head[0].setAttribute('data-placeholder', 'Enter Title')
                }, 1000);
            } else {
                /**
                 * articleUUID found means user came from edit page URL
                 * link: /a/edit/articleUUID
                 * example: /a/edit/d7c5bda4-9c17-4c7c-ad8a-186f4d1ec8d1
                 * call an API to get article by articleUUID
                 */
                getArticleByUUID(async (articleObj) => {
                    /**
                     * callback function executed
                     * call an EditorJS to initialize editor in read mode
                     */ 
                    if (articleObj) {
                        setArticleObj({...articleObj})
                        if (articleObj.topics && articleObj.topics.length > 0) {
                            setSelectedTopicsCategory([articleObj.topics[0]])
                            setSelectedTopics([articleObj.topics[1]])
                            setSelectedSubTopics(articleObj.topics.slice(2, articleObj.topics.length))
                        }
                        const editor = await new EditorJS(Configuration(articleObj));
                        setEditor(editor);
                    }
                }, articleUUID)
            }
        }
        initEditor();
    }, []);

    const getArticleByUUID = async (callback, articleUUID) => {
        try {
          // console.log('articleUUID', articleUUID)
          const res = await getArticlesByUUID(articleUUID)
          // console.log("article", res.data)
          if (res.data) {
            // res.data is an articleObj
            callback(res.data[0])
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

    const onSave = async () => {
        try {
            // console.log('onsave')
            if (!userToken || !userToken.userUUID) { signInIsRequired(); return; }
            const outputData = await editor.save()
            // console.log('Article data: ', outputData)
            // save article
            if (outputData.blocks && outputData.blocks.length > 0) {
                const titleObj = outputData.blocks.find(x => x.type == 'header');
                const subTitleObj = outputData.blocks.find(x => x.type == 'paragraph');
                
                // validate if title and subTitle entered or not
                // show snackbar that updated is saved
                let errMsg = null;
                if (!selectedTopicsCategory || (selectedTopicsCategory && selectedTopicsCategory.length == 0)) {
                    errMsg = 'Select topics Category! Topics Category is required';
                    setTopicsCategoryErr('Topics Category is required.');
                }
                else if (!selectedTopics || (selectedTopics && selectedTopics.length == 0)) {
                    errMsg = 'Select topics! Topics are required';
                    setTopicsErr('Topics are required.');
                }
                else if (!selectedSubTopics || (selectedSubTopics && selectedSubTopics.length == 0)) {
                    errMsg = 'Select Sub Topics! Sub Topics are required';
                    setSubTopicsErr('Sub Topics are required.');
                }
                else if ((!titleObj || (titleObj && !titleObj.data.text)) && (!subTitleObj || (subTitleObj && !subTitleObj.data.text))) {
                    errMsg = 'Title & sub-title are required';
                }
                else if (!titleObj || (titleObj && !titleObj.data.text)) {
                    errMsg = 'Title is required';
                }
                else if (!subTitleObj || (subTitleObj && !subTitleObj.data.text)) {
                    errMsg = 'Sub title is required';
                }
                if (errMsg) {
                    setSnackbarOptions({
                        isOpen: true,
                        message: errMsg,
                        severity: 'error', // error, warning, info, success
                        vertical: 'bottom',
                        horizontal: 'left',
                        duration: 3000,
                        handleClose: () => {
                            setSnackbarOptions({ isOpen: false })
                        }
                    })
                    return;
                }

                const imgObj = outputData.blocks.find(x => x.type == 'image')
                let headerImage = '';

                if (imgObj && imgObj.data && imgObj.data.file.url) {
                    headerImage = imgObj.data.file.url;
                }
                if(!articleObj) {
                    // construct articleLink currently with title an article
                    const title = outputData.blocks[0].data.text
                    // converting to lowercase, replacing empty space and dot in the str with hyphen -
                    const articleLink = title.replace(/\s+/g, '-').toLowerCase().replace(/\./g,'-')
                    // saving new article
                    const lo = {
                        blocks: outputData.blocks,
                        version: outputData.version,
                        title: title,
                        subTitle: outputData.blocks[1].data.text,
                        userUUID: userToken.userUUID,
                        articleLink,
                        headerImage,
                        topics: [...selectedTopicsCategory, ...selectedTopics, ...selectedSubTopics]
                    }
                    
                    setIsSaving(true)
                    let article = await saveArticle(lo)
                    setIsSaving(false)
                    article = article.data;
                    // console.log("article", article)
                    if (article.data[0]) {
                        setArticleObj(article.data[0])

                        // show snackbar that article is saved
                        setSnackbarOptions({
                            isOpen: true,
                            message: article.message,
                            severity: 'success', // error, warning, info, success
                            handleClose: () => {
                                setSnackbarOptions({ isOpen: false })
                            }
                        })
                    }
                } else {
                    setIsSaving(true)
                    // updating article
                    let articleU = await updateArticle(
                        articleObj.uuid,
                        {
                        blocks: outputData.blocks,
                        version: outputData.version,
                        title: outputData.blocks[0].data.text,
                        subTitle: outputData.blocks[1].data.text,
                        headerImage,
                        topics: [...selectedTopicsCategory, ...selectedTopics, ...selectedSubTopics]
                    })
                    setIsSaving(false)
                    // console.log("article", articleU)
                    articleU = articleU.data
                    setArticleObj({...articleU.data})

                    // show snackbar that updated is saved
                    setSnackbarOptions({
                        isOpen: true,
                        message: articleU.message,
                        severity: 'info', // error, warning, info, success
                        handleClose: () => {
                            setSnackbarOptions({ isOpen: false })
                        }
                    })
                }
            }

        } catch (error) {
            console.log('Saving failed: ', error)

            // show snackbar that updated is saved
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

    /*
    const toggleReadOnly = async () => {
        await editor.readOnly.toggle()
        setIsReadOnly(editor.readOnly.isEnabled)
    }
    */

    const deleteArticleByArticleUUID = async (articleUUID) => {
      try {
        // console.log('deleteArticleByArticleUUID')
        const res = await deleteArticle(articleUUID)
        // console.log("articles", res.data)
        if (res.data && res.data.acknowledged && res.data.deletedCount == 1) {
          /**
           * article deleted redirect to /my/articles page
           */
          navigateToURL('/my/articles')
        }
      } catch (error) {
          console.log('Saving failed: ', error)
      }
    };

    const navigateToURL = (url) => {
        navigate(url);
    }

    return (
        <>
            <h1 className='App-title' style={{marginBottom: '0px'}}>
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                >
                    <ConfirmDialog options={dialogOptions} />
                    <MenuProvider options={menuOptions} />
                    <SnackbarProvider options={snackbarOptions} />
                    <div style={{ display:'inline-block', float:'right', marginRight:'20px' }}>

                        {articleObj && articleObj.articleLink && (
                            <Button sx={{ ml:1, mb:1 }} size="small" variant="text" color="primary"
                                onClick={() => navigateToURL(`/${articleObj.articleLink}`)}>
                                Back to Article
                            </Button>
                        )}
                        {isSaving ?
                            <LoadingButton loading sx={{ ml:1, mb:1 }} size="small" variant="contained" color="success">
                                Loading
                            </LoadingButton>
                            :
                            <Button sx={{ ml:1, mb:1 }} size="small" variant="contained" color="success" aria-label="save article"
                                startIcon={<SaveIcon />} onClick={onSave}>
                                Save
                            </Button>
                        }
                            

                        {articleUUID &&
                            <IconButton edge="end"
                                sx={{ ml:1, mb:1 }}
                                onClick={(e) => setMenuOptions({
                                eventCurrentTarget: e.currentTarget,
                                isOpen: true,
                                menuItems: [
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
                                                message2: `“${articleObj.title}”`,
                                                handleClose: () => {
                                                    setDialogOptions({ isOpen: false })
                                                },
                                                handleSubmit: () => {
                                                    deleteArticleByArticleUUID(articleObj.uuid)
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
                                <MoreIcon />
                            </IconButton>
                        }
                    </div>
                </Typography>
            </h1>
            {(articleObj || !articleUUID) &&
                <AddTopics 
                    selectedTopics={selectedTopics} setSelectedTopics={setSelectedTopics} topicsErr={topicsErr} setTopicsErr={setTopicsErr}
                    selectedSubTopics={selectedSubTopics} setSelectedSubTopics={setSelectedSubTopics} subTopicsErr={subTopicsErr} setSubTopicsErr={setSubTopicsErr}
                    selectedTopicsCategory={selectedTopicsCategory} setSelectedTopicsCategory={setSelectedTopicsCategory} topicsCategoryErr={topicsCategoryErr} setTopicsCategoryErr={setTopicsCategoryErr}
                />
            }
            <div id="editorjs" />
        </>
    );
};

export default Editor;