import { useState } from "react";
import { UploadCloud, Users, ShoppingCart } from "lucide-react";
import { ingestCustomers, ingestPurchases } from "@/api/client";

export default function DataIngestionPanel({ onSuccess }: { onSuccess: () => void }) {
  const [customersFile, setCustomersFile] = useState<File | null>(null);
  const [purchasesFile, setPurchasesFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleIngest = async () => {
    setLoading(true);
    try {
      if (customersFile) await ingestCustomers(customersFile);
      if (purchasesFile) await ingestPurchases(purchasesFile);
      onSuccess();
      alert("Data ingested successfully");
    } catch {
      alert("Ingestion failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
      <h3 className="text-sm font-semibold text-foreground tracking-wide">
        Data Ingestion
      </h3>

      {/* Upload Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Customers */}
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".json"
            hidden
            onChange={(e) => setCustomersFile(e.target.files?.[0] || null)}
          />
          <div className="h-full rounded-xl border border-border bg-secondary hover:bg-accent transition p-4 flex gap-4 items-center">
            <Users className="w-6 h-6 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Customers JSON</p>
              <p className="text-xs text-muted-foreground">
                {customersFile ? customersFile.name : "Upload customers.json"}
              </p>
            </div>
            <UploadCloud className="w-4 h-4 text-muted-foreground" />
          </div>
        </label>

        {/* Purchases */}
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".json"
            hidden
            onChange={(e) => setPurchasesFile(e.target.files?.[0] || null)}
          />
          <div className="h-full rounded-xl border border-border bg-secondary hover:bg-accent transition p-4 flex gap-4 items-center">
            <ShoppingCart className="w-6 h-6 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Purchases JSON</p>
              <p className="text-xs text-muted-foreground">
                {purchasesFile ? purchasesFile.name : "Upload purchases.json"}
              </p>
            </div>
            <UploadCloud className="w-4 h-4 text-muted-foreground" />
          </div>
        </label>
      </div>

      {/* CTA */}
      <button
        onClick={handleIngest}
        disabled={loading || (!customersFile && !purchasesFile)}
        className="w-full rounded-xl py-3 text-sm font-semibold 
                   bg-primary text-primary-foreground
                   hover:opacity-90 transition
                   disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? "Ingesting data…" : "Ingest Data"}
      </button>
    </div>
  );
}
