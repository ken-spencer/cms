import mongoose from "../db";

const { Schema } = mongoose;

const AuditLogSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      index: true,
    },
    message: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    href: String,
    ip: String,
    geo: {},
    userAgent: String,
    data: {},
  },
  { timestamps: true },
);

const AuditLog = mongoose.addModel("AuditLog", AuditLogSchema, {
  saveLog: false,
});

export default AuditLog;
