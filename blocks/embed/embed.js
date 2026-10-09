/**
 * Embed block: turns an authored link into a lazily loaded, responsive iframe.
 * Optional second cell: aspect ratio as "width:height" (default 16:9).
 */
export default function decorate(block) {
  const link = block.querySelector('a');
  if (!link) return;
  let url;
  try {
    url = new URL(link.href);
  } catch {
    return;
  }
  if (url.protocol !== 'https:') url.protocol = 'https:';

  const ratioText = [...block.querySelectorAll(':scope > div > div')]
    .map((cell) => cell.textContent.trim())
    .find((text) => /^\d+\s*:\s*\d+$/.test(text));
  const [w, h] = (ratioText || '16:9').split(':').map((n) => parseInt(n, 10));

  const wrapper = document.createElement('div');
  wrapper.className = 'embed-frame';
  wrapper.style.aspectRatio = `${w} / ${h}`;

  const placeholder = document.createElement('a');
  placeholder.href = url.href;
  placeholder.textContent = link.textContent.trim() || url.href;
  wrapper.append(placeholder);
  block.replaceChildren(wrapper);

  const load = () => {
    const iframe = document.createElement('iframe');
    iframe.src = url.href;
    iframe.title = link.title || link.textContent.trim() || 'Embedded content';
    iframe.loading = 'lazy';
    iframe.allowFullscreen = true;
    wrapper.replaceChildren(iframe);
  };
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      load();
    }
  });
  observer.observe(block);
}
