


// #region Imports

import cssModObj from './about.module.css';   // What: CSS Module Object. Why: The section is styled in its own module, whose class names Vite hashes. How: Every element reads its class from this object.
import logSvgUrl from './logo.svg';           // What: Logo SVG URL. Why: The About section shows the Tony's Toppers logo over his portrait's corner, and Vite fingerprints and checks an imported image. How: This imports the logo's built URL for its img.
import porWebUrl from './tony-portrait.webp'; // What: Portrait WebP URL. Why: The About section shows Tony's portrait, and Vite fingerprints and checks an imported image. How: This imports the photo's built URL for its img.


import { PHO_SIZ_OBJ } from './photo-sizes.ts'; // What: Photo Sizes Object. Why: The portrait's img carries its intrinsic size, so the page doesn't shift while it loads. How: This looks up the portrait's width and height.

// #endregion Imports



/**
 * about.tsx = About
 *
 * @summary
 * The home page's story of Tony: his portrait with the Tony's Toppers logo
 * badge, his name, four paragraphs about who he is and how the business
 * began, and three stats beneath them. His age is worked out from his birth
 * year each time the section renders, so it never needs updating by hand.
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

const TON_BIR_NUM = 1982; // What: Tony Birth Number. Why: The story and the first stat give Tony's age, which changes every year. How: This is the year he was born, which his age is worked out from.

// #endregion Constants



// #region Components

// #region AboSecCom

/**
 * AboSecCom = About Section Component
 *
 * @summary
 * Renders Tony's story. His age is this year less his birth year, so it turns
 * over each January rather than on his birthday, which is close enough for a
 * story and means no one has to update it by hand.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The about section element.
 *
 * @example
 * ```tsx
 * AboSecCom() // => <AboSecCom />
 * ```
 *
*/

