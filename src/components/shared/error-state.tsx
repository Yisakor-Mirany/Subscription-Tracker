import { AlertTriangle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ErrorState({
  title = "Something went wrong",
  description,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <Alert variant="destructive">
      <AlertTriangle />
      <AlertTitle>{title}</AlertTitle>
      {description && <AlertDescription>{description}</AlertDescription>}
    </Alert>
  );
}
