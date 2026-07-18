export type NodeData<T> = {
  config: {
    name: string;
  };
  user_data: T;
};


export type WebhookData = {
  webhook_url: string;
};
