import { onMessage } from "@qatium/sdk/ui";

onMessage((msg: number) => {
  document.querySelector("body")!.innerHTML = msg.toString();
});
