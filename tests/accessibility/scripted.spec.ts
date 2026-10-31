


// #region Imports

import { expect      } from '@playwright/test';      // What: Expect. Why: Each check passes only when the page shows nothing wrong. How: This asserts on what each check reads, most often that its problem list is empty.
import { fakNetFun   } from '../support/netlify.ts'; // What: Fake Netlify Function. Why: The form checks need Netlify's answer without sending anything. How: This answers the form's posts in the browser with a chosen status.
import { opeStaFun   } from '../support/states.ts';  // What: Open State Function. Why: The per-state checks open and settle their state first. How: This loads it and waits for it.
import { STA_REC_ARR } from '../support/states.ts';  // What: State Record Array. Why: Every page state is checked. How: This lists them.
import { test        } from '@playwright/test';      // What: Test. Why: Each check is its own test. How: This declares them.


import type { Page } from '@playwright/test'; // What: Page. Why: The helpers that drive the page from the test take a Playwright page, while those that run inside it take none. How: This types the driving helpers' page parameters.

// #endregion Imports



/**
 * scripted.spec.ts = Scripted Spec
 *
 * @summary
 * The accessibility checks axe-core can't make, run in whichever engine the
 * project runs, most of them on every page state. Names: every link and button
 * in the accessibility tree has a name, and no name carries a decorative glyph
 * such as an arrow. Keyboard: a Tab walk from the top of the page reaches its
 * end without getting trapped, never moves backwards through the document, and
 * lands only on stops that are on screen, not covered by anything else, and
 * visibly changed by focus. Reflow: at 320px wide, WCAG's narrowest reflow
 * width, nothing scrolls sideways. Motion: with reduced motion requested, no
 * animation is still running once the state has settled, and no element's
 * computed styles would still move. Form: the thank-you and error notes each
 * speak through a live region that's in the page, empty, from the first
 * render, and the send button keeps focus while a message goes out. A name,
 * keyboard, or motion style failure lists every problem it found, naming the
 * element in each except the positive tabindex count and a keyboard trap.
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

const GLY_DEC_REG = /[←↑→↓·•]|\p{Extended_Pictographic}/u; // What: Glyph Decorative Regular Expression. Why: A decorative glyph inside a name becomes part of the control's announced name, such as a right arrow. How: This matches the arrows and dots a decorative glyph would add to a name, plus any emoji or pictograph.
const REF_WID_NUM = 320;                                   // What: Reflow Width Number. Why: WCAG's reflow criterion asks for no sideways scrolling at 320 CSS pixels, the width of 1,280px at 400% zoom. How: This is the viewport width the reflow check opens each state at.
const TAB_MAX_NUM = 80;                                    // What: Tab Maximum Number. Why: A keyboard trap would otherwise keep the walk going forever. How: This caps the walk at far more Tab presses than the site has stops.

// #endregion Constants



// #region Helpers

// #region focTopFun

/**
 * focTopFun = Focus Top Function
 *
 * @summary
 * Moves the browser's starting point for Tab back to the top of the page, so a
 * keyboard walk meets every stop from the first. A click or a send can leave
 * focus partway down, such as on the menu toggle, and blurring alone isn't
 * enough, since browsers remember where focus last was. Focusing the body for
 * a moment moves that point to the top, and the body is made unfocusable again
 * straight after.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page whose focus to reset.
 *
 * @returns A promise that settles once focus is back at the top, with no
 *          value.
 *
 * @example
 * ```ts
 * focTopFun(page) // => Promise<void>
 * ```
 *
*/

async function focTopFun ( curPagObj : Page ) : Promise< void > {


	await curPagObj.evaluate( () => { document.body.tabIndex = -1; document.body.focus(); document.body.removeAttribute( 'tabindex' ); } ); // What: Focus Reset Call. Why: The walk tabs from wherever focus is. How: This focuses the body for a moment, then makes it unfocusable again.


}

// #endregion focTopFun



// #region forFilFun

/**
 * forFilFun = Form Fill Function
 *
 * @summary
 * Fills the contact form's three required fields, so a check can send it.
 * Each field is looked up inside the Contact section's form, since
 * index.html's hidden copy of it, which Netlify reads, labels its fields the
 * same way, and the "Message" label is matched exactly, since the
 * "Send Message" button's own label holds the word too.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page whose form to fill.
 *
 * @returns A promise that settles once every field is filled, with no value.
 *
 * @example
 * ```ts
 * forFilFun(page) // => Promise<void>
 * ```
 *
*/

async function forFilFun ( curPagObj : Page ) : Promise< void > {


	await curPagObj.locator( '#contact form' ).getByLabel( 'Your Name' ).fill( 'Test Visitor' );                 // What: Name Fill Call. Why: The name is required. How: This types a name.
	await curPagObj.locator( '#contact form' ).getByLabel( 'Email' ).fill( 'visitor@test.example' );             // What: Email Fill Call. Why: The email is required. How: This types an address on the reserved .example domain.
	await curPagObj.locator( '#contact form' ).getByLabel( 'Message', { exact : true } ).fill( 'Hello, Tony!' ); // What: Message Fill Call. Why: The message is required. How: This types a short one.


}

// #endregion forFilFun



// #region namProFun

/**
 * namProFun = Name Problems Function
 *
 * @summary
 * Reads the page's accessibility tree, the same tree a screen reader reads,
 * and returns a problem for every link or button with no name, and for every
 * one whose name contains a decorative glyph that should have been hidden.
 * Elements hidden from assistive technology don't appear in the tree, so the
 * decorative elements hidden from it are never counted.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to read.
 *
 * @returns A promise that resolves with every naming problem found.
 * @see {@link proLisArr}
 *
 * @example
 * ```ts
 * namProFun(page) // => [ '- button has no name' ]
 * ```
 *
*/

