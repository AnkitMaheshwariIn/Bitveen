import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { Article } from '../ReaderPages/Article';
import { Articles } from '../WriterPages/Articles';
import { Comments } from '../ReaderPages/Comments';
import { Home } from '../SitePages/Home';
import { NewArticle } from '../WriterPages/NewArticle';
import { EditArticle } from '../WriterPages/EditArticle';
import { HomeCustomize } from '../ReaderPages/HomeCustomize'
import { IdentifyPath } from '../Common/IdentifyPath';
import { PrivacyPolicy } from '../SitePages/PrivacyPolicy';
import { TermsConditions } from '../SitePages/TermsConditions';
import { Disclaimer } from '../SitePages/Disclaimer';

export const AppComponent = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/disclaimer" element={<Disclaimer />} />
            <Route exact path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route exact path="/terms-conditions" element={<TermsConditions />} />
            {/* anyone can create new article but to save new article login is required */}
            <Route exact path="/new-article" element={<NewArticle />} />
            {/* Auth: only logged in user can access my articles and my stats */}
            <Route exact path="/my/articles" element={<Articles />} />
            <Route exact path="/my/stats" element={<Articles />} />
            {/* Auth: only logged in user can access edit article page 'a' for article */}
            <Route exact path="/a/edit/:articleUUID" element={<EditArticle />} />
            {/* NoAuth Public + Link by year/month/articleLink */}
            <Route exact path="/:year/:month/:articleLink" element={<Article />} />
            {/* Delete this later after implementation */}
            <Route exact path="/c" element={<Comments />} />
            {/* NoAuth Public: IdentifyPath will Identify and redirect to 
                either customized home page (HomeCustomize) of a writer for readers
                or article page (Article) where article load by articleLink */}
            <Route exact path="/:linkPath" element={<IdentifyPath />} />
        </Routes>
</BrowserRouter>
  )
}
