


// #region Imports

import { PHO_SIZ_OBJ } from './photo-sizes.ts'; // What: Photo Sizes Object. Why: Every card's img carries its photo's intrinsic size. How: Each record looks its photo's width and height up by file name.

// #endregion Imports



/**
 * catalog.ts = Catalog
 *
 * @summary
 * The product photos the home page shows, and the categories they belong to.
 * Every photo lives in src/assets/products, is imported at build time, and
 * carries its size from photo-sizes.ts. A single piece's photo is named after
 * its category and its number (pen-topper-3.webp), so each category's photos
 * are read straight from the folder in number order, and adding one only means
 * adding its file and its description in PHO_ALT_OBJ, then running npm run
 * photos. The sets and booth shots are named by hand, so a misspelled or
 * missing one would stop the page from loading, and a new one's name has to
 * match its file exactly. Two kinds of photo show more than one category at
 * once, and list theirs by hand: the pen and wine stopper sets, one card each
 * under both filters, and the craft fair booth shots, which the gallery shows
 * and each tagged category's filter includes, while the All list leaves them
 * out.
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

// #endregion Types



// #region Constants

// #region CAT_LAB_OBJ

/**
 * CAT_LAB_OBJ = Category Label Object
 *
 * @summary
 * The singular name of each kind of piece, keyed by its category's slug, which
 * a card shows as its tag and subtitle and numbers in its title. Every row is
 * a slug and its label, so no row needs a comment of its own.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const CAT_LAB_OBJ : Record< CatSluTyp, string > = { // What: Category Label Object. Why: A card names its piece in the singular. How: This maps each category's slug to its singular label.


	'car-freshie'     : 'Car Freshie',
	'dog-necklace'    : 'Dog Necklace',
	'keychain'        : 'Keychain',
	'name-badge-reel' : 'Name Badge Reel',
	'pen-topper'      : 'Pen Topper',
	'phone-grip'      : 'Phone Grip',
	'straw-charm'     : 'Straw Charm',
	'wine-stopper'    : 'Wine Stopper'


};

// #endregion CAT_LAB_OBJ



type CatRecTyp = { labStr : string, sluStr : CatSluTyp }; // What: Category Record Type. Why: Each filter button has a slug and a label. How: This pairs them.

const CAT_REC_ARR : CatRecTyp[] = [ // What: Category Record Array. Why: The products grid offers a filter button per category, in this order, and lists single pieces in the same order. How: Each row pairs a category's slug with its plural label.


	{ labStr : 'Pen Toppers',      sluStr : 'pen-topper'      }, // What: Pen Toppers Row. Why: Beaded pen toppers are Tony's first and biggest line. How: This names their category.
	{ labStr : 'Wine Stoppers',    sluStr : 'wine-stopper'    }, // What: Wine Stoppers Row. Why: Wine stoppers came next, beside the pens. How: This names their category.
	{ labStr : 'Keychains',        sluStr : 'keychain'        }, // What: Keychains Row. Why: Tony beads keychains too. How: This names their category.
	{ labStr : 'Dog Necklaces',    sluStr : 'dog-necklace'    }, // What: Dog Necklaces Row. Why: Tony beads necklaces for dogs. How: This names their category.
	{ labStr : 'Car Freshies',     sluStr : 'car-freshie'     }, // What: Car Freshies Row. Why: Tony makes car air fresheners. How: This names their category.
	{ labStr : 'Name Badge Reels', sluStr : 'name-badge-reel' }, // What: Name Badge Reels Row. Why: Tony beads badge reels. How: This names their category.
	{ labStr : 'Phone Grips',      sluStr : 'phone-grip'      }, // What: Phone Grips Row. Why: Tony makes phone grips. How: This names their category.
	{ labStr : 'Straw Charms',     sluStr : 'straw-charm'     }  // What: Straw Charms Row. Why: Tony makes straw charms. How: This names their category.


];



type FaiRecTyp = { altStr : string, catArr : CatSluTyp[], filStr : string }; // What: Fair Record Type. Why: A booth shot lists by hand the categories it shows and describes the table, which its card's name can't. How: This names the photo's description, its categories, and its file name without the extension.

const FAI_REC_ARR : FaiRecTyp[] = [ // What: Fair Record Array. Why: The craft fair booth shots show Tony's whole table, so they live in the gallery and under the filters of the pieces they show, which keeps Straw Charms from being empty. How: Each row names the photo, the categories it shows, and its description.


	{ altStr : 'Pen toppers in clear stands on a shelf, with wine stoppers, keychains, and a card about Tony', catArr : [ 'pen-topper', 'wine-stopper', 'keychain' ], filStr : 'booth-1' }, // What: First Booth Row. Why: This photo shows a shop window display of pens and stoppers with keychains below. How: This tags it under pen toppers, wine stoppers, and keychains.

	{ altStr : "A craft fair table of pen toppers, wine stoppers, dog necklaces, keychains, and Tony's cartoon", catArr : [ 'pen-topper', 'wine-stopper', 'keychain', 'dog-necklace' ], filStr : 'booth-2' }, // What: Second Booth Row. Why: This photo shows a full craft fair table. How: This tags it under pen toppers, wine stoppers, keychains, and dog necklaces.

	{ altStr : 'Beaded keychains and straw charms beside bagged pens and a framed cartoon of Tony', catArr : [ 'pen-topper', 'keychain', 'straw-charm' ], filStr : 'booth-3' }, // What: Third Booth Row. Why: This photo is a close view of keychains, charms, and pens beside his cartoon. How: This tags it under pen toppers, keychains, and straw charms.

	{ altStr : 'Tony behind his outdoor craft fair table of pen toppers, wine stoppers, and badge reels', catArr : [ 'pen-topper', 'wine-stopper', 'name-badge-reel' ], filStr : 'booth-4' } // What: Fourth Booth Row. Why: This photo shows Tony at his own table outdoors. How: This tags it under pen toppers, wine stoppers, and name badge reels.


];



// #region PHO_ALT_OBJ

/**
 * PHO_ALT_OBJ = Photo Alternative Object
 *
 * @summary
 * The text alternative for each single piece's and set's photo, keyed by its
 * file name without the extension. Each describes what the photo shows, the
 * piece's colors, shapes, and charms, rather than repeating the card's name,
 * which a screen reader already reads beside it, and stays under 100
 * characters. Every row is a file name and its description, so no row needs
 * a comment of its own.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const PHO_ALT_OBJ : Record< string, string > = { // What: Photo Alternative Object. Why: A screen reader should hear what each photo shows, not the card's name again. How: The cards look each photo's description up by its file name.


	'car-freshie-1'     : 'Bagged car freshies hanging on wire racks and laid out on a black table at a craft fair',
	'car-freshie-2'     : 'Car freshies shaped like a steer skull, a paw, a faith cross, a leopard tag, a moon, and a smiley',
	'car-freshie-3'     : 'Six round car freshies printed with sayings, a daisy, and a rainbow, with dotted and leopard rims',
	'car-freshie-4'     : 'Car freshies shaped like a bulldog, a mama bear, ducks, a cow, a flower hat, and a blessed cross',
	'car-freshie-5'     : 'A white paw print car freshie with a black heart, bagged with its scent card',
	'dog-necklace-1'    : 'Six beaded dog necklaces laid in rows of pearl, pink, rainbow, green, and lavender beads',
	'dog-necklace-10'   : 'A lavender, white, and purple striped beaded dog necklace with a gold ring and a tag',
	'dog-necklace-11'   : 'Bright beaded dog necklaces with pumpkins, polka dots, and spiderwebs on a black floral cloth',
	'dog-necklace-12'   : 'A dog necklace of dark beads with a rainbow sheen on a black table cloth',
	'dog-necklace-13'   : "Beaded dog necklaces on Tony's outdoor craft fair table, with Tony seated behind it",
	'dog-necklace-14'   : 'A red, green, and clear beaded dog necklace with polka dot beads and the name Luna',
	'dog-necklace-15'   : 'A lavender, red, and green beaded dog necklace with a silver ring and a stamped tag',
	'dog-necklace-16'   : 'A pink and purple striped beaded dog necklace with the name Luna',
	'dog-necklace-17'   : 'A dog necklace of blue and rainbow disco beads with a black heart clasp, on a light cloth',
	'dog-necklace-18'   : 'A rack of beaded dog necklaces in yellow, lavender, pink, green, and pearl beads',
	'dog-necklace-19'   : 'A pink and lavender beaded dog necklace with a gold ring and a tag',
	'dog-necklace-2'    : 'A lavender, red, and green beaded dog necklace with a silver ring and a stamped letter tag',
	'dog-necklace-3'    : 'Beaded dog necklaces on a stand and in rows on a craft fair table, beside a plush puppy',
	'dog-necklace-4'    : 'Orange, cream, and black beaded dog necklaces coiled on a craft fair table',
	'dog-necklace-5'    : 'A plush puppy wearing a beaded necklace beside pink and pearl necklaces on a craft fair table',
	'dog-necklace-6'    : 'A Halloween dog necklace of orange and black beads with pumpkins, bats, Boo, and the name Luna',
	'dog-necklace-7'    : 'Six dog necklaces in pearl, lavender, green, and yellow beads, two with flower beads',
	'dog-necklace-8'    : 'A dog necklace of blue and rainbow disco beads with a black heart clasp and a tag',
	'dog-necklace-9'    : 'A dog necklace of large white and opal pearl beads',
	'keychain-1'        : 'Beaded keychains hanging from a metal stand on a blue craft fair table',
	'name-badge-reel-1' : "Bagged name badge reels with colorful beads and saying charms, each with a Tony's Toppers card",
	'pen-topper-1'      : 'Four bagged beaded pens topped with a skull, a pink bunny, and two saying charms',
	'pen-topper-10'     : 'Bagged and loose beaded pens in a clear tray and a mug on a blue craft fair table',
	'pen-topper-11'     : 'Three bagged beaded pens topped with a white bear, a bulldog, and a Faith Over Fear charm',
	'pen-topper-2'      : 'Three pink beaded pens with ribbon charms and tassels on a breast cancer awareness card',
	'pen-topper-3'      : 'Tony seated behind his craft fair table of beaded pens, with his framed cartoon portrait',
	'pen-topper-4'      : 'Four bagged beaded pens topped with a bulldog, a bee, a heart, and a pink jeep',
	'pen-topper-5'      : 'Three bagged beaded pens with saying charms and a leopard cross',
	'pen-topper-6'      : 'Three bagged beaded pens topped with a saying, a pink hand, and a puppy',
	'pen-topper-7'      : 'Beaded pens with character charms in a clear tray on a blue craft fair table',
	'pen-topper-8'      : 'Three bagged beaded pens topped with a coffee shop logo, a floral bead, and a blue jeep',
	'pen-topper-9'      : 'A cup of Halloween beaded pens with ghost, cauldron, Hocus Pocus, and Stay Spooky charms',
	'pen-wine-set-1'    : 'Beaded pens and wine stoppers on clear stands, with bagged pens behind them',
	'pen-wine-set-2'    : 'Beaded wine stoppers and pens with flowers, hearts, and characters on clear stands',
	'pen-wine-set-3'    : 'Beaded wine stoppers and pens on a clear stand on a gray grid mat',
	'phone-grip-1'      : 'A beaded phone grip strap with a black and white bulldog charm and a pink heart bead',
	'phone-grip-2'      : "Five bagged pastel beaded phone grips, each with a flower bead and a Tony's Toppers card",
	'phone-grip-3'      : 'Four bagged beaded phone grips with red, blue, orange, and pink flower beads',
	'phone-grip-4'      : 'Beaded phone grips with puppy, football, and saying charms laid out on a teal tray',
	'phone-grip-5'      : 'A lavender beaded phone grip with a flower bead and faceted beads, clipped to a white phone case',
	'phone-grip-6'      : 'Bagged beaded phone grips with orange, gray, yellow, and red flower beads',
	'phone-grip-7'      : 'Beaded phone grips hanging from a stand on a craft fair table',
	'phone-grip-8'      : 'A beaded phone grip with a bulldog charm and pink and lavender beads, beside its heart mount',
	'phone-grip-9'      : 'Beaded phone grips hanging from stands on a craft fair table in a hall',
	'wine-stopper-1'    : 'Six beaded wine stoppers topped with a character, a rose, a yin-yang skull, a flower, and a cactus'


};

// #endregion PHO_ALT_OBJ



const PRO_URL_OBJ = import.meta.glob< string >( '../../assets/products/*.webp', { eager : true, import : 'default' } ); // What: Product URL Object. Why: The product photos live in src/assets/products, where Vite fingerprints each one. How: This imports every photo in the folder at build time and maps each one's source path to its built URL.



type SetRecTyp = { catArr : CatSluTyp[], filStr : string }; // What: Set Record Type. Why: A set lists by hand the categories it shows. How: This names its categories and its file name without the extension.

const SET_REC_ARR : SetRecTyp[] = [ // What: Set Record Array. Why: A few photos show pen toppers and wine stoppers displayed together, so each is one card under both filters rather than a copy under each. How: Each row names the photo and the categories it shows.


	{ catArr : [ 'pen-topper', 'wine-stopper' ], filStr : 'pen-wine-set-1' }, // What: First Set Row. Why: This photo shows pens and stoppers in a shop display. How: This tags it under both.
	{ catArr : [ 'pen-topper', 'wine-stopper' ], filStr : 'pen-wine-set-2' }, // What: Second Set Row. Why: This photo shows pens and stoppers on acrylic stands. How: This tags it under both.
	{ catArr : [ 'pen-topper', 'wine-stopper' ], filStr : 'pen-wine-set-3' }  // What: Third Set Row. Why: This photo shows a few pens and stoppers laid out together. How: This tags it under both.


];

// #endregion Constants



// #region Helpers

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
 * @param catSluStr - Category Slug String: The category's slug, e.g.
 *                    'pen-topper'.
 *
 * @returns The category's photo file names, without their extension.
 *
 * @example
 * ```ts
 * phoNamFun('keychain') // => [ 'keychain-1' ]
 * ```
 *
*/

