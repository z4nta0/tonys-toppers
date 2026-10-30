


// #region Imports

import { expect    } from '@playwright/test';     // What: Expect. Why: Each width passes only when its layout holds together. How: This asserts each problem list is empty.
import { opeStaFun } from '../support/states.ts'; // What: Open State Function. Why: Each width is measured settled. How: This loads the page and waits for it.
import { test      } from '@playwright/test';     // What: Test. Why: Each page at each width is its own test. How: This declares them.

// #endregion Imports



/**
 * layout.spec.ts = Layout Spec
 *
 * @summary
 * Measures the home page and the 404 page across a range of screen widths, and
 * the open mobile menu at the widths up to the site's 900px breakpoint, where
 * it exists, in whichever engine the project runs, and fails a width whose
 * layout breaks: the page scrolling sideways, a visible element reaching past
 * either edge of the screen (unless an ancestor clips it on purpose), text
 * spilling out of its own box, two controls a visitor can reach overlapping
 * each other, or a card grid leaving uneven rows. The widths run from 320px,
 * WCAG's narrowest reflow width, to 1,920px, and include each of the site's
 * breakpoints and the pixel past it, where a layout switches and is most
 * likely to crowd. The home page is also measured with each Products filter
 * chosen, at a few widths, since the grid's card count changes with its
 * filter. Pages open under reduced motion, which changes nothing about the
 * layout but skips the wait for entrance animations.
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

type LayCasTyp = { // What: Layout Case Type. Why: Each test measures one page in one state. How: This names the case, its path, and whether it opens the menu.


	ideStr : string,  // What: Identifier String. Why: Each test names the case it measures. How: This becomes part of the test title.
	menBoo : boolean, // What: Menu Boolean. Why: The open menu is measured as its own case. How: This is true when the case opens it.
	patStr : string   // What: Path String. Why: Each case opens one route. How: This is the path loaded from the dev server.


};

const LAY_CAS_ARR : LayCasTyp[] = [ // What: Layout Case Array. Why: The page and the open menu are measured the same way. How: Each row names a case, its path, and whether it opens the menu.


	{ ideStr : 'home',      menBoo : false, patStr : '/'        }, // What: Home Case. Why: The home page holds the site's main layout. How: This measures it as loaded.
	{ ideStr : 'not-found', menBoo : false, patStr : '/missing' }, // What: Not Found Case. Why: The 404 page has its own centered layout. How: This measures an address the site doesn't have, closed.
	{ ideStr : 'menu',      menBoo : true,  patStr : '/'        }  // What: Menu Case. Why: The open menu stacks the section links its own way. How: This measures the home page with the menu open.


];

const FIL_WID_ARR = [ 390, 1000, 1440 ];                                                                 // What: Filter Width Array. Why: The Products filters change the grid's card count, so each one is measured at a phone, tablet, and desktop width. How: This lists those widths.
const MEN_MAX_NUM = 900;                                                                                 // What: Menu Maximum Number. Why: The mobile menu exists only up to the site's 900px breakpoint. How: The menu case is measured only at widths up to this.
const WID_LIS_ARR = [ 320, 360, 361, 390, 414, 480, 768, 900, 901, 1000, 1001, 1024, 1280, 1440, 1920 ]; // What: Width List Array. Why: Layouts crowd at the narrowest widths and switch at the breakpoints. How: This lists common screen widths, such as 768px for a tablet, plus each of the site's breakpoints and the pixel past it.

// #endregion Constants



// #region Helpers

// #region layProFun

/**
 * layProFun = Layout Problems Function
 *
 * @summary
 * Runs inside the page and returns every layout problem it finds, each naming
 * the element by its tag and its first class (just the readable part, once
 * that class comes from a hashed CSS module). The page scrolling sideways is
 * one problem. A visible element counts as spilling past an edge when it
 * reaches more than a pixel beyond the viewport and no ancestor clips its
 * overflow. An element with text of its own spills its box when a line of that
 * text runs more than a pixel past either inner edge and it doesn't clip or
 * scroll its content; a decoration drawn past the text on purpose, such as the
 * hero's highlight bar, doesn't count, and inline elements are skipped, since
 * they have no box width of their own. Two reachable controls (links and
 * buttons that are visible, in the tab order, and not inside inert content)
 * overlap when their boxes share more than a pixel of area and neither holds
 * the other. A grid (an element displayed as a grid, with two or more visible
 * children in its flow) leaves uneven rows when its rows hold different
 * counts, unless the last row is a single child centered in the grid at the
 * others' width, as the Card Grids rule allows, or, in the Products grid,
 * whose card count changes with its filter, any leftover cards centered
 * together at the others' width. A grid's children are grouped into rows by
 * where they overlap vertically, so cards of different heights still share a
 * row however the grid aligns them, and the rows are read top to bottom.
 * Passed to Playwright's evaluate, so it can't read anything from this file.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param void - This function takes no parameters.
 *
 * @returns Every layout problem found.
 * @see {@link proLisArr}
 *
 * @example
 * ```ts
 * page.evaluate(layProFun) // => [ 'a.navBraAnc overlaps button.navTogBut' ]
 * ```
 *
*/

