class VideoPlayer {
	private mediaSource: MediaSource = null
	private downloadQueue: DownloadQueue = null
	public currentPlaylist: {
		playlistName: string,
		playlist: KnockoutObservableArray<fileHistory>, 
		current: KnockoutObservable<number>, 
		next: KnockoutObservable<number>,
		mode: KnockoutObservable<string>,
		lastShuffle: number} = {
		playlistName: "",
		playlist: ko.observableArray([]),
		current: ko.observable(0),
		next: ko.observable(1),
		mode: ko.observable("normal"),
		lastShuffle: null
	}
	private isPlaying: KnockoutObservable<boolean> = ko.observable(false)
	private canPlay: KnockoutObservable<boolean> = ko.observable(false)
	private skipAdvertisements: KnockoutObservable<boolean> = ko.observable(false)
	private adPlaying = ko.observable(false)
	private loading = ko.observable(true)
	private playbackSpeed = ko.observable(1)
	private needBufferEvent = new Event("needBuffer")
	private sourceBuffers: {video: SourceBuffer, audio: SourceBuffer} = {
		video: null,
		audio: null
	}

	private playerElements: {
		kloakAdPlayer?: HTMLElement,
		kloakVideo?: HTMLElement,
		kloakVideoSeekBar?: HTMLElement,
		kloakSeekBar?: HTMLElement,
		kloakBufferedBar?: HTMLElement,
		kloakCurrentTimeBar?: HTMLElement,
		kloakDurationText?: HTMLElement,
		kloakVideoSpeed?: HTMLElement,
		kloakPlayButton?: HTMLElement,
		kloakStopButton?: HTMLElement,
		kloakFastForwardButton?: HTMLElement,
		kloakExpandButton?: HTMLElement
	} = {}

	private playlistPlayerElements = {
		audio: null,
		playBtn: null,
		prevBtn: null,
		nextBtn: null,
		textDisplay: null,
		progressBar: null,
		progressCompleteBar: null
	}

	constructor(private customCss: string, private callback: (err) => void, private exit: () => void) {
		this.isPlaying.subscribe(playing => {
			if (this.playerElements?.kloakVideo) {
				playing ? this.playerElements?.kloakVideo['play']() : this.playerElements?.kloakVideo['pause']()
			}

			if (this.playlistPlayerElements?.audio) {
				playing ? this.playlistPlayerElements?.audio['play']() : this.playlistPlayerElements?.audio['pause']()
			}
		})

		this.playbackSpeed.subscribe(speed => {
			this.playerElements['kloakVideo']['playbackRate'] = speed
			this.playerElements['kloakVideoSpeed'].textContent = `${speed}x`
			// switch (speed) {
			// 	case 1:
			// 		this.playerElements['kloakVideo']['playbackRate'] = speed
			// 		this.playerElements['kloakVideoSpeed'].textContent = `${speed}x`
			// 		break;
			// 	case 2:
			// 		this.playerElements['kloakVideo']['playbackRate'] = speed
			// 		this.playerElements['kloakVideoSpeed'].textContent = `${speed}x`
			// 		break;
			// 	}
		})
	}

	terminate = () => {
		this.playerElements['kloakVideo'].removeEventListener("timeupdate", this.timeUpdateEvent)
		this.playerElements['kloakVideo'].removeEventListener("progress", this.progressUpdateEvent)
		this.playerElements['kloakVideo']['pause']()
		if (this.playerElements['kloakVideo']['poster']) {
			URL.revokeObjectURL(this.playerElements['kloakVideo']['poster'])
		}
		URL.revokeObjectURL(this.playerElements['kloakVideo']['src'])
		this.playerElements['kloakVideo']['src'] = ""
		this.downloadQueue?.stopDownload()
		this.mediaSource = null
		this.sourceBuffers = {
			video: null,
			audio: null
		}
	}

	hmsToSecondsOnly(hms: string) {
		if (typeof hms !== 'string') {
			return hms
		}
		const str = hms.split(".")[0]
		let p = str.split(':')
		let s = 0 
		let m = 1
	
		while (p.length > 0) {
			s += m * parseInt(p.pop(), 10);
			m *= 60;
		}
		return s;
	}