function phoNamFun ( catSluStr : CatSluTyp ) : string[] {


	const filNamReg = new RegExp( `^${ catSluStr }-(\\d+)$` );                                                                    // What: File Name Regular Expression. Why: A single piece's photo is named its category's slug, a dash, and a number. How: This matches that name and captures the number.
	const filNamArr = Object.keys( PRO_URL_OBJ ).map( ( souPatStr ) => souPatStr.slice( souPatStr.lastIndexOf( '/' ) + 1, -5 ) ); // What: File Name Array. Why: Each imported photo is keyed by its source path. How: This keeps just the file name, without its folder or its .webp extension.



	return filNamArr.filter( ( filNamStr ) => filNamReg.test( filNamStr ) ).sort( ( filOneStr, filTwoStr ) => Number( filOneStr.match( filNamReg )![ 1 ] ) - Number( filTwoStr.match( filNamReg )![ 1 ] ) ); // What: Category Names Return. Why: The cards list each category's photos in number order. How: This keeps the category's names and sorts them by their numbers. // What: Non-Null Note. Why: Each match can't be null. How: Every name reaching the sort already passed the same test in the filter.


}

// #endregion phoNamFun



const phoUrlFun = ( filNamStr : string ) => PRO_URL_OBJ[ `../../assets/products/${ filNamStr }.webp` ]; // What: Photo URL Function. Why: Every card looks its photo up the same way. How: This returns the photo's built URL by its file name.



