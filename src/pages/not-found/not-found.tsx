


// #region Imports

import cssModObj from './not-found.module.css'; // What: CSS Module Object. Why: The page is styled in its own module, whose class names Vite hashes. How: Every element reads its class from this object.


import { Link         } from 'react-router';             // What: Link. Why: The page's "Back home" button returns home without a full page load. How: This renders it as a router link to the root.
import { useSecCliFun } from '../../ui/section-link.ts'; // What: Use Section Click Function. Why: See the collection reaches the Products section the same way the bar's links do. How: This returns secCliFun, the shared section link click handler.

// #endregion Imports



/**
 * not-found.tsx = Not Found
 *
 * @summary
 * The page every unknown address lands on: a short message saying the page
 * wasn't found, and ways onward, such as back home. It names itself in the
 * tab and asks search engines not to index it, since the host answers every
 * unknown address with this page and a 200 status. The bar and footer around
 * it come from app.tsx, so every section link still works from here.
 *
 * Sections:
 *  - Components
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Components

// #region NotFouCom

/**
 * NotFouCom = Not Found Component
 *
 * @summary
 * Renders the 404 page's title, its noindex robots tag, which React moves into
 * the document head, and its content, centered below the bar and led by the
 * page's one h1. The "Back home" button is named by its words alone, so its
 * decorative arrow isn't read aloud, and "See the collection" reaches the
 * Products section through secCliFun, the click handler every section link
 * shares.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The 404 page's title, robots tag, and section element.
 *
 * @example
 * ```tsx
 * NotFouCom() // => <NotFouCom />
 * ```
 *
*/

function NotFouCom () : React.JSX.Element {


	const secCliFun = useSecCliFun(); // What: Section Click Function. Why: "See the collection" should reach its section the way every section link does. How: This is the shared click handler, which leaves a modified click to the browser and otherwise navigates home to the section.



	return (


		<>{ /* What: Not Found Fragment. Why: The page's head tags and its section render together. How: This groups them without adding an element. */ }


			<title>Page Not Found | Tony's Toppers</title>{ /* What: Page Title Element. Why: A visitor's tab and history should say the address they tried doesn't exist. How: React 19 moves this title into the document head while the page is shown. */ }

			<meta
				name='robots'

				content='noindex'
			/>{ /* What: Robots Meta Element. Why: The host answers every unknown path with the site and a 200 status, so search engines would otherwise index this page under every mistyped address. How: React 19 moves this tag into the document head while the page is shown. */ }



			<section className={ cssModObj.nofPagSec }>{ /* What: Not-Found Page Section Element. Why: An unknown address should land somewhere useful. How: Its extra top padding clears the fixed bar. */ }


				<div className={ cssModObj.pagConDiv }>{ /* What: Page Container Div Element. Why: The page's few lines read best centered. How: This centers them at the page's width with room above and below. */ }


					<div className={ cssModObj.eyeLabDiv }>{ /* What: Eyebrow Label Div Element. Why: A short label says what happened. How: This shows 404, centered with its leading line. */ }
						404
					</div>

					<h1 className={ cssModObj.secTitHea }>{ /* What: Section Title Heading Element. Why: The heading says the page wasn't found. How: The last word sits in an italic accent. */ }
						Page not <em className={ cssModObj.titAccEmp }>found.</em>
					</h1>

					<p className={ cssModObj.nofLedPar }>{ /* What: Not-Found Lede Paragraph Element. Why: The page points the visitor back to what the site is about. How: This shows one sentence in the soft ink color. */ }
						That page doesn't exist, but Tony's pens and stoppers do.
					</p>

					<div className={ cssModObj.nofActDiv }>{ /* What: Not-Found Actions Div Element. Why: The page's two ways onward sit together. How: This holds the home and collection buttons side by side, wrapping onto two lines at about 342px wide and below. */ }


						<Link
							className={` ${ cssModObj.butBasAnc }   ${ cssModObj.butBasAncPrimary } `}

							to='/'

							aria-label='Back home' // What: Back Home Label. Why: Screen readers would otherwise read the decorative arrow aloud as "right arrow". How: This names the button by its words alone, which still match what's shown.
						>{ /* What: Button Base Anchor Primary Link. Why: The visitor needs a clear way onward. How: This returns to the home page. */ }
							Back home →
						</Link>



						<a
							className={` ${ cssModObj.butBasAnc }   ${ cssModObj.butBasAncSecondary } `}

							href='/#products'

							onClick={ ( cliEveObj ) => secCliFun( cliEveObj, 'products' ) }
						>{ /* What: Button Base Anchor Secondary Element. Why: The site's main content stays one step away. How: Its address opens the home page at the Products section, which a modified click opens in a new tab, while a plain click goes through secCliFun, which navigates home to the section inside the site. */ }
							See the collection
						</a>


					</div>


				</div>


			</section>


		</>


	);


}

// #endregion NotFouCom

// #endregion Components



// #region Exports

export { NotFouCom }; // What: Named Export. Why: The router renders the 404 page for every unknown address. How: This exports NotFouCom.

// #endregion Exports


