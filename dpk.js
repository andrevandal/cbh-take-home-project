import crypto from "crypto";
import consola from "consola";

export const TRIVIAL_PARTITION_KEY = "0";
export const MAX_PARTITION_KEY_LENGTH = 256;

export function createHash(data) {
  return crypto.createHash("sha3-512").update(data).digest("hex");
}

function createHashBasedOnEvent(event) {
  const { partitionKey } = event;
  if (partitionKey) {
    return typeof partitionKey !== "string"
      ? JSON.stringify(partitionKey)
      : partitionKey;
  }
  const data = JSON.stringify(event);
  return createHash(data);
}

export function deterministicPartitionKey(event) {
  const candidate = event ? createHashBasedOnEvent(event) : TRIVIAL_PARTITION_KEY;

  if (candidate.length <= MAX_PARTITION_KEY_LENGTH) {
    return candidate
  }
  return createHash(candidate)
}
