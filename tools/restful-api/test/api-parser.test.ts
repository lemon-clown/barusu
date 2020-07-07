import { before, it } from 'mocha'
import path from 'path'
import { ApiItemParser } from '../src'
import { ApiItemParserTestCaseMaster } from './util/api-parser-case-util'


it('This is a required placeholder to allow before() to work', () => { })
before(async function test() {
  const caseRootDirectory = path.resolve('test/cases')
  const apiItemParser = new ApiItemParser()
  const caseMaster = new ApiItemParserTestCaseMaster(apiItemParser, { caseRootDirectory })
  await caseMaster.scan('api-item')

  describe('DataSchemaCompiler test cases', function () {
    caseMaster.test()
  })
})