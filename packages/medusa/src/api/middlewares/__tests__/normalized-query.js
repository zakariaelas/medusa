import normalizedQuery from "../normalized-query"

describe("normalize query", () => {
  describe("normalizes query", () => {
    const next = jest.fn()
    const middleware = normalizedQuery()

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("assigns key val paris", () => {
      const req = {
        query: {
          test: "value",
          good: "news",
        },
      }

      middleware(req, {}, next)

      expect(req.query).toEqual(req.query)
      expect(next).toHaveBeenCalledTimes(1)
    })

    it("splits array strings", () => {
      const req = {
        query: {
          test: ["value,val2"],
        },
      }

      middleware(req, {}, next)

      expect(req.query).toEqual({
        test: ["value", "val2"],
      })

      expect(next).toHaveBeenCalledTimes(1)
    })

    it("skips array with more vals", () => {
      const req = {
        query: {
          test: ["value", "val2"],
        },
      }

      middleware(req, {}, next)

      expect(req.query).toEqual({
        test: ["value", "val2"],
      })

      expect(next).toHaveBeenCalledTimes(1)
    })
  })
})
