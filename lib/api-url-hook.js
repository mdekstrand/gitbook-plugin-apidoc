"use strict";
const cheerio = require('cheerio');

function pageHook(page) {
  let base = this.config.get('pluginsConfig.apiurl.javadocBase', '/apidocs/');
  if (!base.endsWith('/')) {
    base += '/';
  }
  let $ = cheerio.load(page.content);
  $('a[href]').each(function() {
    var url = $(this).attr('href');
    if (!url) return;

    var m = url.match(/^api:(.*)/);
    if (m) {
      var path = m[1];
      var parts = path.split('.');
      var last = parts[parts.length - 1];
      var htmlpath;
      if (last == last.toLowerCase()) {
        // package
        htmlpath = parts.join('/') + '/package-info.html';
      } else {
        htmlpath = parts.join('/') + '.html';
      }
      $(this).attr('href', base + htmlpath);
    }
  });
  page.content = $.html();
  return page;
}

module.exports = pageHook;