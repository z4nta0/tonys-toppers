


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
 * PHO_SIZ_OBJ = Photo Size Object
 *
 * @summary
 * One row per photo, keyed by its file name without the extension. Every row
 * has the same two fields, so no row needs a comment of its own:
 *
 * - `heiNum` (Number): Height Number, the photo's height in pixels.
 *
 * - `widNum` (Number): Width Number, the photo's width in pixels.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const PHO_SIZ_OBJ : Record< string, PhoSizTyp > = { // What: Photo Size Object. Why: Every img element needs its photo's intrinsic size. How: The page looks each photo's size up by its file name.


	'booth-1'           : { heiNum : 1260, widNum : 946  },
	'booth-2'           : { heiNum : 1259, widNum : 1044 },
	'booth-3'           : { heiNum : 2048, widNum : 1004 },
	'booth-4'           : { heiNum : 1376, widNum : 1044 },
	'car-freshie-1'     : { heiNum : 1118, widNum : 843  },
	'car-freshie-2'     : { heiNum : 1121, widNum : 843  },
	'car-freshie-3'     : { heiNum : 737,  widNum : 843  },
	'car-freshie-4'     : { heiNum : 639,  widNum : 843  },
	'car-freshie-5'     : { heiNum : 1113, widNum : 843  },
	'dog-necklace-1'    : { heiNum : 1125, widNum : 786  },
	'dog-necklace-10'   : { heiNum : 971,  widNum : 843  },
	'dog-necklace-11'   : { heiNum : 1115, widNum : 843  },
	'dog-necklace-12'   : { heiNum : 859,  widNum : 843  },
	'dog-necklace-13'   : { heiNum : 1110, widNum : 843  },
	'dog-necklace-14'   : { heiNum : 792,  widNum : 843  },
	'dog-necklace-15'   : { heiNum : 862,  widNum : 843  },
	'dog-necklace-16'   : { heiNum : 819,  widNum : 843  },
	'dog-necklace-17'   : { heiNum : 473,  widNum : 843  },
	'dog-necklace-18'   : { heiNum : 625,  widNum : 843  },
	'dog-necklace-19'   : { heiNum : 931,  widNum : 843  },
	'dog-necklace-2'    : { heiNum : 833,  widNum : 843  },
	'dog-necklace-3'    : { heiNum : 899,  widNum : 843  },
	'dog-necklace-4'    : { heiNum : 1069, widNum : 843  },
	'dog-necklace-5'    : { heiNum : 1014, widNum : 843  },
	'dog-necklace-6'    : { heiNum : 830,  widNum : 843  },
	'dog-necklace-7'    : { heiNum : 1121, widNum : 843  },
	'dog-necklace-8'    : { heiNum : 726,  widNum : 843  },
	'dog-necklace-9'    : { heiNum : 1005, widNum : 843  },
	'keychain-1'        : { heiNum : 1115, widNum : 843  },
	'name-badge-reel-1' : { heiNum : 690,  widNum : 843  },
	'pen-topper-1'      : { heiNum : 821,  widNum : 843  },
	'pen-topper-10'     : { heiNum : 1044, widNum : 843  },
	'pen-topper-11'     : { heiNum : 1053, widNum : 843  },
	'pen-topper-2'      : { heiNum : 1000, widNum : 843  },
	'pen-topper-3'      : { heiNum : 1102, widNum : 843  },
	'pen-topper-4'      : { heiNum : 804,  widNum : 843  },
	'pen-topper-5'      : { heiNum : 1017, widNum : 843  },
	'pen-topper-6'      : { heiNum : 955,  widNum : 843  },
	'pen-topper-7'      : { heiNum : 902,  widNum : 843  },
	'pen-topper-8'      : { heiNum : 930,  widNum : 843  },
	'pen-topper-9'      : { heiNum : 833,  widNum : 843  },
	'pen-wine-set-1'    : { heiNum : 1040, widNum : 843  },
	'pen-wine-set-2'    : { heiNum : 995,  widNum : 843  },
	'pen-wine-set-3'    : { heiNum : 459,  widNum : 843  },
	'phone-grip-1'      : { heiNum : 1125, widNum : 672  },
	'phone-grip-2'      : { heiNum : 741,  widNum : 843  },
	'phone-grip-3'      : { heiNum : 777,  widNum : 843  },
	'phone-grip-4'      : { heiNum : 676,  widNum : 843  },
	'phone-grip-5'      : { heiNum : 1125, widNum : 642  },
	'phone-grip-6'      : { heiNum : 801,  widNum : 843  },
	'phone-grip-7'      : { heiNum : 997,  widNum : 843  },
	'phone-grip-8'      : { heiNum : 1125, widNum : 469  },
	'phone-grip-9'      : { heiNum : 823,  widNum : 843  },
	'tony-cartoon'      : { heiNum : 1344, widNum : 896  },
	'tony-portrait'     : { heiNum : 952,  widNum : 756  },
	'wine-stopper-1'    : { heiNum : 784,  widNum : 843  }


};

// #endregion PHO_SIZ_OBJ

// #endregion Constants



// #region Exports

export { PHO_SIZ_OBJ }; // What: Named Export. Why: The components that show photos read their sizes from here. How: This exports the sizes object.

// #endregion Exports


