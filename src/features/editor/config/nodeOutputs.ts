import { NodeType } from "@/generated/prisma/enums";

export const nodeOutpus:Record<NodeType,string|null> = {
    PUBSUBHUBBUB: `
    type YouTubeVideoNotification = {
  videoId: string;       // e.g. "dQw4w9WgXcQ"
  channelId: string;     // e.g. "UC_x5XG1OV2P6uZZ5FSM9Ttw"
  title: string;
  link?: string;         // video URL, may be missing
  published: string;     // ISO 8601
  updated: string;       // ISO 8601, triggers notification
};
    `,
    GROQ_AI:`
    # Groq AI Node — Fill Instructions

Fill only when user intent is clear; leave unclear fields blank/default.

- **Node name**: short verb phrase, e.g. "Generate Summary"
- **API Key Credential**: never set — user must select/create manually
- **Model**: default openai/gpt-oss-20b unless user names one
- **System Prompt**: 1–2 sentences defining role + rules, e.g. "You are a helpful assistant that summarizes text concisely."
- **User Prompt**: the actual task, referencing upstream data via {{node.field}}, e.g. Summarize {{webhook.body}}

Only use {{...}} variables that exist in the current workflow — never invent one.
    `,
    HTTP_REQUEST:null,
    MANUAL_TRIGGER:null,
    SEND_DISCORD_MESSAGE:null,
    SEND_EMAIL:null,
    SEND_TELEGRAM_MESSAGE:null,
    WEBHOOK:null,
    GOOGLE_FORMS:`
    # Google Form Trigger

Starts the workflow when a Google Form is submitted. No native webhook — requires a small Apps Script the user installs manually.

## Setup steps (tell the user these, in order)

1. Open the Google Form
2. ⋮ → Extensions → Apps Script
3. Delete existing code, paste the provided script, Save
4. Click Run once → authorize
5. Triggers (clock icon) → Add trigger
6. Function: onFormSubmit
7. Event source: Form
8. Event type: On form submit
9. Save

## Script the user pastes

js
function onFormSubmit(e) {
  var WEBHOOK_URL = "YOUR_WEBHOOK_URL";
  var WEBHOOK_SECRET = "YOUR_WEBHOOK_SECRET";
  var answers = {};
  e.response.getItemResponses().forEach(function (item) {
    answers[item.getItem().getTitle()] = item.getResponse();
  });
  UrlFetchApp.fetch(WEBHOOK_URL, {
    method: "post",
    contentType: "application/json",
    headers: { "x-webhook-secret": WEBHOOK_SECRET },
    payload: JSON.stringify({
      formTitle: e.source.getTitle(),
      submittedAt: new Date().toISOString(),
      answers: answers,
    }),
  });
}


Replace YOUR_WEBHOOK_URL / YOUR_WEBHOOK_SECRET with this node's actual callback URL and secret before the user saves the script.

## When user asks "how do I enable this trigger"

Walk them through the 9 steps above in order, one at a time if needed. Give them their real webhook URL and secret to paste in step 3. Remind them: each form needs its own script/trigger, and they should submit the form once themselves to test it.
    
`
}

export const  nodeOutpusArray = Object.keys(nodeOutpus).map((e)=>{
  return {e:nodeOutpus[e as keyof typeof nodeOutpus]}
}).filter((e)=>e.e!==null)