	playAds = (action: string) => {
		if (this.playerElements['kloakAdPlayer']) {
			switch (action) {
				case 'play':
					this.adPlaying(true)
					const ads = ['coronavirus-ad.mp4', 'ipad-ad.mp4', 'nike-ad.mp4']
					this.playerElements['kloakAdPlayer']['src'] = `./videos/ads/${ads[Math.floor(Math.random() * 3)]}`
					this.playerElements['kloakAdPlayer']['play']()
					break;
				case 'stop':
					try {
						this.adPlaying(false)
						this.playerElements['kloakAdPlayer']['pause']()
						this.playerElements['kloakAdPlayer']['src'] = ""
					} catch (e) {
						return
					}
			}
		}
	}

	retrievePlayerElements = (callback: Function) => {
		this.playerElements = {
			kloakAdPlayer: document.getElementById("kloakAdPlayer"),
			kloakVideo: document.getElementById("kloakVideo"),
			kloakVideoSeekBar: document.getElementById("kloakVideoSeekBar"),
			kloakSeekBar: document.getElementById("kloakVideoSeekBar"),
			kloakBufferedBar: document.getElementById("kloakBufferedBar"),
			kloakCurrentTimeBar: document.getElementById("kloakCurrentTimeBar"),
			kloakDurationText: document.getElementById("kloakVideoDuration"),
			kloakVideoSpeed: document.getElementById("kloakVideoSpeed"),
			kloakPlayButton: document.getElementById("kloakVideoPlay"),
			kloakStopButton: document.getElementById("kloakVideoStop"),
			kloakFastForwardButton: document.getElementById("kloakFastForward"),
			kloakExpandButton: document.getElementById("kloakVideoExpand")
		}

		this.playerElements['kloakVideo'].addEventListener('canplay', () => {
			this.canPlay(true)
		})

		let playerElements = Object.values(this.playerElements)
		for(let i = 0; i < Object.values(this.playerElements).length; i++) {
			if (!playerElements[i]) {
				this.callback(new Error("Player elements not present!"))
				return
			}
		}

		callback()
	}

	sourceOpen = (mimeType: {video?: string, audio?: string}, callback: Function) => {
		// console.log(MediaSource.isTypeSupported(mimeType.video))
		console.log("JUST SOURCE OPENED MEDIA SOURCE")
		const types = Object.keys(mimeType)
		types.map(type => {
			console.log(type)
			if (mimeType[type]) {
				console.log('has type', mimeType[type])
				this.sourceBuffers[type] = this.mediaSource.addSourceBuffer(mimeType[type])
				// this.sourceBuffers[type].mode = 'sequence'
			}
		})
		callback()
	}

	setupMediaSource = (mimeType: {video?: string, audio?: string}, callback: Function) => {
		console.log("setting up media source!")
		if (!MediaSource) {
			return console.log("Your browser does not support MediaSource!")
		}
		this.mediaSource = new MediaSource()
		this.playerElements.kloakVideo['src'] = URL.createObjectURL(this.mediaSource)
		this.mediaSource.addEventListener("sourceopen", () => { this.sourceOpen(mimeType, () => {
			callback()
			}) 
		})
	}

	timeUpdateEvent = e => {
		const formatTime = (seconds: number) => {
			let date = new Date(null)
			let s: number | string = parseInt(seconds.toString(), 10)
			date.setSeconds(s)
			let time = date.toISOString().substr(11,8).split(":")
			if (time[0] === '00') {
				return [time[1], time[2]].join(":")
			} else {
				return time.join(":")
			}
		}
		try {
			const buffered = e.target['buffered'].end(0)
			const currentTime = this.playerElements.kloakVideo['currentTime']
			this.playerElements.kloakDurationText.textContent = `${formatTime(currentTime)} / ${formatTime(this.mediaSource.duration)}`
			this.playerElements.kloakCurrentTimeBar.style.width = `${(currentTime / this.mediaSource.duration) * 100}%`
			// const percent = Math.floor((currentTime/buffered) * 100)

			if (this.mediaSource.duration <= 180) {
				return this.playerElements['kloakVideo'].dispatchEvent(this.needBufferEvent)
			}

			if ((buffered - currentTime) <= 60) {
				if (!this.sourceBuffers['video'].updating || !this.sourceBuffers['audio'].updating) {
					return this.playerElements['kloakVideo'].dispatchEvent(this.needBufferEvent)
				}
			}
		} catch (e) {
			return
		}
	}