type ProRecTyp = { // What: Product Record Type. Why: The products grid and the gallery read every photo the same way, through PRO_REC_ARR. How: This describes one photo's card.


	altStr : string,      // What: Alternative String. Why: A screen reader announces each photo by its text alternative. How: Every photo carries a short description of what it shows, from PHO_ALT_OBJ or its booth row, kept under 100 characters.
	catArr : CatSluTyp[], // What: Category Array. Why: One photo can show more than one kind of piece. How: This lists every category the photo is tagged with.
	faiBoo : boolean,     // What: Fair Boolean. Why: A craft fair booth shot shows a whole table, so it belongs in the gallery and under the filters it's tagged with, not in the All list. How: This is true for a booth shot and false for a piece or set.
	heiNum : number,      // What: Height Number. Why: The photo's img carries its intrinsic size, so the page doesn't shift while it loads. How: This is the photo's height in pixels, from photo-sizes.ts.
	ideStr : string,      // What: Identifier String. Why: React tells the cards apart by a key. How: This is the photo's file name, unique in the folder.
	imaStr : string,      // What: Image String. Why: The card shows its photo. How: This is the photo's built URL.
	labStr : string,      // What: Label String. Why: The card's tag and subtitle name what kind of piece it shows. How: This is the category's singular label, both labels for a set, or Craft Fair Table for a booth shot.
	namStr : string,      // What: Name String. Why: The card has a title. How: This is the label and the photo's number within its kind, with Set before the number for a set.
	widNum : number       // What: Width Number. Why: The photo's img carries its intrinsic size, so the page doesn't shift while it loads. How: This is the photo's width in pixels, from photo-sizes.ts.


};

