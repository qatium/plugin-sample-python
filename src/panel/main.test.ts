import "./main"
import fs from 'fs'

describe("Panel tests", () => {
  const domParser = new DOMParser()
  const html = fs.readFileSync("src/panel/index.html", "utf8")

  beforeEach(() => {
    window.document.body = domParser.parseFromString(html, "text/html").body
  })

  it("updates html on message received", async () => {
    window.dispatchEvent(new MessageEvent("message", {
       data: {
          source: "qatium",
          type: "message",
          payload: 123
        }
      })
    )

    expect(window.document.body.innerHTML).toBe("123")
  })
})