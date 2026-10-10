



// #region Imports

import { useState } from 'react'; // What: Use State. Why: The form remembers its fields and whether it was just sent. How: Two state pairs hold them.


import type { ChangeEvent } from 'react'; // What: Change Event. Why: Every field reports its changes the same way. How: This types fieChaFun's event.
import type { FormEvent   } from 'react'; // What: Form Event. Why: Sending the form starts from its submit event. How: This types forSubFun's event.

// #endregion Imports



/**
 * contact.tsx = Contact
 *
 * @summary
 * The home page's closing section: a note inviting visitors to reach Tony,
 * his phone number and Facebook page as links, his home town, and a form that
 * sends a name, email, the kind of piece they're interested in, and a message
 * through Netlify Forms. The fields' names must match the hidden copy of the
 * form in index.html, which Netlify reads at deploy time.
 *
 * Sections:
 *  - Types
 *  - Constants
 *  - Components
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Types

type IntOptTyp = 'A pen topper' | 'A wine stopper' | 'A keychain' | 'A dog necklace' | 'A car freshie' | 'A name badge reel' | 'A phone grip' | 'A custom piece' | 'Just saying hi'; // What: Interest Option Type. Why: The interest field offers a fixed set of choices. How: This lists every choice, each one also the value sent.



type ForStaTyp = { // What: Form State Type. Why: The form's fields are held together in one record. How: Each key is a field's name attribute, which Netlify records, so none of them are renamed.


	email    : string,    // What: Email. Why: Tony needs a way to reply. How: This holds the email field.
	interest : IntOptTyp, // What: Interest. Why: Tony should know what the visitor is after. How: This holds the chosen interest.
	message  : string,    // What: Message. Why: The visitor says what they have in mind. How: This holds the message field.
	name     : string     // What: Name. Why: Tony should know who's writing. How: This holds the name field.


};

// #endregion Types



// #region Constants

const FOR_EMP_OBJ : ForStaTyp = { email : '', interest : 'A pen topper', message : '', name : '' }; // What: Form Empty Object. Why: The form starts empty and empties again once sent. How: This holds blank fields with the first interest chosen.



const INT_OPT_ARR : IntOptTyp[] = [ // What: Interest Option Array. Why: The interest field lists every choice in this order. How: Each entry is one option's text and value.


	'A pen topper',      // What: Pen Topper Option. Why: Pen toppers are Tony's first and biggest line. How: This is the default choice.
	'A wine stopper',    // What: Wine Stopper Option. Why: Visitors may want a wine stopper. How: This offers it.
	'A keychain',        // What: Keychain Option. Why: Visitors may want a keychain. How: This offers it.
	'A dog necklace',    // What: Dog Necklace Option. Why: Visitors may want a dog necklace. How: This offers it.
	'A car freshie',     // What: Car Freshie Option. Why: Visitors may want a car freshie. How: This offers it.
	'A name badge reel', // What: Name Badge Reel Option. Why: Visitors may want a badge reel. How: This offers it.
	'A phone grip',      // What: Phone Grip Option. Why: Visitors may want a phone grip. How: This offers it.
	'A custom piece',    // What: Custom Piece Option. Why: Tony makes pieces to order. How: This offers a custom request.
	'Just saying hi'     // What: Saying Hi Option. Why: Not every message is an order. How: This offers a friendly note.


];

// #endregion Constants



// #region Components

// #region ConSecCom

/**
 * ConSecCom = Contact Section Component
 *
 * @summary
 * Renders the contact section. The form's fields are controlled, the browser
 * won't send it until the required name, email, and message are filled in
 * and the email looks like an address, and typing in any field hides the
 * thank-you note. Sending it posts the fields to
 * Netlify Forms in the background, shows the thank-you note at once, empties
 * the form, and hides the note again after 6 seconds; a failed request only
 * raises an alert, which step 7 of the cleanup plan replaces with a note that
 * waits for Netlify's answer. The icons beside the contact links are hidden
 * from screen readers, and the send button is named by its words alone, so
 * neither reads a decorative glyph aloud.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param props - This component does not use any props.
 *
 * @returns The contact section element.
 *
 * @example
 * ```tsx
 * ConSecCom() // => <ConSecCom />
 * ```
 *
*/