async function namProFun ( curPagObj : Page ) : Promise< string[] > {


	const ariSnaStr = await curPagObj.locator( 'body' ).ariaSnapshot();    // What: ARIA Snapshot String. Why: The accessibility tree shows each control's role and announced name. How: This reads the body's tree as text, one node per line.
	const conLinArr = ariSnaStr.match( /- (link|button)\b[^\n]*/g ) || []; // What: Control Line Array. Why: Only links and buttons are checked here. How: This keeps every tree line for one of those roles.

	const proLisArr : string[] = []; // What: Problem List Array. Why: Every problem should be reported, not just the first. How: This collects them.


	for ( const conLinStr of conLinArr ) { // What: Control Line Loop. Why: Each link and button is judged on its own. How: This reads each line's name and records what's wrong with it.


		const conNamStr = ( conLinStr.match( /"([^"]*)"/ ) || [] )[ 1 ] || ''; // What: Control Name String. Why: The announced name sits in quotes after the role. How: This takes the quoted text, or an empty name when there's none.


		if ( !conNamStr.trim() ) proLisArr.push( `${ conLinStr } has no name` ); // What: Missing Name Check. Why: A control with no name is announced as just its role. How: This records the line when its name is empty.

		else if ( GLY_DEC_REG.test( conNamStr ) ) proLisArr.push( `${ conLinStr } has a decorative glyph in its name` ); // What: Glyph Name Check. Why: A decorative arrow in a name becomes part of the control's announced name. How: This records the line when its name contains one.


	}



	return proLisArr; // What: Problem List Return. Why: The test prints whatever was found. How: This hands back every problem collected.


}

// #endregion namProFun



// #region scrSetFun

/**
 * scrSetFun = Scroll Settled Function
 *
 * @summary
 * Runs inside the page and resolves once the page has stopped scrolling,
 * meaning its scroll position hasn't changed for 15 frames in a row (about a
 * quarter of a second), or after 2 seconds at most. WebKit scrolls a focused
 * text field into view a few frames after focusing it rather than at once,
 * so measuring a stop straight after the Tab press would find it still off
 * screen. Passed to Playwright's evaluate, so it can't read anything from
 * this file.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param void - This function takes no parameters.
 *
 * @returns A promise that settles once scrolling has stopped, with no value.
 *
 * @example
 * ```ts
 * page.evaluate(scrSetFun) // => Promise<void>
 * ```
 *
*/

function scrSetFun () : Promise< void > {


	return new Promise( ( resSetFun ) => { // What: Settle Promise Return. Why: The walk waits on the page's frames. How: This resolves from inside a frame loop once scrolling has stopped.


		const staTimNum = performance.now(); // What: Start Time Number. Why: A page that never stops scrolling shouldn't hang the walk. How: This records when the wait began.

		let preScrNum = scrollY; // What: Previous Scroll Number. Why: Each frame is compared with the one before. How: This holds the last frame's scroll position.
		let staFraNum = 0;       // What: Stable Frame Number. Why: Scrolling has settled only after several unchanged frames. How: This counts them in a row.


		const fraCheFun = () => { // What: Frame Check Function. Why: Scrolling is judged once per frame. How: This counts unchanged frames and resolves after 15 of them or 2 seconds.


			staFraNum = scrollY === preScrNum ? staFraNum + 1 : 0; // What: Stable Frame Update. Why: Any movement restarts the count. How: This adds one for an unchanged frame and resets it otherwise.

			preScrNum = scrollY; // What: Previous Scroll Update. Why: The next frame is compared with this one. How: This stores this frame's position.



			if ( staFraNum >= 15 || performance.now() - staTimNum > 2000 ) { resSetFun(); return; } // What: Settled Guard. Why: The wait ends once scrolling has stopped, or after 2 seconds. How: This resolves the promise and stops the loop.



			requestAnimationFrame( fraCheFun ); // What: Next Frame Call. Why: Scrolling is checked again next frame. How: This schedules the check.


		};


		requestAnimationFrame( fraCheFun ); // What: First Frame Call. Why: The loop starts on the next frame. How: This schedules the first check.


	} );


}

// #endregion scrSetFun



type StoInfTyp = { // What: Stop Information Type. Why: The keyboard walk judges each stop outside the page. How: This describes what the page reports about one stop.


	covBoo : boolean, // What: Covered Boolean. Why: A stop hidden behind another element can't be seen while focused. How: This is true when something else sits on top of the center of the stop's first line.
	desStr : string,  // What: Description String. Why: A problem should name the element a person would recognize. How: This joins the stop's tag and its label or text.
	indBoo : boolean, // What: Indicator Boolean. Why: A keyboard user has to see where focus is. How: This is true when focusing the stop changes how it looks.
	ordNum : number,  // What: Order Number. Why: Focus order is compared with document order. How: This is the stop's position among every element in the page.
	visBoo : boolean  // What: Visible Boolean. Why: A stop off screen leaves a keyboard user lost. How: This is true when the stop has a size and overlaps the viewport.


};

// #region stoInfFun

/**
 * stoInfFun = Stop Information Function
 *
 * @summary
 * Runs inside the page after each Tab press and describes the focused stop, or
 * returns null once focus has left the page: onto the body, to nothing, or out
 * of the document entirely. (Firefox does none of these after its last stop;
 * keyProFun catches it there instead, when focus stays on the same stop.) The
 * focus indicator is judged by blurring the stop for a moment and comparing
 * the styles a focus indicator usually changes (outline, shadow, border,
 * background, color, and underline), then focusing it again so the walk
 * continues from it. Coverage is judged by asking which element sits at the
 * stop's center: anything other than the stop or one of its own descendants
 * means the stop is hidden behind it. Passed to Playwright's evaluate, so it
 * can't read anything from this file.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param void - This function takes no parameters.
 *
 * @returns The stop's description, or null when the walk has ended.
 *
 * @example
 * ```ts
 * page.evaluate(stoInfFun) // => { covBoo, desStr, indBoo, ordNum, visBoo }
 * ```
 *
*/

