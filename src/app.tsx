


// #region Imports

import { HomPagCom    } from './pages/home/home.tsx';           // What: Home Page Component. Why: The site's root address is its home page. How: The home route renders it.
import { NavBarCom    } from './ui/nav.tsx';                    // What: Navigation Bar Component. Why: Every page starts with the shared bar. How: This renders above the routes.
import { NotFouCom    } from './pages/not-found/not-found.tsx'; // What: Not Found Component. Why: Unknown addresses need a page of their own. How: The catch-all route renders it.
import { Route        } from 'react-router';                    // What: Route. Why: Each page is matched to its path. How: This declares one route per page.
import { Routes       } from 'react-router';                    // What: Routes. Why: Only one page should render for any path. How: This renders the best-matching route for the current path.
import { SitFooCom    } from './ui/footer.tsx';                 // What: Site Footer Component. Why: Every page ends with the shared footer. How: This renders below the routes.
import { useScrTopFun } from './ui/scroll-top.ts';              // What: Use Scroll Top Function. Why: A link from one page to another should open the new page at its top. How: The app root calls it once, inside the router.

// #endregion Imports



/**
 * app.tsx = App
 *
 * @summary
 * The site's root component, mounted by main.tsx inside the router: the bar,
 * the main landmark holding whichever page the address matches, and the
 * footer. The home page answers the root address, and the 404 page every
 * other. A new page, such as a shop later on, is added as another route here,
 * before the catch-all. It also opens a page a link leads to at its top,
 * unless the link names a section.
 *
 * Sections:
 *  - Components
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Components

// #region AppRooCom

/**
 * AppRooCom = App Root Component
 *
 * @summary
 * The top of the component tree: renders the bar, the page the address matches
 * inside the main landmark, and the footer, so every page shares the same
 * frame, and calls useScrTopFun so a link to another page opens it at its top.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The bar, the matched page, and the footer.
 *
 * @example
 * ```tsx
 * AppRooCom() // => <AppRooCom />
 * ```
 *
*/

function AppRooCom () : React.JSX.Element {


	useScrTopFun(); // What: Scroll Top Call. Why: A link from one page to another should open the new page at its top, as a real page load does. How: This runs the hook once from the root, which stays mounted across every route.



	return (


		<>{ /* What: App Root Fragment. Why: The bar, main content, and footer render together under the mount element, though the bar is fixed and sits outside the column the main content and footer stack in. How: This groups them without adding an element. */ }


			<NavBarCom />{ /* What: Navigation Bar Component. Why: Every page starts with the shared bar. How: This renders it above the page. */ }



			<main
				id='main'

				tabIndex={ -1 } // What: Main Focus Target. Why: The skip link moves focus here, and a main element can't take focus on its own. How: This makes it focusable without adding it to the Tab order.
			>{ /* What: App Main Element. Why: Each page's content is the main landmark, and the skip link jumps here. How: This holds whichever page the address matches; its ID stays the plain main, since the skip link's #main address names it as a navigation target. */ }


				<Routes>{ /* What: Page Routes. Why: Only one page should render for any path. How: This renders the best-matching route below for the current path. */ }


					<Route
						element={ <HomPagCom /> }
						path='/'
					/>{ /* What: Home Route. Why: The site's root address is its home page. How: This renders HomPagCom at the root path. */ }



					<Route
						element={ <NotFouCom /> }
						path='*' // What: Catch-All Path. Why: Any address the site doesn't have should land on the 404 page. How: The asterisk matches every path no earlier route claimed.
					/>{ /* What: Not Found Route. Why: Unknown paths need a page of their own. How: This renders NotFouCom for every other path. */ }


				</Routes>


			</main>



			<SitFooCom />{ /* What: Site Footer Component. Why: Every page ends with the shared footer. How: This renders it below the page. */ }


		</>


	);


}

// #endregion AppRooCom

// #endregion Components



// #region Exports

export { AppRooCom }; // What: Named Export. Why: The root component is this file's one export, mounted from outside it. How: This exports AppRooCom.

// #endregion Exports


