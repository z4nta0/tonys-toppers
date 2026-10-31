


// #region Imports

import { expect      } from '@playwright/test';      // What: Expect. Why: Each check passes only when the policy is enforced and the page breaks none of its rules. How: This asserts on what each check collects from the page.
import { fakNetFun   } from '../support/netlify.ts'; // What: Fake Netlify Function. Why: The form's notes only show once Netlify answers a send, and nothing real should be sent. How: This answers the form's posts in the browser with a chosen status.
import { heaAllFun   } from '../support/headers.ts'; // What: Headers All Function. Why: The pages are loaded under the policy Netlify really sends. How: This reads the /* block of public/_headers.
import { opeStaFun   } from '../support/states.ts';  // What: Open State Function. Why: Each state is opened the way the other page suites open it. How: This loads the state and waits until it's settled.
import { STA_REC_ARR } from '../support/states.ts';  // What: State Record Array. Why: The policy has to hold in every state the suites visit. How: This is the list of states to load.
import { test        } from '@playwright/test';      // What: Test. Why: Each state is its own test. How: This declares them.


import type { Page } from '@playwright/test'; // What: Page. Why: The policy setup drives a Playwright page. How: This types the policy helpers' page parameters.

// #endregion Imports



/**
 * browser.spec.ts = Browser Spec
 *
 * @summary
 * Checks that the site works under its own security policy, in whichever
 * engine the project runs. Each page loads from the production build, which
 * the preview server serves, since the dev server injects inline scripts the
 * policy would block. Neither server reads public/_headers, so every response
 * is given its headers here. First a check proves the policy is live, by
 * injecting an inline script and seeing it refused and reported. Then every
 * state the suites visit is checked for policy violations and checked to close
 * off every new tab link, and the contact form is sent against each faked
 * answer, so its post and its notes are checked under the policy too.
 *
 * Sections:
 *  - Helpers
 *  - Module Init
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Helpers

// #region polSetFun

/**
 * polSetFun = Policy Setup Function
 *
 * @summary
 * Readies a page to be checked against the policy. Every response the page
 * receives is given the headers public/_headers sends, the way Netlify gives
 * them once deployed, and a listener added before any of the page's own
 * script runs records every violation the browser reports, as a line naming
 * the directive broken and what broke it, on the page's window, where
 * polVioFun reads them back.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to ready.
 *
 * @returns A promise that settles once the headers and the listener are in
 *          place, with no value.
 *
 * @example
 * ```ts
 * polSetFun(page) // => Promise<void>
 * ```
 *
*/

async function polSetFun ( curPagObj : Page ) : Promise< void > {


	const heaAllObj = heaAllFun(); // What: Headers All Object. Why: Every response gets the same headers. How: This reads them once.


	await curPagObj.route( '**/*', async ( rouCurObj ) => { // What: Header Route Call. Why: The preview server sends none of the policy's headers. How: This fetches every response as normal and fulfills it with the policy's headers added.


		const resCurObj = await rouCurObj.fetch(); // What: Response Current Object. Why: The page should get the real file. How: This fetches it from the preview server.


		await rouCurObj.fulfill( { headers : { ...resCurObj.headers(), ...heaAllObj }, response : resCurObj } ); // What: Fulfill Call. Why: The browser applies this site's policy from a response's headers. How: This answers with the real response and the policy's headers on top.


	} );



	await curPagObj.addInitScript( () => { // What: Violation Listener Call. Why: The listener has to be in place before the page's own script runs, or an early violation would be missed. How: This runs before every page's script and records each violation the browser reports.


		const winVioObj = window as unknown as { __polVioArr : string[] }; // What: Window Violation Object. Why: The violations are kept where the test can read them back. How: This views the window with its violation list. // What: Type Assertion Note. Why: The window has no such field in its type. How: The as names the one the listener adds.


		winVioObj.__polVioArr = []; // What: Violation List Assignment. Why: Each page starts with none. How: This sets an empty list.


		document.addEventListener( 'securitypolicyviolation', ( vioEveObj ) => winVioObj.__polVioArr.push( `${ vioEveObj.effectiveDirective } blocked ${ vioEveObj.blockedURI || 'inline code' } on ${ ( vioEveObj.target as Element | null )?.tagName?.toLowerCase() ?? 'the page' }` ) ); // What: Violation Listener. Why: The browser reports each refused resource as an event. How: This records the directive broken, what it blocked, and the element it was on. // What: Type Assertion Note. Why: An event's target is typed as a plain event target. How: A violation's target is the element or document it happened on, so this reads it as an element, falling back for the document.


	} );


}