	progressUpdateEvent = e => {
		try {
			const buffered = e.target['buffered'].end(0)
			this.playerElements.kloakBufferedBar.style.width = `${Math.round((buffered / this.mediaSource.duration) * 100)}%`
		} catch (e) {
			return
		}
	}

	endOfStream = () => {
		if (this.mediaSource.readyState === 'open') {
			if (this.sourceBuffers['video']?.updating || this.sourceBuffers['audio']?.updating) {
				return setTimeout(() => {
					this.endOfStream()
				}, 250)
			}
			this.mediaSource.endOfStream()
		}
	}

	defaultSeekBarEvent = (e) => {
		const x = e?.['layerX']
		const full = this.playerElements['kloakSeekBar'].clientWidth
		const percent = (x / full)
		this.playerElements.kloakVideo['currentTime'] = percent * this.mediaSource.duration
		this.playerElements['kloakCurrentTimeBar'].style.width = `${Math.round(percent * 100)}%`
	}

	setupPlayer = (callback?: Function) => {
		// console.log(this.playerElements.kloakVideo['buffered'])
		this.playerElements.kloakVideo.addEventListener("timeupdate", this.timeUpdateEvent)
		this.playerElements?.kloakSeekBar.addEventListener("click", this.defaultSeekBarEvent)

		this.playerElements.kloakVideo.addEventListener("progress", this.progressUpdateEvent)

		this.playerElements['kloakVideo'].addEventListener('ended', _ => {
			this.isPlaying(false)
		})

		this.playerElements['kloakFastForwardButton'].addEventListener("click", _ => {
			if (this.playbackSpeed() === 2) {
				return this.playbackSpeed(1)
			}
			return this.playbackSpeed(this.playbackSpeed() + 0.5)
		})

		this.playerElements?.kloakPlayButton.addEventListener("click", _ => {
			this.isPlaying(!this.isPlaying())
		})

		this.playerElements?.kloakStopButton.addEventListener("click", _ => {
			this.isPlaying(false)
		})

		this.playerElements?.kloakExpandButton.addEventListener("click", _ => {
			this.playerElements?.kloakVideo.requestFullscreen()
		})

		callback ? callback() : null
	}

	skipAd = () => {
		this.skipAdvertisements(true)
		this.playAds('stop')
		this.isPlaying(true)
	}

	getVideoIndex = (uuid: string, callback?:Function) => {
		_view.storageHelper.decryptLoad(uuid, (err, data) => {
			if (err) {
				return
			}
			callback(JSON.parse(Buffer.from(data).toString()))
		})
	}

	// checkFileExistence = (youtubeId: string, callback: Function) => {
	// 	_view.storageHelper.getFileHistory((err, data: Array<fileHistory>) => {
	// 		if (err) {
	// 			return err
	// 		}
	// 		for(let i = 0; i < data.length; i++) {
	// 			if (data[i]['youtube']['id'] === youtubeId) {
	// 				return callback(data[i].uuid)
	// 			}
	// 		}
	// 		return callback(null)
	// 	})
	// }

	// streamingData object from ytplayer.config.args

