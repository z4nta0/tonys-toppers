


// #region Imports

import cssModObj from './products.module.css'; // What: CSS Module Object. Why: The section is styled in its own module, whose class names Vite hashes. How: Each element with a class reads it from this object.


import { CAT_REC_ARR     } from './catalog.ts'; // What: Category Record Array. Why: The grid offers a filter button per category. How: Each row gives a button its slug and label.
import { PRO_REC_ARR     } from './catalog.ts'; // What: Product Record Array. Why: The grid shows the catalog's photos. How: The chosen filter decides which records become cards.
import { useLayoutEffect } from 'react';        // What: Use Layout Effect. Why: The leftover cards should be centered before the grid is drawn. How: This measures the grid's columns right after React commits it, before the browser paints.
import { useMemo         } from 'react';        // What: Use Memo. Why: The visible cards only change when the filter does. How: This keeps the filtered list between renders.
import { useRef          } from 'react';        // What: Use Ref. Why: The grid's columns are measured on the grid element itself. How: This holds that element.
import { useState        } from 'react';        // What: Use State. Why: The grid remembers which filter is chosen and how many columns it has. How: This holds each value.


import type { CatSluTyp } from './catalog.ts'; // What: Category Slug Type. Why: A filter key is a category's slug or `all`. How: This types the filter state.

// #endregion Imports



/**
 * products.tsx = Products
 *
 * @summary
 * The home page's collection: filter buttons, one per category plus "All", and
 * a grid of photo cards for the chosen filter, below the section's heading.
 * "All" lists every single piece and set once, while a category also shows the
 * craft fair booth shots tagged with it.
 *
 * Sections:
 *  - Components
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Components

type FilKeyTyp = 'all' | CatSluTyp; // What: Filter Key Type. Why: The grid's filter is either everything or one category. How: This is `all` or a category's slug.

// #region ProSecCom

/**
 * ProSecCom = Products Section Component
 *
 * @summary
 * Renders the collection. Choosing a filter button re-renders the grid with
 * that filter's cards, and the cards that weren't already showing fade in one
 * after another, each waiting 30ms for every place above it in the list. The
 * filter buttons are a labelled group of toggle buttons, the chosen one
 * pressed, so screen readers announce which filter is on.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The Products section element.
 *
 * @example
 * ```tsx
 * ProSecCom() // => <ProSecCom />
 * ```
 *
*/

