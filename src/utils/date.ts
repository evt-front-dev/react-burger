export const formatDate = (date: string): string => {
  const orderDate = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = orderDate.toDateString() === today.toDateString();
  const isYesterday = orderDate.toDateString() === yesterday.toDateString();

  const timeString = orderDate.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isToday) {
    return `Сегодня, ${timeString}`;
  } else if (isYesterday) {
    return `Вчера, ${timeString}`;
  } else {
    return `${orderDate.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
    })}, ${timeString}`;
  }
};
