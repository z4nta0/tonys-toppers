


// #region Imports

import { expect      } from '@playwright/test';      // What: Expect. Why: Each state passes only when every reachable link and button responds. How: This asserts on what each check reads, most often that its problem list is empty, and waits for content a check needs.
import { fakNetFun   } from '../support/netlify.ts'; // What: Fake Netlify Function. Why: The contact form's error, and the phone link inside it, only show once a request fails. How: This answers the form's posts in the browser with a server error.
import { opeStaFun   } from '../support/states.ts';  // What: Open State Function. Why: Each check opens and settles its state first. How: This loads it and waits for it.
import { STA_REC_ARR } from '../support/states.ts';  // What: State Record Array. Why: Every page state is checked. How: This lists them.
import { test        } from '@playwright/test';      // What: Test. Why: Each check of each state is its own test. How: This declares them.


import type { ElementHandle } from '@playwright/test'; // What: Element Handle. Why: Each control is probed through a handle to its element. How: This types the element handles the helpers collect and record.
import type { Page          } from '@playwright/test'; // What: Page. Why: The helpers that drive the page from the test take a Playwright page, while those that run inside it take none. How: This types the driving helpers' page parameters.

// #endregion Imports



/**
 * feedback.spec.ts = Feedback Spec
 *
 * @summary
 * Checks the interaction feedback rule on every page state, in whichever
 * engine the project runs. Each kind of element a visitor interacts with, such
 * as a form field, has to look different in each state it responds to and ease
 * every probed property that change touches, on it or anything inside it. A
 * control's focus ring has to ease in to full width. Under reduced motion the
 * changes stay but nothing transitions. A state that switches on and off, such
 * as the chosen filter, is flipped both ways and checked the same way. A
 * control that only appears after an action, such as the phone link in the
 * contact form's error, gets checks of its own once that action is faked. Real
 * clicks are blocked during the checks, so pressing a control never navigates
 * or closes anything mid-check.
 *
 * Sections:
 *  - Types
 *  - Constants
 *  - Helpers
 *  - Module Init
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Types

type SnaRecTyp = { // What: Snapshot Record Type. Why: An element's look, and whether each part of it would ease, is compared between two moments the same way. How: This holds one value and one duration per probed property.


	durArr : number[], // What: Duration Array. Why: A property that changes has to ease rather than snap. How: This holds each probed property's transition duration in milliseconds, or 0 when no transition covers it, with an inherited color taking its parent's duration and a currentColor border taking the color's when that's longer.
	valArr : string[]  // What: Value Array. Why: Two moments are compared property by property. How: This holds each probed property's computed value.


};



type TogTarTyp = { // What: Toggle Target Type. Why: Each kind of element with a state that switches on and off is flipped the same way. How: This holds what to find, which attribute marks the state, its two values, the layer to read, and the states it has to be found in.


	actStr : string,        // What: Active String. Why: The state is switched on by setting its attribute. How: This holds the value that marks it on, '' for an attribute that only has to be present.
	attStr : string,        // What: Attribute String. Why: The state lives in one attribute the stylesheet reacts to. How: This holds its name.
	inaStr : string | null, // What: Inactive String. Why: The state is switched off by its attribute too. How: This holds the value that marks it off, or null for an attribute that's removed.
	pseStr : string,        // What: Pseudo String. Why: Part of a state's look can sit on a layer of the element, such as a dot drawn before it. How: This holds '::before' or '::after', or '' for none.
	selStr : string,        // What: Selector String. Why: Each kind is found by its own class. How: This holds the selector that matches it.
	staArr : string[]       // What: State Array. Why: A kind the probe silently stopped finding would pass without checking anything. How: This names each page state the kind has to be found in.


};

// #endregion Types



// #region Constants

const CON_PRO_ARR = [ 'color', 'background-color', 'border-color', 'box-shadow', 'transform', 'opacity' ]; // What: Control Property Array. Why: Hover and press feedback changes these, on a control or a hover-only card or frame and on what's inside it, such as its icon lines. How: Each is compared between moments, and each that changes has to be transitioned.
const ERR_LIN_STR = '#contact form [role="alert"] a';                                                      // What: Error Link String. Why: The phone link in the contact form's error message is probed on its own. How: This selects the link inside the form's alert region.
const FIE_PRO_ARR = [ 'border-color', 'outline-color', 'outline-offset', 'outline-width' ];                // What: Field Property Array. Why: A field's focus changes its border and its outline. How: Each is compared between rest and focus, and each that changes has to be transitioned.
const FOC_PRO_ARR = [ ...CON_PRO_ARR, 'outline-color', 'outline-offset', 'outline-width' ];                // What: Focus Property Array. Why: A control's focus can change its look as well as draw its ring. How: Each is compared between unfocused and focused, and each that changes has to be transitioned.
const HOV_TAR_STR = '[class*="proCarArt"], [class*="faiPhoFig"], [class*="porFraDiv"]';                    // What: Hover Target String. Why: The product cards, the gallery's booth frames, and the About portrait's frame respond to hover without being controls, so the control probes never reach them. How: This matches each by its CSS module classes, whose names Vite keeps inside each hashed class.
const SET_WAI_NUM = 400;                                                                                   // What: Settle Wait Number. Why: Each look is read once its transition has finished, and the longest interface transition runs about 367ms. How: This is the pause, in milliseconds, after each hover, press, or focus.
const TOG_PRO_ARR = [ ...CON_PRO_ARR, 'padding-top' ];                                                     // What: Toggle Property Array. Why: A switched state can change more than a hover does, such as the scrolled bar trimming its padding. How: Each is compared between off and on, and each that changes has to be transitioned.




// #region TOG_TAR_ARR

/**
 * TOG_TAR_ARR = Toggle Target Array
 *
 * @summary
 * The kinds of element with a state that switches on and off, each flipped
 * on and off again in turn, in the order listed, so the bar and the menu are
 * read before the Products filters scroll the page. Every row shares one
 * shape, so its fields carry no comments of their own:
 *
 * - `actStr` (String): Active String, the value that marks the state on.
 *
 * - `attStr` (String): Attribute String, the attribute that marks the state.
 *
 * - `inaStr` (String or null): Inactive String, the value that marks it off,
 *   or null to remove the attribute.
 *
 * - `pseStr` (String): Pseudo String, the layer to read with the element, or
 *   ''.
 *
 * - `selStr` (String): Selector String, the selector that finds the element.
 *
 * - `staArr` (Array): State Array, the page states, by their names in
 *   `STA_REC_ARR`, where at least one element of the kind has to be found and
 *   flipped.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const TOG_TAR_ARR : TogTarTyp[] = [ // What: Toggle Target Array. Why: A switched state is feedback as much as a hover, and has to ease in and out. How: This lists each kind of element to flip.


	{ // What: Menu Toggle Row. Why: The phone menu's toggle turns its bars into a cross while the menu is open. How: This flips its aria-expanded, on the phone states, where it shows.


		actStr : 'true',
		attStr : 'aria-expanded',
		inaStr : 'false',
		pseStr : '',
		selStr : '[class*="navTogBut"]',
		staArr : [ 'home-phone', 'menu-phone', 'not-found-phone' ]


	},

	{ // What: Scrolled Bar Row. Why: The bar draws its hairline and tightens once the page scrolls. How: This flips its data-page-scroll-active, on every state.


		actStr : '',
		attStr : 'data-page-scroll-active',
		inaStr : null,
		pseStr : '',
		selStr : '[class*="navBarNav"]',
		staArr : [ 'home-desktop', 'home-phone', 'menu-phone', 'not-found-desktop', 'not-found-phone' ]


	},

	{ // What: Open Menu Row. Why: The phone menu slides down while it's open, its rows rising in after it. How: This flips its data-mobile-menu-open, on the open menu state, where it shows.


		actStr : '',
		attStr : 'data-mobile-menu-open',
		inaStr : null,
		pseStr : '',
		selStr : '[class*="navMenDiv"]',
		staArr : [ 'menu-phone' ]


	},

	{ // What: Open Scrim Row. Why: The page dims behind the open phone menu. How: This flips the scrim's data-mobile-menu-open, on the open menu state, where it shows.


		actStr : '',
		attStr : 'data-mobile-menu-open',
		inaStr : null,
		pseStr : '',
		selStr : '[class*="navScrDiv"]',
		staArr : [ 'menu-phone' ]


	},

	{ // What: Section Link Row. Why: The bar's link, or the menu's row and its dot, for the section being read is marked active. How: This flips its data-section-link-active, reading the row's dot on its ::before layer, on the desktop states and the open menu state, where the links show.


		actStr : '',
		attStr : 'data-section-link-active',
		inaStr : null,
		pseStr : '::before',
		selStr : '[class*="navLinAnc"]',
		staArr : [ 'home-desktop', 'menu-phone', 'not-found-desktop' ]


	},

	{ // What: Filter Toggle Row. Why: The chosen Products filter fills its pill. How: This flips its aria-pressed, on the home states, where the Products section can be reached.


		actStr : 'true',
		attStr : 'aria-pressed',
		inaStr : 'false',
		pseStr : '',
		selStr : '[class*="filTogBut"]',
		staArr : [ 'home-desktop', 'home-phone' ]


	},

	{ // What: Submit Sending Row. Why: The send button dims while a message is out. How: This flips its aria-disabled, on the home states, where the contact form can be reached.


		actStr : 'true',
		attStr : 'aria-disabled',
		inaStr : 'false',
		pseStr : '',
		selStr : '[class*="forSubBut"]',
		staArr : [ 'home-desktop', 'home-phone' ]


	}


];

// #endregion TOG_TAR_ARR

// #endregion Constants



// #region Helpers

// #region aniFinFun

/**
 * aniFinFun = Animation Finish Function
 *
 * @summary
 * Runs inside the page and waits until every animation and transition on an
 * element and everything inside it has finished, leaving out any that repeat
 * forever, so a look read afterwards is the settled one even when a staggered
 * entrance, such as the phone menu's rows rising in one after another, runs
 * past the usual settle wait. Passed to Playwright's evaluate, so it can't
 * read anything from this file.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param eleCurEle - Element Current Element: The element to wait on.
 *
 * @returns A promise that settles once every finite animation has finished,
 *          with no value.
 *
 * @example
 * ```ts
 * handle.evaluate(aniFinFun) // => Promise<void>
 * ```
 *
*/

