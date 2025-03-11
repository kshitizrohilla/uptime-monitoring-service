export default function StatusBadge({ status }) {
  let bgColor = "bg-gray-500";
  let text = "Unknown";

  if (status === "up") {
    bgColor = "bg-green-500";
    text = "Up";
  } else if (status === "down") {
    bgColor = "bg-red-500";
    text = "Down";
  } else if (status === "pending") {
    bgColor = "bg-yellow-500";
    text = "Pending";
  }

  return (
    <span className={`${bgColor} text-white text-xs px-2 py-1 rounded-full`}>
      {text}
    </span>
  );
}