	youtubePlayer = (streamingData, watchUrl?: string) => {
		let youtubeId = null
		let format = {}
		let duration = null
		let extension = null
		let thumbnail = {
			data: null,
			mime: null
		}
		let url = null
		let offset = 0

		console.log(streamingData)
		

		this.retrievePlayerElements(() => {
			this.loading(false)

			if (!this.adPlaying()) {
				this.playAds("play")
			}

			if (!watchUrl) {
				youtubeId = streamingData['videoDetails']['videoId']
				format = streamingData['formats'].filter(format => format.itag === 22 || format.itag === 18).pop()
				console.log(format)
				duration = streamingData['duration'] || parseInt(format['approxDurationMs'].toString()) / 1000 || null
				extension = format['mimeType'].split(" ")[0].replace(";", "").split("/")[1]
				url = format['url']
				
				const n = streamingData['thumbnails'][streamingData['thumbnails'].length - 1]['url'].split(';')
				const mime = n[0].replace('data:', '')
				const base64 = n[1].replace('base64,', '')
				thumbnail['data'] = base64
				thumbnail['mime'] = mime
			}

			if (watchUrl) {
				url = watchUrl
				youtubeId = watchUrl.replace("https://www.youtube.com/watch?v=", "")
			}

			let downloadedPieces: {[offset:number]: string} = {}
			let downloadUuidQueue = []
			let history = false
			let endOfFile = false

			this.playerElements['kloakVideo'].addEventListener("needBuffer", () => {
				console.log("NEED BUFFER")
				if (downloadUuidQueue.length) {
					_view.storageHelper.decryptLoad(downloadUuidQueue.shift(), (err, data) => {
						if (err) return
							if (data) {
								this.sourceBuffers['video'].appendBuffer(Buffer.from(data))
							}
					})
				}
				// appendNext(timestamps, index.pieces, this.sourceBuffers['video'])
			})

			const beginDownloadQueue = (url, range?: string, callback?: Function) => {
				console.log(url, range)
				this.downloadQueue = new DownloadQueue(url, 'video', (err, data) => {
					if (err) {
						return console.log(err)
					}
					if ( data ) {
						if (!this.canPlay()) {
							console.log("SHOULD APPEND")
							this.sourceBuffers['video'].appendBuffer(Buffer.from(data))
							// this.appendNext([downloadUuidQueue.shift()], this.sourceBuffers['video'])
						}
					}
				}, (requestUuid, com: kloak_downloadObj, data) => {
					let time = null
					console.log(com)
					if (this.playerElements.kloakVideo['buffered'].length > 0) {
						time = this.playerElements.kloakVideo['buffered'].end(0)
						console.log(time)
					}
					time = time ? time : 0
					downloadedPieces[offset] = com.downloadUuid
					offset = com['currentStartOffset'] + com['currentlength']
					// downloadedPieces[time] = com.downloadUuid
					if (!history) {
						if (!duration) {
							duration = this.hmsToSecondsOnly(com['duration'])
						}
						this.mediaSource.duration = parseInt(duration.toString())
						createHistory(requestUuid, com, format['bitrate'])
						history = true
					}

					if (this.playerElements.kloakVideo['buffered'].length > 0) {
						console.log(this.playerElements.kloakVideo['buffered'].end(0))
					}

					_view.storageHelper.save(com.downloadUuid, data, (err, data) => {
						if (data) {
							// if (range) {
							// 	callback(com, data)
							// } else {
								createUpdateIndex(requestUuid, com, () => {
									if (this.canPlay()) {
										downloadUuidQueue.push(com.downloadUuid)
									}
									// if (!this.canPlay() && !this.sourceBuffers['video'].updating) {
									// 	this.appendNext([downloadUuidQueue.shift()], this.sourceBuffers['video'])
									// }
								})
							// }
						}
					})
					if (com.eof) {
						endOfFile = true
					}
				})
			}

			this.setupMediaSource({video: format['mimeType'] || 'video/mp4; codecs="avc1.64001F, mp4a.40.2"'}, () => {
				this.setupPlayer()

				// this.checkFileExistence(youtubeId, (uuid) => {
				// 	let index = null
				// 	if (uuid) {
				// 		this.getVideoIndex(uuid[0], (data) => {
				// 			index = data
				// 			downloadedPieces = index.pieces
				// 			downloadUuidQueue = Object.values(downloadedPieces)
				// 			this.appendNext(downloadUuidQueue, this.sourceBuffers['video'])
				// 			// if (!index.finished) {
				// 			// 	beginDownloadQueue(`https://www.youtube.com/watch?v=${youtubeId}`, `bytes=${Object.keys(downloadedPieces)[downloadUuidQueue.length - 1]}-${index.totalLength}`)
				// 			// }
				// 		})
				// 	} else {
						beginDownloadQueue(url, null)
				// 	}
				// })
			})

			const createUpdateIndex = (requestUuid, com: kloak_downloadObj, done: Function) => {
				const index: kloakIndex = {
					filename: com.downloadFilename,
					fileExtension: extension,
					totalLength: com.totalLength ? com.totalLength : null,
					contentType: com.contentType,
					pieces: downloadedPieces,
					finished: com.eof
				}
				_view.storageHelper.createUpdateIndex(requestUuid, index, (err, data) => {
					if (err) {
						return console.log(err)
					}
					done()
				})
			}

			const createHistory = (requestUuid, com: kloak_downloadObj, bitrate: number) => {
				const date = new Date()
				const file: fileHistory = {
					uuid: [requestUuid],
					filename: streamingData ? `${streamingData['videoDetails']['title']}.mp4` : watchUrl,
					time_stamp: date,
					last_viewed: date,
					path: "",
					url: streamingData ? `https://www.youtube.com/watch?v=${streamingData['videoDetails']['videoId']}` : "",
					tags: ['youtube', extension, 'video'],
					size: com.totalLength ? com.totalLength : null,
					favorite: false,
					youtube: {
						id: youtubeId || "",
						mimeType: {
							video: format['mimeType'] || `video/mp4; codecs="avc1.64001F, mp4a.40.2"`,
						},
						thumbnail,
						bitrate,
						duration
					}
				}

				_view.storageHelper.saveFileHistory(file, (err, data) => {
					if (err) {
						return console.log(err)
					}
				})
			}
		})
	}

	

