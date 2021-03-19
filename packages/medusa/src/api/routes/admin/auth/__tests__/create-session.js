import { IdMap } from "medusa-test-utils"
import { registerService, request } from "../../../../../helpers/test-request"

describe("POST /admin/auth", () => {
  describe("authorize session", () => {
    let subject

    const authService = {
      authenticate: jest.fn(() =>
        Promise.resolve({
          success: true,
          user: { id: "usr_123", password_hash: "secretstuff" },
        })
      ),
    }

    beforeAll(async () => {
      registerService("authService", authService)

      subject = await request("POST", `/admin/auth`, {
        payload: {
          email: "mail@test.com",
          password: "12345",
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
      expect(subject.body.user).toEqual({ id: "usr_123" })
    })
    it("product collection service update", () => {
      expect(authService.authenticate).toHaveBeenCalledTimes(1)
      expect(authService.authenticate).toHaveBeenCalledWith(
        "mail@test.com",
        "12345"
      )
    })
  })

  describe("fail authentication", () => {
    let subject

    const authService = {
      authenticate: jest.fn(() =>
        Promise.resolve({
          success: false,
        })
      ),
    }

    beforeAll(async () => {
      registerService("authService", authService)

      subject = await request("POST", `/admin/auth`, {
        payload: {
          email: "mail@test.com",
          password: "12345",
        },
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
      })
    })

    it("returns 401", () => {
      expect(subject.status).toEqual(401)
    })

    it("product collection service update", () => {
      expect(authService.authenticate).toHaveBeenCalledTimes(1)
      expect(authService.authenticate).toHaveBeenCalledWith(
        "mail@test.com",
        "12345"
      )
    })
  })

  describe("fail on invalid data", () => {
    let subject

    const authService = {
      authenticate: jest.fn(() =>
        Promise.resolve({
          success: false,
        })
      ),
    }

    beforeAll(async () => {
      registerService("authService", authService)

      subject = await request("POST", `/admin/auth`, {
        payload: {
          password: "12345",
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