function stoInfFun () : StoInfTyp | null {


	const actCurEle = document.activeElement as HTMLElement | null; // What: Active Current Element. Why: The stop is whatever holds focus after the press. How: This reads the focused element. // What: Type Assertion Note. Why: activeElement types as Element, which has no blur or focus. How: Every element that can hold focus on this site is an HTMLElement.

	const actBodBoo = actCurEle === document.body; // What: Active Body Boolean. Why: Focus resting on the body means no stop holds it. How: This compares the focused element with the body.
	const actMisBoo = !actCurEle;                  // What: Active Missing Boolean. Why: Some engines report no focused element at all once focus leaves. How: This is true when there is none.
	const docBluBoo = !document.hasFocus();        // What: Document Blurred Boolean. Why: Focus can leave for the browser's own interface. How: This is true when the document no longer has focus.

	const walDonBoo = actMisBoo || actBodBoo || docBluBoo; // What: Walk Done Boolean. Why: Any of the three means the walk has left the page. How: This combines them.


	if ( walDonBoo ) return null; // What: Walk End Guard. Why: Focus on the body, nowhere, or outside the document means the walk has left the page. How: This returns null to end the walk.



	const sigStyFun = () => { // What: Signature Style Function. Why: A focus indicator is any visible change between focused and unfocused. How: This reads the stop's styles as one string to compare.


		const styCurObj = getComputedStyle( actCurEle ); // What: Style Current Object. Why: The stop's styles are compared as they're drawn now. How: This reads its computed styles.



		return [ styCurObj.outlineStyle, styCurObj.outlineWidth, styCurObj.outlineColor, styCurObj.boxShadow, styCurObj.borderColor, styCurObj.backgroundColor, styCurObj.color, styCurObj.textDecorationLine ].join( '|' ); // What: Signature Return. Why: Two looks compare as one string. How: This joins every style a focus indicator usually changes.


	};


	const focSigStr = sigStyFun(); // What: Focused Signature String. Why: The stop's look while focused is the first half of the comparison. How: This reads it before anything changes.


	actCurEle.blur(); // What: Stop Blur Call. Why: The unfocused look is the other half of the comparison. How: This removes focus for a moment.


	const bluSigStr = sigStyFun(); // What: Blurred Signature String. Why: The stop's unfocused look completes the comparison. How: This reads the same styles after the blur.


	actCurEle.focus(); // What: Stop Refocus Call. Why: The walk continues from this stop. How: This puts focus back where the Tab press left it.


	const recCurObj = actCurEle.getBoundingClientRect();                                                                       // What: Rect Current Object. Why: A focused stop has to be on screen and uncovered. How: This measures the stop.
	const linRecObj = actCurEle.getClientRects()[ 0 ] ?? recCurObj;                                                            // What: Line Rect Object. Why: A link wrapped onto two lines has a box whose center can fall on the text between its halves rather than on the link. How: This takes the stop's first line box, the same as its whole box for anything on one line.
	const topCurEle = document.elementFromPoint( linRecObj.left + linRecObj.width / 2, linRecObj.top + linRecObj.height / 2 ); // What: Top Current Element. Why: Whatever is drawn on top at the stop's center is what a person sees there. How: This asks the page which element sits at that point.



	const ariLabStr = actCurEle.getAttribute( 'aria-label' ); // What: ARIA Label String. Why: A stop's own label names it best. How: This reads its aria-label, or null.
	const eleIdeStr = actCurEle.id;                           // What: Element Identifier String. Why: A form field without a label is still recognizable by its ID. How: This reads the stop's ID, empty when it has none.
	const eleTexStr = actCurEle.textContent;                  // What: Element Text String. Why: A link or button is usually named by its text. How: This reads the stop's text.

	const stoLabStr = ariLabStr || eleIdeStr || eleTexStr || ''; // What: Stop Label String. Why: A problem should name the stop the way a person would recognize it. How: This takes the label, then the ID, then the text, then nothing.


	const botBelBoo = recCurObj.bottom > 0;        // What: Bottom Below Boolean. Why: A stop entirely above the viewport is off screen. How: This is true when its bottom edge sits below the viewport's top.
	const heiPosBoo = recCurObj.height > 0;        // What: Height Positive Boolean. Why: A stop with no height can't be seen. How: This is true when it has some height.
	const lefInsBoo = recCurObj.left < innerWidth; // What: Left Inside Boolean. Why: A stop entirely right of the viewport is off screen. How: This is true when its left edge sits inside the viewport's width.
	const rigInsBoo = recCurObj.right > 0;         // What: Right Inside Boolean. Why: A stop entirely left of the viewport is off screen. How: This is true when its right edge sits past the viewport's left.
	const topAboBoo = recCurObj.top < innerHeight; // What: Top Above Boolean. Why: A stop entirely below the viewport is off screen. How: This is true when its top edge sits above the viewport's bottom.
	const widPosBoo = recCurObj.width > 0;         // What: Width Positive Boolean. Why: A stop with no width can't be seen. How: This is true when it has some width.

	const visStoBoo = botBelBoo && heiPosBoo && lefInsBoo && rigInsBoo && topAboBoo && widPosBoo; // What: Visible Stop Boolean. Why: A focused stop has to be on screen. How: This is true when it has a size and overlaps the viewport.



	return { // What: Stop Information Return. Why: The walk judges each stop outside the page. How: This hands back the stop's coverage, description, indicator, position, and visibility.


		covBoo : !!topCurEle && !actCurEle.contains( topCurEle ),                               // What: Covered Boolean. Why: The stop is hidden when something else is on top of it. How: This is true when the top element at its center is neither the stop nor inside it.
		desStr : `${ actCurEle.tagName.toLowerCase() } "${ stoLabStr.trim().slice( 0, 40 ) }"`, // What: Description String. Why: A problem should name the element a person would recognize. How: This joins the tag with the first 40 characters of its label, ID, or text.
		indBoo : focSigStr !== bluSigStr,                                                       // What: Indicator Boolean. Why: A keyboard user has to see where focus is. How: This is true when focusing the stop changes how it looks.
		ordNum : Array.prototype.indexOf.call( document.querySelectorAll( '*' ), actCurEle ),   // What: Order Number. Why: Focus order is compared with document order. How: This is the stop's position among every element in the page.
		visBoo : visStoBoo                                                                      // What: Visible Boolean. Why: A stop off screen leaves a keyboard user lost. How: This reads whether the stop has a size and overlaps the viewport.


	};


}

