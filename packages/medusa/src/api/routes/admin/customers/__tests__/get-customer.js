import { IdMap } from "medusa-test-utils"
import { registerService, request } from "../../../../../helpers/test-request"

describe("POST /admin/customers", () => {
  const customerService = {
    retrieve: jest.fn(() => Promise.resolve({ id: "cus_new" })),
  }

  describe("successful creation", () => {
    let subject

    beforeAll(async () => {
      registerService("customerService", customerService)

      subject = await request("GET", "/admin/customers/cus_new", {
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

    it("returns customer", () => {
      expect(subject.body.customer.id).toEqual("cus_new")
    })

    it("calls production collection service create", () => {
      expect(customerService.retrieve).toHaveBeenCalledTimes(1)
      expect(customerService.retrieve).toHaveBeenCalledWith("cus_new", {
        relations: ["orders"],
      })
    })
  })
})
