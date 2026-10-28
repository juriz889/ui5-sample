const cds = require('@sap/cds')

module.exports = class AdminService extends cds.ApplicationService {
  init() {

    const { Books } = this.entities

    /**
     * Reject titles containing "error" and generate IDs for new Books
     */
    this.before('CREATE', Books, async (req) => {
      if (req.data.title?.toLowerCase().includes('error_title')) {
        return req.reject({ status: 400, message: 'Title must not contain "error_title"', target: 'title' })
      }
      if (req.data.title?.toLowerCase().includes('error')) {
        return req.reject({ status: 400, message: 'Title must not contain "error"' })
      }
      if (req.data.ID) return
      const { ID } = await SELECT.one.from(Books).columns('max(ID) as ID')
      req.data.ID = (ID || 0) + 1
    })

    /**
     * Generate IDs for new Books drafts
    this.before ('NEW', Books.drafts, async (req) => {
      if (req.data.ID) return
      const { ID:id1 } = await SELECT.one.from(Books).columns('max(ID) as ID')
      const { ID:id2 } = await SELECT.one.from(Books.drafts).columns('max(ID) as ID')
      req.data.ID = Math.max(id1||0, id2||0) + 1
    })
     */
    return super.init()
  }
}