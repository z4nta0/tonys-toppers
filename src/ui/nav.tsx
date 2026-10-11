


// #region Imports

import cssModObj from './nav.module.css';  // What: CSS Module Object. Why: The bar is styled in its own module, whose class names Vite hashes. How: Every element reads its class from this object.
import lntSvgUrl from './logo-notext.svg'; // What: Logo-No-Text SVG URL. Why: The bar shows the logo's mark without its wordmark, and Vite fingerprints and checks an imported image. How: This imports the mark's built URL for the brand's img.


import { Link         } from 'react-router';      // What: Link. Why: The brand returns to the home page without a full page load. How: This renders the brand as a router link to the root.
import { modCliFun    } from './section-link.ts'; // What: Modified Click Function. Why: A section link opened in a new tab should be left to the browser. How: navSecFun steps aside when this is true.
import { useEffect    } from 'react';             // What: Use Effect. Why: The bar listens to scrolling and watches the sections. How: Two effects register and clean up those watchers.
import { useLocation  } from 'react-router';      // What: Use Location. Why: Only the home page has sections to track and mark active. How: This reads the current path.
import { useRef       } from 'react';             // What: Use Ref. Why: The open menu's effect has to reach the bar, the scrim, and the toggle. How: Three refs hold them.
import { useSecLinFun } from './section-link.ts'; // What: Use Section Link Function. Why: Section links have to work from every page, not only the home page. How: This returns visSecFun, which scrolls in place or navigates home.
import { useState     } from 'react';             // What: Use State. Why: The bar remembers its scrolled look, its active link, and whether the phone menu is open. How: Three state pairs hold them.

// #endregion Imports



/**
 * nav.tsx = Navigation Bar
 *
 * @summary
 * The site's fixed top bar: the brand, which returns to the home page, a link
 * to each home page section, and a toggle that opens those links as a menu on
 * a phone. The bar turns into a raised pill once the page scrolls, and on the
 * home page it marks the link for the section being read. On a phone the menu
 * also offers a button to call or text Tony, his Facebook page, and his home
 * town, over a scrim that dims the page. Every page renders it above its
 * content.
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

const NAV_SEC_ARR = [ // What: Navigation Section Array. Why: The bar links to every home page section, in page order. How: Each row names a section's id, which its link goes to, and the link's label.


	{ ideStr : 'home',     labStr : 'Home'        }, // What: Home Section Row. Why: The hero is where a visitor starts. How: This links to the hero's home id.
	{ ideStr : 'products', labStr : 'Products'    }, // What: Products Section Row. Why: The collection is the site's main content. How: This links to the products section.
	{ ideStr : 'fairs',    labStr : 'Craft Fairs' }, // What: Fairs Section Row. Why: The craft fair gallery shows where to find Tony. How: This links to the gallery.
	{ ideStr : 'about',    labStr : 'About Tony'  }, // What: About Section Row. Why: Visitors want to meet the maker. How: This links to Tony's story.
	{ ideStr : 'contact',  labStr : 'Contact'     }  // What: Contact Section Row. Why: The page ends where visitors reach Tony. How: This links to the contact section.


];

// #endregion Constants



// #region Components

// #region NavBarCom

/**
 * NavBarCom = Navigation Bar Component
 *
 * @summary
 * Renders the bar. Scrolling more than 20px gives it its raised look. On the
 * home page an IntersectionObserver marks the link for the section whose top
 * has crossed a band about a quarter of the way down the screen, while every
 * other page marks none. On a phone the links sit in a menu the toggle opens,
 * over a scrim that dims the page behind it, and choosing a link, tapping the
 * scrim, pressing Escape, or widening the screen past the menu's breakpoint
 * closes it. While it's open the page behind it is inert, so keyboard and
 * screen reader users stay in the bar. Each link reaches its section through
 * section-link.ts, scrolling in place on the home page or navigating home from
 * any other page, and leaves a Ctrl, Cmd, Shift, Alt, or middle click to the
 * browser.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The scrim and the bar's nav element.
 *
 * @example
 * ```tsx
 * NavBarCom() // => <NavBarCom />
 * ```
 *
*/

