import { MetaMaskMethod } from '../types/index'

const checkIfWalletIsConnected: MetaMaskMethod<boolean> = async (ethereum) => {
	const accounts = await ethereum.request({ method: 'eth_accounts' }) as Array<any>

	if (accounts.length !== 0) {
		// console.log('Found authorized Account: ', accounts[0])
		return true
	} else {
		// console.log('No authorized account found')
		return false
	}
}


export default checkIfWalletIsConnected