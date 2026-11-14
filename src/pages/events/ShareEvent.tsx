import React, { useEffect, useId, useRef, useState } from 'react';
import { FiCheck, FiCopy, FiShare2 } from 'react-icons/fi';
import { copyEventLink, shareEvent } from './eventSharing';
import './ShareEvent.css';

interface ShareEventProps {
  title: string;
  pageUrl: string;
}

function ShareEvent({ title, pageUrl }: ShareEventProps) {
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const linkId = useId();
  const linkInput = useRef<HTMLInputElement>(null);
  const supportsSharing = typeof navigator.share === 'function';

  useEffect(() => {
    if (showLink) linkInput.current?.focus();
  }, [showLink]);

  async function handleShare() {
    setBusy(true);
    setMessage('');
    setCopied(false);
    const result = await shareEvent(title, pageUrl, navigator);
    setBusy(false);

    if (result === 'failed' || result === 'unavailable') {
      setMessage('Sharing is unavailable. Copy the link or select it below.');
      setShowLink(true);
    }
  }

  async function handleCopy() {
    setBusy(true);
    setMessage('');
    const success = await copyEventLink(pageUrl, navigator);
    setBusy(false);
    setCopied(success);
    setShowLink(!success);
    setMessage(success ? 'Link copied.' : 'Could not copy automatically. Select and copy the event link below.');
  }

  return (
    <div className='event-share' role='group' aria-label='Share this event'>
      <div className='event-share-buttons'>
        {supportsSharing && (
          <button type='button' className='event-share-button' onClick={handleShare} disabled={busy}>
            <FiShare2 aria-hidden='true' focusable='false' />
            Share event
          </button>
        )}
        <button type='button' className='event-share-button' onClick={handleCopy} disabled={busy}>
          {copied ? <FiCheck aria-hidden='true' focusable='false' /> : <FiCopy aria-hidden='true' focusable='false' />}
          Copy link
        </button>
      </div>
      <p className='event-share-status' role='status' aria-live='polite' aria-atomic='true'>{message}</p>
      {showLink && (
        <div className='event-share-fallback'>
          <label htmlFor={linkId}>Event link</label>
          <input
            ref={linkInput}
            id={linkId}
            type='text'
            readOnly
            value={pageUrl}
            onFocus={(event) => event.currentTarget.select()}
          />
        </div>
      )}
    </div>
  );
}

export default ShareEvent;
