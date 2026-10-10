



// #region Imports

import cssModObj from './contact.module.css'; // What: CSS Module Object. Why: The section is styled in its own module, whose class names Vite hashes. How: Every element reads its class from this object.


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
 * won't send it until the required name, email, and message are filled in and
 * the email looks like an address, and typing in any field hides the thank-you
 * note. Sending it waits for Netlify's answer before showing the thank-you
 * note or, when the message didn't go through, an error note that keeps the
 * visitor's details for a retry. The icons beside the contact links are hidden
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
	const [ forErrBoo, setForErrBoo ] = useState( false );                  // What: Form Error Boolean And Setter. Why: A visitor whose message didn't go through has to be told, with their details kept for a retry. How: This holds whether the error note is showing.
	const [ forSenBoo, setForSenBoo ] = useState( false );                  // What: Form Sent Boolean And Setter. Why: The thank-you note shows only right after a confirmed send. How: This holds whether it's showing.
	const [ senProBoo, setSenProBoo ] = useState( false );                  // What: Sending Progress Boolean And Setter. Why: The visitor should see a message is on its way, and shouldn't send it twice. How: This holds whether a request is out.


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
	 * Handles the form's submit once the browser's own checks have passed:
	 * stops the page-reloading submit, hides any earlier error, and posts the
	 * form's fields to Netlify Forms as URL-encoded data, whose form-name
	 * field tells Netlify which form they belong to. While the request is out,
	 * the send button is disabled and reads Sending... instead. Only an OK
	 * answer from Netlify counts as sent: then the thank-you note shows, the
	 * fields empty, and the note hides again six seconds later. A request that
	 * fails outright, or one Netlify rejects, keeps the visitor's details in
	 * place and shows the error note instead, so they can try again or call;
	 * one that fails outright is also logged to the console.
	 *
	 * @author z4nta0 <https://github.com/z4nta0>
	 *
	 * @param subEveObj - Submit Event Object: The form's submit event.
	 *
	 * @returns A promise that settles once the request has gone out and its
	 *          answer shows on the page, with no value.
	 *
	 * @example
	 * ```ts
	 * forSubFun(subEveObj) // => Promise<void>
	 * ```
	 *
	*/

	const forSubFun = async ( subEveObj : FormEvent< HTMLFormElement > ) => { // What: Form Submit Function. Why: The form sends its fields without leaving the page, and only reports success once Netlify confirms it. How: This posts them to Netlify Forms, then shows the thank-you note or the error note depending on the answer.


		subEveObj.preventDefault(); // What: Default Submit Cancel. Why: The browser would otherwise leave the page for Netlify's own thank-you page. How: This stops the form's own submission.


		const forCurEle = subEveObj.target as HTMLFormElement;                               // What: Form Current Element. Why: The fields are read from the form itself. How: This is the submitted form. // What: Type Assertion Note. Why: A submit event's target types as a plain event target. How: Only this form's submit event reaches forSubFun.
		const forFieObj = new FormData( forCurEle ) as unknown as Record< string, string >; // What: Form Fields Object. Why: Netlify reads the fields as a URL-encoded body. How: This collects every named field, the hidden form-name included. // What: Type Assertion Note. Why: URLSearchParams accepts string pairs, while FormData can also hold files. How: This form has no file fields, so every value is a string.

		let senOkaBoo = false; // What: Send Okay Boolean. Why: Only a confirmed submission should show the thank-you note. How: This starts false and turns true only when Netlify answers OK.


		setForErrBoo( false ); // What: Error Note Hide Call. Why: A new attempt shouldn't keep showing the last one's error. How: This hides the error note.

		setSenProBoo( true ); // What: Sending Start Call. Why: The visitor should see the message is on its way, and shouldn't send it twice. How: This disables the button and switches its label to Sending...



		try {


			const netResObj = await fetch( '/', { // What: Netlify Response Object. Why: Netlify Forms records a post to the site's own address carrying the form's name, and its answer says whether it did. How: This posts the fields URL-encoded and waits for the answer.


				body    : new URLSearchParams( forFieObj ).toString(),              // What: Body. Why: Netlify reads a URL-encoded body. How: This encodes every field as name and value pairs.
				headers : { 'Content-Type' : 'application/x-www-form-urlencoded' }, // What: Headers. Why: Netlify has to know how the body is encoded. How: This names the URL-encoded type.
				method  : 'POST'                                                    // What: Method. Why: A submission is a post. How: This sends it as one.


			} );


			senOkaBoo = netResObj.ok; // What: Send Okay Update. Why: Netlify can answer with an error, which still counts as a failed submission. How: This records whether the answer's status was in the 200s.


		}

		catch ( errCatObj ) { console.warn( errCatObj ); } // What: Network Failure Catch. Why: A request that can't be made at all, such as when the visitor is offline, should still be visible to anyone debugging. How: This logs the error and leaves senOkaBoo false.



		setSenProBoo( false ); // What: Sending End Call. Why: The request has its answer, so the button can be used again. How: This re-enables the button and restores its label.



		if ( senOkaBoo ) { // What: Sent Check. Why: Only a confirmed submission is reported as sent. How: This shows the thank-you note, empties the fields, and schedules the note's hiding.


			setForSenBoo( true ); // What: Thank-You Show Call. Why: The visitor should see the form went. How: This shows the note.

			setForDatObj( FOR_EMP_OBJ ); // What: Form Reset Call. Why: A sent form starts fresh. How: This empties every field.

			window.setTimeout( () => setForSenBoo( false ), 6000 ); // What: Thank-You Timer Call. Why: The note shouldn't stay up forever. How: This hides it after 6 seconds.


		}

		else setForErrBoo( true ); // What: Error Note Show Call. Why: A failed submission must not look sent. How: This shows the error note and keeps every field as the visitor filled it in.


	};

	// #endregion forSubFun



	return (


		<section
			id='contact'

			className={` ${ cssModObj.section }   ${ cssModObj.contactSection } `}
		>{ /* What: Contact Section Element. Why: The page ends where visitors reach Tony. How: Its id stays the plain word contact, since the bar links to it and it can appear in the page's address. */ }


			<div className={ cssModObj.container }>{ /* What: Contact Container Div Element. Why: The section's content lines up with the page's width. How: This centers it at a capped width. */ }


				<div className={ cssModObj.contactGrid }>{ /* What: Contact Grid Div Element. Why: The ways to reach Tony and the form sit side by side on wide screens. How: This lays out the two columns. */ }


					<div>{ /* What: Contact Info Div Element. Why: The direct ways to reach Tony read as one column. How: This stacks the label, heading, note, and contact rows, with no styling of its own. */ }


						<div className={ cssModObj.sectionLabel }>Get in Touch</div>{ /* What: Contact Label Div Element. Why: A small label names the section. How: This shows it above the heading. */ }

						<h2 className={ cssModObj.contactTitle }>Want a piece, or have a <em className={ cssModObj.contactTitleAccent }>question?</em></h2>{ /* What: Contact Heading Element. Why: The heading invites visitors to write. How: The question sits in an italic accent. */ }

						<p className={ cssModObj.contactNote }>
							Tony loves hearing from people who appreciate his work. Reach out directly or drop a
							note below, and he'll get back to you.
						</p>{ /* What: Contact Note Paragraph Element. Why: Visitors should know Tony welcomes messages. How: This shows two sentences beneath the heading. */ }


						<a
							className={ cssModObj.contactDirect }

							href='tel:4177330681'
						>{ /* What: Phone Contact Anchor Element. Why: Calling or texting is the quickest way to reach Tony. How: This dials his number on phones. */ }


							<div
								className={ cssModObj.icon }

								aria-hidden='true'
							>☎</div>{ /* What: Phone Icon Div Element. Why: A telephone marks the row at a glance. How: It's hidden from screen readers, which would read it aloud as black telephone. */ }

							<div>{ /* What: Phone Text Div Element. Why: The row's label and number stack beside the icon. How: This holds the two lines. */ }


								<div className={ cssModObj.label }>Call or text</div>{ /* What: Phone Label Div Element. Why: The row says what to do. How: This shows call or text. */ }

								<div className={ cssModObj.value }>(417) 733-0681</div>{ /* What: Phone Value Div Element. Why: The number itself is the row's main line. How: This shows it. */ }


							</div>


						</a>


						<a
							className={ cssModObj.contactDirect }

							href='https://www.facebook.com/profile.php?id=61560009400871'
							rel='noopener noreferrer'
							target='_blank'
						>{ /* What: Facebook Contact Anchor Element. Why: Tony shares new pieces and where he'll be on his Facebook page. How: This opens the page in a new tab, without giving it access to this one. */ }


							<div
								className={ cssModObj.icon }

								aria-hidden='true'
							>📲</div>{ /* What: Facebook Icon Div Element. Why: A phone marks the row at a glance. How: It's hidden from screen readers, which would read the emoji aloud. */ }

							<div>{ /* What: Facebook Text Div Element. Why: The row's label and name stack beside the icon. How: This holds the two lines. */ }


								<div className={ cssModObj.label }>Facebook Page</div>{ /* What: Facebook Label Div Element. Why: The row says where it goes. How: This shows Facebook page. */ }

								<div className={ cssModObj.value }>Tony's Toppers</div>{ /* What: Facebook Value Div Element. Why: The page's name is the row's main line. How: This shows it. */ }


							</div>


						</a>


						<div className={ cssModObj.contactDirect }>{ /* What: Location Contact Div Element. Why: Visitors should know where Tony is based. How: This shows his home town in the same style as the links, without being one. */ }


							<div
								className={ cssModObj.icon }

								aria-hidden='true'
							>📍</div>{ /* What: Location Icon Div Element. Why: A pin marks the row at a glance. How: It's hidden from screen readers, which would read the emoji aloud. */ }

							<div>{ /* What: Location Text Div Element. Why: The row's label and town stack beside the icon. How: This holds the two lines. */ }


								<div className={ cssModObj.label }>Based in</div>{ /* What: Location Label Div Element. Why: The row says what it shows. How: This shows based in. */ }

								<div
									className={ cssModObj.value }

									style={{ fontSize : '1.15rem' }}
								>{ /* What: Location Value Div Element. Why: The town is the row's main line. How: This shows it a little smaller than the other rows' values, so it fits on one line. */ }
									Bolivar, Missouri
								</div>


							</div>


						</div>


					</div>



					<form
						className={ cssModObj.contactForm }

						data-netlify='true'
						name='contactForm'

						onSubmit={ forSubFun }
					>{ /* What: Contact Form Element. Why: Visitors can send Tony a message without leaving the site. How: Netlify Forms records it under the contactForm name, matching the hidden copy in index.html, while forSubFun sends it in the background once the browser's own checks pass: the name, email, and message are required, and the email has to look like an address. */ }


						{ forSenBoo && ( // What: Thank-You Visibility Check. Why: The note shows only right after sending. How: This renders it while forSenBoo is true.


							<div
								className={ cssModObj.formSuccess }

								role='status'
							>{ /* What: Form Success Div Element. Why: The visitor should see the form went. How: Its status role has screen readers announce it. */ }
								✓ Thanks! Your message was sent, and Tony will be in touch soon.
							</div>


						) }


						<div className={ cssModObj.formRow }>{ /* What: Form Row Div Element. Why: The name and email fields sit side by side. How: This lays out the two fields in a row. */ }


							<div className={ cssModObj.formField }>{ /* What: Name Field Div Element. Why: The label and input read as one field. How: This stacks them. */ }


								<label
									className={ cssModObj.formLabel }

									htmlFor='namFieInp'
								>{ /* What: Name Label Element. Why: The field needs a visible name. How: This labels the name input. */ }
									Your Name
								</label>

								<input
									id='namFieInp'

									className={ cssModObj.formControl }

									name='name'

									required
									type='text'
									value={ forDatObj.name }

									onChange={ fieChaFun }
								/>{ /* What: Name Input Element. Why: Tony should know who's writing. How: Its name, name, is the field Netlify records. */ }


							</div>

							<div className={ cssModObj.formField }>{ /* What: Email Field Div Element. Why: The label and input read as one field. How: This stacks them. */ }


								<label
									className={ cssModObj.formLabel }

									htmlFor='emaFieInp'
								>{ /* What: Email Label Element. Why: The field needs a visible name. How: This labels the email input. */ }
									Email
								</label>

								<input
									id='emaFieInp'

									className={ cssModObj.formControl }

									name='email'

									required
									type='email'
									value={ forDatObj.email }

									onChange={ fieChaFun }
								/>{ /* What: Email Input Element. Why: Tony needs a way to reply. How: Its name, email, is the field Netlify records. */ }


							</div>


						</div>


						<div className={ cssModObj.formField }>{ /* What: Interest Field Div Element. Why: The label and dropdown read as one field. How: This stacks them. */ }


							<label
								className={ cssModObj.formLabel }

								htmlFor='intFieSel'
							>{ /* What: Interest Label Element. Why: The field needs a visible name. How: This labels the interest dropdown. */ }
								I'm interested in
							</label>

							<select
								id='intFieSel'

								className={ cssModObj.formControl }

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

						<div className={ cssModObj.formField }>{ /* What: Message Field Div Element. Why: The label and text box read as one field. How: This stacks them. */ }


							<label
								className={ cssModObj.formLabel }

								htmlFor='mesFieTex'
							>{ /* What: Message Label Element. Why: The field needs a visible name. How: This labels the message box. */ }
								Message
							</label>

							<textarea
								id='mesFieTex'

								className={` ${ cssModObj.formControl }   ${ cssModObj.formControlMessage } `}

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

						{ forErrBoo && ( // What: Error Note Check. Why: A failed submission has to be explained. How: This shows the error note while forErrBoo is true.


							<p
								className={ cssModObj.formError }

								role='alert'
							>{ /* What: Form Error Paragraph Element. Why: The visitor needs to know the message didn't go through and what to do next. How: Its alert role has screen readers announce it the moment it appears. */ }
								Sorry, your message didn't go through. Please try again, or call or text Tony at <a className={ cssModObj.formErrorLink } href='tel:4177330681'>(417) 733-0681</a>.
							</p>


						) }


						<button
							className={ cssModObj.formSubmit }

							disabled={ senProBoo }
							type='submit'

							aria-label={ senProBoo ? 'Sending' : 'Send Message' } // What: Send Button Label. Why: Screen readers would otherwise read the decorative arrow aloud as right arrow. How: This names the button by its words alone, which still match what's shown, Sending while a request is out.
						>{ /* What: Send Button Element. Why: The visitor sends the form. How: This submits it through forSubFun, and is disabled while a request is out. */ }
							{ senProBoo ? 'Sending...' : 'Send Message →' }{ /* What: Send Button Label Expression. Why: The button should show when a message is on its way. How: This reads Sending... while a request is out and Send Message otherwise. */ }
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


