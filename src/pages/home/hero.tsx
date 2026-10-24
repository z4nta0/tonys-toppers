


// #region Imports

import carWebUrl from './tony-cartoon.webp'; // What: Cartoon WebP URL. Why: The hero shows Tony's cartoon portrait, and Vite fingerprints and checks an imported image. How: This imports the image's built URL for the hero's img.
import cssModObj from './hero.module.css';   // What: CSS Module Object. Why: The hero is styled in its own module, whose class names Vite hashes. How: Every element reads its class from this object.


import { modCliFun    } from '../../ui/section-link.ts'; // What: Modified Click Function. Why: A button opened in a new tab should be left to the browser. How: scrSecFun steps aside when this is true.
import { PHO_SIZ_OBJ  } from './photo-sizes.ts';         // What: Photo Size Object. Why: The cartoon's img carries its intrinsic size, so the page doesn't shift while it loads. How: This looks up the cartoon's width and height.
import { useSecLinFun } from '../../ui/section-link.ts'; // What: Use Section Link Function. Why: Both hero buttons reach a section the same way the bar does. How: This returns visSecFun, which scrolls to the section.

// #endregion Imports



/**
 * hero.tsx = Hero
 *
 * @summary
 * The home page's opening section: Tony's headline and pitch, with buttons
 * into the page, such as the one to the collection, beside his cartoon
 * portrait in a slowly turning ring. Soft blurred blobs float behind it all.
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
 * Renders the hero. Its buttons reach their sections through scrSecFun, which
 * hands them to visSecFun, the same shared path the bar's links use, scrolling
 * in place and leaving a Ctrl, Cmd, Shift, Alt, or middle click to the
 * browser. The collection button is named by its words alone, so its
 * decorative arrow isn't read aloud, and the sticker, which only repeats the
 * headline, is hidden from screen readers.
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


	const visSecFun = useSecLinFun(); // What: Visit Section Function. Why: The hero's buttons reach their sections through the same shared path as the bar. How: This scrolls to the section on the home page, or navigates home to it from any other page.


	// #region scrSecFun

	/**
	 * scrSecFun = Scroll Section Function
	 *
	 * @summary
	 * Handles a click on either hero button. A Ctrl, Cmd, Shift, Alt, or
	 * middle click is left to the browser, which opens the button's own
	 * address. Any other click stops the browser's jump to the hash and hands
	 * the section's id to visSecFun, which scrolls to it without leaving the
	 * hash in the address.
	 *
	 * @author z4nta0 <https://github.com/z4nta0>
	 *
	 * @param cliEveObj - Click Event Object: The button's click event.
	 * @param secIdeStr - Section Identifier String: The section's id, e.g.
	 *                    'products'.
	 *
	 * @returns This function does not return anything.
	 *
	 * @example
	 * ```ts
	 * scrSecFun(cliEveObj, 'products') // => void
	 * ```
	 *
	*/

	const scrSecFun = ( cliEveObj : React.MouseEvent< HTMLAnchorElement >, secIdeStr : string ) => { // What: Scroll Section Function. Why: Both hero buttons scroll in place instead of jumping or leaving a hash in the address. How: This leaves a modified click to the browser, and otherwise cancels the link's own jump and hands the section to visSecFun.


		if ( modCliFun( cliEveObj ) ) return; // What: Modified Click Guard. Why: A Ctrl, Cmd, Shift, Alt, or middle click asks the browser to open the link its own way. How: This leaves the click alone.



		cliEveObj.preventDefault(); // What: Default Jump Cancel. Why: The browser would otherwise jump to the hash instantly and leave it in the address. How: This stops the link's own navigation.

		visSecFun( secIdeStr ); // What: Section Visit Call. Why: The visitor should land on the section the button names. How: This scrolls it into view.


	};

	// #endregion scrSecFun



	return (


		<section
			id='home'

			className={ cssModObj.homHerSec }
		>{ /* What: Home Hero Section Element. Why: The home page opens with the headline and pitch. How: Its id stays the plain word home, since the bar's Home link points at it and it can appear in the page's address. */ }


			<div className={` ${ cssModObj.herBloDiv }   ${ cssModObj.herBloDivYellow } `} />{ /* What: Hero Blob Div Yellow Element. Why: A soft yellow glow warms the hero's top left corner. How: This draws a blurred circle that floats slowly. */ }

			<div className={` ${ cssModObj.herBloDiv }   ${ cssModObj.herBloDivBlue } `} />{ /* What: Hero Blob Div Blue Element. Why: A soft blue glow balances the first in the bottom right corner. How: This draws a blurred circle that floats slowly, half a cycle behind the first. */ }



			<div className={ cssModObj.herInnDiv }>{ /* What: Hero Inner Div Element. Why: The text and the portrait sit side by side. How: This lays out the two columns, stacking them in one column with the portrait first at 900px wide and below. */ }


				<div>{ /* What: Hero Text Div Element. Why: The words read as one column. How: This stacks the eyebrow, headline, pitch, and buttons, with no styling of its own. */ }


					<span className={ cssModObj.herEyeSpa }>Handcrafted in Bolivar, Missouri</span>{ /* What: Hero Eyebrow Span Element. Why: Visitors should know where the pieces are made before anything else. How: This shows the town above the headline. */ }

					<h1 className={ cssModObj.herTitHea }>Crafted by hand &amp; <span className={ cssModObj.titAccSpa }>made with love.</span></h1>{ /* What: Hero Title Heading Element. Why: The headline sums up the business in one line. How: The second half sits in an italic accent with a highlight bar beneath it. */ }

					<p className={ cssModObj.herLedPar }>{ /* What: Hero Lede Paragraph Element. Why: A short pitch says what Tony makes and why it's special. How: This shows two sentences beneath the headline. */ }
						Tony Mawhiney designs and beads every piece by hand: color-coordinated, carefully
						chosen, and one of a kind. Small art for everyday moments.
					</p>

					<div className={ cssModObj.herActDiv }>{ /* What: Hero Actions Div Element. Why: The two main ways into the page sit together. How: This sets the buttons in a row, wrapping onto two lines at about 337px wide and below. */ }


						<a
							className={` ${ cssModObj.butBasAnc }   ${ cssModObj.butBasAncPrimary } `}

							href='/#products'

							aria-label='See the collection' // What: Collection Button Label. Why: Screen readers would otherwise read the decorative arrow aloud as right arrow. How: This names the button by its words alone, which still match what's shown.

							onClick={ ( cliEveObj ) => scrSecFun( cliEveObj, 'products' ) }
						>{ /* What: Button Base Anchor Primary Element. Why: The collection is the main thing a visitor came to see. How: This scrolls to the products section through scrSecFun. */ }
							See the collection →
						</a>

						<a
							className={` ${ cssModObj.butBasAnc }   ${ cssModObj.butBasAncSecondary } `}

							href='/#about'

							onClick={ ( cliEveObj ) => scrSecFun( cliEveObj, 'about' ) }
						>{ /* What: Button Base Anchor Secondary Element. Why: Visitors want to meet the maker. How: This scrolls to Tony's story through scrSecFun. */ }
							Meet Tony
						</a>


					</div>


				</div>


				<div className={ cssModObj.herVisDiv }>{ /* What: Hero Visual Div Element. Why: Tony's cartoon portrait is the hero's picture. How: This holds the portrait ring and the sticker beside it. */ }


					<div className={ cssModObj.porRinDiv }>{ /* What: Portrait Ring Div Element. Why: The portrait sits in a round frame with a slowly turning ring. How: This frames the image. */ }


						<img
							className={ cssModObj.porCarIma }

							height={ PHO_SIZ_OBJ[ 'tony-cartoon' ].heiNum }
							src={ carWebUrl }
							width={ PHO_SIZ_OBJ[ 'tony-cartoon' ].widNum }

							alt='Cartoon illustration of Tony'
						/>{ /* What: Portrait Cartoon Image Element. Why: The hero shows Tony as his cartoon. How: This loads the cartoon portrait. */ }


					</div>

					<div
						className={ cssModObj.herStiDiv }

						aria-hidden='true'
					>{ /* What: Hero Sticker Div Element. Why: A round sticker adds a warm note beside the portrait. How: This shows three short lines, hidden from screen readers, since it only repeats the headline's made with love and its heart would be read aloud. */ }
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


