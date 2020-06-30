class fileStorage {
	public fileStorageData = ko.observableArray([])
	public allFileStorageData = ko.observableArray([])
	public showSuggestions = ko.observable(false)
	public searchSuggestions = ko.observableArray([])
	public searchKey = ko.observable()
	public selectedFile = ko.observable()
	public colorMenuSelection = ko.observable()
	public showPaths = ko.observable(false)
	public showLoader = ko.observable(null)
	public assemblyQueue: Array<string> = []
	public assemblyRunning = false
	private colorOptions = [
		['maroon', 'red', 'olive', 'yellow'],
		['green', 'lime', 'teal', 'aqua'],
		['navy', 'blue', 'purple', 'fuchsia'],
	]
	private db: IDBDatabase
	constructor() {
		let req = window.indexedDB.open('kloak-history', 1)

		req.onupgradeneeded = (e) => {
			this.db = e.target.result
			this.db.createObjectStore('history')
		}

		req.onsuccess = (e) => {
			this.db = e.target.result
			this.getHistoryTable()
		}

		req.onerror = (e) => {
			console.log('Unable to open IndexedDB!')
		}

		this.searchKey.subscribe((val: string) => {
			if (val.trim() === '') {
				this.showSuggestions(false)
				this.searchSuggestions([])
				this.fileStorageData(this.allFileStorageData())
				return
			}
			this.showSuggestions(true)
			let keyword = val
			let temp = null
			if (val[0] === '#') {
				if (val.length < 2) {
					return
				}
				if (keyword === '') {
					return
				}
				keyword = val.slice(1)
				temp = this.allFileStorageData().filter((file: fileHistory) => {
					if (file.tag.includes(keyword)) {
						return true
					}
				})
			} else {
				temp = this.allFileStorageData().filter((file: fileHistory) => {
					if (file.detail.includes(keyword)) {
						return true
					}
					if (file.domain.includes(keyword)) {
						return true
					}
					if (file.url.includes(keyword)) {
						return true
					}
					if (file.urlShow.includes(keyword)) {
						return true
					}
					if (file.path.includes(keyword)) {
						return true
					}
				})
			}
			this.fileStorageData(temp)
			this.searchSuggestions(temp)
		})
	}

	init = () => {
		this.getHistoryTable()
	}

	getFileIndex = (uuid: string, callback: Function) => {
		let req = window.indexedDB.open('kloak-index', 1)

		req.onsuccess = (e) => {
			const db = e.target.result
			db
				.transaction('kloak-index', 'readwrite')
				.objectStore('kloak-index')
				.delete(uuid).onsuccess = (e) => {
				callback()
			}
		}
	}

	getHistoryTable = () => {
		const fs = this.db.transaction('history', 'readonly').objectStore('history')
		fs.get(0).onsuccess = (e) => {
			if (e.target.result) {
				const temp = e.target.result.sort((a: fileHistory, b: fileHistory) => {
					return b.time_stamp.getTime() - a.time_stamp.getTime()
				})
				this.fileStorageData(temp)
				this.allFileStorageData(temp)
				this.fileStorageData.valueHasMutated()
			}
		}
	}

	fileTagClick = (tag: string) => {
		this.searchKey(tag)
	}

	searchSuggestionClick = (data, event) => {
		this.showSuggestions(false)
		const temp = this.allFileStorageData().filter((file) => file === data)
		this.fileStorageData(temp)
	}

	saveHistoryTable = (shouldGet: boolean = false) => {
		const fs = this.db
			.transaction('history', 'readwrite')
			.objectStore('history')
		console.log(fs)
		fs.put(this.allFileStorageData(), 0).onsuccess = (e) => {
			if (shouldGet) {
				this.getHistoryTable()
			}
		}
	}

	deleteFile = (uuid: string, callback: Function) => {
		const deleteIndex = (uuid: string) => {
			let req = window.indexedDB.open('kloak-index', 1)

			req.onsuccess = (e) => {
				const db = e.target.result
				db
					.transaction('kloak-index', 'readwrite')
					.objectStore('kloak-index')
					.delete(uuid).onsuccess = (e) => {
					callback()
				}
			}
		}
		const removePieces = (uuids: Array<string>, callback: Function) => {
			let req = window.indexedDB.open('kloak-files', 1)

			req.onsuccess = (e) => {
				const db = e.target.result
				const fs = db
					.transaction('kloak-files', 'readwrite')
					.objectStore('kloak-files')
				while (uuids.length > 0) {
					fs.delete(uuids.shift()).onsuccess = (e) => {
						console.log('DELETED PIECE!')
					}
				}
				callback()
			}
		}
		let req = window.indexedDB.open('kloak-index', 1)

		req.onsuccess = (e) => {
			const db = e.target.result
			db
				.transaction('kloak-index', 'readwrite')
				.objectStore('kloak-index')
				.get(uuid).onsuccess = (e) => {
				const pieces = e.target.result[uuid].pieces
				const uuids: Array<string> = Object.values(pieces)
				removePieces(uuids, () => {
					deleteIndex(uuid)
					callback()
				})
			}
		}
	}

	fileAction = (data, event, action: string) => {
		switch (action) {
			case 'delete':
				const callback = () => {
					const temp = this.allFileStorageData().filter((file) => file !== data)
					this.fileStorageData(temp)
					this.allFileStorageData(temp)
					this.fileStorageData.valueHasMutated()
					this.saveHistoryTable()
					this.selectedFile(null)
				}
				this.deleteFile(data.uuid, callback)
				break
			case 'download':
				this.assemblyQueue.push(data.uuid)
				const cb = (e) => {
					const hiddenAnchor = document.getElementById('hiddenAnchor')
					console.log(hiddenAnchor)
					hiddenAnchor.download = `${e.filename}.${e.extension}`
					hiddenAnchor.href = e.url
					hiddenAnchor.click()
					hiddenAnchor.download = ''
					hiddenAnchor.href = ''
					URL.revokeObjectURL(e.url)
					this.assemblyRunning = false
				}
				if (!this.assemblyRunning) {
					this.assemblyRunning = true
					new Assembler(data.uuid, cb, data.domain === 'Local' ? true : false)
				}
			default:
				break
		}
	}

	getDate = (timestamp: Date, type: string) => {
		const month = timestamp.getMonth()
		const monthString = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sept',
			'Oct',
			'Nov',
			'Dec',
		]
		const hours =
			timestamp.getHours() > 12
				? timestamp.getHours() - 12
				: timestamp.getHours()
		const minutes =
			timestamp.getMinutes() < 10
				? `0${timestamp.getMinutes()}`
				: timestamp.getMinutes()
		const AMPM = timestamp.getHours() > 12 ? 'PM' : 'AM'

		switch (type) {
			case 'date':
				return `${
					monthString[month]
				} ${timestamp.getDate()}, ${timestamp.getFullYear()}`
				break
			case 'full':
				return `${
					monthString[month]
				} ${timestamp.getDate()}, ${timestamp.getFullYear()} ${hours}:${minutes} ${AMPM}`
				break
			default:
				break
		}
	}

	displayFolders = (path: string, filename: string) => {
		if (!path) {
			return
		}

		const createElements = (folderName: string, isFile?: boolean) => {
			const item = document.createElement('div')
			item.classList.add('item')
			const icon = document.createElement('i')
			icon.classList.add(isFile ? 'file' : 'folder', 'icon')
			const content = document.createElement('div')
			content.classList.add('content')
			const header = document.createElement('div')
			header.classList.add('header')
			// const text = document.createTextNode(folderName)
			header.textContent = folderName
			content.appendChild(header)
			item.appendChild(icon)
			item.appendChild(content)
			return item
		}

		const pathArray = ('./' + path).split('/')

		for (let i = 0; i < pathArray.length; i++) {
			const folderPath = document.getElementById(
				'folderPath' + this.selectedFile()
			)
			let item = null
			if (pathArray[i] === '') {
				item = createElements(filename, true)
			} else if (pathArray[i] === '.') {
				item = createElements(pathArray[i] + '/')
			} else {
				item = createElements(pathArray[i])
			}
			item.style.marginLeft = `${15 * i}px`
			folderPath.appendChild(item)
		}

		// path.split('/').map((path, i) => {
		// 	if (i === 0) {
		// 		createElements(
		// 			path,
		// 			document.getElementById('folderPath' + this.selectedFile())
		// 		)
		// 		return
		// 	}
		// 	createElements(
		// 		path,
		// 		document.getElementById('folderPath' + this.selectedFile()).children[0]
		// 	)
		// })
	}

	showOptions = (index: number) => {
		if (index === this.selectedFile()) {
			this.selectedFile(null)
			return
		}
		this.selectedFile(index)
	}

	changeColor = (data, event) => {
		const clr = data
		const idx = parseInt(this.colorMenuSelection().split(' ')[1])
		const t = this.fileStorageData()
		t[idx].color = clr
		this.fileStorageData(t)
		this.saveHistoryTable()

		const fileIcon = document.getElementById('icon ' + idx)
		fileIcon.style.color = clr
		const colorOptions = document.getElementsByClassName('colorMenuItem')
		for (let i = 0; i < colorOptions.length; i++) {
			if (colorOptions[i].id === clr) {
				colorOptions[i].style.border = '3px solid black'
			} else {
				colorOptions[i].style.border = '3px solid transparent'
			}
		}
		const val = event.target.value.split(' ')
		const index = parseInt(val[0])
		const color = val[1]
		const temp = this.fileStorageData()
		temp[index].color = color
		this.fileStorageData(temp)
		this.saveHistoryTable()
		const icon = document.getElementById('icon' + index)
		icon.style.color = color
	}

	hideColorOptions = (data, event) => {
		if (event.stopPropagation) {
			event.stopPropagation()
		}
		const colorMenu = document.getElementById('colorMenu')
		colorMenu.style.transform = 'scale(0)'
		this.colorMenuSelection(null)
	}

	showColorOptions = (data, event) => {
		if (event.stopPropagation) {
			event.stopPropagation()
		}
		const iconIndex = event.target.id.split(' ')[1]
		console.log(iconIndex)
		const { pageX, pageY } = event
		colorMenu.style.left = `${pageX}px`
		colorMenu.style.top = `${pageY + 8}px`
		if (this.colorMenuSelection() === event.target.id) {
			colorMenu.style.transform = 'scale(0)'
			this.colorMenuSelection(null)
		} else {
			this.colorMenuSelection(event.target.id)
			colorMenu.style.transform = 'scale(1)'
		}

		const color = this.fileStorageData()[iconIndex].color
		const colorOptions = document.getElementsByClassName('colorMenuItem')
		for (let i = 0; i < colorOptions.length; i++) {
			if (colorOptions[i].id === color) {
				colorOptions[i].style.border = '3px solid black'
			} else {
				colorOptions[i].style.border = '3px solid transparent'
			}
		}
		// colorOption.style.border = '2px solid black'
	}

	sliceArrayBuffer = (
		arrayBuffer: ArrayBuffer,
		start: number,
		chunkSize: number
	): [ArrayBuffer, string] => {
		return [arrayBuffer.slice(start, start + chunkSize), uuid_generate()]
	}

	prepareData = (file: File, path = '') => {
		let offset = 0
		const chunkSize = 2097152
		const filename = file.name
		const fileExtension = file.name.split('.').slice(-1)[0]
		const totalLength = file.size
		const contentType = file.type
		const pieces = {}
		const files = []
		const reader = new FileReader()
		reader.readAsArrayBuffer(file)
		reader.onloadend = (e) => {
			console.log(e.target.result)
			while (offset <= totalLength) {
				const data = this.sliceArrayBuffer(e.target.result, offset, chunkSize)
				pieces[offset] = data[1]
				files.push({ [data[1]]: data[0] })
				offset += chunkSize
			}
		}

		const index: kloakIndex = {
			[uuid_generate()]: {
				filename,
				fileExtension,
				totalLength,
				contentType,
				pieces,
				finished: true,
			},
		}
		return {
			index,
			files,
		}
	}

	traverseFileTree = (item, path = '') => {
		console.log(path)
		if (item.isFile) {
			item.file((file: File) => {
				const cb = () => {
					this.getHistoryTable()
				}
				new Uploader(file, 2097152, path, cb)
			})
		} else if (item.isDirectory) {
			const dirReader = item.createReader()
			dirReader.readEntries((entries) => {
				for (let i = 0; i < entries.length; i++) {
					this.traverseFileTree(entries[i], path + item.name + '/')
				}
			})
		}
	}

	ondrop = (e, data) => {
		this.selectedFile(null)
		const items = e.originalEvent.dataTransfer.items
		const length = e.originalEvent.dataTransfer.items.length
		for (let i = 0; i < length; i++) {
			const item = items[i].webkitGetAsEntry()
			if (item) {
				this.traverseFileTree(item)
			}
		}
	}

	dragover = (e) => {
		e.preventDefault()
		console.log(event)
	}

	closeVideo = (e) => {}
}