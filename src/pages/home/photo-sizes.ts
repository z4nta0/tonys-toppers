


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


	'booth-1'           : { heiNum : 927,  widNum : 696 },
	'booth-2'           : { heiNum : 839,  widNum : 696 },
	'booth-3'           : { heiNum : 1420, widNum : 696 },
	'booth-4'           : { heiNum : 917,  widNum : 696 },
	'car-freshie-1'     : { heiNum : 746,  widNum : 562 },
	'car-freshie-2'     : { heiNum : 747,  widNum : 562 },
	'car-freshie-3'     : { heiNum : 491,  widNum : 562 },
	'car-freshie-4'     : { heiNum : 426,  widNum : 562 },
	'car-freshie-5'     : { heiNum : 742,  widNum : 562 },
	'dog-necklace-1'    : { heiNum : 750,  widNum : 524 },
	'dog-necklace-10'   : { heiNum : 647,  widNum : 562 },
	'dog-necklace-11'   : { heiNum : 744,  widNum : 562 },
	'dog-necklace-12'   : { heiNum : 573,  widNum : 562 },
	'dog-necklace-13'   : { heiNum : 740,  widNum : 562 },
	'dog-necklace-14'   : { heiNum : 528,  widNum : 562 },
	'dog-necklace-15'   : { heiNum : 575,  widNum : 562 },
	'dog-necklace-16'   : { heiNum : 546,  widNum : 562 },
	'dog-necklace-17'   : { heiNum : 315,  widNum : 562 },
	'dog-necklace-18'   : { heiNum : 417,  widNum : 562 },
	'dog-necklace-19'   : { heiNum : 621,  widNum : 562 },
	'dog-necklace-2'    : { heiNum : 555,  widNum : 562 },
	'dog-necklace-3'    : { heiNum : 599,  widNum : 562 },
	'dog-necklace-4'    : { heiNum : 713,  widNum : 562 },
	'dog-necklace-5'    : { heiNum : 676,  widNum : 562 },
	'dog-necklace-6'    : { heiNum : 553,  widNum : 562 },
	'dog-necklace-7'    : { heiNum : 747,  widNum : 562 },
	'dog-necklace-8'    : { heiNum : 484,  widNum : 562 },
	'dog-necklace-9'    : { heiNum : 670,  widNum : 562 },
	'keychain-1'        : { heiNum : 744,  widNum : 562 },
	'name-badge-reel-1' : { heiNum : 460,  widNum : 562 },
	'pen-topper-1'      : { heiNum : 547,  widNum : 562 },
	'pen-topper-10'     : { heiNum : 696,  widNum : 562 },
	'pen-topper-11'     : { heiNum : 702,  widNum : 562 },
	'pen-topper-2'      : { heiNum : 667,  widNum : 562 },
	'pen-topper-3'      : { heiNum : 735,  widNum : 562 },
	'pen-topper-4'      : { heiNum : 536,  widNum : 562 },
	'pen-topper-5'      : { heiNum : 678,  widNum : 562 },
	'pen-topper-6'      : { heiNum : 637,  widNum : 562 },
	'pen-topper-7'      : { heiNum : 602,  widNum : 562 },
	'pen-topper-8'      : { heiNum : 620,  widNum : 562 },
	'pen-topper-9'      : { heiNum : 555,  widNum : 562 },
	'pen-wine-set-1'    : { heiNum : 693,  widNum : 562 },
	'pen-wine-set-2'    : { heiNum : 664,  widNum : 562 },
	'pen-wine-set-3'    : { heiNum : 306,  widNum : 562 },
	'phone-grip-1'      : { heiNum : 750,  widNum : 448 },
	'phone-grip-2'      : { heiNum : 494,  widNum : 562 },
	'phone-grip-3'      : { heiNum : 518,  widNum : 562 },
	'phone-grip-4'      : { heiNum : 451,  widNum : 562 },
	'phone-grip-5'      : { heiNum : 750,  widNum : 428 },
	'phone-grip-6'      : { heiNum : 534,  widNum : 562 },
	'phone-grip-7'      : { heiNum : 665,  widNum : 562 },
	'phone-grip-8'      : { heiNum : 750,  widNum : 313 },
	'phone-grip-9'      : { heiNum : 549,  widNum : 562 },
	'tony-cartoon'      : { heiNum : 1065, widNum : 710 },
	'tony-portrait'     : { heiNum : 952,  widNum : 756 },
	'wine-stopper-1'    : { heiNum : 522,  widNum : 562 }


};

// #endregion PHO_SIZ_OBJ

// #endregion Constants



// #region Exports

export { PHO_SIZ_OBJ }; // What: Named Export. Why: The catalog and the hero and About sections read the photo sizes. How: This exports the sizes object.

// #endregion Exports


