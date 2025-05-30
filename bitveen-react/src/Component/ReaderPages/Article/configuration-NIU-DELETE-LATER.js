// import React from 'react';
import Header from '@editorjs/header'; 
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import Marker from '@editorjs/marker';
import Underline from '@editorjs/underline';
import Embed from '@editorjs/embed';
import Paragraph from '@editorjs/paragraph';
import CodeTool from '@editorjs/code';
import InlineCode from '@editorjs/inline-code';
// import Personality from '@editorjs/personality';
import Quote from '@editorjs/quote';
import Delimiter from '@editorjs/delimiter';
import Warning from '@editorjs/warning';
import Table from '@editorjs/table';

const Configuration = (articleObj) => {
  return ({
        /**
         * Enable/Disable the read only mode
         * in this case readOnly is true only
         * because it is a view article page
         */
        readOnly: true,
        logLevel: 'ERROR',

        /**
         * Wrapper of Editor
         * Id of Element that should contain Editor instance
         */
        holder: "editorjs",
        // autofocus: true,
        placeholder: 'Let`s write an awesome story!',

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
                    placeholder: '',
                    /**
                     * (default: false) Whether or not to keep blank paragraphs when saving editor data
                     */
                    preserveBlank: true
                }
            },
            header: {
                class: Header, 
                shortcut: 'CMD+SHIFT+H',
                inlineToolbar: true, // or ['bold', 'link'],
                config: {
                    placeholder: 'Enter a header',
                    levels: [1, 2],
                    defaultLevel: 1,
                    inlineToolbar: true // or ['bold', 'link'] 
                }
            },
            delimiter: Delimiter,
            image: {
                class: ImageTool, 
                config: {
                    endpoints: {
                      byFile: 'http://localhost:8008/uploadFile', // Your backend file uploader endpoint
                      byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
                    }
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
                },
            },
            quote: {
                class: Quote,
                inlineToolbar: true,
                shortcut: 'CMD+SHIFT+O',
                config: {
                  quotePlaceholder: 'Enter a quote',
                  captionPlaceholder: 'Quote\'s author',
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
                  }
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
                  withHeadings: true
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
            },
            code: {
                class: CodeTool,
                config: {
                    /**
                     * Code Tool's placeholder string
                     */
                    placeholder: 'Enter <code> here'
                }
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
            blocks: articleObj.blocks
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