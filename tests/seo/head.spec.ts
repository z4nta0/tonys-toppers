


// #region Imports

import { expect } from '@playwright/test'; // What: Expect. Why: Each check passes only when the page says what it should. How: This asserts on what each check reads, such as the page's head.
import { test   } from '@playwright/test'; // What: Test. Why: Each route and each file is its own test. How: This declares them.

// #endregion Imports



/**
 * head.spec.ts = Head Spec
 *
 * @summary
 * Checks the site's SEO setup in whichever engine the project runs. Tony's
 * Toppers is a real maker's site, so the home page has to be findable and
 * describe him accurately. That covers the head's tags, such as the canonical,
 * and the structured data, which has to match what the page itself shows. The
 * social preview tags and the card they point at, the icons the head links
 * to, and the crawler files, such as the sitemap, are checked against what
 * they promise.
 *
 * Sections:
 *  - Constants
 *  - Module Init
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

const FAC_URL_STR = 'https://www.facebook.com/profile.php?id=61560009400871'; // What: Facebook URL String. Why: The structured data's sameAs has to be the Facebook page the site links to. How: This is the address both are compared with.
const LIV_URL_STR = 'https://tonystoppers.com/';                              // What: Live URL String. Why: Every page-level address the checks compare, such as the canonical link, has to be the live one. How: This is the address they're compared with.
const PRE_URL_STR = 'http://localhost:5199/';                                 // What: Preview URL String. Why: The built page is what ships, after the build strips the source's comments and blank lines. How: This is the address the test config's preview server serves the build at.



// #region SOC_KEY_ARR

/**
 * SOC_KEY_ARR = Social Key Array
 *
 * @summary
 * Every Open Graph and Twitter tag key a complete social preview card needs,
 * per the social preview rule. Every row is one tag key the home page must
 * carry, so no row needs a comment of its own.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const SOC_KEY_ARR = [ // What: Social Key Array. Why: The social preview rule lists every tag a complete card needs. How: Each entry names one Open Graph or Twitter tag the page must carry.


	'og:description',
	'og:image',
	'og:image:alt',
	'og:image:height',
	'og:image:type',
	'og:image:width',
	'og:locale',
	'og:site_name',
	'og:title',
	'og:type',
	'og:url',
	'twitter:card',
	'twitter:description',
	'twitter:image',
	'twitter:image:alt',
	'twitter:title'


];

// #endregion SOC_KEY_ARR

// #endregion Constants



// #region Module Init

// #region Home Page Checks

test( 'the home page names the town, the pieces, and the business', async ( { page : curPagObj } ) => { // What: Home Head Test. Why: Search listings show the title and description, and visitors who met Tony at a fair search for him by name and town. How: This loads the home page and checks its title, description, author, canonical, robots tag, and heading.


	await curPagObj.goto( '/' ); // What: Home Open Call. Why: The checks read the home page's head. How: This loads the root path.


	const desConStr = await curPagObj.locator( 'meta[name="description"]' ).getAttribute( 'content' ) ?? ''; // What: Description Content String. Why: The description's wording and length are both checked. How: This reads the tag's content, or an empty string if it's missing.


	await expect( curPagObj ).toHaveTitle( /^Tony's Toppers .*Bolivar, MO$/ );                                 // What: Title Assertion. Why: The title should lead with the business and name its town. How: This checks it starts with the name and ends with the town.
	expect( ( await curPagObj.title() ).length ).toBeLessThanOrEqual( 60 );                                    // What: Title Length Assertion. Why: Search listings and link cards cut long titles off. How: This keeps it to 60 characters or fewer.
	expect( desConStr ).toContain( 'Tony Mawhiney of Bolivar, Missouri' );                                     // What: Description Maker Assertion. Why: The summary should say who makes the pieces and where. How: This checks the description names Tony and his town.
	expect( desConStr ).toContain( 'beaded pens, wine stoppers, keychains' );                                  // What: Description Pieces Assertion. Why: The summary should name the kinds of pieces Tony makes. How: This checks the description lists them.
	expect( desConStr.length ).toBeGreaterThanOrEqual( 120 );                                                  // What: Description Minimum Assertion. Why: A summary that's too short wastes the space a listing gives it, and link preview checkers flag one under 120 characters. How: This checks it runs at least 120 characters.
	expect( desConStr.length ).toBeLessThanOrEqual( 125 );                                                     // What: Description Maximum Assertion. Why: Phones cut a summary off around 125 characters. How: This checks it stays within that.
	await expect( curPagObj.locator( 'meta[name="description"]' ) ).toHaveCount( 1 );                          // What: Single Description Assertion. Why: React 19 adds a rendered description beside index.html's rather than replacing it, so a page could end up with two. How: This checks the home page has exactly one.
	await expect( curPagObj.locator( 'meta[name="author"]' ) ).toHaveAttribute( 'content', "Tony's Toppers" ); // What: Author Assertion. Why: A real business's site names the business as its author. How: This checks the author tag.
	await expect( curPagObj.locator( 'link[rel="canonical"]' ) ).toHaveAttribute( 'href', LIV_URL_STR );       // What: Canonical Assertion. Why: Every address Netlify serves the site at should count as the live one. How: This checks the canonical link names the live address.
	await expect( curPagObj.locator( 'meta[name="robots"]' ) ).toHaveCount( 0 );                               // What: Indexable Assertion. Why: The home page has to stay findable. How: This checks it carries no robots tag that could keep it out.
	await expect( curPagObj.getByRole( 'heading', { level : 1 } ) ).toHaveCount( 1 );                          // What: Single Heading Assertion. Why: One h1 tells search engines and screen readers what the page is about. How: This checks there's exactly one.


} );



test( 'the raw page carries the home title and description for script-free readers', async ( { request : reqCotObj } ) => { // What: Raw Head Test. Why: Link checkers and many crawlers read the page without running the site's script, so the title and description have to be in index.html itself. How: This fetches the root as raw HTML and checks the title and the one description.


	const rawHtmStr = await ( await reqCotObj.get( '/' ) ).text();                                                                       // What: Raw HTML String. Why: The page is read the way a script-free reader reads it. How: This fetches the root's HTML without a browser.
	const desMatArr = [ ...rawHtmStr.matchAll( /<meta name='description' content='([^']*)'/g ) ].map( ( desMatObj ) => desMatObj[ 1 ] ); // What: Description Match Array. Why: The raw page should carry exactly one description. How: This collects the content of each single-quoted, name-then-content description tag in it.


	expect( rawHtmStr.match( /<title>([^<]*)<\/title>/ )?.[ 1 ] ).toBe( "Tony's Toppers | Handmade Beaded Crafts in Bolivar, MO" ); // What: Raw Title Assertion. Why: The raw page should name the home page in full, not the bare site name. How: This checks the title element's text.
	expect( desMatArr ).toHaveLength( 1 );                                                                                          // What: Raw Single Description Assertion. Why: Readers without the script see only what index.html carries. How: This checks there's exactly one such tag.
	expect( desMatArr[ 0 ].length ).toBeGreaterThanOrEqual( 120 );                                                                  // What: Raw Description Minimum Assertion. Why: Link preview checkers flag a summary under 120 characters. How: This checks the raw description's length.
	expect( desMatArr[ 0 ].length ).toBeLessThanOrEqual( 125 );                                                                     // What: Raw Description Maximum Assertion. Why: Phones cut a summary off around 125 characters. How: This checks the raw description's length.


} );



test( 'the built page carries the same head, with valid structured data', async ( { browserName : broNamStr, request : reqCotObj } ) => { // What: Built Head Test. Why: The build rewrites index.html, stripping its comments and blank lines, and that page is the one crawlers read. How: This fetches the preview server's root as raw HTML and checks its title, one description, canonical, preview image, and parsed structured data.


	test.skip( broNamStr !== 'chromium', 'The built page reads the same in every engine, so this runs in Chromium only.' ); // What: Chromium Only Skip. Why: A fetched file doesn't change with the engine. How: This skips the check outside Chromium, saying why.



	const bltHtmStr = await ( await reqCotObj.get( PRE_URL_STR ) ).text();                                                               // What: Built HTML String. Why: The page is read the way a script-free reader reads what ships. How: This fetches the preview server's root without running anything.
	const desMatArr = [ ...bltHtmStr.matchAll( /<meta name='description' content='([^']*)'/g ) ].map( ( desMatObj ) => desMatObj[ 1 ] ); // What: Description Match Array. Why: The built page should carry exactly one description. How: This collects the content of each description tag.
	const ldjTexStr = bltHtmStr.match( /<script type='application\/ld\+json'>([\s\S]*?)<\/script>/ )?.[ 1 ] ?? '';                       // What: Linked-Data-JSON Text String. Why: The structured data has to survive the build as valid JSON. How: This takes the script's contents, or an empty string when it's missing.


	expect( bltHtmStr.match( /<title>([^<]*)<\/title>/ )?.[ 1 ] ).toBe( "Tony's Toppers | Handmade Beaded Crafts in Bolivar, MO" ); // What: Built Title Assertion. Why: The shipped page should name the home page in full. How: This checks the title tag's text.
	expect( desMatArr ).toHaveLength( 1 );                                                                                          // What: Built Single Description Assertion. Why: Crawlers that never run the script read only what the shipped page carries. How: This checks there's exactly one description.
	expect( bltHtmStr ).toContain( `<link href='${ LIV_URL_STR }' rel='canonical' />` );                                            // What: Built Canonical Assertion. Why: The canonical has to reach crawlers that never run the script. How: This checks the built page links the live address as canonical.
	expect( bltHtmStr ).toMatch( new RegExp( `<meta property='og:image' +content='${ LIV_URL_STR }og-image\\.jpg' />` ) );          // What: Built Preview Image Assertion. Why: Link previews read the image from the shipped page. How: This checks the og:image tag names the live card.
	expect( JSON.parse( ldjTexStr )[ '@graph' ] ).toHaveLength( 3 );                                                                // What: Built Structured Data Assertion. Why: Invalid JSON would hide the business, Tony, and the site from search engines. How: This parses the script and checks its graph holds the three nodes.


} );



test( 'the structured data matches what the page shows', async ( { page : curPagObj } ) => { // What: Structured Data Test. Why: Search engines may show the business's and Tony's details from the JSON-LD, so every claim in it has to be true and visible on the page. How: This reads the JSON-LD and checks each detail against the page's own text and links.


	await curPagObj.goto( '/' ); // What: Home Open Call. Why: The structured data lives on the home page. How: This loads the root path.


	const ldjTexStr = await curPagObj.locator( 'script[type="application/ld+json"]' ).textContent() ?? '{}';                                                           // What: Linked-Data-JSON Text String. Why: The structured data is read as written in the page. How: This reads the script's text, or an empty object if it's missing.
	const pagTexStr = await curPagObj.locator( 'body' ).textContent() ?? '';                                                                                           // What: Page Text String. Why: Every claim has to appear on the page. How: This reads the page's text as written, before CSS uppercases any of it.
	const telHreArr = await curPagObj.locator( 'a[href^="tel:"]' ).evaluateAll( ( ancEleArr ) => ancEleArr.map( ( ancCurEle ) => ancCurEle.getAttribute( 'href' ) ) ); // What: Telephone Href Array. Why: The structured data's phone has to be the number the page's call links dial. How: This collects every call link's address.

	type LdjNodTyp = { '@id'? : string, '@type'? : string, address? : object, birthDate? : string, founder? : { '@id' : string }, gender? : string, name? : string, publisher? : { '@id' : string }, sameAs? : string[], telephone? : string, url? : string, worksFor? : { '@id' : string } }; // What: Linked-Data-JSON Node Type. Why: Each node's fields are read by name, and a missing one should read as undefined rather than fail to type check. How: This lists every field the checks read, all optional.

	const ldjGraArr : LdjNodTyp[] = JSON.parse( ldjTexStr )[ '@graph' ] ?? []; // What: Linked-Data-JSON Graph Array. Why: The business, Tony, and the site are separate nodes, each checked on its own. How: This parses the text and reads its graph, or an empty list if it's missing.

	const orgNodObj = ldjGraArr.find( ( graNodObj ) => graNodObj[ '@type' ] === 'Organization' ) ?? {}; // What: Organization Node Object. Why: The business's details are checked together. How: This finds its node, or an empty object if it's missing.
	const perNodObj = ldjGraArr.find( ( graNodObj ) => graNodObj[ '@type' ] === 'Person' ) ?? {};       // What: Person Node Object. Why: Tony's details are checked together. How: This finds his node, or an empty object if it's missing.
	const webNodObj = ldjGraArr.find( ( graNodObj ) => graNodObj[ '@type' ] === 'WebSite' ) ?? {};      // What: WebSite Node Object. Why: The site's details are checked together. How: This finds its node, or an empty object if it's missing.


	expect( [ orgNodObj.name, orgNodObj.url, webNodObj.name, webNodObj.url ] ).toEqual( [ "Tony's Toppers", LIV_URL_STR, "Tony's Toppers", LIV_URL_STR ] ); // What: Business Name Assertion. Why: The business and the site have to carry the name and live address the site uses everywhere. How: This checks both nodes' names and addresses.
	expect( [ orgNodObj.founder?.[ '@id' ], perNodObj.worksFor?.[ '@id' ], webNodObj.publisher?.[ '@id' ] ] ).toEqual( [ perNodObj[ '@id' ], orgNodObj[ '@id' ], orgNodObj[ '@id' ] ] ); // What: Node Links Assertion. Why: Search engines join the nodes by their IDs, so Tony has to be the business's founder and the business the site's publisher. How: This checks each link points at the right node.
	expect( perNodObj.name ).toBe( 'Tony Mawhiney' );                                        // What: Maker Name Assertion. Why: The person has to be Tony. How: This checks his name.
	expect( pagTexStr ).toContain( 'Tony Mawhiney' );                                        // What: Maker Shown Assertion. Why: The name in the data has to be visible on the page. How: This checks the page shows it.
	expect( [ perNodObj.birthDate, perNodObj.gender ] ).toEqual( [ undefined, undefined ] ); // What: Private Details Assertion. Why: The site never publishes Tony's birth date or gender in its data. How: This checks the person node leaves those two out.
	expect( telHreArr.length ).toBeGreaterThan( 0 );                                         // What: Call Link Presence Assertion. Why: A phone in the data is only honest if the page offers it. How: This checks the page has call links.


	for ( const telHreStr of telHreArr ) expect( telHreStr?.replace( /\D/g, '' ) ).toBe( ( orgNodObj.telephone ?? '' ).replace( /\D/g, '' ).replace( /^1/, '' ) ); // What: Phone Match Assertion. Why: Every call link and the data must dial the same number. How: This compares their digits, dropping the data's leading country code.



	expect( pagTexStr ).toContain( '(417) 733-0681' ); // What: Phone Shown Assertion. Why: The number in the data has to be visible on the page. How: This checks the page shows it.


	for ( const nodCurObj of [ orgNodObj, perNodObj ] ) expect( nodCurObj.address ).toEqual( { '@type' : 'PostalAddress', addressCountry : 'US', addressLocality : 'Bolivar', addressRegion : 'MO' } ); // What: Town Only Assertion. Why: Tony's home is private, so the data gives his town and nothing finer. How: This checks each address is exactly Bolivar, Missouri, with no street or postal code.



	expect( pagTexStr ).toContain( 'Bolivar, Missouri' );                                     // What: Town Shown Assertion. Why: The town in the data has to be visible on the page. How: This checks the page shows it.
	expect( orgNodObj.sameAs ).toEqual( [ FAC_URL_STR ] );                                    // What: Facebook Profile Assertion. Why: The data should point to the business's one other home on the web. How: This checks sameAs lists the Facebook page alone.
	await expect( curPagObj.locator( `a[href="${ FAC_URL_STR }"]` ).first() ).toBeAttached(); // What: Facebook Shown Assertion. Why: The profile in the data has to be one the page links to. How: This checks the page has a link to it.


} );

// #endregion Home Page Checks



// #region Not Found Page Checks

test( 'the 404 page stays out of search results', async ( { page : curPagObj } ) => { // What: Not Found Head Test. Why: The host answers every unknown address with a 200, so the 404 page must ask not to be indexed. How: This loads an unknown address and checks its head tags and heading.


	await curPagObj.goto( '/no-such-page' ); // What: Unknown Address Open Call. Why: Every unknown path shows the 404 page. How: This loads one.

	await expect( curPagObj.locator( 'meta[name="robots"]' ) ).toHaveAttribute( 'content', 'noindex' );  // What: Noindex Assertion. Why: Search engines must leave the page out. How: This checks the robots tag.
	await expect( curPagObj.locator( 'link[rel="canonical"]' ) ).toHaveAttribute( 'href', LIV_URL_STR ); // What: Canonical Assertion. Why: The 404 page keeps the home page's canonical beside its noindex, as CLAUDE.md records. How: This checks the canonical link names the live address.
	await expect( curPagObj ).toHaveTitle( "Page Not Found | Tony's Toppers" );                          // What: Not Found Title Assertion. Why: The page needs a title of its own. How: This checks it.
	await expect( curPagObj.locator( 'meta[name="description"]' ) ).toHaveCount( 1 );                    // What: Single Description Assertion. Why: Every route should carry exactly one description, and the 404 page keeps index.html's. How: This checks there's exactly one.
	await expect( curPagObj.getByRole( 'heading', { level : 1 } ) ).toHaveCount( 1 );                    // What: Single Heading Assertion. Why: Every page should have exactly one h1. How: This checks the 404 page has one.


} );

// #endregion Not Found Page Checks



// #region Social Preview Checks

test( 'the social preview tags are complete', async ( { page : curPagObj } ) => { // What: Social Tags Test. Why: A link shared anywhere should show a full card that matches the page. How: This loads the home page and checks its social tags and preview image against the page.


	await curPagObj.goto( '/' ); // What: Home Load Call. Why: Link scrapers read the page every route shares. How: This opens the home page.


	const socTagArr = await curPagObj.locator( 'meta[property^="og:"], meta[name^="twitter:"]' ).evaluateAll( ( tagEleArr ) => tagEleArr.map( ( tagCurEle ) => [ tagCurEle.getAttribute( 'property' ) || tagCurEle.getAttribute( 'name' ) || '', tagCurEle.getAttribute( 'content' ) || '' ] ) ); // What: Social Tag Array. Why: Every social tag is checked by its key and value. How: This reads each Open Graph and Twitter tag as a key and content pair.
	const socTagObj = Object.fromEntries( socTagArr ); // What: Social Tag Object. Why: Tags are easier to check by key. How: This turns the pairs into an object.


	expect( Object.keys( socTagObj ) ).toEqual( expect.arrayContaining( SOC_KEY_ARR ) ); // What: Complete Tags Assertion. Why: A missing tag leaves part of the card blank. How: This checks every required key is present, allowing optional extras.
	expect( SOC_KEY_ARR.filter( ( socKeyStr ) => !socTagObj[ socKeyStr ] ) ).toEqual( [] ); // What: Filled Tags Assertion. Why: A tag that's present but empty still leaves part of the card blank. How: This lists every required tag with no content, which should be none.
	expect( [ socTagObj[ 'og:type' ], socTagObj[ 'og:locale' ], socTagObj[ 'twitter:card' ] ] ).toEqual( [ 'website', 'en_US', 'summary_large_image' ] );                                          // What: Fixed Values Assertion. Why: The rule names the type and card layout, and the locale says the card is in US English. How: This checks the three tags hold those values.
	expect( [ socTagObj[ 'og:image' ], socTagObj[ 'og:url' ], socTagObj[ 'twitter:image' ] ] ).toEqual( [ `${ LIV_URL_STR }og-image.jpg`, LIV_URL_STR, `${ LIV_URL_STR }og-image.jpg` ] );         // What: Absolute URLs Assertion. Why: Scrapers can't resolve a relative address. How: This checks each URL tag names the live HTTPS address.
	expect( [ socTagObj[ 'og:image:type' ], socTagObj[ 'og:image:width' ], socTagObj[ 'og:image:height' ] ] ).toEqual( [ 'image/jpeg', '1200', '630' ] );                                          // What: Image Facts Assertion. Why: The tags have to describe the file they point at. How: This checks the type and size they give.
	expect( [ socTagObj[ 'og:title' ], socTagObj[ 'twitter:title' ] ] ).toEqual( [ await curPagObj.title(), await curPagObj.title() ] );                                                           // What: Title Match Assertion. Why: A card should name the page the way its tab does. How: This checks both card titles match the page title.
	expect( [ socTagObj[ 'og:description' ], socTagObj[ 'twitter:description' ] ] ).toEqual( Array( 2 ).fill( await curPagObj.locator( 'meta[name="description"]' ).getAttribute( 'content' ) ) ); // What: Description Match Assertion. Why: A card should sum the page up the way its search listing does. How: This checks both card descriptions match the page's description.
	await expect( curPagObj.locator( 'meta[name="theme-color"]' ) ).toHaveAttribute( 'content', /^#[0-9a-f]{6}$/i );                                                                               // What: Theme Color Assertion. Why: Discord edges a link's card in the theme color, and the social preview rule lists it among the tags. How: This checks the tag holds a hex color.


} );



test( 'the social preview image is a 1,200x630 JPEG under 300 KB', async ( { request : reqCotObj } ) => { // What: Preview Image Test. Why: The social tags promise a 1,200x630 card small enough for WhatsApp. How: This fetches the image, checks its served type and byte count, and reads its size from the JPEG's frame header.


	const imaResObj = await reqCotObj.get( '/og-image.jpg' ); // What: Image Response Object. Why: The image has to exist where the tags point. How: This fetches it from the site.
	const jpeBufObj = await imaResObj.body();                 // What: JPEG Buffer Object. Why: The image's size is written in its frame header. How: This reads the response bytes.

	let segOffNum = 2; // What: Segment Offset Number. Why: A JPEG's size sits in its frame segment, after a varying run of other segments. How: This starts just past the file's opening marker.


	while ( segOffNum < jpeBufObj.length && ( jpeBufObj[ segOffNum + 1 ] < 0xC0 || jpeBufObj[ segOffNum + 1 ] > 0xC2 ) ) segOffNum += 2 + jpeBufObj.readUInt16BE( segOffNum + 2 ); // What: Frame Segment Search. Why: The frame segment's marker is 0xC0, 0xC1, or 0xC2, and every segment before it gives its own length. How: This hops from segment to segment until it lands on the frame.



	expect( imaResObj.headers()[ 'content-type' ] ).toBe( 'image/jpeg' );                                                    // What: JPEG Type Assertion. Why: The tags promise a JPEG. How: This checks the served type.
	expect( jpeBufObj.length ).toBeLessThan( 300 * 1024 );                                                                   // What: JPEG Bytes Assertion. Why: WhatsApp drops a preview image of 300 KB or more. How: This checks the file's byte count.
	expect( [ jpeBufObj.readUInt16BE( segOffNum + 7 ), jpeBufObj.readUInt16BE( segOffNum + 5 ) ] ).toEqual( [ 1200, 630 ] ); // What: JPEG Size Assertion. Why: The tags promise 1,200 by 630 pixels. How: This reads the width and height the frame segment stores after its marker, length, and precision.


} );



test( 'every icon the head links to is served at its size', async ( { page : curPagObj, request : reqCotObj } ) => { // What: Icons Test. Why: Browsers and apps fetch the icons the head names, and a missing or wrong-sized one shows a blank or blurry mark. How: This reads every icon link and checks each file exists and, for PNGs, has the size its link promises.


	await curPagObj.goto( '/' ); // What: Home Load Call. Why: The icon links live in the page's head. How: This opens the home page.


	const icoLinArr = await curPagObj.locator( 'link[rel="icon"], link[rel="apple-touch-icon"]' ).evaluateAll( ( linEleArr ) => linEleArr.map( ( linCurEle ) => [ linCurEle.getAttribute( 'href' ) || '', linCurEle.getAttribute( 'sizes' ) || '' ] ) ); // What: Icon Link Array. Why: Each icon is checked against its own link. How: This reads every icon link's address and size.


	expect( icoLinArr.length ).toBe( 7 ); // What: Icon Count Assertion. Why: The set is the SVG, the ICO, four PNG sizes, and the Apple touch icon. How: This checks all seven are linked.


	for ( const [ icoHreStr, icoSizStr ] of icoLinArr ) { // What: Icon Check Loop. Why: Every linked icon has to be real. How: This fetches each one in turn.


		const icoResObj = await reqCotObj.get( icoHreStr ); // What: Icon Response Object. Why: The icon has to exist where its link points. How: This fetches it.
		const icoBufObj = await icoResObj.body();           // What: Icon Buffer Object. Why: A PNG's size is written in its header. How: This reads the bytes.


		expect( icoResObj.ok() ).toBe( true ); // What: Icon Served Assertion. Why: A missing icon falls through to the app's HTML. How: This checks the file is served.


		if ( icoHreStr.endsWith( '.svg' ) ) { // What: SVG Icon Guard. Why: The SVG mark has no fixed size to check. How: This checks it's served as an SVG and moves on.


			expect( icoResObj.headers()[ 'content-type' ] ).toContain( 'image/svg+xml' ); // What: SVG Type Assertion. Why: The SVG favicon should be served as an SVG. How: This checks the served type.



			continue; // What: SVG Skip. Why: The size checks below don't apply to it. How: This moves on to the next icon.


		}



		if ( icoSizStr === 'any' ) { // What: ICO Header Guard. Why: favicon.ico isn't a PNG and has no single size. How: This checks its header marks it an icon file and moves on.


			expect( icoBufObj.readUInt16LE( 2 ) ).toBe( 1 ); // What: ICO Type Assertion. Why: The file has to be a real icon file. How: This checks its header's type field reads 1.



			continue; // What: ICO Skip. Why: The PNG size check below doesn't apply to it. How: This moves on to the next icon.


		}



		expect( `${ icoBufObj.readUInt32BE( 16 ) }x${ icoBufObj.readUInt32BE( 20 ) }` ).toBe( icoSizStr ); // What: PNG Icon Size Assertion. Why: Each PNG should be the size its link promises. How: This reads the width and height from its header.


	}


} );

// #endregion Social Preview Checks



// #region Crawler File Checks

test( 'robots.txt lets crawlers in and names the sitemap', async ( { request : reqCotObj } ) => { // What: Robots File Test. Why: A real maker wants every page crawled and his sitemap found. How: This fetches robots.txt and checks its rules.


	const robResObj = await reqCotObj.get( '/robots.txt' ); // What: Robots Response Object. Why: The file is read the way a crawler reads it. How: This fetches it from the site.
	const robTexStr = await robResObj.text();               // What: Robots Text String. Why: The rules are checked as written. How: This reads the response body.


	expect( robResObj.ok() ).toBe( true );                                   // What: Robots Served Assertion. Why: A missing robots.txt would fall through to the app. How: This checks the file is served.
	expect( robTexStr ).toMatch( /User-agent: \*\nAllow: \// );              // What: Allow All Assertion. Why: Every crawler should be let in. How: This checks the wildcard group allows the whole site.
	expect( robTexStr ).not.toMatch( /Disallow: \// );                       // What: No Block Assertion. Why: Nothing should be blocked from crawling. How: This checks no group disallows the site.
	expect( robTexStr ).toContain( `Sitemap: ${ LIV_URL_STR }sitemap.xml` ); // What: Sitemap Line Assertion. Why: Crawlers find the sitemap from here. How: This checks it names the sitemap's absolute address.


} );



test( 'the sitemap lists the home page alone', async ( { request : reqCotObj } ) => { // What: Sitemap Test. Why: The sitemap should list every indexable page and nothing else. How: This fetches it and checks its one entry.


	const sitResObj = await reqCotObj.get( '/sitemap.xml' ); // What: Sitemap Response Object. Why: The file is read the way a crawler reads it. How: This fetches it from the site.
	const sitTexStr = await sitResObj.text();                // What: Sitemap Text String. Why: Its entries are checked as written. How: This reads the response body.


	expect( sitResObj.ok() ).toBe( true );                                                            // What: Sitemap Served Assertion. Why: A missing sitemap would fall through to the app. How: This checks the file is served.
	expect( sitTexStr.match( /<loc>([^<]*)<\/loc>/g ) ).toEqual( [ `<loc>${ LIV_URL_STR }</loc>` ] ); // What: Home Entry Assertion. Why: The home page is the only indexable page. How: This checks the sitemap's entries are exactly its canonical address.


} );

// #endregion Crawler File Checks

// #endregion Module Init


