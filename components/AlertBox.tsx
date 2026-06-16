import { XCircle, CheckCircle, WarningCircle } from "@phosphor-icons/react";

type AlertType = "error" | "success" | "warning";

const config = {
  error: {
    wrapper: "border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400",
    Icon: XCircle,
  },
  success: {
    wrapper: "border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400",
    Icon: CheckCircle,
  },
  warning: {
    wrapper: "border border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400",
    Icon: WarningCircle,
  },
};

export default function AlertBox({
  type,
  children,
  className = "",
}: {
  type: AlertType;
  children: React.ReactNode;
  className?: string;
}) {
  const { wrapper, Icon } = config[type];
  return (
    <div className={`${wrapper} rounded-lg p-3 m-2 text-sm font-medium flex items-start gap-2 ${className}`}>
      <Icon size={16} weight="bold" className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}