function NavBarCom () : React.JSX.Element {


	const { pathname : patNamStr } = useLocation(); // What: Path Name String. Why: Only the home page has sections to track. How: This reads the current path, renaming the router's pathname key.

	const isaHomBoo = patNamStr === '/'; // What: Is-A Home Boolean. Why: No link is active away from the home page. How: This is true when the path is the site's root.



	// #region Scrolled Look

	const [ isaScrBoo, setIsaScrBoo ] = useState( false ); // What: Is-A Scrolled Boolean And Setter. Why: The bar raises into a pill once content starts sliding under it. How: This holds whether the page has scrolled past the threshold.


	useEffect( () => { // What: Scroll Listener Effect. Why: The bar's look follows the scroll position. How: This sets the look for the current position, then registers the handler and removes it when the bar unmounts.


		const scrStaFun = () => setIsaScrBoo( window.scrollY > 20 ); // What: Scroll State Function. Why: The bar should raise as soon as the page moves. How: This marks it scrolled once the page has moved more than 20px.


		scrStaFun(); // What: Initial Scroll Call. Why: A page opened partway down should start with the raised bar. How: This reads the current position once.

		window.addEventListener( 'scroll', scrStaFun ); // What: Scroll Listener Registration. Why: The look has to follow every scroll. How: This runs scrStaFun on each one.



		return () => window.removeEventListener( 'scroll', scrStaFun ); // What: Scroll Listener Cleanup. Why: An unmounted bar shouldn't keep handling scrolls. How: This removes the listener.


	}, [] ); // What: Effect Dependency Array. Why: The listener only has to be registered once. How: An empty list runs the effect on mount and its cleanup on unmount.

	// #endregion Scrolled Look



	// #region Active Section Tracking

	const [ actSecStr, setActSecStr ] = useState( 'home' ); // What: Active Section String And Setter. Why: The link for the section being read is marked active. How: This holds that section's id, starting at the top of the page.


	useEffect( () => { // What: Section Observer Effect. Why: The active link follows the section being read, but only the home page has sections. How: This watches every section the bar links to while on the home page, and stops watching when the path changes.


		if ( !isaHomBoo ) return; // What: Home Page Guard. Why: Other pages have no sections to watch. How: This skips the observer away from the home page.



		const secEleArr = NAV_SEC_ARR.map( ( secRecObj ) => document.getElementById( secRecObj.ideStr ) ).filter( ( secCurEle ) : secCurEle is HTMLElement => secCurEle !== null ); // What: Section Element Array. Why: Only sections on the page can be watched. How: This looks up each linked section by its id and keeps the ones found.


		if ( secEleArr.length === 0 ) return; // What: No Sections Guard. Why: There's nothing to watch if no section rendered. How: This skips the observer.



		const intObsObj = new IntersectionObserver( ( entObjArr ) => { // What: Intersection Observer Object. Why: A section's top crossing the band below the bar marks it as the one being read. How: This reports sections entering or leaving the band and marks the highest one inside it.


			const visEntArr = entObjArr.filter( ( entCurObj ) => entCurObj.isIntersecting ).sort( ( entOneObj, entTwoObj ) => entOneObj.boundingClientRect.top - entTwoObj.boundingClientRect.top ); // What: Visible Entry Array. Why: Several sections can sit in the band at once, and the highest is the one being read. How: This keeps the sections inside the band, sorted from the top of the screen down.


			if ( visEntArr[ 0 ] ) setActSecStr( visEntArr[ 0 ].target.id ); // What: Active Section Update. Why: Its link should be marked active. How: This stores the highest visible section's id, and leaves the active link alone when none is in the band.


		}, { rootMargin : '-25% 0px -65% 0px', threshold : 0 } ); // What: Observer Options. Why: A section counts as being read once its top is a quarter of the way down the screen. How: This shrinks the watched band to the strip from 25% to 35% of the screen's height, reporting any overlap at all.


		secEleArr.forEach( ( secCurEle ) => intObsObj.observe( secCurEle ) ); // What: Section Observe Loop. Why: Every section has to be watched. How: This hands each one to the observer.



		return () => intObsObj.disconnect(); // What: Observer Cleanup. Why: A bar away from the home page, or unmounted, shouldn't keep watching. How: This stops watching every section.


	}, [ isaHomBoo ] ); // What: Effect Dependency Array. Why: The sections only exist on the home page. How: isaHomBoo changes when the visitor arrives at or leaves the home page, which starts or stops the observer.

	// #endregion Active Section Tracking



	// #region Menu And Section Links

	const [ menOpeBoo, setMenOpeBoo ] = useState( false ); // What: Menu Open Boolean And Setter. Why: The phone menu opens and closes from its toggle. How: This holds whether it's open, starting closed.

	const cloMenFun = () => setMenOpeBoo( false ); // What: Close Menu Function. Why: The menu should get out of the way once a link is chosen. How: This closes it.
	const visSecFun = useSecLinFun();              // What: Visit Section Function. Why: Every section link reaches its section through one shared path. How: This scrolls to the section on the home page, or navigates home to it from any other page.



	const navBarRef = useRef< HTMLElement >( null );       // What: Navigation Bar Reference. Why: The open menu leaves the bar usable while it makes the rest of the page inert. How: This attaches to the nav element.
	const scrDivRef = useRef< HTMLDivElement >( null );    // What: Scrim Div Reference. Why: The scrim has to stay tappable while the page behind it is inert. How: This attaches to the scrim.
	const togButRef = useRef< HTMLButtonElement >( null ); // What: Toggle Button Reference. Why: Escape puts focus back on the toggle, and a hidden toggle means the menu no longer applies. How: This attaches to the toggle.


	useEffect( () => { // What: Open Menu Effect. Why: The open menu sits over a dimmed page, so keyboard and screen reader users should stay in the bar until it closes, and it needs the usual ways out. How: While the menu is open, this makes the bar's siblings inert, closes the menu on Escape with focus back on the toggle, and closes it if the screen widens until the toggle hides.


		if ( !menOpeBoo ) return; // What: Closed Menu Guard. Why: Only the open menu changes the rest of the page. How: This leaves everything alone while the menu is closed.



		const navBarEle = navBarRef.current!; // What: Navigation Bar Element. Why: The bar stays usable. How: This reads the bar. // What: Non-Null Note. Why: TypeScript can't see the ref is attached. How: Effects run after the bar has mounted.
		const scrDivEle = scrDivRef.current!; // What: Scrim Div Element. Why: The scrim stays tappable to close the menu. How: This reads the scrim. // What: Non-Null Note. Why: TypeScript can't see the ref is attached. How: Effects run after the scrim has mounted.
		const sibEleArr = Array.from( navBarEle.parentElement!.children ).filter( ( sibCurEle ) => sibCurEle !== navBarEle && sibCurEle !== scrDivEle ); // What: Sibling Element Array. Why: The page's main content and footer sit beside the bar. How: This lists every sibling except the bar and the scrim. // What: Non-Null Note. Why: An element's parent can be missing in general. How: The bar always renders inside the app's mount element.
		const togButEle = togButRef.current!; // What: Toggle Button Element. Why: Escape returns focus here, and its visibility says whether the menu still applies. How: This reads the toggle. // What: Non-Null Note. Why: TypeScript can't see the ref is attached. How: Effects run after the toggle has mounted.


		const onKeyDowFun = ( keyEveObj : KeyboardEvent ) => { // What: On Key Down Function. Why: Escape is the expected way out of a layer over the page. How: This closes the menu and puts focus back on the toggle when Escape is pressed.


			if ( keyEveObj.key !== 'Escape' ) return; // What: Escape Key Guard. Why: Only Escape closes the menu. How: This ignores every other key.



			setMenOpeBoo( false ); // What: Menu Close Call. Why: Escape closes the menu. How: This sets the menu state to closed.

			togButEle.focus(); // What: Toggle Focus Call. Why: Focus would otherwise be left inside the closing menu. How: This moves it to the toggle, where the visitor opened the menu.


		};


		const onResWinFun = () => { if ( !togButEle.getClientRects().length ) setMenOpeBoo( false ); }; // What: On Resize Window Function. Why: A screen widened past the menu's breakpoint hides the toggle, which would leave the page inert with no way to close the menu. How: This closes the menu once the toggle has no box.


		for ( const sibCurEle of sibEleArr ) sibCurEle.setAttribute( 'inert', '' ); // What: Sibling Inert Loop. Why: Content under the scrim shouldn't take focus or be read while the menu is open. How: This marks each sibling inert, removing it from the tab order and the accessibility tree.



		document.addEventListener( 'keydown', onKeyDowFun ); // What: Key Down Listener Registration. Why: Escape should close the menu wherever focus is. How: This listens on the whole document.
		window.addEventListener( 'resize', onResWinFun );    // What: Resize Listener Registration. Why: Widening the screen can hide the toggle. How: This rechecks on every resize.



		return () => { // What: Open Menu Cleanup. Why: Closing the menu gives the page back. How: This removes the inert marks and both listeners.


			for ( const sibCurEle of sibEleArr ) sibCurEle.removeAttribute( 'inert' ); // What: Sibling Restore Loop. Why: The page has to be usable again once the menu closes. How: This removes each sibling's inert mark.



			document.removeEventListener( 'keydown', onKeyDowFun ); // What: Key Down Listener Cleanup. Why: Escape should do nothing once the menu is closed. How: This removes the listener.
			window.removeEventListener( 'resize', onResWinFun );    // What: Resize Listener Cleanup. Why: Resizing doesn't matter once the menu is closed. How: This removes the listener.


		};


	}, [ menOpeBoo ] ); // What: Effect Dependency Array. Why: The page's inert state and the listeners have to follow the menu opening and closing. How: menOpeBoo changing reruns the effect, which applies them while it's true and its cleanup removes them.


	// #region navSecFun

	/**
	 * navSecFun = Navigate Section Function
	 *
	 * @summary
	 * Handles a click on any section link. A Ctrl, Cmd, Shift, Alt, or middle
	 * click is left to the browser, which opens the link's own address. Any
	 * other click stops the browser's navigation, hands the section's id to
	 * visSecFun, which scrolls to it on the home page or navigates home to it
	 * from any other page, and closes the menu.
	 *
	 * @author z4nta0 <https://github.com/z4nta0>
	 *
	 * @param cliEveObj - Click Event Object: The link's click event.
	 * @param secIdeStr - Section Identifier String: The section's id, e.g.
	 *                    'about'.
	 *
	 * @returns This function does not return anything.
	 *
	 * @example
	 * ```ts
	 * navSecFun(cliEveObj, 'about') // => void
	 * ```
	 *
	*/

	const navSecFun = ( cliEveObj : React.MouseEvent< HTMLAnchorElement >, secIdeStr : string ) => { // What: Navigate Section Function. Why: A section link should reach its section without a full page load or a hash left in the address. How: This leaves a modified click to the browser, and otherwise cancels the link's own navigation, visits the section, and closes the menu.


		if ( modCliFun( cliEveObj ) ) return; // What: Modified Click Guard. Why: A Ctrl, Cmd, Shift, Alt, or middle click asks the browser to open the link its own way. How: This leaves the click alone.



		cliEveObj.preventDefault(); // What: Default Navigation Cancel. Why: The browser would otherwise jump or reload and leave the hash in the address. How: This stops the link's own navigation.

		visSecFun( secIdeStr ); // What: Section Visit Call. Why: The visitor should land on the section they chose. How: This scrolls to it, or navigates home to it from another page.

		cloMenFun(); // What: Menu Close Call. Why: The menu should get out of the way once a link is chosen. How: This closes it.


	};

	// #endregion navSecFun

	// #endregion Menu And Section Links



	return (


		<>{ /* What: Navigation Fragment Element. Why: The scrim and the bar render side by side, the scrim first. How: This groups them without adding a wrapper element. */ }


			<div
				ref={ scrDivRef }

				className={ cssModObj.navScrDiv }

				data-mobile-menu-open={ menOpeBoo || undefined } // What: Mobile Menu Open Flag. Why: The scrim fades in only while the menu is open. How: This marks the scrim while menOpeBoo is true, and drops the attribute otherwise.

				aria-hidden='true'

				onClick={ cloMenFun }
			/>{ /* What: Navigation Scrim Div Element. Why: The open menu should stand apart from the dimmed page, and a tap anywhere on the page should close it. How: This covers the page under the bar, dimmed while the menu is open, closing the menu when tapped, and hidden from screen readers since Escape and the toggle do the same. */ }



			<nav
				ref={ navBarRef }

				className={ cssModObj.navBarNav }

				data-page-scroll-active={ isaScrBoo || undefined } // What: Page Scroll Active Flag. Why: The bar raises into a pill once the page scrolls. How: This marks the bar while isaScrBoo is true, and drops the attribute otherwise.
			>{ /* What: Container Nav Element. Why: Every page starts with the shared bar. How: This holds the brand, the phone menu toggle, and the menu, with the toggle ahead of the menu so a keyboard user's next Tab after opening it lands on the first link, carrying data-page-scroll-active once the page scrolls. */ }


				<Link
					className={ cssModObj.navBraAnc }

					to='/'

					onClick={ cloMenFun }
				>{ /* What: Brand Link. Why: The brand is the way back to the home page. How: This links to the root and closes the phone menu. */ }


					<img
						className={ cssModObj.navLogIma }

						src={ lntSvgUrl }

						alt="Tony's Toppers logo"
					/>{ /* What: Brand Mark Image Element. Why: The bar opens with the Tony's Toppers mark. How: This shows the mark without its wordmark, since the name sits right beside it. */ }

					<span>Tony's Toppers</span>{ /* What: Brand Name Span Element. Why: The bar names the business. How: This shows the name beside the mark. */ }


				</Link>



				<button
					ref={ togButRef }

					className={ cssModObj.navTogBut }

					type='button'

					aria-expanded={ menOpeBoo }
					aria-label='Toggle menu'

					onClick={ () => setMenOpeBoo( ( preOpeBoo ) => !preOpeBoo ) }
				>{ /* What: Menu Toggle Button Element. Why: On a phone the section links sit in a menu. How: This opens or closes it, and tells screen readers whether it's open. */ }


					<span className={ cssModObj.togBarSpa } />{ /* What: Toggle Bar Span Element. Why: The toggle draws as three bars. How: This is one of them. */ }

					<span className={ cssModObj.togBarSpa } />{ /* What: Toggle Bar Span Element. Why: The toggle draws as three bars. How: This is one of them. */ }

					<span className={ cssModObj.togBarSpa } />{ /* What: Toggle Bar Span Element. Why: The toggle draws as three bars. How: This is one of them. */ }


				</button>



				<div
					className={ cssModObj.navMenDiv }

					data-mobile-menu-open={ menOpeBoo || undefined } // What: Mobile Menu Open Flag. Why: On a phone the menu drops down only while it's open. How: This marks the menu while menOpeBoo is true, and drops the attribute otherwise.
				>{ /* What: Navigation Menu Div Element. Why: On a phone the section links and the ways to reach Tony drop down together as one menu, while on wide screens the links sit in the bar. How: This holds the link list and the contact block, carrying data-mobile-menu-open while the menu is open. */ }


					<ul className={ cssModObj.navLinUno }>{ /* What: Navigation Links List Element. Why: The section links sit in a row on wide screens and stack in the menu on a phone. How: This holds one item per section. */ }


						{ NAV_SEC_ARR.map( ( secRecObj, secIndNum ) => ( // What: Section Link Map. Why: Each section gets a link, and its place sets when it rises into the open menu. How: This renders one list item per section row, with its index.


							<li
								key={ secRecObj.ideStr }

								className={ cssModObj.navLinIte }

								style={ { '--nav-ite-ind' : secIndNum } as React.CSSProperties } // Navigation Item Index, the item's place in the list // What: Type Assertion Note. Why: React's style type doesn't list custom properties. How: The object holds only this one custom property, which React sets as written.
							>{ /* What: Navigation Link Item Element. Why: Each link is one item of the list. How: This holds the section's link, and hands its place to the menu's staggered entrance. */ }


								<a
									className={ cssModObj.navLinAnc }

									data-section-link-active={ ( isaHomBoo && actSecStr === secRecObj.ideStr ) || undefined } // What: Section Link Active Flag. Why: The link for the section being read is marked on the home page. How: This marks the link when its section is the active one there, and drops the attribute otherwise.

									href={ `/#${ secRecObj.ideStr }` }

									onClick={ ( cliEveObj ) => navSecFun( cliEveObj, secRecObj.ideStr ) }
								>{ /* What: Section Link Anchor Element. Why: Each link takes the visitor to its section. How: Its address points at the home page's section, which a modified click opens, while a plain click goes through navSecFun. */ }
									{ secRecObj.labStr }
								</a>


							</li>


						))}


					</ul>


					<div
						className={ cssModObj.menConDiv }

						style={ { '--nav-ite-ind' : NAV_SEC_ARR.length } as React.CSSProperties } // Navigation Item Index, after the last link // What: Type Assertion Note. Why: React's style type doesn't list custom properties. How: The object holds only this one custom property, which React sets as written.
					>{ /* What: Menu Contact Div Element. Why: Most people opening the menu on a phone want to reach Tony or find a section, so the menu ends with the ways to reach him. How: This holds the call button, the Facebook link, and Tony's home town, rising in after the last link, and shows only in the phone menu. */ }


						<a
							className={ cssModObj.menCalAnc }

							href='tel:4177330681'
						>{ /* What: Menu Call Anchor Element. Why: Calling or texting is the quickest way to reach Tony. How: This dials his number on phones. */ }
							Call or text (417) 733-0681
						</a>

						<a
							className={ cssModObj.menFacAnc }

							href='https://www.facebook.com/profile.php?id=61560009400871'
							rel='noopener noreferrer'
							target='_blank'
						>{ /* What: Menu Facebook Anchor Element. Why: Tony shares new pieces and where he'll be on his Facebook page. How: This opens the page in a new tab, without giving it access to this one. */ }
							Find Tony on Facebook
						</a>

						<p className={ cssModObj.menHomPar }>Handcrafted in Bolivar, Missouri</p>{ /* What: Menu Home Paragraph Element. Why: The menu closes on where Tony makes his pieces. How: This shows his home town. */ }


					</div>


				</div>


			</nav>


		</>


	);


}

// #endregion NavBarCom

// #endregion Components



// #region Exports

export { NavBarCom }; // What: Named Exports. Why: Every page renders the bar above its content. How: This exports NavBarCom.

// #endregion Exports