// #endregion stoInfFun



// #region keyProFun

/**
 * keyProFun = Keyboard Problems Function
 *
 * @summary
 * Walks the page with the Tab key from the top and returns every problem:
 * any element with a positive tabindex, which overrides the document order,
 * and every stop that comes earlier in the document than the stop before
 * it, sits off screen, is covered by something else, or looks the same
 * focused and unfocused. The walk ends when focus leaves the page, comes
 * back to the first stop, or stays on the same stop after a press, which is
 * how Firefox leaves its last stop; one that hasn't ended within TAB_MAX_NUM
 * presses counts as a keyboard trap. WebKit only tabs to links with Alt
 * held, the way Safari does by default, so the walk presses Alt+Tab there.
 * The caller requests reduced motion first, so the page jumps to each stop
 * instead of gliding and focus styles appear at once, and each press waits
 * for scrolling to settle, so every stop is measured where and how it ends
 * up.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to walk.
 * @param engNamStr - Engine Name String: The browser the project runs in.
 *
 * @returns A promise that resolves with every keyboard problem found.
 * @see {@link proLisArr}
 *
 * @example
 * ```ts
 * keyProFun(page, 'webkit') // => [ 'input "email" has no visible ...' ]
 * ```
 *
*/

async function keyProFun ( curPagObj : Page, engNamStr : string ) : Promise< string[] > {


	const posTabNum = await curPagObj.locator( '[tabindex]' ).evaluateAll( ( tabEleArr ) => tabEleArr.filter( ( tabCurEle ) => Number( tabCurEle.getAttribute( 'tabindex' ) ) > 0 ).length ); // What: Positive Tabindex Number. Why: A positive tabindex pulls an element ahead of the document order. How: This counts every element carrying one.
	const tabKeyStr = engNamStr === 'webkit' ? 'Alt+Tab' : 'Tab'; // What: Tab Key String. Why: WebKit skips links on a plain Tab, the way Safari does by default. How: This picks Alt+Tab there and Tab everywhere else.

	const proLisArr : string[] = posTabNum ? [ `${ posTabNum } element(s) use a positive tabindex` ] : []; // What: Problem List Array. Why: Every problem should be reported, not just the first. How: This starts with the positive tabindex count, when there is one, and collects the rest during the walk.

	let firStoStr = ''; // What: First Stop String. Why: Focus coming back to the first stop means the walk went all the way around. How: This holds the first stop's description.
	let preOrdNum = -1; // What: Previous Order Number. Why: Each stop must come later in the document than the last. How: This holds the previous stop's position among every element.


	for ( let tabCouNum = 0; tabCouNum < TAB_MAX_NUM; tabCouNum++ ) { // What: Tab Walk Loop. Why: Every stop is checked in the order a keyboard user meets it. How: This presses Tab once per pass, up to the cap.


		await curPagObj.keyboard.press( tabKeyStr ); // What: Tab Press Call. Why: Each pass moves focus to the next stop. How: This presses the engine's Tab key.

		await curPagObj.evaluate( scrSetFun ); // What: Scroll Settled Wait. Why: Some engines scroll a focused field into view a few frames late. How: This waits until the page has stopped scrolling.


		const stoInfObj = await curPagObj.evaluate( stoInfFun );                                          // What: Stop Information Object. Why: The stop is described and measured inside the page. How: This runs stoInfFun there.
		const walEndBoo = !stoInfObj || stoInfObj.desStr === firStoStr || stoInfObj.ordNum === preOrdNum; // What: Walk Ended Boolean. Why: Focus leaving the page, coming back around, or staying put means every stop was visited. How: This checks each in turn, the later two only once a stop exists, so the chain stays inline. // What: Firefox Walk End Note. Why: Firefox moves focus out to its own interface after the last stop but still reports that stop as focused. How: Focus staying on the same stop after a press is read as the walk leaving the page.


		if ( walEndBoo ) return proLisArr; // What: Walk End Guard. Why: A walk that reaches its end has visited every stop it can. How: This returns them, ending the walk.



		if ( !firStoStr ) firStoStr = stoInfObj.desStr; // What: First Stop Record. Why: The walk ends if focus comes back to it. How: This remembers the first stop's description.



		if ( stoInfObj.ordNum <= preOrdNum ) proLisArr.push( `${ stoInfObj.desStr } comes before the previous stop in the document` ); // What: Order Check. Why: Focus should move forward through the page. How: This records a stop that jumps backwards.



		if ( !stoInfObj.visBoo ) proLisArr.push( `${ stoInfObj.desStr } is focused but not on screen` ); // What: On Screen Check. Why: A keyboard user can't act on what they can't see. How: This records a stop with no size or outside the viewport.

		else if ( stoInfObj.covBoo ) proLisArr.push( `${ stoInfObj.desStr } is focused but covered by another element` ); // What: Covered Check. Why: A stop hidden behind something else can't be seen either. How: This records an on-screen stop with another element on top of it.



		if ( !stoInfObj.indBoo ) proLisArr.push( `${ stoInfObj.desStr } has no visible focus indicator` ); // What: Indicator Check. Why: A keyboard user has to see where focus is. How: This records a stop that looks the same focused and unfocused.



		preOrdNum = stoInfObj.ordNum; // What: Previous Order Update. Why: The next stop is compared with this one. How: This stores this stop's position.


	}



	proLisArr.push( `focus never left the page within ${ TAB_MAX_NUM } presses, a likely keyboard trap` ); // What: Trap Record Call. Why: A keyboard user must always be able to Tab away. How: The loop returns as soon as the walk ends, so reaching this line means it never did.



	return proLisArr; // What: Problem List Return. Why: The test prints whatever was found. How: This hands back every problem collected.


}

// #endregion keyProFun



// #region motStyFun

