


// #region Imports

import { chromium      } from '@playwright/test'; // What: Chromium. Why: The photos are scaled and encoded by a real browser's canvas, so no image library is needed. How: This launches Playwright's Chromium.
import { fileURLToPath } from 'node:url';         // What: File URL To Path. Why: Every path is resolved from this script's own location. How: This turns a file URL into a path.
import { readdirSync   } from 'node:fs';          // What: Read Directory Sync. Why: The product photos are found by listing their folder. How: This lists the originals in design/photos/products.
import { readFileSync  } from 'node:fs';          // What: Read File Sync. Why: Each original is handed to the browser as data. How: This reads its bytes.
import { statSync      } from 'node:fs';          // What: Stat Sync. Why: The run reports how much each batch shrank. How: This reads each original's size in bytes.
import { writeFileSync } from 'node:fs';          // What: Write File Sync. Why: The encoded photos and their sizes file are saved. How: This writes each one.

// #endregion Imports



/**
 * render.mts = Photo Renderer
 *
 * @summary
 * Rebuilds every photo the site shows from the originals in this folder:
 * the product photos in products/, written as WebP into src/assets/products,
 * and Tony's cartoon and portrait, written into src/pages/home. Each photo is
 * cropped where CRO_BOX_OBJ says (booth-1 is a phone screenshot, cropped to
 * the photo inside it), scaled down to fit its box, which is twice the
 * largest size the site shows it at, never scaled up, and encoded at 0.85
 * quality, the lowest that shows no difference from the original at 3x
 * zoom. It then writes src/pages/home/photo-sizes.ts, the width and height
 * of every photo it wrote, which the page's img elements read so nothing
 * shifts while photos load. Run it with npm run photos whenever a photo is
 * added or replaced, or a display size changes.
 *
 * Sections:
 *  - Constants
 *  - Helpers
 *  - Module Init
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

const PHO_DIR_STR = fileURLToPath( new URL( './', import.meta.url ) );                                  // What: Photo Directory String. Why: The originals live beside this script. How: This resolves this script's own folder.
const PRO_OUT_STR = fileURLToPath( new URL( '../../src/assets/products/', import.meta.url ) );          // What: Products Output String. Why: The product photos are imported from src/assets/products. How: This resolves that folder.
const QUA_VAL_NUM = 0.85;                                                                               // What: Quality Value Number. Why: This is the lowest WebP quality that showed no difference from the originals at 3x zoom. How: Every photo is encoded at it.
const SIZ_OUT_STR = fileURLToPath( new URL( '../../src/pages/home/photo-sizes.ts', import.meta.url ) ); // What: Sizes Output String. Why: The page reads every photo's width and height from one generated file. How: This resolves where it's written.
const TON_OUT_STR = fileURLToPath( new URL( '../../src/pages/home/', import.meta.url ) );               // What: Tony Output String. Why: Tony's cartoon and portrait are imported from the home page's folder. How: This resolves that folder.



type BoxRecTyp = { heiNum : number, widNum : number }; // What: Box Record Type. Why: A photo's box is the most room it may take. How: This names its height and width in pixels, Infinity for no limit.
const BOX_REC_OBJ : Record< string, BoxRecTyp > = { // What: Box Record Object. Why: Each kind of photo is shown at a different largest size, and its file should be no more than twice that. How: This maps each kind to its box.


	'booth'    : { heiNum : Infinity, widNum : 696 }, // What: Booth Box. Why: The gallery crops a booth shot to fill frames up to about 348px wide. How: This caps its width at twice that.
	'cartoon'  : { heiNum : Infinity, widNum : 710 }, // What: Cartoon Box. Why: The hero's portrait ring grows to about 355px wide. How: This caps its width at twice that.
	'portrait' : { heiNum : Infinity, widNum : 756 }, // What: Portrait Box. Why: The About portrait is shown wider than half its original, so it keeps its own width. How: This caps it at the original's 756px, so it's never enlarged.
	'product'  : { heiNum : 750,      widNum : 562 }  // What: Product Box. Why: A product card's frame is at most about 281 by 375px, and the photo fits inside it. How: This caps the photo at twice the frame.


};



type CroBoxTyp = { heiNum : number, lefNum : number, topNum : number, widNum : number }; // What: Crop Box Type. Why: A crop keeps one rectangle of the original. How: This names its height, left edge, top edge, and width in the original's pixels.
const CRO_BOX_OBJ : Record< string, CroBoxTyp > = { // What: Crop Box Object. Why: A few originals carry more than the photo itself. How: This maps a file name to the rectangle to keep.


	'booth-1' : { heiNum : 1260, lefNum : 0, topNum : 394, widNum : 946 } // What: Booth 1 Crop. Why: booth-1 is a phone screenshot, with the status bar and share buttons above the photo and the phone's controls below it. How: This keeps the photo, measured where the black frame around it ends.


};

// #endregion Constants



// #region Helpers

// #region boxKeyFun

/**
 * boxKeyFun = Box Key Function
 *
 * @summary
 * Picks which box a photo fits into from its file name: booth shots, Tony's
 * cartoon, his portrait, and every other product photo each have their own.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param filNamStr - File Name String: The photo's file name without its
 *                    extension, e.g. 'booth-2'.
 *
 * @returns The key of the photo's box in BOX_REC_OBJ.
 *
 * @example
 * ```ts
 * boxKeyFun('booth-2') // => 'booth'
 * ```
 *
*/

