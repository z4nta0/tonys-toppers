


/**
 * rhythm.ts = Rhythm
 *
 * @summary
 * The design scale for JavaScript: any length token's size in pixels, read
 * from the page itself, for a distance JavaScript works out that has to clear
 * something the stylesheet sizes, such as the space below the fixed bar.
 * Adapted from seal-and-shield's own.
 *
 * Sections:
 *  - Helpers
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Helpers

// #region tokPxlFun

/**
 * tokPxlFun = Token Pixel Function
 *
 * @summary
 * A length token's size in pixels, as the page itself resolves it. A custom
 * property read from a computed style comes back as its unresolved text, so
 * this sizes a hidden probe element by the token, reads the height the
 * browser gives it, and removes the probe again. It follows any root font
 * size a visitor sets, the same as the stylesheet does.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param tokNamStr - Token Name String: The length token's name, with its
 *                    leading dashes, e.g. '--nav-bar-hei'.
 *
 * @returns The token's size in pixels.
 * @see {@link tokHeiNum}
 *
 * @example
 * ```ts
 * tokPxlFun('--nav-bar-hei') // => about 83.483
 * ```
 *
*/

const tokPxlFun = ( tokNamStr : string ) : number => { // What: Token Pixel Function. Why: A distance in JavaScript should read the same token the stylesheet sizes the thing it clears with. How: This resolves the token through a hidden probe's height.


	const proCurEle = document.createElement( 'div' ); // What: Probe Current Element. Why: The probe's height is read from its laid-out box, so it has to be in the page. How: This creates an empty div to size by the token.


	proCurEle.style.cssText = `height : var( ${ tokNamStr } ); position : absolute; visibility : hidden;`; // What: Probe Style Text. Why: The probe takes the token as its height without showing or moving anything. How: This sets the height from the token, takes the probe out of the flow, and hides it.


	document.body.appendChild( proCurEle ); // What: Probe Attach Call. Why: The browser resolves the token only once the probe is in the page. How: This adds it to the body.


	const tokHeiNum = proCurEle.getBoundingClientRect().height; // What: Token Height Number. Why: The probe's height is the token's size in pixels. How: This reads the height the browser laid out.


	proCurEle.remove(); // What: Probe Removal Call. Why: The probe was only there to be measured. How: This takes it back out of the page.



	return tokHeiNum; // What: Token Height Number Return. Why: The caller works in pixels. How: This hands back the probe's measured height.


};

// #endregion tokPxlFun

// #endregion Helpers



// #region Exports

export { tokPxlFun }; // What: Named Export. Why: JavaScript that needs the size of a length token reads it here rather than as a free-standing literal. How: This exports tokPxlFun.

// #endregion Exports