const PRO_REC_ARR : ProRecTyp[] = [ // What: Product Record Array. Why: The products grid and the gallery read every photo from one list. How: This lists every single piece in category order, with the sets right after the wine stoppers, then the booth shots, which only the filters and the gallery show.


	...CAT_REC_ARR.flatMap( ( catRecObj ) => [ // What: Category Pieces Spread. Why: Single pieces are listed category by category. How: This builds each category's cards, adding the sets after the wine stoppers.


		...phoNamFun( catRecObj.sluStr ).map( ( filNamStr, filIndNum ) => ({ // What: Single Piece Cards Spread. Why: Each of the category's photos gets a card, numbered within its kind. How: This builds one record per photo.


			altStr : PHO_ALT_OBJ[ filNamStr ],                                  // What: Alternative String. Why: A screen reader should hear what the photo shows. How: This looks up the photo's description by its file name.
			catArr : [ catRecObj.sluStr ],                                      // What: Category Array. Why: A single piece shows one kind. How: This lists its category alone.
			faiBoo : false,                                                     // What: Fair Boolean. Why: A single piece isn't a booth shot. How: This keeps it in the All list.
			heiNum : PHO_SIZ_OBJ[ filNamStr ].heiNum,                           // What: Height Number. Why: The img carries its photo's size. How: This looks up the photo's height by its file name.
			ideStr : filNamStr,                                                 // What: Identifier String. Why: React needs a unique key. How: This reuses the file name.
			imaStr : phoUrlFun( filNamStr ),                                    // What: Image String. Why: The card shows its photo. How: This looks up the built URL.
			labStr : CAT_LAB_OBJ[ catRecObj.sluStr ],                           // What: Label String. Why: The card names its kind. How: This is the category's singular label.
			namStr : `${ CAT_LAB_OBJ[ catRecObj.sluStr ] } ${ filIndNum + 1 }`, // What: Name String. Why: The card has a title. How: This joins the label and the photo's number.
			widNum : PHO_SIZ_OBJ[ filNamStr ].widNum                            // What: Width Number. Why: The img carries its photo's size. How: This looks up the photo's width by its file name.


		}) ),

		...( catRecObj.sluStr === 'wine-stopper' ? SET_REC_ARR.map( ( setRecObj, setIndNum ) => ({ // What: Set Cards Spread. Why: The pen and wine stopper sets sit right after the wine stoppers in the All list. How: This builds one record per set, only after the wine stopper category.


			altStr : PHO_ALT_OBJ[ setRecObj.filStr ],                    // What: Alternative String. Why: A screen reader should hear what the set shows. How: This looks up the photo's description by its file name.
			catArr : setRecObj.catArr,                                   // What: Category Array. Why: A set shows both kinds. How: This lists both categories.
			faiBoo : false,                                              // What: Fair Boolean. Why: A set isn't a booth shot. How: This keeps it in the All list.
			heiNum : PHO_SIZ_OBJ[ setRecObj.filStr ].heiNum,             // What: Height Number. Why: The img carries its photo's size. How: This looks up the photo's height by its file name.
			ideStr : setRecObj.filStr,                                   // What: Identifier String. Why: React needs a unique key. How: This reuses the file name.
			imaStr : phoUrlFun( setRecObj.filStr ),                      // What: Image String. Why: The card shows its photo. How: This looks up the built URL.
			labStr : 'Pen Topper & Wine Stopper',                        // What: Label String. Why: The card names both kinds it shows. How: This joins the two labels.
			namStr : `Pen Topper & Wine Stopper Set ${ setIndNum + 1 }`, // What: Name String. Why: The card has a title. How: This names the set and its number.
			widNum : PHO_SIZ_OBJ[ setRecObj.filStr ].widNum              // What: Width Number. Why: The img carries its photo's size. How: This looks up the photo's width by its file name.


		}) ) : [] )


	] ),

	...FAI_REC_ARR.map( ( faiRecObj, faiIndNum ) => ({ // What: Booth Cards Spread. Why: The booth shots come last, for the filters and the gallery. How: This builds one record per booth shot.


		altStr : faiRecObj.altStr,                       // What: Alternative String. Why: A booth shot shows a whole table, which its name can't describe. How: This takes the row's description.
		catArr : faiRecObj.catArr,                       // What: Category Array. Why: A booth shot shows several kinds. How: This lists every category it's tagged with.
		faiBoo : true,                                   // What: Fair Boolean. Why: A booth shot belongs in the gallery and the filters, not the All list. How: This marks it.
		heiNum : PHO_SIZ_OBJ[ faiRecObj.filStr ].heiNum, // What: Height Number. Why: The img carries its photo's size. How: This looks up the photo's height by its file name.
		ideStr : faiRecObj.filStr,                       // What: Identifier String. Why: React needs a unique key. How: This reuses the file name.
		imaStr : phoUrlFun( faiRecObj.filStr ),          // What: Image String. Why: The card shows its photo. How: This looks up the built URL.
		labStr : 'Craft Fair Table',                     // What: Label String. Why: The card names what it shows. How: This calls it a craft fair table.
		namStr : `Craft Fair Table ${ faiIndNum + 1 }`,  // What: Name String. Why: The card has a title. How: This names the table and its number.
		widNum : PHO_SIZ_OBJ[ faiRecObj.filStr ].widNum  // What: Width Number. Why: The img carries its photo's size. How: This looks up the photo's width by its file name.


	}) )


];

// #endregion Helpers



// #region Exports

export { CAT_REC_ARR, PRO_REC_ARR, type CatSluTyp }; // What: Named Exports. Why: The products grid needs the categories and every photo, and the gallery the booth shots. How: This exports the two lists and the category type their rows use.

// #endregion Exports