async function aniFinFun ( eleCurEle : Element ) : Promise< void > {


	const finAniArr = eleCurEle.getAnimations( { subtree : true } ).filter( ( aniCurObj ) => aniCurObj.effect?.getTiming().iterations !== Infinity ); // What: Finite Animation Array. Why: A loop never finishes, so waiting on one would hang. How: This lists the element's and its descendants' animations and transitions that end.


	await Promise.all( finAniArr.map( ( aniCurObj ) => aniCurObj.finished ) ); // What: Animation Finish Wait. Why: The look is read only once every entrance and transition has ended. How: This waits on each one's finished promise.


}

// #endregion aniFinFun



// #region attSetFun

/**
 * attSetFun = Attribute Set Function
 *
 * @summary
 * Sets an attribute on an element the test holds a handle to, or removes it
 * when given null, the way the page itself marks a state on or off, so the
 * stylesheet's look for that state applies without a click.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param hanCurObj - Handle Current Object: The element to mark.
 * @param attNamStr - Attribute Name String: The attribute to set.
 * @param attValStr - Attribute Value String: Its value, or null to remove it.
 *
 * @returns A promise that settles once the attribute is set, with no value.
 *
 * @example
 * ```ts
 * attSetFun(togCurObj, 'aria-pressed', 'true') // => Promise<void>
 * ```
 *
*/

async function attSetFun ( hanCurObj : ElementHandle< Element >, attNamStr : string, attValStr : string | null ) : Promise< void > {


	await hanCurObj.evaluate( ( hanCurEle, attArgArr ) => { if ( attArgArr[ 1 ] === null ) hanCurEle.removeAttribute( attArgArr[ 0 ] ); else hanCurEle.setAttribute( attArgArr[ 0 ], attArgArr[ 1 ] ); }, [ attNamStr, attValStr ] as const ); // What: Attribute Set Call. Why: The page function takes one argument. How: This passes the name and value as a pair, removing the attribute for null and setting it otherwise.


}

// #endregion attSetFun



// #region cliBloFun

/**
 * cliBloFun = Click Block Function
 *
 * @summary
 * Runs inside the page and cancels every click before anything handles it,
 * so pressing a control during a check never follows a link, starts a phone
 * call, or closes the menu. It listens on the document in the capture
 * phase, ahead of React's own listener on the app's root, and both prevents
 * the click's default and stops it from going any further. Passed to
 * Playwright's evaluate, so it can't read anything from this file.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param void - This function takes no parameters.
 *
 * @returns This function does not return anything.
 *
 * @example
 * ```ts
 * page.evaluate(cliBloFun) // => void
 * ```
 *
*/

function cliBloFun () : void {


	document.addEventListener( 'click', ( cliEveObj ) => { // What: Click Block Listener. Why: A press during a check shouldn't do anything. How: This cancels every click in the capture phase, before the page or React sees it.


		cliEveObj.preventDefault(); // What: Default Prevention Call. Why: A link shouldn't navigate mid-check. How: This cancels the click's default.

		cliEveObj.stopPropagation(); // What: Propagation Stop Call. Why: React's handlers, such as a menu link closing the menu, shouldn't run either. How: This keeps the click from reaching the app's root.


	}, true ); // What: Capture Phase Flag. Why: The block has to run before anything else sees the click. How: This registers the listener for the capture phase.


}

// #endregion cliBloFun



// #region conLisFun

/**
 * conLisFun = Control List Function
 *
 * @summary
 * Collects every element a visitor can reach on the page as it stands: each
 * element the selector matches that's visible, not taken out of the tab order
 * with tabindex -1, and not inside inert content, such as the page behind the
 * open mobile menu, so the same list serves every kind of element the checks
 * probe, such as form fields. Handles are taken once, so restyling while the
 * checks scroll (the nav bar's scrolled look) can't shift the list.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to collect from.
 * @param conSelStr - Control Selector String: The elements to collect, such as
 *                    every form field.
 *
 * @returns A promise that resolves with every reachable control.
 * @see {@link conHanArr}
 *
 * @example
 * ```ts
 * conLisFun(page, 'a, button') // => [ ElementHandle, ... ]
 * ```
 *
*/

async function conLisFun ( curPagObj : Page, conSelStr : string ) : Promise< ElementHandle< Element >[] > {


	const conHanArr : ElementHandle< Element >[] = []; // What: Control Handle Array. Why: The reachable controls are gathered one by one. How: This collects them.


	for ( const conCurObj of await curPagObj.$$( conSelStr ) ) { // What: Control Loop. Why: Every control the selector matches is judged on its own. How: This keeps each one a visitor can reach.


		const conReaBoo = await conCurObj.evaluate( ( conCurEle ) => conCurEle.getAttribute( 'tabindex' ) !== '-1' && !conCurEle.closest( '[inert]' ) ); // What: Control Reachable Boolean. Why: A control outside the tab order or inside inert content can't be reached. How: This checks both inside the page.


		if ( conReaBoo && await conCurObj.isVisible() ) conHanArr.push( conCurObj ); // What: Reachable Control Record. Why: Only controls a visitor can see and reach are checked. How: This keeps the control when it's both.


	}



	return conHanArr; // What: Control Handle Return. Why: The checks probe each control in turn. How: This hands back every reachable control's handle.


}

// #endregion conLisFun



// #region errOpeFun

/**
 * errOpeFun = Error Open Function
 *
 * @summary
 * Opens the home page at desktop width with Netlify faked to fail, fills in
 * the contact form's required fields, sends it, and waits for the error
 * message, so the phone link inside it can be probed. Real clicks are blocked
 * once the error shows, so pressing the link never starts a call. A caller
 * that needs reduced motion sets it first.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to open.
 *
 * @returns A promise that settles once the error shows and clicks are
 *          blocked, with no value.
 *
 * @example
 * ```ts
 * errOpeFun(page) // => Promise<void>
 * ```
 *
*/

async function errOpeFun ( curPagObj : Page ) : Promise< void > {


	await fakNetFun( curPagObj, 500 ); // What: Netlify Error Fake Call. Why: The request has to fail for the error to show. How: This answers every post to the site's root with a server error.

	await opeStaFun( curPagObj, STA_REC_ARR.find( ( staRecObj ) => staRecObj.ideStr === 'home-desktop' )! ); // What: Home Desktop Open Call. Why: The form lives in the Contact section, checked at desktop width. How: This loads and settles the home page at 1,440px. // What: Non-Null Note. Why: find types its result as possibly undefined. How: STA_REC_ARR always holds the home-desktop state.

	await curPagObj.locator( '#contact form' ).getByLabel( 'Your Name' ).fill( 'Test Visitor' );                 // What: Name Fill Call. Why: The name is required. How: This types a name.
	await curPagObj.locator( '#contact form' ).getByLabel( 'Email' ).fill( 'visitor@test.example' );             // What: Email Fill Call. Why: The email is required. How: This types an address on the reserved .example domain. // What: Contact Form Scope. Why: index.html's hidden copy of the form, which Netlify reads, labels its email and message fields the same way. How: Each field is looked up inside the Contact section's form.
	await curPagObj.locator( '#contact form' ).getByLabel( 'Message', { exact : true } ).fill( 'Hello, Tony!' ); // What: Message Fill Call. Why: The message is required. How: This types a short one, matching the label exactly, since the "Send Message" button's own label holds the word too. // What: Contact Form Scope. Why: index.html's hidden copy of the form, which Netlify reads, labels its email and message fields the same way. How: Each field is looked up inside the Contact section's form.

	await curPagObj.getByRole( 'button', { name : 'Send Message' } ).click(); // What: Send Click Call. Why: The error only shows after a send. How: This sends the message, which the fake fails.

	await expect( curPagObj.locator( ERR_LIN_STR ) ).toBeVisible(); // What: Error Link Shown Assertion. Why: The link is probed once the error has rendered, and an empty probe would pass without checking anything. How: This waits for the link inside the error message.

	await curPagObj.evaluate( cliBloFun ); // What: Click Block Call. Why: Pressing the link shouldn't start a call. How: This cancels every click from here on.


}

