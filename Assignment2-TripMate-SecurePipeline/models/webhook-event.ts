import mongoose, { Schema, type Model } from "mongoose";
export interface WebhookEventDocument { eventId: string; type: string; createdAt: Date; payload: Record<string, unknown>; }
const schema = new Schema<WebhookEventDocument>({ eventId:{type:String,required:true,unique:true}, type:{type:String,required:true}, createdAt:{type:Date,required:true}, payload:{type:Schema.Types.Mixed,required:true} }, {collection:"webhook_events"});
export const WebhookEvent: Model<WebhookEventDocument> = (mongoose.models.WebhookEvent as Model<WebhookEventDocument>) || mongoose.model<WebhookEventDocument>("WebhookEvent", schema);