function ProSecCom () : React.JSX.Element {


	// #region Card Filtering

	const [ filKeyStr, setFilKeyStr ] = useState< FilKeyTyp >( 'all' ); // What: Filter Key String And Setter. Why: The grid shows the cards for one filter at a time. How: This holds the chosen filter, starting with `all`.


	const visRecArr = useMemo( () => ( // What: Visible Record Array. Why: "All" lists every piece and set once, while a category also shows the booth shots tagged with it. How: This leaves the booth shots out of `all`, and otherwise keeps every photo tagged with the chosen category.


		filKeyStr === 'all' // What: All Filter Check. Why: "All" and a category choose their cards differently. How: This picks the branch.
			? PRO_REC_ARR.filter( ( proRecObj ) => !proRecObj.faiBoo )                      // What: All Branch. Why: The booth shots belong in the gallery, not the "All" list. How: This keeps every other record.
			: PRO_REC_ARR.filter( ( proRecObj ) => proRecObj.catArr.includes( filKeyStr ) ) // What: Category Branch. Why: A category shows everything tagged with it, booth shots included. How: This keeps every record listing the category.


	), [ filKeyStr ] ); // What: Memo Dependency Array. Why: The visible cards only change with the filter. How: filKeyStr changing reruns the filter.

	// #endregion Card Filtering



	// #region Last Row Centering

	const griDivRef = useRef< HTMLDivElement >( null ); // What: Grid Div Reference. Why: The grid's column count is only known once the browser lays it out. How: This holds the grid element the observer measures.

	const [ griColObj, setGriColObj ] = useState( { couNum : 1, steNum : 0 } ); // What: Grid Column Object And Setter. Why: Centering the leftover cards takes the grid's column count and the distance from one column to the next. How: This holds both, starting at one column until the grid is measured.


	useLayoutEffect( () => { // What: Grid Column Effect. Why: The grid fits as many columns as its width allows, so the leftover cards' offset changes as it resizes. How: This measures the grid once before its first paint, then again whenever its size changes.


		const griCurEle = griDivRef.current!; // What: Grid Current Element. Why: The observer watches the grid itself. How: This reads it from its reference. // What: Non-Null Note. Why: React fills the reference before a layout effect runs. How: The grid always renders, so the reference holds it here.



		const meaColFun = () => { // What: Measure Column Function. Why: The resolved tracks give the column count and width the stylesheet's auto-fill produced. How: This stores the track count and one track plus the column gap.


			const griStyObj = getComputedStyle( griCurEle );              // What: Grid Style Object. Why: The resolved tracks and gap are only available as computed values. How: This reads the grid's computed style.
			const trkLisArr = griStyObj.gridTemplateColumns.split( ' ' ); // What: Track List Array. Why: Each column is one resolved track. How: This splits the computed track list into its pixel widths.


			setGriColObj({ // What: Grid Column Setter Call. Why: The leftover offset is worked out from these at render. How: This stores the count and the step.


				couNum : trkLisArr.length,                                                // What: Count Number. Why: The leftover cards are the count left after the full rows. How: This is the number of tracks.
				steNum : parseFloat( trkLisArr[ 0 ] ) + parseFloat( griStyObj.columnGap ) // What: Step Number. Why: Moving a card by one column covers a track and a gap. How: This adds the first track's width to the column gap.


			});


		};


		meaColFun(); // What: First Measure Call. Why: The leftover cards should be centered in the grid's first frame, and a state update made in a layout effect is applied before the browser paints. How: This measures the grid once right away, before the observer's own first report.


		const resObsObj = new ResizeObserver( meaColFun ); // What: Resize Observer Object. Why: The column count changes with the grid's width. How: This measures the grid on each resize, including once as observing starts.


		resObsObj.observe( griCurEle ); // What: Grid Observe Call. Why: A change in the column count resizes the grid too, even above the content cap where its width holds, since each card's height follows its column's width. How: This starts watching it.



		return () => resObsObj.disconnect(); // What: Observer Cleanup. Why: An unmounted grid shouldn't be measured. How: This stops the observer.


	}, [] ); // What: Effect Dependency Array. Why: The observer only needs starting once. How: The empty list runs the effect on mount alone.


	const lefCouNum = visRecArr.length % griColObj.couNum;                                         // What: Leftover Count Number. Why: Only the cards past the last full row need centering. How: This takes the remainder of the cards after full rows.
	const rowOffNum = lefCouNum === 0 ? 0 : ( griColObj.couNum - lefCouNum ) * griColObj.steNum / 2; // What: Row Offset Number. Why: The leftover cards sit centered when they move across half the empty columns. How: This multiplies the empty columns by one step and halves it, or is 0 when every row is full.

	// #endregion Last Row Centering



	return (


		<section
			id='products'

			className={ cssModObj.homProSec }
		>{ /* What: Home Products Section Element. Why: The collection is the work the site exists to show. How: Its ID stays the plain word `products`, since the bar links to it and it can appear in the page's address. */ }


			<div className={ cssModObj.pagConDiv }>{ /* What: Page Container Div Element. Why: The section's content lines up with the page's width. How: This centers it at a capped width. */ }


				<div className={ cssModObj.secHeaDiv }>{ /* What: Section Heading Div Element. Why: The heading and the note about Tony's work sit side by side. How: This lays them out in a row, the note wrapping below the heading at about 951px wide and below. */ }


					<div>{ /* What: Products Title Div Element. Why: The label and heading read as one block. How: This stacks them. */ }


						<div className={ cssModObj.eyeLabDiv }>The Collection</div>{ /* What: Eyebrow Label Div Element. Why: A short label names the section. How: This shows it above the heading. */ }

						<h2 className={ cssModObj.secTitHea }>Every piece, <em className={ cssModObj.titAccEmp }>one of a kind.</em></h2>{ /* What: Section Title Heading Element. Why: The heading sums up the collection. How: The second half sits in an italic accent. */ }


					</div>


					<p className={ cssModObj.secSubPar }>{ /* What: Section Subtitle Paragraph Element. Why: Visitors should know each piece is chosen by hand. How: This shows two sentences beside the heading, or below it at about 951px wide and below. */ }
						Tony hand-selects beads and silicone shapes for each piece, color-coordinating until
						it's just right. No two are the same.
					</p>


				</div>



				<div
					className={ cssModObj.filGroDiv }

					aria-label='Filter products by category'
					role='group'
				>{ /* What: Filter Group Div Element. Why: Visitors can narrow the grid to one kind of piece. How: This groups the "All" button and one button per category under one label. */ }


					<button
						className={ cssModObj.filTogBut }

						type='button'

						aria-pressed={ filKeyStr === 'all' }

						onClick={ () => setFilKeyStr( 'all' ) }
					>{ /* What: Filter Toggle Button Element. Why: Visitors can go back to every piece. How: This chooses the `all` filter, and shows as pressed while it's chosen. */ }
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



				<div
					ref={ griDivRef }

					className={ cssModObj.proGriDiv }

					style={ { '--pro-row-off' : `${ rowOffNum }px` } as React.CSSProperties } // What: Product Row Offset Style. Why: The leftover cards in the last row should sit centered at the other cards' width. How: This hands the grid the distance its stylesheet moves them across. // What: Type Assertion Note. Why: React's style type doesn't list custom properties. How: The object holds only this one custom property, which React sets as written.
				>{ /* What: Products Grid Div Element. Why: The cards lay out in a responsive grid. How: This holds one card per visible record, its observer reading the columns that center the last row's leftover cards. */ }


					{ visRecArr.map( ( proRecObj, proIndNum ) => ( // What: Product Card Map. Why: Each visible record gets a card. How: This renders one article per record, in order.


						<article
							key={ proRecObj.ideStr }

							className={ cssModObj.proCarArt }

							style={{ animationDelay : `${ proIndNum * 30 }ms` }} // What: Staggered Animation Delay. Why: Cards that mount together fade in one after another rather than all at once. How: Each card waits 30ms longer than the one before it.

							data-row-leftover-centered={ proIndNum >= visRecArr.length - lefCouNum || undefined } // What: Leftover Card Flag. Why: Only the cards past the last full row move to the center. How: This marks the last lefCouNum cards, and is left off every other card.
						>{ /* What: Product Card Article Element. Why: Each photo is shown as a card. How: Its place in the list sets when it fades in. */ }


							<div className={ cssModObj.proTagDiv }>{ proRecObj.labStr }</div>{ /* What: Product Tag Div Element. Why: A tag over the photo names what kind of piece it shows. How: This shows the record's label. */ }

							<div className={ cssModObj.proFraDiv }>{ /* What: Product Frame Div Element. Why: Every photo sits in the same portrait frame. How: This frames the photo at a 3:4 shape. */ }


								<img
									className={ cssModObj.proPhoIma }

									height={ proRecObj.heiNum } // What: Intrinsic Image Size. Why: The browser should hold the image's space before it loads, so nothing below it shifts. How: The width and height give its aspect ratio, while the CSS still sets its displayed size.
									loading='lazy'
									src={ proRecObj.imaStr }
									width={ proRecObj.widNum } // What: Intrinsic Image Size. Why: The browser should hold the image's space before it loads, so nothing below it shifts. How: The width and height give its aspect ratio, while the CSS still sets its displayed size.

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

export { ProSecCom }; // What: Named Export. Why: The Products section is rendered as part of the home page. How: This exports ProSecCom.

// #endregion Exports