// #endregion errOpeFun



// #region movProFun

/**
 * movProFun = Moving Problems Function
 *
 * @summary
 * The reduced-motion counterpart of {@link snaProFun}: compares two snapshots
 * of the same element, taken before and after a change, and returns one
 * problem for each probed property that changed on the element or anything
 * inside it while a transition still eases it, read from the later snapshot.
 * A property that eases on several inner elements is one problem.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param froRecArr - From Record Array: The snapshot before the change.
 * @param tarRecArr - Target Record Array: The snapshot after the change.
 * @param proNamArr - Property Name Array: The probed property names, in the
 *                    snapshots' order.
 * @param desLabStr - Description Label String: The element's name in each
 *                    problem.
 * @param staNamStr - State Name String: The change in each problem, such as
 *                    'when toggled on'.
 *
 * @returns One problem per eased property.
 *
 * @example
 * ```ts
 * movProFun(inaSnaArr, actSnaArr, CON_PRO_ARR, 'button "All"',
 *   'when toggled on')
 * // => []
 * ```
 *
*/

function movProFun ( froRecArr : SnaRecTyp[], tarRecArr : SnaRecTyp[], proNamArr : string[], desLabStr : string, staNamStr : string ) : string[] {


	const movNamSet = new Set< string >(); // What: Moving Name Set. Why: A property that eases on several inner elements is one problem. How: This collects each eased property's name once.


	for ( const [ recIndNum, tarCurObj ] of tarRecArr.entries() ) { // What: Record Compare Loop. Why: Every element of the snapshot has to switch its changes at once. How: This compares each later record with the earlier one in its place.


		const froCurObj = froRecArr[ recIndNum ]; // What: From Current Object. Why: The change is read against the same element's earlier record. How: This finds it by place.


		if ( !froCurObj ) continue; // What: Missing Record Guard. Why: An element that appeared with the change has nothing to compare with. How: This skips it.



		for ( const [ proIndNum, proNamStr ] of proNamArr.entries() ) if ( froCurObj.valArr[ proIndNum ] !== tarCurObj.valArr[ proIndNum ] && tarCurObj.durArr[ proIndNum ] > 0 ) movNamSet.add( proNamStr ); // What: Property Compare Loop. Why: Under reduced motion a change should switch rather than ease. How: This records each one whose value changed while its later duration is above 0.


	}



	return [ ...movNamSet ].map( ( proNamStr ) => `${ desLabStr } eases its ${ proNamStr } ${ staNamStr } under reduced motion` ); // What: Motion Problems Return. Why: Each eased property should be reported plainly. How: This turns each name into a problem line.


}

// #endregion movProFun



// #region snaEleFun

/**
 * snaEleFun = Snapshot Element Function
 *
 * @summary
 * Runs inside the page and records how an element looks right now, and whether
 * each part of that look would ease if it changed: for the element, every
 * element inside it, and one of its layers when asked, each probed property's
 * computed value and the duration of the transition covering it, listed by its
 * own name, by a shorthand holding it (such as background for
 * background-color), or by all, or 0 when none is. The
 * border color reads only the sides actually drawn, those with a width above
 * zero, as one color when they all share it, since an undrawn side's color can
 * change without anything showing. An inner element whose color matches its
 * parent's takes the parent's duration for it, since an inherited color eases
 * with the parent's transition, as does a layer whose color matches the
 * element's, and a border color matching the element's own color takes the
 * color's duration when that's longer than its own, since an unset border
 * color is currentColor and follows the color as it eases. An identity matrix
 * reads as none, since the two draw the same. Passed to Playwright's evaluate,
 * so it can't read anything from this file.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param eleCurEle - Element Current Element: The element to record.
 * @param snaArgArr - Snapshot Argument Array: The property names to probe,
 *                    then the layer to add, '::before' or '::after', or ''
 *                    for none.
 *
 * @returns One record per element, the element itself first, then the asked
 *          layer.
 * @see {@link snaRecArr}
 *
 * @example
 * ```ts
 * handle.evaluate(snaEleFun, [CON_PRO_ARR, '']) // => [ { ... } ]
 * ```
 *
*/