function boxKeyFun ( filNamStr : string ) : string {


	if ( filNamStr.startsWith( 'booth-' ) ) return 'booth'; // What: Booth Guard. Why: Booth shots fill the gallery's frames. How: This returns their box.



	if ( filNamStr === 'tony-cartoon' ) return 'cartoon'; // What: Cartoon Guard. Why: The cartoon fills the hero's ring. How: This returns its box.



	if ( filNamStr === 'tony-portrait' ) return 'portrait'; // What: Portrait Guard. Why: The portrait fills the About frame. How: This returns its box.



	return 'product'; // What: Product Box Return. Why: Every other photo shows a piece in a product card. How: This returns the product box.


}

// #endregion boxKeyFun

// #endregion Helpers



// #region Module Init

const broInsObj = await chromium.launch();   // What: Browser Instance Object. Why: The photos are drawn by a real browser. How: This launches Chromium.
const encPagObj = await broInsObj.newPage(); // What: Encode Page Object. Why: The canvas work runs in a page. How: This opens a blank one.



const proFilArr = readdirSync( `${ PHO_DIR_STR }products` ).filter( ( filCurStr ) => filCurStr.endsWith( '.jpg' ) ).map( ( filCurStr ) => `products/${ filCurStr }` ); // What: Product File Array. Why: Every product photo in the folder is rebuilt. How: This lists the JPEGs in products/ with their folder.
const souFilArr = [ ...proFilArr, 'tony-cartoon.jpg', 'tony-portrait.jpg' ];                                                                                           // What: Source File Array. Why: Tony's two photos are rebuilt with the products. How: This adds them after the product photos.

const sizRowArr : [ string, number, number ][] = []; // What: Size Row Array. Why: Every photo written adds a row to the sizes file. How: This collects them.

let befBytNum = 0; // What: Before Bytes Number. Why: The run reports how much smaller the photos got. How: This adds up the originals' sizes.
let aftBytNum = 0; // What: After Bytes Number. Why: The run reports how much smaller the photos got. How: This adds up the encoded files' sizes.


