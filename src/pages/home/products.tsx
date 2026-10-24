


// #region Imports

import cssModObj from './products.module.css'; // What: CSS Module Object. Why: The section is styled in its own module, whose class names Vite hashes. How: Every element reads its class from this object.


import { CAT_REC_ARR } from './catalog.ts'; // What: Category Record Array. Why: The grid offers a filter button per category. How: Each row gives a button its slug and label.
import { PRO_REC_ARR } from './catalog.ts'; // What: Product Record Array. Why: The grid shows the catalog's photos. How: The chosen filter decides which records become cards.
import { useMemo     } from 'react';        // What: Use Memo. Why: The visible cards only change when the filter does. How: This keeps the filtered list between renders.
import { useState    } from 'react';        // What: Use State. Why: The grid remembers which filter is chosen. How: This holds the filter key.


import type { CatSluTyp } from './catalog.ts'; // What: Category Slug Type. Why: A filter key is a category's slug or all. How: This types the filter state.

// #endregion Imports



/**
 * products.tsx = Products
 *
 * @summary
 * The home page's collection: a heading and a short note about how Tony works,
 * a row of filter buttons (All and one per category), and a grid of photo
 * cards for the chosen filter. All lists every single piece and set once,
 * while a category also shows the craft fair booth shots tagged with it.
 *
 * Sections:
 *  - Components
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Components

type FilKeyTyp = 'all' | CatSluTyp; // What: Filter Key Type. Why: The grid's filter is either everything or one category. How: This is all or a category's slug.

// #region ProSecCom

/**
 * ProSecCom = Products Section Component
 *
 * @summary
 * Renders the collection. Choosing a filter button re-renders the grid with
 * that filter's cards, which fade in one after another, each 30ms behind the
 * one before. The filter buttons are a labelled group of toggle buttons, the
 * chosen one pressed, so screen readers announce which filter is on.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The products section element.
 *
 * @example
 * ```tsx
 * ProSecCom() // => <ProSecCom />
 * ```
 *
*/

