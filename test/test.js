import { expect } from 'chai'
const theModule = require('../dist-es5')

console.log('MODULE:', theModule)

describe('Default module', () => {
	it('Should have content', () => {
		const testVar = theModule()
		expect(testVar).to.not.be.empty
		expect(testVar.test).to.equal('123')
	})
})