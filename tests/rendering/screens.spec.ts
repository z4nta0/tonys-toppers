


// #region Imports

import { expect      } from '@playwright/test';     // What: Expect. Why: Each state passes only when it matches its approved screenshot. How: This compares the page with its baseline.
import { opeStaFun   } from '../support/states.ts'; // What: Open State Function. Why: Each state is captured settled. How: This loads it and waits for it.
import { STA_RCD_ARR } from '../support/states.ts'; // What: State Record Array. Why: Every page state gets a baseline. How: This lists them.
import { test        } from '@playwright/test';     // What: Test. Why: Each state is its own comparison. How: This declares them.

// #endregion Imports



/**
 * screens.spec.ts = Screens Spec
 *
 * @summary
 * Compares a full-page screenshot of every page state with its approved
 * baseline, in whichever engine the project runs, so a change that shifts the
 * layout or the styling anywhere on a page fails until it's looked at. Each
 * state opens under reduced motion and is captured with animations stopped, so
 * it's always caught at rest, and with the page's clock fixed to one date,
 * since the footer's copyright year and Tony's age in the About section both
 * come from the current year and would otherwise fail the baselines every
 * January. The product photos are masked, since WebKit redraws the 64
 * full-size photos differently from one full-page capture to the next, while
 * their masks still show where each one sits. The hero's two blurred blobs
 * have their floating animation switched off before the capture, since WebKit
 * redraws their blur differently each time a capture pauses and resumes them;
 * either way, the page never held still long enough to compare. Baselines live
 * in tests/rendering/baselines, one per state and engine, captured on Linux;
 * another system's font rendering would differ, so baselines are refreshed on
 * the machine that runs the suite. When a change is meant to alter how a page
 * looks, review the failing diff in the report, then refresh the baselines
 * with npm run test:rendering -- --update-snapshots and commit them with the
 * change.
 *
 * Sections:
 *  - Constants
 *  - Module Init
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

const FIX_TIM_STR = '2026-10-10T12:00:00'; // What: Fixed Time String. Why: The copyright year and Tony's age are worked out from today's date, so the baselines would stop matching once the year turned over. How: This is the date and time every capture's page clock reads.



const MAX_DIF_NUM = 0; // What: Maximum Difference Number. Why: Each engine renders a state identically from run to run on the machine that captured its baseline, and even a small tolerance can hide a real change, as it hid reese-roofing's nav links moving. How: This fails a comparison when even one pixel differs, with PIX_THR_NUM deciding what counts as differing.
const PIX_THR_NUM = 0; // What: Pixel Threshold Number. Why: Playwright otherwise treats a pixel whose color moved by less than 0.2 of its color space as unchanged, which let a contrast fix's slightly darker text pass as identical in seal-and-shield. How: This counts any change to a pixel's color at all as a difference.

// #endregion Constants



// #region Module Init

for ( const staRcdObj of STA_RCD_ARR ) { // What: State Test Loop. Why: Every page state has a baseline. How: This declares one comparison per state.


	test( `${ staRcdObj.ideStr } matches its approved screenshot`, async ( { page : curPagObj } ) => { // What: Screenshot Test. Why: A page should only change how it looks on purpose. How: This opens the state at rest and compares it with its baseline.


		await curPagObj.clock.setFixedTime( new Date( FIX_TIM_STR ) ); // What: Fixed Clock Call. Why: The page's year-based text has to read the same in every run. How: This makes the page's Date always return the fixed time, while its timers keep running normally.

		await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Emulation. Why: Entrance animations would otherwise be caught partway. How: This makes the page match prefers-reduced-motion, which turns them off.

		await opeStaFun( curPagObj, staRcdObj ); // What: State Open Call. Why: The state is captured settled. How: This loads and settles it.

		await curPagObj.addStyleTag( { content : '#home > div:nth-child(-n+2) { animation : none; }' } ); // What: Blob Animation Stop Call. Why: The hero's two blurred blobs float forever, and WebKit redraws their blur differently each time a capture pauses and resumes them, so the page never held still. How: This switches off the animation on the hero section's first two divs, its blobs, found by position until they get their own hook, leaving them where they rest, which is what reduced motion support will do on its own once the site has it.


		await expect( curPagObj ).toHaveScreenshot( `${ staRcdObj.ideStr }.png`, { // What: Baseline Comparison Assertion. Why: The state should look exactly as approved. How: This captures the whole page with animations stopped and the product photos masked, and compares it with the state's baseline pixel for pixel, color for color.


			animations        : 'disabled',                             // What: Animations. Why: A looping animation would never hold still for the capture. How: This stops every animation at its start.
			fullPage          : true,                                   // What: Full Page. Why: The whole state has to match, not just the first screen. How: This captures the page's full height.
			mask              : [ curPagObj.locator( 'article img' ) ], // What: Mask. Why: WebKit draws the full-size product photos differently on each full-page capture, so the page never held still. How: This covers every photo inside a product card with a solid box, found by tag until the photos get their own hook.
			maxDiffPixelRatio : MAX_DIF_NUM,                            // What: Maximum Diff Pixel Ratio. Why: No pixel may differ from the baseline. How: This reads the suite's zero tolerance.
			threshold         : PIX_THR_NUM                             // What: Threshold. Why: Even a slight color change should fail. How: This reads the suite's zero per-pixel threshold.


		} );


	} );


}

// #endregion Module Init


