


// #region Imports

import cssModObj from './fairs.module.css'; // What: CSS Module Object. Why: The section is styled in its own module, whose class names Vite hashes. How: Every element reads its class from this object.


import { PRO_REC_ARR } from './catalog.ts'; // What: Product Record Array. Why: The booth shots live in the catalog beside the pieces they show. How: The gallery keeps only the records marked as booth shots.

// #endregion Imports



/**
 * fairs.tsx = Fairs
 *
 * @summary
 * The home page's craft fair gallery: a heading, a line about where Tony sets
 * up, and his booth shots in a grid of four columns, stepping to two at 900px
 * wide and below and to one at 360px and below, so every row is full. The same
 * photos also appear under the product filters for the kinds of pieces they
 * show.
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

const GAL_REC_ARR = PRO_REC_ARR.filter( ( proRecObj ) => proRecObj.faiBoo ); // What: Gallery Record Array. Why: Only the craft fair table photos belong in the gallery. How: This keeps the catalog's records marked as booth shots, in catalog order.

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
 * @returns The Craft Fairs section element.
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

			className={ cssModObj.homFaiSec }
		>{ /* What: Home Fairs Section Element. Why: Visitors meet Tony at craft fairs, and the gallery shows what his table looks like. How: Its id stays the plain word fairs, since the bar links to it and it can appear in the page's address. */ }


			<div className={ cssModObj.pagConDiv }>{ /* What: Page Container Div Element. Why: The section's content lines up with the page's width. How: This centers it at a capped width. */ }


				<div className={ cssModObj.secHeaDiv }>{ /* What: Section Heading Div Element. Why: The heading and the note about the fairs sit side by side. How: This lays them out in a row, the note wrapping below the heading at about 1,027px wide and below. */ }


					<div>{ /* What: Fairs Title Div Element. Why: The label and heading read as one block. How: This stacks them. */ }


						<div className={ cssModObj.eyeLabDiv }>At the Craft Fairs</div>{ /* What: Eyebrow Label Div Element. Why: A short label names the section. How: This shows it above the heading. */ }

						<h2 className={ cssModObj.secTitHea }>Come see Tony <em className={ cssModObj.titAccEmp }>at his table.</em></h2>{ /* What: Section Title Heading Element. Why: The heading invites visitors to find Tony in person. How: The second half sits in an italic accent. */ }


					</div>


					<p className={ cssModObj.secSubPar }>{ /* What: Section Subtitle Paragraph Element. Why: Visitors should know where Tony sells his pieces. How: This shows two sentences beside the heading, or below it at about 1,027px wide and below. */ }
						Tony sets up at craft fairs and events around Bolivar, Missouri. Here's what you'll
						find when you stop by.
					</p>


				</div>



				<div className={ cssModObj.faiGriDiv }>{ /* What: Fairs Grid Div Element. Why: The booth shots lay out in rows that stay full. How: This holds one figure per booth shot in four columns, stepping to two at 900px wide and below and to one at 360px and below. */ }


					{ GAL_REC_ARR.map( ( faiRecObj ) => ( // What: Booth Figure Map. Why: Each booth shot gets a figure. How: This renders one figure per record, in catalog order.


						<figure
							key={ faiRecObj.ideStr }

							className={ cssModObj.faiPhoFig }
						>{ /* What: Fair Photo Figure Element. Why: Each booth shot sits in the same rounded 4:5 frame. How: This frames the photo. */ }


							<img
								className={ cssModObj.faiPhoIma }

								height={ faiRecObj.heiNum } // What: Intrinsic Image Size. Why: The browser should hold the image's space before it loads, so nothing below it shifts. How: The width and height give its aspect ratio, while the CSS still sets its displayed size.
								loading='lazy'
								src={ faiRecObj.imaStr }
								width={ faiRecObj.widNum } // What: Intrinsic Image Size. Why: The browser should hold the image's space before it loads, so nothing below it shifts. How: The width and height give its aspect ratio, while the CSS still sets its displayed size.

								alt={ faiRecObj.altStr }
							/>{ /* What: Fair Photo Image Element. Why: The gallery shows Tony's table. How: This loads the photo only as it nears the screen, described by its alt text, at its own width and height so the frame doesn't shift when it arrives. */ }


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

export { FaiSecCom }; // What: Named Export. Why: The home page shows the gallery after the collection. How: This exports FaiSecCom.

// #endregion Exports


