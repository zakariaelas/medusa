import { IdMap } from "medusa-test-utils"
import { registerService, request } from "../../../../../helpers/test-request"

describe("POST /admin/customers", () => {
  const customerService = {
    create: jest.fn(() => Promise.resolve({ id: "cus_new" })),
  }

  describe("successful creation", () => {
    let subject

    beforeAll(async () => {
      registerService("customerService", customerService)

      subject = await request("POST", "/admin/customers", {
        payload: {
          email: "mail@test.com",
          first_name: "Seb",
          last_name: "test",
          phone: "12345",
        },
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
      })
    })

    it("returns 201", () => {
      expect(subject.status).toEqual(201)
    })

    it("returns created customer", () => {
      expect(subject.body.customer.id).toEqual("cus_new")
    })

    it("calls production collection service create", () => {
      expect(customerService.create).toHaveBeenCalledTimes(1)
      expect(customerService.create).toHaveBeenCalledWith({
        email: "mail@test.com",
        first_name: "Seb",
        last_name: "test",
        phone: "12345",
      })
    })
  })

  describe("invalid data returns error details", () => {
    let subject

    beforeAll(async () => {
      registerService("customerService", customerService)
      subject = await request("POST", "/admin/customers", {
        payload: {
          first_name: "Seb",
          last_name: "test",
          phone: "12345",
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