function ProSecCom () : React.JSX.Element {


	const [ filKeyStr, setFilKeyStr ] = useState< FilKeyTyp >( 'all' ); // What: Filter Key String And Setter. Why: The grid shows the cards for one filter at a time. How: This holds the chosen filter, starting with all.


	const visRecArr = useMemo( () => ( // What: Visible Record Array. Why: All lists every piece and set once, while a category also shows the booth shots tagged with it. How: This leaves the booth shots out of all, and otherwise keeps every photo tagged with the chosen category.


		filKeyStr === 'all' // What: All Filter Check. Why: All and a category choose their cards differently. How: This picks the branch.
			? PRO_REC_ARR.filter( ( proRecObj ) => !proRecObj.faiBoo )                      // What: All Branch. Why: The booth shots belong in the gallery, not the All list. How: This keeps every other record.
			: PRO_REC_ARR.filter( ( proRecObj ) => proRecObj.catArr.includes( filKeyStr ) ) // What: Category Branch. Why: A category shows everything tagged with it, booth shots included. How: This keeps every record listing the category.


	), [ filKeyStr ] ); // What: Memo Dependency Array. Why: The visible cards only change with the filter. How: filKeyStr changing reruns the filter.



	return (


		<section
			id='products'

			className={ cssModObj.homProSec }
		>{ /* What: Home Products Section Element. Why: The collection is the site's main content. How: Its id stays the plain word products, since the bar links to it and it can appear in the page's address. */ }


			<div className={ cssModObj.pagConDiv }>{ /* What: Page Container Div Element. Why: The section's content lines up with the page's width. How: This centers it at a capped width. */ }


				<div className={ cssModObj.secHeaDiv }>{ /* What: Section Heading Div Element. Why: The heading and the note about Tony's work sit side by side. How: This lays them out in a row, stacking the note below the heading at 900px wide and below. */ }


					<div>{ /* What: Products Title Div Element. Why: The label and heading read as one block. How: This stacks them. */ }


						<div className={ cssModObj.eyeLabDiv }>The Collection</div>{ /* What: Eyebrow Label Div Element. Why: A short label names the section. How: This shows it above the heading. */ }

						<h2 className={ cssModObj.secTitHea }>Every piece, <em className={ cssModObj.titAccEmp }>one of a kind.</em></h2>{ /* What: Section Title Heading Element. Why: The heading sums up the collection. How: The second half sits in an italic accent. */ }


					</div>


					<p className={ cssModObj.secSubPar }>{ /* What: Section Subtitle Paragraph Element. Why: Visitors should know each piece is chosen by hand. How: This shows two sentences beside the heading. */ }
						Tony hand-selects beads and silicone shapes for each piece, color-coordinating until
						it's just right. No two are the same.
					</p>


				</div>



				<div
					className={ cssModObj.filGroDiv }

					aria-label='Filter products by category'
					role='group'
				>{ /* What: Filter Group Div Element. Why: Visitors can narrow the grid to one kind of piece. How: This groups the All button and one button per category under one label. */ }


					<button
						className={ cssModObj.filTogBut }

						type='button'

						aria-pressed={ filKeyStr === 'all' }

						onClick={ () => setFilKeyStr( 'all' ) }
					>{ /* What: Filter Toggle Button Element. Why: Visitors can go back to every piece. How: This chooses the all filter, and shows as pressed while it's chosen. */ }
						All
					</button>

					{ CAT_REC_ARR.map( ( catRecObj ) => ( // What: Category Button Map. Why: Each category gets a filter button. How: This renders one button per category row.


						<button
							key={ catRecObj.sluStr }

							className={ cssModObj.filTogBut }

							type='button'

							aria-pressed={ filKeyStr === catRecObj.sluStr }

							onClick={ () => setFilKeyStr( catRecObj.sluStr ) }
						>{ /* What: Filter Toggle Button Element. Why: Visitors can narrow the grid to this category. How: This chooses the category's slug as the filter, and shows as pressed while it's chosen. */ }
							{ catRecObj.labStr }
						</button>


					))}


				</div>



				<div className={ cssModObj.proGriDiv }>{ /* What: Products Grid Div Element. Why: The cards lay out in a responsive grid. How: This holds one card per visible record. */ }


					{ visRecArr.map( ( proRecObj, proIndNum ) => ( // What: Product Card Map. Why: Each visible record gets a card. How: This renders one article per record, in order.


						<article
							key={ proRecObj.ideStr }

							className={ cssModObj.proCarArt }

							style={{ animationDelay : `${ proIndNum * 30 }ms` }} // What: Staggered Animation Delay. Why: The cards fade in one after another rather than all at once. How: Each card waits 30ms longer than the one before it.
						>{ /* What: Product Card Article Element. Why: Each photo is shown as a card. How: Its place in the list sets when it fades in. */ }


							<div className={ cssModObj.proTagDiv }>{ proRecObj.labStr }</div>{ /* What: Product Tag Div Element. Why: A tag over the photo names what kind of piece it shows. How: This shows the record's label. */ }

							<div className={ cssModObj.proFraDiv }>{ /* What: Product Frame Div Element. Why: Every photo sits in the same portrait frame. How: This frames the photo at a 3:4 shape. */ }


								<img
									className={ cssModObj.proPhoIma }

									height={ proRecObj.heiNum }
									loading='lazy'
									src={ proRecObj.imaStr }
									width={ proRecObj.widNum }

									alt={ proRecObj.altStr }
								/>{ /* What: Product Photo Image Element. Why: The card shows its piece. How: This loads the photo only as it nears the screen, at its own width and height so the card doesn't shift when it arrives. */ }


							</div>

							<div className={ cssModObj.proInfDiv }>{ /* What: Product Info Div Element. Why: The card's name and kind sit beneath its photo. How: This stacks them. */ }


								<div className={ cssModObj.proNamDiv }>{ proRecObj.namStr }</div>{ /* What: Product Name Div Element. Why: Each card has a title. How: This shows the record's name. */ }

								<div className={ cssModObj.proTypDiv }>{ proRecObj.labStr }</div>{ /* What: Product Type Div Element. Why: The card repeats its kind beneath its title. How: This shows the record's label. */ }


							</div>


						</article>


					))}


				</div>


			</div>


		</section>


	);


}

// #endregion ProSecCom

// #endregion Components



// #region Exports

export { ProSecCom }; // What: Named Export. Why: The home page shows the collection after the hero. How: This exports ProSecCom.

// #endregion Exports


