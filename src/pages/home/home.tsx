


// #region Imports

import { AboSecCom   } from './about.tsx';    // What: About Section Component. Why: Tony's story follows the gallery. How: This is rendered fourth.
import { ConSecCom   } from './contact.tsx';  // What: Contact Section Component. Why: The page ends where visitors reach Tony. How: This is rendered last.
import { FaiSecCom   } from './fairs.tsx';    // What: Fairs Section Component. Why: The craft fair gallery sits between the collection and Tony's story. How: This is rendered third.
import { HerSecCom   } from './hero.tsx';     // What: Hero Section Component. Why: The page opens with the headline and pitch. How: This is rendered first.
import { ProSecCom   } from './products.tsx'; // What: Products Section Component. Why: The collection follows the hero. How: This is rendered second.
import { useEffect   } from 'react';          // What: Use Effect. Why: The page handles a section's hash once it has rendered. How: This runs the hash arrival effect.
import { useLocation } from 'react-router';   // What: Use Location. Why: The page needs the hash a section link arrived with. How: This reads the current location.
import { useNavigate } from 'react-router';   // What: Use Navigate. Why: The hash should leave the address once the page has scrolled to it. How: This returns the router's navigate function.

// #endregion Imports



/**
 * home.tsx = Home
 *
 * @summary
 * The home page: its sections in reading order, from the hero down to the
 * Contact section. The bar and footer around it come from app.tsx. A visitor
 * arriving with a section's id as the hash, from another page's section link
 * or a shared address such as /#about, lands on that section, and the hash is
 * cleared from the address once used.
 *
 * Sections:
 *  - Components
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Components

// #region HomPagCom

/**
 * HomPagCom = Home Page Component
 *
 * @summary
 * Renders the sections in order. When the address arrives with a hash, it
 * waits for the fonts to load and jumps straight to the section the hash
 * names, without gliding down from the top of a freshly loaded page, then
 * replaces the address with the same path and no hash, so the address stays
 * as clean as it does for in-page links. That replace is flagged in its
 * router state, so the app root's scroll to the top leaves it alone.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The home page's sections.
 *
 * @example
 * ```tsx
 * HomPagCom() // => <HomPagCom />
 * ```
 *
*/

function HomPagCom () : React.JSX.Element {


	const { hash : hasValStr } = useLocation(); // What: Hash Value String. Why: A section link from another page arrives with its section's id as the hash. How: This reads the hash, e.g. #contact, or an empty string, renaming the router's hash key.

	const navRouFun = useNavigate(); // What: Navigate Router Function. Why: The hash should be cleared once the page has used it. How: This is the router's navigate function.


	useEffect( () => { // What: Hash Arrival Effect. Why: A visitor arriving from a section link or a shared address should land on that section, with no hash left in the address. How: Once the fonts have loaded, this jumps to the section the hash names, then replaces the address with one without it.


		if ( !hasValStr ) return; // What: No Hash Guard. Why: Most visits arrive without a hash. How: This does nothing when the hash is empty, including right after it's been cleared.



		void document.fonts.ready.then( () => { // What: Fonts Ready Callback. Why: The jump should land where the section sits once the fonts have reflowed the page above it. How: This waits for the fonts, then scrolls and clears the hash; void marks the returned promise as deliberately unawaited.


			document.getElementById( hasValStr.slice( 1 ) )?.scrollIntoView( { behavior : 'instant' } ); // What: Arrival Scroll Call. Why: The visitor should land on the section, as a normal link arrival would. How: This jumps to the element the hash names, without the html element's smooth scrolling, since an arrival isn't a movement.

			void navRouFun( { hash : '' }, { replace : true, state : { cleBoo : true } } ); // What: Hash Clear Call. Why: The address should stay as clean as it does for in-page links. How: This replaces the current history entry with the same path and no hash, flagging it with cleBoo so the app root's scroll to the top leaves the visitor on the section; void marks the returned promise as deliberately unawaited.


		} );


	}, [ hasValStr, navRouFun ] ); // What: Effect Dependency Array. Why: Each new hash has to be handled once. How: hasValStr changes when a section link arrives, and navRouFun is listed because the effect calls it, though it stays the same while the visitor stays on this page.



	return (


		<>{ /* What: Home Page Fragment. Why: The sections sit one above another in the main landmark app.tsx provides. How: This groups them without adding an element. */ }


			<HerSecCom />{ /* What: Hero Section Component. Why: The page opens with the headline and pitch. How: This renders the hero first. */ }



			<ProSecCom />{ /* What: Products Section Component. Why: The collection is the site's main content. How: This renders it second. */ }



			<FaiSecCom />{ /* What: Fairs Section Component. Why: The gallery shows where to find Tony in person. How: This renders it third. */ }



			<AboSecCom />{ /* What: About Section Component. Why: Visitors meet the maker after seeing his work. How: This renders Tony's story fourth. */ }



			<ConSecCom />{ /* What: Contact Section Component. Why: The page ends where visitors reach Tony. How: This renders the Contact section last. */ }


		</>


	);


}

// #endregion HomPagCom

// #endregion Components



// #region Exports

export { HomPagCom }; // What: Named Export. Why: The home page is rendered by the site's router. How: This exports HomPagCom.

// #endregion Exports


