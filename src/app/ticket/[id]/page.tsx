import { Suspense } from "react";
import TicketContent from "./TicketContent";
import { Leaf } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TicketPage({ params }: PageProps) {
  const resolvedParams = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-vegetal text-verde-profundo font-sans">
          <Leaf className="h-10 w-10 text-salvia animate-bounce mb-3" />
          <span className="text-sm font-semibold">Cargando ticket digital...</span>
        </div>
      }
    >
      <TicketContent id={resolvedParams.id} />
    </Suspense>
  );
}
