


// #region Imports

import cssModObj from './contact.module.css'; // What: CSS Module Object. Why: The section is styled in its own module, whose class names Vite hashes. How: Every element reads its class from this object.


import { useState } from 'react'; // What: Use State. Why: The form remembers its fields, whether a send is out, and whether the last one went through or failed. How: Four state pairs hold them.


import type { AnimationEvent } from 'react'; // What: Animation Event. Why: A leaving note unmounts once its own exit animation ends. How: This types the end handler's event.
import type { ChangeEvent    } from 'react'; // What: Change Event. Why: Every field reports its changes the same way. How: This types fieChaFun's event.
import type { FormEvent      } from 'react'; // What: Form Event. Why: Sending the form starts from its submit event. How: This types forSubFun's event.

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
 *  - Hooks
 *  - Components
 *  - Exports
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/



// #region Types

type IntOptTyp = 'A pen topper' | 'A wine stopper' | 'A keychain' | 'A dog necklace' | 'A car freshie' | 'A name badge reel' | 'A phone grip' | 'A straw charm' | 'A custom piece' | 'Just saying hi'; // What: Interest Option Type. Why: The interest field offers a fixed set of choices. How: This lists every choice, each one also the value sent.



type ForStaTyp = { // What: Form State Type. Why: The form's fields are held together in one record. How: Each key is a field's name attribute, which Netlify records, so none of them are renamed.


	email    : string,    // What: Email. Why: Tony needs a way to reply. How: This holds the email field.
	interest : IntOptTyp, // What: Interest. Why: Tony should know what the visitor is after. How: This holds the chosen interest.
	message  : string,    // What: Message. Why: The visitor says what they have in mind. How: This holds the message field.
	name     : string     // What: Name. Why: Tony should know who's writing. How: This holds the name field.


};

// #endregion Types



// #region Constants

const FOR_EMP_OBJ : ForStaTyp = { email : '', interest : 'A pen topper', message : '', name : '' }; // What: Form Empty Object. Why: The form starts empty and empties again once sent. How: This holds blank fields with the first interest chosen.



// #region INT_OPT_ARR

/**
 * INT_OPT_ARR = Interest Option Array
 *
 * @summary
 * The choices the contact form's interest field offers, in the order they're
 * listed, each both the option's text and the value sent. Most rows simply
 * name one kind of piece Tony makes, so they carry no comment of their own;
 * only the default first choice, the custom piece, and the friendly hello
 * note why they're there.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
*/

const INT_OPT_ARR : IntOptTyp[] = [ // What: Interest Option Array. Why: The interest field lists every choice in this order. How: Each entry is one option's text and value.


	'A pen topper', // What: Pen Topper Option. Why: Pen toppers are Tony's first and biggest line. How: This is the default choice.
	'A wine stopper',
	'A keychain',
	'A dog necklace',
	'A car freshie',
	'A name badge reel',
	'A phone grip',
	'A straw charm',
	'A custom piece', // What: Custom Piece Option. Why: Tony makes pieces to order. How: This offers a custom request.
	'Just saying hi'  // What: Saying Hi Option. Why: Not every message is an order. How: This offers a friendly note.


];

// #endregion INT_OPT_ARR

// #endregion Constants



// #region Hooks

type NotExiTyp = { // What: Note Exit Type. Why: A note's exit needs to know whether it's mounted, whether it's leaving, and when to finish. How: This names those three, which the notes read by property.


	endFun : ( aniEveObj : AnimationEvent< HTMLElement > ) => void, // What: End Function. Why: The note unmounts once its own exit ends. How: Its onAnimationEnd calls this.
	leaBoo : boolean,                                               // What: Leaving Boolean. Why: The module plays the exit only while the note leaves. How: This is true while it's leaving.
	mouBoo : boolean                                                // What: Mounted Boolean. Why: The note renders only while mounted. How: This is true while it's mounted.


};

// #region useNotExiFun

