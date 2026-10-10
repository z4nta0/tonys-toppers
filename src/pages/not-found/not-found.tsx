



// #region Imports

import { Link } from 'react-router'; // What: Link. Why: The page's button returns home without a full page load. How: This renders it as a router link to the root.

// #endregion Imports



/**
 * not-found.tsx = Not Found
 *
 * @summary
 * The page every unknown address lands on: a 404 label, a heading saying the
 * page wasn't found, a short line pointing back to Tony's pieces, and a button
 * home. The bar and footer around it come from app.tsx, so every section link
 * still works from here.
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
 * Renders the 404 page's content, centered below the bar. Its button is named
 * by its words alone, so its decorative arrow isn't read aloud. Step 11 of the
 * cleanup plan gives the page its own h1, title, and noindex tag.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The 404 page's section element.
 *
 * @example
 * ```tsx
 * NotFouCom() // => <NotFouCom />
 * ```
 *
*/

function NotFouCom () : React.JSX.Element {


	return (


		<section
			className='section'

			style={{ paddingTop : '160px' }}
		>{ /* What: Not Found Section Element. Why: An unknown address should land somewhere useful. How: Its extra top padding clears the fixed bar. */ }


			<div
				className='container'

				style={{
					padding   : '60px 0',
					textAlign : 'center'
				}}
			>{ /* What: Not Found Container Div Element. Why: The page's few lines read best centered. How: This centers them at the page's width with room above and below. */ }


				<div
					className='section-label'

					style={{ justifyContent : 'center' }}
				>{ /* What: Not Found Label Div Element. Why: A small label says what happened. How: This shows 404, centered with its leading line. */ }
					404
				</div>

				<h2
					className='section-title'

					style={{ marginBottom : '20px' }}
				>{ /* What: Not Found Heading Element. Why: The heading says the page wasn't found. How: The last word sits in an italic accent. */ }
					Page not <em>found.</em>
				</h2>

				<p
					style={{
						color        : 'var( --ink-soft )', // Ink Soft = #4a4a5e
						marginBottom : '32px'
					}}
				>{ /* What: Not Found Note Paragraph Element. Why: The page points the visitor back to what the site is about. How: This shows one line in the soft ink color. */ }
					That page doesn't exist, but Tony's pens and stoppers do.
				</p>



				<Link
					className='btn btn-primary'

					to='/'

					aria-label='Back home' // What: Back Home Label. Why: Screen readers would otherwise read the decorative arrow aloud as right arrow. How: This names the button by its words alone, which still match what's shown.
				>{ /* What: Back Home Link. Why: The visitor needs a clear way onward. How: This returns to the home page. */ }
					Back home →
				</Link>


			</div>


		</section>


	);


}

// #endregion NotFouCom

// #endregion Components



// #region Exports

export { NotFouCom }; // What: Named Exports. Why: The router renders the 404 page for every unknown address. How: This exports NotFouCom.

// #endregion Exports


