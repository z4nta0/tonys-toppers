


// #region Imports

import carWebUrl from './tony-cartoon.webp'; // What: Cartoon WebP URL. Why: The hero shows Tony's cartoon portrait, and Vite fingerprints and checks an imported image. How: This imports the image's built URL for the hero's img.
import cssModObj from './hero.module.css';   // What: CSS Module Object. Why: The hero is styled in its own module, whose class names Vite hashes. How: Every element reads its class from this object.


import { PHO_SIZ_OBJ  } from './photo-sizes.ts';         // What: Photo Size Object. Why: The cartoon's img carries its intrinsic size, so the page doesn't shift while it loads. How: This looks up the cartoon's width and height.
import { useSecCliFun } from '../../ui/section-link.ts'; // What: Use Section Click Function. Why: Both hero buttons reach a section the same way the bar does. How: This returns secCliFun, the shared section link click handler.

// #endregion Imports



/**
 * hero.tsx = Hero
 *
 * @summary
 * The home page's opening section: Tony's headline and pitch, with buttons
 * into the page, such as the one to the collection, beside his cartoon
 * portrait, which drifts slowly in a small circle, or below it at 900px wide
 * and below. Soft blurred blobs float behind it all.
 *
 * Sections:
 *  - Components
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Components

// #region HerSecCom

/**
 * HerSecCom = Hero Section Component
 *
 * @summary
 * Renders the hero. Its buttons reach their sections through secCliFun, the
 * click handler the bar's links share, scrolling in place and leaving a Ctrl,
 * Cmd, Shift, Alt, or middle click to the browser. The collection button is
 * named by its words alone, so its decorative arrow isn't read aloud, and the
 * sticker, which only repeats the headline, is hidden from screen readers.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The hero's section element.
 *
 * @example
 * ```tsx
 * HerSecCom() // => <HerSecCom />
 * ```
 *
*/

function HerSecCom () : React.JSX.Element {


	const secCliFun = useSecCliFun(); // What: Section Click Function. Why: The hero's buttons reach their sections the same way the bar's links do. How: This is the shared click handler, which leaves a modified click to the browser and otherwise scrolls to the section.



	return (


		<section
			id='home'

			className={ cssModObj.homHerSec }
		>{ /* What: Home Hero Section Element. Why: The home page opens with the headline and pitch. How: Its id stays the plain word home, since the bar's Home link points at it and it can appear in the page's address. */ }


			<div className={` ${ cssModObj.herBloDiv }   ${ cssModObj.herBloDivYellow } `} />{ /* What: Hero Blob Div Yellow Element. Why: A soft yellow glow warms the hero's top-left corner. How: This draws a blurred circle that floats slowly. */ }

			<div className={` ${ cssModObj.herBloDiv }   ${ cssModObj.herBloDivBlue } `} />{ /* What: Hero Blob Div Blue Element. Why: A soft blue glow balances the first in the bottom-right corner. How: This draws a blurred circle that floats slowly, half a cycle behind the first. */ }



			<div className={ cssModObj.herInnDiv }>{ /* What: Hero Inner Div Element. Why: The text and the portrait sit side by side. How: This lays out the two columns, stacking them in one column with the portrait first at 900px wide and below. */ }


				<div>{ /* What: Hero Text Div Element. Why: The words read as one column. How: This stacks the eyebrow, headline, pitch, and buttons, with no styling of its own. */ }


					<span className={ cssModObj.herEyeSpa }>Handcrafted in Bolivar, Missouri</span>{ /* What: Hero Eyebrow Span Element. Why: Visitors should know where the pieces are made before anything else. How: This shows the town above the headline. */ }

					<h1 className={ cssModObj.herTitHea }>Crafted by hand & <span className={ cssModObj.titAccSpa }>made with love.</span></h1>{ /* What: Hero Title Heading Element. Why: The headline sums up the business in one sentence. How: The second half sits in an italic accent with a highlight bar beneath it. */ }

					<p className={ cssModObj.herLedPar }>{ /* What: Hero Lede Paragraph Element. Why: A short pitch says what Tony makes and why it's special. How: This shows two sentences beneath the headline. */ }
						Tony Mawhiney designs and beads every piece by hand: color-coordinated, carefully
						chosen, and one of a kind. Small art for everyday moments.
					</p>

					<div className={ cssModObj.herActDiv }>{ /* What: Hero Actions Div Element. Why: The two main ways into the page sit together. How: This sets the buttons in a row, wrapping onto two lines at about 337px wide and below. */ }


						<a
							className={` ${ cssModObj.butBasAnc }   ${ cssModObj.butBasAncPrimary } `}

							href='/#products'

							aria-label='See the collection' // What: Collection Button Label. Why: Screen readers would otherwise read the decorative arrow aloud as right arrow. How: This names the button by its words alone, which still match what's shown.

							onClick={ ( cliEveObj ) => secCliFun( cliEveObj, 'products' ) }
						>{ /* What: Button Base Anchor Primary Element. Why: The collection is the main thing a visitor came to see. How: This scrolls to the Products section through secCliFun. */ }
							See the collection →
						</a>

						<a
							className={` ${ cssModObj.butBasAnc }   ${ cssModObj.butBasAncSecondary } `}

							href='/#about'

							onClick={ ( cliEveObj ) => secCliFun( cliEveObj, 'about' ) }
						>{ /* What: Button Base Anchor Secondary Element. Why: Visitors want to meet the maker. How: This scrolls to Tony's story through secCliFun. */ }
							Meet Tony
						</a>


					</div>


				</div>


				<div className={ cssModObj.herVisDiv }>{ /* What: Hero Visual Div Element. Why: Tony's cartoon portrait is the hero's picture. How: This holds the portrait ring and the sticker on its corner. */ }


					<div className={ cssModObj.porRinDiv }>{ /* What: Portrait Ring Div Element. Why: The portrait sits in a round frame that drifts slowly in a small circle. How: This frames the image. */ }


						<img
							className={ cssModObj.porCarIma }

							height={ PHO_SIZ_OBJ[ 'tony-cartoon' ].heiNum } // What: Intrinsic Image Size. Why: The browser should hold the image's space before it loads, so nothing below it shifts. How: The width and height give its aspect ratio, while the CSS still sets its displayed size.
							src={ carWebUrl }
							width={ PHO_SIZ_OBJ[ 'tony-cartoon' ].widNum } // What: Intrinsic Image Size. Why: The browser should hold the image's space before it loads, so nothing below it shifts. How: The width and height give its aspect ratio, while the CSS still sets its displayed size.

							alt='Cartoon illustration of Tony'
						/>{ /* What: Portrait Cartoon Image Element. Why: The hero shows Tony as his cartoon. How: This loads the cartoon portrait. */ }


					</div>

					<div
						className={ cssModObj.herStiDiv }

						aria-hidden='true'
					>{ /* What: Hero Sticker Div Element. Why: A round sticker adds a warm note on the portrait's corner. How: This shows three short lines, hidden from screen readers, since it only repeats the headline's "made with love", and its heart symbol would be read aloud. */ }
						Made<br />with<br />love ♥
					</div>


				</div>


			</div>


		</section>


	);


}

// #endregion HerSecCom

// #endregion Components



// #region Exports

export { HerSecCom }; // What: Named Export. Why: The home page opens with the hero. How: This exports HerSecCom.

// #endregion Exports