function snaEleFun ( eleCurEle : Element, snaArgArr : [ string[], string ] ) : SnaRecTyp[] {


	const [ proNamArr, pseNamStr ] = snaArgArr; // What: Property Name Array. Why: The page function takes one argument, which holds the names to probe. How: This unpacks them from its first slot. // What: Pseudo Name String. Why: The same argument holds the layer to read with the element. How: This unpacks it from the second slot, '' for none.

	const parNamObj : Record< string, string > = { 'background-color' : 'background', 'border-color' : 'border', 'outline-color' : 'outline', 'outline-width' : 'outline', 'padding-top' : 'padding' }; // What: Parent Name Object. Why: A transition listed by a shorthand covers the longhands inside it. How: This maps each probed longhand that has a shorthand to it.



	const borValFun = ( styCurObj : CSSStyleDeclaration ) : string => [ ...new Set( [ 'top', 'right', 'bottom', 'left' ].filter( ( sidNamStr ) => styCurObj.getPropertyValue( `border-${ sidNamStr }-width` ) !== '0px' ).map( ( sidNamStr ) => styCurObj.getPropertyValue( `border-${ sidNamStr }-color` ) ) ) ].join( ' ' ); // What: Border Value Function. Why: Only a drawn border's color shows, so an undrawn side changing color isn't feedback. How: This joins the distinct colors of the sides wider than zero, one color when they share it.



	const snaStyFun = ( styCurObj : CSSStyleDeclaration ) : SnaRecTyp => { // What: Snapshot Style Function. Why: Each element and layer is recorded the same way. How: This reads its probed values and the duration covering each.


		const traDurArr = styCurObj.transitionDuration.split( ',' ).map( ( traDurStr ) => parseFloat( traDurStr ) * ( traDurStr.trim().endsWith( 'ms' ) ? 1 : 1000 ) ); // What: Transition Duration Array. Why: A covered property eases only with a duration above zero. How: This reads each listed duration in milliseconds.
		const traNamArr = styCurObj.transitionProperty.split( ',' ).map( ( traNamStr ) => traNamStr.trim() );                                                           // What: Transition Name Array. Why: A property eases only when its transition lists it. How: This reads each listed property name.


		const durProFun = ( proNamStr : string ) : number => { // What: Duration Property Function. Why: Each probed property needs the duration of whichever transition covers it. How: This finds the first listing by its name, its shorthand, or all, and reads its duration, which repeats when fewer durations than names are listed.


			const traIndNum = traNamArr.findIndex( ( traNamStr ) => [ proNamStr, 'all', parNamObj[ proNamStr ] ].includes( traNamStr ) ); // What: Transition Index Number. Why: The covering transition's place picks its duration. How: This finds the first name that covers the property.



			return traIndNum < 0 ? 0 : traDurArr[ traIndNum % traDurArr.length ]; // What: Covering Duration Return. Why: An uncovered property has no transition at all. How: This returns 0 for one, or its listing's duration.


		};



		return { // What: Snapshot Record Return. Why: Each element's record holds its values and durations side by side. How: This reads both for every probed property.


			durArr : proNamArr.map( durProFun ), // What: Duration Array. Why: A property that changes has to ease rather than snap. How: This reads the duration of the transition covering each probed property, or 0 when none does.
			valArr : proNamArr.map( ( proNamStr ) => ( proNamStr === 'border-color' ? borValFun( styCurObj ) : styCurObj.getPropertyValue( proNamStr ).replace( /^matrix\(1, 0, 0, 1, 0, 0\)$/, 'none' ) ) ) // What: Value Array. Why: Two moments are compared property by property. How: This reads each probed property's computed value, taking the border color from its drawn sides only and reading an identity matrix as none, since an entrance held at translateY( 0 ) draws the same as no transform.


		};


	};



	const borIndNum = proNamArr.indexOf( 'border-color' );                                          // What: Border Index Number. Why: An unset border color follows the color, so its place is checked against color's. How: This finds its place, or -1 when it isn't probed.
	const colIndNum = proNamArr.indexOf( 'color' );                                                 // What: Color Index Number. Why: Only color is inherited among the probed properties. How: This finds its place, or -1 when it isn't probed.
	const borColBoo = borIndNum >= 0 && colIndNum >= 0;                                             // What: Border Color Boolean. Why: The currentColor check needs both properties probed. How: This is true when the border color and the color are both in the list.
	const eleLisArr = [ eleCurEle, ...eleCurEle.querySelectorAll( '*' ) ];                          // What: Element List Array. Why: A change to an inner element counts as the control's own. How: This lists the element and everything inside it, parents before children.
	const snaRecArr = eleLisArr.map( ( lisCurEle ) => snaStyFun( getComputedStyle( lisCurEle ) ) ); // What: Snapshot Record Array. Why: Each element is recorded. How: This snapshots every listed element's computed styles.


	for ( const [ lisIndNum, lisCurEle ] of eleLisArr.entries() ) { // What: Inherited Color Loop. Why: An inner element whose color comes from its parent eases with the parent's transition. How: This gives each one whose color matches its parent's the parent's duration, in document order, so it passes down every level.


		const parIndNum = lisCurEle.parentElement ? eleLisArr.indexOf( lisCurEle.parentElement ) : -1; // What: Parent Index Number. Why: Only a parent inside the element passes its color down here. How: This finds the parent's place in the list, or -1.


		if ( parIndNum < 0 || colIndNum < 0 ) continue; // What: No Parent Guard. Why: The element itself, and every element when color isn't probed, keeps its own duration. How: This skips them.



		if ( snaRecArr[ lisIndNum ].valArr[ colIndNum ] === snaRecArr[ parIndNum ].valArr[ colIndNum ] ) snaRecArr[ lisIndNum ].durArr[ colIndNum ] = snaRecArr[ parIndNum ].durArr[ colIndNum ]; // What: Inherited Duration Assignment. Why: A color matching the parent's is the parent's, eased by the parent's transition. How: This copies the parent's color duration.


	}



	if ( pseNamStr ) snaRecArr.push( snaStyFun( getComputedStyle( eleCurEle, pseNamStr ) ) ); // What: Pseudo Layer Snapshot. Why: An element can carry part of its look on a layer of its own, such as a shadow that fades in. How: When asked, this records that layer last.



	if ( pseNamStr && colIndNum >= 0 && snaRecArr[ snaRecArr.length - 1 ].valArr[ colIndNum ] === snaRecArr[ 0 ].valArr[ colIndNum ] ) snaRecArr[ snaRecArr.length - 1 ].durArr[ colIndNum ] = snaRecArr[ 0 ].durArr[ colIndNum ]; // What: Inherited Layer Duration Assignment. Why: A layer whose color matches its element's inherits it, and eases with the element's transition. How: This copies the element's color duration onto the layer.



	for ( const snaRecObj of snaRecArr ) if ( borColBoo && snaRecObj.valArr[ borIndNum ] === snaRecObj.valArr[ colIndNum ] ) snaRecObj.durArr[ borIndNum ] = Math.max( snaRecObj.durArr[ borIndNum ], snaRecObj.durArr[ colIndNum ] ); // What: Current Color Border Loop. Why: A border color matching the element's own color is currentColor, which follows the color as it eases, so a text link with no border set doesn't snap one. How: This gives each such border color the longer of its own duration and the color's.



	return snaRecArr; // What: Snapshot Records Return. Why: The caller compares two moments' records. How: This hands back every record.


}

// #endregion snaEleFun



// #region snaHanFun

/**
 * snaHanFun = Snapshot Handle Function
 *
 * @summary
 * Records an element the test holds a handle to, by running {@link snaEleFun}
 * on it in the page with the properties to probe and the layer to add,
 * handed over as one two-item argument, since the page function takes only
 * one.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param hanCurObj - Handle Current Object: The element to record.
 * @param proNamArr - Property Name Array: The properties to probe.
 * @param pseNamStr - Pseudo Name String: The layer to add, '::before' or
 *                    '::after', or '' for none.
 *
 * @returns A promise that resolves with one record per element, the element
 *          itself first, then the asked layer.
 *
 * @example
 * ```ts
 * snaHanFun(conCurObj, CON_PRO_ARR, '') // => [ { durArr, valArr } ]
 * ```
 *
*/

async function snaHanFun ( hanCurObj : ElementHandle, proNamArr : string[], pseNamStr : string ) : Promise< SnaRecTyp[] > {


	const snaArgArr : [ string[], string ] = [ proNamArr, pseNamStr ]; // What: Snapshot Argument Array. Why: The page function takes one argument, typed as a two-item tuple. How: This packs the property names and the layer to add.



	return hanCurObj.evaluate( snaEleFun, snaArgArr ); // What: Snapshot Return. Why: The caller compares two moments' records. How: This runs snaEleFun on the element in the page and hands back its records.


}

// #endregion snaHanFun



// #region snaProFun

/**
 * snaProFun = Snap Problems Function
 *
 * @summary
 * Compares two snapshots of the same element, taken before and after a
 * change, and returns one problem for each probed property that changed on
 * the element or anything inside it without a transition to ease it, read
 * from the later snapshot, since a change eases with the transition of the
 * state it moves into. A property that snaps on several inner elements is one
 * problem.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param froRecArr - From Record Array: The snapshot before the change.
 * @param tarRecArr - Target Record Array: The snapshot after the change.
 * @param proNamArr - Property Name Array: The probed property names, in the
 *                    snapshots' order.
 * @param desLabStr - Description Label String: The element's name in each
 *                    problem.
 * @param staNamStr - State Name String: The change in each problem, such as
 *                    'when hovered'.
 *
 * @returns One problem per snapped property.
 *
 * @example
 * ```ts
 * snaProFun(resSnaArr, hovSnaArr, CON_PRO_ARR, 'a "Home"', 'when hovered')
 * // => []
 * ```
 *
*/

function snaProFun ( froRecArr : SnaRecTyp[], tarRecArr : SnaRecTyp[], proNamArr : string[], desLabStr : string, staNamStr : string ) : string[] {


	const snaNamSet = new Set< string >(); // What: Snapped Name Set. Why: A property that snaps on several inner elements is one problem. How: This collects each snapped property's name once.


	for ( const [ recIndNum, tarCurObj ] of tarRecArr.entries() ) { // What: Record Compare Loop. Why: Every element of the snapshot has to ease its own probed changes. How: This compares each later record with the earlier one in its place.


		const froCurObj = froRecArr[ recIndNum ]; // What: From Current Object. Why: The change is read against the same element's earlier record. How: This finds it by place.


		if ( !froCurObj ) continue; // What: Missing Record Guard. Why: An element that appeared with the change has nothing to compare with. How: This skips it.



		for ( const [ proIndNum, proNamStr ] of proNamArr.entries() ) if ( froCurObj.valArr[ proIndNum ] !== tarCurObj.valArr[ proIndNum ] && tarCurObj.durArr[ proIndNum ] === 0 ) snaNamSet.add( proNamStr ); // What: Property Compare Loop. Why: A property that changed with nothing to ease it snaps. How: This records each one whose value changed while its later duration is 0.


	}



	return [ ...snaNamSet ].map( ( proNamStr ) => `${ desLabStr } snaps its ${ proNamStr } ${ staNamStr }` ); // What: Snap Problems Return. Why: Each snapped property should be reported plainly. How: This turns each name into a problem line.


}

// #endregion snaProFun



const valSigFun = ( snaRecArr : SnaRecTyp[] ) : string => JSON.stringify( snaRecArr.map( ( snaRecObj ) => snaRecObj.valArr ) ); // What: Value Signature Function. Why: A look is the same between two moments only when every probed value matches. How: This joins every record's values into one string to compare.



// #region feeProFun

