export function seo(data = {}) {
    data.title = data.title || 'Bitveen.com | START WRITING BLOGS';
    data.metaDescription = data.metaDescription || 'If you have content to write, knowledge to share, an information to spread, or to tell about your business — use Bitveen.com - Signin for free.';
    data.metaImage = data.metaImage || 'https://bitveen.com/logo192.png';
  
    document.title = data.title;
    document.querySelector('meta[name="description"]').setAttribute('content', data.metaDescription);
    document.querySelector('meta[property=og\\:image]').setAttribute('content', data.metaImage);
}