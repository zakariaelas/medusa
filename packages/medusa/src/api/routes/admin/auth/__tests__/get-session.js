import { IdMap } from "medusa-test-utils"
import { registerService, request } from "../../../../../helpers/test-request"

describe("GET /admin/auth", () => {
  describe("authorize session", () => {
    let subject

    const userService = {
      retrieve: jest.fn(() =>
        Promise.resolve({
          id: "usr_123",
          password_hash: "secretstuff",
        })
      ),
    }

    beforeAll(async () => {
      registerService("userService", userService)

      subject = await request("GET", `/admin/auth`, {
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
      expect(subject.body.user).toEqual({ id: "usr_123" })
    })
  })
})