/**
 * feeProFun = Feedback Problems Function
 *
 * @summary
 * Probes every reachable control and returns a problem for each one that gives
 * no feedback, or a single problem when it finds no control at all. Each
 * control is scrolled into view, and one that still waits above the screen
 * until it's focused, such as the skip link, is focused so it slides in, then
 * blurred again once it's probed. Each is read at rest with the pointer away,
 * read again while hovered, and again while the mouse button is held on it,
 * then blurred with the pointer away and read once more while focused as a
 * keyboard focuses it, every look read once its transition has settled. A
 * control that looks the same at rest and hovered, hovered and pressed, or
 * blurred and focused is a problem. Normally every probed property that
 * changes on hover, press, or focus, on the control or anything inside it, has
 * to be eased by a transition ({@link snaProFun}), the focus ring's outline
 * included, so the ring eases in; under reduced motion every one of the
 * control's transition durations must be zero instead. The caller blocks real
 * clicks first, so releasing the mouse does nothing.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to probe.
 * @param conSelStr - Control Selector String: The controls to probe, either
 *                    'a, button' for every link and button or a narrower
 *                    selector for one control.
 * @param redMotBoo - Reduced Motion Boolean: Whether the page is emulating
 *                    reduced motion.
 *
 * @returns A promise that resolves with every feedback problem found.
 * @see {@link proLisArr}
 *
 * @example
 * ```ts
 * feeProFun(page, 'a, button', false) // => [] when every control responds
 * ```
 *
*/

async function feeProFun ( curPagObj : Page, conSelStr : string, redMotBoo : boolean ) : Promise< string[] > {


	const proLisArr : string[] = []; // What: Problem List Array. Why: Every problem should be reported, not just the first. How: This collects them.

	const conHanArr = await conLisFun( curPagObj, conSelStr ); // What: Control Handle Array. Why: Every reachable control the selector matches is probed. How: This collects their handles.


	if ( !conHanArr.length ) proLisArr.push( 'no control to probe' ); // What: Empty Probe Check. Why: A probe that finds nothing would pass without checking anything. How: This records a problem when no control is found.



	for ( const conCurObj of conHanArr ) { // What: Control Probe Loop. Why: Every reachable control has to respond. How: This reads each reachable one the selector matches at rest, hovered, pressed, blurred, and focused.


		const conDesStr = await conCurObj.evaluate( ( conCurEle ) => `${ conCurEle.tagName.toLowerCase() } "${ ( conCurEle.getAttribute( 'aria-label' ) || conCurEle.textContent || '' ).trim().slice( 0, 30 ) }"` ); // What: Control Description String. Why: A problem should name the control a person would recognize. How: This joins its tag with its label or text.


		await conCurObj.scrollIntoViewIfNeeded(); // What: Control Scroll Call. Why: A control has to be on screen to hover or press. How: This scrolls it into view.


		const offScrBoo = await conCurObj.evaluate( ( conCurEle ) => conCurEle.getBoundingClientRect().bottom <= 0 ); // What: Off Screen Boolean. Why: A control that waits above the screen until it's focused, such as a skip link, can't be hovered where it rests. How: This is true when its box still sits wholly above the viewport after the scroll.


		if ( offScrBoo ) await conCurObj.focus(); // What: Hidden Control Focus Call. Why: Such a control only comes into view while focused, and is probed there. How: This focuses it, and the rest settle wait below lets it finish sliding in.



		await curPagObj.mouse.move( 0, 0 ); // What: Pointer Away Call. Why: The resting look is read with nothing hovered. How: This moves the pointer to the corner of the bar.

		await curPagObj.waitForTimeout( SET_WAI_NUM ); // What: Rest Settle Wait. Why: Any earlier hover has to finish fading. How: This pauses for the settle time.


		const resSnaArr = await snaHanFun( conCurObj, CON_PRO_ARR, '' ); // What: Rest Snapshot Array. Why: The resting look is what hover is compared with. How: This records the control and everything inside it.


		await conCurObj.hover(); // What: Control Hover Call. Why: Hover feedback is the first thing checked. How: This moves the pointer onto the control.

		await curPagObj.waitForTimeout( SET_WAI_NUM ); // What: Hover Settle Wait. Why: The hover look is read once it has eased in. How: This pauses for the settle time.


		const hovSnaArr = await snaHanFun( conCurObj, CON_PRO_ARR, '' ); // What: Hover Snapshot Array. Why: The hovered look is compared with rest and with pressed. How: This records it.


		await curPagObj.mouse.down(); // What: Mouse Down Call. Why: A press shows while the button is held. How: This holds the mouse button down on the control.

		await curPagObj.waitForTimeout( SET_WAI_NUM ); // What: Press Settle Wait. Why: The pressed look is read once it has eased in. How: This pauses for the settle time.


		const preSnaArr = await snaHanFun( conCurObj, CON_PRO_ARR, '' );                                              // What: Press Snapshot Array. Why: The pressed look is compared with hovered. How: This records it.
		const traDurStr = await conCurObj.evaluate( ( conCurEle ) => getComputedStyle( conCurEle ).transitionDuration ); // What: Transition Duration String. Why: Reduced motion should leave nothing moving. How: This reads the control's transition durations.


		await curPagObj.mouse.up(); // What: Mouse Up Call. Why: The press has to end before the next control. How: This releases the button, whose click the caller has blocked.

		await curPagObj.mouse.move( 0, 0 ); // What: Pointer Away Call. Why: The focus look is compared with no hover on it. How: This moves the pointer to the corner of the bar.

		await conCurObj.evaluate( ( conCurEle ) => { if ( conCurEle instanceof HTMLElement ) conCurEle.blur(); } ); // What: Control Blur Call. Why: The focus look is compared with the control unfocused, and a press or the hidden control's focus may have focused it. How: This blurs it, so a control that waits above the screen slides back out.

		await curPagObj.waitForTimeout( SET_WAI_NUM ); // What: Blur Settle Wait. Why: The unfocused look is read once the hover and focus have faded. How: This pauses for the settle time.


		const bluSnaArr = await snaHanFun( conCurObj, FOC_PRO_ARR, '' ); // What: Blur Snapshot Array. Why: The unfocused look is what focus is compared with. How: This records the control and everything inside it, outline included.


		await conCurObj.evaluate( ( conCurEle ) => { if ( conCurEle instanceof HTMLElement ) conCurEle.focus( { focusVisible : true } ); } ); // What: Keyboard Focus Call. Why: The focus ring shows only for keyboard focus, and a script's focus draws it in every engine only when it asks to show the ring. How: This focuses the control with focusVisible set.

		await curPagObj.waitForTimeout( SET_WAI_NUM ); // What: Focus Settle Wait. Why: The focused look is read once it has eased in. How: This pauses for the settle time.


		const focSnaArr = await snaHanFun( conCurObj, FOC_PRO_ARR, '' ); // What: Focus Snapshot Array. Why: The focused look is compared with unfocused. How: This records it.


		await conCurObj.evaluate( ( conCurEle ) => { if ( conCurEle instanceof HTMLElement ) conCurEle.blur(); } ); // What: Control Blur Call. Why: Left focused, the control would keep its ring, or stay in view over whatever is probed next. How: This blurs it, and the next rest settle wait lets it fade.



		if ( valSigFun( resSnaArr ) === valSigFun( hovSnaArr ) ) proLisArr.push( `${ conDesStr } looks the same hovered` ); // What: Hover Check. Why: A hovered control has to respond. How: This records one that doesn't change.



		if ( valSigFun( hovSnaArr ) === valSigFun( preSnaArr ) ) proLisArr.push( `${ conDesStr } looks the same pressed` ); // What: Press Check. Why: A press has to register before anything happens. How: This records one that doesn't change.



		if ( valSigFun( bluSnaArr ) === valSigFun( focSnaArr ) ) proLisArr.push( `${ conDesStr } looks the same focused` ); // What: Focus Check. Why: A focused control has to show where focus is. How: This records one whose look and ring don't change.



		if ( redMotBoo && !/^0s(, 0s)*$/.test( traDurStr ) ) proLisArr.push( `${ conDesStr } still transitions under reduced motion (${ traDurStr })` ); // What: Reduced Motion Check. Why: Asking for less motion should stop every transition. How: This records a control with any duration above zero.



		if ( !redMotBoo ) proLisArr.push( ...snaProFun( resSnaArr, hovSnaArr, CON_PRO_ARR, conDesStr, 'when hovered' ), ...snaProFun( hovSnaArr, preSnaArr, CON_PRO_ARR, conDesStr, 'when pressed' ), ...snaProFun( bluSnaArr, focSnaArr, FOC_PRO_ARR, conDesStr, 'when focused' ) ); // What: Snapped Change Check. Why: Every probed property a hover, press, or focus changes should ease rather than snap, the focus ring included. How: This records each one that changes without a transition, on the control or anything inside it.


	}



	return proLisArr; // What: Problem List Return. Why: The test prints whatever was found. How: This hands back every problem collected.


}

// #endregion feeProFun



// #region fieProFun