for ( const souFilStr of souFilArr ) { // What: Source File Loop. Why: Each original is rebuilt the same way. How: This crops, scales, encodes, and writes one photo per pass.


	const filNamStr = souFilStr.slice( souFilStr.lastIndexOf( '/' ) + 1, -4 );                                             // What: File Name String. Why: The photo is keyed by its name without folder or extension. How: This cuts both off.
	const boxRecObj = BOX_REC_OBJ[ boxKeyFun( filNamStr ) ];                                                               // What: Box Record Object. Why: The photo fits into its kind's box. How: This looks the box up by kind.
	const souUrlStr = `data:image/jpeg;base64,${ readFileSync( `${ PHO_DIR_STR }${ souFilStr }` ).toString( 'base64' ) }`; // What: Source URL String. Why: A canvas drawn from a file URL can't be read back, while one drawn from data can. How: This hands the original to the page as a data URL.
	const croBoxObj = CRO_BOX_OBJ[ filNamStr ] ?? null;                                                                    // What: Crop Box Object. Why: Only some photos are cropped. How: This reads the photo's crop, or null.


	const encResObj = await encPagObj.evaluate( async ( [ souUrlStr, croBoxObj, boxRecObj, quaValNum ] ) => { // What: Encode Result Object. Why: The browser crops, scales, and encodes the photo. How: This decodes the original, draws the kept part onto a canvas at the fitted size, and returns the WebP data and its size.


		const souImaEle = new Image(); // What: Source Image Element. Why: The original has to be decoded before it's drawn. How: This creates an image to load it into.


		souImaEle.src = souUrlStr; // What: Source Load Call. Why: The image loads the original's data. How: This sets its source.

		await souImaEle.decode(); // What: Source Decode Wait. Why: Drawing an undecoded image draws nothing. How: This waits until it's ready.


		const croUseObj = croBoxObj ?? { heiNum : souImaEle.naturalHeight, lefNum : 0, topNum : 0, widNum : souImaEle.naturalWidth }; // What: Crop Used Object. Why: An uncropped photo keeps all of itself. How: This uses the crop, or the whole image.
		const scaValNum = Math.min( 1, boxRecObj.widNum / croUseObj.widNum, boxRecObj.heiNum / croUseObj.heiNum );                    // What: Scale Value Number. Why: The photo fits its box but is never enlarged. How: This takes the smaller of the two fits, capped at 1.
		const outHeiNum = Math.round( croUseObj.heiNum * scaValNum );                                                                 // What: Output Height Number. Why: The canvas is the fitted size. How: This scales the kept height.
		const outWidNum = Math.round( croUseObj.widNum * scaValNum );                                                                 // What: Output Width Number. Why: The canvas is the fitted size. How: This scales the kept width.
		const outCanEle = document.createElement( 'canvas' );                                                                         // What: Output Canvas Element. Why: The photo is redrawn at its new size. How: This creates the canvas.


		outCanEle.height = outHeiNum; // What: Canvas Height Assignment. Why: The canvas has to match the fitted size. How: This sets its height.
		outCanEle.width  = outWidNum; // What: Canvas Width Assignment. Why: The canvas has to match the fitted size. How: This sets its width.


		const outConObj = outCanEle.getContext( '2d' )!; // What: Output Context Object. Why: Drawing goes through the canvas's 2D context. How: This reads it. // What: Non-Null Note. Why: getContext can return null for an unsupported type. How: Every browser supports a 2D context.


		outConObj.imageSmoothingQuality = 'high'; // What: Smoothing Quality Assignment. Why: A large downscale should stay sharp without jagged edges. How: This asks for the browser's best resampling.

		outConObj.drawImage( souImaEle, croUseObj.lefNum, croUseObj.topNum, croUseObj.widNum, croUseObj.heiNum, 0, 0, outWidNum, outHeiNum ); // What: Photo Draw Call. Why: The kept part of the original fills the canvas. How: This draws the crop rectangle scaled to the canvas.



		return { // What: Encode Result Return. Why: Node writes the file and records its size. How: This hands back the WebP's base64 data, its height, and its width.


			b64Str : outCanEle.toDataURL( 'image/webp', quaValNum ).split( ',' )[ 1 ], // What: Base64 String. Why: Only text crosses back from the page. How: This encodes the canvas as WebP and keeps the data after the data URL's comma.
			heiNum : outHeiNum,                                                        // What: Height Number. Why: The sizes file records the photo's height. How: This is the canvas's height.
			widNum : outWidNum                                                         // What: Width Number. Why: The sizes file records the photo's width. How: This is the canvas's width.


		};


	}, [ souUrlStr, croBoxObj, boxRecObj, QUA_VAL_NUM ] as const ); // What: Encode Arguments. Why: The page can't read this script's variables. How: This passes the original, its crop, its box, and the quality in. // What: Type Assertion Note. Why: Without it the array widens to one mixed type, so the page function's destructured parameters lose their own types. How: as const keeps it a readonly tuple, so each parameter is typed by its position.


	const outPatStr = `${ souFilStr.startsWith( 'products/' ) ? PRO_OUT_STR : TON_OUT_STR }${ filNamStr }.webp`; // What: Output Path String. Why: Product photos and Tony's photos are imported from different folders. How: This picks the folder and names the file .webp.
	const outBufObj = Buffer.from( encResObj.b64Str, 'base64' );                                                 // What: Output Buffer Object. Why: The file is written as bytes. How: This decodes the base64 data.


	writeFileSync( outPatStr, outBufObj ); // What: Photo Write Call. Why: The site imports the encoded photo. How: This saves it.

	sizRowArr.push( [ filNamStr, encResObj.heiNum, encResObj.widNum ] ); // What: Size Row Push. Why: The sizes file lists every photo. How: This adds the photo's name, height, and width, which are laid out once every row is in.


	befBytNum += statSync( `${ PHO_DIR_STR }${ souFilStr }` ).size; // What: Before Bytes Increase. Why: The total covers every original. How: This adds this original's size.
	aftBytNum += outBufObj.length;                                  // What: After Bytes Increase. Why: The total covers every encoded photo. How: This adds this file's size.


}



