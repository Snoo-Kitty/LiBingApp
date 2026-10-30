export interface VoiceLine {
	[about: string]: string
}

export interface VGGItem {
	character: string
	sections: {
		Story: VoiceLine
		Combat: {[about: string]: string | string[]}
	}
}
