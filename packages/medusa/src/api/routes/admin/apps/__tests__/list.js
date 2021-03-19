import { IdMap } from "medusa-test-utils"
import { registerService, request } from "../../../../../helpers/test-request"

describe("POST /admin/apps/authorizations", () => {
  describe("authorize app", () => {
    let subject

    const oauthService = {
      list: jest.fn(() => Promise.resolve([])),
    }

    beforeAll(async () => {
      registerService("oauthService", oauthService)

      subject = await request("GET", `/admin/apps`, {
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
      })
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns updated product collection", () => {
      expect(subject.body.apps).toEqual([])
    })

    it("product collection service update", () => {
      expect(oauthService.list).toHaveBeenCalledTimes(1)
      expect(oauthService.list).toHaveBeenCalledWith({})
    })
  })
})