await broInsObj.close(); // What: Browser Close Call. Why: The script should exit once every photo is written. How: This shuts Chromium down.


sizRowArr.sort( ( rowOneArr, rowTwoArr ) => rowOneArr[ 0 ].localeCompare( rowTwoArr[ 0 ] ) ); // What: Size Row Sort. Why: The sizes file should list its rows in a stable order. How: This sorts them by file name.


const keyWidNum = Math.max( ...sizRowArr.map( ( sizCurArr ) => sizCurArr[ 0 ].length ) ) + 2;           // What: Key Width Number. Why: Every row's colon lines up after the longest quoted name. How: This measures the longest name plus its two quotes.
const heiWidNum = Math.max( ...sizRowArr.map( ( sizCurArr ) => String( sizCurArr[ 1 ] ).length ) ) + 1; // What: Height Width Number. Why: Every row's width field starts in one column after the longest height. How: This measures the longest height plus its comma.
const widWidNum = Math.max( ...sizRowArr.map( ( sizCurArr ) => String( sizCurArr[ 2 ] ).length ) );     // What: Width Width Number. Why: Every row's closing brace lines up after the longest width. How: This measures the longest width.
const sizLinArr = sizRowArr.map( ( [ filNamStr, heiValNum, widValNum ], rowIndNum ) => `\t${ `'${ filNamStr }'`.padEnd( keyWidNum ) } : { heiNum : ${ `${ heiValNum },`.padEnd( heiWidNum ) } widNum : ${ String( widValNum ).padEnd( widWidNum ) } }${ rowIndNum === sizRowArr.length - 1 ? '' : ',' }` ); // What: Size Line Array. Why: The rows form an aligned table, as stacked one-line rows do everywhere else. How: This pads each field to its column's width, and only the last row goes without a comma.


const sizTexStr = `


/**
 * photo-sizes.ts = Photo Sizes
 *
 * @summary
 * The width and height in pixels of every photo the site shows, keyed by its
 * file name without the extension, so each img element can carry its
 * intrinsic size and the page doesn't shift while the photos load. This file
 * is written by design/photos/render.mts each time the photos are rebuilt;
 * edit that script, never this file.
 *
 * Sections:
 *  - Constants
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Constants

type PhoSizTyp = { heiNum : number, widNum : number }; // What: Photo Size Type. Why: Every photo's size has the same shape. How: This names its height and width in pixels.

// #region PHO_SIZ_OBJ

/**
 * PHO_SIZ_OBJ = Photo Sizes Object
 *
 * @summary
 * One row per photo: heiNum, its height in pixels, and widNum, its width in
 * pixels. Every row has the same two fields, so no row needs a comment of
 * its own.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const PHO_SIZ_OBJ : Record< string, PhoSizTyp > = { // What: Photo Sizes Object. Why: Every img element needs its photo's intrinsic size. How: The page looks each photo's size up by its file name.


${ sizLinArr.join( '\n' ) }


};

// #endregion PHO_SIZ_OBJ

// #endregion Constants



// #region Exports

export { PHO_SIZ_OBJ }; // What: Named Exports. Why: The catalog and the hero and About sections read the photo sizes. How: This exports the sizes object.

// #endregion Exports


`; // What: Sizes Text String. Why: The sizes file follows the same formatting rules as every other file, so it's written from this template. How: This fills the template with the sorted rows.


writeFileSync( SIZ_OUT_STR, sizTexStr ); // What: Sizes Write Call. Why: The page reads the photos' sizes from this file. How: This saves it.



console.log( `Wrote ${ souFilArr.length } photos, ${ Math.round( befBytNum / 1024 ) } KB down to ${ Math.round( aftBytNum / 1024 ) } KB, and ${ SIZ_OUT_STR }.` ); // What: Result Log Call. Why: The run should say what it wrote. How: This prints the count, the sizes before and after, and the sizes file's path.

// #endregion Module Init


