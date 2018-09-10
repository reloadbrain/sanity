const {BufferedDocument, Mutation} = require('../lib')
const snapshot = require('./fixtures/snapshot')
const bufferedDocument = new BufferedDocument(snapshot)

require('./fixtures/patches').forEach((patches, i) => {
  const label = `${i}. bufferedDocument.add`
  console.time(label)
  bufferedDocument.add(
    new Mutation({mutations: patches.map(patch => ({patch: {...patch, id: snapshot._id}}))})
  )
  console.timeEnd(label)
})
