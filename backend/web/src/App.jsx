import { useState, useRef } from 'react';
import QRCode from 'qrcode';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function App() {
  const [content, setContent] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const generateQRCode = async (url) => {
    try {
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      setQrCodeUrl(qrDataUrl);
    } catch (err) {
      console.error('QR Code generation failed:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Please enter some content to share');
      return;
    }

    setLoading(true);
    setError('');
    setShareLink('');
    setQrCodeUrl('');

    try {
      const response = await fetch(`${API_URL}/paste`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          customCode: customCode.trim() || undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create paste');
      }

      setShareLink(data.url);
      await generateQRCode(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleReset = () => {
    setContent('');
    setCustomCode('');
    setShareLink('');
    setQrCodeUrl('');
    setError('');
  };

  return (
    <div className="container">
      <header>
        <h1>EasyPaste</h1>
        <p>Share text and code instantly</p>
      </header>

      <main>
        {!shareLink ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="content">Content to share</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your text or code here..."
                rows={12}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="customCode">
                Custom share code (optional)
              </label>
              <input
                id="customCode"
                type="text"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="custom-url-code"
                pattern="[a-zA-Z0-9_\-]{4,50}"
                title="4-50 characters: letters, numbers, underscore, hyphen"
                minLength="4"
                maxLength="50"
              />
              <small>Leave empty for auto-generated code (min 4 characters)</small>
            </div>

            {error && (
              <div className="error-message">{error}</div>
            )}

            <button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Generate Share Link'}
            </button>
          </form>
        ) : (
          <div className="result">
            <h2>Share Link Created!</h2>
            
            <div className="share-link-container">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="share-link"
              />
              <button onClick={copyToClipboard} className="copy-btn">
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            {qrCodeUrl && (
              <div className="qr-code">
                <h3>QR Code</h3>
                <img src={qrCodeUrl} alt="QR Code" />
              </div>
            )}

            <button onClick={handleReset} className="reset-btn">
              Create Another
            </button>
          </div>
        )}
      </main>

      <footer>
        <div className="footer-links">
          <a href="/downloads/easypaste-macos" download className="download-cli">
            Download CLI Tool (macOS)
          </a>
          <span className="separator">•</span>
          <span>Data stored for 24 hours</span>
        </div>
      </footer>
    </div>
  );
}

export default App;