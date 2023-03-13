const { it, expect } = import.meta.vitest;
import crypto from "crypto"

import { deterministicPartitionKey, MAX_PARTITION_KEY_LENGTH, createHash } from "./dpk";


it("Returns the literal '0' when given no input", () => {
  const trivialKey = deterministicPartitionKey();
  expect(trivialKey).toBe("0");
});


it("return event partitionKey if exists and <= MAX_PARTITION_KEY_LENGTH", () => {
  const stubEvent = {
    partitionKey: 2
  }

  const trivialKey = deterministicPartitionKey(stubEvent);

  expect(trivialKey).toBe("2");
});

it("return a new hash if the candidate > MAX_PARTITION_KEY_LENGTH", () => {
  const stubEvent = {
    partitionKey: crypto.randomBytes(MAX_PARTITION_KEY_LENGTH + 1).toString('hex')
  }
  const trivialKey = deterministicPartitionKey(stubEvent);

  const expectedHash = createHash(stubEvent.partitionKey)
  
  expect(trivialKey).toBe(expectedHash);
});


it("return a new hash base on provided payload if there's no partitionKey attr", () => {
  const stubEvent = {
    foo: 'bar'
  }
  const trivialKey = deterministicPartitionKey(stubEvent);

  const expectedHash = createHash(JSON.stringify(stubEvent))

  expect(trivialKey).toBe(expectedHash);
});

it("return a hash based on a non-string parameter", () => {
  const stubEvent = {
    partitionKey: [{
      id: crypto.randomBytes(MAX_PARTITION_KEY_LENGTH).toString('hex')
    }]
  }
  const trivialKey = deterministicPartitionKey(stubEvent);

  const expectedHash = crypto.createHash("sha3-512").update(JSON.stringify(stubEvent.partitionKey)).digest("hex")

  expect(trivialKey).toBe(expectedHash);
});