function layProFun () : string[] {


	const proLisArr : string[] = []; // What: Problem List Array. Why: Every problem should be reported, not just the first. How: This collects them.

	const vieWidNum = document.documentElement.clientWidth; // What: Viewport Width Number. Why: Edges and sideways scrolling are measured against the visible width. How: This reads the root's width without its scrollbar.



	const desEleFun = ( desCurEle : Element ) => `${ desCurEle.tagName.toLowerCase() }${ desCurEle.classList.length ? '.' + ( desCurEle.classList[ 0 ].split( '_' )[ 1 ] || desCurEle.classList[ 0 ] ) : '' }`; // What: Describe Element Function. Why: A problem should name the element in terms of the source. How: This joins the tag with its first class, keeping only the readable part when it's a hashed module class.



	const cliAncFun = ( cliCurEle : Element ) => { // What: Clipped Ancestor Function. Why: An element an ancestor clips can reach past the edge without showing there. How: This reports whether any ancestor hides, clips, or scrolls its overflow.


		for ( let ancCurEle = cliCurEle.parentElement; ancCurEle; ancCurEle = ancCurEle.parentElement ) if ( getComputedStyle( ancCurEle ).overflowX !== 'visible' ) return true; // What: Ancestor Overflow Loop. Why: Any clipping ancestor contains the element. How: This walks up the tree and returns as soon as one doesn't show its overflow.



		return false; // What: Unclipped Return. Why: No ancestor clips the element, so its spill would show. How: This reports that none was found.


	};



	const texSpiFun = ( texCurEle : Element ) => { // What: Text Spill Function. Why: Only the element's own text running out of its box is a spill, not a decoration drawn past it on purpose, such as the hero's highlight bar under its italic line. How: This measures every line of the element's own text and reports whether any runs more than a pixel past either inner edge of its box.


		const boxRecObj = texCurEle.getBoundingClientRect();     // What: Box Rect Object. Why: The text is measured against the element's own box. How: This measures the box.
		const boxLefNum = boxRecObj.left + texCurEle.clientLeft; // What: Box Left Number. Why: Text may reach the padding but not the border. How: This is the inner left edge, just inside the left border.
		const boxRigNum = boxLefNum + texCurEle.clientWidth;     // What: Box Right Number. Why: Text may reach the padding but not the border. How: This is the inner right edge, the inner width past the left one.
		const ranTexObj = document.createRange();                // What: Range Text Object. Why: A range measures text by its lines rather than by the element's box. How: This creates one to point at each text node in turn.


		for ( const chiCurNod of texCurEle.childNodes ) { // What: Text Node Loop. Why: Only the element's own text counts, since each child element is measured on its own. How: This walks the element's direct children.


			if ( chiCurNod.nodeType !== Node.TEXT_NODE ) continue; // What: Text Node Guard. Why: Child elements aren't the element's own text. How: This skips anything that isn't a text node.



			ranTexObj.selectNodeContents( chiCurNod ); // What: Range Select Call. Why: The range has to cover this text node's lines. How: This points the range at the node's whole text.


			for ( const linRecObj of ranTexObj.getClientRects() ) if ( linRecObj.right > boxRigNum + 1 || linRecObj.left < boxLefNum - 1 ) return true; // What: Line Spill Loop. Why: Any one line past an inner edge is a spill. How: This checks each line's box and returns as soon as one runs more than a pixel past either edge.


		}



		return false; // What: No Spill Return. Why: Every line of the element's own text fits its box. How: This reports that none ran past an edge.


	};



	if ( document.documentElement.scrollWidth > vieWidNum ) proLisArr.push( `the page scrolls sideways by ${ ( document.documentElement.scrollWidth - vieWidNum ).toLocaleString( 'en-US' ) }px` ); // What: Sideways Scroll Check. Why: Nobody should have to scroll sideways to read the page. How: This records how far the page reaches past the visible width.



	for ( const layCurEle of document.body.querySelectorAll( '*' ) ) { // What: Element Loop. Why: Any element can spill. How: This measures each one in turn.


		const recCurObj = layCurEle.getBoundingClientRect(); // What: Rect Current Object. Why: Edges are judged from the element's box. How: This measures it.
		const styCurObj = getComputedStyle( layCurEle );     // What: Style Current Object. Why: Hidden and inline elements are judged differently. How: This reads its computed styles.

		const hidStyBoo = styCurObj.visibility !== 'visible'; // What: Hidden Style Boolean. Why: A hidden element doesn't show. How: This checks its computed visibility.
		const zerHeiBoo = !recCurObj.height;                  // What: Zero Height Boolean. Why: An element with no height takes no room. How: This checks its box has no height.
		const zerWidBoo = !recCurObj.width;                   // What: Zero Width Boolean. Why: An element with no width takes no room. How: This checks its box has no width.

		const invEleBoo = zerWidBoo || zerHeiBoo || hidStyBoo; // What: Invisible Element Boolean. Why: Any one of these means the element can't break the layout. How: This combines them.


		if ( invEleBoo ) continue; // What: Invisible Element Guard. Why: An element that takes no room or doesn't show can't break the layout. How: This skips it.



		const ancCliBoo = cliAncFun( layCurEle );          // What: Ancestor Clipped Boolean. Why: An element an ancestor clips doesn't show past the edge. How: This checks for a clipping ancestor.
		const lefSpiBoo = recCurObj.left < -1;             // What: Left Spill Boolean. Why: Content past the left edge is cut off. How: This checks the box starts more than a pixel before the viewport.
		const rigSpiBoo = recCurObj.right > vieWidNum + 1; // What: Right Spill Boolean. Why: Content past the right edge is cut off or forces sideways scrolling. How: This checks the box reaches more than a pixel beyond the viewport's right.

		const edgSpiBoo = ( rigSpiBoo || lefSpiBoo ) && !ancCliBoo; // What: Edge Spill Boolean. Why: Only an unclipped element past an edge breaks the layout. How: This combines them.


		if ( edgSpiBoo ) proLisArr.push( `${ desEleFun( layCurEle ) } spills past the ${ rigSpiBoo ? 'right' : 'left' } edge` ); // What: Edge Spill Check. Why: Content past the edge is cut off or forces sideways scrolling. How: This records an unclipped element that reaches more than a pixel beyond the viewport.



		const bloBoxBoo = styCurObj.display !== 'inline';                                                                                                // What: Block Box Boolean. Why: An inline element has no box width to compare with. How: This checks it isn't inline.
		const ownTexBoo = [ ...layCurEle.childNodes ].some( ( chiCurNod ) => chiCurNod.nodeType === Node.TEXT_NODE && !!chiCurNod.textContent?.trim() ); // What: Own Text Boolean. Why: Only an element holding text itself can spill it. How: This checks its direct children for text that isn't just whitespace.
		const spiBoxBoo = texSpiFun( layCurEle ); // What: Spill Box Boolean. Why: Text running past its box has spilled out of it. How: This checks whether any line of the element's own text runs past an inner edge.
		const visOveBoo = styCurObj.overflowX === 'visible';                                                                                             // What: Visible Overflow Boolean. Why: Content a box clips or scrolls on purpose isn't a spill. How: This checks the box shows its overflow.

		const texSpiBoo = ownTexBoo && spiBoxBoo && visOveBoo && bloBoxBoo; // What: Text Spill Boolean. Why: All four together mean text has spilled out of its box. How: This combines them.


		if ( texSpiBoo ) proLisArr.push( `${ desEleFun( layCurEle ) } spills its text past its box` ); // What: Text Spill Check. Why: Text outside its box overlaps its neighbors or gets cut off. How: This records the element.


	}



	const conEleArr = [ ...document.querySelectorAll( 'a, button' ) ].filter( ( conCurEle ) => { // What: Control Element Array. Why: Only controls a visitor can see and reach have to stay apart. How: This keeps every link and button that's visible, in the tab order, and outside inert content.


		const hasWidBoo = conCurEle.getBoundingClientRect().width > 0;            // What: Has Width Boolean. Why: A control with no width takes no room. How: This checks its box has width.
		const notIneBoo = !conCurEle.closest( '[inert]' );                        // What: Not Inert Boolean. Why: Controls inside inert content can't be reached. How: This checks no ancestor is inert.
		const tabOrdBoo = conCurEle.getAttribute( 'tabindex' ) !== '-1';          // What: Tab Order Boolean. Why: A control taken out of the tab order can't be reached. How: This checks it isn't tabindex -1.
		const visStyBoo = getComputedStyle( conCurEle ).visibility === 'visible'; // What: Visible Style Boolean. Why: A hidden control can't be seen. How: This checks its computed visibility.

		const reaConBoo = tabOrdBoo && notIneBoo && visStyBoo && hasWidBoo; // What: Reachable Control Boolean. Why: All four together mean a visitor can see and reach the control. How: This combines them.



		return reaConBoo; // What: Reachable Control Return. Why: The filter keeps only reachable controls. How: This keeps the control when it's reachable.


	} );



	conEleArr.forEach( ( oneCurEle, oneIndNum ) => conEleArr.slice( oneIndNum + 1 ).forEach( ( twoCurEle ) => { // What: Control Pair Loop. Why: Overlap is a property of two controls. How: This visits every pair once.


		const oneRecObj = oneCurEle.getBoundingClientRect();                                                         // What: One Rect Object. Why: The pair's overlap is measured from both boxes. How: This measures the first.
		const twoRecObj = twoCurEle.getBoundingClientRect();                                                         // What: Two Rect Object. Why: The pair's overlap is measured from both boxes. How: This measures the second.
		const oveWidNum = Math.min( oneRecObj.right, twoRecObj.right ) - Math.max( oneRecObj.left, twoRecObj.left ); // What: Overlap Width Number. Why: Two boxes overlap only where both their spans cross. How: This measures how far their horizontal spans cross.
		const oveHeiNum = Math.min( oneRecObj.bottom, twoRecObj.bottom ) - Math.max( oneRecObj.top, twoRecObj.top ); // What: Overlap Height Number. Why: Two boxes overlap only where both their spans cross. How: This measures how far their vertical spans cross.

		const areOveBoo = oveWidNum * oveHeiNum > 1;                                            // What: Area Overlap Boolean. Why: A shared edge or corner isn't a real overlap. How: This checks they share more than a pixel of area.
		const heiOveBoo = oveHeiNum > 0;                                                        // What: Height Overlap Boolean. Why: Boxes overlap only where their vertical spans cross. How: This checks they do.
		const sepConBoo = !oneCurEle.contains( twoCurEle ) && !twoCurEle.contains( oneCurEle ); // What: Separate Control Boolean. Why: A control inside another overlaps it by design. How: This checks that neither holds the other.
		const widOveBoo = oveWidNum > 0;                                                        // What: Width Overlap Boolean. Why: Boxes overlap only where their horizontal spans cross. How: This checks they do.

		const conOveBoo = widOveBoo && heiOveBoo && areOveBoo && sepConBoo; // What: Control Overlap Boolean. Why: All four together mean two separate controls cover each other. How: This combines them.


		if ( conOveBoo ) proLisArr.push( `${ desEleFun( oneCurEle ) } overlaps ${ desEleFun( twoCurEle ) }` ); // What: Overlap Check. Why: Overlapping controls are hard to read and to tap. How: This records a pair sharing more than a pixel of area.


	} ) );



	for ( const griCurEle of document.body.querySelectorAll( '*' ) ) { // What: Card Grid Loop. Why: A grid of cards should hold the same number of cards in every row at every width. How: This checks each grid with two or more visible children in its flow.


		const carEleArr = [ ...griCurEle.children ].filter( ( carCurEle ) => carCurEle.getBoundingClientRect().width > 0 && !/^(absolute|fixed)$/.test( getComputedStyle( carCurEle ).position ) ); // What: Card Element Array. Why: Only children on screen and in the grid's flow make up its rows. How: This keeps the children that take up room and aren't positioned out of the flow.
		const carCouBoo = carEleArr.length >= 1;                                               // What: Card Count Boolean. Why: A grid showing no child has nothing to measure, while a filter can leave the Products grid a single card. How: This is true when at least one child shows.
		const griDisBoo = /^(inline-)?grid$/.test( getComputedStyle( griCurEle ).display );    // What: Grid Display Boolean. Why: Only a grid lays its children out in rows of columns. How: This is true when the element displays as a grid.
		const proGriBoo = ( griCurEle.getAttribute( 'class' ) ?? '' ).includes( 'proGriDiv' ); // What: Products Grid Boolean. Why: The Products grid's card count changes with its filter, so its last row may center several leftover cards rather than one. How: This is true for the Products grid, found by its module class attribute, which also reads safely on an SVG element, whose className isn't a string.


		if ( !( griDisBoo && carCouBoo ) ) continue; // What: Not A Card Grid Guard. Why: Only a grid with a child showing can be held to even rows. How: This skips anything else.



		const rowLisArr : DOMRect[][] = []; // What: Row List Array. Why: The cards are grouped into the rows they sit in. How: This collects each row as a list of its cards' boxes.


		for ( const carCurEle of carEleArr ) { // What: Card Row Loop. Why: Each card belongs to the row it shares height with, whatever its own height or how the grid aligns it. How: This adds each card to the first row it overlaps vertically, or starts a new row.


			const carRecObj = carCurEle.getBoundingClientRect(); // What: Card Rect Object. Why: A card's row is judged from its box. How: This measures it.
			const rowCurArr = rowLisArr.find( ( rowFinArr ) => rowFinArr.some( ( rowRecObj ) => carRecObj.top < rowRecObj.bottom - 1 && carRecObj.bottom > rowRecObj.top + 1 ) ); // What: Row Current Array. Why: Cards in one row overlap vertically even when their heights differ. How: This finds the first row holding a card whose vertical span crosses this card's by more than a pixel.


			if ( rowCurArr ) rowCurArr.push( carRecObj ); // What: Row Join Call. Why: The card sits in a row already found. How: This adds its box to that row.

			else rowLisArr.push( [ carRecObj ] ); // What: Row Start Call. Why: The card shares height with no row found so far. How: This starts a new row holding only its box.


		}



		rowLisArr.sort( ( rowOneArr, rowTwoArr ) => rowOneArr[ 0 ].top - rowTwoArr[ 0 ].top ); // What: Row Sort Call. Why: The grid's order can differ from its markup's, since a child can move with the CSS order property. How: This sorts the rows top to bottom by their first card's top edge.


		const colTraArr = getComputedStyle( griCurEle ).gridTemplateColumns.split( ' ' ); // What: Column Track Array. Why: Leftover cards in the Products grid keep its track width and sit centered even when they fill less than one row. How: This lists the column tracks the grid laid out, each as its resolved width.
		const firRecObj = rowLisArr[ 0 ][ 0 ];                                            // What: First Rect Object. Why: Leftover cards have to keep the width the other cards share. How: This takes a card from the top row.
		const griRecObj = griCurEle.getBoundingClientRect();                              // What: Grid Rect Object. Why: Leftover cards are judged against the grid's center. How: This measures the grid.
		const lasRowArr = rowLisArr[ rowLisArr.length - 1 ];                              // What: Last Row Array. Why: The last row holds the cards that can be left over. How: This takes the bottom row's boxes.
		const rowCouArr = rowLisArr.map( ( rowCurArr ) => rowCurArr.length );             // What: Row Count Array. Why: The rows are compared by their card counts. How: This lists them top to bottom.

		const lasLefNum = Math.min( ...lasRowArr.map( ( lasRecObj ) => lasRecObj.left ) );  // What: Last Left Number. Why: The leftover cards are centered as a group. How: This finds the group's left edge.
		const lasRigNum = Math.max( ...lasRowArr.map( ( lasRecObj ) => lasRecObj.right ) ); // What: Last Right Number. Why: The leftover cards are centered as a group. How: This finds the group's right edge.

		const cenLasBoo = Math.abs( ( lasLefNum + lasRigNum ) / 2 - ( griRecObj.left + griRecObj.right ) / 2 ) <= 1;           // What: Centered Last Boolean. Why: Leftover cards have to sit centered under the rows above them. How: This is true when the group's center is within a pixel of the grid's.
		const lasShoBoo = rowCouArr[ rowCouArr.length - 1 ] !== rowCouArr[ 0 ];                                                // What: Last Short Boolean. Why: A last row unlike the first leaves the grid uneven. How: This compares the last row's count with the first's.
		const lonLasBoo = rowCouArr[ rowCouArr.length - 1 ] === 1;                                                             // What: Lone Last Boolean. Why: Only a single leftover card may sit in a row of its own. How: This is true when the last row holds one card.
		const proShoBoo = proGriBoo && lasRowArr.length < colTraArr.length;                                                    // What: Products Short Boolean. Why: The Products grid's last row can hold fewer cards than its columns even when it's the only row. How: This is true when the last row leaves a column empty.
		const samWidBoo = lasRowArr.every( ( lasRecObj ) => Math.abs( lasRecObj.width - firRecObj.width ) <= 1 );              // What: Same Width Boolean. Why: Leftover cards keep the others' width, never stretched across their row. How: This is true when each one's width is within a pixel of a top row card's.
		const traWidBoo = lasRowArr.every( ( lasRecObj ) => Math.abs( lasRecObj.width - parseFloat( colTraArr[ 0 ] ) ) <= 1 ); // What: Track Width Boolean. Why: A leftover card keeps the grid's track width rather than stretching, which a single row can't show by comparing with itself. How: This is true when each card in the last row is within 1px of the first track.
		const uneRowBoo = rowCouArr.slice( 0, -1 ).some( ( rowCouNum ) => rowCouNum !== rowCouArr[ 0 ] );                      // What: Uneven Rows Boolean. Why: Every row above the last should match the first. How: This is true when any of them differs.

		const cenOddBoo = cenLasBoo && ( lonLasBoo || proGriBoo ) && samWidBoo; // What: Centered Odd Boolean. Why: The Card Grids rule allows one leftover card, or in a filtered grid any leftover cards, sitting centered in their own row at the others' width. How: This combines the checks.
		const proCenBoo = cenLasBoo && traWidBoo;                               // What: Products Centered Boolean. Why: The Products grid's leftover cards have to sit centered at its track width, however many rows it has. How: This combines the two checks.

		const shoRowBoo = uneRowBoo || ( lasShoBoo && !cenOddBoo ) || ( proShoBoo && !proCenBoo ); // What: Short Row Boolean. Why: Uneven rows, a short last row that isn't centered at the others' width, or Products cards that leave a column empty without sitting centered at the track width, break the Card Grids rule. How: This combines them.


		if ( shoRowBoo ) proLisArr.push( `${ desEleFun( griCurEle ) } leaves uneven rows (${ rowCouArr.join( ', ' ) })` ); // What: Card Row Check. Why: Every row of a card grid should hold the same number of cards. How: This records a grid with uneven rows, listing each row's count.


	}



	return proLisArr; // What: Problem List Return. Why: The test prints whatever was found. How: This hands back every problem collected.


}

