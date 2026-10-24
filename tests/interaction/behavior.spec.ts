


// #region Imports

import { expect } from '@playwright/test'; // What: Expect. Why: Each behavior passes only when the page ends up where it should. How: This asserts on what each check reads from the page, such as a section's position.
import { test   } from '@playwright/test'; // What: Test. Why: Each behavior is its own test. How: This declares them.


import type { Locator } from '@playwright/test'; // What: Locator. Why: The new tab checks pass click options a locator's click takes. How: This types those options.
import type { Page    } from '@playwright/test'; // What: Page. Why: Every helper drives a Playwright page. How: This types their page parameters.

// #endregion Imports



/**
 * behavior.spec.ts = Behavior Spec
 *
 * @summary
 * Checks where the site's links take the visitor, in whichever engine the
 * project runs. Section links, such as the bar's, have to land on their
 * section and leave the address free of hashes, while a new tab click opens
 * the section in the new tab and leaves the page clicked from alone. A link
 * to another page has to open it at its top, and back has to return near
 * where the visitor was. Every page opens with a skip link that moves focus
 * to the main content. The phone menu's links close the menu only when they
 * take the visitor somewhere. Pages open under reduced motion, so scrolling
 * jumps straight to its target and each position can be read at once; how
 * things move is checked by the feedback spec.
 *
 * Sections:
 *  - Constants
 *  - Helpers
 *  - Module Init
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

const CLI_KIN_ARR : Array< [ string, Parameters< Locator[ 'click' ] >[ 0 ] ] > = [ [ 'Ctrl or Cmd', { modifiers : [ 'ControlOrMeta' ] } ], [ 'middle', { button : 'middle' } ] ]; // What: Click Kind Array. Why: A new tab can be asked for with a modified click or a middle click. How: Each row pairs a name for the test title with the click options that make it.

const DES_VIE_OBJ = { height : 900, width : 1440 }; // What: Desktop Viewport Object. Why: The bar's own links show only on wide screens. How: This is the desktop size most checks open at.
const PHO_VIE_OBJ = { height : 844, width : 390  }; // What: Phone Viewport Object. Why: The phone menu exists only on small screens. How: This is the phone size the menu checks use.
const SHO_VIE_OBJ = { height : 500, width : 390  }; // What: Short Viewport Object. Why: The 404 page fits a full phone screen, so it only scrolls on a shorter one. How: This is the size the scroll position check opens it at.

const SEC_LIN_ARR = [ [ 'Home', 'home' ], [ 'Products', 'products' ], [ 'Craft Fairs', 'fairs' ], [ 'About Tony', 'about' ], [ 'Contact', 'contact' ] ]; // What: Section Link Array. Why: The bar and the phone menu link to the same five sections. How: Each row pairs a link's label with its section's id.

// #endregion Constants



// #region Helpers

// #region opeRouFun

/**
 * opeRouFun = Open Route Function
 *
 * @summary
 * Opens one route at one viewport size, ready to be used: it turns on
 * reduced motion so in-page scrolling jumps rather than glides, sizes the
 * viewport, loads the path, and waits for the web fonts, so positions read
 * afterwards are final.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to open the route on.
 * @param rouPatStr - Route Path String: The route to load.
 * @param vieSizObj - Viewport Size Object: {@link DES_VIE_OBJ},
 *                    {@link PHO_VIE_OBJ}, or {@link SHO_VIE_OBJ}.
 *
 * @returns A promise that settles once the route has loaded at its viewport
 *          size, with no value.
 *
 * @example
 * ```ts
 * opeRouFun(page, '/', DES_VIE_OBJ) // => Promise<void>
 * ```
 *
*/

async function opeRouFun ( curPagObj : Page, rouPatStr : string, vieSizObj : { height : number, width : number } ) : Promise< void > {


	await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Emulation. Why: Scrolling should land at once, so its target can be read right away. How: This makes the page match prefers-reduced-motion, which turns smooth scrolling off.

	await curPagObj.setViewportSize( vieSizObj ); // What: Viewport Size Call. Why: The bar's links and the menu depend on the width. How: This sizes the page before it loads.

	await curPagObj.goto( rouPatStr ); // What: Route Load Call. Why: Each check starts from a fresh load. How: This opens the path on the suite's dev server.

	await curPagObj.evaluate( () => document.fonts.ready ); // What: Fonts Ready Wait. Why: Positions measured before the fonts load would shift. How: This waits until every font face has loaded.


}

