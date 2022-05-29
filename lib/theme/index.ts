import { darken, lighten } from '@theme-ui/color'
import { bootstrap } from '@theme-ui/presets'
import { Theme } from 'theme-ui'

const theme: Theme = {
	...bootstrap,
	buttons: {
		primary: {
			bg: lighten('purple', 0.05),
			color: 'white',
			px: [44],
			borderRadius: [10],
			cursor: 'pointer',
			transition: '0.3s',
			':hover': {
				bg: 'purple',
			},
		},
		connect: {
			bg: darken('orange', 0.05),
			color: 'white',
			px: [44],
			borderRadius: [10],
			cursor: 'pointer',
			transition: '0.3s',
			':hover': {
				bg: darken('orange', 0.1),
			},
		}
	}
}

export default theme