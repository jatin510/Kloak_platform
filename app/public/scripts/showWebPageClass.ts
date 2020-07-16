
class showWebPageClass {
	public showLoading = ko.observable ( true )
	public htmlIframe = ko.observable ( null )
	public showErrorMessage = ko.observable ( false )
	public showHtmlCodePage = ko.observable ( false )
	public showMultimediaObjButton = ko.observable ( false )
	public MultimediaObjArray = ko.observableArray ()
	public showImgPage = ko.observable ( true )
	public showMultimediaPage = ko.observable ( false )
	public showErrorMessageProcess() {
		this.showLoading ( false )
		this.showErrorMessage ( true )
	}
	public png = ko.observable ('')
	public mHtml = ko.observable ('')

	private urlBlobList = []

	public close() {
		this.showImgPage(false)
		this.showHtmlCodePage(false)
		this.png(null)
		this.htmlIframe(null)
		this.urlBlobList.forEach((n) => {
			;(URL || webkitURL).revokeObjectURL(n)
		})
		this.exit()
	}

	public imgClick () {
		this.showMultimediaPage ( false )
		this.showHtmlCodePage (false )
		this.showImgPage ( true )
	}

	public showMultimedia () {
		this.showHtmlCodePage ( false )
		this.showImgPage ( false )
		this.showMultimediaPage ( true )
	}

	public htmlClick() {
		this.showHtmlCodePage ( true )
		this.showImgPage ( false )
		this.showMultimediaPage ( false )
		const docu = this.mHtml ()
		if ( docu ) {
			$('iframe')
				.contents()
				.find('head')
				.html(docu['window'].document.head.outerHTML)
			$('iframe')
				.contents()
				.find('body')
				.html(docu['window'].document.body.outerHTML)
		}
	}

	public showMultimediaObj () {

		this.showMultimediaObjButton ( true )
		if ( this.multimediaObj.length ) {
			return this.MultimediaObjArray ( this.multimediaObj )
		}
		this.MultimediaObjArray ( [ this.multimediaObj ] )
		
	}

	constructor( public showUrl: string, private zipBase64Stream: string, private zipBase64StreamUuid: string, private multimediaObj, private exit: () => void ) {
		const self = this

			/*
				if ( err ) {
					return self.showErrorMessageProcess()
				}
			*/
				_view.bodyBlue ( false )

				let html = null
				//      support HTMLComplete
				if ( html ) {
					html = html.replace(/ srcset="[^"]+" /gi, ' ').replace(/ srcset='[^']+' /gi, ' ')
					let det = data.folder.shift()
					const getData = (filename: string, _data: string, CallBack) => {
						const pointStart = html.indexOf(`${filename}`)

						const doCallBack = () => {
							det = data.folder.shift()
							if (!det) {
								return CallBack()
							}
							return getData(det.filename, det.data, CallBack)
						}

						if ( pointStart > -1 ) {
							return getFilenameMime(filename, (err, mime) => {
								if (mime && !/javascript/.test(mime)) {
									/**
									 *
									 *          css link tag format support
									 *
									 */
									const _filename = filename
										.replace(/\-/g, '\\-')
										.replace(/\//g, '\\/')
										.replace(/\./g, '\\.')
										.replace(/\(/g, '\\(')
										.replace(/\)/g, '\\)')
									const regex = new RegExp(
										` src=("|')\.\/${_filename}("|')`,
										'g'
									)
									const regex1 = new RegExp(
										` href=("|')\.\/${_filename}("|')`,
										'g'
									)
									/*
                                if ( /^ src/i.test( hrefTest )) {
                                    
                                    const data1 = `data:${ mime };base64,` + _data
                                    html = html.replace ( regex, data1 ).replace ( regex, data1 )
                                    return doCallBack ()
                                    
                                }
                                */
									const blob = new Blob(
										[
											/^image/.test(mime)
												? Buffer.from(_data, 'base64')
												: Buffer.from(_data, 'base64').toString(),
										],
										{ type: mime }
									)
									const link = (URL || webkitURL).createObjectURL(blob)
									html = html
										.replace(regex, ` src="${link}"`)
										.replace(regex1, ` href="${link}"`)
									this.urlBlobList.push(link)
								}
								doCallBack()
							})
						}

						doCallBack()
					}

					return getData(det.filename, det.data, (err) => {
						self.png(data.img)

						const htmlBolb = new Blob([html], { type: 'text/html' })
						const _url = (URL || webkitURL).createObjectURL(htmlBolb)

						self.showLoading(false)
						self.htmlIframe(_url)
						self.urlBlobList.push(_url)
					})
				}

				html = null//mhtml2html.convert ( )//data.mhtml )
				self.png () //data.img )
				self.showLoading ( false )
				self.mHtml ( html )

				if ( multimediaObj ) {
					this.showMultimediaObj ()
				}
	}
		
	
}