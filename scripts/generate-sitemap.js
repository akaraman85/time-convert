const fs = require('fs')
const path = require('path')
const { SitemapStream, streamToPromise } = require('sitemap')
const { Readable } = require('stream')

// Add your domain here
const DOMAIN = 'https://time-convert.vercel.app'

// List of all your pages
const pages = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  // Add more pages as needed
]

async function generateSitemap() {
  const sitemap = new SitemapStream({
    hostname: DOMAIN,
    xmlns: {
      news: false,
      xhtml: false,
      image: false,
      video: false,
    },
  })

  const sitemapPath = path.resolve('./public', 'sitemap.xml')
  const writeStream = fs.createWriteStream(sitemapPath)
  sitemap.pipe(writeStream)

  // Add all pages to sitemap
  pages.forEach(page => {
    sitemap.write({
      url: page.url,
      changefreq: page.changefreq || 'weekly',
      priority: page.priority || 0.7,
      lastmod: new Date().toISOString(),
    })
  })

  sitemap.end()
  await streamToPromise(Readable.from(sitemap))

  console.log(`Sitemap generated at: ${sitemapPath}`)
}

generateSitemap().catch(console.error)
