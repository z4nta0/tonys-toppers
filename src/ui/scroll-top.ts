


// #region Imports

import { useLayoutEffect   } from 'react';        // What: Use Layout Effect. Why: The page has to move before the browser draws the new route, or the old position would flash first. How: This runs the scroll right after React commits the new page.
import { useLocation       } from 'react-router'; // What: Use Location. Why: The scroll should happen on every navigation, even back to the page already showing. How: Its key changes on each one, and its hash and state say when to leave the scroll alone.
import { useNavigationType } from 'react-router'; // What: Use Navigation Type. Why: Back and forward should return to where the visitor was, not the top. How: This reports a POP for those, which the scroll skips.

// #endregion Imports



/**
 * scroll-top.ts = Scroll To Top
 *
 * @summary
 * A client-side router swaps pages without loading a new document, so the
 * browser never resets the scroll position the way a real page load does: a
 * link clicked at the bottom of one page opens the next one scrolled just as
 * far down. This file holds the hook the app root calls to put every
 * link-driven navigation back at the top, while leaving back and forward to
 * the browser's own restoring, and a section's hash to the home page, which
 * jumps to the section once its fonts have loaded and then clears the hash.
 * Adapted from the-bernie-bears' own.
 *
 * Sections:
 *  - Hooks
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Hooks

// #region useScrTopFun

/**
 * useScrTopFun = Use Scroll Top Function
 *
 * @summary
 * Scrolls the window to the top after every navigation a link or a redirect
 * makes, including a link to the page already showing, before the new page
 * is drawn. Three navigations are left alone: back and forward (a POP), so
 * the browser can return the visitor to where they were; one whose address
 * carries a hash, since the home page jumps to that section itself; and the
 * replace that only clears that hash afterwards, which the home page marks
 * with a cleBoo flag in its router state. The jump to the top is instant
 * whatever the stylesheet's scroll-behavior says, since a smooth scroll down
 * a whole page reads as motion rather than as arriving on a new page. Call it
 * once, in a component inside the router that stays mounted across routes.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param void - This function takes no parameters.
 *
 * @returns This function does not return anything.
 *
 * @example
 * ```ts
 * useScrTopFun() // => void
 * ```
 *
*/

function useScrTopFun () : void {


	const locCurObj = useLocation();       // What: Location Current Object. Why: Each navigation needs telling apart, and its hash and state say when to leave the scroll alone. How: This holds the current address, whose key changes on every navigation.
	const navTypStr = useNavigationType(); // What: Navigation Type String. Why: Back and forward should keep the browser's restored position. How: This holds PUSH, REPLACE, or POP for the latest navigation.


	useLayoutEffect( () => { // What: Scroll Reset Effect. Why: A new page should open at its top. How: This runs after each navigation commits and before the browser paints it.


		const cleHasBoo = ( locCurObj.state as { cleBoo? : boolean } | null )?.cleBoo === true; // What: Clear Hash Boolean. Why: The home page clears a section's hash with a replace of its own, which must keep the visitor on the section it just jumped to. How: This reads the flag the home page puts in that navigation's state. // What: Type Assertion Note. Why: The router types a location's state as unknown. How: The only state this site ever sets is the home page's cleBoo flag, so this reads it as that object or null.
		const popNavBoo = navTypStr === 'POP';                                                  // What: Pop Navigation Boolean. Why: The browser restores the visitor's earlier position on back and forward. How: This checks the navigation was one of those.
		const secHasBoo = locCurObj.hash !== '';                                                // What: Section Hash Boolean. Why: An address like /#contact names a section the home page jumps to itself, once its fonts have loaded. How: This checks the address carries a hash.

		const kepPosBoo = cleHasBoo || popNavBoo || secHasBoo; // What: Kept Position Boolean. Why: These navigations already land where they should. How: This combines them.


		if ( kepPosBoo ) return; // What: Kept Position Guard. Why: The scroll belongs to the browser or the home page here. How: This leaves it alone.



		window.scrollTo( { behavior : 'instant', left : 0, top : 0 } ); // What: Window Top Scroll Call. Why: Every other navigation should open the new page at its top. How: This jumps there at once, overriding the stylesheet's smooth scroll-behavior.


	}, [ locCurObj.key, locCurObj.hash, locCurObj.state, navTypStr ] ); // What: Effect Dependency Array. Why: The scroll must run once per navigation. How: locCurObj.key changes on every navigation, even to the same address, locCurObj.hash and locCurObj.state say whether the home page is handling the position, and navTypStr says whether the browser is restoring one.


}

// #endregion useScrTopFun

// #endregion Hooks



// #region Exports

export { useScrTopFun }; // What: Named Export. Why: The app root calls the hook once. How: This exports useScrTopFun.

// #endregion Exports