/**
 * useNotExiFun = Use Note Exit Function
 *
 * @summary
 * Keeps a form note on the page long enough to play its exit. While the note
 * should show, it's mounted. When it stops showing, it stays mounted and is
 * marked as leaving, so its module can play the exit animation, and it
 * unmounts once that animation ends on the note itself, ignoring any
 * animation ending on an element inside it. Under reduced motion the exit
 * still runs, at a hundredth of a millisecond, so the end event still fires.
 *
 * @author z4nta0 <https://github.com/z4nta0>
 *
 * @param notShoBoo - Note Show Boolean: Whether the note should be showing.
 *
 * @returns Whether to mount the note, whether it's leaving, and the handler
 *          its onAnimationEnd calls.
 *
 * @example
 * ```ts
 * useNotExiFun(forSenBoo) // => { endFun, leaBoo, mouBoo }
 * ```
 *
*/

function useNotExiFun ( notShoBoo : boolean ) : NotExiTyp {


	const [ notMouBoo, setNotMouBoo ] = useState( notShoBoo ); // What: Note Mounted Boolean And Setter. Why: A note that stops showing has to stay mounted while it leaves. How: This holds whether it's mounted, starting with whether it shows.


	if ( notShoBoo && !notMouBoo ) setNotMouBoo( true ); // What: Mount Guard. Why: A note asked to show has to mount at once. How: This mounts it during render, which React applies before committing.



	return { // What: Note Exit Return. Why: The note reads all three by property. How: This hands back the mount flag, the leaving flag, and the end handler.


		endFun : ( aniEveObj ) => { if ( !notShoBoo && aniEveObj.target === aniEveObj.currentTarget ) setNotMouBoo( false ); }, // What: End Function. Why: The note should unmount only when its own exit finishes. How: This unmounts it when an animation ends on the note itself while it isn't meant to show.
		leaBoo : notMouBoo && !notShoBoo,                                                                                       // What: Leaving Boolean. Why: The module plays the exit only while the note is leaving. How: This is true while it's still mounted but no longer meant to show.
		mouBoo : notMouBoo // What: Mounted Boolean. Why: The note renders only while mounted. How: This passes the mount flag on.


	};


}

// #endregion useNotExiFun

