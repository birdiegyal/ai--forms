import { onsubmit, viewTransition } from "./utils"

const form = document.querySelector("form") as HTMLFormElement
form.onsubmit = onsubmit

const showPolicyLink = document.querySelector(
  "a#dataPolicy"
) as HTMLParagraphElement
showPolicyLink.onclick = viewTransition

const hidepolicyLink = document.querySelector("svg#hidePolicy") as SVGElement
hidepolicyLink.onclick = viewTransition

const hidepolicyButton = document.querySelector(
  "button#hidePolicy"
) as SVGElement
hidepolicyButton.onclick = viewTransition
