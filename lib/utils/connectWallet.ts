import { MetaMaskMethod } from "../types"

const connectWallet: MetaMaskMethod<void> = async (ethereum) => {
	try {
		if (!ethereum) {
			console.log('Metamask not detected')
			return
		}
		let chainId = await ethereum.request({ method: 'eth_chainId' })
		console.log('Connected to chain:' + chainId)

		const rinkebyChainId = '0x4'

		// we have to check for polygon
		if (chainId !== rinkebyChainId) {
			console.log('are not connected to the Rinkeby Testnet!')
		}

		const accounts = await ethereum.request({ method: 'eth_requestAccounts' }) as Array<any>

		console.log('Found account', accounts[0])
	} catch (error) {
		// TODO: This error should be handled on the Frontend 
		console.log('Error connecting to metamask', error)
	}
}

export default connectWallet