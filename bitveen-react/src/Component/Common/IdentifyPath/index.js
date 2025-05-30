import React from 'react'
import { useParams } from 'react-router-dom';
import { Article } from '../../ReaderPages/Article'
import { HomeCustomize } from '../../ReaderPages/HomeCustomize'

export const IdentifyPath = () => {

  const { linkPath } = useParams();
  
  return (
    <>
      { linkPath.startsWith('@') ? <HomeCustomize /> : <Article /> }
    </>
  )
}
