const data ={"nodes":[{"id":"k6vt42t5nm25h2hswkdtr37h","type":"MANUAL_TRIGGER","position":{"x":-80,"y":29},"data":{}},{"id":"zpoxlhmncb555oh3w8x3smcj","type":"SEND_TELEGRAM_MESSAGE","position":{"x":34,"y":32.5},"data":{"config":{"name":"send-telegram-message"},"user_data":{"bot_token":"cmrqr4ehn00001lk4c1r2vwjo","chat_id":"ergerg","message":"hello"}}},{"id":"lm64ir741n3gemuss2p3fndi","type":"HTTP_REQUEST","position":{"x":159.5,"y":32},"data":{"config":{"name":"youtube-transcriber"},"user_data":{"url":"https://www.youtube.com/","method":"GET","headers":[],"body":"","query":[]}}},{"id":"h4xulak7492ysaee559jfx71","type":"SEND_TELEGRAM_MESSAGE","position":{"x":28.5,"y":-74.5},"data":{"config":{"name":"erger"},"user_data":{"bot_token":"cmrqr4ehn00001lk4c1r2vwjo","chat_id":"efrg","message":"gerg"}}},{"id":"zu4095516xugbtc87q2nqdih","type":"HTTP_REQUEST","position":{"x":585,"y":43},"data":{"config":{"name":"hh"},"user_data":{"url":"http://localhost:51212/#schema=public&table=workflow&view=table","method":"GET","headers":[],"body":"","query":[]}}},{"id":"ki8aw0qam4bv14c5tla2w0bb","type":"HTTP_REQUEST","position":{"x":197,"y":-80},"data":{"config":{"name":"2"},"user_data":{"url":"https://www.youtube.com/","method":"GET","headers":[],"body":"","query":[]}}},{"id":"k8pmswsx0q41gis8nmseo39b","type":"SEND_TELEGRAM_MESSAGE","position":{"x":324,"y":-144.754638671875},"data":{"config":{"name":"2t"},"user_data":{"bot_token":"cmrqr4ehn00001lk4c1r2vwjo","chat_id":"regerg","message":"rerrebv"}}},{"id":"krsgmsfr1g9n9j5doasfssr9","type":"HTTP_REQUEST","position":{"x":321.98089015006684,"y":-41.66701598908186},"data":{"config":{"name":"22"},"user_data":{"url":"https://www.youtube.com/","method":"GET","headers":[],"body":"","query":[]}}},{"id":"d8mt8qtmyy8qkybcfl4sshg6","type":"SEND_TELEGRAM_MESSAGE","position":{"x":424.5,"y":-111.5},"data":{"config":{"name":"ChatGpt"},"user_data":{"bot_token":"cmrqr4ehn00001lk4c1r2vwjo","chat_id":"efwe","message":"wefe"}}}],"edges":[{"id":"xy-edge__k6vt42t5nm25h2hswkdtr37h-zpoxlhmncb555oh3w8x3smcj","source":"k6vt42t5nm25h2hswkdtr37h","target":"zpoxlhmncb555oh3w8x3smcj"},{"id":"xy-edge__zpoxlhmncb555oh3w8x3smcj-lm64ir741n3gemuss2p3fndi","source":"zpoxlhmncb555oh3w8x3smcj","target":"lm64ir741n3gemuss2p3fndi"},{"id":"xy-edge__k6vt42t5nm25h2hswkdtr37h-h4xulak7492ysaee559jfx71","source":"k6vt42t5nm25h2hswkdtr37h","target":"h4xulak7492ysaee559jfx71"},{"id":"xy-edge__lm64ir741n3gemuss2p3fndi-zu4095516xugbtc87q2nqdih","source":"lm64ir741n3gemuss2p3fndi","target":"zu4095516xugbtc87q2nqdih"},{"id":"xy-edge__h4xulak7492ysaee559jfx71-ki8aw0qam4bv14c5tla2w0bb","source":"h4xulak7492ysaee559jfx71","target":"ki8aw0qam4bv14c5tla2w0bb"},{"id":"xy-edge__ki8aw0qam4bv14c5tla2w0bb-k8pmswsx0q41gis8nmseo39b","source":"ki8aw0qam4bv14c5tla2w0bb","target":"k8pmswsx0q41gis8nmseo39b"},{"id":"xy-edge__ki8aw0qam4bv14c5tla2w0bb-krsgmsfr1g9n9j5doasfssr9","source":"ki8aw0qam4bv14c5tla2w0bb","target":"krsgmsfr1g9n9j5doasfssr9"},{"id":"xy-edge__k8pmswsx0q41gis8nmseo39b-d8mt8qtmyy8qkybcfl4sshg6","source":"k8pmswsx0q41gis8nmseo39b","target":"d8mt8qtmyy8qkybcfl4sshg6"},{"id":"xy-edge__krsgmsfr1g9n9j5doasfssr9-d8mt8qtmyy8qkybcfl4sshg6","source":"krsgmsfr1g9n9j5doasfssr9","target":"d8mt8qtmyy8qkybcfl4sshg6"},{"id":"xy-edge__d8mt8qtmyy8qkybcfl4sshg6-zu4095516xugbtc87q2nqdih","source":"d8mt8qtmyy8qkybcfl4sshg6","target":"zu4095516xugbtc87q2nqdih"}]}

const triggerNodeId = "k6vt42t5nm25h2hswkdtr37h";

// --------------------------------------------------
// Helpers
// --------------------------------------------------

const getNode = (id: string) => data.nodes.find((n) => n.id === id)!;

const executeNode = async (id: string, context: Record<string, any>) => {
  const node = getNode(id);

  console.log(
    `Executing: ${node.data?.config?.name ?? node.type}`
  );

  // Simulate work
  await new Promise((r) => setTimeout(r, 500));

  return {
    success: true,
    node: node.data?.config?.name ?? node.type,
  };
};

// --------------------------------------------------
// Build Graph
// --------------------------------------------------

const outgoing = new Map<string, string[]>();
const indegree = new Map<string, number>();

for (const node of data.nodes) {
  outgoing.set(node.id, []);
  indegree.set(node.id, 0);
}

for (const edge of data.edges) {
  outgoing.get(edge.source)!.push(edge.target);

  indegree.set(
    edge.target,
    (indegree.get(edge.target) ?? 0) + 1
  );
}

// --------------------------------------------------
// Context
// --------------------------------------------------

const trigger = getNode(triggerNodeId);

const context: Record<string, any> = {
  [
    trigger.type === "MANUAL_TRIGGER"
      ? "manual"
      : trigger.data?.config?.name ?? trigger.type
  ]: "started",
};

// --------------------------------------------------
// Execution
// --------------------------------------------------

async function runWorkflow(triggerId: string) {
  const executed = new Set<string>();

  const queue: string[] = [triggerId];

  while (queue.length) {
    // Execute everything currently ready in parallel
    const batch = [...queue];
    queue.length = 0;

    await Promise.all(
      batch.map(async (id) => {
        if (executed.has(id)) return;

        const node = getNode(id);

        // Don't execute trigger
        if (node.type !== "MANUAL_TRIGGER") {
          const result = await executeNode(id, context);

          context[node.data?.config?.name ?? node.type] = result;
        }

        executed.add(id);

        // Unlock children
        for (const child of outgoing.get(id) ?? []) {
          indegree.set(
            child,
            indegree.get(child)! - 1
          );

          if (
            indegree.get(child) === 0 &&
            !executed.has(child)
          ) {
            queue.push(child);
          }
        }
      })
    );
  }

  console.log("\nWorkflow Finished\n");
  console.log(context);
}

runWorkflow(triggerNodeId);