// #endregion polSetFun



// #region polVioFun

/**
 * polVioFun = Policy Violation Function
 *
 * @summary
 * Reads back the violations the listener polSetFun adds has recorded on the
 * page so far, one line each naming the directive broken and what broke it.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param curPagObj - Current Page Object: The page to read.
 *
 * @returns A promise that resolves with the list of violations recorded.
 *
 * @example
 * ```ts
 * polVioFun(page) // => []
 * ```
 *
*/

async function polVioFun ( curPagObj : Page ) : Promise< string[] > {


	return curPagObj.evaluate( () => ( window as unknown as { __polVioArr : string[] } ).__polVioArr ); // What: Violation List Return. Why: The test reads what the browser reported. How: This hands back the page's list. // What: Type Assertion Note. Why: The window has no such field in its type. How: The as names the one polSetFun's listener adds.


}

// #endregion polVioFun

// #endregion Helpers



// #region Module Init

test( 'the policy refuses an injected inline script', async ( { page : curPagObj } ) => { // What: Policy Live Test. Why: A clean run means nothing unless the policy was really applied and its violations really recorded. How: This loads the home page under the policy, injects an inline script, and checks it didn't run and was reported.


	await polSetFun( curPagObj ); // What: Policy Setup Call. Why: The page has to load under the policy. How: This adds the headers and the violation listener.

	await curPagObj.goto( '/' ); // What: Home Open Call. Why: The script is injected into a real page. How: This loads the home page.


	const injRanBoo = await curPagObj.evaluate( async () => { // What: Injection Ran Boolean. Why: A refused script never sets its flag. How: This adds an inline script that sets a flag, waits a moment for any violation event, and reports whether the flag was set.


		const scrNewEle = document.createElement( 'script' ); // What: Script New Element. Why: Injected markup is how a cross-site scripting attack runs code. How: This makes an inline script.


		scrNewEle.textContent = 'document.documentElement.dataset.injectedScriptRan = "true";'; // What: Script Text Assignment. Why: The flag shows whether the script ran. How: This sets a data attribute on the page's root if it does.


		document.body.append( scrNewEle ); // What: Script Append Call. Why: An inline script runs as soon as it joins the page, unless the policy refuses it. How: This adds it to the body.

		await new Promise( ( resWaiFun ) => setTimeout( resWaiFun, 100 ) ); // What: Event Wait Call. Why: The browser reports a violation as an event shortly after refusing the script. How: This waits 100ms for it.



		return document.documentElement.dataset.injectedScriptRan === 'true'; // What: Flag Return. Why: The test checks the script stayed off. How: This reports whether it set its flag.


	} );


	expect( injRanBoo ).toBe( false );                                                                // What: Script Refused Assertion. Why: The policy has to stop inline script. How: This checks the injected script never ran.
	expect( await polVioFun( curPagObj ) ).toContainEqual( expect.stringContaining( 'script-src' ) ); // What: Violation Reported Assertion. Why: The later checks rely on violations being recorded. How: This checks the refusal was recorded as a script-src violation.


} );



for ( const staRecObj of STA_REC_ARR ) { // What: State Loop. Why: Every state the suites visit has to work under the policy. How: This declares one test per state.


	test( `${ staRecObj.ideStr } breaks no rule of the security policy and closes off every new tab link`, async ( { browserName : broNamStr, page : curPagObj } ) => { // What: State Policy Test. Why: A blocked resource, such as a font, would break the page once deployed, and the policy can't be loosened to hide it. How: This opens the state under the policy and checks nothing was refused and every new tab link is closed off.


		await polSetFun( curPagObj ); // What: Policy Setup Call. Why: The page has to load under the policy. How: This adds the headers and the violation listener.

		await opeStaFun( curPagObj, staRecObj ); // What: State Open Call. Why: Scrolling through the page and opening the menu load what the state uses, such as its lazy photos. How: This opens the state the way the other page suites do.


		const opeRelArr = await curPagObj.locator( 'a[target="_blank"]' ).evaluateAll( ( ancEleArr ) => ancEleArr.map( ( ancCurEle ) => ancCurEle.getAttribute( 'rel' ) ?? '' ) ); // What: Opener Rel Array. Why: A new tab opened without noopener can reach back and change this page. How: This collects the rel of every link that opens a new tab.
		const vioLisArr = ( await polVioFun( curPagObj ) ).filter( ( vioCurStr ) => !( broNamStr === 'webkit' && vioCurStr === 'style-src-attr blocked inline on select' ) );      // What: Violation List Array. Why: WebKit reports a style attribute violation for every select element, even one built in a blank script with no style of its own, which no page can avoid short of allowing inline style attributes everywhere. How: This keeps every violation but that one WebKit select report.


		expect( vioLisArr ).toEqual( [] );                                                                // What: No Violation Assertion. Why: Everything the state loads should be allowed by the policy. How: This checks none was refused.
		expect( opeRelArr.filter( ( relValStr ) => !/\bnoopener\b/.test( relValStr ) ) ).toEqual( [] );   // What: No Opener Assertion. Why: The opened page shouldn't get a handle on this one. How: This checks every new tab link carries noopener.
		expect( opeRelArr.filter( ( relValStr ) => !/\bnoreferrer\b/.test( relValStr ) ) ).toEqual( [] ); // What: No Referrer Assertion. Why: The opened site shouldn't learn the address it came from. How: This checks every new tab link carries noreferrer.


	} );


}