function ConSecCom () : React.JSX.Element {


	const [ forDatObj, setForDatObj ] = useState< ForStaTyp >( FOR_EMP_OBJ ); // What: Form Data Object And Setter. Why: The form's fields are controlled. How: This holds every field's value, starting empty.
	const [ forSenBoo, setForSenBoo ] = useState( false );                  // What: Form Sent Boolean And Setter. Why: The thank-you note shows only right after sending. How: This holds whether it's showing.


	const fieChaFun = ( chaEveObj : ChangeEvent< HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement > ) => { // What: Field Change Function. Why: Every field updates the form the same way. How: This stores the field's new value under its name and hides the thank-you note.


		const { name : fieNamStr, value : fieValStr } = chaEveObj.target; // What: Field Name And Value Strings. Why: The field's name says which value changed. How: This reads the target's name and value, renaming the DOM's keys.


		setForDatObj( ( preForObj ) => ({ ...preForObj, [ fieNamStr ] : fieValStr }) ); // What: Form Data Update. Why: The changed field keeps its new value. How: This copies the form and replaces that one field.

		setForSenBoo( false ); // What: Thank-You Hide Call. Why: Typing again means the visitor has moved on from the last message. How: This hides the note.


	};


	// #region forSubFun

	/**
	 * forSubFun = Form Submit Function
	 *
	 * @summary
	 * Handles sending the form. It stops the browser's own submission, posts
	 * the form's fields to Netlify Forms in the background as a URL-encoded
	 * body, which Netlify accepts at the site's root, then shows the thank-you
	 * note at once, empties the form, and hides the note again after 6
	 * seconds. A request that fails to reach Netlify raises an alert; one
	 * Netlify rejects still shows the note, which step 7 of the cleanup plan
	 * fixes.
	 *
	 * @author z4nta0 <https://github.com/z4nta0>
	 *
	 * @param subEveObj - Submit Event Object: The form's submit event.
	 *
	 * @returns This function does not return anything.
	 *
	 * @example
	 * ```ts
	 * forSubFun(subEveObj) // => void
	 * ```
	 *
	*/

	const forSubFun = ( subEveObj : FormEvent< HTMLFormElement > ) => { // What: Form Submit Function. Why: Sending the form shouldn't leave the page. How: This posts the fields to Netlify in the background and shows the thank-you note.


		subEveObj.preventDefault(); // What: Default Submit Cancel. Why: The browser would otherwise leave the page for Netlify's own thank-you page. How: This stops the form's own submission.


		const forCurEle = subEveObj.target as HTMLFormElement;                               // What: Form Current Element. Why: The fields are read from the form itself. How: This is the submitted form. // What: Type Assertion Note. Why: A submit event's target types as a plain event target. How: Only this form's submit event reaches forSubFun.
		const forFieObj = new FormData( forCurEle ) as unknown as Record< string, string >; // What: Form Fields Object. Why: Netlify reads the fields as a URL-encoded body. How: This collects every named field, the hidden form-name included. // What: Type Assertion Note. Why: URLSearchParams accepts string pairs, while FormData can also hold files. How: This form has no file fields, so every value is a string.


		void fetch( '/', { // What: Netlify Post Call. Why: Netlify Forms records submissions posted to the site's root. How: This posts the fields in the background; void marks the promise as deliberately unawaited.


			body    : new URLSearchParams( forFieObj ).toString(),                 // What: Body. Why: Netlify reads a URL-encoded body. How: This encodes every field as name and value pairs.
			headers : { 'Content-Type' : 'application/x-www-form-urlencoded' }, // What: Headers. Why: Netlify has to know how the body is encoded. How: This names the URL-encoded type.
			method  : 'POST'                                                    // What: Method. Why: A submission is a post. How: This sends it as one.


		} ).catch( ( errCatObj ) => alert( errCatObj ) ); // What: Request Failure Catch. Why: A request that never reaches Netlify should say so. How: This alerts with the error.

		setForSenBoo( true ); // What: Thank-You Show Call. Why: The visitor should see the form went. How: This shows the note.

		setForDatObj( FOR_EMP_OBJ ); // What: Form Reset Call. Why: A sent form starts fresh. How: This empties every field.

		window.setTimeout( () => setForSenBoo( false ), 6000 ); // What: Thank-You Timer Call. Why: The note shouldn't stay up forever. How: This hides it after 6 seconds.


	};

	// #endregion forSubFun



	return (


		<section
			id='contact'

			className='section contact-section'
		>{ /* What: Contact Section Element. Why: The page ends where visitors reach Tony. How: Its id stays the plain word contact, since the bar links to it and it can appear in the page's address. */ }


			<div className='container'>{ /* What: Contact Container Div Element. Why: The section's content lines up with the page's width. How: This centers it at a capped width. */ }


				<div className='contact-grid'>{ /* What: Contact Grid Div Element. Why: The ways to reach Tony and the form sit side by side on wide screens. How: This lays out the two columns. */ }


					<div className='contact-info'>{ /* What: Contact Info Div Element. Why: The direct ways to reach Tony read as one column. How: This stacks the label, heading, note, and contact rows. */ }


						<div className='section-label'>Get in Touch</div>{ /* What: Contact Label Div Element. Why: A small label names the section. How: This shows it above the heading. */ }

						<h2>Want a piece, or have a <em>question?</em></h2>{ /* What: Contact Heading Element. Why: The heading invites visitors to write. How: The question sits in an italic accent. */ }

						<p>
							Tony loves hearing from people who appreciate his work. Reach out directly or drop a
							note below, and he'll get back to you.
						</p>{ /* What: Contact Note Paragraph Element. Why: Visitors should know Tony welcomes messages. How: This shows two sentences beneath the heading. */ }


						<a
							className='contact-direct'

							href='tel:4177330681'
						>{ /* What: Phone Contact Anchor Element. Why: Calling or texting is the quickest way to reach Tony. How: This dials his number on phones. */ }


							<div
								className='icon'

								aria-hidden='true'
							>☎</div>{ /* What: Phone Icon Div Element. Why: A telephone marks the row at a glance. How: It's hidden from screen readers, which would read it aloud as black telephone. */ }

							<div>{ /* What: Phone Text Div Element. Why: The row's label and number stack beside the icon. How: This holds the two lines. */ }


								<div className='label'>Call or text</div>{ /* What: Phone Label Div Element. Why: The row says what to do. How: This shows call or text. */ }

								<div className='value'>(417) 733-0681</div>{ /* What: Phone Value Div Element. Why: The number itself is the row's main line. How: This shows it. */ }


							</div>


						</a>


						<a
							className='contact-direct'

							href='https://www.facebook.com/profile.php?id=61560009400871'
							rel='noopener noreferrer'
							target='_blank'
						>{ /* What: Facebook Contact Anchor Element. Why: Tony shares new pieces and where he'll be on his Facebook page. How: This opens the page in a new tab, without giving it access to this one. */ }


							<div
								className='icon'

								aria-hidden='true'
							>📲</div>{ /* What: Facebook Icon Div Element. Why: A phone marks the row at a glance. How: It's hidden from screen readers, which would read the emoji aloud. */ }

							<div>{ /* What: Facebook Text Div Element. Why: The row's label and name stack beside the icon. How: This holds the two lines. */ }


								<div className='label'>Facebook Page</div>{ /* What: Facebook Label Div Element. Why: The row says where it goes. How: This shows Facebook page. */ }

								<div className='value'>Tony's Toppers</div>{ /* What: Facebook Value Div Element. Why: The page's name is the row's main line. How: This shows it. */ }


							</div>


						</a>


						<div className='contact-direct'>{ /* What: Location Contact Div Element. Why: Visitors should know where Tony is based. How: This shows his home town in the same style as the links, without being one. */ }


							<div
								className='icon'

								aria-hidden='true'
							>📍</div>{ /* What: Location Icon Div Element. Why: A pin marks the row at a glance. How: It's hidden from screen readers, which would read the emoji aloud. */ }

							<div>{ /* What: Location Text Div Element. Why: The row's label and town stack beside the icon. How: This holds the two lines. */ }


								<div className='label'>Based in</div>{ /* What: Location Label Div Element. Why: The row says what it shows. How: This shows based in. */ }

								<div
									className='value'

									style={{ fontSize : '1.15rem' }}
								>{ /* What: Location Value Div Element. Why: The town is the row's main line. How: This shows it a little smaller than the other rows' values, so it fits on one line. */ }
									Bolivar, Missouri
								</div>


							</div>


						</div>


					</div>



					<form
						className='contact-form'

						data-netlify='true'
						name='contactForm'

						onSubmit={ forSubFun }
					>{ /* What: Contact Form Element. Why: Visitors can send Tony a message without leaving the site. How: Netlify Forms records it under the contactForm name, matching the hidden copy in index.html, while forSubFun sends it in the background once the browser's own checks pass: the name, email, and message are required, and the email has to look like an address. */ }


						{ forSenBoo && ( // What: Thank-You Visibility Check. Why: The note shows only right after sending. How: This renders it while forSenBoo is true.


							<div
								className='form-success'

								role='status'
							>{ /* What: Form Success Div Element. Why: The visitor should see the form went. How: Its status role has screen readers announce it. */ }
								✓ Thanks! Your message is ready, and Tony will be in touch soon.
							</div>


						) }


						<div className='form-row'>{ /* What: Form Row Div Element. Why: The name and email fields sit side by side. How: This lays out the two fields in a row. */ }


							<div className='form-field'>{ /* What: Name Field Div Element. Why: The label and input read as one field. How: This stacks them. */ }


								<label htmlFor='namFieInp'>Your Name</label>{ /* What: Name Label Element. Why: The field needs a visible name. How: This labels the name input. */ }

								<input
									id='namFieInp'

									name='name'

									required
									type='text'
									value={ forDatObj.name }

									onChange={ fieChaFun }
								/>{ /* What: Name Input Element. Why: Tony should know who's writing. How: Its name, name, is the field Netlify records. */ }


							</div>

							<div className='form-field'>{ /* What: Email Field Div Element. Why: The label and input read as one field. How: This stacks them. */ }


								<label htmlFor='emaFieInp'>Email</label>{ /* What: Email Label Element. Why: The field needs a visible name. How: This labels the email input. */ }

								<input
									id='emaFieInp'

									name='email'

									required
									type='email'
									value={ forDatObj.email }

									onChange={ fieChaFun }
								/>{ /* What: Email Input Element. Why: Tony needs a way to reply. How: Its name, email, is the field Netlify records. */ }


							</div>


						</div>


						<div className='form-field'>{ /* What: Interest Field Div Element. Why: The label and dropdown read as one field. How: This stacks them. */ }


							<label htmlFor='intFieSel'>I'm interested in</label>{ /* What: Interest Label Element. Why: The field needs a visible name. How: This labels the interest dropdown. */ }

							<select
								id='intFieSel'

								name='interest'

								value={ forDatObj.interest }

								onChange={ fieChaFun }
							>{ /* What: Interest Select Element. Why: Tony should know what the visitor is after. How: Its name, interest, is the field Netlify records. */ }


								{ INT_OPT_ARR.map( ( intOptStr ) => ( // What: Interest Option Map. Why: Each choice gets an option. How: This renders one option per interest.


									<option
										key={ intOptStr }

										value={ intOptStr }
									>{ intOptStr }</option> // What: Interest Option Element. Why: Each choice can be picked. How: Its text is also the value sent.


								))}


							</select>


						</div>

						<div className='form-field'>{ /* What: Message Field Div Element. Why: The label and text box read as one field. How: This stacks them. */ }


							<label htmlFor='mesFieTex'>Message</label>{ /* What: Message Label Element. Why: The field needs a visible name. How: This labels the message box. */ }

							<textarea
								id='mesFieTex'

								name='message'

								placeholder='Tell Tony what you have in mind...'
								required
								value={ forDatObj.message }

								onChange={ fieChaFun }
							/>{ /* What: Message Textarea Element. Why: The visitor says what they have in mind. How: Its name, message, is the field Netlify records. */ }


						</div>

						<input
							name='form-name'

							type='hidden'
							value='contactForm'
						/>{ /* What: Form Name Input Element. Why: Netlify needs to know which form a background post belongs to. How: This sends the form's name with the other fields. */ }

						<button
							className='form-submit'

							type='submit'

							aria-label='Send Message' // What: Send Button Label. Why: Screen readers would otherwise read the decorative arrow aloud as right arrow. How: This names the button by its words alone, which still match what's shown.
						>{ /* What: Send Button Element. Why: The visitor sends the form. How: This submits it through forSubFun. */ }
							Send Message →
						</button>


					</form>


				</div>


			</div>


		</section>


	);


}

// #endregion ConSecCom

// #endregion Components



// #region Exports

export { ConSecCom }; // What: Named Exports. Why: The home page ends with the contact section. How: This exports ConSecCom.

// #endregion Exports


