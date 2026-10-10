



/**
 * catalog.ts = Catalog
 *
 * @summary
 * The product photos the home page shows, and the categories they belong to.
 * Every photo lives in src/assets/products and is imported at build time, so a
 * missing one fails the build. A single piece's photo is named after its
 * category and its number (pen-topper-3.jpg), so each category's photos are
 * read straight from the folder in number order, and adding one only means
 * adding its file. Two kinds of photo show more than one category at once,
 * and list theirs by hand: the pen and wine stopper sets, one card each under
 * both filters, and the craft fair booth shots, which the gallery shows and
 * each tagged category's filter includes, while the All list leaves them out.
 *
 * Sections:
 *  - Types
 *  - Constants
 *  - Helpers
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Types

type CatSluTyp = 'pen-topper' | 'wine-stopper' | 'keychain' | 'dog-necklace' | 'car-freshie' | 'name-badge-reel' | 'phone-grip' | 'straw-charm'; // What: Category Slug Type. Why: Every photo and filter names its category the same way. How: This lists every category's slug, which also starts each single piece's file name.



type ProRcdTyp = { // What: Product Record Type. Why: The products grid and the gallery read every photo the same way. How: This describes one photo's card.


	altStr : string,      // What: Alternative String. Why: A screen reader announces each photo by its text alternative. How: A booth shot carries a description of the table, and every other photo its card's name until the content pass describes them.
	catArr : CatSluTyp[], // What: Category Array. Why: One photo can show more than one kind of piece. How: This lists every category the photo is tagged with, the first one setting its card's look.
	faiBoo : boolean,     // What: Fair Boolean. Why: A craft fair booth shot shows a whole table, so it belongs in the gallery and under the filters it's tagged with, not in the All list. How: This is true for a booth shot and false for a piece or set.
	ideStr : string,      // What: Identifier String. Why: React tells the cards apart by a key. How: This is the photo's file name, unique in the folder.
	imaStr : string,      // What: Image String. Why: The card shows its photo. How: This is the photo's built URL.
	labStr : string,      // What: Label String. Why: The card's tag and subtitle name what kind of piece it shows. How: This is the category's singular label, or both labels for a set.
	namStr : string       // What: Name String. Why: The card has a title. How: This is the label and the photo's number within its kind.


};

// #endregion Types



// #region Constants

const CAT_LAB_OBJ : Record< CatSluTyp, string > = { // What: Category Label Object. Why: A card names its piece in the singular. How: This maps each category's slug to its singular label.


	'car-freshie'     : 'Car Freshie',     // What: Car Freshie Label. Why: A car freshie card names its piece. How: This is the singular label.
	'dog-necklace'    : 'Dog Necklace',    // What: Dog Necklace Label. Why: A dog necklace card names its piece. How: This is the singular label.
	'keychain'        : 'Keychain',        // What: Keychain Label. Why: A keychain card names its piece. How: This is the singular label.
	'name-badge-reel' : 'Name Badge Reel', // What: Name Badge Reel Label. Why: A badge reel card names its piece. How: This is the singular label.
	'pen-topper'      : 'Pen Topper',      // What: Pen Topper Label. Why: A pen topper card names its piece. How: This is the singular label.
	'phone-grip'      : 'Phone Grip',      // What: Phone Grip Label. Why: A phone grip card names its piece. How: This is the singular label.
	'straw-charm'     : 'Straw Charm',     // What: Straw Charm Label. Why: A straw charm card names its piece. How: This is the singular label.
	'wine-stopper'    : 'Wine Stopper'     // What: Wine Stopper Label. Why: A wine stopper card names its piece. How: This is the singular label.


};



type CatRcdTyp = { labStr : string, sluStr : CatSluTyp }; // What: Category Record Type. Why: Each filter button has a slug and a label. How: This pairs them.
const CAT_RCD_ARR : CatRcdTyp[] = [ // What: Category Record Array. Why: The products grid offers a filter button per category, in this order, and lists single pieces in the same order. How: Each row pairs a category's slug with its plural label.


	{ labStr : 'Pen Toppers',      sluStr : 'pen-topper'      }, // What: Pen Toppers Row. Why: Beaded pen toppers are Tony's first and biggest line. How: This names their category.
	{ labStr : 'Wine Stoppers',    sluStr : 'wine-stopper'    }, // What: Wine Stoppers Row. Why: Wine stoppers came next, beside the pens. How: This names their category.
	{ labStr : 'Keychains',        sluStr : 'keychain'        }, // What: Keychains Row. Why: Tony beads keychains too. How: This names their category.
	{ labStr : 'Dog Necklaces',    sluStr : 'dog-necklace'    }, // What: Dog Necklaces Row. Why: Tony beads necklaces for dogs. How: This names their category.
	{ labStr : 'Car Freshies',     sluStr : 'car-freshie'     }, // What: Car Freshies Row. Why: Tony makes car air fresheners. How: This names their category.
	{ labStr : 'Name Badge Reels', sluStr : 'name-badge-reel' }, // What: Name Badge Reels Row. Why: Tony beads badge reels. How: This names their category.
	{ labStr : 'Phone Grips',      sluStr : 'phone-grip'      }, // What: Phone Grips Row. Why: Tony makes phone grips. How: This names their category.
	{ labStr : 'Straw Charms',     sluStr : 'straw-charm'     }  // What: Straw Charms Row. Why: Tony makes straw charms. How: This names their category.


];



type FaiRcdTyp = { altStr : string, catArr : CatSluTyp[], filStr : string }; // What: Fair Record Type. Why: A booth shot lists by hand the categories it shows and describes the table, which its card's name can't. How: This names the photo's description, its categories, and its file name without the extension.
const FAI_RCD_ARR : FaiRcdTyp[] = [ // What: Fair Record Array. Why: The craft fair booth shots show Tony's whole table, so they live in the gallery and under the filters of the pieces they show, which keeps Straw Charms from being empty. How: Each row names the photo, the categories it shows, and its description.


	{ altStr : "Tony's pen toppers lined up in clear stands on a wooden shelf by a shop window, with beaded wine stoppers and bagged keychains on the shelf below and a framed card about Tony", catArr : [ 'pen-topper', 'wine-stopper' ], filStr : 'booth-1' }, // What: First Booth Row. Why: A shop window display of pens and stoppers. How: This tags it under pen toppers and wine stoppers.

	{ altStr : 'A craft fair table crowded with clear cups of pen toppers and wine stoppers, beaded dog necklaces on a stand, keychains hanging from a rack, and a framed cartoon of Tony', catArr : [ 'pen-topper', 'wine-stopper', 'dog-necklace' ], filStr : 'booth-2' }, // What: Second Booth Row. Why: A full craft fair table. How: This tags it under pen toppers, wine stoppers, and dog necklaces.

	{ altStr : "Beaded charms and keychains hanging from a rack beside bagged pens in glass vases, with a framed cartoon of Tony in a Tony's Toppers shirt and a cup of pen toppers in front", catArr : [ 'pen-topper', 'straw-charm' ], filStr : 'booth-3' }, // What: Third Booth Row. Why: A close view of the charms and pens beside his cartoon. How: This tags it under pen toppers and straw charms.

	{ altStr : 'Tony seated behind his table at an outdoor craft fair, its black cloth covered with rows of pen toppers, wine stoppers, and beaded badge reels', catArr : [ 'pen-topper', 'wine-stopper' ], filStr : 'booth-4' } // What: Fourth Booth Row. Why: Tony at his own table outdoors. How: This tags it under pen toppers and wine stoppers.


];



const PRO_URL_OBJ = import.meta.glob< string >( '../../assets/products/*.jpg', { eager : true, import : 'default' } ); // What: Product URL Object. Why: The product photos live in src/assets/products, where Vite fingerprints each one and fails the build when a listed photo is missing from its import. How: This imports every photo in the folder at build time and maps each one's source path to its built URL.



type SetRcdTyp = { catArr : CatSluTyp[], filStr : string }; // What: Set Record Type. Why: A set lists by hand the categories it shows. How: This names its categories and its file name without the extension.
const SET_RCD_ARR : SetRcdTyp[] = [ // What: Set Record Array. Why: A few photos show pen toppers and wine stoppers displayed together, so each is one card under both filters rather than a copy under each. How: Each row names the photo and the categories it shows.


	{ catArr : [ 'pen-topper', 'wine-stopper' ], filStr : 'pen-wine-set-1' }, // What: First Set Row. Why: Pens and stoppers in a shop display. How: This tags it under both.
	{ catArr : [ 'pen-topper', 'wine-stopper' ], filStr : 'pen-wine-set-2' }, // What: Second Set Row. Why: Pens and stoppers on acrylic stands. How: This tags it under both.
	{ catArr : [ 'pen-topper', 'wine-stopper' ], filStr : 'pen-wine-set-3' }  // What: Third Set Row. Why: A few pens and stoppers laid out together. How: This tags it under both.


];

// #endregion Constants



// #region Helpers

const phoUrlFun = ( filNamStr : string ) => PRO_URL_OBJ[ `../../assets/products/${ filNamStr }.jpg` ]; // What: Photo URL Function. Why: Every card looks its photo up the same way. How: This returns the photo's built URL by its file name.



// #region phoNamFun

/**
 * phoNamFun = Photo Names Function
 *
 * @summary
 * Lists the file names of one category's single-piece photos, read from the
 * photos imported out of src/assets/products: every file named the
 * category's slug followed by a number, in number order, so pen-topper-10
 * comes after pen-topper-9 rather than after pen-topper-1. The sets and booth
 * shots never match, since their names don't start with a category's slug
 * and a number.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param sluStr - Slug String: The category's slug, e.g. 'pen-topper'.
 *
 * @returns The category's photo file names, without their extension.
 *
 * @example
 * ```ts
 * phoNamFun('keychain') // => [ 'keychain-1' ]
 * ```
 *
*/

