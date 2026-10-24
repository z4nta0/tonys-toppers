


// #region Imports

import cssModObj from './not-found.module.css'; // What: CSS Module Object. Why: The page is styled in its own module, whose class names Vite hashes. How: Every element reads its class from this object.


import { Link } from 'react-router'; // What: Link. Why: The page's button returns home without a full page load. How: This renders it as a router link to the root.

// #endregion Imports



/**
 * not-found.tsx = Not Found
 *
 * @summary
 * The page every unknown address lands on: a 404 label, a heading saying the
 * page wasn't found, a short line pointing back to Tony's pieces, and two
 * ways onward, home and straight to the collection. It names itself in the
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
 * Renders the 404 page's title, its noindex robots tag, which React moves
 * into the document head, and its content, centered below the bar, under the
 * page's one h1. The Back home button is named by its words alone, so its
 * decorative arrow isn't read aloud, and See the collection opens the home
 * page at the products section through the home page's hash arrival.
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

					<p className={ cssModObj.nofLedPar }>{ /* What: Not-Found Lede Paragraph Element. Why: The page points the visitor back to what the site is about. How: This shows one line in the soft ink color. */ }
						That page doesn't exist, but Tony's pens and stoppers do.
					</p>

					<div className={ cssModObj.nofActDiv }>{ /* What: Not-Found Actions Div Element. Why: The page's two ways onward sit together. How: This holds the home and collection buttons side by side, wrapping when they run out of room. */ }


						<Link
							className={` ${ cssModObj.butBasAnc }   ${ cssModObj.butBasAncPrimary } `}

							to='/'

							aria-label='Back home' // What: Back Home Label. Why: Screen readers would otherwise read the decorative arrow aloud as right arrow. How: This names the button by its words alone, which still match what's shown.
						>{ /* What: Button Base Anchor Primary Link. Why: The visitor needs a clear way onward. How: This returns to the home page. */ }
							Back home →
						</Link>



						<Link
							className={` ${ cssModObj.butBasAnc }   ${ cssModObj.butBasAncSecondary } `}

							to={{ hash : 'products', pathname : '/' }} // What: Products Section Address. Why: A visitor who came looking for Tony's pieces can go straight to them. How: This opens the home page with the products section's id as the hash, which the home page scrolls to and then clears.
						>{ /* What: Button Base Anchor Secondary Link. Why: The site's main content stays one step away. How: This opens the home page at the products section. */ }
							See the collection
						</Link>


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