	// Youtube stream with URL

	// youtubeStream = (url: string) => {
	// 	let downloadedPieces = []
	// 	let downloadUuidQueue = []

	// 	const cmd = {
	// 		command: 'CoSearch',
	// 		Args: [ url ],
	// 		error: null,
	// 		subCom: 'youtube_getVideoMp4',
	// 		requestSerial: uuid_generate()
	// 	}

	// 	this.retrievePlayerElements(() => {
	// 		this.loading(false)

	// 		if (!this.adPlaying()) {
	// 			this.playAds("play")
	// 		}
	// 	})

	// 	this.playerElements['kloakVideo'].addEventListener("needBuffer", () => {
	// 		console.log("NEED BUFFER")
	// 		if (downloadUuidQueue.length) {
	// 			_view.storageHelper.decryptLoad(downloadUuidQueue.shift(), (err, data) => {
	// 				if (err) return
	// 					if (data) {
	// 						this.sourceBuffers['video'].appendBuffer(Buffer.from(data))
	// 					}
	// 			})
	// 		}
	// 		// appendNext(timestamps, index.pieces, this.sourceBuffers['video'])
	// 	})
	// }

	appendNext = (pieces, sourceBuffer: SourceBuffer) => {
		if (!pieces.length) {
			this.endOfStream()
		}
		if (sourceBuffer) {
			if (pieces.length) {
				_view.storageHelper.decryptLoad(pieces.shift(), (err, data) => {
					if (err) {
						return
					}
					if (data) {
						try {
							sourceBuffer.appendBuffer(Buffer.from(data))
						} catch (e) {
							console.log(e)
						}
						if (this.mediaSource.duration < 180) {
							this.appendNext(pieces, sourceBuffer)
						}
					}
				})
				
			}
		}
	}

