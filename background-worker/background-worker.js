import BirthdayWorker from "./birthday-worker.js";

export function runWorkers(client, db) {
  let workerNames = ["birthday"];
  for (let workerName of workerNames) {
    runWorker(workerName, client, db);
  }
}

export function runWorker(name, client, db) {
  let worker = getWorker(name);
  if (worker) {
    let interval = setInterval(async () => {
      await worker.runInterval(interval, client, db);
    }, worker.interval);
  }
}

export function getWorker(name) {
  switch (name) {
    case "birthday":
      return BirthdayWorker;
    default:
      return null;
  }
}