// #endregion opeRouFun



// #region secOffFun

/**
 * secOffFun = Section Offset Function
 *
 * @summary
 * Reads how far the page's scroll position sits from the one a section link
 * should leave it at: the section's top less the page's scroll padding, which
 * keeps a section clear of the fixed bar, or the top of the page for a
 * section too near it to scroll that far, such as the hero. Zero means the
 * page sits exactly where a link should have put it. An element that isn't on
 * the page yet reads as infinitely far away, so a polling check keeps waiting
 * for it rather than failing outright.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to measure.
 * @param secIdeStr - Section Identifier String: The id of the element to
 *                    measure.
 *
 * @returns A promise that resolves with the distance, in pixels, between the
 *          page's scroll position and the section's.
 *
 * @example
 * ```ts
 * secOffFun(page, 'about') // => 0
 * ```
 *
*/

async function secOffFun ( curPagObj : Page, secIdeStr : string ) : Promise< number > {


	return curPagObj.evaluate( ( tarIdeStr ) => { // What: Section Offset Return. Why: A check compares where the page sits with where the link should have left it. How: This measures both inside the page.


		const padTopNum = parseFloat( getComputedStyle( document.documentElement ).scrollPaddingTop ) || 0; // What: Padding Top Number. Why: A section link lands its section below the bar, not at the very top. How: This reads the page's scroll padding, or 0 when it has none.
		const secTopNum = document.getElementById( tarIdeStr )?.getBoundingClientRect().top;                // What: Section Top Number. Why: The section's position is what's checked. How: This reads its top edge on screen, or undefined while it isn't on the page.



		return secTopNum === undefined ? Infinity : window.scrollY - Math.max( 0, window.scrollY + secTopNum - padTopNum ); // What: Offset Return. Why: A missing section should keep a polling check waiting, and a section too near the top can only bring the page to its top. How: This gives Infinity for a missing section, and otherwise the page's scroll position less the one the section asks for, limited at the top of the page.


	}, secIdeStr );


}

// #endregion secOffFun



// #region ariSecFun

/**
 * ariSecFun = Arrival Section Function
 *
 * @summary
 * Waits until the visitor has landed on a home page section: the address is
 * the bare root, with no hash left in it, and the page sits less than 2
 * pixels from where the section's link should have left it. Both are polled,
 * since a link from another page renders the home page and scrolls a moment
 * after the click.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to check.
 * @param secIdeStr - Section Identifier String: The id of the section the
 *                    visitor should land on.
 *
 * @returns A promise that settles once the visitor has landed on the section
 *          with a clean address, with no value.
 *
 * @example
 * ```ts
 * ariSecFun(page, 'contact') // => Promise<void>
 * ```
 *
*/

