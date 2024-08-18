export const getPriorityEmoji = (task) => {
  const { due_date, priority, status } = task;
  const now = new Date();
  const entrega = new Date(due_date);
  const diasRestantes = Math.ceil((entrega - now) / (1000 * 60 * 60 * 24));

  const isEmpty = (value) => {
    return value === null || value === undefined || value === "";
  };

  if (isEmpty(due_date) && isEmpty(priority)) {
    return "⚠️";
  } else if (isEmpty(due_date)) {
    return "⚠️";
  } else if (isEmpty(priority)) {
    return "⚠️";
  } else if (status === 48) {
    return "✔️";
  } else if (entrega.getTime() === now.getTime() || diasRestantes === 0) {
    return "🔴";
  } else if (diasRestantes > 3) {
    return "🟢";
  } else if (entrega.getTime() < now.getTime() || diasRestantes < 0) {
    return "☠️";
  } else {
    return "🟡";
  }
};