function phoNamFun ( sluStr : CatSluTyp ) : string[] {


	const filNamReg = new RegExp( `^${ sluStr }-(\\d+)$` ); // What: File Name Regular Expression. Why: A single piece's photo is named its category's slug, a dash, and a number. How: This matches that name and captures the number.

	const filNamArr = Object.keys( PRO_URL_OBJ ).map( ( souPatStr ) => souPatStr.slice( souPatStr.lastIndexOf( '/' ) + 1, -4 ) ); // What: File Name Array. Why: Each imported photo is keyed by its source path. How: This keeps just the file name, without its folder or its .jpg extension.



	return filNamArr.filter( ( filNamStr ) => filNamReg.test( filNamStr ) ).sort( ( filOneStr, filTwoStr ) => Number( filOneStr.match( filNamReg )![ 1 ] ) - Number( filTwoStr.match( filNamReg )![ 1 ] ) ); // What: Category Names Return. Why: The cards list each category's photos in number order. How: This keeps the category's names and sorts them by their numbers. // What: Non-Null Note. Why: Each match can't be null. How: Every name reaching the sort already passed the same test in the filter.


}

// #endregion phoNamFun



const PRO_RCD_ARR : ProRcdTyp[] = [ // What: Product Record Array. Why: The products grid and the gallery read every photo from one list. How: This lists every single piece in category order, with the sets right after the wine stoppers, then the booth shots, which only the filters and the gallery show.


	...CAT_RCD_ARR.flatMap( ( catRcdObj ) => [ // What: Category Pieces Spread. Why: Single pieces are listed category by category. How: This builds each category's cards, adding the sets after the wine stoppers.


		...phoNamFun( catRcdObj.sluStr ).map( ( filNamStr, filIndNum ) => ({ // What: Single Piece Cards Spread. Why: Each of the category's photos gets a card, numbered within its kind. How: This builds one record per photo.


			altStr : `${ CAT_LAB_OBJ[ catRcdObj.sluStr ] } ${ filIndNum + 1 }`, // What: Alternative String. Why: The photo needs a text alternative until the content pass describes it. How: This repeats the card's name.
			catArr : [ catRcdObj.sluStr ],                                      // What: Category Array. Why: A single piece shows one kind. How: This lists its category alone.
			faiBoo : false,                                                     // What: Fair Boolean. Why: A single piece isn't a booth shot. How: This keeps it in the All list.
			ideStr : filNamStr,                                                 // What: Identifier String. Why: React needs a unique key. How: This reuses the file name.
			imaStr : phoUrlFun( filNamStr ),                                    // What: Image String. Why: The card shows its photo. How: This looks up the built URL.
			labStr : CAT_LAB_OBJ[ catRcdObj.sluStr ],                           // What: Label String. Why: The card names its kind. How: This is the category's singular label.
			namStr : `${ CAT_LAB_OBJ[ catRcdObj.sluStr ] } ${ filIndNum + 1 }`  // What: Name String. Why: The card has a title. How: This joins the label and the photo's number.


		}) ),

		...( catRcdObj.sluStr === 'wine-stopper' ? SET_RCD_ARR.map( ( setRcdObj, setIndNum ) => ({ // What: Set Cards Spread. Why: The pen and wine stopper sets sit right after the wine stoppers in the All list. How: This builds one record per set, only after the wine stopper category.


			altStr : `Pen Topper & Wine Stopper Set ${ setIndNum + 1 }`, // What: Alternative String. Why: The photo needs a text alternative until the content pass describes it. How: This repeats the card's name.
			catArr : setRcdObj.catArr,                                   // What: Category Array. Why: A set shows both kinds. How: This lists both categories.
			faiBoo : false,                                              // What: Fair Boolean. Why: A set isn't a booth shot. How: This keeps it in the All list.
			ideStr : setRcdObj.filStr,                                   // What: Identifier String. Why: React needs a unique key. How: This reuses the file name.
			imaStr : phoUrlFun( setRcdObj.filStr ),                      // What: Image String. Why: The card shows its photo. How: This looks up the built URL.
			labStr : 'Pen Topper & Wine Stopper',                        // What: Label String. Why: The card names both kinds it shows. How: This joins the two labels.
			namStr : `Pen Topper & Wine Stopper Set ${ setIndNum + 1 }`  // What: Name String. Why: The card has a title. How: This names the set and its number.


		}) ) : [] )


	] ),

	...FAI_RCD_ARR.map( ( faiRcdObj, faiIndNum ) => ({ // What: Booth Cards Spread. Why: The booth shots come last, for the filters and the gallery. How: This builds one record per booth shot.


		altStr : faiRcdObj.altStr,                     // What: Alternative String. Why: A booth shot shows a whole table, which its name can't describe. How: This takes the row's description.
		catArr : faiRcdObj.catArr,                     // What: Category Array. Why: A booth shot shows several kinds. How: This lists every category it's tagged with.
		faiBoo : true,                                 // What: Fair Boolean. Why: A booth shot belongs in the gallery and the filters, not the All list. How: This marks it.
		ideStr : faiRcdObj.filStr,                     // What: Identifier String. Why: React needs a unique key. How: This reuses the file name.
		imaStr : phoUrlFun( faiRcdObj.filStr ),        // What: Image String. Why: The card shows its photo. How: This looks up the built URL.
		labStr : 'Craft Fair Table',                   // What: Label String. Why: The card names what it shows. How: This calls it a craft fair table.
		namStr : `Craft Fair Table ${ faiIndNum + 1 }` // What: Name String. Why: The card has a title. How: This names the table and its number.


	}) )


];

// #endregion Helpers



// #region Exports

export { CAT_RCD_ARR, PRO_RCD_ARR, type CatSluTyp, type ProRcdTyp }; // What: Named Exports. Why: The products grid needs the categories and every photo, and the gallery the booth shots. How: This exports the two lists and the types that describe them.

// #endregion Exports