/**
 * motStyFun = Motion Styles Function
 *
 * @summary
 * Runs inside the page and returns every element, or ::before or ::after
 * layer, whose computed styles would still move under reduced motion: a
 * transition lasting longer than 1ms, or an animation lasting longer than
 * 1ms that isn't turned off. Unlike getAnimations, which only lists motion
 * already playing, this reads what each element would do on its next change,
 * so a reduced-motion variant missing from any module, for a child, a layer,
 * or something shown only later, is caught at rest. Each problem names the
 * element by its tag and the readable part of its first class. Passed to
 * Playwright's evaluate, so it can't read anything from this file.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param void - This function takes no parameters.
 *
 * @returns Every element and layer that would still move.
 * @see {@link proLisArr}
 *
 * @example
 * ```ts
 * page.evaluate(motStyFun) // => [ 'span.togBarSpa transitions for 0.209s' ]
 * ```
 *
*/

function motStyFun () : string[] {


	const proLisArr : string[] = []; // What: Problem List Array. Why: Every element still moving should be reported, not just the first. How: This collects them.

	const lonDurFun = ( durLisStr : string ) => durLisStr.split( ',' ).some( ( durCurStr ) => parseFloat( durCurStr ) > 0.001 ); // What: Long Duration Function. Why: A near-instant .01ms exit kept so an end event fires isn't motion. How: This reports whether any duration in a computed list runs past 1ms.


	for ( const eleCurEle of document.querySelectorAll( '*' ) ) { // What: Element Loop. Why: A missing variant can sit on any element, not only a control. How: This walks every element on the page.


		const desEleStr = `${ eleCurEle.tagName.toLowerCase() }${ eleCurEle.classList.length ? '.' + ( eleCurEle.classList[ 0 ].split( '_' ).find( ( clsPieStr ) => clsPieStr.length > 2 ) ?? eleCurEle.classList[ 0 ] ) : '' }`; // What: Description Element String. Why: A problem should name the element the way the stylesheet does. How: This joins the tag with the readable part of its first class, the module name a hashed class carries.


		for ( const pseNamStr of [ '', '::before', '::after' ] ) { // What: Layer Loop. Why: A pseudo-element can carry motion of its own, such as the menu row's dot. How: This reads the element and each of its two layers.


			const styCurObj = getComputedStyle( eleCurEle, pseNamStr || null ); // What: Style Current Object. Why: The layer's motion is read as the page would play it. How: This reads its computed styles.


			if ( lonDurFun( styCurObj.transitionDuration ) ) proLisArr.push( `${ desEleStr }${ pseNamStr } transitions for ${ styCurObj.transitionDuration }` ); // What: Transition Check. Why: Reduced motion should leave no transition longer than 1ms. How: This records a layer that keeps one.



			if ( styCurObj.animationName !== 'none' && lonDurFun( styCurObj.animationDuration ) ) proLisArr.push( `${ desEleStr }${ pseNamStr } animates ${ styCurObj.animationName } for ${ styCurObj.animationDuration }` ); // What: Animation Check. Why: Reduced motion should leave no animation longer than 1ms. How: This records a layer that keeps one.


		}


	}



	return proLisArr; // What: Problem List Return. Why: The test prints whatever was found. How: This hands back every layer still moving.


}

// #endregion motStyFun

// #endregion Helpers



// #region Module Init

for ( const staRecObj of STA_REC_ARR ) { // What: State Test Loop. Why: The names, keyboard, reflow, and motion checks run on every page state. How: This declares each check once per state.


	test( `${ staRecObj.ideStr } names every link and button cleanly`, async ( { page : curPagObj } ) => { // What: Names Test. Why: Every link and button must be announced by a clean name. How: This opens the state and checks its accessibility tree.


		await opeStaFun( curPagObj, staRecObj ); // What: State Open Call. Why: The tree should be read with the state settled. How: This loads and settles it.

		expect( await namProFun( curPagObj ) ).toEqual( [] ); // What: No Name Problems Assertion. Why: The state passes only with clean names. How: This compares the problems with an empty list, so a failure prints each one.


	} );



	test( `${ staRecObj.ideStr } walks cleanly with the keyboard`, async ( { browserName : engNamStr, page : curPagObj } ) => { // What: Keyboard Test. Why: Everything has to be usable without a mouse. How: This opens the state under reduced motion, walks it with Tab, and checks it finds no keyboard problems.


		test.slow(); // What: Slow Test Mark. Why: A full walk measures every stop and takes about 11 seconds alone, which ran past the default 30-second timeout in Firefox when every suite shared the machine. How: This triples this test's timeout.

		await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Emulation. Why: A smooth scroll or a focus transition still running would be measured halfway. How: This makes the page match prefers-reduced-motion, which turns both off.

		await opeStaFun( curPagObj, staRecObj ); // What: State Open Call. Why: The walk should start from the state settled. How: This loads and settles it.

		await focTopFun( curPagObj ); // What: Focus Top Call. Why: A state's action can leave focus partway down, such as on the menu toggle it clicked. How: This moves the starting point for Tab back to the top of the page, so every engine walks every stop.

		expect( await keyProFun( curPagObj, engNamStr ) ).toEqual( [] ); // What: No Keyboard Problems Assertion. Why: The state passes only when every stop the walk reaches is in order, on screen, uncovered, and visibly focused. How: This compares the problems with an empty list, so a failure prints each one.


	} );



	test( `${ staRecObj.ideStr } reflows at ${ REF_WID_NUM }px without scrolling sideways`, async ( { page : curPagObj } ) => { // What: Reflow Test. Why: Zoomed-in visitors read in one column without scrolling sideways. How: This opens the state at the reflow width and compares the page's scroll width with its visible width.


		await opeStaFun( curPagObj, { ...staRecObj, widNum : REF_WID_NUM } ); // What: Narrow State Open Call. Why: Reflow is judged at WCAG's narrowest width. How: This opens the state with its width replaced by the reflow width.

		expect( await curPagObj.evaluate( () => document.documentElement.scrollWidth - document.documentElement.clientWidth ) ).toBeLessThanOrEqual( 0 ); // What: No Sideways Scroll Assertion. Why: The page passes only when nothing reaches past the viewport's width. How: This subtracts the visible width from the scrollable width, which stays at zero without sideways scrolling.


	} );



	test( `${ staRecObj.ideStr } plays no motion under reduced motion`, async ( { page : curPagObj } ) => { // What: Reduced Motion Test. Why: Visitors who ask for less motion shouldn't see the page animate. How: This requests reduced motion, opens the state, and checks that no animation is still running once it has settled.


		await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Emulation. Why: The preference has to be set before the page loads. How: This makes the page match prefers-reduced-motion: reduce.

		await opeStaFun( curPagObj, staRecObj ); // What: State Open Call. Why: Entrance animations and the state's own action are the motion being checked. How: This loads the state and runs its action.

		expect( await curPagObj.evaluate( () => document.getAnimations().filter( ( aniCurObj ) => ( Number( aniCurObj.effect?.getTiming().duration ) || 0 ) > 1 ).map( ( aniCurObj ) => ( aniCurObj as CSSAnimation ).animationName || ( aniCurObj as CSSTransition ).transitionProperty || 'script animation' ) ) ).toEqual( [] ); // What: No Motion Assertion. Why: The state passes only when nothing is still animating once it has opened. How: This lists every animation or transition the page still holds that lasts longer than 1ms, which should be none. // What: Type Assertion Note. Why: getAnimations returns plain Animation objects, which don't type their CSS names. How: Each one is read as a CSS animation, then a CSS transition, falling back to a generic label when neither name exists.
		expect( await curPagObj.evaluate( motStyFun ) ).toEqual( [] ); // What: No Motion Styles Assertion. Why: A reduced-motion variant missing for a child, a layer, or something not playing at rest would otherwise pass. How: This reads every element's and layer's computed transitions and animations and compares the ones still lasting past 1ms with an empty list.


	} );


}