	downloadedYoutube = (fileHistory) => {

		// Testing shuffle
		const shuffle = (array) => {
			for (let i = array.length - 1; i > 0; i--) {
			  let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
		  
			  // swap elements array[i] and array[j]
			  // we use "destructuring assignment" syntax to achieve that
			  // you'll find more details about that syntax in later chapters
			  // same can be written as:
			  // let t = array[i]; array[i] = array[j]; array[j] = t
			  [array[i], array[j]] = [array[j], array[i]];
			}
		  }

		this.retrievePlayerElements(() => {

			this.skipAdvertisements(true)
			this.loading(false)
			let index = null
			let pieces = []
			let timestamps = []
			let currentFetchTimestamps = []
			let tags: Array<string> = ko.isObservable(fileHistory.tag) ? fileHistory.tag() : fileHistory.tag

			const appendNext = (pieces, sourceBuffer: SourceBuffer, from?: number) => {
				if (sourceBuffer) {
					// if (from) {
					// 	const n = pieces.slice(from - 1)
					// 	console.log(n)
					// 	return
					// }
					// if (from) {
					// 	for(let i = timestamps.length; i >= 0; i++) {
					// 		if (timestamps[i] > from) {
					// 			continue
					// 		} else {
					// 			currentFetchTimestamps = timestamps.slice(i)
					// 			return
					// 		}
					// 	}
					// }
					if (pieces.length) {
						_view.storageHelper.decryptLoad(pieces.shift(), (err, data) => {
							if (err) {
								return
							}
							if (data) {
								console.log(Buffer.from(data))
								sourceBuffer.appendBuffer(Buffer.from(data))
								if (this.mediaSource.duration < 180) {
									appendNext(pieces, sourceBuffer)
								}
							}
						})
						
					} else {
						this.endOfStream()
					}
				}
			}
			

			this.playerElements['kloakVideo'].addEventListener("needBuffer", () => {
				if (this.mediaSource.readyState === 'ended' || this.mediaSource.duration < 180) {
					return
				}
				appendNext(pieces, this.sourceBuffers['video'])
			})

			this.playerElements['kloakSeekBar'].addEventListener("click", (e) => {
				const x = e?.['layerX']
				const full = this.playerElements['kloakSeekBar'].clientWidth
				const percent = (x / full)
				const currentTime = percent * this.mediaSource.duration
				this.playerElements['kloakVideo']['currentTime'] = currentTime
				const n = pieces.slice((((currentTime * fileHistory['youtube']['bitrate']) / 8) / 1048576) - 1)
				appendNext(n, this.sourceBuffers['video'])
				// this.sourceBuffers['video'].abort()

				// console.log(index.pieces)
				// FIX HEREEEEE
				// appendNext()
				// this.sourceBuffers['video'].abort()
				// this.playerElements.kloakVideo['currentTime'] = percent * this.mediaSource.duration
			})
			

			switch (true) {
				case ['youtube', 'mp4'].every(val => tags.includes(val)):
					_view.storageHelper.getIndex(fileHistory.uuid[0], (err, data) => {
						if (err) {
							return
						}
						if (data) {
							index = data
							this.setupMediaSource(fileHistory['youtube'].mimeType, () => {
								this.mediaSource.duration = fileHistory['youtube'].duration
								this.setupPlayer()
								this.isPlaying(true)
								pieces = Object.values(index.pieces)
								// let temp = timestamps.splice(0,3)
								// let n = timestamps.splice(3)
								// shuffle(n)
								// timestamps = [...temp, ...n]
								appendNext(Object.values(pieces), this.sourceBuffers['video'])
							})
						}
					})
					break;
				case ['youtube', 'audio'].every(val => tags.includes(val)):
				case ['youtube', 'webm'].every(val => tags.includes(val)):
					if (fileHistory.uuid.length > 1) {
						console.log(fileHistory)
						let videoIndex = null
						let audioIndex = null
						const getIndex = (uuid, callback: Function) => {
							if (uuid) {
								_view.storageHelper.getIndex(uuid, (err, data) => {
									if (err) {
										return
									}
									if (data) {
										callback(JSON.parse(Buffer.from(data).toString()))
									}
								})
							} else {
								callback()
							}
						}
		
						getIndex(fileHistory.uuid[0], (index) => {
							if (index) {
								videoIndex = index
							}
							getIndex(fileHistory.uuid[1], (index) => {
								audioIndex = index
								this.setupMediaSource(fileHistory['youtube'].mimeType, () => {
									this.mediaSource.duration = fileHistory['youtube'].duration
									this.setupPlayer()
									this.playerElements['kloakVideo']['poster'] = _view.storageHelper.dataURItoBlob(fileHistory['youtube']['thumbnail']['data'], fileHistory['youtube']['thumbnail']['mime'])
									this.isPlaying(true)
									if (videoIndex) {
										appendNext(videoIndex['pieces'], this.sourceBuffers['video'])
									}
									if (audioIndex) {
										appendNext(audioIndex['pieces'], this.sourceBuffers['audio'])
									}
								})
							})
						});
						return
					}
					break;
			}
		})
	}