// #endregion layProFun

// #endregion Helpers



// #region Module Init

for ( const layCasObj of LAY_CAS_ARR ) { // What: Case Loop. Why: The page and the open menu are measured. How: This declares each case's tests.


	for ( const widCurNum of WID_LIS_ARR.filter( ( widFilNum ) => !layCasObj.menBoo || widFilNum <= MEN_MAX_NUM ) ) { // What: Width Loop. Why: Each case is measured at every width it exists at. How: This declares one test per width, skipping menu widths past the breakpoint.


		test( `${ layCasObj.ideStr } holds its layout at ${ widCurNum.toLocaleString( 'en-US' ) }px`, async ( { page : curPagObj } ) => { // What: Layout Test. Why: The layout should hold together at every width. How: This opens the case at the width and checks it finds no layout problems.


			await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Emulation. Why: Entrance animations don't change the layout, so waiting on them only slows the run. How: This makes the page match prefers-reduced-motion, which turns them off.

			await opeStaFun( curPagObj, { // What: Case Open Call. Why: The layout is measured settled. How: This opens the case's path at the width, opening the menu first for the menu case.


				heiNum : 900,              // What: Height Number. Why: Only the width changes this layout. How: Every case is measured at the same height.
				ideStr : layCasObj.ideStr, // What: Identifier String. Why: The state names its case. How: This reuses the case's name.
				patStr : layCasObj.patStr, // What: Path String. Why: The state opens the case's route. How: This reuses the case's path.
				widNum : widCurNum,        // What: Width Number. Why: The width is what this test varies. How: This sizes the viewport to the loop's width.

				...( layCasObj.menBoo ? { actFun : async ( actPagObj ) => { await actPagObj.getByRole( 'button', { name : 'Toggle menu' } ).click(); } } : {} ) // What: Menu Action Spread. Why: Only the menu case opens the menu. How: This adds the toggle click as the state's action for that case.


			} );

			expect( await curPagObj.evaluate( layProFun ) ).toEqual( [] ); // What: No Layout Problems Assertion. Why: The width passes only with nothing spilling or overlapping. How: This compares the problems with an empty list, so a failure prints each one.


		} );


	}


}