for ( const [ staCodNum, rolNamStr, notTexStr, resDesStr, resVerStr ] of [ [ 200, 'status', 'Your message was sent', 'sent', 'is sent' ], [ 500, 'alert', "didn't go through", 'failed', 'fails' ] ] as const ) { // What: Form Result Loop. Why: The thank-you and the error each have their own live region. How: This declares the region and focus tests once per answer, pairing Netlify's status with the region's role, words only that note shows, and two ways of naming the result in the titles. // What: Type Assertion Note. Why: Without it each row widens to a mixed array, so the destructured names lose their literal types. How: as const keeps each row a readonly tuple, so each name is typed by its position.


	test( `a ${ resDesStr } message fills ${ rolNamStr === 'alert' ? 'an' : 'a' } ${ rolNamStr } region that was in the page, empty, from the start`, async ( { page : curPagObj } ) => { // What: Result Announcement Test. Why: A live region added at the moment it speaks is often missed, so the note's region has to wait in the page, empty, and gain the note once the answer arrives. How: This checks the form holds exactly one such region, empty on load, sends the form, and checks the region then holds the note while the other region stays empty.


		await fakNetFun( curPagObj, staCodNum ); // What: Netlify Fake Call. Why: The note depends on Netlify's answer, and no real message should go out. How: This answers every post to the site's root with the loop's status.

		await curPagObj.goto( '/' ); // What: Home Open Call. Why: The form lives in the Contact section. How: This loads the home page.


		const othRegObj = curPagObj.locator( `#contact form [role="${ rolNamStr === 'status' ? 'alert' : 'status' }"]` ); // What: Other Region Object. Why: Only the matching note should speak. How: This finds the form's other live region.
		const resRegObj = curPagObj.locator( `#contact form [role="${ rolNamStr }"]` );                                   // What: Result Region Object. Why: The note is announced through this region. How: This finds it inside the form.


		await expect( resRegObj ).toHaveCount( 1 ); // What: Region Present Assertion. Why: The region has to be in the page before anything is sent. How: This checks there's exactly one.
		await expect( resRegObj ).toHaveText( '' ); // What: Region Empty Assertion. Why: An empty region on load means its later note is a change a screen reader announces. How: This checks it holds no text yet.

		await forFilFun( curPagObj ); // What: Form Fill Call. Why: The form only sends once its required fields are filled. How: This fills them.

		await curPagObj.getByRole( 'button', { name : 'Send Message' } ).click(); // What: Send Click Call. Why: This is the action under test. How: This sends the message, which the fake answers.

		await expect( resRegObj ).toContainText( notTexStr ); // What: Region Note Assertion. Why: The answer should reach screen readers. How: This checks the region now holds the note.
		await expect( othRegObj ).toHaveText( '' );           // What: Other Region Empty Assertion. Why: Only one note answers each send. How: This checks the other region stayed empty.


	} );



	test( `the send button keeps focus when a message ${ resVerStr }`, async ( { page : curPagObj } ) => { // What: Send Focus Test. Why: A button disabled while it holds focus drops that focus to the page, so the send button has to keep it through the send. How: This sends from the focused button and checks it still holds focus once the answer has played out.


		await fakNetFun( curPagObj, staCodNum ); // What: Netlify Fake Call. Why: The note depends on Netlify's answer, and no real message should go out. How: This answers every post to the site's root with the loop's status.

		await curPagObj.goto( '/' ); // What: Home Open Call. Why: The form lives in the Contact section. How: This loads the home page.


		const senButObj = curPagObj.getByRole( 'button', { name : /^Send/ } ); // What: Send Button Object. Why: Focus is checked on the send button, whose name reads "Sending" while a message is out. How: This finds it by the start of its name.


		await forFilFun( curPagObj ); // What: Form Fill Call. Why: The form only sends once its required fields are filled. How: This fills them.

		await senButObj.focus(); // What: Send Focus Call. Why: The problem only shows while the button holds focus, which a click doesn't give it in every engine. How: This focuses it directly.

		await curPagObj.keyboard.press( 'Enter' ); // What: Enter Press Call. Why: This is the action under test. How: This sends the message from the focused button.

		await expect( curPagObj.locator( `#contact form [role="${ rolNamStr }"]` ) ).toContainText( notTexStr ); // What: Note Shown Assertion. Why: Focus is checked once the answer has played out. How: This waits for the note.
		await expect( senButObj ).toBeFocused();                                                                 // What: Button Focus Assertion. Why: Focus must not fall to the page. How: This checks the send button still holds it.


	} );



	test( `with the ${ resDesStr } note shown at ${ REF_WID_NUM }px, every name and the reflow stay clean, with a keyboard walk past the error note`, async ( { browserName : engNamStr, page : curPagObj } ) => { // What: Note State Test. Why: Each note is a state of the page with text and a link no other state shows, so the scripted checks have to cover it too, at the narrowest width, where long text is likeliest to overflow. How: This sends the form at the reflow width, then checks the names and the reflow with the note showing, and walks the page from the top for the error note, the only note with a link to reach.


		test.slow(); // What: Slow Test Mark. Why: A full keyboard walk takes about 11 seconds alone and runs long while every suite shares the machine. How: This triples this test's timeout.

		await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Emulation. Why: A focus transition still running would be measured halfway through the walk. How: This makes the page match prefers-reduced-motion: reduce.

		await curPagObj.setViewportSize( { height : 844, width : REF_WID_NUM } ); // What: Narrow Viewport Call. Why: Reflow is judged at WCAG's narrowest width. How: This sizes the page to the reflow width before it loads.

		await fakNetFun( curPagObj, staCodNum ); // What: Netlify Fake Call. Why: The note depends on Netlify's answer, and no real message should go out. How: This answers every post to the site's root with the loop's status.

		await curPagObj.goto( '/' ); // What: Home Open Call. Why: The form lives in the Contact section. How: This loads the home page.

		await forFilFun( curPagObj ); // What: Form Fill Call. Why: The form only sends once its required fields are filled. How: This fills them.

		await curPagObj.getByRole( 'button', { name : 'Send Message' } ).click(); // What: Send Click Call. Why: The note only shows after a send. How: This sends the message, which the fake answers.

		await expect( curPagObj.locator( `#contact form [role="${ rolNamStr }"]` ) ).toContainText( notTexStr );                                          // What: Note Shown Assertion. Why: The checks have to see the note. How: This waits for it.
		expect( await namProFun( curPagObj ) ).toEqual( [] );                                                                                             // What: No Name Problems Assertion. Why: The note's link, such as the error's phone link, needs a clean name too. How: This compares the problems with an empty list.
		expect( await curPagObj.evaluate( () => document.documentElement.scrollWidth - document.documentElement.clientWidth ) ).toBeLessThanOrEqual( 0 ); // What: No Sideways Scroll Assertion. Why: The note's long text mustn't push the page sideways. How: This subtracts the visible width from the scrollable width.



		if ( rolNamStr === 'status' ) return; // What: Thank-You Walk Guard. Why: The thank-you holds nothing a keyboard user can reach, so walking past it checks nothing new, and it hides itself partway through a walk. How: This ends the test for the thank-you before the walk.



		await focTopFun( curPagObj ); // What: Focus Top Call. Why: The send left focus on the send button, past the note. How: This moves the starting point for Tab back to the top of the page.

		expect( await keyProFun( curPagObj, engNamStr ) ).toEqual( [] ); // What: No Keyboard Problems Assertion. Why: The note's link has to be reachable and visibly focused like every other stop. How: This walks the page from the top and compares the problems with an empty list.


	} );



	test( `the ${ resDesStr } note plays no motion under reduced motion`, async ( { page : curPagObj } ) => { // What: Note Motion Test. Why: Visitors who ask for less motion shouldn't see the note rise in or its check pop. How: This requests reduced motion, sends the form against the faked answer, and checks nothing longer than 1ms is animating once the note shows.


		await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Emulation. Why: The preference has to be set before the page loads. How: This makes the page match prefers-reduced-motion: reduce.

		await fakNetFun( curPagObj, staCodNum ); // What: Netlify Fake Call. Why: The note depends on Netlify's answer, and no real message should go out. How: This answers every post to the site's root with the loop's status.

		await curPagObj.goto( '/' ); // What: Home Open Call. Why: The form lives in the Contact section. How: This loads the home page.

		await forFilFun( curPagObj ); // What: Form Fill Call. Why: The form only sends once its required fields are filled. How: This fills them.

		await curPagObj.getByRole( 'button', { name : 'Send Message' } ).click(); // What: Send Click Call. Why: The note only shows after a send. How: This sends the message, which the fake answers.

		await expect( curPagObj.locator( `#contact form [role="${ rolNamStr }"]` ) ).toContainText( notTexStr ); // What: Note Shown Assertion. Why: The motion is checked once the note has arrived. How: This waits for the note.

		expect( await curPagObj.evaluate( () => document.getAnimations().filter( ( aniCurObj ) => ( Number( aniCurObj.effect?.getTiming().duration ) || 0 ) > 1 ).map( ( aniCurObj ) => ( aniCurObj as CSSAnimation ).animationName || ( aniCurObj as CSSTransition ).transitionProperty || 'script animation' ) ) ).toEqual( [] ); // What: No Motion Assertion. Why: The note should simply appear. How: This lists every animation or transition the page still holds that lasts longer than 1ms, by name, and compares the list with an empty one. // What: Type Assertion Note. Why: getAnimations types each entry as a plain Animation. How: A CSS animation or transition carries its name, so this reads each as one, falling back for a script's own.


	} );


}



