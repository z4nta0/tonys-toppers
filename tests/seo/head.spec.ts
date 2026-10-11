


// #region Imports

import { expect } from '@playwright/test'; // What: Expect. Why: Each check passes only when the page says what it should. How: This asserts on the page's head, its text, and the crawler files.
import { test   } from '@playwright/test'; // What: Test. Why: Each route and each file is its own test. How: This declares them.

// #endregion Imports



/**
 * head.spec.ts = Head Spec
 *
 * @summary
 * Checks the site's SEO setup in whichever engine the project runs. Tony's
 * Toppers is a real maker's site, so the home page has to be findable and
 * describe him accurately: its title and description name his town and what he
 * makes, its canonical and author tags are in place, it carries no noindex,
 * and its structured data, an Organization for the business, a Person for
 * Tony, and a WebSite, matches what the page itself shows, its phone number,
 * town, and Facebook page, with no street address or birth date. The 404 page
 * carries noindex, and each page has exactly one h1. The social preview tags
 * are complete, use absolute addresses, and match the page's title and
 * description; the card they point at is a 1,200x630 JPEG under 300 KB; and
 * every icon the head links to is served, the PNGs at the size their links
 * promise. robots.txt lets every crawler in and names the sitemap, which lists
 * the home page alone.
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
const LIV_URL_STR = 'https://tonystoppers.com/';                              // What: Live URL String. Why: The canonical link, structured data, sitemap, and social tags must all name the live address. How: This is the address they're compared with.



const SOC_KEY_ARR = [ // What: Social Key Array. Why: The social preview rule lists every tag a complete card needs. How: Each entry names one Open Graph or Twitter tag the page must carry.


	'og:description',      // What: Open Graph Description Key. Why: Every card needs the summary under the title. How: This names the tag.
	'og:image',            // What: Open Graph Image Key. Why: Every card needs the preview image. How: This names the tag.
	'og:image:alt',        // What: Open Graph Image Alt Key. Why: Every card needs the image's description for screen readers. How: This names the tag.
	'og:image:height',     // What: Open Graph Image Height Key. Why: Every card needs the image's height, for laying out the card early. How: This names the tag.
	'og:image:type',       // What: Open Graph Image Type Key. Why: Every card needs the image's file type. How: This names the tag.
	'og:image:width',      // What: Open Graph Image Width Key. Why: Every card needs the image's width, for laying out the card early. How: This names the tag.
	'og:locale',           // What: Open Graph Locale Key. Why: Every card needs the page's language. How: This names the tag.
	'og:site_name',        // What: Open Graph Site Name Key. Why: Every card needs the name of the site the link belongs to. How: This names the tag.
	'og:title',            // What: Open Graph Title Key. Why: Every card needs the card's title. How: This names the tag.
	'og:type',             // What: Open Graph Type Key. Why: Every card needs what kind of page it is. How: This names the tag.
	'og:url',              // What: Open Graph URL Key. Why: Every card needs the address shares should count toward. How: This names the tag.
	'twitter:card',        // What: Twitter Card Key. Why: Every card needs the layout X and similar apps use. How: This names the tag.
	'twitter:description', // What: Twitter Description Key. Why: Every card needs the summary on X. How: This names the tag.
	'twitter:image',       // What: Twitter Image Key. Why: Every card needs the image on X. How: This names the tag.
	'twitter:image:alt',   // What: Twitter Image Alt Key. Why: Every card needs the image's description on X. How: This names the tag.
	'twitter:title'        // What: Twitter Title Key. Why: Every card needs the card's title on X. How: This names the tag.


];

// #endregion Constants



// #region Module Init

// #region Home Page Checks

test( 'the home page names the town, the pieces, and the business', async ( { page : curPagObj } ) => { // What: Home Head Test. Why: Search listings show the title and description, and visitors who met Tony at a fair search for him by name and town. How: This loads the home page and checks its title, description, author, canonical, and robots tags.


	await curPagObj.goto( '/' ); // What: Home Open Call. Why: The checks read the home page's head. How: This loads the root path.


	const desConStr = await curPagObj.locator( 'meta[name="description"]' ).getAttribute( 'content' ) ?? ''; // What: Description Content String. Why: The description's wording and length are both checked. How: This reads the tag's content, or an empty string if it's missing.


	await expect( curPagObj ).toHaveTitle( /^Tony's Toppers .*Bolivar, MO$/ ); // What: Title Assertion. Why: The title should lead with the business and name its town. How: This checks it starts with the name and ends with the town.

	expect( ( await curPagObj.title() ).length ).toBeLessThanOrEqual( 60 ); // What: Title Length Assertion. Why: Search listings and link cards cut long titles off. How: This keeps it to 60 characters or fewer.

	expect( desConStr ).toContain( 'Tony Mawhiney of Bolivar, Missouri' ); // What: Description Maker Assertion. Why: The summary should say who makes the pieces and where. How: This checks the description names Tony and his town.

	expect( desConStr.length ).toBeGreaterThanOrEqual( 100 ); // What: Description Minimum Assertion. Why: A summary that's too short wastes the space a listing gives it. How: This checks it runs at least 100 characters.

	expect( desConStr.length ).toBeLessThanOrEqual( 125 ); // What: Description Maximum Assertion. Why: Phones cut a summary off around 125 characters. How: This checks it stays within that.

	await expect( curPagObj.locator( 'meta[name="author"]' ) ).toHaveAttribute( 'content', "Tony's Toppers" ); // What: Author Assertion. Why: A real business's site names the business as its author. How: This checks the author tag.

	await expect( curPagObj.locator( 'link[rel="canonical"]' ) ).toHaveAttribute( 'href', LIV_URL_STR ); // What: Canonical Assertion. Why: Every address Netlify serves the site at should count as the live one. How: This checks the canonical link names the live address.

	await expect( curPagObj.locator( 'meta[name="robots"]' ) ).toHaveCount( 0 ); // What: Indexable Assertion. Why: The home page has to stay findable. How: This checks it carries no robots tag that could keep it out.

	await expect( curPagObj.getByRole( 'heading', { level : 1 } ) ).toHaveCount( 1 ); // What: Single Heading Assertion. Why: One h1 tells search engines and screen readers what the page is about. How: This checks there's exactly one.


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

	expect( [ orgNodObj.founder?.[ '@id' ], perNodObj.worksFor?.[ '@id' ], webNodObj.publisher?.[ '@id' ] ] ).toEqual( [ perNodObj[ '@id' ], orgNodObj[ '@id' ], orgNodObj[ '@id' ] ] ); // What: Node Links Assertion. Why: Search engines join the nodes by their ids, so Tony has to be the business's founder and the business the site's publisher. How: This checks each link points at the right node.

	expect( perNodObj.name ).toBe( 'Tony Mawhiney' ); // What: Maker Name Assertion. Why: The person has to be Tony. How: This checks his name.

	expect( pagTexStr ).toContain( 'Tony Mawhiney' ); // What: Maker Shown Assertion. Why: The name in the data has to be visible on the page. How: This checks the page shows it.

	expect( [ perNodObj.birthDate, perNodObj.gender ] ).toEqual( [ undefined, undefined ] ); // What: Private Details Assertion. Why: The site never publishes Tony's birth date or other personal details. How: This checks the person node leaves them out.

	expect( telHreArr.length ).toBeGreaterThan( 0 ); // What: Call Link Presence Assertion. Why: A phone in the data is only honest if the page offers it. How: This checks the page has call links.


	for ( const telHreStr of telHreArr ) expect( telHreStr?.replace( /\D/g, '' ) ).toBe( ( orgNodObj.telephone ?? '' ).replace( /\D/g, '' ).replace( /^1/, '' ) ); // What: Phone Match Assertion. Why: Every call link and the data must dial the same number. How: This compares their digits, dropping the data's leading country code.



	expect( pagTexStr ).toContain( '(417) 733-0681' ); // What: Phone Shown Assertion. Why: The number in the data has to be visible on the page. How: This checks the page shows it.


	for ( const nodCurObj of [ orgNodObj, perNodObj ] ) expect( nodCurObj.address ).toEqual( { '@type' : 'PostalAddress', addressCountry : 'US', addressLocality : 'Bolivar', addressRegion : 'MO' } ); // What: Town Only Assertion. Why: Tony's home is private, so the data gives his town and nothing finer. How: This checks each address is exactly Bolivar, Missouri, with no street or postal code.



	expect( pagTexStr ).toContain( 'Bolivar, Missouri' ); // What: Town Shown Assertion. Why: The town in the data has to be visible on the page. How: This checks the page shows it.

	expect( orgNodObj.sameAs ).toEqual( [ FAC_URL_STR ] ); // What: Facebook Profile Assertion. Why: The data should point to the business's one other home on the web. How: This checks sameAs lists the Facebook page alone.

	await expect( curPagObj.locator( `a[href="${ FAC_URL_STR }"]` ).first() ).toBeAttached(); // What: Facebook Shown Assertion. Why: The profile in the data has to be one the page links to. How: This checks the page has a link to it.


} );

// #endregion Home Page Checks



// #region Not Found Page Checks

test( 'the 404 page stays out of search results', async ( { page : curPagObj } ) => { // What: Not Found Head Test. Why: The host answers every unknown address with a 200, so the 404 page must ask not to be indexed. How: This loads an unknown address and checks its robots tag, title, and heading.


	await curPagObj.goto( '/no-such-page' ); // What: Unknown Address Open Call. Why: Every unknown path shows the 404 page. How: This loads one.


	await expect( curPagObj.locator( 'meta[name="robots"]' ) ).toHaveAttribute( 'content', 'noindex' ); // What: Noindex Assertion. Why: Search engines must leave the page out. How: This checks the robots tag.

	await expect( curPagObj ).toHaveTitle( "Page Not Found | Tony's Toppers" ); // What: Not Found Title Assertion. Why: The page needs a title of its own. How: This checks it.

	await expect( curPagObj.getByRole( 'heading', { level : 1 } ) ).toHaveCount( 1 ); // What: Single Heading Assertion. Why: Every page should have exactly one h1. How: This checks the 404 page has one.


} );

// #endregion Not Found Page Checks



// #region Social Preview Checks

test( 'the social preview tags are complete', async ( { page : curPagObj } ) => { // What: Social Tags Test. Why: A link shared anywhere should show a full card that matches the page. How: This loads the home page and checks every social tag, its absolute URLs, and its copy against the page's own title and description.


	await curPagObj.goto( '/' ); // What: Home Load Call. Why: Link scrapers read the page every route shares. How: This opens the home page.


	const socTagArr = await curPagObj.locator( 'meta[property^="og:"], meta[name^="twitter:"]' ).evaluateAll( ( tagEleArr ) => tagEleArr.map( ( tagCurEle ) => [ tagCurEle.getAttribute( 'property' ) || tagCurEle.getAttribute( 'name' ) || '', tagCurEle.getAttribute( 'content' ) || '' ] ) ); // What: Social Tag Array. Why: Every social tag is checked by its key and value. How: This reads each Open Graph and Twitter tag as a key and content pair.
	const socTagObj = Object.fromEntries( socTagArr ); // What: Social Tag Object. Why: Tags are easier to check by key. How: This turns the pairs into an object.


	expect( Object.keys( socTagObj ) ).toEqual( expect.arrayContaining( SOC_KEY_ARR ) ); // What: Complete Tags Assertion. Why: A missing tag leaves part of the card blank. How: This checks every required key is present, allowing optional extras.

	expect( [ socTagObj[ 'og:image' ], socTagObj[ 'og:url' ], socTagObj[ 'twitter:image' ] ] ).toEqual( [ `${ LIV_URL_STR }og-image.jpg`, LIV_URL_STR, `${ LIV_URL_STR }og-image.jpg` ] ); // What: Absolute URLs Assertion. Why: Scrapers can't resolve a relative address. How: This checks each URL tag names the live https address.

	expect( [ socTagObj[ 'og:image:type' ], socTagObj[ 'og:image:width' ], socTagObj[ 'og:image:height' ] ] ).toEqual( [ 'image/jpeg', '1200', '630' ] ); // What: Image Facts Assertion. Why: The tags have to describe the file they point at. How: This checks the type and size they give.

	expect( [ socTagObj[ 'og:title' ], socTagObj[ 'twitter:title' ] ] ).toEqual( [ await curPagObj.title(), await curPagObj.title() ] ); // What: Title Match Assertion. Why: A card should name the page the way its tab does. How: This checks both card titles match the page title.

	expect( [ socTagObj[ 'og:description' ], socTagObj[ 'twitter:description' ] ] ).toEqual( Array( 2 ).fill( await curPagObj.locator( 'meta[name="description"]' ).getAttribute( 'content' ) ) ); // What: Description Match Assertion. Why: A card should sum the page up the way its search listing does. How: This checks both card descriptions match the page's description.


} );



test( 'the social preview image is a 1,200x630 JPEG under 300 KB', async ( { request : reqConObj } ) => { // What: Preview Image Test. Why: The social tags promise a 1,200x630 card small enough for WhatsApp. How: This fetches the image, checks its byte count, and reads its size from the JPEG's frame header.


	const imaResObj = await reqConObj.get( '/og-image.jpg' ); // What: Image Response Object. Why: The image has to exist where the tags point. How: This fetches it from the site.
	const jpgBufObj = await imaResObj.body();                 // What: JPEG Buffer Object. Why: The image's size is written in its frame header. How: This reads the response bytes.


	let segOffNum = 2; // What: Segment Offset Number. Why: A JPEG's size sits in its frame segment, after a varying run of other segments. How: This starts just past the file's opening marker.


	while ( segOffNum < jpgBufObj.length && ( jpgBufObj[ segOffNum + 1 ] < 0xC0 || jpgBufObj[ segOffNum + 1 ] > 0xC2 ) ) segOffNum += 2 + jpgBufObj.readUInt16BE( segOffNum + 2 ); // What: Frame Segment Search. Why: The frame segment's marker is 0xC0, 0xC1, or 0xC2, and every segment before it gives its own length. How: This hops from segment to segment until it lands on the frame.



	expect( imaResObj.headers()[ 'content-type' ] ).toBe( 'image/jpeg' ); // What: JPEG Type Assertion. Why: The tags promise a JPEG. How: This checks the served type.

	expect( jpgBufObj.length ).toBeLessThan( 300 * 1024 ); // What: JPEG Bytes Assertion. Why: WhatsApp drops a preview image of 300 KB or more. How: This checks the file's byte count.

	expect( [ jpgBufObj.readUInt16BE( segOffNum + 7 ), jpgBufObj.readUInt16BE( segOffNum + 5 ) ] ).toEqual( [ 1200, 630 ] ); // What: JPEG Size Assertion. Why: The tags promise 1,200 by 630 pixels. How: This reads the width and height the frame segment stores after its marker, length, and precision.


} );



test( 'every icon the head links to is served at its size', async ( { page : curPagObj, request : reqConObj } ) => { // What: Icons Test. Why: Browsers and apps fetch the icons the head names, and a missing or wrong-sized one shows a blank or blurry mark. How: This reads every icon link and checks each file exists and, for PNGs, has the size its link promises.


	await curPagObj.goto( '/' ); // What: Home Load Call. Why: The icon links live in the page's head. How: This opens the home page.


	const icoLinArr = await curPagObj.locator( 'link[rel="icon"], link[rel="apple-touch-icon"]' ).evaluateAll( ( linEleArr ) => linEleArr.map( ( linCurEle ) => [ linCurEle.getAttribute( 'href' ) || '', linCurEle.getAttribute( 'sizes' ) || '' ] ) ); // What: Icon Link Array. Why: Each icon is checked against its own link. How: This reads every icon link's address and size.


	expect( icoLinArr.length ).toBe( 7 ); // What: Icon Count Assertion. Why: The set is the SVG, the ICO, four PNG sizes, and the Apple touch icon. How: This checks all seven are linked.


	for ( const [ icoHreStr, icoSizStr ] of icoLinArr ) { // What: Icon Check Loop. Why: Every linked icon has to be real. How: This fetches each one in turn.


		const icoResObj = await reqConObj.get( icoHreStr ); // What: Icon Response Object. Why: The icon has to exist where its link points. How: This fetches it.
		const icoBufObj = await icoResObj.body();           // What: Icon Buffer Object. Why: A PNG's size is written in its header. How: This reads the bytes.


		expect( icoResObj.ok() ).toBe( true ); // What: Icon Served Assertion. Why: A missing icon falls through to the app's HTML. How: This checks the file is served.



		if ( icoHreStr.endsWith( '.svg' ) ) { // What: SVG Icon Guard. Why: The SVG mark has no fixed size to check. How: This checks it's served as an SVG and moves on.


			expect( icoResObj.headers()[ 'content-type' ] ).toContain( 'image/svg+xml' ); // What: SVG Type Assertion. Why: Browsers only draw an SVG favicon served as one. How: This checks the served type.



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

test( 'robots.txt lets crawlers in and names the sitemap', async ( { request : reqConObj } ) => { // What: Robots File Test. Why: A real maker wants every page crawled and his sitemap found. How: This fetches robots.txt and checks its rules.


	const robResObj = await reqConObj.get( '/robots.txt' ); // What: Robots Response Object. Why: The file is read the way a crawler reads it. How: This fetches it from the site.
	const robTexStr = await robResObj.text();               // What: Robots Text String. Why: The rules are checked as written. How: This reads the response body.


	expect( robResObj.ok() ).toBe( true ); // What: Robots Served Assertion. Why: A missing robots.txt would fall through to the app. How: This checks the file is served.

	expect( robTexStr ).toMatch( /User-agent: \*\nAllow: \// ); // What: Allow All Assertion. Why: Every crawler should be let in. How: This checks the wildcard group allows the whole site.

	expect( robTexStr ).not.toMatch( /Disallow: \// ); // What: No Block Assertion. Why: Nothing should be blocked from crawling. How: This checks no group disallows the site.

	expect( robTexStr ).toContain( `Sitemap: ${ LIV_URL_STR }sitemap.xml` ); // What: Sitemap Line Assertion. Why: Crawlers find the sitemap from here. How: This checks it names the sitemap's absolute address.


} );



test( 'the sitemap lists the home page alone', async ( { request : reqConObj } ) => { // What: Sitemap Test. Why: The sitemap should list every indexable page and nothing else. How: This fetches it and checks its one entry.


	const sitResObj = await reqConObj.get( '/sitemap.xml' ); // What: Sitemap Response Object. Why: The file is read the way a crawler reads it. How: This fetches it from the site.
	const sitTexStr = await sitResObj.text();                // What: Sitemap Text String. Why: Its entries are checked as written. How: This reads the response body.


	expect( sitResObj.ok() ).toBe( true ); // What: Sitemap Served Assertion. Why: A missing sitemap would fall through to the app. How: This checks the file is served.

	expect( sitTexStr.match( /<loc>([^<]*)<\/loc>/g ) ).toEqual( [ `<loc>${ LIV_URL_STR }</loc>` ] ); // What: Home Entry Assertion. Why: The home page is the only indexable page. How: This checks the sitemap's entries are exactly its canonical address.


} );

// #endregion Crawler File Checks

// #endregion Module Init


