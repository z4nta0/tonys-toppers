


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
 * describe him accurately: its title and description name his town and what
 * he makes, its canonical and author tags are in place, it carries no
 * noindex, and its structured data, an Organization for the business, a
 * Person for Tony, and a WebSite, matches what the page itself shows, its
 * phone number, town, and Facebook page, with no street address or birth
 * date. The 404 page carries noindex, and each page has exactly one h1.
 * robots.txt lets every crawler in and names the sitemap, which lists the
 * home page alone.
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
const LIV_URL_STR = 'https://tonystoppers.com/';                              // What: Live URL String. Why: The canonical link, structured data, and sitemap must all name the live address. How: This is the address they're compared with.

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