/**
 * fieProFun = Field Problems Function
 *
 * @summary
 * Probes every form field a visitor can reach (each visible input, select, and
 * textarea) and returns a problem for each one that gives no hover or focus
 * feedback. Each field is scrolled into view and read at rest, then hovered
 * and read again, then, with the pointer moved away, focused by keyboard, by
 * stepping back off it with Shift+Tab and onto it again with Tab, every look
 * read once its transition has settled. A field that looks the same hovered as
 * at rest, one the Tab press doesn't land on, or one that looks the same
 * focused as at rest (its border color and outline), is a problem. Normally
 * every one of those that changes has to be eased by a transition ({@link
 * snaProFun}), outline-width and outline-offset included, so the ring eases
 * in; under reduced motion every one of its transition durations must be zero
 * instead.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to probe.
 * @param redMotBoo - Reduced Motion Boolean: Whether the page is emulating
 *                    reduced motion.
 *
 * @returns A promise that resolves with every hover and focus feedback problem
 *          found.
 * @see {@link proLisArr}
 *
 * @example
 * ```ts
 * fieProFun(page, false) // => [ 'input "email" looks the same focused' ]
 * ```
 *
*/

async function fieProFun ( curPagObj : Page, redMotBoo : boolean ) : Promise< string[] > {


	const proLisArr : string[] = []; // What: Problem List Array. Why: Every problem should be reported, not just the first. How: This collects them.


	for ( const fieCurObj of await conLisFun( curPagObj, 'input, select, textarea' ) ) { // What: Field Probe Loop. Why: Every reachable form field has to answer hover and show focus. How: This reads each one at rest, hovered, and focused by keyboard.


		const fieDesStr = await fieCurObj.evaluate( ( fieCurEle ) => `${ fieCurEle.tagName.toLowerCase() } "${ fieCurEle.getAttribute( 'name' ) || '' }"` ); // What: Field Description String. Why: A problem should name the field in terms of the form. How: This joins its tag with the name Netlify records it under.


		await fieCurObj.scrollIntoViewIfNeeded(); // What: Field Scroll Call. Why: A field has to be on screen for its look to be read. How: This scrolls it into view.


		const resSnaArr = await snaHanFun( fieCurObj, FIE_PRO_ARR, '' ); // What: Rest Snapshot Array. Why: The resting look is what hover and focus are compared with. How: This records the field's border color and outline.


		await fieCurObj.hover(); // What: Field Hover Call. Why: A field answers the pointer as well as the keyboard. How: This moves the pointer onto it.

		await curPagObj.waitForTimeout( SET_WAI_NUM ); // What: Hover Settle Wait. Why: The hover look is read once it has eased in. How: This pauses for the settle time.


		const hovSnaArr = await snaHanFun( fieCurObj, FIE_PRO_ARR, '' ); // What: Hover Snapshot Array. Why: The hovered look is compared with rest. How: This records the field's border color and outline.


		await curPagObj.mouse.move( 0, 0 ); // What: Pointer Away Call. Why: The focused look should be read without the hover on top of it. How: This moves the pointer to the corner of the bar.

		await curPagObj.waitForTimeout( SET_WAI_NUM ); // What: Rest Settle Wait. Why: The hover has to finish fading before focus is read. How: This pauses for the settle time.

		await fieCurObj.focus(); // What: Field Focus Call. Why: The keyboard steps start from the field itself. How: This focuses it so Shift+Tab steps off it.

		await curPagObj.keyboard.press( 'Shift+Tab' ); // What: Back Tab Press Call. Why: Focus has to arrive by keyboard, the way a keyboard user reaches the field. How: This steps focus back to the stop before the field.
		await curPagObj.keyboard.press( 'Tab' );       // What: Tab Press Call. Why: The field is reached by keyboard. How: This steps focus forward onto the field again.

		await curPagObj.waitForTimeout( SET_WAI_NUM ); // What: Focus Settle Wait. Why: The focused look is read once it has eased in. How: This pauses for the settle time.


		const focFieBoo = await fieCurObj.evaluate( ( fieCurEle ) => fieCurEle === document.activeElement );             // What: Focused Field Boolean. Why: The focused look only counts when the Tab press landed on the field. How: This checks the field holds focus.
		const focSnaArr = await snaHanFun( fieCurObj, FIE_PRO_ARR, '' );                                              // What: Focus Snapshot Array. Why: The focused look is compared with rest. How: This records the field's border color and outline.
		const traDurStr = await fieCurObj.evaluate( ( fieCurEle ) => getComputedStyle( fieCurEle ).transitionDuration ); // What: Transition Duration String. Why: Reduced motion should leave nothing moving. How: This reads the field's transition durations.



		if ( valSigFun( resSnaArr ) === valSigFun( hovSnaArr ) ) proLisArr.push( `${ fieDesStr } looks the same hovered` ); // What: Hover Check. Why: A field under the pointer has to respond. How: This records one whose border and outline don't change.



		if ( !focFieBoo ) proLisArr.push( `${ fieDesStr } isn't reached by Tab` ); // What: Keyboard Reach Check. Why: A keyboard user has to be able to reach every field. How: This records one the Tab press didn't land on.

		else if ( valSigFun( resSnaArr ) === valSigFun( focSnaArr ) ) proLisArr.push( `${ fieDesStr } looks the same focused` ); // What: Focus Check. Why: A focused field has to stand out. How: This records one whose border and outline don't change.



		if ( redMotBoo && !/^0s(, 0s)*$/.test( traDurStr ) ) proLisArr.push( `${ fieDesStr } still transitions under reduced motion (${ traDurStr })` ); // What: Reduced Motion Check. Why: Asking for less motion should stop every transition. How: This records a field with any duration above zero.

		else if ( !redMotBoo ) proLisArr.push( ...snaProFun( resSnaArr, hovSnaArr, FIE_PRO_ARR, fieDesStr, 'when hovered' ), ...( focFieBoo ? snaProFun( resSnaArr, focSnaArr, FIE_PRO_ARR, fieDesStr, 'when focused' ) : [] ) ); // What: Snapped Change Check. Why: A field's hover and focus changes, its ring included, should ease rather than snap. How: This records each property that changes without a transition, on hover always and on focus when the Tab press landed.


	}



	return proLisArr; // What: Problem List Return. Why: The test prints whatever was found. How: This hands back every problem collected.


}

// #endregion fieProFun



// #region hovProFun

/**
 * hovProFun = Hover Problems Function
 *
 * @summary
 * Probes every visible card and frame that responds to hover, such as a
 * product card, and returns a problem for each one that gives no hover
 * feedback. None is a control, so only hover is checked: each is scrolled into
 * view, read at rest with the pointer away and again while hovered, every look
 * read once its transition has settled, and one that looks the same both ways
 * is a problem. Its transition durations are read from the element and its
 * ::after layer, where a hover shadow can fade in. Normally every property
 * that changes, on it, anything inside it, or that layer, has to be eased by a
 * transition ({@link snaProFun}); under reduced motion every duration must be
 * zero instead, while the hover look still has to change. Finding nothing to
 * probe is a problem too, so the check can't pass without checking anything.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to probe.
 * @param redMotBoo - Reduced Motion Boolean: Whether the page is emulating
 *                    reduced motion.
 *
 * @returns A promise that resolves with every hover feedback problem found.
 * @see {@link proLisArr}
 *
 * @example
 * ```ts
 * hovProFun(page, false) // => [ 'div "" looks the same hovered' ]
 * ```
 *
*/