for ( const widCurNum of FIL_WID_ARR ) { // What: Filter Width Loop. Why: Each filter's rows are measured at a phone, tablet, and desktop width. How: This declares one test per width.


	test( `every Products filter holds its layout at ${ widCurNum.toLocaleString( 'en-US' ) }px`, async ( { page : curPagObj } ) => { // What: Filter Layout Test. Why: The Products grid's card count changes with its filter, so each filter's rows have to hold. How: This opens the home page at the width, chooses each filter in turn, and checks the layout after each one.


		await curPagObj.emulateMedia( { reducedMotion : 'reduce' } ); // What: Reduced Motion Emulation. Why: The cards' entrance doesn't change the layout, so waiting on it only slows the run. How: This makes the page match prefers-reduced-motion.

		await opeStaFun( curPagObj, { heiNum : 900, ideStr : 'home', patStr : '/', widNum : widCurNum } ); // What: Home Open Call. Why: The filters live on the home page. How: This opens it at the width, settled.


		for ( const filButEle of await curPagObj.locator( '[aria-pressed]' ).all() ) { // What: Filter Button Loop. Why: Each filter shows its own set of cards. How: This takes each filter toggle in turn, the only elements with a pressed state.


			await filButEle.click(); // What: Filter Click Call. Why: The grid shows the chosen filter's cards. How: This chooses the filter.

			await curPagObj.mouse.move( widCurNum - 1, 899 ); // What: Pointer Away Call. Why: The clicked filter would stay hovered, lifted into the row above, while the layout is meant to be measured at rest. How: This moves the pointer to the screen's bottom right corner.

			await curPagObj.evaluate( () => window.scrollTo( { behavior : 'instant', left : 0, top : 0 } ) ); // What: Top Scroll Call. Why: Clicking a filter scrolls it into view, and the fixed bar would then overlap the content it slides over. How: This jumps back to the top, where the other cases are measured.

			expect( await curPagObj.evaluate( layProFun ), await filButEle.innerText() ).toEqual( [] ); // What: No Filter Layout Problems Assertion. Why: Each filter passes only with nothing spilling, overlapping, or leaving uneven rows. How: This compares the problems with an empty list, naming the filter in a failure.


		}


	} );


}

// #endregion Module Init