	uploadedVideo = (fileHistory) => {
		this.retrievePlayerElements(() => {

			this.playerElements['kloakVideo'].addEventListener("needBuffer", () => {
				this.appendNext(index.pieces, this.sourceBuffers['video'])
			})

			this.skipAdvertisements(true)
			let index = null
			this.loading(false)

			this.playerElements['kloakSeekBar'].addEventListener("click", (e) => {
				const x = e?.['layerX']
				const full = this.playerElements['kloakSeekBar'].clientWidth
				const percent = (x / full)
				const currentTime = percent * this.mediaSource.duration
				this.playerElements['kloakVideo']['currentTime'] = currentTime

				console.log(index.pieces)
				// FIX HEREEEEE
				// appendNext()
				// this.sourceBuffers['video'].abort()
				// this.playerElements.kloakVideo['currentTime'] = percent * this.mediaSource.duration
			})

			_view.storageHelper.getIndex(fileHistory.uuid[0], (err, data) => {
				if (err) {
					return
				}
				if (data) {
					index = data
					this.setupMediaSource({video: fileHistory['videoData'].mimeType, audio: null}, () => {
						this.mediaSource.duration = fileHistory['videoData'].duration
						this.setupPlayer(() => {
							if (fileHistory['videoData'].mimeType.split("/")[0] === "audio") {
								this.playerElements.kloakVideo.classList.add("placeholderGradient")
								this.playerElements.kloakVideo.style.opacity = "1"
							}
						})
						this.isPlaying(true)
						this.appendNext(index.pieces, this.sourceBuffers['video'])
					})
				}
			})
		})
	}