async function hovProFun ( curPagObj : Page, redMotBoo : boolean ) : Promise< string[] > {


	const proLisArr : string[] = []; // What: Problem List Array. Why: Every problem should be reported, not just the first. How: This collects them.

	const tarHanArr = await conLisFun( curPagObj, HOV_TAR_STR ); // What: Target Handle Array. Why: Every visible card and frame that responds to hover is probed. How: This collects them the way the controls are collected.


	if ( !tarHanArr.length ) proLisArr.push( 'no card or frame to probe' ); // What: Empty Probe Check. Why: A probe that finds nothing would pass without checking anything. How: This records a problem when no card or frame is found.



	for ( const tarCurObj of tarHanArr ) { // What: Target Probe Loop. Why: Every card and frame has to respond to hover. How: This reads each one at rest and hovered.


		const tarDesStr = await tarCurObj.evaluate( ( tarCurEle ) => `${ tarCurEle.tagName.toLowerCase() } "${ ( tarCurEle.textContent || '' ).trim().slice( 0, 30 ) }"` ); // What: Target Description String. Why: A problem should name the card or frame a person would recognize. How: This joins its tag with the start of its text.


		await tarCurObj.scrollIntoViewIfNeeded(); // What: Target Scroll Call. Why: A card or frame has to be on screen to hover. How: This scrolls it into view.

		await curPagObj.mouse.move( 0, 0 ); // What: Pointer Away Call. Why: The resting look is read with nothing hovered. How: This moves the pointer to the corner of the bar.

		await curPagObj.waitForTimeout( SET_WAI_NUM ); // What: Rest Settle Wait. Why: Any earlier hover has to finish fading. How: This pauses for the settle time.


		const resSnaArr = await snaHanFun( tarCurObj, CON_PRO_ARR, '::after' ); // What: Rest Snapshot Array. Why: The resting look is what hover is compared with. How: This records the card or frame, everything inside it, and its ::after layer.


		await tarCurObj.hover(); // What: Target Hover Call. Why: Hover is the one interaction a card or frame has. How: This moves the pointer onto it.

		await curPagObj.waitForTimeout( SET_WAI_NUM ); // What: Hover Settle Wait. Why: The hover look is read once it has eased in. How: This pauses for the settle time.


		const hovSnaArr = await snaHanFun( tarCurObj, CON_PRO_ARR, '::after' ); // What: Hover Snapshot Array. Why: The hovered look is compared with rest. How: This records it.
		const traDurStr = await tarCurObj.evaluate( ( tarCurEle ) => `${ getComputedStyle( tarCurEle ).transitionDuration }, ${ getComputedStyle( tarCurEle, '::after' ).transitionDuration }` ); // What: Transition Duration String. Why: A hover-only element can fade part of its look in on its ::after layer, so both have to ease normally and stand still under reduced motion. How: This joins the element's durations with its ::after layer's.


		if ( valSigFun( resSnaArr ) === valSigFun( hovSnaArr ) ) proLisArr.push( `${ tarDesStr } looks the same hovered` ); // What: Hover Check. Why: A hovered card or frame has to respond, under reduced motion too. How: This records one that doesn't change.



		if ( redMotBoo && !/^0s(, 0s)*$/.test( traDurStr ) ) proLisArr.push( `${ tarDesStr } still transitions under reduced motion (${ traDurStr })` ); // What: Reduced Motion Check. Why: Asking for less motion should stop every transition. How: This records a card or frame with any duration above zero.

		else if ( !redMotBoo ) proLisArr.push( ...snaProFun( resSnaArr, hovSnaArr, CON_PRO_ARR, tarDesStr, 'when hovered' ) ); // What: Snapped Change Check. Why: A hover change should ease rather than snap. How: This records each property that changes without a transition, on the card or frame, anything inside it, or its ::after layer.


	}



	return proLisArr; // What: Problem List Return. Why: The test prints whatever was found. How: This hands back every problem collected.


}

// #endregion hovProFun



// #region togProFun

/**
 * togProFun = Toggle Problems Function
 *
 * @summary
 * Flips every reachable element with a state that switches on and off, each
 * kind listed in {@link TOG_TAR_ARR}, and returns a problem for each one that
 * gives no feedback, skipping one drawn as display: contents, which has no box
 * of its own. The pointer is moved away, and each element is scrolled into
 * view, marked off, read, marked on, read again, marked off, and read a third
 * time, every look read once its transitions and finite animations have
 * finished, then left as the page had it. An element that looks the same off
 * and on is a problem. Normally every probed property that changes either way,
 * on the element, anything inside it, or the layer its row names, has to be
 * eased by a transition ({@link snaProFun}); under reduced motion none of them
 * may ease ({@link movProFun}). A kind that flips nothing in a state its row
 * names is a problem too, so the check can't pass by quietly losing one.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to probe.
 * @param staIdeStr - State Identifier String: The page state's name, which
 *                    each row's states are checked against.
 * @param redMotBoo - Reduced Motion Boolean: Whether the page is emulating
 *                    reduced motion.
 *
 * @returns A promise that resolves with every toggle feedback problem found.
 * @see {@link proLisArr}
 *
 * @example
 * ```ts
 * togProFun(page, 'home-phone', false) // => [] when every toggle eases
 * ```
 *
*/

async function togProFun ( curPagObj : Page, staIdeStr : string, redMotBoo : boolean ) : Promise< string[] > {


	const fliTarSet : Set< TogTarTyp >                          = new Set(); // What: Flipped Target Set. Why: Each kind has to be flipped in the states its row names. How: This records every kind at least one element was flipped for.
	const proLisArr : string[]                                  = [];        // What: Problem List Array. Why: Every problem should be reported, not just the first. How: This collects them.
	const togHanArr : [ TogTarTyp, ElementHandle< Element > ][] = [];        // What: Toggle Handle Array. Why: Each reachable element of each kind is flipped, unless it's drawn without a box. How: This pairs each element's handle with its kind's row.


	for ( const togTarObj of TOG_TAR_ARR ) for ( const togCurObj of await conLisFun( curPagObj, togTarObj.selStr ) ) togHanArr.push( [ togTarObj, togCurObj ] ); // What: Toggle Collect Loop. Why: Only elements a visitor can see and reach are flipped. How: This collects each kind's reachable elements in the table's order.



	for ( const [ togTarObj, togCurObj ] of togHanArr ) { // What: Toggle Probe Loop. Why: Every switched state has to show and ease. How: This reads each element off, on, and off again.


		const conDisBoo = await togCurObj.evaluate( ( togCurEle ) => getComputedStyle( togCurEle ).display === 'contents' ); // What: Contents Display Boolean. Why: An element drawn as display: contents has no box of its own, such as the phone menu's wrapper on wide screens, where its state changes nothing. How: This reads its computed display.


		if ( conDisBoo ) continue; // What: Boxless Element Guard. Why: A state on an element with no box can't change how it looks. How: This skips it.



		fliTarSet.add( togTarObj ); // What: Flipped Kind Call. Why: Each kind is checked for in the states its row names once the loop ends. How: This records the element's row.



		const oriValStr = await togCurObj.getAttribute( togTarObj.attStr ); // What: Original Value String. Why: The element is left as the page had it. How: This reads the attribute's value, or null when it's absent.
		const togDesStr = await togCurObj.evaluate( ( togCurEle ) => `${ togCurEle.tagName.toLowerCase() } "${ ( togCurEle.getAttribute( 'aria-label' ) || togCurEle.textContent || '' ).trim().slice( 0, 30 ) }"` ); // What: Toggle Description String. Why: A problem should name the element a person would recognize. How: This joins its tag with its label or text.


		await togCurObj.scrollIntoViewIfNeeded(); // What: Toggle Scroll Call. Why: An element's look is read on screen. How: This scrolls it into view.

		await curPagObj.mouse.move( 0, 0 ); // What: Pointer Away Call. Why: The state's look is read with nothing hovered. How: This moves the pointer to the corner of the bar.

		await attSetFun( togCurObj, togTarObj.attStr, togTarObj.inaStr ); // What: Off Set Call. Why: The state is read switching on from off. How: This marks it off.

		await curPagObj.waitForTimeout( SET_WAI_NUM ); // What: Off Settle Wait. Why: Any earlier look has to finish fading. How: This pauses for the settle time.

		await togCurObj.evaluate( aniFinFun ); // What: Animation Finish Call. Why: A staggered entrance inside the element can outlast the settle wait. How: This waits for every finite animation in it to end.


		const inaSnaArr = await snaHanFun( togCurObj, TOG_PRO_ARR, togTarObj.pseStr ); // What: Inactive Snapshot Array. Why: The off look is what the on look is compared with. How: This records the element, everything inside it, and its row's layer.


		await attSetFun( togCurObj, togTarObj.attStr, togTarObj.actStr ); // What: On Set Call. Why: Switching the state on is the change checked first. How: This marks it on.

		await curPagObj.waitForTimeout( SET_WAI_NUM ); // What: On Settle Wait. Why: The on look is read once it has eased in. How: This pauses for the settle time.

		await togCurObj.evaluate( aniFinFun ); // What: Animation Finish Call. Why: A staggered entrance inside the element can outlast the settle wait. How: This waits for every finite animation in it to end.


		const actSnaArr = await snaHanFun( togCurObj, TOG_PRO_ARR, togTarObj.pseStr ); // What: Active Snapshot Array. Why: The on look is compared with off both ways. How: This records it.


		await attSetFun( togCurObj, togTarObj.attStr, togTarObj.inaStr ); // What: Off Again Set Call. Why: Switching the state off has to ease too. How: This marks it off again.

		await curPagObj.waitForTimeout( SET_WAI_NUM ); // What: Off Again Settle Wait. Why: The off look is read once it has eased out. How: This pauses for the settle time.

		await togCurObj.evaluate( aniFinFun ); // What: Animation Finish Call. Why: A staggered entrance inside the element can outlast the settle wait. How: This waits for every finite animation in it to end.


		const retSnaArr = await snaHanFun( togCurObj, TOG_PRO_ARR, togTarObj.pseStr ); // What: Return Snapshot Array. Why: The look switched back off is compared with on. How: This records it.


		await attSetFun( togCurObj, togTarObj.attStr, oriValStr ); // What: Original Set Call. Why: The next element is read on the page as it was. How: This puts the attribute back as the page had it.



		if ( valSigFun( inaSnaArr ) === valSigFun( actSnaArr ) ) proLisArr.push( `${ togDesStr } looks the same toggled on` ); // What: Toggle Check. Why: A switched state has to show. How: This records an element that doesn't change.



		if ( redMotBoo ) proLisArr.push( ...movProFun( inaSnaArr, actSnaArr, TOG_PRO_ARR, togDesStr, 'when toggled on' ), ...movProFun( actSnaArr, retSnaArr, TOG_PRO_ARR, togDesStr, 'when toggled off' ) ); // What: Reduced Motion Check. Why: Asking for less motion should switch a state at once. How: This records each property that changes while a transition still eases it, both ways.

		else proLisArr.push( ...snaProFun( inaSnaArr, actSnaArr, TOG_PRO_ARR, togDesStr, 'when toggled on' ), ...snaProFun( actSnaArr, retSnaArr, TOG_PRO_ARR, togDesStr, 'when toggled off' ) ); // What: Snapped Change Check. Why: A state switching on or off should ease rather than snap. How: This records each property that changes without a transition, both ways.


	}



	for ( const togTarObj of TOG_TAR_ARR ) if ( togTarObj.staArr.includes( staIdeStr ) && !fliTarSet.has( togTarObj ) ) proLisArr.push( `${ togTarObj.selStr } flips nothing` ); // What: Missing Kind Loop. Why: A kind that stopped matching, such as after a class rename, would otherwise drop out without failing. How: This records each kind whose row names this state but which flipped no element.



	return proLisArr; // What: Problem List Return. Why: The test prints whatever was found. How: This hands back every problem collected.


}