for ( const [ staCodNum, notTexStr, resDesStr ] of [ [ 200, 'Your message was sent', 'sent' ], [ 500, "didn't go through", 'failed' ] ] as const ) { // What: Form Result Loop. Why: The form's post and its notes are states no page load reaches, and they have to work under the policy too. How: This declares one test per answer, pairing Netlify's status with words only that note shows and a name for the title. // What: Type Assertion Note. Why: Without it each row widens to a mixed array, so the destructured names lose their literal types. How: as const keeps each row a readonly tuple, so each name is typed by its position.


	test( `a ${ resDesStr } message breaks no rule of the security policy`, async ( { browserName : broNamStr, page : curPagObj } ) => { // What: Form Result Policy Test. Why: Sending the form posts to the site and shows a note with motion of its own, which would break once deployed if the policy refused any of it. How: This sends the form under the policy against the faked answer and checks nothing was refused.


		await polSetFun( curPagObj ); // What: Policy Setup Call. Why: The page has to load under the policy. How: This adds the headers and the violation listener.

		await fakNetFun( curPagObj, staCodNum ); // What: Netlify Fake Call. Why: The note depends on Netlify's answer, and no real message should go out. How: This answers the form's post with the loop's status, tried before the headers route and handing every other request on to it.

		await curPagObj.goto( '/' ); // What: Home Open Call. Why: The form lives in the Contact section. How: This loads the home page under the policy.

		await curPagObj.locator( '#contact form' ).getByLabel( 'Your Name' ).fill( 'Test Visitor' );                 // What: Name Fill Call. Why: The name is required. How: This types a name.
		await curPagObj.locator( '#contact form' ).getByLabel( 'Email' ).fill( 'visitor@test.example' );             // What: Email Fill Call. Why: The email is required. How: This types an address on the reserved .example domain. // What: Contact Form Scope. Why: index.html's hidden copy of the form, which Netlify reads, labels its email and message fields the same way. How: Each field is looked up inside the Contact section's form.
		await curPagObj.locator( '#contact form' ).getByLabel( 'Message', { exact : true } ).fill( 'Hello, Tony!' ); // What: Message Fill Call. Why: The message is required. How: This types a short one, matching the label exactly, since the "Send Message" button's own label holds the word too. // What: Contact Form Scope. Why: index.html's hidden copy of the form, which Netlify reads, labels its email and message fields the same way. How: Each field is looked up inside the Contact section's form.

		await curPagObj.getByRole( 'button', { name : 'Send Message' } ).click(); // What: Send Click Call. Why: The post and the note are what's checked. How: This sends the message, which the fake answers.

		await expect( curPagObj.locator( '#contact form' ) ).toContainText( notTexStr ); // What: Note Shown Assertion. Why: The check has to see the note that answered. How: This waits for its words.


		const vioLisArr = ( await polVioFun( curPagObj ) ).filter( ( vioCurStr ) => !( broNamStr === 'webkit' && vioCurStr === 'style-src-attr blocked inline on select' ) ); // What: Violation List Array. Why: WebKit reports a style attribute violation for every select element, as the state test notes. How: This keeps every violation but that one WebKit select report.


		expect( vioLisArr ).toEqual( [] ); // What: No Violation Assertion. Why: Sending and its note should be allowed by the policy. How: This checks nothing was refused.


	} );


}

// #endregion Module Init