function AboSecCom () : React.JSX.Element {


	const tonAgeNum = new Date().getFullYear() - TON_BIR_NUM; // What: Tony Age Number. Why: The story and the first stat give Tony's age. How: This subtracts his birth year from the current year.



	return (


		<section
			id='about'

			className={ cssModObj.homAboSec }
		>{ /* What: Home About Section Element. Why: Visitors want to meet the maker. How: Its id stays the plain word about, since the bar and the hero link to it and it can appear in the page's address. */ }


			<div className={ cssModObj.pagConDiv }>{ /* What: Page Container Div Element. Why: The section's content lines up with the page's width. How: This centers it at a capped width. */ }


				<div className={ cssModObj.bioGriDiv }>{ /* What: Biography Grid Div Element. Why: The portrait and the story sit side by side. How: This lays out the two columns, stacking them with the portrait on top at 900px wide and below. */ }


					<div className={ cssModObj.porWraDiv }>{ /* What: Portrait Wrap Div Element. Why: The portrait and its logo badge read as one picture. How: This holds both, the badge overlapping the portrait's corner. */ }


						<div className={ cssModObj.porFraDiv }>{ /* What: Portrait Frame Div Element. Why: The portrait sits in a tilted frame. How: This frames the photo. */ }


							<img
								className={ cssModObj.porPhoIma }

								height={ PHO_SIZ_OBJ[ 'tony-portrait' ].heiNum }
								loading='lazy'
								src={ porWebUrl }
								width={ PHO_SIZ_OBJ[ 'tony-portrait' ].widNum }

								alt='Portrait of Tony Mawhiney'
							/>{ /* What: Portrait Photo Image Element. Why: Visitors see who Tony is. How: This loads his portrait only as it nears the screen, at its own width and height so the frame doesn't shift when it arrives. */ }


						</div>

						<div className={ cssModObj.logBadDiv }>{ /* What: Logo Badge Div Element. Why: A round logo badge marks the portrait as Tony's Toppers. How: This frames the logo over the portrait's corner. */ }


							<img
								className={ cssModObj.logBadIma }

								src={ logSvgUrl }

								alt="Tony's Toppers logo"
							/>{ /* What: Logo Badge Image Element. Why: The badge shows the business's logo. How: This loads the full logo. */ }


						</div>


					</div>



					<div>{ /* What: Biography Content Div Element. Why: The story reads as one column. How: This stacks the label, name, paragraphs, and stats, with no styling of its own. */ }


						<div className={ cssModObj.eyeLabDiv }>Meet the Maker</div>{ /* What: Eyebrow Label Div Element. Why: A small label names the section. How: This shows it above the name. */ }

						<h2 className={ cssModObj.secTitHea }>Tony Mawhiney: <em className={ cssModObj.titAccEmp }>artist, crafter, kind soul.</em></h2>{ /* What: Section Title Heading Element. Why: The heading names Tony and sums him up. How: The description sits in an italic accent. */ }

						<p className={ cssModObj.bioStoPar }>{ /* What: Biography Story Paragraph Element. Why: The story opens with who Tony is. How: This gives his age, read on each render, his home town, and his character, with a drop cap on its first letter. */ }
							Tony is a { tonAgeNum }-year-old young man with Down syndrome living in Bolivar, Missouri. He's quiet at first, but
							once you know him you won't find a kinder, more polite person, and you wouldn't have
							to look hard to know it.
						</p>

						<p className={ cssModObj.bioStoPar }>{ /* What: Biography Story Paragraph Element. Why: Tony's art started long before the business. How: This tells of his schooling and his painting in the State Capitol. */ }
							After graduating high school, Tony moved to Grandview, Missouri, where he had his own
							apartment and attended Longview Jr. College through the Ace program. He's always been
							artistic and crafty. In high school, a painting of his was chosen through a contest
							that traveled around Missouri for a year before being hung in the State Capitol.
						</p>

						<p className={ cssModObj.bioStoPar }>{ /* What: Biography Story Paragraph Element. Why: Visitors like to know how the business began. How: This tells of the first beaded pen. */ }
							A while back, a friend showed him some beaded pens she'd made and he mentioned he'd
							love to try it. She sent him a starter package (assorted beads, silicone shapes, and
							a few pens), and he was hooked. He carefully chose and color-coordinated every bead
							on that very first pen, and that was the beginning of his business.
						</p>

						<p className={ cssModObj.bioStoPar }>{ /* What: Biography Story Paragraph Element. Why: The story ends with where the business is now. How: This tells of every kind of piece he makes beyond the pens, the name, and his pride in it. */ }
							Since that day Tony has grown his inventory of beads, expanded beyond the pens into
							wine stoppers, keychains, dog necklaces, car freshies, name badge reels, phone grips,
							and straw charms, and named his business <strong>Tony's Toppers</strong>. He's very
							proud of it, and he loves sharing pictures of finished pieces with friends and
							family. They're all made with love.
						</p>


						<div className={ cssModObj.bioStaDiv }>{ /* What: Biography Stats Div Element. Why: Three short facts round off the story. How: This sets them in a row beneath the paragraphs. */ }


							<div>{ /* What: Age Stat Div Element. Why: Tony's age is a fun fact. How: This shows it above its caption. */ }


								<span className={ cssModObj.staValSpa }>{ tonAgeNum }</span>{ /* What: Stat Value Span Element. Why: The stat's figure leads. How: This shows Tony's age, read on each render. */ }

								<div className={ cssModObj.staLabDiv }>Years young</div>{ /* What: Stat Label Div Element. Why: The figure needs a caption. How: This names it years young. */ }


							</div>

							<div>{ /* What: Handmade Stat Div Element. Why: Every piece is made by hand. How: This shows the figure above its caption. */ }


								<span className={ cssModObj.staValSpa }>100%</span>{ /* What: Stat Value Span Element. Why: The stat's figure leads. How: This shows 100%. */ }

								<div className={ cssModObj.staLabDiv }>Handmade</div>{ /* What: Stat Label Div Element. Why: The figure needs a caption. How: This names it handmade. */ }


							</div>

							<div>{ /* What: One Of One Stat Div Element. Why: No two pieces are the same. How: This shows the figure above its caption. */ }


								<span className={ cssModObj.staValSpa }>1of1</span>{ /* What: Stat Value Span Element. Why: The stat's figure leads. How: This shows 1of1. */ }

								<div className={ cssModObj.staLabDiv }>Every piece</div>{ /* What: Stat Label Div Element. Why: The figure needs a caption. How: This names it every piece. */ }


							</div>


						</div>


					</div>


				</div>


			</div>


		</section>


	);


}

// #endregion AboSecCom

// #endregion Components



// #region Exports

export { AboSecCom }; // What: Named Export. Why: The home page tells Tony's story after the gallery. How: This exports AboSecCom.

// #endregion Exports


