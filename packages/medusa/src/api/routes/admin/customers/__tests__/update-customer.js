import { IdMap } from "medusa-test-utils"
import { registerService, request } from "../../../../../helpers/test-request"

describe("POST /admin/customers", () => {
  const customerService = {
    update: jest.fn(() => Promise.resolve({ id: "cus_new" })),
    retrieve: jest.fn(() => Promise.resolve({ id: "cus_new" })),
  }

  describe("successful creation", () => {
    let subject

    beforeAll(async () => {
      registerService("customerService", customerService)

      subject = await request("POST", "/admin/customers/cus_new", {
        payload: {
          first_name: "Seb",
          last_name: "Test",
        },
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
      })
    })

    it("returns 201", () => {
      expect(subject.status).toEqual(200)
    })

    it("returns created customer", () => {
      expect(subject.body.customer.id).toEqual("cus_new")
    })

    it("calls production collection service create", () => {
      expect(customerService.update).toHaveBeenCalledTimes(1)
      expect(customerService.update).toHaveBeenCalledWith("cus_new", {
        first_name: "Seb",
        last_name: "Test",
      })
    })
  })

  describe("invalid data returns error details", () => {
    let subject

    beforeAll(async () => {
      registerService("customerService", customerService)
      subject = await request("POST", "/admin/customers/cus_new", {
        payload: {
          excessive: "stuff",
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
