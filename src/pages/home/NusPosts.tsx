import React, { useEffect, useRef, useState } from 'react';
import { GoArrowUpRight } from 'react-icons/go';
import { loadPosts, Post, PostType, SITE } from './wordpress';
import './NusPosts.css';

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' });

function PostCard({ post }: { post: Post }) {
  return (
    <li>
      <a className='post-card' href={post.link} target='_blank' rel='noopener noreferrer'>
        <div className='post-image'>
          {/* Decorative: the title right below already says what the story is. */}
          {post.image && <img src={post.image} alt='' loading='lazy' decoding='async' referrerPolicy='no-referrer'
            onError={(event) => { event.currentTarget.style.visibility = 'hidden'; }} />}
        </div>
        <div className='post-body'>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <h3>{post.title}</h3>
          {post.excerpt && <p>{post.excerpt}</p>}
          <span className='post-open'>Read article <GoArrowUpRight aria-hidden /></span>
          <span className='sr-only'>(opens in a new tab)</span>
        </div>
      </a>
    </li>
  );
}

export default function NusPosts(
  { type, title, description, noOfPosts = 6 }:
    { type: PostType; title: string; description: string; noOfPosts?: number },
) {
  const root = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [error, setError] = useState(false);

  // this is a counter designed to cause the loadPost function to try again
  // when the try again button is calld. it deliverately is used to cause
  // the use effect to rerender. Thats all.
  const [attempt, setAttempt] = useState(0);

  // Same as Gallery: only fetch once the section is about to scroll into view.
  useEffect(() => {
    if (!('IntersectionObserver' in window)) { setVisible(true); return; }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { rootMargin: '250px' });
    if (root.current) observer.observe(root.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let active = true;

    setError(false);
    loadPosts(type, noOfPosts).then((result) => { if (active) setPosts(result); })
      .catch(() => { if (active) setError(true); });

    return () => { active = false; };
  }, [type, noOfPosts, visible, attempt]);

  const allLink = `${SITE}${type}/`;

  return (
    <section ref={root} className='nus-posts' aria-labelledby={`posts-${type}-title`}>
      <div className='posts-inner'>
        <div className='posts-heading'>
          <div>
            <h2 id={`posts-${type}-title`}>{title}</h2>
            <p>{description}</p>
          </div>
          <a href={allLink} target='_blank' rel='noopener noreferrer'>View all <GoArrowUpRight aria-hidden /></a>
        </div>

        {error || posts?.length === 0 ? (
          <div className='posts-message'>
            <h4>{error ? 'Stories are taking a little longer.' : 'No stories yet.'}</h4>
            <div>
              {/* we dont directly call loadPosts again so that the old fetching and active */}
              {/* cleanly id discarded, the stale requests are removed and then only new one */}
              {/* created saving space */}
              {error && <button onClick={() => setAttempt(attempt + 1)}>Try again</button>}
              <a href={allLink} target='_blank' rel='noopener noreferrer'>Read on NUS Computing</a>
            </div>
          </div>
        ) : (
          <ul className='posts-grid' aria-busy={!posts}>
            {posts ? posts.map((post) => <PostCard key={post.id} post={post} />)
              : Array.from({ length: noOfPosts }, (_, slot) =>
                <li key={slot} className='post-skeleton' aria-hidden='true' />)}
          </ul>
        )}
      </div>
    </section>
  );
}
