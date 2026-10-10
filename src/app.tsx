



// #region Imports

import { HomPagCom } from './pages/home/home.tsx';          // What: Home Page Component. Why: The site's root address is its home page. How: The home route renders it.
import { NavBarCom } from './ui/nav.tsx';                   // What: Navigation Bar Component. Why: Every page starts with the shared bar. How: This renders above the routes.
import { NotFouCom } from './pages/not-found/not-found.tsx'; // What: Not Found Component. Why: Unknown addresses need a page of their own. How: The catch-all route renders it.
import { Route     } from 'react-router';                   // What: Route. Why: Each page is matched to its path. How: This declares one route per page.
import { Routes    } from 'react-router';                   // What: Routes. Why: Only one page should render for any path. How: This renders the first route whose path matches.
import { SitFooCom } from './ui/footer.tsx';                // What: Site Footer Component. Why: Every page ends with the shared footer. How: This renders below the routes.

// #endregion Imports



/**
 * app.tsx = App
 *
 * @summary
 * The site's root component, mounted by main.tsx inside the router: the bar,
 * the main landmark holding whichever page the address matches, and the
 * footer. The home page answers the root address, and the 404 page every
 * other. A new page, such as a shop later on, is added as another route here,
 * before the catch-all.
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
 * The top of the component tree: renders the bar, the page the address
 * matches inside the main landmark, and the footer, so every page shares the
 * same frame.
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


	return (


		<>{ /* What: App Root Fragment. Why: The bar, main content, and footer sit side by side in the mount element. How: This groups them without adding an element. */ }


			<NavBarCom />{ /* What: Navigation Bar Component. Why: Every page starts with the shared bar. How: This renders it above the page. */ }



			<main>{ /* What: App Main Element. Why: Each page's content is the main landmark. How: This holds whichever page the address matches. */ }


				<Routes>{ /* What: Page Routes. Why: Only one page should render for any path. How: This renders the first route below whose path matches. */ }


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

export { AppRooCom }; // What: Named Exports. Why: main.tsx is the sole consumer, mounting this as the site's root. How: This exports AppRooCom.

// #endregion Exports