// #endregion togProFun

// #endregion Helpers



// #region Module Init

for ( const staRecObj of STA_REC_ARR ) { // What: State Test Loop. Why: Every page state is checked. How: This declares each check once per state.


	test( `${ staRecObj.ideStr } gives every reachable link and button hover, press, and focus feedback, and every toggle its switch`, async ( { page : curPagObj } ) => { // What: Feedback Test. Why: Every interaction should visibly register. How: This opens the state, blocks clicks, probes every reachable link and button, every reachable form field, on the home states every visible card and frame that responds to hover, and every reachable toggle, and checks it finds no problems.


		test.setTimeout( 180000 ); // What: Test Timeout Call. Why: Probing every control, field, card, and frame took about 90 seconds in WebKit alone, which ran past the 90-second limit (the default 30 seconds tripled) while the engines shared the machine. How: This gives the test three minutes.

		await opeStaFun( curPagObj, staRecObj ); // What: State Open Call. Why: The controls are probed with the state settled. How: This loads and settles it.

		await curPagObj.evaluate( cliBloFun ); // What: Click Block Call. Why: Pressing a control shouldn't navigate or close anything. How: This cancels every click from here on.

		expect( await feeProFun( curPagObj, 'a, button', false ) ).toEqual( [] ); // What: No Feedback Problems Assertion. Why: The state passes only when every reachable link and button responds. How: This compares the problems with an empty list, so a failure prints each one.
		expect( await fieProFun( curPagObj, false ) ).toEqual( [] );              // What: No Field Problems Assertion. Why: The state passes only when every form field shows focus. How: This compares the problems with an empty list, so a failure prints each one.


		if ( staRecObj.ideStr.startsWith( 'home-' ) ) expect( await hovProFun( curPagObj, false ) ).toEqual( [] ); // What: No Hover Problems Assertion. Why: The cards and frames that respond to hover show with nothing covering them only on the home states. How: This compares their problems with an empty list on the home desktop and phone states, so a failure prints each one.



		expect( await togProFun( curPagObj, staRecObj.ideStr, false ) ).toEqual( [] ); // What: No Toggle Problems Assertion. Why: The state passes only when every switched state shows and eases. How: This compares the problems with an empty list, so a failure prints each one.


	} );



	test( `${ staRecObj.ideStr } draws its focus ring at full width`, async ( { browserName : engNamStr, page : curPagObj } ) => { // What: Focus Ring Test. Why: A keyboard user has to see where focus lands. How: This presses Tab once from where the state leaves focus and checks the stop it lands on draws its ring at 2px once it has eased in.


		await opeStaFun( curPagObj, staRecObj ); // What: State Open Call. Why: The walk starts from the state settled. How: This loads and settles it.

		await curPagObj.keyboard.press( engNamStr === 'webkit' ? 'Alt+Tab' : 'Tab' ); // What: Tab Press Call. Why: The ring shows only for keyboard focus. How: This presses Tab once from where the state leaves focus, holding Alt in WebKit, which otherwise skips links the way Safari does.

		await curPagObj.waitForTimeout( SET_WAI_NUM ); // What: Ring Settle Wait. Why: The ring is read once it has grown in. How: This pauses for the settle time.

		expect( await curPagObj.evaluate( () => getComputedStyle( document.activeElement as Element ).outlineWidth ) ).toBe( '2px' ); // What: Full Ring Assertion. Why: The ring has to reach its full width. How: This reads the focused stop's outline width, which the large border width token snaps to 2px. // What: Type Assertion Note. Why: activeElement types as possibly null. How: The Tab press just put focus on a stop.


	} );



	test( `${ staRecObj.ideStr } keeps feedback without motion under reduced motion`, async ( { page : curPagObj } ) => { // What: Reduced Motion Feedback Test. Why: Visitors who ask for less motion still need to see their actions register. How: This probes every reachable link and button, every reachable form field, on the home states every visible card and frame that responds to hover, and every reachable toggle, with reduced motion on and checks it finds no problems.


		test.setTimeout( 180000 ); // What: Test Timeout Call. Why: Probing every control, field, card, and frame took about 90 seconds in WebKit alone, which ran past the 90-second limit (the default 30 seconds tripled) while the engines shared the machine. How: This gives the test three minutes.

		await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Emulation. Why: The preference has to be set before the page loads. How: This makes the page match prefers-reduced-motion: reduce.

		await opeStaFun( curPagObj, staRecObj ); // What: State Open Call. Why: The controls are probed with the state settled. How: This loads and settles it.

		await curPagObj.evaluate( cliBloFun ); // What: Click Block Call. Why: Pressing a control shouldn't navigate or close anything. How: This cancels every click from here on.

		expect( await feeProFun( curPagObj, 'a, button', true ) ).toEqual( [] ); // What: No Reduced Motion Problems Assertion. Why: Every reachable link and button has to respond without moving. How: This compares the problems with an empty list, so a failure prints each one.
		expect( await fieProFun( curPagObj, true ) ).toEqual( [] );              // What: No Reduced Motion Field Problems Assertion. Why: Every form field has to show focus without moving. How: This compares the problems with an empty list, so a failure prints each one.


		if ( staRecObj.ideStr.startsWith( 'home-' ) ) expect( await hovProFun( curPagObj, true ) ).toEqual( [] ); // What: No Reduced Motion Hover Problems Assertion. Why: The cards and frames that respond to hover have to keep their hover look without moving. How: This compares their problems with an empty list on the home desktop and phone states, so a failure prints each one.



		expect( await togProFun( curPagObj, staRecObj.ideStr, true ) ).toEqual( [] ); // What: No Reduced Motion Toggle Problems Assertion. Why: Every switched state has to show without moving. How: This compares the problems with an empty list, so a failure prints each one.


	} );


}



test( "the contact form error's phone link gives hover, press, and focus feedback", async ( { page : curPagObj } ) => { // What: Error Link Feedback Test. Why: The error's phone link only renders after a failed send, so no page state reaches it. How: This fails a send, probes the link, and checks it finds no problems.


	await errOpeFun( curPagObj ); // What: Error Open Call. Why: The link only exists once a send has failed. How: This fails a send and waits for the error.

	expect( await feeProFun( curPagObj, ERR_LIN_STR, false ) ).toEqual( [] ); // What: No Error Link Problems Assertion. Why: The link has to respond like every other control. How: This compares the problems with an empty list, so a failure prints each one.


} );



test( "the contact form error's phone link keeps feedback without motion under reduced motion", async ( { page : curPagObj } ) => { // What: Reduced Motion Error Link Test. Why: Visitors who ask for less motion still need to see the link respond. How: This fails a send with reduced motion on, probes the link, and checks it finds no problems.


	await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Emulation. Why: The preference has to be set before the page loads. How: This makes the page match prefers-reduced-motion: reduce.

	await errOpeFun( curPagObj ); // What: Error Open Call. Why: The link only exists once a send has failed. How: This fails a send and waits for the error.

	expect( await feeProFun( curPagObj, ERR_LIN_STR, true ) ).toEqual( [] ); // What: No Reduced Motion Error Link Problems Assertion. Why: The link has to respond without moving. How: This compares the problems with an empty list, so a failure prints each one.


} );

// #endregion Module Init


