import { getMetadata } from '../../scripts/aem.js';

const DEFAULT_SHORTNAME = 'brucelefebvre';
// threads were created against the production URL, so keep identifying them by it
// on preview and live hosts too
const PRODUCTION_ORIGIN = 'https://implementationdetails.dev';

/**
 * Comments block: lazily loads the Disqus thread for the current post.
 */
export default function decorate(block) {
  const shortname = getMetadata('disqus-shortname') || DEFAULT_SHORTNAME;
  const path = window.location.pathname.replace(/\/$/, '');
  const identifier = `${PRODUCTION_ORIGIN}${path}`;

  const thread = document.createElement('div');
  thread.id = 'disqus_thread';
  block.replaceChildren(thread);

  const load = () => {
    window.disqus_config = function disqusConfig() {
      this.page.url = identifier;
      this.page.identifier = identifier;
      this.page.title = getMetadata('og:title') || document.title;
    };
    const script = document.createElement('script');
    script.src = `https://${shortname}.disqus.com/embed.js`;
    script.async = true;
    script.dataset.timestamp = Date.now();
    document.head.append(script);
  };

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      load();
    }
  }, { rootMargin: '300px' });
  observer.observe(block);
}
