



// #region Imports

import logSvgUrl from './logo.svg';          // What: Logo SVG URL. Why: The About section shows the Tony's Toppers logo beside his portrait, and Vite fingerprints and checks an imported image. How: This imports the logo's built URL for its img.
import porJpgUrl from './tony-portrait.jpg'; // What: Portrait JPG URL. Why: The About section shows Tony's portrait, and Vite fingerprints and checks an imported image. How: This imports the photo's built URL for its img.

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

			className='section about-section'
		>{ /* What: About Section Element. Why: Visitors want to meet the maker. How: Its id stays the plain word about, since the bar and the hero link to it and it can appear in the page's address. */ }


			<div className='container'>{ /* What: About Container Div Element. Why: The section's content lines up with the page's width. How: This centers it at a capped width. */ }


				<div className='bio-grid'>{ /* What: Biography Grid Div Element. Why: The portrait and the story sit side by side on wide screens. How: This lays out the two columns. */ }


					<div className='bio-photo-wrap'>{ /* What: Biography Photo Wrap Div Element. Why: The portrait and its logo badge read as one picture. How: This holds both, the badge overlapping the portrait's corner. */ }


						<div className='bio-photo'>{ /* What: Biography Photo Div Element. Why: The portrait sits in a tilted frame. How: This frames the photo. */ }


							<img
								src={ porJpgUrl }

								alt='Portrait of Tony Mawhiney'
							/>{ /* What: Biography Portrait Image Element. Why: Visitors see who Tony is. How: This loads his portrait. */ }


						</div>

						<div className='bio-cartoon'>{ /* What: Biography Cartoon Div Element. Why: A round logo badge marks the portrait as Tony's Toppers. How: This frames the logo over the portrait's corner. */ }


							<img
								src={ logSvgUrl }

								alt="Tony's Toppers logo"
							/>{ /* What: Biography Logo Image Element. Why: The badge shows the business's logo. How: This loads the full logo. */ }


						</div>


					</div>



					<div className='bio-content'>{ /* What: Biography Content Div Element. Why: The story reads as one column. How: This stacks the label, name, paragraphs, and stats. */ }


						<div className='section-label'>Meet the Maker</div>{ /* What: About Label Div Element. Why: A small label names the section. How: This shows it above the name. */ }

						<h2>Tony Mawhiney: <em>artist, crafter, kind soul.</em></h2>{ /* What: About Heading Element. Why: The heading names Tony and sums him up. How: The description sits in an italic accent. */ }

						<p>
							Tony is a { tonAgeNum }-year-old young man with Down syndrome living in Bolivar, Missouri. He's quiet at first, but
							once you know him you won't find a kinder, more polite person, and you wouldn't have
							to look hard to know it.
						</p>{ /* What: Introduction Paragraph Element. Why: The story opens with who Tony is. How: This gives his age, read on each render, his home town, and his character, with a drop cap on its first letter. */ }

						<p>
							After graduating high school, Tony moved to Grandview, MO, where he had his own
							apartment and attended Longview Jr. College through the Ace program. He's always been
							artistic and crafty. In high school, a painting of his was chosen through a contest
							that traveled around Missouri for a year before being hung in the State Capitol.
						</p>{ /* What: Background Paragraph Element. Why: Tony's art started long before the business. How: This tells of his schooling and his painting in the State Capitol. */ }

						<p>
							A while back, a friend showed him some beaded pens she'd made and he mentioned he'd
							love to try it. She sent him a starter package (assorted beads, silicone shapes, and
							a few pens), and he was hooked. He carefully chose and color-coordinated every bead
							on that very first pen, and that was the beginning of his business.
						</p>{ /* What: Beginning Paragraph Element. Why: Visitors like to know how the business began. How: This tells of the first beaded pen. */ }

						<p>
							Since that day Tony has grown his inventory of beads, expanded into wine stoppers
							alongside the pens, and named his business <strong>Tony's Toppers</strong>. He's very
							proud of it, and he loves sharing pictures of finished pieces with friends and
							family. They're all made with love.
						</p>{ /* What: Growth Paragraph Element. Why: The story ends with where the business is now. How: This tells of the wine stoppers, the name, and his pride in it. */ }


						<div className='bio-stats'>{ /* What: Biography Stats Div Element. Why: Three short facts round off the story. How: This sets them in a row beneath the paragraphs. */ }


							<div className='bio-stat'>{ /* What: Age Stat Div Element. Why: Tony's age is a fun fact. How: This shows it above its caption. */ }


								<span className='num'>{ tonAgeNum }</span>{ /* What: Age Number Span Element. Why: The stat's figure leads. How: This shows Tony's age, read on each render. */ }

								<div className='label'>Years young</div>{ /* What: Age Label Div Element. Why: The figure needs a caption. How: This names it years young. */ }


							</div>

							<div className='bio-stat'>{ /* What: Handmade Stat Div Element. Why: Every piece is made by hand. How: This shows the figure above its caption. */ }


								<span className='num'>100%</span>{ /* What: Handmade Number Span Element. Why: The stat's figure leads. How: This shows 100%. */ }

								<div className='label'>Handmade</div>{ /* What: Handmade Label Div Element. Why: The figure needs a caption. How: This names it handmade. */ }


							</div>

							<div className='bio-stat'>{ /* What: One Of One Stat Div Element. Why: No two pieces are the same. How: This shows the figure above its caption. */ }


								<span className='num'>1of1</span>{ /* What: One Of One Number Span Element. Why: The stat's figure leads. How: This shows 1of1. */ }

								<div className='label'>Every piece</div>{ /* What: One Of One Label Div Element. Why: The figure needs a caption. How: This names it every piece. */ }


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

export { AboSecCom }; // What: Named Exports. Why: The home page tells Tony's story after the gallery. How: This exports AboSecCom.

// #endregion Exports