	playlistPlayer = (playlistName: string, playlistItems: Array<string>, mode?: string) => {
		this.currentPlaylist.playlistName = playlistName;
		if (mode) {
			this.currentPlaylist.mode(mode)
		}
		const random = () => {
			const num = Math.floor(Math.random() * (this.currentPlaylist.playlist().length)) + 1
			if (this.currentPlaylist.lastShuffle === num) {
				console.log("should return")
				return random()
			}
			this.currentPlaylist.lastShuffle = num
			return num
		}
		
		this.loading(true)
		let duration = 0
		let files = []

		const setupPlayer = (callback: Function) => {

			this.playlistPlayerElements = {
				audio: document.getElementById("fileStorageAudioPlayer"),
				playBtn: document.getElementById("audioPausePlay"),
				prevBtn: document.getElementById("audioPlayingPrevious"),
				nextBtn: document.getElementById("audioPlayingNext"),
				textDisplay: document.getElementById("audioPlayingText"),
				progressBar: document.getElementById("audioPlayingProgress"),
				progressCompleteBar: document.getElementById("audioPlayingProcessComplete")
			}

			this.playlistPlayerElements.playBtn.addEventListener("click", () => {
				this.isPlaying(!this.isPlaying())
			})

			this.playlistPlayerElements.prevBtn.addEventListener("click", () => {
				getTrackFile('previous')
			})

			this.playlistPlayerElements.nextBtn.addEventListener("click", () => {
				getTrackFile('next')
			})

			this.playlistPlayerElements.audio.addEventListener('paused', () => {
				this.isPlaying(false)
				console.log("PAUSED")
			})

			this.playlistPlayerElements.audio.addEventListener('play', () => {
				this.isPlaying(true)
			})

			this.playlistPlayerElements.audio['preload'] = 'metadata'
			this.playlistPlayerElements.audio.onloadedmetadata = () => {
				duration = this.playlistPlayerElements.audio['duration']
			}

			this.playlistPlayerElements.audio.addEventListener("timeupdate", e => {
				const formatTime = (seconds: number) => {
					let date = new Date(null)
					let s: number | string = parseInt(seconds.toString(), 10)
					date.setSeconds(s)
					let time = date.toISOString().substr(11,8).split(":")
					if (time[0] === '00') {
						return [time[1], time[2]].join(":")
					} else {
						return time.join(":")
					}
				}
				try {
					const currentTime = this.playlistPlayerElements.audio['currentTime']
					// this.playerElements.kloakDurationText.textContent = `${formatTime(currentTime)} / ${formatTime(this.mediaSource.duration)}`
					this.playlistPlayerElements.progressCompleteBar.style.width = `${(currentTime / duration) * 100}%`
				} catch (e) {
					return
				}
			})

			this.playlistPlayerElements.progressBar.addEventListener("click", (e) => {
				const x = e?.['offsetX']
				const full = this.playlistPlayerElements.progressBar.clientWidth
				console.log(e)
				const percent = (x / full)
				const currentTime = percent * duration
				this.playlistPlayerElements.audio['currentTime'] = currentTime
			})

			this.playlistPlayerElements.audio.onended = () => {
				getTrackFile("next")
			}

			callback()
		}

		const init = (callback: (playlist) => void) => {
			_view.storageHelper.getHistory((err, data) => {
				const temp = data['files'].filter(file => playlistItems.includes(file['uuid'][0]))
				playlistItems.forEach(item => {
					files.push(...temp.filter(file => file['uuid'][0] === item))
				})
				callback(files)
			})
		}

		const getTrackFile = (direction?: string) => {
			this.playlistPlayerElements.audio ? URL.revokeObjectURL(this.playlistPlayerElements.audio['src']) : null
			this.playlistPlayerElements.textDisplay ? this.playlistPlayerElements.textDisplay.textContent = "" : null
			if (this.currentPlaylist.mode() === 'shuffle') {
				const num = random()
				this.currentPlaylist.current(num)
			} else {
				switch (direction) {
					case 'next':
						if (this.currentPlaylist.current() === this.currentPlaylist.playlist().length) {
							this.currentPlaylist.current(1)
							this.currentPlaylist.next(2)
						} else {
							this.currentPlaylist.current(this.currentPlaylist.next())
							this.currentPlaylist.next(this.currentPlaylist.next() + 1)
						}
						break;
					case 'previous':
						if (this.currentPlaylist.current() === 1) {
							this.currentPlaylist.current(this.currentPlaylist.playlist().length)
							this.currentPlaylist.next(1)
						} else {
							this.currentPlaylist.next(this.currentPlaylist.current())
							this.currentPlaylist.current(this.currentPlaylist.current() - 1)
						}
						break;
					default:
						break;
				}
			}

			this.loading(true)
			this.isPlaying(false)
			this.currentPlaylist.lastShuffle = this.currentPlaylist.current()
			const track = this.currentPlaylist.playlist()[this.currentPlaylist.current() - 1]
			new Assembler(track['uuid'][0], null, (err, data) => {
				let url = _view.storageHelper.createBlob(data['buffer'], data['contentType'])
				this.loading(false)
					console.log("should setup?")
					setupPlayer(() => {
						this.playlistPlayerElements.audio['src'] = url
						this.playlistPlayerElements.textDisplay.textContent = track.filename
					})
				this.isPlaying(true)
			})
			// _view.storageHelper.createAssembler(track['uuid'][0], (err, data) => {
			// 	let url = _view.storageHelper.createBlob(data['buffer'], data['contentType'])
			// 	this.loading(false)
			// 		console.log("should setup?")
			// 		setupPlayer(() => {
			// 			this.playlistPlayerElements.audio['src'] = url
			// 			this.playlistPlayerElements.textDisplay.textContent = track.filename
			// 		})
			// 	this.isPlaying(true)
			// })
		}

		init((playlist) => {
			this.currentPlaylist.playlist(playlist)
			getTrackFile("next")
			// getNextFile(track['uuid'][0], (url) => {
			// 	this.loading(false)
			// 	setupPlayer(() => {
			// 		this.playlistPlayerElements.audio['src'] = url
			// 		this.playlistPlayerElements.textDisplay.textContent = track.filename
			// 		console.log(this.playlistPlayerElements.audio['duration'])
			// 		this.isPlaying(true)
			// 	})
			// })
		})
	}

	recording = (fileHistory) => {
		console.log(fileHistory)
		_view.storageHelper.createAssembler(fileHistory.uuid[0], (err, data) => {
			if (err) {
				return
			}
			if (data) {
				this.retrievePlayerElements(() => {
					this.skipAdvertisements(true)
					this.loading(false)
					this.setupPlayer(() => {
						const _self = this
						this.playerElements['kloakVideo']['preload'] = "metadata"
						this.playerElements['kloakVideo']['src'] = _view.storageHelper.createBlob(data.buffer, data.contentType)
						this.playerElements['kloakVideo'].onloadedmetadata = function() {
							_self.isPlaying(true)
						}
					})
				})
			}
		})
	}
}