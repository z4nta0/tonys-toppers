


// #region Imports

import cssModObj from './footer.module.css'; // What: CSS Module Object. Why: The footer is styled in its own module, whose class names Vite hashes. How: Each element with a class reads it from this object.

// #endregion Imports



/**
 * footer.tsx = Footer
 *
 * @summary
 * The site's footer: one line about the business, wrapping at about 506px
 * wide and below, and ending in Tony's phone number, which dials on phones. It
 * reads the current year each time it renders, so the copyright never goes
 * stale.
 *
 * Sections:
 *  - Components
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Components

// #region SitFooCom

/**
 * SitFooCom = Site Footer Component
 *
 * @summary
 * Renders the footer's line, which wraps at about 506px wide and below: the
 * copyright with the current year, the business name, Bolivar, Missouri, and
 * the phone number as a click-to-call link. The line is one run of text, so
 * it stays on one source line, where JSX keeps the spaces between its words
 * and the link.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The footer element.
 *
 * @example
 * ```tsx
 * SitFooCom() // => <SitFooCom />
 * ```
 *
*/

function SitFooCom () : React.JSX.Element {


	const curYeaNum = new Date().getFullYear(); // What: Current Year Number. Why: The copyright line names the current year. How: This reads it from today's date.



	return (


		<footer className={ cssModObj.sitFooFoo }>{ /* What: Site Footer Footer Element. Why: The footer closes the page with the business's name, hometown, and phone number. How: This holds the footer's line, which wraps at about 506px wide and below. */ }


			<p>© { curYeaNum } Tony's Toppers · Handcrafted in Bolivar, Missouri · <a className={ cssModObj.fooPhoAnc } href='tel:4177330681'>(417) 733-0681</a></p>{ /* What: Footer Copyright Paragraph Element. Why: The footer names the year, the business, and where Tony works, and ends in a way to reach him. How: This prints the current year read on each render, with the phone number as a link that dials it on phones. */ }


		</footer>


	);


}

// #endregion SitFooCom

// #endregion Components



// #region Exports

export { SitFooCom }; // What: Named Export. Why: The footer is shared, so it's rendered from outside this file. How: This exports SitFooCom.

// #endregion Exports


