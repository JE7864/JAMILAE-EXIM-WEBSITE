# Jamila Exim

A responsive parent-company gateway for JEBG AI Technologies and International Exports. Built with HTML, CSS, and JavaScript; no build tools required.

## Destinations

- JEBG AI Technologies: https://jebg.jamilaexim.com/
- International Exports: https://jamilaexim.linker.store/

Update `destinations.js` to change links. Also update the matching fallback `href` values in `index.html` so navigation works without JavaScript.

## Publish with GitHub Pages

Open repository **Settings → Pages**. Under Build and deployment, select **Deploy from a branch**, choose **main** and **/ (root)**, then Save. GitHub displays the actual live URL after deployment.

Expected project URL once Pages is enabled: https://je7864.github.io/JAMILAE-EXIM-WEBSITE/

For a custom domain, configure it in Pages settings and follow the DNS instructions GitHub provides. No custom domain is configured by this change.

## Behavior and validation

Animated entrance, hover illustrations, and a 650 ms destination transition. Native links work without JavaScript, modified clicks preserve browser behavior, and reduced-motion preferences skip the transition. Back navigation clears the transition overlay.

Navigation script checked for normal and reduced-motion behavior with simulated browser objects. Source was retrieved from GitHub after creation. Browser visual QA and live hosting verification remain outstanding.

## Search discovery

The production canonical URL is https://www.jamilaexim.com/ (also configured in CNAME).

- `/sitemap.xml` lists the canonical homepage, currently the only public HTML page on this domain.
- `/robots.txt` allows crawling and advertises the sitemap.
- `index.html` declares the same canonical URL and links to the XML sitemap.

When adding public pages on this domain, add their absolute canonical URLs to `sitemap.xml`. Exclude redirects, duplicate URLs, fragments, assets, and pages on other domains. The JEBG and export destinations need their own sitemaps.

For crawl reporting, submit `https://www.jamilaexim.com/sitemap.xml` in the verified Google Search Console property and Bing Webmaster Tools. Publishing a sitemap supports discovery but does not guarantee indexing or rankings.