test( 'under reduced motion the thank-you note still leaves when the visitor types again', async ( { page : curPagObj } ) => { // What: Note Exit Test. Why: The note unmounts when its exit animation ends, so under reduced motion that exit has to stay long enough to fire its end event rather than be turned off. How: This sends the form under reduced motion, types into a field, and checks the status region empties.


	await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Emulation. Why: The preference has to be set before the page loads. How: This makes the page match prefers-reduced-motion: reduce.

	await fakNetFun( curPagObj, 200 ); // What: Netlify OK Fake Call. Why: The thank-you only shows after an accepted send. How: This fakes an OK answer.

	await curPagObj.goto( '/' ); // What: Home Open Call. Why: The form lives in the Contact section. How: This loads the home page.

	await forFilFun( curPagObj ); // What: Form Fill Call. Why: The form only sends once its required fields are filled. How: This fills them.

	await curPagObj.getByRole( 'button', { name : 'Send Message' } ).click(); // What: Send Click Call. Why: The thank-you only shows after a send. How: This sends the message, which the fake accepts.


	const staRegObj = curPagObj.locator( '#contact form [role="status"]' ); // What: Status Region Object. Why: The note's coming and going is read from its region. How: This finds the form's status region.


	await expect( staRegObj ).toContainText( 'Your message was sent' ); // What: Note Shown Assertion. Why: The exit is checked once the note has arrived. How: This waits for the note.

	await curPagObj.locator( '#contact form' ).getByLabel( 'Your Name' ).fill( 'Another Visitor' ); // What: Name Retype Call. Why: Typing again hides the thank-you. How: This changes the name field. // What: Contact Form Scope. Why: index.html's hidden copy of the form, which Netlify reads, labels its fields the same way. How: Each field is looked up inside the Contact section's form.

	await expect( staRegObj ).toHaveText( '' ); // What: Region Emptied Assertion. Why: The note has to unmount once its near-instant exit ends. How: This waits until the region holds no text.


} );



