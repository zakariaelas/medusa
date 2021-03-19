import { IdMap } from "medusa-test-utils"
import { registerService, request } from "../../../../../helpers/test-request"

describe("POST /admin/apps/authorizations", () => {
  describe("authorize app", () => {
    let subject

    const oauthService = {
      generateToken: jest.fn(() => Promise.resolve({ completed: true })),
    }

    beforeAll(async () => {
      registerService("oauthService", oauthService)

      subject = await request("POST", `/admin/apps/authorizations`, {
        payload: {
          application_name: "test_app",
          state: "1351",
          code: "abcdefg",
        },
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
      expect(subject.body.apps).toEqual({ completed: true })
    })

    it("product collection service update", () => {
      expect(oauthService.generateToken).toHaveBeenCalledTimes(1)
      expect(oauthService.generateToken).toHaveBeenCalledWith(
        "test_app",
        "abcdefg",
        "1351"
      )
    })
  })

  describe("returns 400 on validation failure", () => {
    let subject

    const oauthService = {
      generateToken: jest.fn(() => Promise.resolve({ completed: true })),
    }

    beforeAll(async () => {
      registerService("oauthService", oauthService)

      subject = await request("POST", `/admin/apps/authorizations`, {
        payload: {
          state: "1351",
          code: "abcdefg",
        },
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
      })
    })

    it("returns 400", () => {
      expect(subject.status).toEqual(400)
    })
  })
})