async function ariSecFun ( curPagObj : Page, secIdeStr : string ) : Promise< void > {


	await expect( curPagObj ).toHaveURL( /^[^#]*\/$/ );                                                     // What: Clean Address Assertion. Why: Section links keep the address free of hashes, even when they come from another page. How: This waits until the URL is the bare root.
	await expect.poll( async () => Math.abs( await secOffFun( curPagObj, secIdeStr ) ) ).toBeLessThan( 2 ); // What: Section Position Assertion. Why: The visitor should land on the section they chose. How: This waits until the page sits less than 2 pixels from where the section's link should have left it.


}

// #endregion ariSecFun

// #endregion Helpers



// #region Module Init

// #region Home Page Navigation Checks

for ( const [ linLabStr, secIdeStr ] of SEC_LIN_ARR ) { // What: Section Link Loop. Why: Each of the bar's section links has its own target. How: This declares one test per link, pairing its label with its section's id.


	test( `the bar's ${ linLabStr } link scrolls to its section`, async ( { page : curPagObj } ) => { // What: Section Link Test. Why: A section link has to take the visitor to its section. How: This clicks the link from partway down the page and checks the address and the section's position.


		await opeRouFun( curPagObj, '/', DES_VIE_OBJ ); // What: Home Open Call. Why: The bar's own links show on wide screens. How: This opens the home page at desktop size.

		await curPagObj.evaluate( () => window.scrollTo( { behavior : 'instant', top : 1200 } ) ); // What: Scroll Down Call. Why: The Home link has to be seen bringing a scrolled visitor back, and every other link reaching its section from mid-page. How: This jumps a way down the page first.

		await curPagObj.getByRole( 'navigation' ).getByRole( 'link', { exact : true, name : linLabStr } ).click(); // What: Section Link Click Call. Why: This is the action under test. How: This clicks the bar's link by its label.

		await ariSecFun( curPagObj, secIdeStr ); // What: Section Arrival Check. Why: The visitor should land on the section with a clean address. How: This waits for both.


	} );


}



for ( const [ cliKinStr, cliOptObj ] of CLI_KIN_ARR ) { // What: Modified Click Loop. Why: Each way of asking for a new tab gets its own check. How: This declares one test per row of CLI_KIN_ARR.


	test( `a ${ cliKinStr } click opens a section in a new tab`, async ( { page : curPagObj } ) => { // What: New Tab Test. Why: A visitor opening a section in a new tab should land on it there, and the page they clicked from should stay put. How: This makes the click, then checks the new tab's section and address and the old page's scroll and address.


		await opeRouFun( curPagObj, '/', DES_VIE_OBJ ); // What: Home Open Call. Why: The bar's own links show on wide screens. How: This opens the home page at desktop size.


		const newTabPro = curPagObj.context().waitForEvent( 'page' ); // What: New Tab Promise. Why: The click opens its page in a new tab. How: This waits for the browser context to report a new page, set up before the click so it can't be missed.


		await curPagObj.getByRole( 'navigation' ).getByRole( 'link', { exact : true, name : 'About Tony' } ).click( cliOptObj ); // What: Modified Click Call. Why: This is the action under test. How: This clicks the bar's About Tony link the way the loop's row says.


		const newTabObj = await newTabPro; // What: New Tab Object. Why: The section should open in the new tab. How: This is the page the click opened.


		await expect( newTabObj.locator( '#about' ) ).toBeVisible();                                          // What: Section Render Wait. Why: The new tab loads the page from scratch, so the section has to exist before it's measured. How: This waits until the About section is on the page.
		await expect.poll( async () => Math.abs( await secOffFun( newTabObj, 'about' ) ) ).toBeLessThan( 2 ); // What: New Tab Position Assertion. Why: The new tab should land on the section. How: This waits until the page sits less than 2 pixels from where the About section's link should have left it.
		await expect( newTabObj ).toHaveURL( /\/$/ );                                                         // What: New Tab Address Assertion. Why: The new tab's hash should be cleared once used. How: This checks its URL ends at the root.
		expect( await curPagObj.evaluate( () => window.scrollY ) ).toBe( 0 );                                 // What: Original Scroll Assertion. Why: The page clicked from should stay where it was. How: This checks it's still at the top.
		await expect( curPagObj ).toHaveURL( /\/$/ );                                                         // What: Original Address Assertion. Why: The page clicked from shouldn't navigate. How: This checks its URL still ends at the root.


	} );


}



for ( const [ butLabStr, secIdeStr ] of [ [ 'See the collection', 'products' ], [ 'Meet Tony', 'about' ] ] ) { // What: Hero Button Loop. Why: Each of the hero's buttons is a section link of its own. How: This declares one test per button, pairing its label with its section's id.


	test( `the hero's ${ butLabStr } button scrolls to its section`, async ( { page : curPagObj } ) => { // What: Hero Button Test. Why: The hero's buttons are the page's first way onward. How: This clicks the button and checks where the visitor lands.


		await opeRouFun( curPagObj, '/', DES_VIE_OBJ ); // What: Home Open Call. Why: The hero opens the home page. How: This opens it at desktop size.

		await curPagObj.getByRole( 'main' ).getByRole( 'link', { exact : true, name : butLabStr } ).click(); // What: Hero Button Click Call. Why: This is the action under test. How: This clicks the button by its label inside the main content.

		await ariSecFun( curPagObj, secIdeStr ); // What: Section Arrival Check. Why: The visitor should land on the section with a clean address. How: This waits for both.


	} );


}



test( 'an address naming a section opens there', async ( { page : curPagObj } ) => { // What: Section Address Test. Why: A shared or bookmarked address with a hash should land on its section, then drop the hash. How: This opens /#about and checks where the visitor lands and the address.


	await opeRouFun( curPagObj, '/#about', DES_VIE_OBJ ); // What: Section Address Open Call. Why: This is the arrival under test. How: This opens the home page with the About section's id as the hash.

	await ariSecFun( curPagObj, 'about' ); // What: Section Arrival Check. Why: The visitor should land on the section with a clean address. How: This waits for both.


} );

// #endregion Home Page Navigation Checks



// #region Scroll Position Checks

test( 'the brand returns to the top', async ( { page : curPagObj } ) => { // What: Brand Link Test. Why: The brand doubles as the way back to the top. How: This scrolls down, clicks the brand, and checks the page is back at the top with a clean address.


	await opeRouFun( curPagObj, '/', DES_VIE_OBJ ); // What: Home Open Call. Why: The brand is checked on the home page. How: This opens it at desktop size.

	await curPagObj.evaluate( () => window.scrollTo( { behavior : 'instant', top : 2000 } ) ); // What: Scroll Down Call. Why: Returning to the top only shows once the page has left it. How: This jumps well down the page.

	await curPagObj.getByRole( 'navigation' ).locator( 'a[href="/"]' ).click(); // What: Brand Click Call. Why: This is the action under test. How: This clicks the bar's brand, the one link to the bare root.

	await expect.poll( () => curPagObj.evaluate( () => window.scrollY ) ).toBe( 0 ); // What: Top Arrival Assertion. Why: The visitor should be back at the top. How: This waits until the page sits at the top.

	await expect( curPagObj ).toHaveURL( /^[^#]*\/$/ ); // What: Clean Address Assertion. Why: The brand leaves no hash behind. How: This checks the URL is the bare root.


} );



test( 'a link to another page opens it at its top, and back returns near where the visitor was', async ( { page : curPagObj } ) => { // What: Page Top Test. Why: A client-side router never resets the scroll position, so the app root has to, while back should give the earlier position back. How: This scrolls the 404 page down on a phone, follows Back home, checks the home page opens at its top, then goes back and checks the 404 page returns near where it was.


	await opeRouFun( curPagObj, '/missing', SHO_VIE_OBJ ); // What: Not Found Open Call. Why: The 404 page has a link home and scrolls on a short phone screen. How: This opens an unknown address at the short phone size.

	await curPagObj.evaluate( () => window.scrollTo( { behavior : 'instant', top : document.documentElement.scrollHeight } ) ); // What: Scroll Bottom Call. Why: The new page should open at its top however far down the link was. How: This jumps to the bottom of the page.


	const oldTopNum = await curPagObj.evaluate( () => window.scrollY ); // What: Old Top Number. Why: Back should return near this position. How: This reads how far down the page sits.


	expect( oldTopNum ).toBeGreaterThan( 0 ); // What: Scrolled Assertion. Why: The check means nothing unless the page really left its top. How: This checks it's scrolled down.

	await curPagObj.getByRole( 'main' ).getByRole( 'link', { name : 'Back home' } ).click(); // What: Back Home Click Call. Why: This is the navigation under test. How: This clicks the 404 page's link home.

	await expect( curPagObj ).toHaveURL( /^[^#]*\/$/ ); // What: Home Address Assertion. Why: The link leads to the home page. How: This waits until the URL is the bare root.

	await expect.poll( () => curPagObj.evaluate( () => window.scrollY ) ).toBe( 0 ); // What: Home Top Assertion. Why: The new page should open at its top. How: This waits until the home page sits at the top, since the address changes a moment before the new page is drawn.

	await curPagObj.goBack(); // What: Back Navigation Call. Why: Back should return the visitor to where they were. How: This goes back to the 404 page.

	await expect( curPagObj ).toHaveURL( /\/missing$/ ); // What: Back Address Assertion. Why: Back leads to the page before. How: This waits until the URL is the 404 page's.

	await expect.poll( async () => Math.abs( await curPagObj.evaluate( () => window.scrollY ) - oldTopNum ) ).toBeLessThan( 2 ); // What: Restored Position Assertion. Why: The browser restores the earlier position on back. How: This waits until the page sits within 2 pixels of it.


} );

// #endregion Scroll Position Checks



// #region Skip Link Checks

for ( const [ pagNamStr, rouPatStr ] of [ [ 'home page', '/' ], [ '404 page', '/missing' ] ] ) { // What: Skip Link Loop. Why: Every page opens with the skip link. How: This declares one check per page.


	test( `the first Tab on the ${ pagNamStr } reaches the skip link, which moves focus to the main content`, async ( { browserName : broNamStr, page : curPagObj } ) => { // What: Skip Link Test. Why: A keyboard user has to be able to jump past the bar. How: This presses Tab once, checks the skip link holds focus on screen, then clicks it and checks focus moved to the main element with a clean address.


		const skiLinLoc = curPagObj.getByRole( 'link', { name : 'Skip to main content' } ); // What: Skip Link Locator. Why: Each step below reaches the same link. How: This finds it by its role and name.



		await opeRouFun( curPagObj, rouPatStr, DES_VIE_OBJ ); // What: Page Open Call. Why: The skip link is checked on each page. How: This opens the page at desktop size.

		await curPagObj.keyboard.press( broNamStr === 'webkit' ? 'Alt+Tab' : 'Tab' ); // What: First Tab Call. Why: The skip link should be the page's first stop. How: This presses Tab, or Alt+Tab in WebKit, whose plain Tab can skip links the way Safari does by default.

		await expect( skiLinLoc ).toBeFocused();    // What: Skip Focus Assertion. Why: The skip link has to be the page's first stop. How: This checks it holds focus after the first Tab.
		await expect( skiLinLoc ).toBeInViewport(); // What: Skip Shown Assertion. Why: A focused link waiting above the screen would leave a keyboard user lost. How: This checks it has slid into view.

		await skiLinLoc.click(); // What: Skip Click Call. Why: This is the action under test. How: This clicks the focused skip link.

		await expect( curPagObj.locator( 'main' ) ).toBeFocused();              // What: Main Focus Assertion. Why: The jump has to land past the bar, so the next Tab continues into the content. How: This checks the main element holds focus.
		await expect( curPagObj ).toHaveURL( new RegExp( `${ rouPatStr }$` ) ); // What: Clean Address Assertion. Why: The jump shouldn't leave a hash in the address. How: This checks the address still ends with the page's own path.


	} );


}

// #endregion Skip Link Checks



// #region Phone Menu Checks

for ( const [ linLabStr, secIdeStr ] of SEC_LIN_ARR ) { // What: Menu Link Loop. Why: Each of the menu's links has its own target. How: This declares one test per link, pairing its label with its section's id.


	test( `the menu's ${ linLabStr } link closes the menu and scrolls to its section`, async ( { page : curPagObj } ) => { // What: Menu Link Test. Why: Choosing a section should both take the visitor there and get the menu out of the way. How: This opens the menu, clicks the link, and checks the menu closed and the visitor landed on the section.


		const togButLoc = curPagObj.getByRole( 'button', { name : 'Toggle menu' } ); // What: Toggle Button Locator. Why: The menu opens from its button, which reports whether it's open. How: This finds the button by its name.



		await opeRouFun( curPagObj, '/', PHO_VIE_OBJ ); // What: Home Open Call. Why: The menu exists on phone screens. How: This opens the home page at phone size.

		await togButLoc.click(); // What: Toggle Click Call. Why: The links sit in the menu on a phone. How: This opens it.

		await expect( togButLoc ).toHaveAttribute( 'aria-expanded', 'true' ); // What: Menu Open Wait. Why: The link is clicked from the open menu. How: This waits until the button reports it expanded.

		await curPagObj.getByRole( 'navigation' ).getByRole( 'link', { exact : true, name : linLabStr } ).click(); // What: Menu Link Click Call. Why: This is the action under test. How: This clicks the menu's link by its label.

		await expect( togButLoc ).toHaveAttribute( 'aria-expanded', 'false' ); // What: Menu Closed Assertion. Why: A handled click should close the menu. How: This waits until the button reports it collapsed.

		await ariSecFun( curPagObj, secIdeStr ); // What: Section Arrival Check. Why: The visitor should land on the section with a clean address. How: This waits for both.


	} );


}



test( 'a new tab click on a menu link leaves the menu open', async ( { page : curPagObj } ) => { // What: Menu New Tab Test. Why: A link opened in a new tab hasn't taken the visitor anywhere, so the menu should stay as it was. How: This opens the menu, Ctrl or Cmd clicks a link, and checks a new tab opened while the menu stayed open.


	const togButLoc = curPagObj.getByRole( 'button', { name : 'Toggle menu' } ); // What: Toggle Button Locator. Why: The button reports whether the menu is open. How: This finds it by its name.



	await opeRouFun( curPagObj, '/', PHO_VIE_OBJ ); // What: Home Open Call. Why: The menu exists on phone screens. How: This opens the home page at phone size.

	await togButLoc.click(); // What: Toggle Click Call. Why: The links sit in the menu on a phone. How: This opens it.

	await expect( togButLoc ).toHaveAttribute( 'aria-expanded', 'true' ); // What: Menu Open Wait. Why: The link is clicked from the open menu. How: This waits until the button reports it expanded.


	const newTabPro = curPagObj.context().waitForEvent( 'page' ); // What: New Tab Promise. Why: The click opens its page in a new tab. How: This waits for the browser context to report a new page, set up before the click so it can't be missed.


	await curPagObj.getByRole( 'navigation' ).getByRole( 'link', { exact : true, name : 'Products' } ).click( { modifiers : [ 'ControlOrMeta' ] } ); // What: Modified Click Call. Why: This is the action under test. How: This Ctrl or Cmd clicks the menu's Products link.

	await newTabPro; // What: New Tab Wait. Why: The click should open a new tab. How: This waits for the browser to report it.

	await expect( togButLoc ).toHaveAttribute( 'aria-expanded', 'true' ); // What: Menu Still Open Assertion. Why: The menu should stay open when the click was left to the browser. How: This checks the button still reports it expanded.


} );

// #endregion Phone Menu Checks



// #region Not Found Checks

for ( const [ conLabStr, secIdeStr, conDesStr ] of [ [ 'See the collection', 'products', 'See the collection button' ], [ 'About Tony', 'about', 'About Tony link in the bar' ] ] ) { // What: Not Found Section Loop. Why: The 404 page reaches the home page's sections through its own button and the bar. How: This declares one test per control, pairing its label with its section's id and a description for the title.


	test( `the 404 page's ${ conDesStr } leads to its section`, async ( { page : curPagObj } ) => { // What: Not Found Section Test. Why: A section control on the 404 page has no section to scroll to, so it has to take the visitor home to it. How: This clicks the control and checks the visitor lands on the section with a clean address.


		await opeRouFun( curPagObj, '/missing', DES_VIE_OBJ ); // What: Not Found Open Call. Why: The controls are checked from the 404 page. How: This opens an unknown address at desktop size.

		await curPagObj.getByRole( conLabStr === 'About Tony' ? 'navigation' : 'main' ).getByRole( 'link', { exact : true, name : conLabStr } ).click(); // What: Control Click Call. Why: This is the action under test. How: This clicks the control by its label, in the bar or in the page's main content.

		await ariSecFun( curPagObj, secIdeStr ); // What: Section Arrival Check. Why: The visitor should land on the section with a clean address. How: This waits for both.


	} );


}

// #endregion Not Found Checks

// #endregion Module Init