// #endregion Hooks



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
	const [ forErrBoo, setForErrBoo ] = useState( false );                    // What: Form Error Boolean And Setter. Why: A visitor whose message didn't go through has to be told, with their details kept for a retry. How: This holds whether the error note is showing.
	const [ forSenBoo, setForSenBoo ] = useState( false );                    // What: Form Sent Boolean And Setter. Why: The thank-you note shows only right after a confirmed send. How: This holds whether it's showing.
	const [ senProBoo, setSenProBoo ] = useState( false );                    // What: Sending Progress Boolean And Setter. Why: The visitor should see a message is on its way, and shouldn't send it twice. How: This holds whether a request is out.

	const errExiObj = useNotExiFun( forErrBoo ); // What: Error Exit Object. Why: The error note should fade out rather than vanish. How: This keeps it mounted while it leaves.
	const sucExiObj = useNotExiFun( forSenBoo ); // What: Success Exit Object. Why: The thank-you note should fade out rather than vanish. How: This keeps it mounted while it leaves.


	// #region fieChaFun

	/**
	 * fieChaFun = Field Change Function
	 *
	 * @summary
	 * Handles a change in any of the form's four fields. It reads which field
	 * changed from its name attribute, so one handler serves them all, and
	 * stores the new value in the form's data. It also hides the thank-you
	 * note, since typing again means the visitor has moved on from the message
	 * they last sent.
	 *
	 * @author z4nta0 <https://github.com/z4nta0>
	 *
	 * @param chaEveObj - Change Event Object: The field's change event, whose
	 *                    target carries the field's name and new value.
	 *
	 * @returns This function does not return anything.
	 *
	 * @example
	 * ```ts
	 * fieChaFun(chaEveObj) // => void
	 * ```
	 *
	*/

	const fieChaFun = ( chaEveObj : ChangeEvent< HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement > ) => { // What: Field Change Function. Why: Every field updates the form the same way. How: This stores the field's new value under its name and hides the thank-you note.


		const { name : fieNamStr, value : fieValStr } = chaEveObj.target; // What: Field Name And Value Strings. Why: The field's name says which value changed. How: This reads the target's name and value, renaming the DOM's keys.


		setForDatObj( ( preForObj ) => ({ ...preForObj, [ fieNamStr ] : fieValStr }) ); // What: Form Data Update. Why: The changed field keeps its new value. How: This copies the form and replaces that one field.

		setForSenBoo( false ); // What: Thank-You Hide Call. Why: Typing again means the visitor has moved on from the last message. How: This hides the note.


	};

	// #endregion fieChaFun


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


		const forCurEle = subEveObj.target as HTMLFormElement;                              // What: Form Current Element. Why: The fields are read from the form itself. How: This is the submitted form. // What: Type Assertion Note. Why: A submit event's target types as a plain event target. How: Only this form's submit event reaches forSubFun.
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

			className={ cssModObj.homConSec }
		>{ /* What: Home Contact Section Element. Why: The page ends where visitors reach Tony. How: Its id stays the plain word contact, since the bar links to it and it can appear in the page's address. */ }


			<div className={ cssModObj.pagConDiv }>{ /* What: Page Container Div Element. Why: The section's content lines up with the page's width. How: This centers it at a capped width. */ }


				<div className={ cssModObj.conGriDiv }>{ /* What: Contact Grid Div Element. Why: The ways to reach Tony and the form sit side by side on wide screens. How: This lays out the two columns. */ }


					<div>{ /* What: Contact Info Div Element. Why: The direct ways to reach Tony read as one column. How: This stacks the label, heading, note, and contact rows, with no styling of its own. */ }


						<div className={ cssModObj.eyeLabDiv }>Get in Touch</div>{ /* What: Eyebrow Label Div Element. Why: A small label names the section. How: This shows it above the heading. */ }

						<h2 className={ cssModObj.secTitHea }>Want a piece, or have a <em className={ cssModObj.titAccEmp }>question?</em></h2>{ /* What: Section Title Heading Element. Why: The heading invites visitors to write. How: The question sits in an italic accent. */ }

						<p className={ cssModObj.secSubPar }>{ /* What: Section Subtitle Paragraph Element. Why: Visitors should know Tony welcomes messages. How: This shows two sentences beneath the heading. */ }
							Tony loves hearing from people who appreciate his work. Reach out directly or drop a
							note below, and he'll get back to you.
						</p>


						<a
							className={ cssModObj.infRowAnc }

							href='tel:4177330681'
						>{ /* What: Info Row Anchor Element. Why: Calling or texting is the quickest way to reach Tony. How: This dials his number on phones. */ }


							<div
								className={ cssModObj.infIcoDiv }

								aria-hidden='true'
							>☎</div>{ /* What: Info Icon Div Element. Why: A telephone marks the row at a glance. How: It's hidden from screen readers, which would read it aloud as black telephone. */ }

							<div>{ /* What: Phone Text Div Element. Why: The row's label and number stack beside the icon. How: This holds the two lines. */ }


								<div className={ cssModObj.infLabDiv }>Call or text</div>{ /* What: Info Label Div Element. Why: The row says what to do. How: This shows call or text. */ }

								<div className={ cssModObj.infValDiv }>(417) 733-0681</div>{ /* What: Info Value Div Element. Why: The number itself is the row's main line. How: This shows it. */ }


							</div>


						</a>


						<a
							className={ cssModObj.infRowAnc }

							href='https://www.facebook.com/profile.php?id=61560009400871'
							rel='noopener noreferrer'
							target='_blank'
						>{ /* What: Info Row Anchor Element. Why: Tony shares new pieces and where he'll be on his Facebook page. How: This opens the page in a new tab, without giving it access to this one. */ }


							<div
								className={ cssModObj.infIcoDiv }

								aria-hidden='true'
							>📲</div>{ /* What: Info Icon Div Element. Why: A phone marks the row at a glance. How: It's hidden from screen readers, which would read the emoji aloud. */ }

							<div>{ /* What: Facebook Text Div Element. Why: The row's label and name stack beside the icon. How: This holds the two lines. */ }


								<div className={ cssModObj.infLabDiv }>Facebook Page</div>{ /* What: Info Label Div Element. Why: The row says where it goes. How: This shows Facebook page. */ }

								<div className={ cssModObj.infValDiv }>Tony's Toppers</div>{ /* What: Info Value Div Element. Why: The page's name is the row's main line. How: This shows it. */ }


							</div>


						</a>


						<div className={ cssModObj.infRowDiv }>{ /* What: Info Row Div Element. Why: Visitors should know where Tony is based. How: This shows his home town in the same style as the links, without being one. */ }


							<div
								className={ cssModObj.infIcoDiv }

								aria-hidden='true'
							>📍</div>{ /* What: Info Icon Div Element. Why: A pin marks the row at a glance. How: It's hidden from screen readers, which would read the emoji aloud. */ }

							<div>{ /* What: Location Text Div Element. Why: The row's label and town stack beside the icon. How: This holds the two lines. */ }


								<div className={ cssModObj.infLabDiv }>Based in</div>{ /* What: Info Label Div Element. Why: The row says what it shows. How: This shows based in. */ }

								<div className={ cssModObj.infValDiv }>Bolivar, Missouri</div>{ /* What: Info Value Div Element. Why: The town is the row's main line. How: This shows it at the same size as the other rows' values. */ }


							</div>


						</div>


					</div>



					<form
						className={ cssModObj.conForFor }

						data-netlify='true'
						name='contactForm'

						onSubmit={ forSubFun }
					>{ /* What: Contact Form Form Element. Why: Visitors can send Tony a message without leaving the site. How: Netlify Forms records it under the contactForm name, matching the hidden copy in index.html, while forSubFun sends it in the background once the browser's own checks pass: the name, email, and message are required, and the email has to look like an address. */ }


						{ sucExiObj.mouBoo && ( // What: Thank-You Visibility Check. Why: The note shows only right after sending, and stays while it fades out. How: This renders it while it's mounted.


							<div
								className={ cssModObj.forSucDiv }

								data-note-exit-active={ sucExiObj.leaBoo || undefined } // What: Note Leaving Flag. Why: The module plays the exit only while the note leaves. How: This is set while it's leaving and absent otherwise.

								role='status'

								onAnimationEnd={ sucExiObj.endFun }
							>{ /* What: Form Success Div Element. Why: The visitor should see the form went. How: It rises in with its check popping once and fades out when it goes, and its status role has screen readers announce it, with the decorative check mark hidden so it isn't read aloud. */ }
								<span className={ cssModObj.sucIcoSpa } aria-hidden='true'>✓</span> Thanks! Your message was sent, and Tony will be in touch soon.
							</div>


						) }


						<div className={ cssModObj.forRowDiv }>{ /* What: Form Row Div Element. Why: The name and email fields sit side by side. How: This lays out the two fields in a row. */ }


							<div className={ cssModObj.forFieDiv }>{ /* What: Form Field Div Element. Why: The label and input read as one field. How: This stacks them. */ }


								<label
									className={ cssModObj.forFieLab }

									htmlFor='namFieInp'
								>{ /* What: Form Field Label Element. Why: The field needs a visible name. How: This labels the name input. */ }
									Your Name
								</label>

								<input
									id='namFieInp'

									className={ cssModObj.forFieInp }

									name='name'

									placeholder='Jane Smith'
									required
									type='text'
									value={ forDatObj.name }

									onChange={ fieChaFun }
								/>{ /* What: Form Field Input Element. Why: Tony should know who's writing. How: Its name, name, is the field Netlify records. */ }


							</div>

							<div className={ cssModObj.forFieDiv }>{ /* What: Form Field Div Element. Why: The label and input read as one field. How: This stacks them. */ }


								<label
									className={ cssModObj.forFieLab }

									htmlFor='emaFieInp'
								>{ /* What: Form Field Label Element. Why: The field needs a visible name. How: This labels the email input. */ }
									Email
								</label>

								<input
									id='emaFieInp'

									className={ cssModObj.forFieInp }

									name='email'

									placeholder='jane@example.com'
									required
									type='email'
									value={ forDatObj.email }

									onChange={ fieChaFun }
								/>{ /* What: Form Field Input Element. Why: Tony needs a way to reply. How: Its name, email, is the field Netlify records. */ }


							</div>


						</div>


						<div className={ cssModObj.forFieDiv }>{ /* What: Form Field Div Element. Why: The label and dropdown read as one field. How: This stacks them. */ }


							<label
								className={ cssModObj.forFieLab }

								htmlFor='intFieSel'
							>{ /* What: Form Field Label Element. Why: The field needs a visible name. How: This labels the interest dropdown. */ }
								I'm interested in
							</label>

							<select
								id='intFieSel'

								className={ cssModObj.forFieSel }

								name='interest'

								value={ forDatObj.interest }

								onChange={ fieChaFun }
							>{ /* What: Form Field Select Element. Why: Tony should know what the visitor is after. How: Its name, interest, is the field Netlify records. */ }


								{ INT_OPT_ARR.map( ( intOptStr ) => ( // What: Interest Option Map. Why: Each choice gets an option. How: This renders one option per interest.


									<option
										key={ intOptStr }

										value={ intOptStr }
									>{ intOptStr }</option> // What: Interest Option Element. Why: Each choice can be picked. How: Its text is also the value sent.


								))}


							</select>


						</div>

						<div className={ cssModObj.forFieDiv }>{ /* What: Form Field Div Element. Why: The label and text box read as one field. How: This stacks them. */ }


							<label
								className={ cssModObj.forFieLab }

								htmlFor='mesFieTex'
							>{ /* What: Form Field Label Element. Why: The field needs a visible name. How: This labels the message box. */ }
								Message
							</label>

							<textarea
								id='mesFieTex'

								className={ cssModObj.forFieTex }

								name='message'

								placeholder='Tell Tony what you have in mind...'
								required
								value={ forDatObj.message }

								onChange={ fieChaFun }
							/>{ /* What: Form Field Textarea Element. Why: The visitor says what they have in mind. How: Its name, message, is the field Netlify records. */ }


						</div>

						<input
							name='form-name'

							type='hidden'
							value='contactForm'
						/>{ /* What: Form Name Input Element. Why: Netlify needs to know which form a background post belongs to. How: This sends the form's name with the other fields. */ }

						{ errExiObj.mouBoo && ( // What: Error Note Check. Why: A failed submission has to be explained, and the note stays while it fades out. How: This renders it while it's mounted.


							<p
								className={ cssModObj.forErrPar }

								data-note-exit-active={ errExiObj.leaBoo || undefined } // What: Note Leaving Flag. Why: The module plays the exit only while the note leaves. How: This is set while it's leaving and absent otherwise.

								role='alert'

								onAnimationEnd={ errExiObj.endFun }
							>{ /* What: Form Error Paragraph Element. Why: The visitor needs to know the message didn't go through and what to do next. How: It rises in and fades out when it goes, and its alert role has screen readers announce it the moment it appears. */ }
								Sorry, your message didn't go through. Please try again, or call or text Tony at <a className={ cssModObj.errLinAnc } href='tel:4177330681'>(417) 733-0681</a>.
							</p>


						) }

						<button
							className={ cssModObj.forSubBut }

							disabled={ senProBoo }
							type='submit'

							aria-label={ senProBoo ? 'Sending' : 'Send Message' } // What: Send Button Label. Why: Screen readers would otherwise read the decorative arrow aloud as right arrow. How: This names the button by its words alone, which still match what's shown, Sending while a request is out.
						>{ /* What: Form Submit Button Element. Why: The visitor sends the form. How: This submits it through forSubFun, and is disabled while a request is out. */ }


							<span
								key={ senProBoo ? 'sending' : 'ready' } // What: Label Key. Why: A new key remounts the label, which replays its fade-in. How: This changes whenever the button switches between ready and sending.

								className={ cssModObj.subLabSpa }
							>{ /* What: Submit Label Span Element. Why: The label fades to its new text when a message goes out. How: Its key changes with the sending state, so each new label mounts fresh and fades in. */ }
								{ senProBoo ? 'Sending...' : 'Send Message →' }{ /* What: Send Button Label Expression. Why: The button should show when a message is on its way. How: This reads Sending... while a request is out and Send Message otherwise. */ }
							</span>


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


