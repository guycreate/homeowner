// Arguments that will receive the mapping function:
//
// * dato: lets you easily access any content stored in your DatoCMS
//   administrative area;
//
// * root: represents the root of your project, and exposes commands to
//   easily create local files/directories;
//
// * i18n: allows to switch the current locale to get back content in
//   alternative locales from the first argument.
//
// Read all the details here:
// https://github.com/datocms/js-datocms-client/blob/master/docs/dato-cli.md
var util = require('util'); 
module.exports = (dato, root, i18n) => {

  // Create a YAML data file to store global data about the site
  root.createDataFile('source/_data/settings.yml', 'yaml', {
    name: dato.site.globalSeo.siteName,
    language: dato.site.locales[0],
    intro: dato.home.introText,
    copyright: dato.home.copyright,
    sideimage: dato.home.sideimage.url({ w: 150, fm: 'jpg', auto: 'compress' }),
    // iterate over all the `social_profile` item types
    socialProfiles: dato.socialProfiles.map(profile => {
      return {
        type: profile.profileType.toLowerCase().replace(/ +/, '-'),
        url: profile.url,
      };
    }),
    faviconMetaTags: dato.site.faviconMetaTags,
    seoMetaTags: dato.home.seoMetaTags
  });
  
  var catfile = dato.sectiontypes.map( sectiontype => {
      return {
        title:        sectiontype.title,
        coverImage:   sectiontype.coverImage.url({ w: 450, fm: 'jpg', auto: 'compress' }),
        slug:     sectiontype.slug,
        path:     '/' + sectiontype.slug
      };
  });
  
  root.createDataFile('source/_data/sectiontypes.yml', 'yaml', catfile)
  console.log(util.inspect(catfile));

  // Create a `_posts` directory (or empty it if already exists)...
  root.directory('source/_posts', dir => {
    // ...and for each of the works stored online...
    dato.kitchens.forEach((kitchen, index) => {
      // ...create a markdown file with all the metadata in the frontmatter
      dir.createPost(`${kitchen.slug}.md`, 'yaml', {
        frontmatter: {
          title: kitchen.title,
          layout: 'post',
          category: 'kitchen',
          media: kitchen.media ? kitchen.media.url() : null,
          coverImage: kitchen.coverImage.url({ w: 450, fm: 'jpg', auto: 'compress' }),
          detailImage: kitchen.coverImage.url({ w: 600, fm: 'jpg', auto: 'compress' }),
          position: index,
          contentExcerpt: kitchen.excerpt,
        },
        content: kitchen.description
      });
    });
     dato.systems.forEach((system, index) => {
      // ...create a markdown file with all the metadata in the frontmatter
      dir.createPost(`${system.slug}.md`, 'yaml', {
        frontmatter: {
          title: system.title,
          layout: 'post',
          category: 'system',
          media: system.media ? system.media.url() : null,
          coverImage: system.coverImage.url({ w: 450, fm: 'jpg', auto: 'compress' }),
          detailImage: system.coverImage.url({ w: 600, fm: 'jpg', auto: 'compress' }),
          position: index,
          contentExcerpt: system.excerpt,
        },
        content: system.description
      });
    });
  });
};

