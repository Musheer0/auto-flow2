import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const steps = [
  { title: "Open your Google Form", description: "Go to the form you want to trigger this workflow from." },
  { title: "Open Apps Script", description: "Click the three dots (⋮) → Extensions → Apps Script." },
  { title: "Add the script", description: "Delete any existing code, paste the script below, then click Save." },
  { title: "Authorize the script", description: "Click Run once. Google will ask you to review and grant permissions — accept them." },
  { title: "Open Triggers", description: "In Apps Script, go to Triggers (clock icon) → Add trigger." },
  { title: "Set the function", description: "Function: onFormSubmit" },
  { title: "Set the event source", description: "Event source: Form" },
  { title: "Set the event type", description: "Event type: On form submit" },
  { title: "Save", description: "Click Save. New responses will now be sent to your workflow automatically." },
];

const script = `function onFormSubmit(e) {
  var WEBHOOK_URL = "YOUR_WEBHOOK_URL"; // paste the URL from this node
  var WEBHOOK_SECRET = "YOUR_WEBHOOK_SECRET"; // paste the secret from this node

  var answers = {};
  e.response.getItemResponses().forEach(function (item) {
    answers[item.getItem().getTitle()] = item.getResponse();
  });

  var payload = {
    formTitle: e.source.getTitle(),
    submittedAt: new Date().toISOString(),
    answers: answers,
  };

  UrlFetchApp.fetch(WEBHOOK_URL, {
    method: "post",
    contentType: "application/json",
    headers: { "x-webhook-secret": WEBHOOK_SECRET },
    payload: JSON.stringify(payload),
  });
}`;

export default function GoogleFormTriggerDocsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <div className="space-y-2">
        <Badge variant="secondary">Trigger</Badge>
        <h1 className="text-2xl font-semibold tracking-tight">Google Form trigger</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Starts this workflow whenever someone submits your Google Form.
          Google Forms has no native webhook support, so a small Apps Script
          sends each submission to your workflow instead.
        </p>
      </div>

      <Separator className="my-6" />

      <Card>
        <CardHeader>
          <CardTitle>How to connect</CardTitle>
          <CardDescription>Do this once per form.</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-3 text-sm">
                <span className="text-muted-foreground font-mono">{i + 1}.</span>
                <div>
                  <p className="font-medium">{step.title}</p>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Script to paste</CardTitle>
          <CardDescription>
            Replace <code className="font-mono">YOUR_WEBHOOK_URL</code> and{" "}
            <code className="font-mono">YOUR_WEBHOOK_SECRET</code> with the
            values shown on this node before saving.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted overflow-x-auto rounded-md p-4 text-xs">
            <code>{script}</code>
          </pre>
        </CardContent>
      </Card>

      <Card className="mt-6 border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Notes</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-1 text-sm">
          <p>Each form needs its own trigger — copying a form doesn't copy its Apps Script triggers.</p>
          <p>If you edit the form's questions, no changes are needed here; answers are sent by title automatically.</p>
          <p>Test it by submitting the form once yourself after setup.</p>
        </CardContent>
      </Card>
    </main>
  );
}