test( 'under reduced motion the error note still leaves when the visitor sends again', async ( { page : curPagObj } ) => { // What: Error Exit Test. Why: The error note unmounts when its exit animation ends too, so under reduced motion that exit has to stay long enough to fire its end event. How: This fails a send under reduced motion, sends again against an accepted answer, and checks the alert region empties.


	await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Emulation. Why: The preference has to be set before the page loads. How: This makes the page match prefers-reduced-motion: reduce.

	await fakNetFun( curPagObj, 500 ); // What: Netlify Error Fake Call. Why: The error only shows after a failed send. How: This fakes a server error.

	await curPagObj.goto( '/' ); // What: Home Open Call. Why: The form lives in the Contact section. How: This loads the home page.

	await forFilFun( curPagObj ); // What: Form Fill Call. Why: The form only sends once its required fields are filled. How: This fills them.

	await curPagObj.getByRole( 'button', { name : 'Send Message' } ).click(); // What: First Send Click Call. Why: The error only shows after a send. How: This sends the message, which the fake fails.


	const aleRegObj = curPagObj.locator( '#contact form [role="alert"]' ); // What: Alert Region Object. Why: The error's coming and going is read from its region. How: This finds the form's alert region.


	await expect( aleRegObj ).toContainText( "didn't go through" ); // What: Error Shown Assertion. Why: The exit is checked once the error has arrived. How: This waits for the note.

	await fakNetFun( curPagObj, 200 ); // What: Netlify OK Fake Call. Why: The retry should go through, which hides the error. How: This adds a route answering with success, which Playwright tries before the earlier one.

	await curPagObj.getByRole( 'button', { name : 'Send Message' } ).click(); // What: Retry Send Click Call. Why: A new send hides the last one's error. How: This sends the message again, which the new fake accepts.

	await expect( aleRegObj ).toHaveText( '' ); // What: Region Emptied Assertion. Why: The error has to unmount once its near-instant exit ends. How: This waits until the region holds no text.


} );



test( 'a second failed send is announced again, even while the first error is leaving', async ( { page : curPagObj } ) => { // What: Repeat Error Test. Why: A screen reader only speaks when the alert region gains something, and a retry that fails again before the old note has left would otherwise keep the same note in place. How: This fails a send, fails it again at once, and checks the region gained a fresh note.


	await fakNetFun( curPagObj, 500 ); // What: Netlify Error Fake Call. Why: Both sends have to fail. How: This fakes a server error for every post.

	await curPagObj.goto( '/' ); // What: Home Open Call. Why: The form lives in the Contact section. How: This loads the home page.

	await forFilFun( curPagObj ); // What: Form Fill Call. Why: The form only sends once its required fields are filled. How: This fills them.

	await curPagObj.getByRole( 'button', { name : 'Send Message' } ).click(); // What: First Send Click Call. Why: The first error has to show before the retry. How: This sends the message, which the fake fails.


	const aleRegObj = curPagObj.locator( '#contact form [role="alert"]' ); // What: Alert Region Object. Why: The announcement is read from the region. How: This finds the form's alert region.


	await expect( aleRegObj ).toContainText( "didn't go through" ); // What: First Error Assertion. Why: The retry starts once the first error is up. How: This waits for the note.

	await aleRegObj.evaluate( ( aleRegEle ) => { // What: Region Observer Setup. Why: The check has to see whether the retry adds a note, not just whether one is showing. How: This counts every element added to the region from here on, on the window.


		const winRecObj = window as unknown as { aleAddNum : number }; // What: Window Record Object. Why: The count has to outlive this callback for the test to read it. How: This views the window as holding it. // What: Type Assertion Note. Why: The window has no such field in its type. How: The test adds it here and reads it back below.


		winRecObj.aleAddNum = 0; // What: Added Count Reset. Why: Only elements added by the retry count. How: This starts the count at zero.

		new MutationObserver( ( mutRecArr ) => { winRecObj.aleAddNum += mutRecArr.reduce( ( addSumNum, mutCurObj ) => addSumNum + [ ...mutCurObj.addedNodes ].filter( ( addCurObj ) => addCurObj.nodeType === Node.ELEMENT_NODE ).length, 0 ); } ).observe( aleRegEle, { childList : true } ); // What: Added Element Observer. Why: A fresh note is what a screen reader announces. How: This adds the elements each change puts in the region to the count.


	} );

	await curPagObj.getByRole( 'button', { name : 'Send Message' } ).click(); // What: Retry Send Click Call. Why: The retry fails at once, while the first note is still leaving. How: This sends the message again, which the fake fails.

	await expect.poll( () => curPagObj.evaluate( () => ( window as unknown as { aleAddNum : number } ).aleAddNum ) ).toBeGreaterThan( 0 ); // What: Fresh Note Assertion. Why: The second failure has to reach screen readers too. How: This waits until the region has gained an element. // What: Type Assertion Note. Why: The window has no such field in its type. How: The observer set it above.

	await expect( aleRegObj ).toContainText( "didn't go through" ); // What: Second Error Assertion. Why: The fresh note should be the error. How: This checks the region holds it.


} );

// #endregion Module Init


