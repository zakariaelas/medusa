import { IdMap } from "medusa-test-utils"
import { registerService, request } from "../../../../../helpers/test-request"

describe("GET /admin/customers", () => {
  const customerService = {
    listAndCount: jest.fn(() => Promise.resolve([[{ id: "cus_new" }], 1])),
  }

  describe("list customers successfully", () => {
    let subject

    beforeAll(async () => {
      registerService("customerService", customerService)

      subject = await request("GET", "/admin/customers", {
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
      expect(subject.body.count).toEqual(1)
      expect(subject.body.customers).toEqual([{ id: "cus_new" }])
    })

    it("calls production collection service create", () => {
      expect(customerService.listAndCount).toHaveBeenCalledTimes(1)
      expect(customerService.listAndCount).toHaveBeenCalledWith(
        {},
        {
          take: 50,
          skip: 0,
          relations: [],
        }
      )
    })
  })

  describe("queries", () => {
    registerService("customerService", customerService)

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("list with q", async () => {
      const subject = await request("GET", "/admin/customers?q=name", {
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
      })

      expect(subject.status).toEqual(200)

      expect(customerService.listAndCount).toHaveBeenCalledTimes(1)
      expect(customerService.listAndCount).toHaveBeenCalledWith(
        { q: "name" },
        {
          take: 50,
          skip: 0,
          relations: [],
        }
      )
    })

    it("list with expands", async () => {
      const subject = await request("GET", "/admin/customers?expand=orders", {
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
      })

      expect(subject.status).toEqual(200)

      expect(customerService.listAndCount).toHaveBeenCalledTimes(1)
      expect(customerService.listAndCount).toHaveBeenCalledWith(
        {},
        {
          take: 50,
          skip: 0,
          relations: ["orders"],
        }
      )
    })
  })
})
