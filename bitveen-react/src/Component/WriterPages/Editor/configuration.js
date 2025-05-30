// import React from 'react';
import Header from '@editorjs/header'; 
import List from '@editorjs/list'; 
import SimpleImage from './simple-image';
import ImageTool from '@editorjs/image';
import Marker from '@editorjs/marker';
import Underline from '@editorjs/underline';
import Embed from '@editorjs/embed';
import Paragraph from '@editorjs/paragraph';
import editorjsCodecup from '@calumk/editorjs-codecup';
import InlineCode from '@editorjs/inline-code';
// import Personality from '@editorjs/personality';
import Quote from '@editorjs/quote';
import Delimiter from '@editorjs/delimiter';
import Warning from '@editorjs/warning';
import Table from '@editorjs/table';
import { uplaodImage } from '../../../Service/api.service';

const Configuration = (articleObj) => {
  return ({
        /**
         * Enable/Disable the read only mode
         */
        readOnly: false,
        logLevel: 'ERROR',

        /**
         * Wrapper of Editor
         * Id of Element that should contain Editor instance
         */
        holder: "editorjs",
        autofocus: false,
        placeholder: 'Enter title of your Story!!',

        /** 
         * Available Tools list. 
         * Pass Tool's class or Settings object for each Tool you want to use 
         */ 
        tools: { 
            paragraph: {
                class: Paragraph,
                config: {
                    /**
                     * The placeholder. Will be shown only in the first paragraph when the whole editor is empty.
                     */
                    placeholder: 'Enter some text, or paste URL to embed',
                    /**
                     * (default: false) Whether or not to keep blank paragraphs when saving editor data
                     */
                    preserveBlank: true,
                    inlineToolbar: true
                }
            },
            header: {
                class: Header, 
                shortcut: 'CMD+SHIFT+H',
                inlineToolbar: true, // or ['bold', 'link'],
                config: {
                    // placeholder: 'Header',
                    levels: [1, 2],
                    defaultLevel: 1,
                    inlineToolbar: true // or ['bold', 'link'] 
                }
            },
            delimiter: Delimiter,
            image: {
                class: ImageTool, 
                config: {
                  // endpoints: {
                  //   byFile: 'http://localhost:8008/uploadFile', // Your backend file uploader endpoint
                  //   byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
                  // }
                  /**
                   * Custom uploader
                   */
                  uploader: {
                    /**
                     * Upload file to the server and return an uploaded image data
                     * @param {File} file - file selected from the device or pasted by drag-n-drop
                     * @return {Promise.<{success, file: {url}}>}
                     */
                    async uploadByFile(file) {
                      console.log('uploadByFile', file)
                      // your own uploading logic here
                      // return MyAjax.upload(file).then(() => {
                      //   return {
                      //     success: 1,
                      //     file: {
                      //       url: 'https://codex.so/upload/redactor_images/o_80beea670e49f04931ce9e3b2122ac70.jpg',
                      //       // any other image data you want to store, such as width, height, color, extension, etc
                      //     }
                      //   };
                      // });
                      const formData = new FormData();
                      formData.append('file', file);

                      try {
                        const saved = await uplaodImage(formData);
                        if (saved.data && saved.data.status == 'success' && saved.data.data.url) {
                          // const image = await getImage(saved.data.data.uuid);
                          return {
                            success: 1,
                            file: {
                              url: saved.data.data.url // image.data.message
                              // any other image data you want to store, such as width, height, color, extension, etc
                            }
                          }
                        }
                      } catch (error) {
                        console.log('Saving failed: ', error)
                      }
                    }
                  },
                  inlineToolbar: true
                }
            },
            code: {
                class: editorjsCodecup,
                config: {
                    /**
                     * Code Tool's placeholder string
                     */
                    placeholder: 'Enter <code> here',
                    inlineToolbar: true
                }
            },
            /**
             * Provides Warning Block for the CodeX Editor. Block has title and message. It can be used, for example, for editorials notifications or appeals.
             */
            warning: {
                class: Warning,
                inlineToolbar: true,
                shortcut: 'CMD+SHIFT+W',
                config: {
                  titlePlaceholder: 'Title',
                  messagePlaceholder: 'Message',
                  inlineToolbar: true
                },
            },
            quote: {
                class: Quote,
                inlineToolbar: true,
                shortcut: 'CMD+SHIFT+O',
                config: {
                  quotePlaceholder: 'Enter a quote',
                  captionPlaceholder: 'Quote\'s author',
                  inlineToolbar: true
                },
            },
            embed: {
                class: Embed,
                config: {
                  services: {
                    youtube: true,
                    twitter: true,
                    facebook: true,
                    instagram: true,
                    'twitch-video': true,
                    miro: true,
                    vimeo: true,
                    gfycat: true,
                    imgur: true,
                    vine: true,
                    aparat: true,
                    'yandex-music-track': true,
                    'yandex-music-album': true,
                    'yandex-music-playlist': true,
                    coub: true,
                    codepen: true,
                    pinterest: true
                  },
                  inlineToolbar: true
                }
            },
            list: { 
                class: List, 
                inlineToolbar: true // or ['bold', 'link'] 
            },
            table: {
                class: Table,
                config: {
                  rows: 2,
                  cols: 3,
                  withHeadings: true,
                  inlineToolbar: true
                },
            },
            underline: Underline,
            marker: {
                class: Marker,
                shortcut: 'CMD+SHIFT+M',
            },
            /**
             * Allows adding link previews to your articles.
             */
            // linkTool: {
            //     class: LinkTool,
            //     config: {
            //       endpoint: 'http://localhost:8008/fetchUrl', // Your backend endpoint for url data fetching,
            //     }
            // },
            
            /**
             * This tool allows you to create Personality block in your articles.
             */
            // personality: {
            //     class: Personality,
            //     config: {
            //       endpoint: 'http://localhost:8008/uploadFile'  // Your backend file uploader endpoint
            //     }
            // },
            inlineCode: {
                class: InlineCode,
                shortcut: 'CMD+SHIFT+M',
            }
        }, 
        /**
         * Previously saved data that should be rendered
         */
        // data: {
        //     // blocks: [
        //     //     {
        //     //         "type" : "image",
        //     //         "data" : {
        //     //             "file": {
        //     //                 "url" : "https://www.tesla.com/tesla_theme/assets/img/_vehicle_redesign/roadster_and_semi/roadster/hero.jpg"
        //     //             },
        //     //             "caption" : "Roadster // tesla.com",
        //     //             "withBorder" : true,
        //     //             "withBackground" : true,
        //     //             "stretched" : false
        //     //         }
        //     //     }
        //     // ]
        // },

        data: {
            blocks: articleObj? articleObj.blocks :
            [
              {
                type: "header",
                data: {
                  text: "",
                  level: 1
                }
              },
              {
                type : 'paragraph',
                data : {
                  text : ''
                }
              }
            ]
            /**
             * 
              {
                type: "header",
                data: {
                  text: "Key features",
                  level: 3
                }
              },
              {
                type : 'list',
                data : {
                  items : [
                    'It is a block-styled editor',
                    'It returns clean data output in JSON',
                    'Designed to be extendable and pluggable with a simple API',
                  ],
                  style: 'unordered'
                }
              },
              {
                type: "header",
                data: {
                  text: "What does it mean «block-styled editor»",
                  level: 3
                }
              },
              {
                type : 'paragraph',
                data : {
                  text : 'Workspace in classic editors is made of a single contenteditable element, used to create different HTML markups. Editor.js <mark class=\"cdx-marker\">workspace consists of separate Blocks: paragraphs, headings, images, lists, quotes, etc</mark>. Each of them is an independent contenteditable element (or more complex structure) provided by Plugin and united by Editor\'s Core.'
                }
              },
              {
                type : 'paragraph',
                data : {
                  text : `There are dozens of <a href="https://github.com/editor-js">ready-to-use Blocks</a> and the <a href="https://editorjs.io/creating-a-block-tool">simple API</a> for creation any Block you need. For example, you can implement Blocks for Tweets, Instagram posts, surveys and polls, CTA-buttons and even games.`
                }
              },
              {
                type: "header",
                data: {
                  text: "What does it mean clean data output",
                  level: 3
                }
              },
              {
                type : 'paragraph',
                data : {
                  text : 'Classic WYSIWYG-editors produce raw HTML-markup with both content data and content appearance. On the contrary, Editor.js outputs JSON object with data of each Block. You can see an example below'
                }
              },
              {
                type : 'paragraph',
                data : {
                  text : `Given data can be used as you want: render with HTML for <code class="inline-code">Web clients</code>, render natively for <code class="inline-code">mobile apps</code>, create markup for <code class="inline-code">Facebook Instant Articles</code> or <code class="inline-code">Google AMP</code>, generate an <code class="inline-code">audio version</code> and so on.`
                }
              },
              {
                type : 'paragraph',
                data : {
                  text : 'Clean data is useful to sanitize, validate and process on the backend.'
                }
              },
              {
                type : 'delimiter',
                data : {}
              },
              {
                type : 'paragraph',
                data : {
                  text : 'We have been working on this project more than three years. Several large media projects help us to test and debug the Editor, to make its core more stable. At the same time we significantly improved the API. Now, it can be used to create any plugin for any task. Hope you enjoy. 😏'
                }
              },
              {
                type: 'image',
                data: {
                  url: 'assets/codex2x.png',
                  caption: '',
                  stretched: false,
                  withBorder: true,
                  withBackground: false,
                }
              },
            ]
             */
        }

        /**
         * Available Tools list.
         * Pass Tool's class or Settings object for each Tool you want to use
         */
        //   tools: {
        //     image: {
        //       class: SimpleImage,
        //       inlineToolbar: true
        //     }
        //   },

        /**
         * Previously saved data that should be rendered
         */
        //  onReady: () => {
        //     console.log('Editor.js is ready to work!')
        //  },
        //  onChange: (api, event) => {
        //     console.log('Now I know that Editor\'s content changed!', event)
        // },
        // data:
        // {
        //     "time": 1643195431504,
        //     "blocks": [
        //         {
        //             "id": "o72AO0sY-1",
        //             "type": "paragraph",
        //             "data": {
        //                 "text": "sdjcvdhsvcdsghvchgdsvghcds"
        //             }
        //         },
        //         {
        //             "id": "6LPs8gr9-a",
        //             "type": "paragraph",
        //             "data": {
        //                 "text": "vhjsbdjvbhjdbvjhdhsbvjhdbjfvdv"
        //             }
        //         },
        //         {
        //             "id": "c5vaZWuzj8",
        //             "type": "paragraph",
        //             "data": {
        //                 "text": "fdjkbdjfjbvfdkbvfdnkbnkfdbfd"
        //             }
        //         },
        //         {
        //             type: "image",
        //             data: {
        //               url: "https://cdn.pixabay.com/photo/2017/09/01/21/53/blue-2705642_1280.jpg",
        //               caption: 'Here is a caption field',
        //               withBorder: false,
        //               withBackground: true,
        //               stretched: false
        //             }
        //           }
        //     ],
        //     "version": "2.22.2"
        // }
    });
};

export default Configuration;