



// #region Imports

import { PRO_RCD_ARR } from './catalog.ts'; // What: Product Record Array. Why: The booth shots live in the catalog beside the pieces they show. How: The gallery keeps only the records marked as booth shots.

// #endregion Imports



/**
 * fairs.tsx = Fairs
 *
 * @summary
 * The home page's craft fair gallery: a heading, a line about where Tony sets
 * up, and his booth shots in a grid, four across on a wide screen and two on a
 * phone. The same photos also appear under the product filters for the kinds
 * of pieces they show.
 *
 * Sections:
 *  - Constants
 *  - Components
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

const GAL_RCD_ARR = PRO_RCD_ARR.filter( ( proRcdObj ) => proRcdObj.faiBoo ); // What: Gallery Record Array. Why: Only the craft fair table photos belong in the gallery. How: This keeps the catalog's records marked as booth shots, in catalog order.

// #endregion Constants



// #region Components

// #region FaiSecCom

/**
 * FaiSecCom = Fairs Section Component
 *
 * @summary
 * Renders the gallery, one figure per booth shot, each cropped to a 4:5 frame
 * and loaded only as it nears the screen, with its description as alt text.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The fairs section element.
 *
 * @example
 * ```tsx
 * FaiSecCom() // => <FaiSecCom />
 * ```
 *
*/

function FaiSecCom () : React.JSX.Element {


	return (


		<section
			id='fairs'

			className='section fairs-section'
		>{ /* What: Fairs Section Element. Why: Visitors meet Tony at craft fairs, and the gallery shows what his table looks like. How: Its id stays the plain word fairs, since the bar links to it and it can appear in the page's address. */ }


			<div className='container'>{ /* What: Fairs Container Div Element. Why: The section's content lines up with the page's width. How: This centers it at a capped width. */ }


				<div className='section-head'>{ /* What: Fairs Head Div Element. Why: The heading and the note about the fairs sit side by side. How: This lays them out in a row. */ }


					<div>{ /* What: Fairs Title Div Element. Why: The label and heading read as one block. How: This stacks them. */ }


						<div className='section-label'>At the Craft Fairs</div>{ /* What: Fairs Label Div Element. Why: A small label names the section. How: This shows it above the heading. */ }

						<h2 className='section-title'>Come see Tony <em>at his table.</em></h2>{ /* What: Fairs Heading Element. Why: The heading invites visitors to find Tony in person. How: The second half sits in an italic accent. */ }


					</div>


					<p className='section-sub'>
						Tony sets up at craft fairs and events around Bolivar, Missouri. Here's what you'll
						find when you stop by.
					</p>{ /* What: Fairs Note Paragraph Element. Why: Visitors should know where Tony sells his pieces. How: This shows two sentences beside the heading. */ }


				</div>



				<div className='fairs-grid'>{ /* What: Fairs Grid Div Element. Why: The booth shots lay out in a responsive grid. How: This holds one figure per booth shot. */ }


					{ GAL_RCD_ARR.map( ( faiRcdObj ) => ( // What: Booth Figure Map. Why: Each booth shot gets a figure. How: This renders one figure per record, in catalog order.


						<figure
							key={ faiRcdObj.ideStr }

							className='fair-photo'
						>{ /* What: Booth Photo Figure Element. Why: Each booth shot sits in the same rounded 4:5 frame. How: This frames the photo. */ }


							<img
								data-element-name-hook='faiPhoIma'

								loading='lazy'
								src={ faiRcdObj.imaStr }

								alt={ faiRcdObj.altStr }
							/>{ /* What: Booth Photo Image Element. Why: The gallery shows Tony's table. How: This loads the photo only as it nears the screen, described by its alt text; the rendering suite masks it through its faiPhoIma hook. */ }


						</figure>


					))}


				</div>


			</div>


		</section>


	);


}

// #endregion FaiSecCom

// #endregion Components



// #region Exports

export { FaiSecCom }; // What: Named Exports. Why: The home page shows the gallery after the collection. How: This exports FaiSecCom.

// #endregion Exports


