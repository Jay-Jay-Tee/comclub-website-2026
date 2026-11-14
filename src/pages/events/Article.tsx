/// <reference types="vite/client" />
import React from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import articles from './articles.json';
import WindowCard from '../../layout/WindowCard';
import './Article.css';
import { parseArticles } from './zod';
import Linkify from '../../components/Linkify';
import CalendarActions from './CalendarActions';
import ShareEvent from './ShareEvent';

const parsedArticles = Object.values(parseArticles(articles));

function Article() {
  const { articleLink } = useParams();
  // Derive this during render so sharing never pairs the previous title with a new URL.
  const content = parsedArticles.find((article) => article.link === articleLink);
  return (
    <div className='article'>
      <Link to='/events' className='article-back'>
        <span aria-hidden='true'>&#8592;</span>
        Back to events
      </Link>
      {
        content && <>
          <h1>{content.title}</h1>
          <div className='flex w-full flex-wrap items-start justify-center gap-3 px-4'>
            <CalendarActions article={content} pageUrl={window.location.href} />
            <ShareEvent key={articleLink} title={content.title} pageUrl={window.location.href} />
          </div>

          {/* { render only if there's an image } */}
          {
            content.imgSrc && <div className='article-img-container'>
              <WindowCard
                content={<img src={content.imgSrc}></img>}
              ></WindowCard>
            </div>
          }

          <section>
            <div className='whitespace-pre-wrap'><Linkify>{content.body}</Linkify></div>
          </section>

        </>
      }
      {
        !content && (
          <section>
            <div>Event details not found.</div>
          </section>
        )
      }
    </div>
  );
}

export default Article;
